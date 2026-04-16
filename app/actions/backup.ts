"use server";

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";

const KEEP_DAYS = 7;
const DROPBOX_BACKUP_DIR = "/panichelli-backups";

type BackupRow = {
  name: string;
  size: number;
  mtimeMs: number;
  mtimeIso: string;
};

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

function getLocalBackupDir() {
  const customDir = String(process.env.BACKUP_DIR ?? "").trim();
  if (customDir) return customDir;

  const home = os.homedir();
  return path.join(home, "Documents", "PanichelliBackups");
}

const BACKUP_DIR = getLocalBackupDir();

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
      return { p, t: fs.statSync(p).mtimeMs };
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

function getDropboxToken() {
  return String(process.env.DROPBOX_ACCESS_TOKEN ?? "").trim();
}

function hasDropboxToken() {
  return !!getDropboxToken();
}

function ensureDropboxConfigured() {
  if (!hasDropboxToken()) {
    throw new Error("DROPBOX_ACCESS_TOKEN non configurato.");
  }
}

async function dropboxUpload(localFilePath: string, remoteFilename: string) {
  ensureDropboxConfigured();

  const token = getDropboxToken();
  const fileBuffer = fs.readFileSync(localFilePath);
  const dropboxPath = `${DROPBOX_BACKUP_DIR}/${remoteFilename}`;

  const res = await fetch("https://content.dropboxapi.com/2/files/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/octet-stream",
      "Dropbox-API-Arg": JSON.stringify({
        path: dropboxPath,
        mode: "overwrite",
        autorename: false,
        mute: true,
        strict_conflict: false,
      }),
    },
    body: fileBuffer,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Errore upload Dropbox: ${txt || res.statusText}`);
  }

  return dropboxPath;
}

async function listDropboxBackups(): Promise<BackupRow[]> {
  ensureDropboxConfigured();

  const token = getDropboxToken();
  const rows: BackupRow[] = [];
  let cursor: string | null = null;
  let hasMore = true;

  while (hasMore) {
    const url = cursor
      ? "https://api.dropboxapi.com/2/files/list_folder/continue"
      : "https://api.dropboxapi.com/2/files/list_folder";

    const body = cursor
      ? { cursor }
      : {
          path: DROPBOX_BACKUP_DIR,
          recursive: false,
          include_deleted: false,
          include_has_explicit_shared_members: false,
          include_mounted_folders: true,
          include_non_downloadable_files: false,
        };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const txt = await res.text();

      if (!cursor && txt.includes("path/not_found")) {
        return [];
      }

      throw new Error(`Errore lista Dropbox: ${txt || res.statusText}`);
    }

    const json = (await res.json()) as {
      entries?: Array<{
        name?: string;
        size?: number;
        server_modified?: string;
        ".tag"?: string;
      }>;
      has_more?: boolean;
      cursor?: string;
    };

    for (const entry of json.entries ?? []) {
      if (entry?.[".tag"] !== "file") continue;

      const name = String(entry.name ?? "").trim();
      if (!name.endsWith(".sql") || !name.startsWith("backup_")) continue;

      const serverModified = String(entry.server_modified ?? "").trim();
      const mtimeMs = serverModified ? new Date(serverModified).getTime() : Date.now();

      rows.push({
        name,
        size: Number(entry.size ?? 0),
        mtimeMs,
        mtimeIso: new Date(mtimeMs).toISOString(),
      });
    }

    hasMore = Boolean(json.has_more);
    cursor = json.cursor ?? null;
  }

  return rows.sort((a, b) => b.mtimeMs - a.mtimeMs).slice(0, 20);
}

async function uploadToDropboxIfConfigured(localFilePath: string, filename: string) {
  if (!hasDropboxToken()) return null;
  await dropboxUpload(localFilePath, filename);
  return filename;
}

async function createAutomaticBackupIfMissing() {
  ensureDir(BACKUP_DIR);

  if (hasAutomaticBackupForToday()) return null;

  const filename = todayAutomaticBackupName();
  const fullPath = path.join(BACKUP_DIR, filename);

  runPgDump(fullPath);
  cleanupOld();
  await uploadToDropboxIfConfigured(fullPath, filename);

  return filename;
}

function listLocalBackups(): BackupRow[] {
  ensureDir(BACKUP_DIR);

  return fs
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
}

export async function listBackups() {
  requireAdmin();

  if (isVercelRuntime()) {
    if (!hasDropboxToken()) return [];
    return await listDropboxBackups();
  }

  await createAutomaticBackupIfMissing();
  return listLocalBackups();
}

export async function backupNow() {
  requireAdmin();

  if (isVercelRuntime()) {
    throw new Error(
      "Backup manuale non disponibile su Vercel: pg_dump non è eseguibile nell'ambiente serverless. Esegui il backup da locale oppure usa un job esterno."
    );
  }

  ensureDir(BACKUP_DIR);

  const filename = `backup_manual_${stamp()}.sql`;
  const fullPath = path.join(BACKUP_DIR, filename);

  runPgDump(fullPath);
  cleanupOld();
  await uploadToDropboxIfConfigured(fullPath, filename);

  revalidatePath("/backup");

  return {
    ok: true,
    filename,
    fullPath,
    backupDir: BACKUP_DIR,
  };
}

export async function restoreBackup(formData: FormData) {
  requireAdmin();

  if (isVercelRuntime()) {
    throw new Error(
      "Ripristino non disponibile da Vercel. Usa un restore manuale dal file .sql."
    );
  }

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
    "Ripristino automatico PostgreSQL non abilitato da interfaccia. Usa il file .sql per il restore manuale."
  );
}