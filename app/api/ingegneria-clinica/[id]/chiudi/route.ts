import { NextResponse } from "next/server";


export const dynamic = "force-dynamic";

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

export async function POST(...args) {
  const { prisma } = await import("@/lib/prisma");(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const current = await prisma.clinicalEngineeringCheck.findUnique({
      where: { id: params.id },
    });

    if (!current) {
      return new NextResponse("Verifica non trovata", { status: 404 });
    }

    const executedAt =
      current.dataAppuntamentoPreso ??
      current.dataProssimoAppuntamento ??
      current.dataUltimoAppuntamento;

    if (!executedAt) {
      return new NextResponse("Data verifica mancante", { status: 400 });
    }

    const next = calcNextDate(
      executedAt,
      String(current.periodicita ?? "ANNUALE").toUpperCase()
    );

    await prisma.clinicalEngineeringCheck.update({
      where: { id: params.id },
      data: {
        verificheEseguite: true,
        dataUltimoAppuntamento: executedAt,
        dataProssimoAppuntamento: next,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return new NextResponse(String(e?.message ?? e ?? "Errore"), {
      status: 500,
    });
  }
}