/* eslint-disable no-console */
const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

async function main() {
  const email = (process.argv[2] || "").trim().toLowerCase();
  const password = process.argv[3] || "";
  const role = (process.argv[4] || "staff").trim(); // staff | admin
  const name = (process.argv[5] || "").trim() || null;

  if (!email || !password) {
    console.log("Uso: node scripts/create-user.js email password [staff|admin] [name]");
    process.exit(1);
  }

  const prisma = new PrismaClient();

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      password: hashPassword(password),
      role: role === "admin" ? "admin" : "staff",
      name,
    },
    update: {
      password: hashPassword(password),
      role: role === "admin" ? "admin" : "staff",
      name,
    },
    select: { id: true, email: true, role: true, name: true },
  });

  console.log("✅ Utente creato/aggiornato:", user);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});