import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { prisma } = await import("@/lib/prisma");

  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").trim();

    if (q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const clients = await prisma.client.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
      take: 6,
      select: { id: true, name: true },
    });

    const people = await prisma.person.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: q,
              mode: "insensitive",
            },
          },
        ],
      },
      take: 6,
      select: { id: true, firstName: true, lastName: true },
    });

    const results = [
      ...clients.map((c) => ({
        label: c.name,
        type: "Cliente",
        url: `/clients/${c.id}`,
      })),
      ...people.map((p) => ({
        label: `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim(),
        type: "Persona",
        url: `/people/${p.id}`,
      })),
    ];

    return NextResponse.json({ results });
  } catch (e: any) {
    return NextResponse.json(
      { results: [], error: e?.message ?? "Errore server" },
      { status: 500 }
    );
  }
}