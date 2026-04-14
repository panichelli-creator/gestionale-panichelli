import { cookies } from "next/headers";
import { signSession, verifySession, type SessionPayload, type UserRole } from "@/lib/auth";

const COOKIE_NAME = "phsc_session";

export function getSession(): SessionPayload | null {
  try {
    const c = cookies().get(COOKIE_NAME)?.value;
    if (!c) return null;
    return verifySession(c);
  } catch {
    return null;
  }
}

export function setSessionCookie(uid: string, role: UserRole) {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 14;

  const token = signSession({ uid, role, exp });

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export function clearSessionCookie() {
  cookies().set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}