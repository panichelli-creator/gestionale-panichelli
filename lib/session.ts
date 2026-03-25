import { cookies } from "next/headers";
import { signSession, verifySession, type SessionPayload, type UserRole } from "@/lib/auth";

const COOKIE_NAME = "phsc_session";

export function getSession(): SessionPayload | null {
  const c = cookies().get(COOKIE_NAME)?.value;
  if (!c) return null;
  return verifySession(c);
}

export function setSessionCookie(uid: string, role: UserRole) {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 14; // 14 giorni
  const token = signSession({ uid, role, exp });

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // in prod su https verrà true automaticamente (ok lasciarlo false in dev)
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export function clearSessionCookie() {
  cookies().set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 0,
  });
}