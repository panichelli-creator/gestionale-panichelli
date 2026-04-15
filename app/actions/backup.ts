"use server";

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";

const ROOT = process.cwd();
const BACKUP_DIR = path.join(ROOT, "backups");
const KEEP_DAYS = 7;

function requireAdmin() {
  const s = getSession();
  if (!s || s.role !== "admin") {
    throw new Error("Non autorizzato.");
  }
  return s;
}

function isVercelRuntime() {
  return (
    String(process.env.VERCEL ?? "").trim() === "1" ||
    String(process.env.VERCEL_ENV ?? "").trim() !== ""
  );
}

function ensureLocalBackupAllowed() {
  if (isVercelRuntime()) {
    throw new Error(
      "Backup locale non disponibile su Vercel. Usa backup esterno del database/Supabase."
    );
  }
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function stamp(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(
    d.getHours()
  )}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function dayStamp(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function exists(p: string) {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function safeUnlink(p: string) {
  try {
    fs.unlinkSync(p);
  } catch {}
}

function cleanupOld() {
  if (!exists(BACKUP_DIR)) return;

  const cutoff = Date.now() - KEEP_DAYS * 24 * 60 * 60 * 1000;

  const files = fs
    .readdirSync(BACKUP_DIR)
    .filter((f) => f.endsWith(".sql") && f.startsWith("backup_"))
    .map((f) => {
      const p = path.join(BACKUP_DIR, f);
      return { f, p, t: fs.statSync(p).mtimeMs };
    });

  for (const it of files) {
    if (it.t < cutoff) safeUnlink(it.p);
  }
}

function pickDbUrl() {
  const directUrl = String(process.env.DIRECT_URL ?? "").trim();
  const databaseUrl = String(process.env.DATABASE_URL ?? "").trim();
  const url = directUrl || databaseUrl;

  if (!url) {
    throw new Error("DIRECT_URL / DATABASE_URL non configurato.");
  }

  return url;
}

function pgDumpExecutable() {
  return process.platform === "win32" ? "pg_dump.exe" : "pg_dump";
}

function runPgDump(outputFile: string) {
  const dbUrl = pickDbUrl();

  const result = spawnSync(
    pgDumpExecutable(),
    [
      "--dbname",
      dbUrl,
      "--file",
      outputFile,
      "--format",
      "plain",
      "--no-owner",
      "--no-privileges",
      "--clean",
      "--if-exists",
    ],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        PGPASSWORD: "",
      },
    }
  );

  if (result.error) {
    throw new Error(
      "pg_dump non disponibile. Installa i client PostgreSQL oppure aggiungi pg_dump al PATH."
    );
  }

  if (result.status !== 0) {
    throw new Error(
      String(result.stderr || result.stdout || "Errore backup PostgreSQL").trim()
    );
  }
}

function todayAutomaticBackupName() {
  return `backup_auto_${dayStamp()}.sql`;
}

function hasAutomaticBackupForToday() {
  ensureDir(BACKUP_DIR);
  return exists(path.join(BACKUP_DIR, todayAutomaticBackupName()));
}

function createAutomaticBackupIfMissing() {
  ensureDir(BACKUP_DIR);

  if (hasAutomaticBackupForToday()) return null;

  const filename = todayAutomaticBackupName();
  const fullPath = path.join(BACKUP_DIR, filename);

  runPgDump(fullPath);
  cleanupOld();

  return filename;
}

export async function listBackups() {
  requireAdmin();

  if (isVercelRuntime()) {
    return [];
  }

  ensureDir(BACKUP_DIR);
  createAutomaticBackupIfMissing();

  const files = fs
    .readdirSync(BACKUP_DIR)
    .filter((f) => f.endsWith(".sql") && f.startsWith("backup_"))
    .map((f) => {
      const p = path.join(BACKUP_DIR, f);
      const st = fs.statSync(p);
      return {
        name: f,
        size: st.size,
        mtimeMs: st.mtimeMs,
        mtimeIso: new Date(st.mtimeMs).toISOString(),
      };
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs)
    .slice(0, 20);

  return files;
}

export async function backupNow() {
  requireAdmin();
  ensureLocalBackupAllowed();
  ensureDir(BACKUP_DIR);

  const filename = `backup_manual_${stamp()}.sql`;
  const fullPath = path.join(BACKUP_DIR, filename);

  runPgDump(fullPath);
  cleanupOld();

  revalidatePath("/backup");

  return { ok: true, filename };
}

export async function restoreBackup(formData: FormData) {
  requireAdmin();
  ensureLocalBackupAllowed();
  ensureDir(BACKUP_DIR);

  const filename = String(formData.get("filename") ?? "").trim();

  if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    throw new Error("Nome file non valido.");
  }

  const src = path.join(BACKUP_DIR, filename);

  if (!exists(src)) {
    throw new Error("Backup non trovato.");
  }

  throw new Error(
    "Ripristino automatico PostgreSQL non abilitato da interfaccia. Usa il file .sql scaricato per il restore manuale."
  );
}