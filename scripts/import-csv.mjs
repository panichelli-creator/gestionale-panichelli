import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import bcrypt from "bcryptjs";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

function readCsv(filePath) {
  const raw = fs.readFileSync(filePath);
  const text = raw.toString("latin1"); // i tuoi CSV spesso sono latin1
  return parse(text, {
    columns: true,
    delimiter: ";",
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
    trim: true,
  });
}

function parseDateAny(s) {
  if (!s) return null;
  const v = String(s).trim();
  if (!v || v === "00-00-00") return null;

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return new Date(v);

  // DD/MM/YYYY
  const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return new Date(`${m[3]}-${m[2]}-${m[1]}`);

  return null;
}

function norm(s) {
  if (!s) return "";
  return String(s).trim();
}

async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@panichellihsc.local";
  const pw = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return;
  const hash = await bcrypt.hash(pw, 10);
  await prisma.user.create({ data: { email, password: hash, name: "Admin" } });
  console.log("✅ Creato utente admin:", email);
}

async function ensureCatalogDefaults() {
  // Servizi base + medico del lavoro
  const services = ["DVR", "RX", "VSE", "LASER", "PRIVACY", "HACCP", "MEDICO DEL LAVORO"];
  for (const s of services) {
    await prisma.serviceCatalog.upsert({
      where: { name: s },
      update: {},
      create: { name: s },
    });
  }

  // Corsi base (modificabili in app poi)
  const courses = [
    ["Antincendio - Rischio Basso", "Formazione"],
    ["Antincendio - Rischio Medio", "Formazione"],
    ["Antincendio - Rischio Alto", "Formazione"],
    ["Primo Soccorso - Gruppo A", "Formazione"],
    ["Primo Soccorso - Gruppo BC", "Formazione"],
    ["BLSD", "Sanitario"],
    ["RLS < 50 dip.", "Formazione"],
    ["RLS > 50 dip.", "Formazione"],
    ["Formazione generale", "Formazione"],
    ["Formazione specifica - Rischio Basso", "Formazione"],
    ["Formazione specifica - Rischio Medio", "Formazione"],
    ["Formazione specifica - Rischio Alto", "Formazione"],
    ["Preposti", "Formazione"],
    ["RSPP Datore di Lavoro", "Formazione"],
    ["ECM", "Sanitario"],
    ["HACCP", "Alimentare"],
  ];

  for (const [name, category] of courses) {
    await prisma.courseCatalog.upsert({
      where: { name },
      update: {},
      create: { name, category },
    });
  }
}

async function upsertClientByName(name) {
  const n = norm(name);
  if (!n) return null;
  // Client.name è UNIQUE (nel nuovo schema), quindi upsert funziona.
  return prisma.client.upsert({
    where: { name: n },
    update: {},
    create: { name: n, type: "ALTRO" },
  });
}

async function upsertPersonFromRow(row) {
  // PERSONALE.csv ha colonne come: nome, cognome, codice fiscale, email, telefono, mansione, data assunzione, Azienda
  const fiscalCode = norm(row["codice fiscale"]) || null;
  const lastName = norm(row["cognome"]) || "Sconosciuto";
  const firstName = norm(row["nome"]) || "";
  const email = norm(row["email"]) || null;
  const phone = norm(row["telefono"]) || null;
  const role = norm(row["mansione"]) || null;
  const hireDate = parseDateAny(row["data assunzione"]);
  const company = norm(row["Azienda"]) || null;

  let clientId = null;
  if (company) {
    const c = await upsertClientByName(company);
    clientId = c?.id ?? null;
  }

  if (fiscalCode) {
    return prisma.person.upsert({
      where: { fiscalCode },
      update: { lastName, firstName, email, phone, role, hireDate, clientId },
      create: { fiscalCode, lastName, firstName, email, phone, role, hireDate, clientId },
    });
  }

  // Se manca CF, crea un record
  return prisma.person.create({
    data: { lastName, firstName, email, phone, role, hireDate, clientId },
  });
}

async function importPersonale(dataDir) {
  const p = path.join(dataDir, "PERSONALE.csv");
  if (!fs.existsSync(p)) {
    console.log("ℹ️ PERSONALE.csv non trovato in", dataDir);
    return;
  }
  const rows = readCsv(p);
  for (const row of rows) {
    await upsertPersonFromRow(row);
  }
  console.log("✅ Import PERSONALE:", rows.length);
}

async function ensureCourse(name, category = "Formazione") {
  return prisma.courseCatalog.upsert({
    where: { name },
    update: {},
    create: { name, category },
  });
}

