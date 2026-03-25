import crypto from "node:crypto";

export type UserRole = "admin" | "staff" | "ingegnere_clinico";

export type SessionPayload = {
  uid: string;
  role: UserRole;
  exp: number; // unix seconds
};

function b64urlEncode(buf: Buffer) {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function b64urlDecodeToBuffer(s: string) {
  const pad = 4 - (s.length % 4 || 4);
  const base64 = s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(pad);
  return Buffer.from(base64, "base64");
}

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET mancante o troppo corto (min 32).");
  }
  return secret;
}

export function signSession(payload: SessionPayload) {
  const json = JSON.stringify(payload);
  const payloadB64 = b64urlEncode(Buffer.from(json, "utf8"));
  const sig = crypto.createHmac("sha256", getSecret()).update(payloadB64).digest();
  const sigB64 = b64urlEncode(sig);
  return `${payloadB64}.${sigB64}`;
}

export function verifySession(token: string): SessionPayload | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sigB64] = parts;

  const expected = crypto.createHmac("sha256", getSecret()).update(payloadB64).digest();
  const got = b64urlDecodeToBuffer(sigB64);

  if (got.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(got, expected)) return null;

  const payloadJson = b64urlDecodeToBuffer(payloadB64).toString("utf8");
  const payload = JSON.parse(payloadJson) as SessionPayload;

  if (!payload?.uid || !payload?.role || !payload?.exp) return null;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;

  const validRoles: UserRole[] = ["admin", "staff", "ingegnere_clinico"];
  if (!validRoles.includes(payload.role)) return null;

  return payload;
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string) {
  const parts = stored.split("$");
  if (parts.length !== 3) return false;
  const [algo, saltHex, keyHex] = parts;
  if (algo !== "scrypt") return false;

  const salt = Buffer.from(saltHex, "hex");
  const key = Buffer.from(keyHex, "hex");
  const derived = crypto.scryptSync(password, salt, 64);

  if (derived.length !== key.length) return false;
  return crypto.timingSafeEqual(derived, key);
}