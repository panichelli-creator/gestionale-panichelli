import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "phsc_session";

type SessionRole = "admin" | "staff" | "ingegnere_clinico";

type SessionPayload = {
  uid: string;
  role: SessionRole;
  exp: number;
};

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

async function verifyToken(token: string, secret: string): Promise<SessionPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payloadB64, sigB64] = parts;
    if (!payloadB64 || !sigB64) return null;

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

    return {
      uid: String(payload.uid),
      role,
      exp,
    };
  } catch {
    return null;
  }
}

function clearSession(res: NextResponse) {
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
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

function isStaticPath(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/logo") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/icons") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/manifest.json"
  );
}

function isPublicApi(pathname: string) {
  return pathname === "/api/login" || pathname === "/api/logout";
}

function isStaffBlockedPath(pathname: string) {
  return (
    pathname === "/dashboard" ||
    pathname.startsWith("/backup") ||
    pathname.startsWith("/users") ||
    pathname.startsWith("/import-export")
  );
}

function isSensitiveApi(pathname: string) {
  return (
    pathname.startsWith("/api/import-export") ||
    pathname.startsWith("/api/backup") ||
    pathname.startsWith("/api/users")
  );
}

function isIngegnereAllowedPath(pathname: string) {
  return (
    pathname === "/ingegneria-clinica" ||
    pathname.startsWith("/ingegneria-clinica/")
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isStatic = isStaticPath(pathname);
  const isLogin = pathname === "/login";
  const isApi = pathname.startsWith("/api");
  const publicApi = isPublicApi(pathname);

  if (isStatic) {
    return NextResponse.next();
  }

  if (isLogin) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const secret = process.env.AUTH_SECRET || "";
    const session = token && secret ? await verifyToken(token, secret) : null;

    if (session) {
      return redirectTo(req, homeByRole(session.role));
    }

    if (token) {
      return clearSession(NextResponse.next());
    }

    return NextResponse.next();
  }

  if (isApi && publicApi) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const secret = process.env.AUTH_SECRET || "";
  const session = token && secret ? await verifyToken(token, secret) : null;

  if (!session) {
    if (isApi) {
      const res = NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
      return clearSession(res);
    }

    const res = redirectTo(req, "/login");
    return clearSession(res);
  }

  if (session.role === "staff") {
    if (isApi && isSensitiveApi(pathname)) {
      return NextResponse.json({ error: "Accesso negato" }, { status: 403 });
    }

    if (!isApi && isStaffBlockedPath(pathname)) {
      return redirectTo(req, "/clients");
    }
  }

  if (session.role === "ingegnere_clinico") {
    if (isApi && isSensitiveApi(pathname)) {
      return NextResponse.json({ error: "Accesso negato" }, { status: 403 });
    }

    if (!isApi && !isIngegnereAllowedPath(pathname)) {
      return redirectTo(req, "/ingegneria-clinica");
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};