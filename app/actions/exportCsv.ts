"use server";

import { prisma } from "@/lib/prisma";

type CsvValue = string | number | boolean | Date | null | undefined;

function csvEscape(value: CsvValue) {
  if (value === null || value === undefined) return "";
  const s = value instanceof Date ? value.toISOString() : String(value);
  const needsQuotes = /[;"\n\r]/.test(s);
  const escaped = s.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

function toCsv<T>(rows: T[], headers: string[], mapper: (r: T) => any[]) {
  const head = headers.map((h) => csvEscape(h)).join(";");
  const body = rows
    .map((r) => mapper(r).map((v) => csvEscape(v)).join(";"))
    .join("\n");
  return head + "\n" + body + "\n";
}

export async function exportPeopleCsv() {
  const rows = await prisma.person.findMany({
    include: { client: true },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });

  const csv = toCsv(
    rows,
    ["Cognome", "Nome", "CodiceFiscale", "Email", "Telefono", "Ruolo", "Azienda"],
    (p) => [p.lastName, p.firstName, p.fiscalCode ?? "", p.email ?? "", p.phone ?? "", p.role ?? "", p.client?.name ?? ""]
  );

  return {
    filename: `persone_${new Date().toISOString().slice(0, 10)}.csv`,
    csv,
  };
}

export async function exportClientsCsv() {
  const rows = await prisma.client.findMany({
    orderBy: [{ name: "asc" }],
  });

  const csv = toCsv(
    rows,
    ["RagioneSociale", "Tipo", "Stato", "PIVA", "CodiceUnivoco", "PEC", "Email", "Telefono", "Indirizzo"],
    (c) => [
      c.name,
      c.type,
      c.status,
      c.vatNumber ?? "",
      c.uniqueCode ?? "",
      c.pec ?? "",
      c.email ?? "",
      c.phone ?? "",
      c.address ?? "",
    ]
  );

  return {
    filename: `clienti_${new Date().toISOString().slice(0, 10)}.csv`,
    csv,
  };
}