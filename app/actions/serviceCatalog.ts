"use server";

import { prisma } from "@/lib/prisma";

/**
 * Trova (case-insensitive) un servizio per nome.
 * SQLite/Prisma non supporta "mode: insensitive" su equals in questo contesto.
 * Quindi: carichiamo i servizi e confrontiamo in JS.
 */
export async function findServiceCatalogIdByNameInsensitive(name: string) {
  const target = (name ?? "").trim().toUpperCase();
  if (!target) return null;

  const all = await prisma.serviceCatalog.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
  });

  const found = all.find((s) => (s.name ?? "").trim().toUpperCase() === target);
  return found?.id ?? null;
}

/**
 * Upsert "soft" case-insensitive:
 * - se esiste già (anche con maiuscole/minuscole diverse) restituisce id
 * - altrimenti crea un record con name normalizzato.
 */
export async function upsertServiceCatalogByNameInsensitive(name: string) {
  const clean = (name ?? "").trim();
  if (!clean) throw new Error("Nome servizio vuoto.");

  const normalized = clean.toUpperCase();

  const existingId = await findServiceCatalogIdByNameInsensitive(normalized);
  if (existingId) return existingId;

  const created = await prisma.serviceCatalog.create({
    data: { name: normalized, isActive: true },
    select: { id: true },
  });

  return created.id;
}

/** Seed/ensure specifici */
export async function ensureLegionellaService() {
  await upsertServiceCatalogByNameInsensitive("LEGIONELLA");
}

export async function ensureInvioRegioneLazioService() {
  await upsertServiceCatalogByNameInsensitive("INVIO REGIONE LAZIO");
}