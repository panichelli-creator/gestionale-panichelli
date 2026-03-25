import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// USO:
// node scripts/import-people-upsert.mjs            (usa PERSONALE.csv in root)
// node scripts/import-people-upsert.mjs "data\\PERSONALE.csv"  (usa percorso specifico)
const CSV_PATH = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve("PERSONALE.csv");

function readTextSmart(filePath) {
  const buf = fs.readFileSync(filePath);

  // UTF-16LE BOM
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) return buf.toString("utf16le");
  // UTF-8 BOM
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) return buf.toString("utf8");
  // fallback
  return buf.toString("utf8");
}

function detectDelimiter(headerLine) {
  const semi = (headerLine.match(/;/g) || []).length;
  const comma = (headerLine.match(/,/g) || []).length;
  return semi >= comma ? ";" : ",";
}

function parseCsv(text) {
  const clean = text.replace(/^\uFEFF/, "").replace(/\u0000/g, "");
  const lines = clean
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length);

  if (lines.length === 0) return { headers: [], rows: [] };

  const delim = detectDelimiter(lines[0]);
  const headers = lines[0].split(delim).map((h) => h.trim());

  const rows = lines.slice(1).map((line) => {
    const cols = line.split(delim);
    const obj = {};
    for (let i = 0; i < headers.length; i++) obj[headers[i]] = (cols[i] ?? "").trim();
    return obj;
  });

  return { headers, rows };
}

function norm(s) {
  return (s ?? "").trim();
}
function normUpper(s) {
  return norm(s).toUpperCase();
}

async function getOrCreateClientIdByName(name) {
  const n = norm(name);
  if (!n) return null;

  const existing = await prisma.client.findUnique({ where: { name: n }, select: { id: true } });
  if (existing) return existing.id;

  const created = await prisma.client.create({
    data: { name: n, status: "ATTIVO", type: "ALTRO" },
    select: { id: true },
  });
  return created.id;
}

async function upsertPerson(row) {
  const lastName = norm(row["cognome"] ?? row["Cognome"]);
  const firstName = norm(row["nome"] ?? row["Nome"]);
  if (!lastName || !firstName) return { action: "skip", reason: "missing name" };

  const cfRaw = normUpper(row["codice fiscale"] ?? row["Codice Fiscale"] ?? row["CF"]);
  const email = norm(row["email"] ?? row["Email"]) || null;
  const role = norm(row["mansione"] ?? row["Mansione"]) || null;

  const clientName = row["stabilimento"] ?? row["Azienda"] ?? row["Cliente"] ?? row["cliente"] ?? "";
  const clientId = await getOrCreateClientIdByName(clientName);

  // 1) CF presente -> UPSERT
  if (cfRaw) {
    const p = await prisma.person.upsert({
      where: { fiscalCode: cfRaw },
      create: { fiscalCode: cfRaw, lastName, firstName, email, role, clientId },
      update: {
        lastName,
        firstName,
        email: email ?? undefined,
        role: role ?? undefined,
        clientId: clientId ?? undefined,
      },
      select: { id: true },
    });
    return { action: "upsert_cf", id: p.id };
  }

  // 2) senza CF -> match per Nome+Cognome+Sede (come richiesto)
  const existing = await prisma.person.findFirst({
    where: { lastName, firstName, clientId: clientId ?? undefined },
    select: { id: true },
  });

  if (existing) {
    await prisma.person.update({
      where: { id: existing.id },
      data: {
        email: email ?? undefined,
        role: role ?? undefined,
      },
    });
    return { action: "update_name", id: existing.id };
  }

  const created = await prisma.person.create({
    data: { lastName, firstName, email, role, clientId },
    select: { id: true },
  });
  return { action: "create_name", id: created.id };
}

async function main() {
  if (!fs.existsSync(CSV_PATH)) {
    console.error("File non trovato:", CSV_PATH);
    process.exit(1);
  }

  const text = readTextSmart(CSV_PATH);
  const { headers, rows } = parseCsv(text);

  if (!headers.length) {
    console.error("CSV vuoto o non leggibile:", CSV_PATH);
    process.exit(1);
  }

  console.log("CSV:", CSV_PATH);
  console.log("Headers:", headers.join(" | "));
  console.log("Righe:", rows.length);

  let ok = 0,
    skip = 0;
  const stats = {};

  for (const r of rows) {
    const res = await upsertPerson(r);
    stats[res.action] = (stats[res.action] || 0) + 1;
    if (res.action === "skip") skip++;
    else ok++;
  }

  console.log("Import persone completato.");
  console.log("OK:", ok, "SKIP:", skip);
  console.log("Dettaglio:", stats);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
