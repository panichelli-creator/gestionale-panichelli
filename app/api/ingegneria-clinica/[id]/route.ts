import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function num(v: any, fallback = 0) {
  if (v === "" || v == null) return fallback;
  const s = typeof v === "number" ? String(v) : String(v?.toString?.() ?? v);
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) ? n : fallback;
}

function dec(v: any, fallback = 0) {
  return new Prisma.Decimal(num(v, fallback));
}

function textOrNull(v: any) {
  const s = String(v ?? "").trim();
  return s || null;
}

function dateOrNull(v: any) {
  const s = String(v ?? "").trim();
  if (!s) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function calcNextDate(last: Date | null, periodicita: string) {
  if (!last) return null;
  const d = new Date(last);
  const p = String(periodicita ?? "ANNUALE").trim().toUpperCase();

  if (p === "SEMESTRALE") {
    d.setUTCMonth(d.getUTCMonth() + 6);
    return d;
  }

  if (p === "BIENNALE") {
    d.setUTCFullYear(d.getUTCFullYear() + 2);
    return d;
  }

  d.setUTCFullYear(d.getUTCFullYear() + 1);
  return d;
}

async function buildSafeUpdateData(id: string, body: any) {
  const { prisma } = await import("@/lib/prisma");

  const current = await prisma.clinicalEngineeringCheck.findUnique({
    where: { id },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          legalSeat: true,
          operativeSeat: true,
          address: true,
        },
      },
      site: {
        select: {
          id: true,
          name: true,
          address: true,
          city: true,
          province: true,
          cap: true,
          clientId: true,
        },
      },
    },
  });

  if (!current) return null;

  const clientId = String(body.clientId ?? current.clientId ?? "").trim() || null;
  const siteId = String(body.siteId ?? current.siteId ?? "").trim() || null;

  let client: any = current.client;
  let site: any = current.site;

  if (clientId) {
    client = await prisma.client.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        legalSeat: true,
        operativeSeat: true,
        address: true,
      },
    });
    if (!client) return { error: "Cliente non trovato" };
  } else {
    client = null;
  }

  if (siteId) {
    site = await prisma.clientSite.findUnique({
      where: { id: siteId },
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        province: true,
        cap: true,
        clientId: true,
      },
    });

    if (!site) return { error: "Sede non trovata" };
    if (clientId && site.clientId !== clientId) {
      return { error: "La sede non appartiene al cliente." };
    }
  } else {
    site = null;
  }

  const periodicita = String(body.periodicita ?? current.periodicita ?? "ANNUALE")
    .trim()
    .toUpperCase();

  const lastDate = dateOrNull(body.dataUltimoAppuntamento ?? current.dataUltimoAppuntamento);
  const appointmentDate = dateOrNull(
    body.dataAppuntamentoPreso ?? current.dataAppuntamentoPreso
  );

  const nextDate =
    dateOrNull(body.dataProssimoAppuntamento ?? current.dataProssimoAppuntamento) ??
    calcNextDate(lastDate, periodicita);

  const costoServizio = num(body.costoServizio ?? current.costoServizio, 0);
  const quotaTecnicoPerc = num(body.quotaTecnicoPerc ?? current.quotaTecnicoPerc, 40);
  const quotaTecnico =
    Number.isFinite(num(body.quotaTecnico, NaN))
      ? num(body.quotaTecnico)
      : (costoServizio * quotaTecnicoPerc) / 100;

  return {
    clientId,
    siteId,
    nomeClienteSnapshot: client?.name ?? current.nomeClienteSnapshot ?? null,
    nomeSedeSnapshot: site?.name ?? current.nomeSedeSnapshot ?? null,
    indirizzoSedeSnapshot:
      [site?.address, site?.city, site?.province, site?.cap].filter(Boolean).join(" ") ||
      current.indirizzoSedeSnapshot ||
      null,

    contattiMail: client?.email ?? current.contattiMail ?? null,
    contattiCellulare: client?.phone ?? current.contattiCellulare ?? null,

    numApparecchiature: Math.max(
      0,
      Math.trunc(num(body.numApparecchiature ?? current.numApparecchiature, 0))
    ),

    apparecchiatureAggiuntive: Math.max(
      0,
      Math.trunc(num(body.apparecchiatureAggiuntive ?? current.apparecchiatureAggiuntive, 0))
    ),

    costoServizio: dec(costoServizio, 0),
    quotaTecnicoPerc: dec(quotaTecnicoPerc, 40),
    quotaTecnico: dec(quotaTecnico, 0),
    importoTrasferta: dec(body.importoTrasferta ?? current.importoTrasferta, 0),

    periodicita,
    dataUltimoAppuntamento: lastDate,
    dataAppuntamentoPreso: appointmentDate,
    dataProssimoAppuntamento: nextDate,

    verificheEseguite: Boolean(body.verificheEseguite ?? current.verificheEseguite),
    fileSuDropbox: Boolean(body.fileSuDropbox ?? current.fileSuDropbox),
    fatturata: Boolean(body.fatturata ?? current.fatturata),
    tecnicoFatturato: Boolean(body.tecnicoFatturato ?? current.tecnicoFatturato),

    notes: textOrNull(body.notes) ?? current.notes ?? null,
  };
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { prisma } = await import("@/lib/prisma");

  const item = await prisma.clinicalEngineeringCheck.findUnique({
    where: { id: params.id },
    include: { client: true, site: true },
  });

  if (!item) return new NextResponse("Not found", { status: 404 });

  return NextResponse.json(item);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { prisma } = await import("@/lib/prisma");

  const body = await req.json().catch(() => ({}));
  const data = await buildSafeUpdateData(params.id, body);

  if (!data || "error" in data)
    return new NextResponse("Errore", { status: 400 });

  await prisma.clinicalEngineeringCheck.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { prisma } = await import("@/lib/prisma");

  await prisma.clinicalEngineeringCheck.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ ok: true });
}