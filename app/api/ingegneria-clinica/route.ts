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

export async function POST(req: Request) {
  const { prisma } = await import("@/lib/prisma");
  try {
    const body = await req.json().catch(() => ({} as any));

    const clientIdRaw = String(body.clientId ?? "").trim();
    const siteIdRaw = String(body.siteId ?? "").trim();

    const clientId = clientIdRaw || null;
    const siteId = siteIdRaw || null;

    let client: {
      id: string;
      name: string;
      email: string | null;
      phone: string | null;
      legalSeat: string | null;
      operativeSeat: string | null;
      address: string | null;
    } | null = null;

    let site: {
      id: string;
      name: string;
      address: string | null;
      city: string | null;
      province: string | null;
      cap: string | null;
      clientId: string;
    } | null = null;

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

      if (!client) {
        return new NextResponse("Cliente non trovato.", { status: 400 });
      }
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

      if (!site) {
        return new NextResponse("Sede non trovata.", { status: 400 });
      }

      if (clientId && site.clientId !== clientId) {
        return new NextResponse("La sede selezionata non appartiene al cliente scelto.", {
          status: 400,
        });
      }
    }

    const periodicita =
      String(body.periodicita ?? "ANNUALE").trim().toUpperCase() || "ANNUALE";

    const lastDate = dateOrNull(body.dataUltimoAppuntamento);
    const appointmentDate = dateOrNull(body.dataAppuntamentoPreso);
    const nextDate =
      dateOrNull(body.dataProssimoAppuntamento) ?? calcNextDate(lastDate, periodicita);

    const nomeClienteSnapshot =
      String(body.nomeClienteSnapshot ?? "").trim() || client?.name || null;

    const nomeSedeSnapshot =
      String(body.nomeSedeSnapshot ?? "").trim() || site?.name || null;

    const indirizzoSedeSnapshot =
      String(body.indirizzoSedeSnapshot ?? "").trim() ||
      [site?.address, site?.city, site?.province, site?.cap].filter(Boolean).join(" ") ||
      client?.operativeSeat ||
      client?.legalSeat ||
      client?.address ||
      null;

    const costoServizio = num(body.costoServizio, 0);
    const quotaTecnicoPerc = num(body.quotaTecnicoPerc, 40);

    const quotaTecnicoBody = num(body.quotaTecnico, NaN);
    const quotaTecnico = Number.isFinite(quotaTecnicoBody)
      ? quotaTecnicoBody
      : (costoServizio * quotaTecnicoPerc) / 100;

    const created = await prisma.clinicalEngineeringCheck.create({
      data: {
        clientId,
        siteId,

        nomeClienteSnapshot,
        nomeSedeSnapshot,
        indirizzoSedeSnapshot,

        studioRifAmministrativo:
          String(body.studioRifAmministrativo ?? "").trim() || null,

        contattiMail:
          String(body.contattiMail ?? "").trim() || client?.email || null,

        contattiCellulare:
          String(body.contattiCellulare ?? "").trim() || client?.phone || null,

        numApparecchiature: Math.max(0, Math.trunc(num(body.numApparecchiature, 0))),
        apparecchiatureAggiuntive: Math.max(
          0,
          Math.trunc(num(body.apparecchiatureAggiuntive, 0))
        ),

        costoServizio: dec(costoServizio, 0),
        quotaTecnicoPerc: dec(quotaTecnicoPerc, 40),
        quotaTecnico: dec(quotaTecnico, 0),
        importoTrasferta: dec(body.importoTrasferta, 0),

        periodicita,

        dataUltimoAppuntamento: lastDate,
        dataAppuntamentoPreso: appointmentDate,
        dataProssimoAppuntamento: nextDate,

        verificheEseguite: Boolean(body.verificheEseguite),
        fileSuDropbox: Boolean(body.fileSuDropbox),
        fatturata: Boolean(body.fatturata),
        tecnicoFatturato: Boolean(body.tecnicoFatturato),

        notes: String(body.notes ?? "").trim() || null,
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, id: created.id });
  } catch (e: any) {
    return new NextResponse(String(e?.message ?? e ?? "Errore"), { status: 500 });
  }
}