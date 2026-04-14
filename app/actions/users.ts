"use server";

import { getSession } from "@/lib/session";
import { hashPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function requireAdmin() {
  const s = getSession();
  if (!s || s.role !== "admin") throw new Error("Non autorizzato.");
  return s;
}

function norm(s: string) {
  return (s ?? "").trim();
}

export async function createOrUpdateUser(formData: FormData) {
  const { prisma } = await import("@/lib/prisma");

  requireAdmin();

  const username = norm(String(formData.get("username") ?? "")).toLowerCase();
  const password = String(formData.get("password") ?? "");
  const roleRaw = norm(String(formData.get("role") ?? "staff"));
  const name = norm(String(formData.get("name") ?? "")) || null;

  if (!username) throw new Error("Username obbligatorio.");
  if (!password || password.length < 6) throw new Error("Password troppo corta (min 6).");

  let role: "admin" | "staff" | "ingegnere_clinico" = "staff";

  if (roleRaw === "admin") role = "admin";
  else if (roleRaw === "ingegnere_clinico") role = "ingegnere_clinico";

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

  revalidatePath("/users");
  return { ok: true };
}

export async function deleteUser(formData: FormData) {
  const { prisma } = await import("@/lib/prisma");

  requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("ID mancante.");

  const admins = await prisma.user.count({ where: { role: "admin" } });
  const target = await prisma.user.findUnique({
    where: { id },
    select: { role: true },
  });

  if (!target) throw new Error("Utente non trovato.");
  if (target.role === "admin" && admins <= 1) {
    throw new Error("Non puoi eliminare l’ultimo admin.");
  }

  await prisma.user.delete({ where: { id } });

  revalidatePath("/users");
  return { ok: true };
}

export async function listUsers() {
  const { prisma } = await import("@/lib/prisma");

  requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      createdAt: true,
    },
  });

  return users;
}