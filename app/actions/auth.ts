"use server";

import { setSessionCookie, clearSessionCookie } from "@/lib/session";
import { verifyPassword } from "@/lib/auth";
import { redirect } from "next/navigation";

function norm(s: string) {
  return String(s ?? "").trim();
}

function passwordMatches(inputPassword: string, storedPassword: string) {
  if (!storedPassword) return false;

  const stored = String(storedPassword).trim();

  try {
    if (verifyPassword(inputPassword, stored)) return true;
  } catch {}

  if (inputPassword === stored) return true;
  if (inputPassword.trim() === stored) return true;

  return false;
}

export async function loginAction(formData: FormData) {
  const { prisma } = await import("@/lib/prisma");

  const usernameRaw = norm(String(formData.get("username") ?? ""));
  const username = usernameRaw.toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!usernameRaw || !password) {
    throw new Error("Username e password obbligatorie.");
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
      name: true,
    },
    take: 2000,
  });

  const user =
    users.find((u) => String(u.email ?? "").trim() === usernameRaw) ??
    users.find((u) => String(u.email ?? "").trim().toLowerCase() === username) ??
    null;

  if (!user) {
    throw new Error("Credenziali non valide.");
  }

  if (!passwordMatches(password, user.password)) {
    throw new Error("Credenziali non valide.");
  }

  const role =
    user.role === "staff"
      ? "staff"
      : user.role === "ingegnere_clinico"
      ? "ingegnere_clinico"
      : "admin";

  setSessionCookie(user.id, role);

  if (role === "ingegnere_clinico") redirect("/ingegneria-clinica");
  if (role === "staff") redirect("/clients");
  redirect("/dashboard");
}

export async function logoutAction() {
  clearSessionCookie();
  redirect("/login");
}