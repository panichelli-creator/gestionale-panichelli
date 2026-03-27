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

export async function GET(req: Request) {
  const { prisma } = await import("@/lib/prisma");

  try {
    const today = startOfTodayLocal();
    const in7 = addDays(today, 7);
    const in30 = addDays(today, 30);

    const [due7, due30] = await Promise.all([
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
    ]);

    const mapRow = (r: any) => ({
      id: String(r.id),
      dueDate: r.dueDate ? new Date(r.dueDate).toISOString() : null,
      clientId: r.clientId ? String(r.clientId) : null,
      clientName: r.client?.name ?? "",
      serviceName: r.service?.name ?? "",
      priceEur: r.priceEur ?? null,
      urlClient: r.clientId ? `/clients/${r.clientId}` : null,
    });

    return NextResponse.json({
      due7: due7.map(mapRow),
      due30: due30.map(mapRow),
    });
  } catch (e: any) {
    return NextResponse.json(
      { due7: [], due30: [], error: e?.message ?? "Errore server" },
      { status: 500 }
    );
  }
}