import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function startOfTodayLocal() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(base: Date, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function safetyRoleLabel(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();

  if (s === "DDL") return "DDL";
  if (s === "DIRIGENTE") return "Dirigente";
  if (s === "PREPOSTO") return "Preposto";
  if (s === "RSPP") return "RSPP";
  if (s === "RLS") return "RLS";
  if (s === "BLSD") return "Addetto BLSD";
  if (s === "PRIMO_SOCCORSO") return "Addetto primo soccorso";
  if (s === "ANTINCENDIO") return "Addetto antincendio";

  return s || "Nomina";
}

export async function GET(req: Request) {
  const { prisma } = await import("@/lib/prisma");

  try {
    const today = startOfTodayLocal();
    const in7 = addDays(today, 7);
    const in30 = addDays(today, 30);

    const [serviceDue7, serviceDue30, safetyDue7, safetyDue30] = await Promise.all([
      prisma.clientService.findMany({
        where: { dueDate: { gte: today, lte: in7 } },
        include: { client: true, service: true },
        orderBy: { dueDate: "asc" },
        take: 10,
      }),
      prisma.clientService.findMany({
        where: { dueDate: { gte: today, lte: in30 } },
        include: { client: true, service: true },
        orderBy: { dueDate: "asc" },
        take: 10,
      }),
      prisma.clientSafetyRole.findMany({
        where: { dueDate: { gte: today, lte: in7 } },
        include: { client: true, person: true },
        orderBy: { dueDate: "asc" },
        take: 10,
      }),
      prisma.clientSafetyRole.findMany({
        where: { dueDate: { gte: today, lte: in30 } },
        include: { client: true, person: true },
        orderBy: { dueDate: "asc" },
        take: 10,
      }),
    ]);

    const mapServiceRow = (r: any) => ({
      id: `service-${String(r.id)}`,
      dueDate: r.dueDate ? new Date(r.dueDate).toISOString() : null,
      clientId: r.clientId ? String(r.clientId) : null,
      clientName: r.client?.name ?? "",
      serviceName: r.service?.name ?? "",
      priceEur: r.priceEur ?? null,
      urlClient: r.clientId ? `/clients/${r.clientId}` : null,
    });

    const mapSafetyRow = (r: any) => {
      const fullName = r.person
        ? `${r.person.lastName ?? ""} ${r.person.firstName ?? ""}`.trim()
        : String(r.name ?? "").trim();

      return {
        id: `safety-${String(r.id)}`,
        dueDate: r.dueDate ? new Date(r.dueDate).toISOString() : null,
        clientId: r.clientId ? String(r.clientId) : null,
        clientName: r.client?.name ?? "",
        serviceName: `Scadenza nomina ${safetyRoleLabel(r.role)} ${fullName}`,
        priceEur: null,
        urlClient: r.clientId ? `/clients/${r.clientId}/organigramma` : null,
      };
    };

    const due7 = [...serviceDue7.map(mapServiceRow), ...safetyDue7.map(mapSafetyRow)].sort(
      (a, b) => new Date(a.dueDate ?? 0).getTime() - new Date(b.dueDate ?? 0).getTime()
    );

    const due30 = [...serviceDue30.map(mapServiceRow), ...safetyDue30.map(mapSafetyRow)].sort(
      (a, b) => new Date(a.dueDate ?? 0).getTime() - new Date(b.dueDate ?? 0).getTime()
    );

    return NextResponse.json({
      due7,
      due30,
    });
  } catch (e: any) {
    return NextResponse.json(
      { due7: [], due30: [], error: e?.message ?? "Errore server" },
      { status: 500 }
    );
  }
}