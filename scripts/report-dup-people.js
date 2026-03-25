const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function norm(s) {
  return (s ?? "").trim().toUpperCase();
}

async function main() {
  const people = await prisma.person.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      fiscalCode: true,
      clientId: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const byFiscal = new Map(); // CF -> ids
  const byNameClient = new Map(); // LN||FN||clientId -> ids

  for (const p of people) {
    const cf = norm(p.fiscalCode);
    if (cf) {
      if (!byFiscal.has(cf)) byFiscal.set(cf, []);
      byFiscal.get(cf).push(p);
    }

    const key = `${norm(p.lastName)}||${norm(p.firstName)}||${p.clientId ?? "NOCLIENT"}`;
    if (!byNameClient.has(key)) byNameClient.set(key, []);
    byNameClient.get(key).push(p);
  }

  const dupFiscal = [...byFiscal.entries()]
    .filter(([, arr]) => arr.length > 1)
    .sort((a, b) => b[1].length - a[1].length);

  const dupNameClient = [...byNameClient.entries()]
    .filter(([, arr]) => arr.length > 1)
    .sort((a, b) => b[1].length - a[1].length);

  console.log("Totale persone:", people.length);
  console.log("Gruppi duplicati per CF:", dupFiscal.length);
  console.log(
    "Top 10 gruppi CF:",
    dupFiscal.slice(0, 10).map(([cf, arr]) => ({ cf, count: arr.length }))
  );
  console.log("Gruppi duplicati per Cognome+Nome+Cliente:", dupNameClient.length);
  console.log(
    "Top 10 gruppi Nome+Cliente:",
    dupNameClient.slice(0, 10).map(([k, arr]) => ({ key: k, count: arr.length }))
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });