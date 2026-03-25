"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ClientLite = {
  id: string;
  name: string;
};

type SiteLite = {
  id: string;
  name: string;
  clientId: string;
  address?: string | null;
};

export type CheckFormData = {
  id?: string;

  clientId: string;
  siteId: string;

  nomeClienteSnapshot: string;
  nomeSedeSnapshot: string;
  indirizzoSedeSnapshot: string;

  studioRifAmministrativo: string;
  contattiMail: string;
  contattiCellulare: string;

  numApparecchiature: number | "";
  apparecchiatureAggiuntive: number | "";

  costoServizio: number | "";
  quotaTecnicoPerc: number | "";
  quotaTecnico: number;
  importoTrasferta: number | "";

  periodicita: "ANNUALE" | "SEMESTRALE" | "BIENNALE";

  dataUltimoAppuntamento: string | Date | null;
  dataAppuntamentoPreso: string | Date | null;
  dataProssimoAppuntamento: string | Date | null;

  verificheEseguite: boolean;
  fileSuDropbox: boolean;
  fatturata: boolean;
  tecnicoFatturato?: boolean;

  notes: string;
};

function numOrEmpty(v: unknown): number | "" {
  if (v === "" || v == null) return "";
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : "";
}

function num(v: unknown): number {
  const n = Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function ymd(v: unknown): string {
  if (!v) return "";
  const d = new Date(String(v));
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function eur(n: number) {
  return n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

function calcNextDate(
  lastDate: string,
  periodicita: "ANNUALE" | "SEMESTRALE" | "BIENNALE"
) {
  if (!lastDate) return "";
  const [y, m, d] = lastDate.split("-").map(Number);
  if (!y || !m || !d) return "";

  const dt = new Date(Date.UTC(y, m - 1, d));

  if (periodicita === "SEMESTRALE") {
    dt.setUTCMonth(dt.getUTCMonth() + 6);
  } else if (periodicita === "BIENNALE") {
    dt.setUTCFullYear(dt.getUTCFullYear() + 2);
  } else {
    dt.setUTCFullYear(dt.getUTCFullYear() + 1);
  }

  const yyyy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function CheckForm(props: {
  mode: "create" | "edit";
  clients: ClientLite[];
  sites?: SiteLite[];
  data?: Partial<CheckFormData>;
  id?: string;
}) {
  const { mode, clients, sites = [], data, id } = props;

  const [form, setForm] = useState<CheckFormData>({
    id: data?.id,
    clientId: data?.clientId ?? "",
    siteId: data?.siteId ?? "",

    nomeClienteSnapshot: data?.nomeClienteSnapshot ?? "",
    nomeSedeSnapshot: data?.nomeSedeSnapshot ?? "",
    indirizzoSedeSnapshot: data?.indirizzoSedeSnapshot ?? "",

    studioRifAmministrativo: data?.studioRifAmministrativo ?? "",
    contattiMail: data?.contattiMail ?? "",
    contattiCellulare: data?.contattiCellulare ?? "",

    numApparecchiature: numOrEmpty(data?.numApparecchiature),
    apparecchiatureAggiuntive: numOrEmpty(data?.apparecchiatureAggiuntive),

    costoServizio: numOrEmpty(data?.costoServizio),
    quotaTecnicoPerc: numOrEmpty(data?.quotaTecnicoPerc ?? 40),
    quotaTecnico: num(data?.quotaTecnico ?? 0),
    importoTrasferta: numOrEmpty(data?.importoTrasferta),

    periodicita: (data?.periodicita as CheckFormData["periodicita"]) ?? "ANNUALE",

    dataUltimoAppuntamento: ymd(data?.dataUltimoAppuntamento),
    dataAppuntamentoPreso: ymd(data?.dataAppuntamentoPreso),
    dataProssimoAppuntamento: ymd(data?.dataProssimoAppuntamento),

    verificheEseguite: Boolean(data?.verificheEseguite),
    fileSuDropbox: Boolean(data?.fileSuDropbox),
    fatturata: Boolean(data?.fatturata),
    tecnicoFatturato: Boolean(data?.tecnicoFatturato),

    notes: data?.notes ?? "",
  });

  useEffect(() => {
    setForm({
      id: data?.id,
      clientId: data?.clientId ?? "",
      siteId: data?.siteId ?? "",

      nomeClienteSnapshot: data?.nomeClienteSnapshot ?? "",
      nomeSedeSnapshot: data?.nomeSedeSnapshot ?? "",
      indirizzoSedeSnapshot: data?.indirizzoSedeSnapshot ?? "",

      studioRifAmministrativo: data?.studioRifAmministrativo ?? "",
      contattiMail: data?.contattiMail ?? "",
      contattiCellulare: data?.contattiCellulare ?? "",

      numApparecchiature: numOrEmpty(data?.numApparecchiature),
      apparecchiatureAggiuntive: numOrEmpty(data?.apparecchiatureAggiuntive),

      costoServizio: numOrEmpty(data?.costoServizio),
      quotaTecnicoPerc: numOrEmpty(data?.quotaTecnicoPerc ?? 40),
      quotaTecnico: num(data?.quotaTecnico ?? 0),
      importoTrasferta: numOrEmpty(data?.importoTrasferta),

      periodicita:
        (data?.periodicita as CheckFormData["periodicita"]) ?? "ANNUALE",

      dataUltimoAppuntamento: ymd(data?.dataUltimoAppuntamento),
      dataAppuntamentoPreso: ymd(data?.dataAppuntamentoPreso),
      dataProssimoAppuntamento: ymd(data?.dataProssimoAppuntamento),

      verificheEseguite: Boolean(data?.verificheEseguite),
      fileSuDropbox: Boolean(data?.fileSuDropbox),
      fatturata: Boolean(data?.fatturata),
      tecnicoFatturato: Boolean(data?.tecnicoFatturato),

      notes: data?.notes ?? "",
    });
  }, [data]);

  const filteredSites = useMemo(() => {
    if (!form.clientId) return [];
    return sites.filter((s) => s.clientId === form.clientId);
  }, [sites, form.clientId]);

  useEffect(() => {
    if (!form.dataUltimoAppuntamento) return;
    const next = calcNextDate(
      String(form.dataUltimoAppuntamento),
      form.periodicita
    );
    setForm((s) => ({
      ...s,
      dataProssimoAppuntamento: next,
    }));
  }, [form.dataUltimoAppuntamento, form.periodicita]);

  const quotaTecnicoCalc = useMemo(() => {
    return (num(form.costoServizio) * num(form.quotaTecnicoPerc)) / 100;
  }, [form.costoServizio, form.quotaTecnicoPerc]);

  const totaleCliente = useMemo(() => {
    return num(form.costoServizio) + num(form.importoTrasferta);
  }, [form.costoServizio, form.importoTrasferta]);

  const appuntamentoPreso = Boolean(String(form.dataAppuntamentoPreso ?? "").trim());

  function setField<K extends keyof CheckFormData>(key: K, value: CheckFormData[K]) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  function onChangeNumber<K extends keyof CheckFormData>(key: K, value: string) {
    setForm((s) => ({
      ...s,
      [key]: value === "" ? "" : num(value),
    }));
  }

  function onClientChange(clientId: string) {
    const client = clients.find((c) => c.id === clientId) ?? null;

    setForm((s) => ({
      ...s,
      clientId,
      siteId: "",
      nomeClienteSnapshot: client?.name ?? "",
      nomeSedeSnapshot: "",
      indirizzoSedeSnapshot: "",
    }));
  }

  function onSiteChange(siteId: string) {
    const site = filteredSites.find((s) => s.id === siteId) ?? null;

    setForm((s) => ({
      ...s,
      siteId,
      nomeSedeSnapshot: site?.name ?? "",
      indirizzoSedeSnapshot: site?.address ?? "",
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const selectedClient = clients.find((c) => c.id === form.clientId) ?? null;
    const selectedSite = filteredSites.find((s) => s.id === form.siteId) ?? null;

    const payload = {
      clientId: form.clientId || null,
      siteId: form.siteId || null,

      nomeClienteSnapshot:
        (selectedClient?.name ?? form.nomeClienteSnapshot).trim() || null,
      nomeSedeSnapshot:
        (selectedSite?.name ?? form.nomeSedeSnapshot).trim() || null,
      indirizzoSedeSnapshot:
        String(selectedSite?.address ?? form.indirizzoSedeSnapshot ?? "").trim() || null,

      studioRifAmministrativo: form.studioRifAmministrativo.trim() || null,
      contattiMail: form.contattiMail.trim() || null,
      contattiCellulare: form.contattiCellulare.trim() || null,

      numApparecchiature: num(form.numApparecchiature),
      apparecchiatureAggiuntive: num(form.apparecchiatureAggiuntive),

      costoServizio: num(form.costoServizio),
      quotaTecnicoPerc: num(form.quotaTecnicoPerc),
      quotaTecnico: quotaTecnicoCalc,
      importoTrasferta: num(form.importoTrasferta),

      periodicita: form.periodicita,

      dataUltimoAppuntamento: form.dataUltimoAppuntamento || null,
      dataAppuntamentoPreso: form.dataAppuntamentoPreso || null,
      dataProssimoAppuntamento: form.dataProssimoAppuntamento || null,

      verificheEseguite: form.verificheEseguite,
      fileSuDropbox: form.fileSuDropbox,
      fatturata: form.fatturata,
      tecnicoFatturato: Boolean(form.tecnicoFatturato),

      notes: form.notes.trim() || null,
    };

    const url =
      mode === "create"
        ? "/api/ingegneria-clinica"
        : `/api/ingegneria-clinica/${encodeURIComponent(id || "")}`;

    const method = mode === "create" ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      alert(`Errore salvataggio (${res.status})\n${txt}`);
      return;
    }

    window.location.href = "/ingegneria-clinica";
  }

  async function onDelete() {
    if (!id) return;
    const ok = window.confirm("Vuoi eliminare questa verifica VSE?");
    if (!ok) return;

    const res = await fetch(`/api/ingegneria-clinica/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      alert(`Errore eliminazione (${res.status})\n${txt}`);
      return;
    }

    window.location.href = "/ingegneria-clinica";
  }

  return (
    <form onSubmit={onSubmit} className="card" style={{ marginTop: 12 }}>
      <div
        className="row"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ margin: 0 }}>
          {mode === "create" ? "Nuova verifica VSE" : "Modifica verifica VSE"}
        </h2>

        <Link className="btn" href="/ingegneria-clinica">
          Indietro
        </Link>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ fontWeight: 900, marginBottom: 8 }}>COLLEGAMENTO</div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          <div>
            <div className="muted">Cliente</div>
            <select
              className="input"
              value={form.clientId}
              onChange={(e) => onClientChange(e.target.value)}
            >
              <option value="">— seleziona cliente —</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="muted">Sede</div>
            <select
              className="input"
              value={form.siteId}
              onChange={(e) => onSiteChange(e.target.value)}
              disabled={!form.clientId}
            >
              <option value="">— seleziona sede —</option>
              {filteredSites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="muted">Totale cliente</div>
            <input className="input" value={eur(totaleCliente)} readOnly disabled />
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ fontWeight: 900, marginBottom: 8 }}>DETTAGLI VERIFICA</div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: 12,
          }}
        >
          <div>
            <div className="muted">N. apparecchiature</div>
            <input
              className="input"
              type="number"
              value={form.numApparecchiature}
              onChange={(e) => onChangeNumber("numApparecchiature", e.target.value)}
              placeholder="0"
            />
          </div>

          <div>
            <div className="muted">App. aggiuntive</div>
            <input
              className="input"
              type="number"
              value={form.apparecchiatureAggiuntive}
              onChange={(e) => onChangeNumber("apparecchiatureAggiuntive", e.target.value)}
              placeholder="0"
            />
          </div>

          <div>
            <div className="muted">Costo servizio (€)</div>
            <input
              className="input"
              type="number"
              step="0.01"
              value={form.costoServizio}
              onChange={(e) => onChangeNumber("costoServizio", e.target.value)}
              placeholder="0"
            />
          </div>

          <div>
            <div className="muted">Quota tecnico (%)</div>
            <input
              className="input"
              type="number"
              step="0.01"
              value={form.quotaTecnicoPerc}
              onChange={(e) => onChangeNumber("quotaTecnicoPerc", e.target.value)}
              placeholder="40"
            />
          </div>

          <div>
            <div className="muted">Quota tecnico (€)</div>
            <input className="input" value={quotaTecnicoCalc.toFixed(2)} readOnly disabled />
          </div>

          <div>
            <div className="muted">Trasferta (€)</div>
            <input
              className="input"
              type="number"
              step="0.01"
              value={form.importoTrasferta}
              onChange={(e) => onChangeNumber("importoTrasferta", e.target.value)}
              placeholder="0"
            />
          </div>

          <div>
            <div className="muted">Periodicità</div>
            <select
              className="input"
              value={form.periodicita}
              onChange={(e) =>
                setField("periodicita", e.target.value as CheckFormData["periodicita"])
              }
            >
              <option value="ANNUALE">ANNUALE</option>
              <option value="SEMESTRALE">SEMESTRALE</option>
              <option value="BIENNALE">BIENNALE</option>
            </select>
          </div>

          <div>
            <div className="muted">Ultima verifica</div>
            <input
              className="input"
              type="date"
              value={String(form.dataUltimoAppuntamento ?? "")}
              onChange={(e) => setField("dataUltimoAppuntamento", e.target.value)}
            />
          </div>

          <div>
            <div className="muted">Appuntamento preso</div>
            <input
              className="input"
              type="date"
              value={String(form.dataAppuntamentoPreso ?? "")}
              onChange={(e) => setField("dataAppuntamentoPreso", e.target.value)}
            />
          </div>

          <div>
            <div className="muted">Prossima verifica</div>
            <input
              className="input"
              type="date"
              value={String(form.dataProssimoAppuntamento ?? "")}
              readOnly
              disabled
            />
          </div>
        </div>

        <div
          className="card"
          style={{
            marginTop: 12,
            border: "1px solid rgba(37,99,235,0.20)",
            background: "rgba(37,99,235,0.04)",
          }}
        >
          <div style={{ fontWeight: 900, marginBottom: 8 }}>APPUNTAMENTO</div>
          <div className="muted">
            Stato: <b>{appuntamentoPreso ? "Preso" : "Da prendere"}</b>
          </div>
          <div className="muted" style={{ marginTop: 4 }}>
            Compila la data “Appuntamento preso” quando fissi il giorno col cliente.
          </div>
        </div>

        <div className="row" style={{ gap: 16, marginTop: 12, flexWrap: "wrap" }}>
          <label className="row" style={{ gap: 8, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={form.verificheEseguite}
              onChange={(e) => setField("verificheEseguite", e.target.checked)}
            />
            Verifiche eseguite
          </label>

          <label className="row" style={{ gap: 8, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={form.fileSuDropbox}
              onChange={(e) => setField("fileSuDropbox", e.target.checked)}
            />
            File su Dropbox
          </label>

          <label className="row" style={{ gap: 8, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={form.fatturata}
              onChange={(e) => setField("fatturata", e.target.checked)}
            />
            Fatturata
          </label>

          <label className="row" style={{ gap: 8, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={Boolean(form.tecnicoFatturato)}
              onChange={(e) => setField("tecnicoFatturato", e.target.checked)}
            />
            Tecnico pagato
          </label>
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="muted">Note</div>
          <textarea
            className="input"
            style={{ minHeight: 90 }}
            value={form.notes}
            onChange={(e) => setField("notes", e.target.value)}
          />
        </div>
      </div>

      <div
        className="row"
        style={{
          justifyContent: "space-between",
          gap: 8,
          marginTop: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          {mode === "edit" ? (
            <button type="button" className="btn danger" onClick={onDelete}>
              Elimina verifica
            </button>
          ) : null}
        </div>

        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href="/ingegneria-clinica">
            Annulla
          </Link>
          <button className="btn primary" type="submit">
            {mode === "create" ? "Salva verifica" : "Salva modifiche"}
          </button>
        </div>
      </div>
    </form>
  );
}