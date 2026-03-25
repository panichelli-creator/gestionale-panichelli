"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function norm(s: string) {
  return (s ?? "").trim();
}

function upper(s: string) {
  const v = norm(s);
  return v ? v.toUpperCase() : "";
}

function normHeader(raw: string) {
  const s = (raw ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’'"]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return s;
}

function parseCSV(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let cur = "";
  let inQuotes = false;
  const row: string[] = [];

  function pushCell() {
    row.push(cur);
    cur = "";
  }

  function pushRow() {
    if (row.length > 1 || (row.length === 1 && norm(row[0]) !== "")) {
      rows.push([...row]);
    }
    row.length = 0;
  }

  for (let i = 0; i < text.length; i++) {
    const c = text[i];

    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && (c === "\n" || c === "\r")) {
      if (c === "\r" && text[i + 1] === "\n") i++;
      pushCell();
      pushRow();
      continue;
    }

    if (!inQuotes && c === delimiter) {
      pushCell();
      continue;
    }

    cur += c;
  }

  pushCell();
  pushRow();

  return rows;
}

function detectDelimiter(text: string) {
  const head = text.slice(0, 2000);
  const semi = (head.match(/;/g) ?? []).length;
  const comma = (head.match(/,/g) ?? []).length;
  return semi >= comma ? ";" : ",";
}

function toISODateMaybe(v: string): Date | null {
  const s = norm(v);
  if (!s) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }

  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) {
    const dd = Number(m[1]);
    const mm = Number(m[2]);
    const yy = Number(m[3]);
    const d = new Date(yy, mm - 1, dd);
    return isNaN(d.getTime()) ? null : d;
  }

  return null;
}

function mapStatus(raw: string): string {
  const s = upper(raw);
  if (!s) return "DA_FARE";
  if (s.includes("IN SCAD")) return "IN_SCADENZA";
  if (s.includes("SCAD")) return "SCADUTO";
  if (s.includes("VALID")) return "VALIDO";
  if (s.includes("OK")) return "VALIDO";
  return "DA_FARE";
}

const TRAINING_ALIASES: Record<
  | "lastName"
  | "firstName"
  | "fiscalCode"
  | "clientName"
  | "email"
  | "phone"
  | "role"
  | "performedAt"
  | "dueDate"
  | "note"
  | "statusItem"
  | "statusPerson"
  | "qualification",
  string[]
> = {
  lastName: ["cognome", "surname"],
  firstName: ["nome", "name"],
  fiscalCode: ["codice fiscale", "codice fisc", "cf", "codicefiscale"],
  clientName: ["azienda", "cliente", "societa", "ragione sociale", "company"],
  email: ["email", "mail", "e mail", "posta elettronica"],
  phone: ["telefono", "tel", "cellulare", "cell", "mobile"],
  role: ["mansione", "ruolo", "qualifica", "inquadramento", "profilo"],
  performedAt: ["data consegna", "data corso", "data formazione", "data"],
  dueDate: ["data scadenza", "scadenza", "data scad"],
  note: ["nota", "note", "annotazioni"],
  statusItem: ["stato item", "stato", "esito"],
  statusPerson: ["stato pers", "stato persona"],
  qualification: ["qualifica"],
};

function buildIndex(headersRow: string[]) {
  const idxByHeader = new Map<string, number>();
  headersRow.forEach((h, i) => idxByHeader.set(normHeader(h), i));

  const idxByLogicalKey = new Map<keyof typeof TRAINING_ALIASES, number>();

  (Object.keys(TRAINING_ALIASES) as (keyof typeof TRAINING_ALIASES)[]).forEach((logical) => {
    for (const alias of TRAINING_ALIASES[logical]) {
      const i = idxByHeader.get(normHeader(alias));
      if (i !== undefined) {
        idxByLogicalKey.set(logical, i);
        break;
      }
    }
  });

  return idxByLogicalKey;
}

function getByLogical(
  row: string[],
  idx: Map<string, number>,
  logical: keyof typeof TRAINING_ALIASES
) {
  const i = idx.get(logical as any);
  if (i === undefined) return "";
  return row[i] ?? "";
}

/**
 * Import generico corsi:
 * - upsert Client su "Azienda" (se presente)
 * - upsert Person per CF (se presente) altrimenti match su nome+cognome+cliente
 * - upsert CourseCatalog per courseName
 * - crea/aggiorna TrainingRecord su chiave unica (personId + courseId)
 */
export async function importTrainingFromCsv(courseName: string, formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("Nessun file selezionato.");

  const text = await file.text();
  const delim = detectDelimiter(text);
  const table = parseCSV(text, delim);

  if (table.length < 2) throw new Error("CSV vuoto o senza righe dati.");

  const headersRow = table[0] ?? [];
  const rows = table.slice(1);
  const idx = buildIndex(headersRow);

  const course = await prisma.courseCatalog.upsert({
    where: { name: courseName },
    create: { name: courseName, isActive: true },
    update: { isActive: true },
    select: { id: true },
  });

  const clientCache = new Map<string, string>();

  let createdPeople = 0;
  let updatedPeople = 0;
  let createdTraining = 0;
  let updatedTraining = 0;
  let skipped = 0;

  for (const r of rows) {
    const lastName = norm(getByLogical(r, idx as any, "lastName"));
    const firstName = norm(getByLogical(r, idx as any, "firstName"));
    const fiscalCode = upper(getByLogical(r, idx as any, "fiscalCode"));

    const clientName = norm(getByLogical(r, idx as any, "clientName"));
    const email = norm(getByLogical(r, idx as any, "email")) || null;
    const phone = norm(getByLogical(r, idx as any, "phone")) || null;
    const role = norm(getByLogical(r, idx as any, "role")) || null;

    const performedAt = toISODateMaybe(getByLogical(r, idx as any, "performedAt"));
    const dueDate = toISODateMaybe(getByLogical(r, idx as any, "dueDate"));

    const note = norm(getByLogical(r, idx as any, "note")) || null;
    const statusItem = norm(getByLogical(r, idx as any, "statusItem"));
    const status = mapStatus(statusItem);

    if (!lastName || !firstName) {
      skipped++;
      continue;
    }

    let clientId: string | null = null;
    if (clientName) {
      const key = clientName.trim();
      const cached = clientCache.get(key);
      if (cached) {
        clientId = cached;
      } else {
        const c = await prisma.client.upsert({
          where: { name: key },
          create: { name: key },
          update: {},
          select: { id: true },
        });
        clientId = c.id;
        clientCache.set(key, c.id);
      }
    }

    let personId: string;

    if (fiscalCode) {
      const existing = await prisma.person.findUnique({
        where: { fiscalCode },
        select: { id: true },
      });

      if (existing) {
        await prisma.person.update({
          where: { id: existing.id },
          data: {
            lastName,
            firstName,
            email,
            phone,
            role,
            clientId,
          },
        });
        personId = existing.id;
        updatedPeople++;
      } else {
        const p = await prisma.person.create({
          data: {
            lastName,
            firstName,
            fiscalCode,
            email,
            phone,
            role,
            clientId,
          },
          select: { id: true },
        });
        personId = p.id;
        createdPeople++;
      }
    } else {
      const existingNoCf = await prisma.person.findFirst({
        where: {
          fiscalCode: null,
          lastName,
          firstName,
          clientId: clientId ?? null,
        },
        select: { id: true },
      });

      if (existingNoCf) {
        await prisma.person.update({
          where: { id: existingNoCf.id },
          data: { email, phone, role, clientId },
        });
        personId = existingNoCf.id;
        updatedPeople++;
      } else {
        const p = await prisma.person.create({
          data: { lastName, firstName, email, phone, role, clientId },
          select: { id: true },
        });
        personId = p.id;
        createdPeople++;
      }
    }

    const existingTr = await prisma.trainingRecord.findUnique({
      where: {
        personId_courseId: {
          personId,
          courseId: course.id,
        },
      },
      select: { id: true },
    });

    if (existingTr) {
      await prisma.trainingRecord.update({
        where: { id: existingTr.id },
        data: {
          performedAt,
          dueDate,
          status,
          notes: note,
        },
      });
      updatedTraining++;
    } else {
      await prisma.trainingRecord.create({
        data: {
          personId,
          courseId: course.id,
          performedAt,
          dueDate,
          status,
          notes: note,
        },
      });
      createdTraining++;
    }
  }

  revalidatePath("/training");
  revalidatePath("/people");
  revalidatePath("/clients");
  revalidatePath("/dashboard");
  revalidatePath("/import-export");

  return {
    courseName,
    createdPeople,
    updatedPeople,
    createdTraining,
    updatedTraining,
    skipped,
  };
}