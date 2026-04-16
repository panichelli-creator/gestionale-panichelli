import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ROOT = process.cwd();
const BACKUP_DIR = path.join(ROOT, "backups");

function requireAdmin() {
  const s = getSession();
  if (!s || s.role !== "admin") {
    throw new Error("Non autorizzato.");
  }
}

export async function GET(req: Request) {
  try {
    requireAdmin();

    const { searchParams } = new URL(req.url);
    const file = String(searchParams.get("file") ?? "").trim();

    if (!file || file.includes("..") || file.includes("/") || file.includes("\\")) {
      return new NextResponse("File non valido", { status: 400 });
    }

    const fullPath = path.join(BACKUP_DIR, file);

    if (!fs.existsSync(fullPath)) {
      return new NextResponse("Backup non trovato", { status: 404 });
    }

    const stat = fs.statSync(fullPath);
    const buffer = fs.readFileSync(fullPath);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/sql; charset=utf-8",
        "Content-Length": String(stat.size),
        "Content-Disposition": `attachment; filename="${file}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e: any) {
    return new NextResponse(String(e?.message ?? "Errore download backup"), {
      status: 500,
    });
  }
}