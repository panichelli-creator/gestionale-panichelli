import { prisma } from "@/lib/prisma";

function firstDayOfMonth(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, 1));
}
function firstDayNextMonth(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, (m ?? 1), 1));
}

function csvEscape(v: any) {
  const s = String(v ?? "");
  if (/[
",;]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
  return s;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = String(url.searchParams.get("q") ?? "").trim();

  const now = new Date();
  const defaultYm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const due = String(url.searchParams.get("due") ?? defaultYm).trim();

  const fatturata = String(url.searchParams.get("fatturata") ?? "TUTTE").trim();

  const from = firstDayOfMonth(due);
  const to = firstDayNextMonth(due);

  const where: any = {
    dataProssimoAppuntamento: { gte: from, lt: to },
  };
  if (fatturata === "0") where.fatturata = false;
  if (fatturata === "1") where.fatturata = true;

  if (q) {
    where.OR = [
      { nomeClienteSnapshot: { contains: q } },
      { indirizzoSedeSnapshot: { contains: q } },
      { contattiMail: { contains: q } },
      { contattiCellulare: { contains: q } },
    ];
  }

  const rows = await prisma.clinicalEngineeringCheck.findMany({
    where,
    orderBy: { dataProssimoAppuntamento: "asc" },
    take: 5000,
  });

  const header = [
    "ID",
    "Cliente",
    "Sede",
    "Num apparecchiature",
    "Agg",
    "Costo servizio",
    "Trasferta",
    "Quota tecnico",
    "Ultimo appuntamento",
    "Prossimo appuntamento",
    "Email",
    "Cellulare",
    "Contatti studio",
    "Verifiche eseguite",
    "File su Dropbox",
    "Fatturata",
    "Note",
  ];

  const lines = [header.map(csvEscape).join(";")];

  for (const r of rows) {
    lines.push(
      [
        r.id,
        r.nomeClienteSnapshot,
        r.indirizzoSedeSnapshot ?? "",
        r.numApparecchiature,
        r.apparecchiatureAggiuntive,
        Number(r.costoServizio || 0).toFixed(2),
        Number(r.importoTrasferta || 0).toFixed(2),
        Number(r.quotaTecnico || 0).toFixed(2),
        r.dataUltimoAppuntamento ? new Date(r.dataUltimoAppuntamento).toISOString().slice(0, 10) : "",
        new Date(r.dataProssimoAppuntamento).toISOString().slice(0, 10),
        r.contattiMail ?? "",
        r.contattiCellulare ?? "",
        r.contattiStudio ?? "",
        r.verificheEseguite ? "SI" : "NO",
        r.fileSuDropbox ? "SI" : "NO",
        r.fatturata ? "SI" : "NO",
        r.notes ?? "",
      ].map(csvEscape).join(";")
    );
  }

  const csv = "﻿" + lines.join("
");
  const filename = `ingegneria-clinica_${due}.csv`;

  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${filename}"`,
    },
  });
}
