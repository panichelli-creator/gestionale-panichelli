import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const COURSES = [
  { name: "RSPP DATORE DI LAVORO", category: "SICUREZZA" },
  { name: "ANTINCENDIO", category: "SICUREZZA" },
  { name: "PRIMO SOCCORSO", category: "SICUREZZA" },
  { name: "ASO", category: "SANITARIO" },
  { name: "RADIOPROTEZIONE RX", category: "RADIOPROTEZIONE" },
  { name: "FORMAZIONE GENERALE", category: "SICUREZZA" },
  { name: "FORMAZIONE SPECIFICA", category: "SICUREZZA" },
];

async function main() {
  const existing = await prisma.courseCatalog.findMany({
    select: { name: true },
  });

  const existingNames = new Set(
    existing.map((c) => c.name.trim().toUpperCase())
  );

  let created = 0;

  for (const c of COURSES) {
    if (!existingNames.has(c.name.trim().toUpperCase())) {
      await prisma.courseCatalog.create({
        data: {
          name: c.name,
          category: c.category,
          isActive: true,
        },
      });
      created++;
    }
  }

  console.log(`Creati ${created} corsi.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());