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

/**
 * Normalizza header CSV:
 * - trim
 * - lowercase
 * - rimuove accenti
 * - sostituisce apostrofi/virgolette
 * - comprime spazi
 * - rimuove punteggiatura inutile
 */
function normHeader(raw: string) {
  const s = (raw ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // accenti
    .replace(/[’'"]/g, "") // apostrofi/virgolette
    .replace(/[^a-z0-9]+/g, " ") // tutto il resto -> spazio
    .replace(/\s+/g, " ")
    .trim();
  return s;
}

// CSV parser semplice (delimiter ; o ,)
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

/**
 * Dizionario sinonimi header -> chiave logica
 */
const HEADER_ALIASES: Record<
  | "lastName"
  | "firstName"
  | "fiscalCode"
  | "clientName"
  | "email"
  | "phone"
  | "role"
  | "hireDate"
  | "fitnessJudgement",
  string[]
> = {
  lastName: ["cognome", "cognome dipendente", "surname"],
  firstName: ["nome", "nome dipendente", "name"],
  fiscalCode: [
    "codice fiscale",
    "codice fisc",
    "codice fis",
    "cf",
    "codicefiscale",
    "fiscal code",
  ],
  clientName: ["azienda", "cliente", "societa", "ragione sociale", "company"],
  email: ["email", "e mail", "mail", "posta", "posta elettronica"],
  phone: ["telefono", "tel", "cellulare", "cell", "mobile"],
  role: ["mansione", "ruolo", "qualifica", "inquadramento", "profilo"],
  hireDate: ["data assunzione", "data assu", "assunzione", "data ass", "hire date"],
  fitnessJudgement: ["giudizio di idoneita", "giudizio idoneita", "idoneita", "giudizio"],
};

function buildIndex(headersRow: string[]) {
  const idxByHeader = new Map<string, number>();
  headersRow.forEach((h, i) => idxByHeader.set(normHeader(h), i));

  const idxByLogicalKey = new Map<keyof typeof HEADER_ALIASES, number>();

  (Object.keys(HEADER_ALIASES) as (keyof typeof HEADER_ALIASES)[]).forEach((logical) => {
    for (const alias of HEADER_ALIASES[logical]) {
      const i = idxByHeader.get(normHeader(alias));
      if (i !== undefined) {
        idxByLogicalKey.set(logical, i);
        break;
      }
    }
  });

  return idxByLogicalKey;
}

function getByLogical(row: string[], idx: Map<string, number>, logical: keyof typeof HEADER_ALIASES) {
  const i = idx.get(logical as any);
  if (i === undefined) return "";
  return row[i] ?? "";
}

function isEmptyOrPlaceholderCompany(raw: string) {
  const s = norm(raw);
  if (!s) return true;

  const u = s.trim().toUpperCase();

  if (
    u === "-" ||
    u === "—" ||
    u === "N/A" ||
    u === "NA" ||
    u === "NESSUNA" ||
    u === "NULL" ||
    u === "0" ||
    u === "NON DISPONIBILE"
  ) {
    return true;
  }

  // ✅ evita default “Panichelli”
  if (u.includes("PANICHELLI")) return true;

  return false;
}

export async function importPeopleFromCsv(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("Nessun file selezionato.");

  const text = await file.text();
  const delim = detectDelimiter(text);
  const table = parseCSV(text, delim);

  if (table.length < 2) throw new Error("CSV vuoto o senza righe dati.");

  const headersRow = table[0] ?? [];
  const rows = table.slice(1);

  const idx = buildIndex(headersRow);

  // cache clienti per nome
  const clientCache = new Map<string, string>();

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const r of rows) {
    const lastName = norm(getByLogical(r, idx as any, "lastName"));
    const firstName = norm(getByLogical(r, idx as any, "firstName"));
    const fiscalCode = upper(getByLogical(r, idx as any, "fiscalCode"));

    const clientNameRaw = norm(getByLogical(r, idx as any, "clientName"));
    const email = norm(getByLogical(r, idx as any, "email")) || null;
    const phone = norm(getByLogical(r, idx as any, "phone")) || null;
    const role = norm(getByLogical(r, idx as any, "role")) || null;
    const hireDate = toISODateMaybe(getByLogical(r, idx as any, "hireDate"));

    const giudizio = upper(getByLogical(r, idx as any, "fitnessJudgement"));
    const medicalCheckDone = giudizio !== "" && !giudizio.includes("NESSUNA VISITA");

    if (!lastName || !firstName) {
      skipped++;
      continue;
    }

    // ✅ azienda valida oppure niente
    const clientName = isEmptyOrPlaceholderCompany(clientNameRaw) ? "" : clientNameRaw;

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

    // ✅ SE HO CF: update/insert idempotente
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
            hireDate,
            medicalCheckDone,
            ...(clientId ? { clientId } : {}), // ✅ setta solo se valido
          },
        });
        updated++;
      } else {
        await prisma.person.create({
          data: {
            lastName,
            firstName,
            fiscalCode,
            email,
            phone,
            role,
            hireDate,
            medicalCheckDone,
            clientId,
          },
        });
        created++;
      }

      continue;
    }

    // ✅ SENZA CF: match su nome+cognome (NON su cliente) => niente duplicati quando cambia azienda
    const existingNoCf = await prisma.person.findFirst({
      where: {
        fiscalCode: null,
        lastName,
        firstName,
      },
      select: { id: true },
    });

    if (existingNoCf) {
      await prisma.person.update({
        where: { id: existingNoCf.id },
        data: {
          email,
          phone,
          role,
          hireDate,
          medicalCheckDone,
          ...(clientId ? { clientId } : {}), // ✅ setta solo se valido
        },
      });
      updated++;
      continue;
    }

    await prisma.person.create({
      data: {
        lastName,
        firstName,
        email,
        phone,
        role,
        hireDate,
        medicalCheckDone,
        clientId,
      },
    });
    created++;
  }

  revalidatePath("/people");
  revalidatePath("/clients");
  revalidatePath("/dashboard");
  revalidatePath("/import-export");

  return { created, updated, skipped };
}