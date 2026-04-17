import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const DB_URL = process.env.DIRECT_URL || process.env.DATABASE_URL;
const DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN || "";
const DROPBOX_BACKUP_DIR = "/panichelli-backups";
const DROPBOX_COMMANDS_DIR = `${DROPBOX_BACKUP_DIR}/_commands`;

if (!DB_URL) {
  console.error("❌ DIRECT_URL / DATABASE_URL non trovata");
  process.exit(1);
}

const BACKUP_DIR =
  process.env.BACKUP_DIR || path.join(os.homedir(), "Dropbox", "panichelli-backups");

function pad(n) {
  return String(n).padStart(2, "0");
}

function stamp() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(
    d.getHours()
  )}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
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

function runCommand(bin, args) {
  const result = spawnSync(bin, args, {
    encoding: "utf8",
    env: process.env,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(String(result.stderr || result.stdout || "Errore comando").trim());
  }
}

function createBackupNow(reason = "manual") {
  ensureDir(BACKUP_DIR);

  const filename = `backup_${reason}_${stamp()}.sql`;
  const fullPath = path.join(BACKUP_DIR, filename);

  console.log("📦 Backup in corso...");
  console.log("📁 Destinazione:", fullPath);

  runCommand(process.platform === "win32" ? "pg_dump.exe" : "pg_dump", [
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
  ]);

  cleanupOld(BACKUP_DIR);

  console.log("✅ Backup completato");
  return { filename, fullPath };
}

function restoreBackupNow(filename) {
  ensureDir(BACKUP_DIR);

  const fullPath = path.join(BACKUP_DIR, filename);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Backup non trovato in locale: ${filename}`);
  }

  console.log("♻️ Ripristino in corso...", fullPath);

  runCommand(process.platform === "win32" ? "psql.exe" : "psql", [
    "--dbname",
    DB_URL,
    "--file",
    fullPath,
    "-v",
    "ON_ERROR_STOP=1",
  ]);

  console.log("✅ Ripristino completato");
}

async function dropboxListFolder(pathValue) {
  if (!DROPBOX_ACCESS_TOKEN) return [];

  const res = await fetch("https://api.dropboxapi.com/2/files/list_folder", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${DROPBOX_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      path: pathValue,
      recursive: false,
      include_deleted: false,
      include_has_explicit_shared_members: false,
      include_mounted_folders: true,
      include_non_downloadable_files: false,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    if (txt.includes("path/not_found")) return [];
    throw new Error(`Dropbox list error: ${txt || res.statusText}`);
  }

  const json = await res.json();
  return Array.isArray(json.entries) ? json.entries : [];
}

async function dropboxDownload(remotePath) {
  if (!DROPBOX_ACCESS_TOKEN) throw new Error("DROPBOX_ACCESS_TOKEN mancante");

  const res = await fetch("https://content.dropboxapi.com/2/files/download", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${DROPBOX_ACCESS_TOKEN}`,
      "Dropbox-API-Arg": JSON.stringify({ path: remotePath }),
    },
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Dropbox download error: ${txt || res.statusText}`);
  }

  return Buffer.from(await res.arrayBuffer());
}

async function dropboxDelete(remotePath) {
  if (!DROPBOX_ACCESS_TOKEN) return;

  await fetch("https://api.dropboxapi.com/2/files/delete_v2", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${DROPBOX_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ path: remotePath }),
  });
}

async function processDropboxCommands() {
  if (!DROPBOX_ACCESS_TOKEN) {
    console.log("ℹ️ Nessun token Dropbox: salto lettura comandi");
    return;
  }

  const entries = await dropboxListFolder(DROPBOX_COMMANDS_DIR);
  const commandFiles = entries
    .filter((e) => e[".tag"] === "file" && String(e.name || "").endsWith(".json"))
    .sort((a, b) => {
      const at = new Date(a.server_modified || 0).getTime();
      const bt = new Date(b.server_modified || 0).getTime();
      return at - bt;
    });

  for (const entry of commandFiles) {
    const remotePath = entry.path_lower || entry.path_display;
    if (!remotePath) continue;

    try {
      const buffer = await dropboxDownload(remotePath);
      const cmd = JSON.parse(buffer.toString("utf8"));

      if (cmd.action === "CREATE_BACKUP") {
        createBackupNow("manual");
      } else if (cmd.action === "RESTORE_BACKUP" && cmd.filename) {
        restoreBackupNow(String(cmd.filename));
      }

      await dropboxDelete(remotePath);
      console.log("✅ Comando eseguito:", cmd.action);
    } catch (e) {
      console.error("❌ Errore comando Dropbox:", e?.message || e);
    }
  }
}

async function main() {
  const onlyCommands = process.argv.includes("--process-commands");

  if (!onlyCommands) {
    createBackupNow("auto");
  }

  await processDropboxCommands();
}

main().catch((e) => {
  console.error("❌", e?.message || e);
  process.exit(1);
});