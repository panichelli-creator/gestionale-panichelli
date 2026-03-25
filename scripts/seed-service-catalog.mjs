import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SERVICES = [
  { name: "DVR", isActive: true },
  { name: "HACCP", isActive: true },
  { name: "PRIVACY", isActive: true },
  { name: "FORMAZIONE", isActive: true },
  { name: "RADIOPROTEZIONE RX", isActive: true },
  { name: "VSE", isActive: true },
  { name: "LASER", isActive: true },
  { name: "LEGIONELLA", isActive: true },
 { name: "INVIO REGIONE LAZIO", isActive: true },
];

function norm(s) {
  return String(s ?? "").trim().toUpperCase();
}

async function main() {
  const existing = await prisma.serviceCatalog.findMany({
    select: { id: true, name: true },
  });

  const existingKeys = new Set(existing.map((x) => norm(x.name)));

  let created = 0;
  for (const s of SERVICES) {
    const key = norm(s.name);
    if (!key) continue;
    if (existingKeys.has(key)) continue;

    await prisma.serviceCatalog.create({
      data: {
        name: s.name,
        isActive: s.isActive ?? true,
      },
    });
    created++;
  }

  console.log(`Seed completato. Creati: ${created}. Totali già presenti: ${existing.length}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });