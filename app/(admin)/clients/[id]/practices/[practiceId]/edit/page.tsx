import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ECON_START = "--- ECONOMICA_JSON ---";
const ECON_END = "--- FINE ECONOMICA_JSON ---";
const ECON_B64_PREFIX = "[[ECON_B64:";
const ECON_B64_SUFFIX = "]]";

type EconomicPayload = {
  costoPraticaEur: number | null;
  accontoEur: number | null;
  accontoDate: string | null;
  accontoYear: number | null;
  accontoNotes: string | null;
  saldoEur: number | null;
  saldoDate: string | null;
  saldoYear: number | null;
  saldoNotes: string | null;
  paymentRows: Array<{
    label: string;
    amountEur: number;
    paidAt: string | null;
    paidYear: number | null;
    notes: string | null;
  }>;
};

function fmtIso(d: Date | null) {
  return d ? new Date(d).toISOString().slice(0, 10) : "";
}

function isConcluso(v: string | null | undefined) {
  return String(v ?? "").trim().toUpperCase() === "CONCLUSO";
}

function getStatusStyle(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();

  if (s === "CONCLUSO") return { color: "#166534", fontWeight: 900 };
  if (s === "ACCETTATO") return { color: "#1d4ed8", fontWeight: 800 };
  if (s === "ISPEZIONE_ASL") return { color: "#92400e", fontWeight: 800 };
  if (s === "INIZIO_LAVORI") return { color: "#7c3aed", fontWeight: 800 };
  if (s === "INVIATA_REGIONE") return { color: "#0369a1", fontWeight: 800 };

  return {};
}

