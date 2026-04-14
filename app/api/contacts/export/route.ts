import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function csvCell(v: string) {
  const s = String(v ?? "");
  return `"${s.replace(/"/g, '""')}"`;
}

function normalize(v: string) {
  return String(v ?? "").trim().toUpperCase();
}

function splitMarketingLists(value: string | null | undefined) {
  const raw = String(value ?? "").trim();
  if (!raw) return [];

  return Array.from(
    new Set(
      raw
        .split(",")
        .map((x) => normalize(x))
        .filter(Boolean)
    )
  );
}

export async function GET(req: Request) {
  const { prisma } = await import("@/lib/prisma");

  try {
    const { searchParams } = new URL(req.url);

    const q = String(searchParams.get("q") ?? "").trim();
    const role = String(searchParams.get("role") ?? "").trim();
    const marketingList = normalize(String(searchParams.get("marketingList") ?? "").trim());
    const type = String(searchParams.get("type") ?? "").trim();
    const service = String(searchParams.get("service") ?? "").trim();

    const allContacts = await prisma.clientContact.findMany({
      where: {
        AND: [
          q
            ? {
                OR: [
                  { name: { contains: q, mode: "insensitive" as any } },
                  { email: { contains: q, mode: "insensitive" as any } },
                  { phone: { contains: q } },
                ],
              }
            : {},
          role ? { role } : {},
          type
            ? {
                client: {
                  type,
                },
              }
            : {},
          service
            ? {
                client: {
                  services: {
                    some: {
                      service: {
                        name: service,
                      },
                    },
                  },
                },
              }
            : {},
        ],
      },
      include: {
        client: true,
      },
      orderBy: [{ role: "asc" }, { name: "asc" }],
    });

    const contacts = allContacts.filter((c: any) => {
      if (!marketingList) return true;
      const lists = splitMarketingLists(c.marketingList);
      return lists.includes(marketingList);
    });

    const rows = [
      ["Nome", "Ruolo", "Liste marketing", "Cliente", "Email", "Telefono"],
      ...contacts.map((c: any) => [
        c.name ?? "",
        c.role ?? "",
        splitMarketingLists(c.marketingList).join(", ") || "ALTRO",
        c.client?.name ?? "",
        c.email ?? "",
        c.phone ?? "",
      ]),
    ];

    const csv = "\uFEFF" + rows.map((r) => r.map(csvCell).join(";")).join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="contatti.csv"',
      },
    });
  } catch {
    return new NextResponse("Errore export contatti", { status: 500 });
  }
}