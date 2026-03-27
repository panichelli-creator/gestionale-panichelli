import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function fmtDate(d: Date | null | undefined) {
  return d ? new Date(d).toLocaleDateString("it-IT") : "—";
}

function toNum(v: any): number {
  if (v == null) return 0;
  const s = typeof v === "number" ? String(v) : String(v?.toString?.() ?? v);
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function eur(v: any) {
  return toNum(v).toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

function cleanText(v: any) {
  const s = String(v ?? "").trim();
  if (!s) return "—";

  if (s.includes("VSE_CHECK:")) {
    const parts = s
      .split("•")
      .map((x) => x.trim())
      .filter(Boolean);

    const cleaned = parts.filter((x) => !x.startsWith("VSE_CHECK:"));
    if (cleaned.length) return cleaned.join(" • ");
  }

  return s;
}

function yesNo(v: any) {
  return v ? "Sì" : "No";
}

function getAppointmentTaken(item: any) {
  const candidates = [
    item?.appuntamentoPreso,
    item?.appointmentTaken,
    item?.hasAppointment,
    item?.conAppuntamento,
    item?.isAppointmentBooked,
  ];

  return candidates.some((v) => v === true);
}

function getAppointmentDate(item: any): Date | null {
  const candidates = [
    item?.dataAppuntamento,
    item?.appointmentDate,
    item?.agendaDate,
    item?.plannedDate,
    item?.dataAgenda,
  ];

  for (const v of candidates) {
    if (!v) continue;
    const d = new Date(v);
    if (!Number.isNaN(d.getTime())) return d;
  }

  return null;
}

export default async function ClinicalEngineeringDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const item = await prisma.clinicalEngineeringCheck.findUnique({
    where: { id: params.id },
    include: { client: true, site: true as any },
  } as any);

  if (!item) return notFound();

  const row: any = item;
  const appointmentTaken = getAppointmentTaken(row);
  const appointmentDate = getAppointmentDate(row);

  const clientLabel = cleanText(
    row.client?.name ??
      row.nomeClienteSnapshot ??
      row.clientName ??
      row.clienteNome
  );

  const siteLabel = cleanText(
    row.site?.name ??
      row.nomeSedeSnapshot ??
      row.siteName
  );

  const addressLabel = cleanText(
    row.indirizzoSedeSnapshot ??
      row.site?.address ??
      row.client?.address ??
      row.client?.legalSeat
  );

  return (
    <div className="card">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Verifica Ingegneria Clinica</h1>
          <div className="muted" style={{ marginTop: 6 }}>
            Cliente: <b>{clientLabel}</b>
          </div>
        </div>

        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
          <Link className="btn" href="/ingegneria-clinica">
            ← Ingegneria Clinica
          </Link>
          <Link className="btn primary" href={`/ingegneria-clinica/${item.id}/edit`}>
            Modifica
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="grid3">
          <div>
            <div className="muted">Cliente</div>
            <div>{clientLabel}</div>
          </div>
          <div>
            <div className="muted">Sede</div>
            <div>{siteLabel}</div>
          </div>
          <div>
            <div className="muted">Indirizzo</div>
            <div>{addressLabel}</div>
          </div>

          <div>
            <div className="muted">Periodicità</div>
            <div>{row.periodicita ?? "ANNUALE"}</div>
          </div>
          <div>
            <div className="muted">N. apparecchiature</div>
            <div>{row.numApparecchiature}</div>
          </div>
          <div>
            <div className="muted">App. aggiuntive</div>
            <div>{row.apparecchiatureAggiuntive}</div>
          </div>

          <div>
            <div className="muted">Costo servizio</div>
            <div>{eur(row.costoServizio)}</div>
          </div>
          <div>
            <div className="muted">Quota tecnico</div>
            <div>{eur(row.quotaTecnico)}</div>
          </div>
          <div>
            <div className="muted">Trasferta</div>
            <div>{eur(row.importoTrasferta)}</div>
          </div>

          <div>
            <div className="muted">Ultima verifica</div>
            <div>{fmtDate(row.dataUltimoAppuntamento)}</div>
          </div>
          <div>
            <div className="muted">Prossima verifica</div>
            <div>{fmtDate(row.dataProssimoAppuntamento)}</div>
          </div>
          <div>
            <div className="muted">Verifiche eseguite</div>
            <div>{yesNo(row.verificheEseguite)}</div>
          </div>

          <div>
            <div className="muted">Appuntamento</div>
            <div>{appointmentTaken ? "Preso" : "Da prendere"}</div>
          </div>
          <div>
            <div className="muted">Data appuntamento</div>
            <div>{fmtDate(appointmentDate)}</div>
          </div>
          <div>
            <div className="muted">File su Dropbox</div>
            <div>{yesNo(row.fileSuDropbox)}</div>
          </div>
        </div>

        {appointmentTaken || appointmentDate ? (
          <div
            className="card"
            style={{
              marginTop: 12,
              padding: 12,
              border: "1px solid rgba(37,99,235,0.20)",
              background: "rgba(37,99,235,0.04)",
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: 6 }}>Agenda appuntamento</div>
            <div className="muted">
              Stato: <b>{appointmentTaken ? "Appuntamento preso" : "Da confermare"}</b>
            </div>
            <div className="muted" style={{ marginTop: 4 }}>
              Data: <b>{fmtDate(appointmentDate)}</b>
            </div>
          </div>
        ) : null}

        {row.notes ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted">Note</div>
            <div style={{ whiteSpace: "pre-wrap" }}>{row.notes}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}