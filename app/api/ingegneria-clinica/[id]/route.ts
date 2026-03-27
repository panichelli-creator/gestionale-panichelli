import { NextResponse } from "next/server";

import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

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
      return { error: "La sede selezionata non appartiene al cliente scelto." };
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
  const quotaTecnicoBody = num(body.quotaTecnico, NaN);
  const quotaTecnico = Number.isFinite(quotaTecnicoBody)
    ? quotaTecnicoBody
    : (costoServizio * quotaTecnicoPerc) / 100;

  const indirizzoSnapshotBody = String(body.indirizzoSedeSnapshot ?? "").trim();
  const indirizzoSnapshotComputed =
    [site?.address, site?.city, site?.province, site?.cap].filter(Boolean).join(" ") ||
    current.indirizzoSedeSnapshot ||
    client?.operativeSeat ||
    client?.legalSeat ||
    client?.address ||
    "";

  return {
    clientId,
    siteId,

    nomeClienteSnapshot:
      String(body.nomeClienteSnapshot ?? "").trim() ||
      client?.name ||
      current.nomeClienteSnapshot ||
      null,

    nomeSedeSnapshot:
      String(body.nomeSedeSnapshot ?? "").trim() ||
      site?.name ||
      current.nomeSedeSnapshot ||
      null,

    indirizzoSedeSnapshot: indirizzoSnapshotBody || indirizzoSnapshotComputed || null,

    studioRifAmministrativo:
      textOrNull(body.studioRifAmministrativo) ??
      current.studioRifAmministrativo ??
      null,

    contattiMail:
      textOrNull(body.contattiMail) ??
      client?.email ??
      current.contattiMail ??
      null,

    contattiCellulare:
      textOrNull(body.contattiCellulare) ??
      client?.phone ??
      current.contattiCellulare ??
      null,

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

export async function GET(...args) {
  const { prisma } = await import("@/lib/prisma");(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.clinicalEngineeringCheck.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        site: true,
      },
    });

    if (!item) {
      return new NextResponse("Verifica non trovata", { status: 404 });
    }

    return NextResponse.json(item);
  } catch (e: any) {
    return new NextResponse(String(e?.message ?? e ?? "Errore"), {
      status: 500,
    });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const data = await buildSafeUpdateData(params.id, body);

    if (!data) {
      return new NextResponse("Verifica non trovata", { status: 404 });
    }

    if ("error" in data) {
      return new NextResponse(data.error, { status: 400 });
    }

    const updated = await prisma.clinicalEngineeringCheck.update({
      where: { id: params.id },
      data,
      select: { id: true },
    });

    return NextResponse.json({ ok: true, id: updated.id });
  } catch (e: any) {
    return new NextResponse(String(e?.message ?? e ?? "Errore"), {
      status: 500,
    });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const data = await buildSafeUpdateData(params.id, body);

    if (!data) {
      return new NextResponse("Verifica non trovata", { status: 404 });
    }

    if ("error" in data) {
      return new NextResponse(data.error, { status: 400 });
    }

    const updated = await prisma.clinicalEngineeringCheck.update({
      where: { id: params.id },
      data,
      select: { id: true },
    });

    return NextResponse.json({ ok: true, id: updated.id });
  } catch (e: any) {
    return new NextResponse(String(e?.message ?? e ?? "Errore"), {
      status: 500,
    });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.clinicalEngineeringCheck.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return new NextResponse(String(e?.message ?? e ?? "Errore"), {
      status: 500,
    });
  }
}