"use server";

import fs from "node:fs";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";

const ROOT = process.cwd();
const DB_PATH = path.join(ROOT, "prisma", "dev.db");
const BACKUP_DIR = path.join(ROOT, "backups");
const KEEP_DAYS = 7;

function requireAdmin() {
  const s = getSession();
  if (!s || s.role !== "admin") {
    throw new Error("Non autorizzato.");
  }
  return s;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function stamp(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(
    d.getHours()
  )}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
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

function copyIfExists(src: string, dst: string) {
  if (exists(src)) {
    fs.copyFileSync(src, dst);
    return true;
  }
  return false;
}

function cleanupOld() {
  if (!exists(BACKUP_DIR)) return;

  const cutoff = Date.now() - KEEP_DAYS * 24 * 60 * 60 * 1000;

  const files = fs
    .readdirSync(BACKUP_DIR)
    .filter((f) => f.startsWith("dev_"))
    .map((f) => {
      const p = path.join(BACKUP_DIR, f);
      return { f, p, t: fs.statSync(p).mtimeMs };
    });

  for (const it of files) {
    if (it.t < cutoff) safeUnlink(it.p);
  }
}

export async function listBackups() {
  requireAdmin();
  ensureDir(BACKUP_DIR);

  const files = fs
    .readdirSync(BACKUP_DIR)
    .filter((f) => f.endsWith(".db") && f.startsWith("dev_"))
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
  ensureDir(BACKUP_DIR);

  if (!exists(DB_PATH)) {
    throw new Error(`DB non trovato: ${DB_PATH}`);
  }

  const tag = stamp();
  const baseName = `dev_${tag}`;
  const destDb = path.join(BACKUP_DIR, `${baseName}.db`);

  // prova a chiudere connessioni prisma
  try {
    await prisma.$disconnect();
  } catch {}

  fs.copyFileSync(DB_PATH, destDb);

  // WAL/SHM (se presenti)
  copyIfExists(`${DB_PATH}-wal`, path.join(BACKUP_DIR, `${baseName}.db-wal`));
  copyIfExists(`${DB_PATH}-shm`, path.join(BACKUP_DIR, `${baseName}.db-shm`));

  cleanupOld();

  revalidatePath("/backup");
  return { ok: true, filename: `${baseName}.db` };
}

export async function restoreBackup(formData: FormData) {
  requireAdmin();
  ensureDir(BACKUP_DIR);

  const filename = String(formData.get("filename") ?? "");

  if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    throw new Error("Nome file non valido.");
  }

  const srcDb = path.join(BACKUP_DIR, filename);
  if (!exists(srcDb)) {
    throw new Error("Backup non trovato.");
  }

  try {
    await prisma.$disconnect();
  } catch {}

  safeUnlink(`${DB_PATH}-wal`);
  safeUnlink(`${DB_PATH}-shm`);

  fs.copyFileSync(srcDb, DB_PATH);

  const wal = srcDb.replace(/\.db$/, ".db-wal");
  const shm = srcDb.replace(/\.db$/, ".db-shm");
  if (exists(wal)) fs.copyFileSync(wal, `${DB_PATH}-wal`);
  if (exists(shm)) fs.copyFileSync(shm, `${DB_PATH}-shm`);

  revalidatePath("/backup");
  revalidatePath("/dashboard");
  revalidatePath("/clients");
  revalidatePath("/people");
  revalidatePath("/training");
  revalidatePath("/maintenance");
  revalidatePath("/import-export");

  return { ok: true, restored: filename };
}