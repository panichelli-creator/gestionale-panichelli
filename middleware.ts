import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "phsc_session";

type SessionRole = "admin" | "staff" | "ingegnere_clinico";

function b64urlToUint8Array(s: string) {
  const pad = 4 - (s.length % 4 || 4);
  const base64 = s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(pad);
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

function b64urlToString(s: string) {
  const bytes = b64urlToUint8Array(s);
  return new TextDecoder().decode(bytes);
}

async function verifyToken(token: string, secret: string) {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sigB64] = parts;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const ok = await crypto.subtle.verify(
    "HMAC",
    key,
    b64urlToUint8Array(sigB64),
    new TextEncoder().encode(payloadB64)
  );
  if (!ok) return null;

  const payloadJson = b64urlToString(payloadB64);
  const payload = JSON.parse(payloadJson);

  const exp = Number(payload?.exp ?? 0);
  if (!payload?.uid || !payload?.role || !exp) return null;
  if (exp < Math.floor(Date.now() / 1000)) return null;

  const role = String(payload.role) as SessionRole;
  if (!["admin", "staff", "ingegnere_clinico"].includes(role)) return null;

  return payload as { uid: string; role: SessionRole; exp: number };
}

function redirectTo(req: NextRequest, pathname: string) {
  const url = req.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  return NextResponse.redirect(url);
}

function homeByRole(role: SessionRole) {
  if (role === "ingegnere_clinico") return "/ingegneria-clinica";
  if (role === "staff") return "/clients";
  return "/dashboard";
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isStatic =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/logo");

  const isApi = pathname.startsWith("/api");
  const isLogin = pathname === "/login";

  if (isStatic || isApi) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const secret = process.env.AUTH_SECRET || "";
  const session = token && secret ? await verifyToken(token, secret) : null;

  if (isLogin) {
    if (session) {
      return redirectTo(req, homeByRole(session.role));
    }
    return NextResponse.next();
  }

  if (!session) {
    return redirectTo(req, "/login");
  }

  if (session.role === "staff") {
    const blockedForStaff =
      pathname === "/dashboard" ||
      pathname.startsWith("/backup") ||
      pathname.startsWith("/users") ||
      pathname.startsWith("/import-export");

    if (blockedForStaff) {
      return redirectTo(req, "/clients");
    }
  }

  if (session.role === "ingegnere_clinico") {
    const allowed =
      pathname === "/ingegneria-clinica" ||
      pathname.startsWith("/ingegneria-clinica/");

    if (!allowed) {
      return redirectTo(req, "/ingegneria-clinica");
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};