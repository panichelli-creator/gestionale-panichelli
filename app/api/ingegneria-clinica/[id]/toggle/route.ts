import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function toNum(v: any): number {
  if (v == null) return 0;
  const s = typeof v === "number" ? String(v) : String(v?.toString?.() ?? v);
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function ymFromDate(d: Date | null | undefined) {
  const x = d ? new Date(d) : new Date();
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}`;
}

function calcNextDate(last: Date | null, periodicita: string) {
  if (!last) return null;

  const d = new Date(last);
  const p = String(periodicita ?? "ANNUALE").toUpperCase().trim();

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

async function findVseServiceId() {
  const vseService = await prisma.serviceCatalog.findFirst({
    where: {
      OR: [{ name: "VSE" }, { name: "INGEGNERIA CLINICA" }, { name: "Ingegneria Clinica" }],
    },
    select: { id: true },
  });

  return vseService?.id ?? null;
}

async function syncClinicalCheckWorkReport(checkId: string) {
  const check = await prisma.clinicalEngineeringCheck.findUnique({
    where: { id: checkId },
    include: {
      client: true,
      site: true,
    },
  });

  if (!check || !check.clientId) return;

  const noteTag = `[VSE_CHECK:${check.id}]`;

  const workedAt =
    check.dataUltimoAppuntamento ??
    check.dataAppuntamentoPreso ??
    check.dataProssimoAppuntamento ??
    check.updatedAt ??
    new Date();

  const ym = ymFromDate(workedAt);
  const amountEur = toNum(check.costoServizio) + toNum(check.importoTrasferta);

  const existing = await prisma.workReport.findFirst({
    where: {
      clientId: check.clientId,
      notes: { contains: noteTag },
    },
    select: { id: true },
  });

  if (!check.fatturata) {
    if (existing) {
      await prisma.workReport.delete({
        where: { id: existing.id },
      });
    }
    return;
  }

  const serviceId = await findVseServiceId();

  const notesParts = [
    noteTag,
    "VSE",
    check.client?.name ?? check.nomeClienteSnapshot ?? "",
    check.site?.name ?? check.nomeSedeSnapshot ?? "",
  ].filter(Boolean);

  if (existing) {
    await prisma.workReport.update({
      where: { id: existing.id },
      data: {
        ym,
        clientId: check.clientId,
        serviceId,
        siteId: check.siteId ?? null,
        amountEur,
        workedAt,
        notes: notesParts.join(" • "),
      },
    });
    return;
  }

  await prisma.workReport.create({
    data: {
      ym,
      clientId: check.clientId,
      serviceId,
      siteId: check.siteId ?? null,
      amountEur,
      workedAt,
      notes: notesParts.join(" • "),
    },
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const field = String(body.field ?? "").trim();
    const value = Boolean(body.value);

    if (!["verificheEseguite", "fileSuDropbox", "fatturata", "tecnicoFatturato"].includes(field)) {
      return new NextResponse("Campo non valido", { status: 400 });
    }

    const current = await prisma.clinicalEngineeringCheck.findUnique({
      where: { id: params.id },
    });

    if (!current) {
      return new NextResponse("Verifica non trovata", { status: 404 });
    }

    const data: any = {
      [field]: value,
    };

    if (field === "verificheEseguite" && value) {
      const executedAt =
        current.dataAppuntamentoPreso ??
        current.dataProssimoAppuntamento ??
        current.dataUltimoAppuntamento ??
        null;

      if (executedAt) {
        data.dataUltimoAppuntamento = executedAt;
        data.dataProssimoAppuntamento = calcNextDate(
          executedAt,
          String(current.periodicita ?? "ANNUALE").toUpperCase()
        );
      }
    }

    if (field === "fatturata") {
      data.fatturataAt = value ? new Date() : null;
    }

    if (field === "tecnicoFatturato") {
      data.tecnicoFatturatoAt = value ? new Date() : null;
    }

    const updated = await prisma.clinicalEngineeringCheck.update({
      where: { id: params.id },
      data,
      select: {
        id: true,
        verificheEseguite: true,
        fileSuDropbox: true,
        fatturata: true,
        tecnicoFatturato: true,
        fatturataAt: true,
        tecnicoFatturatoAt: true,
        dataUltimoAppuntamento: true,
        dataAppuntamentoPreso: true,
        dataProssimoAppuntamento: true,
      },
    });

    if (field === "fatturata" || field === "verificheEseguite") {
      await syncClinicalCheckWorkReport(params.id);
    }

    return NextResponse.json({
      ok: true,
      id: updated.id,
      verificheEseguite: updated.verificheEseguite,
      fileSuDropbox: updated.fileSuDropbox,
      fatturata: updated.fatturata,
      tecnicoFatturato: updated.tecnicoFatturato,
      fatturataAt: updated.fatturataAt,
      tecnicoFatturatoAt: updated.tecnicoFatturatoAt,
      dataUltimoAppuntamento: updated.dataUltimoAppuntamento,
      dataAppuntamentoPreso: updated.dataAppuntamentoPreso,
      dataProssimoAppuntamento: updated.dataProssimoAppuntamento,
    });
  } catch (e: any) {
    return new NextResponse(String(e?.message ?? e ?? "Errore"), {
      status: 500,
    });
  }
}