async function findOrCreatePersonForTraining(row) {
  const fiscalCode = norm(row["codice fiscale"]) || null;
  const lastName = norm(row["cognome"]) || "Sconosciuto";
  const firstName = norm(row["nome"]) || "";
  const company = norm(row["Azienda"]) || null;

  let person = null;

  if (fiscalCode) {
    person = await prisma.person.findUnique({ where: { fiscalCode } });
    if (person) return person;
  }

  // SQLite: niente "mode: insensitive". Facciamo match semplice.
  if (lastName && firstName) {
    person = await prisma.person.findFirst({
      where: { lastName: { equals: lastName }, firstName: { equals: firstName } },
    });
    if (person) return person;
  }

  // Se non esiste, creiamo una persona minimale
  let clientId = null;
  if (company) {
    const c = await upsertClientByName(company);
    clientId = c?.id ?? null;
  }

  return prisma.person.create({
    data: { fiscalCode, lastName, firstName, clientId },
  });
}

function statusFromStatoItem(statoItem) {
  const s = norm(statoItem).toLowerCase();
  if (s.includes("valido")) return "SVOLTO";
  if (s.includes("scad")) return "DA_FARE";
  if (s.includes("non consegn")) return "DA_FARE";
  return "DA_FARE";
}

function certificateDeliveredFromStatoItem(statoItem) {
  const s = norm(statoItem).toLowerCase();
  return s.includes("valido");
}

async function importTrainingFile(dataDir, filename, courseName, category = "Formazione") {
  const p = path.join(dataDir, filename);
  if (!fs.existsSync(p)) {
    console.log("ℹ️ File non trovato:", filename);
    return;
  }

  const course = await ensureCourse(courseName, category);
  const rows = readCsv(p);

  let count = 0;
  for (const row of rows) {
    const person = await findOrCreatePersonForTraining(row);

    const performedAt = parseDateAny(row["data consegna"]);
    const dueDate = parseDateAny(row["data scadenza"]);
    const statoItem = row["stato item"];

    const status = statusFromStatoItem(statoItem);
    const certificateDelivered = certificateDeliveredFromStatoItem(statoItem);

    await prisma.trainingRecord.create({
      data: {
        personId: person.id,
        courseId: course.id,
        performedAt,
        dueDate,
        status,
        priority: "MEDIA",
        certificateDelivered,
      },
    });

    count++;
  }

  console.log(`✅ Import ${filename}: ${count}`);
}

async function main() {
  const dataDir = process.env.CSV_DIR || path.resolve("./data");
  console.log("CSV_DIR =", dataDir);

  await ensureAdmin();
  await ensureCatalogDefaults();

  await importPersonale(dataDir);

  await importTrainingFile(dataDir, "ANTINCENDIO BASSO.csv", "Antincendio - Rischio Basso");
  await importTrainingFile(dataDir, "ANTINCENDIO MEDIO.csv", "Antincendio - Rischio Medio");
  await importTrainingFile(dataDir, "ANTINCENDIO ALTO.csv", "Antincendio - Rischio Alto");
  await importTrainingFile(dataDir, "PRIMO SOCCORSO GRUPPO A.csv", "Primo Soccorso - Gruppo A");
  await importTrainingFile(dataDir, "PRIMO SOCCORSO GRUPPO BC.csv", "Primo Soccorso - Gruppo BC");
  await importTrainingFile(dataDir, "BLSD.csv", "BLSD", "Sanitario");
  await importTrainingFile(dataDir, "RLS MENO DI 50 DIP.csv", "RLS < 50 dip.");
  await importTrainingFile(dataDir, "RLS PIU' DI 50 DIP.csv", "RLS > 50 dip.");
  await importTrainingFile(dataDir, "GENERALE.csv", "Formazione generale");
  await importTrainingFile(dataDir, "SPEC. BASSO.csv", "Formazione specifica - Rischio Basso");
  await importTrainingFile(dataDir, "SPEC. MEDIO.csv", "Formazione specifica - Rischio Medio");
  await importTrainingFile(dataDir, "SPEC. ALTO.csv", "Formazione specifica - Rischio Alto");
  await importTrainingFile(dataDir, "PREPOSTI.csv", "Preposti");
  await importTrainingFile(dataDir, "RSPP DATORE DI LAVORO.csv", "RSPP Datore di Lavoro");

  console.log("✅ Import completato.");
}

main()
  .catch((e) => {
    console.error("❌ Import error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });