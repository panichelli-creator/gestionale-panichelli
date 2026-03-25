import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const field = String(body.field ?? "").trim();
    const value = body.value;

    const current = await prisma.clinicalEngineeringCheck.findUnique({
      where: { id: params.id },
    });

    if (!current) {
      return new NextResponse("Verifica non trovata", { status: 404 });
    }

    const data: any = {};

    if (field === "dataUltimoAppuntamento") {
      const last = dateOrNull(value);
      data.dataUltimoAppuntamento = last;
      data.dataProssimoAppuntamento = calcNextDate(
        last,
        String(current.periodicita ?? "ANNUALE").toUpperCase()
      );
    } else if (field === "dataAppuntamentoPreso") {
      data.dataAppuntamentoPreso = dateOrNull(value);
    } else if (field === "periodicita") {
      const p = String(value ?? "ANNUALE").toUpperCase().trim();
      data.periodicita = p;
      data.dataProssimoAppuntamento = calcNextDate(
        current.dataUltimoAppuntamento,
        p
      );
    } else if (field === "dataProssimoAppuntamento") {
      data.dataProssimoAppuntamento = dateOrNull(value);
    } else if (field === "costoServizio") {
      const costo = num(value, 0);
      const perc = num(current.quotaTecnicoPerc, 40);

      data.costoServizio = dec(costo, 0);
      data.quotaTecnico = dec((costo * perc) / 100, 0);
    } else if (field === "quotaTecnicoPerc") {
      const perc = num(value, 40);
      const costo = num(current.costoServizio, 0);

      data.quotaTecnicoPerc = dec(perc, 40);
      data.quotaTecnico = dec((costo * perc) / 100, 0);
    } else if (field === "quotaTecnico") {
      data.quotaTecnico = dec(value, 0);
    } else if (field === "importoTrasferta") {
      data.importoTrasferta = dec(value, 0);
    } else if (field === "verificheEseguite") {
      const done = Boolean(value);
      data.verificheEseguite = done;

      if (done) {
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
    } else {
      data[field] = value;
    }

    const updated = await prisma.clinicalEngineeringCheck.update({
      where: { id: params.id },
      data,
      select: {
        id: true,
        dataUltimoAppuntamento: true,
        dataAppuntamentoPreso: true,
        dataProssimoAppuntamento: true,
        periodicita: true,
        verificheEseguite: true,
        costoServizio: true,
        quotaTecnicoPerc: true,
        quotaTecnico: true,
        importoTrasferta: true,
      },
    });

    return NextResponse.json({
      ok: true,
      id: updated.id,
      dataUltimoAppuntamento: updated.dataUltimoAppuntamento,
      dataAppuntamentoPreso: updated.dataAppuntamentoPreso,
      dataProssimoAppuntamento: updated.dataProssimoAppuntamento,
      periodicita: updated.periodicita,
      verificheEseguite: updated.verificheEseguite,
      costoServizio: updated.costoServizio,
      quotaTecnicoPerc: updated.quotaTecnicoPerc,
      quotaTecnico: updated.quotaTecnico,
      importoTrasferta: updated.importoTrasferta,
    });
  } catch (e: any) {
    return new NextResponse(String(e?.message ?? e ?? "Errore"), {
      status: 500,
    });
  }
}