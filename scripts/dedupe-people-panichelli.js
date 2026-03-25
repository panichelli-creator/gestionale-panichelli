/* eslint-disable no-console */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function normName(s) {
  return String(s || "").trim().toUpperCase().replace(/\s+/g, " ");
}

async function main() {
  const panichelliClients = await prisma.client.findMany({
    where: { name: { contains: "Panichelli" } },
    select: { id: true, name: true },
  });
  const panichelliIds = new Set(panichelliClients.map((c) => c.id));

  console.log("Client Panichelli trovati:", panichelliClients);

  const people = await prisma.person.findMany({
    where: { fiscalCode: null },
    select: {
      id: true,
      lastName: true,
      firstName: true,
      email: true,
      phone: true,
      clientId: true,
      createdAt: true,
    },
  });

  const groups = new Map();
  for (const p of people) {
    const key = `${normName(p.lastName)}|${normName(p.firstName)}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(p);
  }

  let mergedGroups = 0;
  let deletedPeople = 0;
  let movedTrainings = 0;
  let movedPersonClients = 0;

  for (const [key, arr] of groups.entries()) {
    if (arr.length < 2) continue;

    const sorted = [...arr].sort((a, b) => a.createdAt - b.createdAt);

    let keep =
      sorted.find((p) => p.clientId && !panichelliIds.has(p.clientId)) || sorted[0];

    const dups = sorted.filter((p) => p.id !== keep.id);

    const better = dups.find((p) => p.clientId && !panichelliIds.has(p.clientId));
    if (better && (!keep.clientId || panichelliIds.has(keep.clientId))) {
      keep = better;
    }

    const toDelete = sorted.filter((p) => p.id !== keep.id);
    if (!toDelete.length) continue;

    mergedGroups++;

    for (const dup of toDelete) {
      const tr = await prisma.trainingRecord.updateMany({
        where: { personId: dup.id },
        data: { personId: keep.id },
      });
      movedTrainings += tr.count;

      const pcs = await prisma.personClient.findMany({
        where: { personId: dup.id },
        select: { clientId: true },
      });

      if (pcs.length) {
        await prisma.personClient.createMany({
          data: pcs.map((x) => ({ personId: keep.id, clientId: x.clientId })),
          skipDuplicates: true,
        });
        movedPersonClients += pcs.length;
      }

      if (
        (!keep.clientId || panichelliIds.has(keep.clientId)) &&
        dup.clientId &&
        !panichelliIds.has(dup.clientId)
      ) {
        await prisma.person.update({
          where: { id: keep.id },
          data: { clientId: dup.clientId },
        });
      }

      await prisma.person.delete({ where: { id: dup.id } });
      deletedPeople++;
    }

    console.log("MERGE", key, "keep:", keep.id, "deleted:", toDelete.map((x) => x.id));
  }

  console.log("✅ FINE");
  console.log({
    mergedGroups,
    deletedPeople,
    movedTrainings,
    movedPersonClients,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });