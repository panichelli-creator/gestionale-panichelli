export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";

import { getSession } from "@/lib/session";
import ChecksTableClient from "@/components/ingegneria-clinica/ChecksTableClient";

type SP = {
  q?: string;
  tab?: string;
  dueDate?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  eseguite?: string;
  fatturate?: string;
  clientId?: string;
};

function toNum(v: any): number {
  if (v == null) return 0;
  const s = typeof v === "number" ? String(v) : String(v?.toString?.() ?? v);
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function eur(n: number) {
  return n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function startOfYear(d: Date) {
  return new Date(d.getFullYear(), 0, 1);
}

function startOfNextYear(d: Date) {
  return new Date(d.getFullYear() + 1, 0, 1);
}

function isDateInCurrentYear(value: Date | string | null | undefined, now: Date) {
  if (!value) return false;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return false;
  const from = startOfYear(now);
  const to = startOfNextYear(now);
  return d >= from && d < to;
}

function getStatus(d: Date | string | null | undefined) {
  if (!d) return "IN_REGOLA";

  const due = startOfDay(new Date(d));
  const today = startOfDay(new Date());
  const in30 = new Date(today);
  in30.setDate(in30.getDate() + 30);

  if (due < today) return "SCADUTE";
  if (due <= in30) return "PROSSIMI30";
  return "IN_REGOLA";
}

function hrefWith(params: {
  q?: string;
  tab?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  eseguite?: string;
  fatturate?: string;
  clientId?: string;
}) {
  const qs = new URLSearchParams();

  if (params.q) qs.set("q", params.q);
  if (params.tab) qs.set("tab", params.tab);
  if (params.dueDateFrom) qs.set("dueDateFrom", params.dueDateFrom);
  if (params.dueDateTo) qs.set("dueDateTo", params.dueDateTo);
  if (params.eseguite) qs.set("eseguite", params.eseguite);
  if (params.fatturate) qs.set("fatturate", params.fatturate);
  if (params.clientId) qs.set("clientId", params.clientId);

  const q = qs.toString();
  return q ? `/ingegneria-clinica?${q}` : "/ingegneria-clinica";
}

function normalizeText(v: any) {
  return String(v ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDateForSearch(value: Date | string | null | undefined) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = String(d.getFullYear());

  return [
    d.toLocaleDateString("it-IT"),
    `${dd}/${mm}/${yyyy}`,
    `${dd}-${mm}-${yyyy}`,
    `${yyyy}-${mm}-${dd}`,
  ].join(" ");
}

export default async function ClinicalEngineeringPage({
  searchParams,
}: {
  searchParams?: SP;
}) {
  const { prisma } = await import("@/lib/prisma");
  const session = getSession();
  const isIngegnereClinico = session?.role === "ingegnere_clinico";

  const q = normalizeText(searchParams?.q ?? "");
  const tab = String(searchParams?.tab ?? "TUTTE").trim().toUpperCase();

  const oldDueDate = String(searchParams?.dueDate ?? "").trim();
  const dueDateFrom = String(searchParams?.dueDateFrom ?? oldDueDate).trim();
  const dueDateTo = String(searchParams?.dueDateTo ?? "").trim();

  const eseguite = String(searchParams?.eseguite ?? "").trim().toUpperCase();
  const fatturate = String(searchParams?.fatturate ?? "").trim().toUpperCase();
  const clientId = String(searchParams?.clientId ?? "").trim();

  const currentClient = clientId
    ? await prisma.client.findUnique({
        where: { id: clientId },
        select: { id: true, name: true },
      })
    : null;

  const effectiveClientId = currentClient?.id ?? "";

  const checks = await prisma.clinicalEngineeringCheck.findMany({
    where: effectiveClientId ? { clientId: effectiveClientId } : undefined,
    include: {
      client: true,
      site: true,
    },
    orderBy: [{ dataProssimoAppuntamento: "asc" }, { createdAt: "desc" }],
  });

  const filtered = checks.filter((r: any) => {
    const clientName = r.client?.name ?? r.nomeClienteSnapshot ?? "";
    const clientEmail = r.client?.email ?? "";
    const clientPhone = r.client?.phone ?? "";
    const clientPec = r.client?.pec ?? "";
    const clientVatNumber = r.client?.vatNumber ?? "";
    const clientUniqueCode = r.client?.uniqueCode ?? "";
    const clientAddress = r.client?.address ?? "";
    const clientLegalSeat = r.client?.legalSeat ?? "";
    const clientOperativeSeat = r.client?.operativeSeat ?? "";
    const clientNotes = r.client?.notes ?? "";

    const siteName = r.site?.name ?? r.nomeSedeSnapshot ?? "";
    const siteAddress = r.site?.address ?? "";
    const siteCity = r.site?.city ?? "";
    const siteProvince = r.site?.province ?? "";
    const siteCap = r.site?.cap ?? "";
    const siteSnapshotAddress = r.indirizzoSedeSnapshot ?? "";

    const referente = r.referente ?? "";
    const telefonoReferente = r.telefonoReferente ?? "";

    const appPresoText = formatDateForSearch(r.dataAppuntamentoPreso);
    const ultimoAppText = formatDateForSearch(r.dataUltimoAppuntamento);
    const prossimoAppText = formatDateForSearch(r.dataProssimoAppuntamento);

    const periodicita = r.periodicita ?? "";
    const stato = getStatus(r.dataProssimoAppuntamento ?? null);

    const hay = normalizeText(
      [
        clientName,
        clientEmail,
        clientPhone,
        clientPec,
        clientVatNumber,
        clientUniqueCode,
        clientAddress,
        clientLegalSeat,
        clientOperativeSeat,
        clientNotes,
        siteName,
        siteAddress,
        siteCity,
        siteProvince,
        siteCap,
        siteSnapshotAddress,
        referente,
        telefonoReferente,
        appPresoText,
        ultimoAppText,
        prossimoAppText,
        periodicita,
        stato,
      ]
        .filter(Boolean)
        .join(" ")
    );

    if (q && !hay.includes(q)) return false;

    if (tab !== "TUTTE" && stato !== tab) return false;

    if (dueDateFrom || dueDateTo) {
      const due = r.dataProssimoAppuntamento
        ? startOfDay(new Date(r.dataProssimoAppuntamento))
        : null;

      if (!due) return false;

      if (dueDateFrom) {
        const from = startOfDay(new Date(`${dueDateFrom}T00:00:00`));
        if (due < from) return false;
      }

      if (dueDateTo) {
        const to = startOfDay(new Date(`${dueDateTo}T00:00:00`));
        if (due > to) return false;
      }
    }

    if (eseguite === "SI" && !r.verificheEseguite) return false;
    if (eseguite === "NO" && r.verificheEseguite) return false;

    if (fatturate === "SI" && !r.fatturata) return false;
    if (fatturate === "NO" && r.fatturata) return false;

    return true;
  });

  const total = checks.length;

  const scadute = checks.filter(
    (r: any) => getStatus(r.dataProssimoAppuntamento ?? null) === "SCADUTE"
  ).length;

  const prossimi30 = checks.filter(
    (r: any) => getStatus(r.dataProssimoAppuntamento ?? null) === "PROSSIMI30"
  ).length;

  const inRegola = checks.filter(
    (r: any) => getStatus(r.dataProssimoAppuntamento ?? null) === "IN_REGOLA"
  ).length;

  const appointmentTakenCount = checks.filter((r: any) => Boolean(r.dataAppuntamentoPreso)).length;
  const appointmentToTakeCount = checks.filter((r: any) => !Boolean(r.dataAppuntamentoPreso)).length;

  const checksEseguite = checks.filter((r: any) => Boolean(r.verificheEseguite));
  const checksCompletateTotali = checks.filter(
    (r: any) => Boolean(r.fatturata) && Boolean(r.tecnicoFatturato)
  );

  const now = new Date();

  const checksFatturateClienteAnnoCorrente = checks.filter(
    (r: any) => Boolean(r.fatturata) && isDateInCurrentYear((r as any).fatturataAt, now)
  );

  const checksTecnicoPagatoAnnoCorrente = checks.filter(
    (r: any) =>
      Boolean(r.tecnicoFatturato) && isDateInCurrentYear((r as any).tecnicoFatturatoAt, now)
  );

  const totaleClienteDaFatturare = checksEseguite
    .filter((r: any) => !Boolean(r.fatturata))
    .reduce((acc: number, r: any) => {
      return acc + toNum(r.costoServizio) + toNum(r.importoTrasferta);
    }, 0);

  const totaleClienteGiaFatturato = checksFatturateClienteAnnoCorrente.reduce(
    (acc: number, r: any) => {
      return acc + toNum(r.costoServizio) + toNum(r.importoTrasferta);
    },
    0
  );

  const totaleTecnicoDaFatturare = checksEseguite
    .filter((r: any) => !Boolean(r.tecnicoFatturato))
    .reduce((acc: number, r: any) => {
      const quota =
        toNum(r.quotaTecnico) ||
        (toNum(r.costoServizio) * toNum((r as any).quotaTecnicoPerc ?? 40)) / 100;

      return acc + quota;
    }, 0);

  const totaleTecnicoGiaPagato = checksTecnicoPagatoAnnoCorrente.reduce(
    (acc: number, r: any) => {
      const quota =
        toNum(r.quotaTecnico) ||
        (toNum(r.costoServizio) * toNum((r as any).quotaTecnicoPerc ?? 40)) / 100;

      return acc + quota;
    },
    0
  );

  const techAlert = totaleTecnicoDaFatturare > 500;
  const currentYear = now.getFullYear();

  return (
    <div className="card">
      <div
        className="row"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>
            Ingegneria Clinica (VSE)
            {currentClient ? ` • ${currentClient.name}` : ""}
          </h1>

          <div className="muted" style={{ marginTop: 6 }}>
            Totale verifiche: <b>{checks.length}</b> · Filtrate: <b>{filtered.length}</b>
          </div>

          <div className="muted" style={{ marginTop: 4 }}>
            Completate economicamente: <b>{checksCompletateTotali.length}</b>
          </div>

          <div className="muted" style={{ marginTop: 4 }}>
            Appuntamento preso: <b>{appointmentTakenCount}</b> · Da prendere:{" "}
            <b>{appointmentToTakeCount}</b>
          </div>

          {clientId && !currentClient ? (
            <div style={{ marginTop: 6, color: "#b91c1c", fontWeight: 700 }}>
              Cliente filtro non trovato.
            </div>
          ) : null}
        </div>

        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
          {!isIngegnereClinico ? (
            <Link
              className="btn primary"
              href={
                currentClient
                  ? `/ingegneria-clinica/new?clientId=${currentClient.id}`
                  : "/ingegneria-clinica/new"
              }
            >
              Nuova verifica
            </Link>
          ) : null}

          {currentClient ? (
            <>
              {!isIngegnereClinico ? (
                <Link className="btn" href={`/clients/${currentClient.id}`}>
                  Torna al cliente
                </Link>
              ) : null}

              <Link className="btn" href="/ingegneria-clinica">
                Rimuovi filtro
              </Link>
            </>
          ) : null}

          {!isIngegnereClinico ? (
            <Link className="btn" href="/clients">
              Clienti
            </Link>
          ) : null}
        </div>
      </div>

      <div className="row" style={{ gap: 12, marginTop: 12, flexWrap: "wrap" }}>
        <Link
          className="card"
          href={hrefWith({
            q,
            tab: "TUTTE",
            dueDateFrom,
            dueDateTo,
            eseguite,
            fatturate,
            clientId: effectiveClientId,
          })}
          style={{ minWidth: 220, flex: 1, textDecoration: "none", color: "inherit" }}
        >
          <div className="muted">Totale Verifiche</div>
          <div style={{ fontSize: 24, fontWeight: 900 }}>{total}</div>
        </Link>

        <Link
          className="card"
          href={hrefWith({
            q,
            tab: "SCADUTE",
            dueDateFrom,
            dueDateTo,
            eseguite,
            fatturate,
            clientId: effectiveClientId,
          })}
          style={{
            minWidth: 220,
            flex: 1,
            textDecoration: "none",
            color: "inherit",
            border: "1px solid rgba(239,68,68,0.25)",
            background: "rgba(239,68,68,0.06)",
          }}
        >
          <div className="muted">Scadute</div>
          <div style={{ fontSize: 24, fontWeight: 900 }}>{scadute}</div>
        </Link>

        <Link
          className="card"
          href={hrefWith({
            q,
            tab: "PROSSIMI30",
            dueDateFrom,
            dueDateTo,
            eseguite,
            fatturate,
            clientId: effectiveClientId,
          })}
          style={{
            minWidth: 220,
            flex: 1,
            textDecoration: "none",
            color: "inherit",
            border: "1px solid rgba(245,158,11,0.25)",
            background: "rgba(245,158,11,0.08)",
          }}
        >
          <div className="muted">Prossimi 30 giorni</div>
          <div style={{ fontSize: 24, fontWeight: 900 }}>{prossimi30}</div>
        </Link>

        <Link
          className="card"
          href={hrefWith({
            q,
            tab: "IN_REGOLA",
            dueDateFrom,
            dueDateTo,
            eseguite,
            fatturate,
            clientId: effectiveClientId,
          })}
          style={{
            minWidth: 220,
            flex: 1,
            textDecoration: "none",
            color: "inherit",
            border: "1px solid rgba(34,197,94,0.25)",
            background: "rgba(34,197,94,0.08)",
          }}
        >
          <div className="muted">In regola</div>
          <div style={{ fontSize: 24, fontWeight: 900 }}>{inRegola}</div>
        </Link>
      </div>

      <div className="row" style={{ gap: 12, marginTop: 12, flexWrap: "wrap" }}>
        <div
          className="card"
          style={{
            minWidth: 220,
            flex: 1,
            border: "1px solid rgba(37,99,235,0.25)",
            background: "rgba(37,99,235,0.06)",
          }}
        >
          <div className="muted">Appuntamento preso</div>
          <div style={{ fontSize: 24, fontWeight: 900 }}>{appointmentTakenCount}</div>
        </div>

        <div
          className="card"
          style={{
            minWidth: 220,
            flex: 1,
            border: "1px solid rgba(107,114,128,0.25)",
            background: "rgba(107,114,128,0.06)",
          }}
        >
          <div className="muted">Da prendere</div>
          <div style={{ fontSize: 24, fontWeight: 900 }}>{appointmentToTakeCount}</div>
        </div>
      </div>

      <div
        className="card"
        style={{
          marginTop: 12,
          border: techAlert
            ? "1px solid rgba(220,38,38,0.35)"
            : "1px solid rgba(245,158,11,0.35)",
          background: techAlert ? "rgba(220,38,38,0.10)" : "rgba(245,158,11,0.10)",
        }}
      >
        <div style={{ fontWeight: 900 }}>
          Lavori eseguiti da fatturare cliente: {eur(totaleClienteDaFatturare)}
        </div>

        <div className="muted" style={{ marginTop: 4 }}>
          Già fatturato cliente {currentYear}: <b>{eur(totaleClienteGiaFatturato)}</b>
        </div>

        <div style={{ marginTop: 10, fontWeight: 900 }}>
          Tecnico da fatturare: {eur(totaleTecnicoDaFatturare)}
        </div>

        <div className="muted" style={{ marginTop: 4 }}>
          Già pagato tecnico {currentYear}: <b>{eur(totaleTecnicoGiaPagato)}</b>
        </div>

        <div className="muted" style={{ marginTop: 8 }}>
          Verifiche eseguite: <b>{checksEseguite.length}</b> · Fatturate cliente {currentYear}:{" "}
          <b>{checksFatturateClienteAnnoCorrente.length}</b> · Tecnico pagato {currentYear}:{" "}
          <b>{checksTecnicoPagatoAnnoCorrente.length}</b> · Completate:{" "}
          <b>{checksCompletateTotali.length}</b>
        </div>

        {techAlert ? (
          <div style={{ marginTop: 8, color: "#b91c1c", fontWeight: 900 }}>
            Superata soglia 500€
          </div>
        ) : null}
      </div>

      <ChecksTableClient
        checks={filtered as any}
        q={q}
        tab={tab}
        dueDateFrom={dueDateFrom}
        dueDateTo={dueDateTo}
        eseguite={eseguite}
        fatturate={fatturate}
        clientId={effectiveClientId}
      />
    </div>
  );
}