function toNum(v: any) {
  if (v == null || v === "") return 0;
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function eur(v: any) {
  return toNum(v).toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

function normalizeEconomicPayload(raw: any): EconomicPayload | null {
  if (!raw || typeof raw !== "object") return null;

  const paymentRowsRaw = Array.isArray(raw.paymentRows) ? raw.paymentRows : [];

  return {
    costoPraticaEur:
      raw.costoPraticaEur == null || raw.costoPraticaEur === ""
        ? null
        : toNum(raw.costoPraticaEur),
    accontoEur: raw.accontoEur == null || raw.accontoEur === "" ? null : toNum(raw.accontoEur),
    accontoDate: raw.accontoDate ? String(raw.accontoDate) : null,
    accontoYear:
      raw.accontoYear == null || raw.accontoYear === ""
        ? null
        : Number.isFinite(Number(raw.accontoYear))
          ? Number(raw.accontoYear)
          : null,
    accontoNotes: raw.accontoNotes ? String(raw.accontoNotes) : null,
    saldoEur: raw.saldoEur == null || raw.saldoEur === "" ? null : toNum(raw.saldoEur),
    saldoDate: raw.saldoDate ? String(raw.saldoDate) : null,
    saldoYear:
      raw.saldoYear == null || raw.saldoYear === ""
        ? null
        : Number.isFinite(Number(raw.saldoYear))
          ? Number(raw.saldoYear)
          : null,
    saldoNotes: raw.saldoNotes ? String(raw.saldoNotes) : null,
    paymentRows: paymentRowsRaw
      .map((row: any, i: number) => ({
        label: String(row?.label ?? `Pagamento ${i + 1}`).trim() || `Pagamento ${i + 1}`,
        amountEur: toNum(row?.amountEur),
        paidAt: row?.paidAt ? String(row.paidAt) : null,
        paidYear:
          row?.paidYear == null || row?.paidYear === ""
            ? null
            : Number.isFinite(Number(row.paidYear))
              ? Number(row.paidYear)
              : null,
        notes: row?.notes ? String(row.notes) : null,
      }))
      .filter((row: any) => row.label || row.amountEur || row.paidAt || row.notes),
  };
}

function emptyEconomicPayload(): EconomicPayload {
  return {
    costoPraticaEur: null,
    accontoEur: null,
    accontoDate: null,
    accontoYear: null,
    accontoNotes: null,
    saldoEur: null,
    saldoDate: null,
    saldoYear: null,
    saldoNotes: null,
    paymentRows: [],
  };
}

function hasEconomicData(economic: EconomicPayload | null | undefined) {
  if (!economic) return false;

  if (toNum(economic.costoPraticaEur) > 0) return true;
  if (toNum(economic.accontoEur) > 0) return true;
  if (economic.accontoDate) return true;
  if (economic.accontoYear) return true;
  if (String(economic.accontoNotes ?? "").trim()) return true;
  if (toNum(economic.saldoEur) > 0) return true;
  if (economic.saldoDate) return true;
  if (economic.saldoYear) return true;
  if (String(economic.saldoNotes ?? "").trim()) return true;

  for (const row of economic.paymentRows ?? []) {
    if (
      String(row.label ?? "").trim() ||
      toNum(row.amountEur) > 0 ||
      row.paidAt ||
      row.paidYear ||
      String(row.notes ?? "").trim()
    ) {
      return true;
    }
  }

  return false;
}

function splitNotesAndEconomic(rawNotes: string | null | undefined) {
  const text = String(rawNotes ?? "");

  const b64Start = text.indexOf(ECON_B64_PREFIX);
  const b64End = b64Start >= 0 ? text.indexOf(ECON_B64_SUFFIX, b64Start) : -1;

  if (b64Start !== -1 && b64End !== -1 && b64End > b64Start) {
    const cleanNotes = text.slice(0, b64Start).trim();
    const encoded = text.slice(b64Start + ECON_B64_PREFIX.length, b64End).trim();

    try {
      const decoded = Buffer.from(encoded, "base64").toString("utf8");
      const parsed = JSON.parse(decoded);
      return {
        cleanNotes,
        economic: normalizeEconomicPayload(parsed),
      };
    } catch {
      return {
        cleanNotes: text.trim(),
        economic: null as EconomicPayload | null,
      };
    }
  }

  const start = text.indexOf(ECON_START);
  const end = text.indexOf(ECON_END);

  if (start === -1 || end === -1 || end <= start) {
    return {
      cleanNotes: text.trim(),
      economic: null as EconomicPayload | null,
    };
  }

  const cleanNotes = text.slice(0, start).trim();
  const jsonText = text.slice(start + ECON_START.length, end).trim();

  try {
    const parsed = JSON.parse(jsonText);
    return {
      cleanNotes,
      economic: normalizeEconomicPayload(parsed),
    };
  } catch {
    return {
      cleanNotes: text.trim(),
      economic: null as EconomicPayload | null,
    };
  }
}

function buildNotesWithEconomic(notes: string | null, economic: EconomicPayload | null) {
  const clean = String(notes ?? "").trim();

  if (!hasEconomicData(economic)) {
    return clean || null;
  }

  const compactPayload = normalizeEconomicPayload(economic);
  const encoded = Buffer.from(JSON.stringify(compactPayload), "utf8").toString("base64");
  const token = `${ECON_B64_PREFIX}${encoded}${ECON_B64_SUFFIX}`;

  return clean ? `${clean}\n\n${token}` : token;
}

function buildEconomicFromFormData(formData: FormData): EconomicPayload {
  const paymentRows: EconomicPayload["paymentRows"] = [];

  for (let i = 0; i < 10; i++) {
    const label = String(formData.get(`paymentRows.${i}.label`) ?? "").trim();
    const amountRaw = String(formData.get(`paymentRows.${i}.amountEur`) ?? "").trim();
    const paidAt = String(formData.get(`paymentRows.${i}.paidAt`) ?? "").trim() || null;
    const paidYearRaw = String(formData.get(`paymentRows.${i}.paidYear`) ?? "").trim();
    const notes = String(formData.get(`paymentRows.${i}.notes`) ?? "").trim() || null;

    const amountEur = toNum(amountRaw);
    const paidYear =
      paidYearRaw && Number.isFinite(Number(paidYearRaw)) ? Number(paidYearRaw) : null;

    if (label || amountEur > 0 || paidAt || paidYear || notes) {
      paymentRows.push({
        label: label || `Pagamento ${i + 1}`,
        amountEur,
        paidAt,
        paidYear,
        notes,
      });
    }
  }

  return {
    costoPraticaEur: (() => {
      const v = String(formData.get("costoPraticaEur") ?? "").trim();
      return v === "" ? null : toNum(v);
    })(),
    accontoEur: (() => {
      const v = String(formData.get("accontoEur") ?? "").trim();
      return v === "" ? null : toNum(v);
    })(),
    accontoDate: String(formData.get("accontoDate") ?? "").trim() || null,
    accontoYear: (() => {
      const v = String(formData.get("accontoYear") ?? "").trim();
      return v && Number.isFinite(Number(v)) ? Number(v) : null;
    })(),
    accontoNotes: String(formData.get("accontoNotes") ?? "").trim() || null,
    saldoEur: (() => {
      const v = String(formData.get("saldoEur") ?? "").trim();
      return v === "" ? null : toNum(v);
    })(),
    saldoDate: String(formData.get("saldoDate") ?? "").trim() || null,
    saldoYear: (() => {
      const v = String(formData.get("saldoYear") ?? "").trim();
      return v && Number.isFinite(Number(v)) ? Number(v) : null;
    })(),
    saldoNotes: String(formData.get("saldoNotes") ?? "").trim() || null,
    paymentRows,
  };
}

function getEconomicSummary(econ: EconomicPayload | null | undefined) {
  const e = econ ?? emptyEconomicPayload();

  const costoPraticaEur = toNum(e.costoPraticaEur);
  const accontoEur = toNum(e.accontoEur);
  const saldoEur = toNum(e.saldoEur);
  const altriPagamenti = (e.paymentRows ?? []).reduce((acc, row) => acc + toNum(row.amountEur), 0);
  const totaleRegistrato = accontoEur + saldoEur + altriPagamenti;
  const residuo = costoPraticaEur - totaleRegistrato;

  return {
    costoPraticaEur,
    accontoEur,
    saldoEur,
    altriPagamenti,
    totaleRegistrato,
    residuo,
  };
}

export default async function EditPracticePage({
  params,
}: {
  params: { id: string; practiceId: string };
}) {
  const { prisma } = await import("@/lib/prisma");
  const p = await prisma.clientPractice.findUnique({
    where: { id: params.practiceId },
    include: {
      client: true,
    },
  });

  if (!p) return notFound();
  if (p.clientId !== params.id) return notFound();

  const row = p as any;
  const currentStatus = row.apertureStatus ?? "IN_ATTESA";
  const concluso = isConcluso(currentStatus);

  const notesParts = splitNotesAndEconomic(p.notes);
  const econ = notesParts.economic ?? emptyEconomicPayload();
  const summary = getEconomicSummary(econ);
  const paymentRows = Array.from({ length: Math.max(5, econ.paymentRows.length || 0) }, (_, i) => {
    return econ.paymentRows[i] ?? {
      label: "",
      amountEur: 0,
      paidAt: null,
      paidYear: null,
      notes: null,
    };
  });

  async function updatePractice(formData: FormData) {
    "use server";

    const { prisma } = await import("@/lib/prisma");

    const clientId = params.id;
    const practiceId = params.practiceId;

    const title = String(formData.get("title") ?? "").trim();
    const practiceDateRaw = String(formData.get("practiceDate") ?? "").trim();
    const determinaNumber = String(formData.get("determinaNumber") ?? "").trim() || null;
    const inApertureList = String(formData.get("inApertureList") ?? "") === "on";
    const apertureStatus =
      String(formData.get("apertureStatus") ?? "").trim().toUpperCase() || "IN_ATTESA";
    const startYearRaw = String(formData.get("startYear") ?? "").trim();
    const startYear = startYearRaw ? Number(startYearRaw) : null;
    const notes = String(formData.get("notes") ?? "").trim() || null;
    const economic = buildEconomicFromFormData(formData);

    if (!title) {
      redirect(`/clients/${clientId}/practices/${practiceId}/edit`);
    }

    await prisma.clientPractice.update({
      where: { id: practiceId },
      data: {
        title,
        practiceDate: practiceDateRaw ? new Date(`${practiceDateRaw}T12:00:00`) : null,
        determinaNumber,
        inApertureList,
        apertureStatus,
        startYear,
        notes: buildNotesWithEconomic(notes, economic),
      },
    });

    redirect(`/clients/${clientId}/practices/${practiceId}`);
  }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Modifica pratica</h1>

        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href={`/clients/${params.id}`}>
            ← Torna al cliente
          </Link>

          <Link className="btn" href={`/clients/${params.id}/practices/new`}>
            Nuova pratica
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        Cliente: <b>{p.client.name}</b>
      </div>

      <form action={updatePractice} className="card" style={{ marginTop: 12 }}>
        <div>
          <label>Pratica *</label>
          <input className="input" name="title" defaultValue={p.title} required />
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <label>Data</label>
            <input
              className="input"
              type="date"
              name="practiceDate"
              defaultValue={fmtIso(p.practiceDate)}
            />
          </div>

          <div>
            <label>Determina n°</label>
            <input
              className="input"
              name="determinaNumber"
              defaultValue={p.determinaNumber ?? ""}
              style={
                concluso
                  ? {
                      border: "1px solid rgba(34,197,94,0.4)",
                      background: "rgba(34,197,94,0.08)",
                      color: "#166534",
                      fontWeight: 900,
                    }
                  : undefined
              }
            />
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <label>Stato Apertura</label>
            <select
              className="input"
              name="apertureStatus"
              defaultValue={currentStatus}
              style={getStatusStyle(currentStatus)}
            >
              <option value="IN_ATTESA">In attesa</option>
              <option value="INVIATA_REGIONE">Inviata Regione</option>
              <option value="INIZIO_LAVORI">Inizio lavori</option>
              <option value="ACCETTATO">Accettato</option>
              <option value="ISPEZIONE_ASL">Ispezione ASL</option>
              <option value="CONCLUSO">Concluso</option>
            </select>
          </div>

          <div>
            <label>Anno inizio</label>
            <input
              className="input"
              type="number"
              name="startYear"
              defaultValue={row.startYear ?? ""}
            />
          </div>
        </div>

        <div className="card" style={{ marginTop: 12, padding: 12 }}>
          <label style={{ display: "flex", gap: 10 }}>
            <input
              type="checkbox"
              name="inApertureList"
              defaultChecked={row.inApertureList ?? false}
            />
            <b>Aggiungi in lista Aperture</b>
          </label>
        </div>

        <div className="card" style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 900, fontSize: 16 }}>Parte economica</div>

          <div className="grid2" style={{ marginTop: 12 }}>
            <div>
              <label>Costo pratica €</label>
              <input
                className="input"
                type="number"
                step="0.01"
                name="costoPraticaEur"
                defaultValue={econ.costoPraticaEur ?? ""}
              />
            </div>

            <div>
              <label>Acconto €</label>
              <input
                className="input"
                type="number"
                step="0.01"
                name="accontoEur"
                defaultValue={econ.accontoEur ?? ""}
              />
            </div>
          </div>

          <div className="grid3" style={{ marginTop: 12 }}>
            <div>
              <label>Data acconto</label>
              <input
                className="input"
                type="date"
                name="accontoDate"
                defaultValue={econ.accontoDate ?? ""}
              />
            </div>

            <div>
              <label>Anno acconto</label>
              <input
                className="input"
                type="number"
                name="accontoYear"
                defaultValue={econ.accontoYear ?? ""}
              />
            </div>

            <div>
              <label>Note acconto</label>
              <input className="input" name="accontoNotes" defaultValue={econ.accontoNotes ?? ""} />
            </div>
          </div>

          <div className="grid2" style={{ marginTop: 12 }}>
            <div>
              <label>Saldo €</label>
              <input
                className="input"
                type="number"
                step="0.01"
                name="saldoEur"
                defaultValue={econ.saldoEur ?? ""}
              />
            </div>

            <div>
              <label>Data saldo</label>
              <input
                className="input"
                type="date"
                name="saldoDate"
                defaultValue={econ.saldoDate ?? ""}
              />
            </div>
          </div>

          <div className="grid2" style={{ marginTop: 12 }}>
            <div>
              <label>Anno saldo</label>
              <input
                className="input"
                type="number"
                name="saldoYear"
                defaultValue={econ.saldoYear ?? ""}
              />
            </div>

            <div>
              <label>Note saldo</label>
              <input className="input" name="saldoNotes" defaultValue={econ.saldoNotes ?? ""} />
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 900, fontSize: 16 }}>Pagamenti aggiuntivi</div>

          <div className="tableWrap" style={{ marginTop: 10 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Label</th>
                  <th>Importo €</th>
                  <th>Data</th>
                  <th>Anno</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {paymentRows.map((row, i) => (
                  <tr key={i}>
                    <td>
                      <input
                        className="input"
                        name={`paymentRows.${i}.label`}
                        defaultValue={row.label ?? ""}
                        placeholder={`Pagamento ${i + 1}`}
                      />
                    </td>
                    <td>
                      <input
                        className="input"
                        type="number"
                        step="0.01"
                        name={`paymentRows.${i}.amountEur`}
                        defaultValue={row.amountEur ? String(row.amountEur) : ""}
                      />
                    </td>
                    <td>
                      <input
                        className="input"
                        type="date"
                        name={`paymentRows.${i}.paidAt`}
                        defaultValue={row.paidAt ?? ""}
                      />
                    </td>
                    <td>
                      <input
                        className="input"
                        type="number"
                        name={`paymentRows.${i}.paidYear`}
                        defaultValue={row.paidYear ?? ""}
                      />
                    </td>
                    <td>
                      <input
                        className="input"
                        name={`paymentRows.${i}.notes`}
                        defaultValue={row.notes ?? ""}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          className="card"
          style={{
            marginTop: 12,
            border: "1px solid rgba(37,99,235,0.25)",
            background: "rgba(37,99,235,0.06)",
          }}
        >
          <div style={{ fontWeight: 900, fontSize: 16 }}>Riepilogo economico</div>

          <div className="grid3" style={{ marginTop: 10 }}>
            <div>
              <div className="muted">Costo pratica</div>
              <div style={{ fontWeight: 900 }}>{eur(summary.costoPraticaEur)}</div>
            </div>

            <div>
              <div className="muted">Acconto</div>
              <div style={{ fontWeight: 900 }}>{eur(summary.accontoEur)}</div>
            </div>

            <div>
              <div className="muted">Saldo</div>
              <div style={{ fontWeight: 900 }}>{eur(summary.saldoEur)}</div>
            </div>

            <div>
              <div className="muted">Pagamenti aggiuntivi</div>
              <div style={{ fontWeight: 900 }}>{eur(summary.altriPagamenti)}</div>
            </div>

            <div>
              <div className="muted">Totale registrato</div>
              <div style={{ fontWeight: 900, color: "#166534" }}>
                {eur(summary.totaleRegistrato)}
              </div>
            </div>

            <div>
              <div className="muted">Residuo</div>
              <div
                style={{
                  fontWeight: 900,
                  color: summary.residuo > 0 ? "#b91c1c" : "#166534",
                }}
              >
                {eur(summary.residuo)}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Note</label>
          <textarea className="input" name="notes" rows={5} defaultValue={notesParts.cleanNotes} />
        </div>

        <div className="row" style={{ marginTop: 14, gap: 8 }}>
          <button className="btn primary" type="submit">
            Salva
          </button>

          <Link className="btn" href={`/clients/${params.id}/practices/${params.practiceId}`}>
            Annulla
          </Link>

          <Link
            className="btn"
            href={`/clients/${params.id}/practices/${params.practiceId}/delete`}
          >
            Elimina
          </Link>
        </div>
      </form>
    </div>
  );
}