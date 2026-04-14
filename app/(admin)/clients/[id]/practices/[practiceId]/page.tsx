import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ECON_START = "--- ECONOMICA_JSON ---";
const ECON_END = "--- FINE ECONOMICA_JSON ---";
const ECON_B64_PREFIX = "[[ECON_B64:";
const ECON_B64_SUFFIX = "]]";

type PaymentRow = {
  label: string;
  amount: number;
  paidAt: Date | null;
  paidYear: number | null;
  notes: string;
};

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

function fmt(d: Date | null | undefined) {
  return d ? new Date(d).toLocaleDateString("it-IT") : "—";
}

function fmtYear(v: number | null | undefined) {
  return v ? String(v) : "—";
}

function fmtEur(v: any) {
  if (v == null || v === "") return "—";
  const n = Number(String(v).replace(",", "."));
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

function toNum(v: any) {
  if (v == null || v === "") return 0;
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function practiceStatusLabel(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();

  if (s === "INVIATA_REGIONE") return "Inviata Regione";
  if (s === "INIZIO_LAVORI") return "Inizio lavori";
  if (s === "ACCETTATO") return "Accettato";
  if (s === "ISPEZIONE_ASL") return "Ispezione ASL";
  if (s === "IN_ATTESA") return "In attesa";
  if (s === "CONCLUSO") return "Concluso";

  return s || "—";
}

function practiceStatusBadgeStyle(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();

  if (s === "CONCLUSO") {
    return {
      background: "rgba(34,197,94,0.12)",
      color: "#166534",
      border: "1px solid rgba(34,197,94,0.30)",
    };
  }

  if (s === "ACCETTATO") {
    return {
      background: "rgba(37,99,235,0.12)",
      color: "#1d4ed8",
      border: "1px solid rgba(37,99,235,0.30)",
    };
  }

  if (s === "ISPEZIONE_ASL") {
    return {
      background: "rgba(245,158,11,0.12)",
      color: "#92400e",
      border: "1px solid rgba(245,158,11,0.30)",
    };
  }

  if (s === "INIZIO_LAVORI") {
    return {
      background: "rgba(168,85,247,0.12)",
      color: "#7c3aed",
      border: "1px solid rgba(168,85,247,0.30)",
    };
  }

  if (s === "INVIATA_REGIONE") {
    return {
      background: "rgba(14,165,233,0.12)",
      color: "#0369a1",
      border: "1px solid rgba(14,165,233,0.30)",
    };
  }

  return {
    background: "rgba(0,0,0,0.04)",
    color: "rgba(0,0,0,0.72)",
    border: "1px solid rgba(0,0,0,0.12)",
  };
}

function fatturazioneLabel(v: boolean | null | undefined) {
  return v ? "Fatturata" : "Da fatturare";
}

function fatturazioneBadgeStyle(v: boolean | null | undefined) {
  if (v) {
    return {
      background: "rgba(34,197,94,0.12)",
      color: "#166534",
      border: "1px solid rgba(34,197,94,0.30)",
    };
  }

  return {
    background: "rgba(245,158,11,0.12)",
    color: "#92400e",
    border: "1px solid rgba(245,158,11,0.30)",
  };
}

function billingTypeLabel(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();

  if (s === "ACCETTAZIONE") return "Accettazione";
  if (s === "PRIMO_ACCONTO") return "Primo acconto";
  if (s === "SECONDO_ACCONTO") return "Secondo acconto";
  if (s === "SALDO") return "Saldo";
  if (s === "ALTRO") return "Altro";

  return s || "—";
}

function billingStatusLabel(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();

  if (s === "DA_FATTURARE") return "Da fatturare";
  if (s === "FATTURA_DA_INVIARE") return "Fattura da inviare";
  if (s === "FATTURATA") return "Fatturata";
  if (s === "INCASSATA") return "Incassata";

  return s || "—";
}

function billingStatusBadgeStyle(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();

  if (s === "INCASSATA") {
    return {
      background: "rgba(34,197,94,0.12)",
      color: "#166534",
      border: "1px solid rgba(34,197,94,0.30)",
    };
  }

  if (s === "FATTURATA") {
    return {
      background: "rgba(37,99,235,0.12)",
      color: "#1d4ed8",
      border: "1px solid rgba(37,99,235,0.30)",
    };
  }

  if (s === "FATTURA_DA_INVIARE") {
    return {
      background: "rgba(245,158,11,0.12)",
      color: "#92400e",
      border: "1px solid rgba(245,158,11,0.30)",
    };
  }

  return {
    background: "rgba(0,0,0,0.04)",
    color: "rgba(0,0,0,0.72)",
    border: "1px solid rgba(0,0,0,0.12)",
  };
}

function parseMaybeDate(v: any): Date | null {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

function parseMaybeArray(v: any): any[] {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function normalizeEconomicPayload(raw: any): EconomicPayload | null {
  if (!raw || typeof raw !== "object") return null;

  const paymentRowsRaw = Array.isArray(raw.paymentRows) ? raw.paymentRows : [];

  return {
    costoPraticaEur:
      raw.costoPraticaEur == null || raw.costoPraticaEur === "" ? null : toNum(raw.costoPraticaEur),
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

function getPracticeTotal(p: any, econ: EconomicPayload | null) {
  const candidates = [
    p?.amountEur,
    p?.costoPraticaEur,
    p?.practiceAmountEur,
    p?.totalAmountEur,
    p?.priceEur,
    p?.totalEur,
    p?.clientPriceEur,
    p?.valueEur,
    p?.price,
    p?.total,
    p?.amount,
    econ?.costoPraticaEur,
  ];

  for (const v of candidates) {
    const n = Number(String(v ?? "").replace(",", "."));
    if (Number.isFinite(n) && n !== 0) return n;
  }

  return 0;
}

function extractPaymentRows(p: any, econ: EconomicPayload | null) {
  const rows: Array<{
    label: string;
    amount: number;
    paidAt: Date | null;
    paidYear: number | null;
    notes: string;
  }> = [];

  const arrayCandidates = [
    ...parseMaybeArray(p?.payments),
    ...parseMaybeArray(p?.paymentRows),
    ...parseMaybeArray(p?.paymentSteps),
    ...parseMaybeArray(p?.incassi),
    ...parseMaybeArray(p?.rate),
    ...(econ?.paymentRows ?? []),
  ];

  for (let i = 0; i < arrayCandidates.length; i++) {
    const item = arrayCandidates[i] ?? {};
    const amount = toNum(
      item.amountEur ??
        item.importoEur ??
        item.amount ??
        item.importo ??
        item.priceEur ??
        item.valueEur
    );

    const paidAt =
      parseMaybeDate(item.paidAt) ??
      parseMaybeDate(item.paymentDate) ??
      parseMaybeDate(item.date) ??
      parseMaybeDate(item.dataPagamento);

    const paidYearRaw =
      item.paidYear ??
      item.year ??
      item.anno ??
      (paidAt ? paidAt.getFullYear() : null);

    const paidYear =
      paidYearRaw == null || paidYearRaw === ""
        ? null
        : Number.isFinite(Number(paidYearRaw))
        ? Number(paidYearRaw)
        : null;

    const label =
      String(item.label ?? item.name ?? item.type ?? item.tipo ?? item.description ?? "").trim() ||
      `Pagamento ${i + 1}`;

    const notes = String(item.notes ?? item.note ?? "").trim();

    if (amount > 0 || paidAt || notes) {
      rows.push({
        label,
        amount,
        paidAt,
        paidYear,
        notes,
      });
    }
  }

  const accontoAmount = toNum(
    p?.accontoEur ??
      p?.acceptanceAmountEur ??
      p?.downPaymentEur ??
      p?.depositEur ??
      econ?.accontoEur
  );
  const accontoDate =
    parseMaybeDate(p?.accontoDate) ??
    parseMaybeDate(p?.acceptanceDate) ??
    parseMaybeDate(p?.downPaymentDate) ??
    parseMaybeDate(econ?.accontoDate);
  const accontoYearRaw =
    p?.accontoYear ??
    p?.acceptanceYear ??
    p?.downPaymentYear ??
    econ?.accontoYear ??
    (accontoDate ? accontoDate.getFullYear() : null);
  const accontoYear =
    accontoYearRaw == null || accontoYearRaw === ""
      ? null
      : Number.isFinite(Number(accontoYearRaw))
      ? Number(accontoYearRaw)
      : null;
  const accontoNotes = String(p?.accontoNotes ?? econ?.accontoNotes ?? "").trim();

  if (accontoAmount > 0 || accontoDate || accontoNotes) {
    rows.push({
      label: "Acconto",
      amount: accontoAmount,
      paidAt: accontoDate,
      paidYear: accontoYear,
      notes: accontoNotes,
    });
  }

  const saldoAmount = toNum(
    p?.saldoEur ??
      p?.balanceEur ??
      p?.finalAmountEur ??
      econ?.saldoEur
  );
  const saldoDate =
    parseMaybeDate(p?.saldoDate) ??
    parseMaybeDate(p?.balanceDate) ??
    parseMaybeDate(p?.finalPaymentDate) ??
    parseMaybeDate(econ?.saldoDate);
  const saldoYearRaw =
    p?.saldoYear ??
    p?.balanceYear ??
    p?.finalPaymentYear ??
    econ?.saldoYear ??
    (saldoDate ? saldoDate.getFullYear() : null);
  const saldoYear =
    saldoYearRaw == null || saldoYearRaw === ""
      ? null
      : Number.isFinite(Number(saldoYearRaw))
      ? Number(saldoYearRaw)
      : null;
  const saldoNotes = String(p?.saldoNotes ?? econ?.saldoNotes ?? "").trim();

  if (saldoAmount > 0 || saldoDate || saldoNotes) {
    rows.push({
      label: "Saldo",
      amount: saldoAmount,
      paidAt: saldoDate,
      paidYear: saldoYear,
      notes: saldoNotes,
    });
  }

  return rows.sort((a, b) => {
    const at = a.paidAt ? a.paidAt.getTime() : Number.MAX_SAFE_INTEGER;
    const bt = b.paidAt ? b.paidAt.getTime() : Number.MAX_SAFE_INTEGER;
    return at - bt;
  });
}

export default async function PracticeDetailPage({
  params,
}: {
  params: { id: string; practiceId: string };
}) {
  const { prisma } = await import("@/lib/prisma");
  const p = await prisma.clientPractice.findUnique({
    where: { id: params.practiceId },
    include: {
      client: true,
      billingSteps: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  if (!p) return notFound();
  if (p.clientId !== params.id) return notFound();

  const practiceAny = p as any;
  const notesParts = splitNotesAndEconomic(p.notes);
  const econ = notesParts.economic;

  const totalPracticeAmount = getPracticeTotal(practiceAny, econ);
  const paymentRows = extractPaymentRows(practiceAny, econ);

  const billingSteps = Array.isArray((p as any).billingSteps) ? (p as any).billingSteps : [];
  const billingTotal = billingSteps.reduce((acc: number, row: any) => acc + toNum(row.amountEur), 0);
  const billingFatturato = billingSteps
    .filter((row: any) => ["FATTURATA", "INCASSATA"].includes(String(row.billingStatus ?? "").toUpperCase()))
    .reduce((acc: number, row: any) => acc + toNum(row.amountEur), 0);
  const billingIncassato = billingSteps
    .filter((row: any) => String(row.billingStatus ?? "").toUpperCase() === "INCASSATA")
    .reduce((acc: number, row: any) => acc + toNum(row.amountEur), 0);
  const billingDaInviare = billingSteps.filter(
    (row: any) => String(row.billingStatus ?? "").toUpperCase() === "FATTURA_DA_INVIARE"
  ).length;

  const paymentRowsTotal = paymentRows.reduce((acc, row) => acc + row.amount, 0);
  const totalPaid = Math.max(paymentRowsTotal, billingIncassato);
  const remaining = Math.max(totalPracticeAmount - totalPaid, 0);

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Pratica</h1>

        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href={`/clients/${params.id}`}>
            ← Torna al cliente
          </Link>

          <Link className="btn" href={`/clients/${params.id}/practices/${params.practiceId}/edit`}>
            Modifica
          </Link>

          <Link className="btn" href={`/clients/${params.id}/practices/${params.practiceId}/delete`}>
            Elimina
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        Cliente: <b>{p.client.name}</b>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="grid2">
          <div>
            <div className="muted">Pratica</div>
            <div>
              <b>{p.title}</b>
            </div>
          </div>

          <div>
            <div className="muted">Data</div>
            <div>{fmt(p.practiceDate)}</div>
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <div className="muted">Numero determina</div>
            <div>{p.determinaNumber ?? "—"}</div>
          </div>

          <div>
            <div className="muted">Lista Aperture</div>
            <div>{practiceAny.inApertureList ? "SI" : "NO"}</div>
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <div className="muted">Stato</div>
            <div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 800,
                  ...practiceStatusBadgeStyle(practiceAny.apertureStatus),
                }}
              >
                {practiceStatusLabel(practiceAny.apertureStatus)}
              </span>
            </div>
          </div>

          <div>
            <div className="muted">Anno inizio</div>
            <div>{fmtYear(practiceAny.startYear)}</div>
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <div className="muted">Importo pratica</div>
            <div>
              <b>{totalPracticeAmount > 0 ? fmtEur(totalPracticeAmount) : "—"}</b>
            </div>
          </div>

          <div>
            <div className="muted">Fatturazione pratica</div>
            <div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 800,
                  ...fatturazioneBadgeStyle(Boolean(practiceAny.fatturata)),
                }}
              >
                {fatturazioneLabel(Boolean(practiceAny.fatturata))}
              </span>
            </div>
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <div className="muted">Data fatturazione pratica</div>
            <div>{fmt(practiceAny.fatturataAt)}</div>
          </div>

          <div>
            <div className="muted">Ultimo aggiornamento</div>
            <div>{fmt(p.updatedAt)}</div>
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <div className="muted">Creata il</div>
            <div>{fmt(p.createdAt)}</div>
          </div>

          <div>
            <div className="muted">Cliente</div>
            <div>{p.client.name}</div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="muted">Note</div>
          <div>{notesParts.cleanNotes || "—"}</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="row" style={{ gap: 12, flexWrap: "wrap" }}>
          <div className="card">
            SAL totali: <b>{billingSteps.length}</b>
          </div>
          <div className="card">
            Da inviare: <b>{billingDaInviare}</b>
          </div>
          <div className="card">
            Totale SAL: <b>{billingTotal > 0 ? fmtEur(billingTotal) : "—"}</b>
          </div>
          <div className="card">
            Fatturato SAL: <b>{billingFatturato > 0 ? fmtEur(billingFatturato) : "—"}</b>
          </div>
          <div className="card">
            Incassato SAL: <b>{billingIncassato > 0 ? fmtEur(billingIncassato) : "—"}</b>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <h2>Piano fatturazione / SAL</h2>

          <Link className="btn" href={`/clients/${params.id}/practices/${params.practiceId}/edit`}>
            Gestisci SAL
          </Link>
        </div>

        {billingSteps.length ? (
          <table className="table" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Voce</th>
                <th>Tipo</th>
                <th>Trigger stato</th>
                <th>Importo</th>
                <th>Stato fattura</th>
                <th>N. fattura</th>
                <th>Data fattura</th>
                <th>Incasso</th>
              </tr>
            </thead>

            <tbody>
              {billingSteps.map((row: any, idx: number) => {
                const triggerNow =
                  String(row.triggerStatus ?? "").trim().toUpperCase() !== "" &&
                  String(row.triggerStatus ?? "").trim().toUpperCase() ===
                    String(practiceAny.apertureStatus ?? "").trim().toUpperCase() &&
                  String(row.billingStatus ?? "").trim().toUpperCase() === "DA_FATTURARE";

                return (
                  <tr key={row.id}>
                    <td>{row.sortOrder ?? idx + 1}</td>

                    <td style={{ maxWidth: 280, whiteSpace: "normal", wordBreak: "break-word" }}>
                      <b>{row.label ?? "—"}</b>
                      {row.notes ? <div className="muted" style={{ marginTop: 4 }}>{row.notes}</div> : null}
                    </td>

                    <td>{billingTypeLabel(row.billingType)}</td>

                    <td>
                      {row.triggerStatus ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "4px 10px",
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 800,
                            ...practiceStatusBadgeStyle(row.triggerStatus),
                          }}
                        >
                          {practiceStatusLabel(row.triggerStatus)}
                        </span>
                      ) : (
                        "—"
                      )}

                      {triggerNow ? (
                        <div className="muted" style={{ marginTop: 6, color: "#92400e", fontWeight: 700 }}>
                          Da attivare ora
                        </div>
                      ) : null}
                    </td>

                    <td>{toNum(row.amountEur) > 0 ? fmtEur(row.amountEur) : "—"}</td>

                    <td>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "4px 10px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 800,
                          ...billingStatusBadgeStyle(row.billingStatus),
                        }}
                      >
                        {billingStatusLabel(row.billingStatus)}
                      </span>
                    </td>

                    <td>{row.invoiceNumber ?? "—"}</td>
                    <td>{fmt(row.invoiceDate)}</td>
                    <td>{fmt(row.paidAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="muted" style={{ marginTop: 10 }}>
            Nessuna riga SAL ancora inserita.
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h2 style={{ marginBottom: 10 }}>Riepilogo economico</h2>

        <div className="grid3">
          <div>
            <div className="muted">Costo pratica</div>
            <div>
              <b>{totalPracticeAmount > 0 ? fmtEur(totalPracticeAmount) : "—"}</b>
            </div>
          </div>

          <div>
            <div className="muted">Totale incassato</div>
            <div>
              <b>{totalPaid > 0 ? fmtEur(totalPaid) : "—"}</b>
            </div>
          </div>

          <div>
            <div className="muted">Residuo</div>
            <div>
              <b>{totalPracticeAmount > 0 ? fmtEur(remaining) : "—"}</b>
            </div>
          </div>
        </div>

        <div className="muted" style={{ marginTop: 10 }}>
          Il totale incassato considera sia i pagamenti pratica classici sia i SAL marcati come incassati.
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <h2>Pagamenti pratica</h2>

          <Link className="btn" href={`/clients/${params.id}/practices/${params.practiceId}/edit`}>
            Gestisci pagamenti
          </Link>
        </div>

        {paymentRows.length ? (
          <table className="table" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>Voce</th>
                <th>Importo</th>
                <th>Data pagamento</th>
                <th>Anno fatturato</th>
                <th>Note</th>
              </tr>
            </thead>

            <tbody>
              {paymentRows.map((row, idx) => (
                <tr key={`${row.label}-${idx}`}>
                  <td>
                    <b>{row.label}</b>
                  </td>
                  <td>{row.amount > 0 ? fmtEur(row.amount) : "—"}</td>
                  <td>{fmt(row.paidAt)}</td>
                  <td>{fmtYear(row.paidYear)}</td>
                  <td style={{ maxWidth: 360, whiteSpace: "normal", wordBreak: "break-word" }}>
                    {row.notes || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="muted" style={{ marginTop: 10 }}>
            Nessun pagamento inserito.
          </div>
        )}
      </div>
    </div>
  );
}