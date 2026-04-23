"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type AppRole = "admin" | "staff" | "ingegnere_clinico";
type SaveState = "idle" | "saving" | "saved" | "error";

type CheckRow = {
  id: string;
  clientId: string | null;
  siteId: string | null;

  client?: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    pec: string | null;
    vatNumber: string | null;
    uniqueCode: string | null;
    legalSeat: string | null;
    operativeSeat: string | null;
    address: string | null;
    notes: string | null;
  } | null;

  site?: {
    id: string;
    name: string;
    address: string | null;
    city: string | null;
    province: string | null;
    cap: string | null;
  } | null;

  referente?: string | null;
  telefonoReferente?: string | null;

  nomeClienteSnapshot: string | null;
  nomeSedeSnapshot: string | null;
  indirizzoSedeSnapshot: string | null;

  numApparecchiature: number;
  apparecchiatureAggiuntive: number;

  costoServizio: any;
  quotaTecnico: any;
  quotaTecnicoPerc?: any;
  importoTrasferta: any;

  periodicita: string | null;

  dataUltimoAppuntamento: Date | string | null;
  dataAppuntamentoPreso?: Date | string | null;
  dataProssimoAppuntamento: Date | string | null;

  verificheEseguite: boolean;
  fileSuDropbox: boolean;
  fatturata?: boolean;
  tecnicoFatturato?: boolean;
};

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function ymd(d: any) {
  if (!d) return "";
  const x = new Date(d);
  if (Number.isNaN(x.getTime())) return "";
  const yyyy = x.getUTCFullYear();
  const mm = String(x.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(x.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
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

function calcQuotaTecnico(r: CheckRow) {
  const quotaSaved = toNum(r.quotaTecnico);
  if (quotaSaved > 0) return quotaSaved;
  const perc = toNum(r.quotaTecnicoPerc ?? 40);
  const costo = toNum(r.costoServizio);
  return (costo * perc) / 100;
}

function calcNextDate(last: any, periodicita: string | null | undefined) {
  if (!last) return null;
  const d = new Date(last);
  if (Number.isNaN(d.getTime())) return null;

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

function dueBadge(d: any) {
  if (!d) return { label: "—", cls: "pill pill-gray" as const, dateColor: {} };

  const due = startOfDay(new Date(d));
  const today = startOfDay(new Date());
  const in30 = new Date(today);
  in30.setDate(in30.getDate() + 30);

  if (due < today) {
    return {
      label: "Scaduto",
      cls: "pill pill-red" as const,
      dateColor: { color: "#b91c1c", fontWeight: 900 as const },
    };
  }

  if (due <= in30) {
    return {
      label: "Entro 30gg",
      cls: "pill pill-amber" as const,
      dateColor: { color: "#92400e", fontWeight: 900 as const },
    };
  }

  return {
    label: "In regola",
    cls: "pill pill-green" as const,
    dateColor: { color: "#166534", fontWeight: 900 as const },
  };
}

function lastBadge(last: any, periodicita: string | null | undefined) {
  const next = calcNextDate(last, periodicita);
  return dueBadge(next);
}

function readCookie(name: string) {
  if (typeof document === "undefined") return null;
  const parts = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`));
  return parts ? decodeURIComponent(parts.split("=")[1]) : null;
}

function decodeBase64UrlJson(value: string) {
  try {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4 || 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getRoleFromSessionCookie(): AppRole {
  const token = readCookie("phsc_session");
  if (!token) return "admin";

  const parts = token.split(".");
  if (parts.length !== 2) return "admin";

  const payload = decodeBase64UrlJson(parts[0]);
  const role = String(payload?.role ?? "").toLowerCase();

  if (role === "staff") return "staff";
  if (role === "ingegnere_clinico") return "ingegnere_clinico";
  return "admin";
}

function getReferente(r: CheckRow) {
  return String(r.referente ?? "").trim() || "—";
}

function getTelefonoReferente(r: CheckRow) {
  return String(r.telefonoReferente ?? "").trim() || "—";
}

function getClientName(r: CheckRow) {
  return r.client?.name ?? r.nomeClienteSnapshot ?? "—";
}

function getSiteName(r: CheckRow) {
  return r.site?.name ?? r.nomeSedeSnapshot ?? "—";
}

function compareChecks(a: CheckRow, b: CheckRow) {
  const ad = a.dataProssimoAppuntamento ? new Date(a.dataProssimoAppuntamento).getTime() : Number.MAX_SAFE_INTEGER;
  const bd = b.dataProssimoAppuntamento ? new Date(b.dataProssimoAppuntamento).getTime() : Number.MAX_SAFE_INTEGER;
  if (ad !== bd) return ad - bd;

  const ac = getClientName(a).localeCompare(getClientName(b), "it", { sensitivity: "base" });
  if (ac !== 0) return ac;

  const as = getSiteName(a).localeCompare(getSiteName(b), "it", { sensitivity: "base" });
  if (as !== 0) return as;

  return a.id.localeCompare(b.id);
}

function buildFrozenAppointmentMap(items: CheckRow[]) {
  const map: Record<string, boolean> = {};
  for (const item of items) {
    map[item.id] = Boolean(item.dataAppuntamentoPreso);
  }
  return map;
}

function getFrozenBucket(
  id: string,
  frozenAppointmentMap: Record<string, boolean>,
  row: CheckRow
) {
  if (Object.prototype.hasOwnProperty.call(frozenAppointmentMap, id)) {
    return frozenAppointmentMap[id] ? "presi" : "daFare";
  }
  return row.dataAppuntamentoPreso ? "presi" : "daFare";
}

export default function ChecksTableClient({
  checks = [],
  q,
  tab,
  dueDate,
  eseguite,
  fatturate,
  clientId = "",
}: {
  checks?: CheckRow[];
  q: string;
  tab: string;
  dueDate: string;
  eseguite: string;
  fatturate: string;
  clientId?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const safeChecks = useMemo(() => (Array.isArray(checks) ? checks : []), [checks]);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<CheckRow | null>(null);
  const [rows, setRows] = useState<CheckRow[]>(safeChecks);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [role, setRole] = useState<AppRole>("admin");
  const [refreshing, setRefreshing] = useState(false);
  const [saveStates, setSaveStates] = useState<Record<string, SaveState>>({});
  const [frozenAppointmentMap, setFrozenAppointmentMap] = useState<Record<string, boolean>>(
    buildFrozenAppointmentMap(safeChecks)
  );

  const saveTimersRef = useRef<Record<string, number>>({});

  const isIngegnereClinico = role === "ingegnere_clinico";

  useEffect(() => {
    setRows(safeChecks);
    setFrozenAppointmentMap(buildFrozenAppointmentMap(safeChecks));
    setSaveStates({});
  }, [safeChecks]);

  useEffect(() => {
    setRole(getRoleFromSessionCookie());
  }, []);

 useEffect(() => {
  const timers = saveTimersRef.current;

  return () => {
    Object.values(timers).forEach((timerId) => window.clearTimeout(timerId));
  };
}, []);

  function setRowSaveState(id: string, state: SaveState) {
    setSaveStates((curr) => ({ ...curr, [id]: state }));

    if (saveTimersRef.current[id]) {
      window.clearTimeout(saveTimersRef.current[id]);
      delete saveTimersRef.current[id];
    }

    if (state === "saved") {
      saveTimersRef.current[id] = window.setTimeout(() => {
        setSaveStates((curr) => ({ ...curr, [id]: "idle" }));
        delete saveTimersRef.current[id];
      }, 1800);
    }
  }

  function openClientPopup(r: CheckRow) {
    setSelected(r);
    setOpen(true);
  }

  function refreshKeepFilters() {
    const qs = searchParams.toString();
    router.push(qs ? `/ingegneria-clinica?${qs}` : "/ingegneria-clinica");
    router.refresh();
  }

  function handleRiordina() {
    setRefreshing(true);
    refreshKeepFilters();
  }

  useEffect(() => {
    if (refreshing) {
      setRefreshing(false);
    }
  }, [safeChecks, refreshing]);

  async function toggleField(
    id: string,
    field: "verificheEseguite" | "fileSuDropbox" | "fatturata" | "tecnicoFatturato",
    value: boolean
  ) {
    const prev = rows;
    setBusyId(id);
    setRowSaveState(id, "saving");

    setRows((curr) => curr.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

    try {
      const res = await fetch(`/api/ingegneria-clinica/${id}/toggle`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ field, value }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        setRows(prev);
        setRowSaveState(id, "error");
        alert(`Errore aggiornamento (${res.status})\n${txt}`);
        return;
      }

      setRowSaveState(id, "saved");
    } catch (e: any) {
      setRows(prev);
      setRowSaveState(id, "error");
      alert(`Errore aggiornamento\n${String(e?.message ?? e)}`);
    } finally {
      setBusyId(null);
    }
  }

  async function updateField(id: string, field: string, value: any) {
    const prev = rows;

    setRowSaveState(id, "saving");
    setRows((curr) =>
      curr.map((r) => {
        if (r.id !== id) return r;
        return { ...r, [field]: value };
      })
    );

    if (selected?.id === id) {
      setSelected((curr) => (curr ? { ...curr, [field]: value } : curr));
    }

    try {
      const res = await fetch(`/api/ingegneria-clinica/${id}/update`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ field, value }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        setRows(prev);
        if (selected?.id === id) {
          const prevSelected = prev.find((r) => r.id === id) ?? null;
          setSelected(prevSelected);
        }
        setRowSaveState(id, "error");
        alert(`Errore aggiornamento (${res.status})\n${txt}`);
        return;
      }

      setRowSaveState(id, "saved");
    } catch (e: any) {
      setRows(prev);
      if (selected?.id === id) {
        const prevSelected = prev.find((r) => r.id === id) ?? null;
        setSelected(prevSelected);
      }
      setRowSaveState(id, "error");
      alert(`Errore aggiornamento\n${String(e?.message ?? e)}`);
    }
  }

  async function deleteRow(id: string) {
    const ok = window.confirm("Vuoi eliminare questa verifica VSE?");
    if (!ok) return;

    setBusyId(id);

    try {
      const res = await fetch(`/api/ingegneria-clinica/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        alert(`Errore eliminazione (${res.status})\n${txt}`);
        return;
      }

      setRows((curr) => curr.filter((r) => r.id !== id));
      setFrozenAppointmentMap((curr) => {
        const next = { ...curr };
        delete next[id];
        return next;
      });
      setSaveStates((curr) => {
        const next = { ...curr };
        delete next[id];
        return next;
      });

      if (selected?.id === id) {
        setSelected(null);
        setOpen(false);
      }

      refreshKeepFilters();
    } catch (e: any) {
      alert(`Errore eliminazione\n${String(e?.message ?? e)}`);
    } finally {
      setBusyId(null);
    }
  }

  async function chiudiVerifica(id: string) {
    const ok = window.confirm("Chiudere la verifica e generare la prossima scadenza?");
    if (!ok) return;

    setBusyId(id);

    try {
      const res = await fetch(`/api/ingegneria-clinica/${id}/chiudi`, {
        method: "POST",
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        alert(`Errore chiusura verifica (${res.status})\n${txt}`);
        return;
      }

      refreshKeepFilters();
    } catch (e: any) {
      alert(`Errore chiusura verifica\n${String(e?.message ?? e)}`);
    } finally {
      setBusyId(null);
    }
  }

  function qs(next: {
    q?: string;
    tab?: string;
    dueDate?: string;
    eseguite?: string;
    fatturate?: string;
    clientId?: string;
  }) {
    const p = new URLSearchParams();
    if (next.q) p.set("q", next.q);
    if (next.tab) p.set("tab", next.tab);
    if (next.dueDate) p.set("dueDate", next.dueDate);
    if (next.eseguite) p.set("eseguite", next.eseguite);
    if (next.fatturate) p.set("fatturate", next.fatturate);
    if (next.clientId) p.set("clientId", next.clientId);
    return `/ingegneria-clinica?${p.toString()}`;
  }

  function renderSaveBadge(id: string) {
    const state = saveStates[id] ?? "idle";
    if (state === "saving") return <span className="saveBadge saveSaving">Salvataggio...</span>;
    if (state === "saved") return <span className="saveBadge saveSaved">Salvato</span>;
    if (state === "error") return <span className="saveBadge saveError">Errore</span>;
    return null;
  }

  function renderRows(items: CheckRow[]) {
    return items.map((r) => {
      const clientName = getClientName(r);
      const siteName = getSiteName(r);
      const nextBadge = dueBadge(r.dataProssimoAppuntamento);
      const prevBadge = lastBadge(r.dataUltimoAppuntamento, r.periodicita);
      const totale = toNum(r.costoServizio) + toNum(r.importoTrasferta);
      const quotaTec = calcQuotaTecnico(r);
      const isBusy = busyId === r.id;
      const isOrphan = !r.clientId && !r.nomeClienteSnapshot;

      return (
        <tr
          key={r.id}
          style={
            isOrphan
              ? {
                  background: "rgba(239,68,68,0.06)",
                }
              : undefined
          }
        >
          <td className="tdClient">
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <button
                type="button"
                onClick={() => openClientPopup(r)}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  margin: 0,
                  cursor: "pointer",
                  fontWeight: 900,
                  color: "#0B5ED7",
                  textDecoration: "underline",
                  textAlign: "left",
                  lineHeight: 1.2,
                  wordBreak: "break-word",
                }}
              >
                {clientName}
              </button>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {isOrphan ? <span className="pill pill-red">Verifica orfana</span> : null}
                {renderSaveBadge(r.id)}
              </div>
            </div>
          </td>

          <td className="tdSite">
            <div className="textWrap">{siteName}</div>
          </td>

          <td className="tdReferente">
            <div className="textWrap">{getReferente(r)}</div>
          </td>

          <td className="tdCenter">{r.numApparecchiature ?? 0}</td>
          <td className="tdCenter">{r.apparecchiatureAggiuntive ?? 0}</td>
          <td className="tdMoney">{eur(r.costoServizio)}</td>
          <td className="tdMoney tdMoneyGreen">{eur(quotaTec)}</td>
          <td className="tdMoney tdMoneyBlue">{eur(r.importoTrasferta)}</td>
          <td className="tdMoney tdMoneyBold">{eur(totale)}</td>

          <td className="tdDate">
            <div className="dateCell">
              <input
                className="miniInput miniDate"
                type="date"
                value={ymd(r.dataUltimoAppuntamento)}
                onChange={(e) => updateField(r.id, "dataUltimoAppuntamento", e.target.value)}
                style={prevBadge.dateColor}
              />
              <span className={prevBadge.cls}>{prevBadge.label}</span>
            </div>
          </td>

          <td className="tdDate">
            <input
              className="miniInput miniDate"
              type="date"
              value={ymd(r.dataAppuntamentoPreso)}
              onChange={(e) => updateField(r.id, "dataAppuntamentoPreso", e.target.value)}
            />
          </td>

          <td className="tdDate">
            <div className="dateCell">
              <input
                className="miniInput miniDate"
                type="date"
                value={ymd(r.dataProssimoAppuntamento)}
                readOnly
                style={{
                  ...nextBadge.dateColor,
                  background: "rgba(0,0,0,0.02)",
                  cursor: "not-allowed",
                }}
              />
              <span className={nextBadge.cls}>{nextBadge.label}</span>
            </div>
          </td>

          <td className="tdPeriod">
            <select
              className="miniInput miniPeriod"
              value={r.periodicita ?? "ANNUALE"}
              onChange={(e) => updateField(r.id, "periodicita", e.target.value)}
            >
              <option value="SEMESTRALE">Sem.</option>
              <option value="ANNUALE">Ann.</option>
              <option value="BIENNALE">Bi.</option>
            </select>
          </td>

          <td className="tdCenter">
            <button
              type="button"
              disabled={isBusy}
              onClick={() => toggleField(r.id, "verificheEseguite", !r.verificheEseguite)}
              className={`actionChip ${r.verificheEseguite ? "actionGreen" : "actionGray"}`}
              title="Verifica eseguita"
            >
              ✓
            </button>
          </td>

          <td className="tdCenter">
            <button
              type="button"
              disabled={isBusy}
              onClick={() => toggleField(r.id, "fileSuDropbox", !r.fileSuDropbox)}
              className={`actionChip ${r.fileSuDropbox ? "actionBlue" : "actionGray"}`}
              title="File su Dropbox"
            >
              ✓
            </button>
          </td>

          <td className="tdCenter">
            <button
              type="button"
              disabled={isBusy}
              onClick={() => toggleField(r.id, "fatturata", !Boolean(r.fatturata))}
              className={`actionChip ${r.fatturata ? "actionGreen" : "actionGray"}`}
              title="Fatturato cliente"
            >
              ✓
            </button>
          </td>

          <td className="tdCenter">
            <button
              type="button"
              disabled={isBusy}
              onClick={() => toggleField(r.id, "tecnicoFatturato", !Boolean(r.tecnicoFatturato))}
              className={`actionChip ${r.tecnicoFatturato ? "actionBlue" : "actionGray"}`}
              title="Tecnico pagato"
            >
              ✓
            </button>
          </td>

          <td className="tdCenter">
            <button
              type="button"
              disabled={isBusy}
              onClick={() => chiudiVerifica(r.id)}
              className="actionChip actionBlue"
              title="Chiudi verifica"
            >
              ➜
            </button>
          </td>

          {!isIngegnereClinico ? (
            <td className="tdBtn">
              <Link className="btn btnMini" href={`/ingegneria-clinica/${r.id}`}>
                Apri
              </Link>
            </td>
          ) : null}

          {!isIngegnereClinico ? (
            <td className="tdBtn">
              <button
                type="button"
                className="btn danger btnMini"
                disabled={isBusy}
                onClick={() => deleteRow(r.id)}
              >
                Elimina
              </button>
            </td>
          ) : null}
        </tr>
      );
    });
  }

  const rowsDaFare = rows.filter(
    (r) => getFrozenBucket(r.id, frozenAppointmentMap, r) === "daFare"
  );
  const rowsAppPresi = rows.filter(
    (r) => getFrozenBucket(r.id, frozenAppointmentMap, r) === "presi"
  );

  return (
    <>
      <div className="card" style={{ marginTop: 12 }}>
        <form method="GET" className="searchGrid">
          <input
            className="input"
            name="q"
            defaultValue={q}
            placeholder="Cerca per nome cliente o sede..."
          />

          <input className="input filterInput" type="date" name="dueDate" defaultValue={dueDate} />

          <select className="input filterInput" name="eseguite" defaultValue={eseguite || ""}>
            <option value="">Fatto: tutti</option>
            <option value="SI">Fatto: sì</option>
            <option value="NO">Fatto: no</option>
          </select>

          <select className="input filterInput" name="fatturate" defaultValue={fatturate || ""}>
            <option value="">Fatturato cliente: tutti</option>
            <option value="SI">Fatturato cliente: sì</option>
            <option value="NO">Fatturato cliente: no</option>
          </select>

          <input type="hidden" name="tab" value={tab} />
          {clientId ? <input type="hidden" name="clientId" value={clientId} /> : null}

          <div className="searchActions">
            <button className="btn primary btnFilter" type="submit">
              Cerca
            </button>
            <Link
              className="btn btnFilter"
              href={clientId ? `/ingegneria-clinica?clientId=${clientId}` : "/ingegneria-clinica"}
            >
              Reset
            </Link>
          </div>

          <div className="filterTabs">
            <Link
              className={`btn btnFilter ${tab === "TUTTE" ? "primary" : ""}`}
              href={qs({ q, tab: "TUTTE", dueDate, eseguite, fatturate, clientId })}
            >
              Tutte
            </Link>
            <Link
              className={`btn btnFilter ${tab === "SCADUTE" ? "primary" : ""}`}
              href={qs({ q, tab: "SCADUTE", dueDate, eseguite, fatturate, clientId })}
            >
              Scadute
            </Link>
            <Link
              className={`btn btnFilter ${tab === "PROSSIMI30" ? "primary" : ""}`}
              href={qs({ q, tab: "PROSSIMI30", dueDate, eseguite, fatturate, clientId })}
            >
              Prossimi 30gg
            </Link>
            <Link
              className={`btn btnFilter ${tab === "IN_REGOLA" ? "primary" : ""}`}
              href={qs({ q, tab: "IN_REGOLA", dueDate, eseguite, fatturate, clientId })}
            >
              In regola
            </Link>
          </div>
        </form>

        <div
          className="row"
          style={{
            marginTop: 10,
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div className="muted" style={{ fontSize: 12 }}>
            Ordine congelato nella sessione. Le righe si riordinano solo con il pulsante sotto o al
            refresh della pagina.
          </div>

          <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn btnFilter"
              onClick={() => {
                setRows((curr) => [...curr].sort(compareChecks));
                setFrozenAppointmentMap(buildFrozenAppointmentMap([...rows].sort(compareChecks)));
              }}
            >
              Riordina elenco
            </button>

            <button
              type="button"
              className="btn primary btnFilter"
              disabled={refreshing}
              onClick={handleRiordina}
            >
              {refreshing ? "Aggiorno..." : "Aggiorna dati"}
            </button>
          </div>
        </div>
      </div>

      <div className="sectionCard">
        <div className="sectionHeader">
          <div style={{ fontWeight: 900 }}>Da fare</div>
          <div className="muted">{rowsDaFare.length} righe</div>
        </div>

        <div className="tableWrap">
          <table className="table clinicalTable" style={{ marginTop: 12 }}>
            <thead>
              <tr>
                <th className="thClient">Cliente</th>
                <th className="thSite">Sede</th>
                <th className="thReferente">Referente</th>
                <th className="thTiny">App.</th>
                <th className="thTiny">+App</th>
                <th className="thMoney">Costo</th>
                <th className="thMoney">Quota tecnico</th>
                <th className="thMoney">Trasf.</th>
                <th className="thMoney">Totale</th>
                <th className="thDate">Ultima verifica</th>
                <th className="thDate">App. preso</th>
                <th className="thDate">Prossimo app.</th>
                <th className="thPeriod">Periodicità</th>
                <th className="thAction">Fatto</th>
                <th className="thAction">DropB.</th>
                <th className="thAction">Fatt.</th>
                <th className="thAction">Tec.</th>
                <th className="thAction">Chi.</th>
                {!isIngegnereClinico ? <th className="thBtn">Apri</th> : null}
                {!isIngegnereClinico ? <th className="thBtn">Elimina</th> : null}
              </tr>
            </thead>

            <tbody>
              {rowsDaFare.length > 0 ? (
                renderRows(rowsDaFare)
              ) : (
                <tr>
                  <td colSpan={isIngegnereClinico ? 18 : 20} className="muted">
                    Nessuna verifica.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="sectionCard">
        <div className="sectionHeader">
          <div style={{ fontWeight: 900 }}>Appuntamento preso</div>
          <div className="muted">{rowsAppPresi.length} righe</div>
        </div>

        <div className="tableWrap">
          <table className="table clinicalTable" style={{ marginTop: 12 }}>
            <thead>
              <tr>
                <th className="thClient">Cliente</th>
                <th className="thSite">Sede</th>
                <th className="thReferente">Referente</th>
                <th className="thTiny">App.</th>
                <th className="thTiny">+App</th>
                <th className="thMoney">Costo</th>
                <th className="thMoney">Quota tecnico</th>
                <th className="thMoney">Trasf.</th>
                <th className="thMoney">Totale</th>
                <th className="thDate">Ultima verifica</th>
                <th className="thDate">App. preso</th>
                <th className="thDate">Prossimo app.</th>
                <th className="thPeriod">Periodicità</th>
                <th className="thAction">Fatto</th>
                <th className="thAction">DropB.</th>
                <th className="thAction">Fatt.</th>
                <th className="thAction">Tec.</th>
                <th className="thAction">Chi.</th>
                {!isIngegnereClinico ? <th className="thBtn">Apri</th> : null}
                {!isIngegnereClinico ? <th className="thBtn">Elimina</th> : null}
              </tr>
            </thead>

            <tbody>
              {rowsAppPresi.length > 0 ? (
                renderRows(rowsAppPresi)
              ) : (
                <tr>
                  <td colSpan={isIngegnereClinico ? 18 : 20} className="muted">
                    Nessuna verifica.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {open && selected && (
        <div
          onMouseDown={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
          }}
        >
          <div
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              width: 760,
              maxWidth: "calc(100vw - 20px)",
              borderRadius: 16,
              background: "white",
              border: "1px solid rgba(0,0,0,0.12)",
              padding: 16,
            }}
          >
            <div
              className="row"
              style={{ justifyContent: "space-between", alignItems: "center", gap: 10 }}
            >
              <div>
                <div style={{ fontWeight: 900, fontSize: 16 }}>Anagrafica cliente</div>
                <div className="muted" style={{ marginTop: 4 }}>
                  {selected.client?.name ?? selected.nomeClienteSnapshot ?? "—"}
                </div>
              </div>

              <button className="btn" type="button" onClick={() => setOpen(false)}>
                Chiudi
              </button>
            </div>

            <div className="card" style={{ marginTop: 12 }}>
              <div className="grid3" style={{ marginTop: 6 }}>
                <div>
                  <div className="muted">Cliente</div>
                  <div>{selected.client?.name ?? selected.nomeClienteSnapshot ?? "—"}</div>
                </div>
                <div>
                  <div className="muted">P.IVA</div>
                  <div>{selected.client?.vatNumber ?? "—"}</div>
                </div>
                <div>
                  <div className="muted">Codice Univoco</div>
                  <div>{selected.client?.uniqueCode ?? "—"}</div>
                </div>

                <div>
                  <div className="muted">PEC</div>
                  <div>{selected.client?.pec ?? "—"}</div>
                </div>
                <div>
                  <div className="muted">Email</div>
                  <div>{selected.client?.email ?? "—"}</div>
                </div>
                <div>
                  <div className="muted">Telefono cliente</div>
                  <div>{selected.client?.phone ?? "—"}</div>
                </div>

                <div>
                  <div className="muted">Referente</div>
                  <div>{getReferente(selected)}</div>
                </div>

                <div>
                  <div className="muted">Telefono referente</div>
                  <div>{getTelefonoReferente(selected)}</div>
                </div>

                <div>
                  <div className="muted">Ultima verifica</div>
                  <div>{ymd(selected.dataUltimoAppuntamento) || "—"}</div>
                </div>

                <div>
                  <div className="muted">Appuntamento preso</div>
                  <div>{ymd(selected.dataAppuntamentoPreso) || "—"}</div>
                </div>

                <div>
                  <div className="muted">Prossimo appuntamento</div>
                  <div>{ymd(selected.dataProssimoAppuntamento) || "—"}</div>
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <div className="muted">Sede</div>
                  <div>{selected.site?.name ?? selected.nomeSedeSnapshot ?? "—"}</div>
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <div className="muted">Indirizzo sede</div>
                  <div>
                    {selected.indirizzoSedeSnapshot ??
                      ([selected.site?.address, selected.site?.city, selected.site?.province, selected.site?.cap]
                        .filter(Boolean)
                        .join(", ") || "—")}
                  </div>
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <div className="muted">Note cliente</div>
                  <div style={{ whiteSpace: "pre-wrap" }}>{selected.client?.notes ?? "—"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .searchGrid{
          display:grid;
          grid-template-columns: minmax(200px, 1.45fr) 130px 145px 145px auto;
          gap:8px;
          align-items:center;
        }

        .filterInput{
          min-width: 0;
        }

        .searchActions{
          display:flex;
          gap:6px;
          flex-wrap:nowrap;
          justify-self:start;
          align-items:center;
          width:auto;
        }

        .filterTabs{
          grid-column: 1 / -1;
          display:flex;
          gap:6px;
          flex-wrap:wrap;
          justify-content:flex-end;
        }

        .btnFilter{
          padding: 6px 9px;
          min-height: 30px;
          font-size: 11px;
          line-height: 1;
          white-space: nowrap;
          width: auto !important;
          min-width: auto !important;
          flex: 0 0 auto;
        }

        .sectionCard{
          margin-top: 12px;
          padding: 12px;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 14px;
          background: rgba(255,255,255,0.85);
        }

        .sectionHeader{
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:8px;
          flex-wrap:wrap;
        }

        .tableWrap{
          width: 100%;
          overflow-x: auto;
        }

        .clinicalTable{
          width: 100%;
          min-width: 1650px;
          table-layout: fixed;
        }

        .clinicalTable th,
        .clinicalTable td{
          vertical-align: top;
          font-size: 11px;
          padding: 5px 4px;
          white-space: normal;
        }

        .thClient,
        .tdClient{
          width: 150px;
          min-width: 150px;
        }

        .thSite,
        .tdSite{
          width: 110px;
          min-width: 110px;
        }

        .thReferente,
        .tdReferente{
          width: 80px;
          min-width: 80px;
        }

        .thTiny{
          width: 42px;
          min-width: 42px;
          text-align:center;
        }

        .thMoney,
        .tdMoney{
          width: 68px;
          min-width: 68px;
        }

        .thDate,
        .tdDate{
          width: 98px;
          min-width: 98px;
        }

        .thPeriod,
        .tdPeriod{
          width: 68px;
          min-width: 68px;
        }

        .thAction{
          width: 40px;
          min-width: 40px;
          text-align:center;
        }

        .thBtn,
        .tdBtn{
          width: 58px;
          min-width: 58px;
          text-align:center;
        }

        .tdCenter{
          text-align:center;
        }

        .tdMoney{
          text-align:right;
          white-space:nowrap;
          font-size:10px;
        }

        .tdMoneyGreen{
          color: #16A34A;
          font-weight: 900;
        }

        .tdMoneyBlue{
          color: #2563EB;
          font-weight: 900;
        }

        .tdMoneyBold{
          font-weight: 900;
        }

        .textWrap{
          line-height:1.15;
          word-break:break-word;
          overflow-wrap:anywhere;
        }

        .dateCell{
          display:flex;
          flex-direction:column;
          gap:3px;
        }

        .miniInput{
          width: 100%;
          border: 1px solid rgba(0,0,0,0.14);
          border-radius: 7px;
          padding: 3px 5px;
          background: white;
          font-size: 10px;
          height: 28px;
        }

        .miniDate{
          min-width: 90px;
        }

        .miniPeriod{
          min-width: 60px;
        }

        .btnMini{
          padding: 5px 6px;
          min-height: 28px;
          font-size: 10px;
          line-height: 1;
          white-space: nowrap;
        }

        .pill{
          display:inline-flex;
          align-items:center;
          width:fit-content;
          padding:2px 5px;
          border-radius:999px;
          font-size:9px;
          font-weight:900;
          border:1px solid rgba(0,0,0,0.12);
          line-height:1.05;
        }

        .pill-red{
          background: rgba(239,68,68,0.10);
          border-color: rgba(239,68,68,0.45);
          color: #b91c1c;
        }

        .pill-amber{
          background: rgba(245,158,11,0.10);
          border-color: rgba(245,158,11,0.45);
          color: #92400e;
        }

        .pill-green{
          background: rgba(34,197,94,0.10);
          border-color: rgba(34,197,94,0.45);
          color: #166534;
        }

        .pill-gray{
          background: rgba(0,0,0,0.04);
          border-color: rgba(0,0,0,0.15);
          color: rgba(0,0,0,0.65);
        }

        .saveBadge{
          display:inline-flex;
          align-items:center;
          width:fit-content;
          padding:2px 6px;
          border-radius:999px;
          font-size:9px;
          font-weight:900;
          border:1px solid rgba(0,0,0,0.08);
          line-height:1.05;
        }

        .saveSaving{
          background: rgba(37,99,235,0.10);
          border-color: rgba(37,99,235,0.28);
          color: #1d4ed8;
        }

        .saveSaved{
          background: rgba(34,197,94,0.12);
          border-color: rgba(34,197,94,0.35);
          color: #166534;
        }

        .saveError{
          background: rgba(239,68,68,0.10);
          border-color: rgba(239,68,68,0.35);
          color: #b91c1c;
        }

        .actionChip{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          width: 22px;
          height: 22px;
          border-radius:999px;
          font-weight:900;
          font-size: 11px;
          border:1px solid rgba(0,0,0,0.12);
          cursor:pointer;
          background: rgba(0,0,0,0.03);
        }

        .actionChip:disabled{
          opacity:.6;
          cursor:not-allowed;
        }

        .actionGreen{
          background: rgba(34,197,94,0.18);
          border-color: rgba(34,197,94,0.35);
          color: #166534;
        }

        .actionBlue{
          background: rgba(37,99,235,0.16);
          border-color: rgba(37,99,235,0.30);
          color: #1d4ed8;
        }

        .actionGray{
          background: rgba(0,0,0,0.03);
          color: rgba(0,0,0,0.60);
        }

        @media (max-width: 1400px){
          .searchGrid{
            grid-template-columns: 1fr 1fr;
          }

          .filterTabs{
            justify-content:flex-start;
          }
        }

        @media (max-width: 1200px){
          .searchGrid{
            grid-template-columns: 1fr;
          }

          .searchActions{
            justify-self:start;
          }
        }
      `}</style>
    </>
  );
}