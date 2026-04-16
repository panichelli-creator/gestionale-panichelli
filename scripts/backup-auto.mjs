import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const DB_URL = process.env.DIRECT_URL;

if (!DB_URL) {
  console.error("❌ DIRECT_URL non trovata nelle env");
  process.exit(1);
}

const BACKUP_DIR =
  process.env.BACKUP_DIR ||
  path.join(os.homedir(), "Dropbox", "panichelli-backups");

function pad(n) {
  return String(n).padStart(2, "0");
}

function stamp() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )}_${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function cleanupOld(dir) {
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.startsWith("backup_") && f.endsWith(".sql"))
    .map((f) => {
      const p = path.join(dir, f);
      return { p, t: fs.statSync(p).mtimeMs };
    });

  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;

  for (const f of files) {
    if (f.t < cutoff) fs.unlinkSync(f.p);
  }
}

async function run() {
  ensureDir(BACKUP_DIR);

  const filename = `backup_auto_${stamp()}.sql`;
  const fullPath = path.join(BACKUP_DIR, filename);

  console.log("📦 Backup in corso...");
  console.log("📁 Destinazione:", fullPath);

  const pg = spawn(
    process.platform === "win32" ? "pg_dump.exe" : "pg_dump",
    [
      "--dbname",
      DB_URL,
      "--file",
      fullPath,
      "--format",
      "plain",
      "--no-owner",
      "--no-privileges",
      "--clean",
      "--if-exists",
    ],
    {
      stdio: "inherit",
      env: process.env,
    }
  );

  pg.on("close", (code) => {
    if (code !== 0) {
      console.error("❌ Errore backup");
      process.exit(1);
    }

    cleanupOld(BACKUP_DIR);

    console.log("✅ Backup completato");
    console.log("☁️ Dropbox sincronizzerà automaticamente");
  });
}

run();