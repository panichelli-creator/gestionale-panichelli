import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function csvCell(v: string) {
  const s = String(v ?? "");
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const q = String(searchParams.get("q") ?? "").trim();
    const role = String(searchParams.get("role") ?? "").trim();
    const marketingList = String(searchParams.get("marketingList") ?? "").trim();
    const type = String(searchParams.get("type") ?? "").trim();
    const service = String(searchParams.get("service") ?? "").trim();

    const contacts = await prisma.clientContact.findMany({
      where: {
        AND: [
          q
            ? {
                OR: [
                  { name: { contains: q } },
                  { email: { contains: q } },
                  { phone: { contains: q } },
                ],
              }
            : {},

          role ? { role } : {},

          marketingList ? { marketingList } : {},

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

      orderBy: [{ marketingList: "asc" }, { role: "asc" }, { name: "asc" }],
    });

    const rows = [
      ["email", "nome", "ruolo", "lista_marketing", "cliente", "telefono", "tipo_struttura"],

      ...contacts.map((c) => [
        c.email ?? "",
        c.name ?? "",
        c.role ?? "",
        (c as any).marketingList ?? "ALTRO",
        c.client?.name ?? "",
        c.phone ?? "",
        c.client?.type ?? "",
      ]),
    ];

    const csv = rows.map((r) => r.map(csvCell).join(";")).join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="voxmail-contatti.csv"',
      },
    });
  } catch (e) {
    return new NextResponse("Errore export contatti", { status: 500 });
  }
}