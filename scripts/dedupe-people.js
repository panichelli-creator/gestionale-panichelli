const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function norm(s) {
  return (s ?? "").trim().toUpperCase();
}

function scorePerson(p) {
  // più alto = preferito come master
  let s = 0;
  if (p.fiscalCode) s += 100;
  if (p.email) s += 10;
  if (p.phone) s += 10;
  if (p.role) s += 5;
  if (p.hireDate) s += 5;
  if (p.medicalCheckDone) s += 2;
  if (p.clientId) s += 1;
  return s;
}

async function mergeIntoMaster(master, others) {
  const otherIds = others.map((x) => x.id);

  // sposta training records
  await prisma.trainingRecord.updateMany({
    where: { personId: { in: otherIds } },
    data: { personId: master.id },
  });

  // sposta personClients (evita duplicati personId+clientId)
  const pcs = await prisma.personClient.findMany({
    where: { personId: { in: otherIds } },
    select: { id: true, personId: true, clientId: true },
  });

  const existing = await prisma.personClient.findMany({
    where: { personId: master.id },
    select: { clientId: true },
  });
  const masterClientIds = new Set(existing.map((x) => x.clientId));

  for (const pc of pcs) {
    if (masterClientIds.has(pc.clientId)) {
      // già esiste per master => elimina questo pc duplicato
      await prisma.personClient.delete({ where: { id: pc.id } });
    } else {
      await prisma.personClient.update({
        where: { id: pc.id },
        data: { personId: master.id },
      });
      masterClientIds.add(pc.clientId);
    }
  }

  // se il master ha campi vuoti e un "other" li ha, li completiamo (merge leggero)
  const fill = {};
  for (const o of others) {
    if (!master.fiscalCode && o.fiscalCode) fill.fiscalCode = o.fiscalCode;
    if (!master.email && o.email) fill.email = o.email;
    if (!master.phone && o.phone) fill.phone = o.phone;
    if (!master.role && o.role) fill.role = o.role;
    if (!master.hireDate && o.hireDate) fill.hireDate = o.hireDate;
    if (!master.clientId && o.clientId) fill.clientId = o.clientId;
    if (!master.medicalCheckDone && o.medicalCheckDone) fill.medicalCheckDone = true;
  }

  if (Object.keys(fill).length) {
    await prisma.person.update({ where: { id: master.id }, data: fill });
  }

  // ora elimina le persone duplicate
  await prisma.person.deleteMany({
    where: { id: { in: otherIds } },
  });

  return otherIds.length;
}

async function main() {
  // prendiamo tutto con i campi necessari
  const people = await prisma.person.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      fiscalCode: true,
      email: true,
      phone: true,
      role: true,
      hireDate: true,
      medicalCheckDone: true,
      clientId: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // 1) gruppi per CF (più sicuro)
  const byFiscal = new Map();
  for (const p of people) {
    const cf = norm(p.fiscalCode);
    if (!cf) continue;
    if (!byFiscal.has(cf)) byFiscal.set(cf, []);
    byFiscal.get(cf).push(p);
  }

  let removed = 0;

  for (const [, group] of byFiscal.entries()) {
    if (group.length < 2) continue;

    const sorted = [...group].sort((a, b) => scorePerson(b) - scorePerson(a));
    const master = sorted[0];
    const others = sorted.slice(1);

    removed += await mergeIntoMaster(master, others);
  }

  // 2) gruppi per Cognome+Nome+Cliente SOLO per chi NON ha CF (più rischioso ma utile)
  const remaining = await prisma.person.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      fiscalCode: true,
      email: true,
      phone: true,
      role: true,
      hireDate: true,
      medicalCheckDone: true,
      clientId: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const byNameClient = new Map();
  for (const p of remaining) {
    if (norm(p.fiscalCode)) continue; // già gestiti o “sicuri”
    const key = `${norm(p.lastName)}||${norm(p.firstName)}||${p.clientId ?? "NOCLIENT"}`;
    if (!byNameClient.has(key)) byNameClient.set(key, []);
    byNameClient.get(key).push(p);
  }

  for (const [, group] of byNameClient.entries()) {
    if (group.length < 2) continue;

    const sorted = [...group].sort((a, b) => scorePerson(b) - scorePerson(a));
    const master = sorted[0];
    const others = sorted.slice(1);

    removed += await mergeIntoMaster(master, others);
  }

  console.log("Persone duplicate rimosse:", removed);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });