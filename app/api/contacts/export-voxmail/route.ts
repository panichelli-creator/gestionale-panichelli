import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function csvCell(v: string) {
  const s = String(v ?? "");
  return `"${s.replace(/"/g, '""')}"`;
}

function normalizeText(value: any) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function normalizeList(value: any) {
  return String(value ?? "").trim().toUpperCase();
}

function parseLists(value: any) {
  const out: string[] = [];
  const seen = new Set<string>();

  const raw = String(value ?? "").trim();
  if (!raw) return out;

  for (const part of raw.split(",")) {
    const v = normalizeList(part);
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }

  return out;
}

export async function GET(req: Request) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const { searchParams } = new URL(req.url);

    const q = String(searchParams.get("q") ?? "").trim();
    const qNorm = normalizeText(q);

    const role = String(searchParams.get("role") ?? "").trim();
    const roleNorm = normalizeText(role);

    const marketingList = String(searchParams.get("marketingList") ?? "").trim();
    const marketingListNorm = normalizeList(marketingList);

    const type = String(searchParams.get("type") ?? "").trim();
    const typeNorm = normalizeText(type);

    const service = String(searchParams.get("service") ?? "").trim();
    const serviceNorm = normalizeText(service);

    const contactsRaw = await prisma.clientContact.findMany({
      include: {
        client: {
          include: {
            services: {
              include: {
                service: true,
              },
            },
          },
        },
      },
      orderBy: [{ name: "asc" }],
    });

    const contacts = contactsRaw.filter((c: any) => {
      const haystack = normalizeText(
        [
          c?.name,
          c?.email,
          c?.phone,
          c?.role,
          c?.notes,
          c?.client?.name,
          c?.client?.type,
        ]
          .filter(Boolean)
          .join(" ")
      );

      const matchesQ = !qNorm || haystack.includes(qNorm);
      const matchesRole = !roleNorm || normalizeText(c?.role).includes(roleNorm);

      const lists = parseLists(c?.marketingList);
      const matchesMarketingList =
        !marketingListNorm || lists.includes(marketingListNorm);

      const matchesType =
        !typeNorm || normalizeText(c?.client?.type).includes(typeNorm);

      const serviceHaystack = normalizeText(
        (c?.client?.services ?? [])
          .map((s: any) => s?.service?.name ?? "")
          .filter(Boolean)
          .join(" ")
      );
      const matchesService = !serviceNorm || serviceHaystack.includes(serviceNorm);

      return (
        matchesQ &&
        matchesRole &&
        matchesMarketingList &&
        matchesType &&
        matchesService
      );
    });

    const rows = [
      ["email", "nome", "ruolo", "liste_marketing", "cliente", "telefono", "tipo_struttura"],
      ...contacts.map((c: any) => [
        c.email ?? "",
        c.name ?? "",
        c.role ?? "",
        parseLists(c.marketingList).join(", "),
        c.client?.name ?? "",
        c.phone ?? "",
        c.client?.type ?? "",
      ]),
    ];

    const csv = "\uFEFF" + rows.map((r) => r.map(csvCell).join(";")).join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="voxmail-contatti.csv"',
      },
    });
  } catch (e: any) {
    return new NextResponse(String(e?.message ?? "Errore export contatti"), {
      status: 500,
    });
  }
}