import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/auth";

const prisma = new PrismaClient();

async function main() {
  const username = String(process.argv[2] ?? "").trim().toLowerCase();
  const password = String(process.argv[3] ?? "").trim();
  const roleRaw = String(process.argv[4] ?? "admin").trim().toLowerCase();
  const name = String(process.argv[5] ?? "").trim() || null;

  if (!username || !password) {
    console.log('Uso: npm run reset-user -- USERNAME PASSWORD [admin|staff] [NOME]');
    process.exit(1);
  }

  const role = roleRaw === "staff" ? "staff" : "admin";

  await prisma.user.upsert({
    where: { email: username },
    create: {
      email: username,
      password: hashPassword(password),
      role,
      name,
    },
    update: {
      password: hashPassword(password),
      role,
      name,
    },
  });

  console.log(`Utente aggiornato: ${username} (${role})`);
}

main()
  .catch((e) => {
    console.error("Errore reset utente:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });