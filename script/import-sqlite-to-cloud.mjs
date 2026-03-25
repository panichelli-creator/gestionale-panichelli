import "dotenv/config";
import Database from "better-sqlite3";
import pg from "pg";

const { Client } = pg;

const SQLITE_PATH = "prisma/backup.db";

const TABLES_IN_ORDER = [
  "User",
  "Client",
  "ClientContact",
  "ClientSite",
  "ServiceCatalog",
  "ClientService",
  "ClinicalEngineeringCheck",
  "Person",
  "PersonClient",
  "PersonSite",
  "CourseCatalog",
  "TrainingRecord",
  "ClientPractice",
  "WorkReport",
  "MapPlanItem",
];

const DELETE_IN_REVERSE = [...TABLES_IN_ORDER].reverse();

const DATE_COLUMNS = new Set([
  "createdAt",
  "updatedAt",
  "dismissedAt",
  "dueDate",
  "lastDoneAt",
  "practiceDate",
  "workedAt",
  "performedAt",
  "hireDate",
  "fatturataAt",
  "tecnicoFatturatoAt",
  "dataUltimoAppuntamento",
  "dataAppuntamentoPreso",
  "dataProssimoAppuntamento",
  "plannedDate",
]);

function q(name) {
  return `"${String(name).replace(/"/g, '""')}"`;
}

function looksLikeEpochMs(v) {
  return typeof v === "number" && Number.isFinite(v) && v > 100000000000;
}

function looksLikeEpochString(v) {
  if (typeof v !== "string") return false;
  if (!/^\d{12,17}$/.test(v.trim())) return false;
  const n = Number(v.trim());
  return Number.isFinite(n) && n > 100000000000;
}

function toIsoDateTime(value) {
  if (value == null || value === "") return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }

  if (looksLikeEpochMs(value)) {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }

  if (looksLikeEpochString(value)) {
    const d = new Date(Number(value.trim()));
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }

  if (typeof value === "string") {
    const s = value.trim();
    if (!s) return null;

    const d = new Date(s);
    if (!Number.isNaN(d.getTime())) return d.toISOString();

    return null;
  }

  return value;
}

function normalizeValue(column, value) {
  if (value === undefined) return null;
  if (value === null) return null;

  if (DATE_COLUMNS.has(column)) {
    return toIsoDateTime(value);
  }

  return value;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL mancante nel file .env");
  }

  const sqlite = new Database(SQLITE_PATH, { readonly: true });

  const pgClient = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await pgClient.connect();

  try {
    await pgClient.query("BEGIN");

    for (const table of DELETE_IN_REVERSE) {
      await pgClient.query(`DELETE FROM ${q(table)};`);
      console.log(`Svuotata tabella cloud: ${table}`);
    }

    for (const table of TABLES_IN_ORDER) {
      const rows = sqlite.prepare(`SELECT * FROM ${q(table)}`).all();

      if (!rows.length) {
        console.log(`Nessun record in ${table}`);
        continue;
      }

      for (const row of rows) {
        const columns = Object.keys(row);
        const values = columns.map((c) => normalizeValue(c, row[c]));
        const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

        const sql = `
          INSERT INTO ${q(table)} (${columns.map(q).join(", ")})
          VALUES (${placeholders});
        `;

        await pgClient.query(sql, values);
      }

      console.log(`Importati ${rows.length} record in ${table}`);
    }

    await pgClient.query("COMMIT");
    console.log("IMPORT COMPLETATO");
  } catch (err) {
    await pgClient.query("ROLLBACK");
    console.error("ERRORE IMPORT:");
    console.error(err);
    process.exitCode = 1;
  } finally {
    await pgClient.end();
    sqlite.close();
  }
}

main();