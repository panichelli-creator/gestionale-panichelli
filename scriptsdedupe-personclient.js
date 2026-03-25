const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const all = await prisma.personClient.findMany({
    select: { id: true, personId: true, clientId: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const seen = new Set();
  const toDelete = [];

  for (const r of all) {
    const key = `${r.personId}__${r.clientId}`;
    if (seen.has(key)) toDelete.push(r.id);
    else seen.add(key);
  }

  if (toDelete.length) {
    await prisma.personClient.deleteMany({
      where: { id: { in: toDelete } },
    });
  }

  console.log("Duplicati PersonClient rimossi:", toDelete.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
