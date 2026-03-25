import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function csvCell(v: string) {
  const s = String(v ?? "");
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
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
    ["Nome", "Ruolo", "Lista marketing", "Cliente", "Email", "Telefono"],
    ...contacts.map((c) => [
      c.name ?? "",
      c.role ?? "",
      (c as any).marketingList ?? "ALTRO",
      c.client?.name ?? "",
      c.email ?? "",
      c.phone ?? "",
    ]),
  ];

  const csv = rows.map((r) => r.map(csvCell).join(";")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="contatti.csv"',
    },
  });
}