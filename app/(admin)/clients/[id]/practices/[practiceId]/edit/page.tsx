import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

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

function fmtMoneyInput(v: any) {
  if (v == null || v === "") return "";
  const n = toNum(v);
  return n ? String(n).replace(".", ",") : "";
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
    const encoded = text
      .slice(b64Start + ECON_B64_PREFIX.length, b64End)
      .trim();

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

function buildNotesWithEconomic(notes: string | null, economic: EconomicPayload) {
  const clean = String(notes ?? "").trim();

  if (!hasEconomicData(economic)) {
    return clean || null;
  }

  const compactPayload = normalizeEconomicPayload(economic);
  const encoded = Buffer.from(JSON.stringify(compactPayload), "utf8").toString("base64");
  const token = `${ECON_B64_PREFIX}${encoded}${ECON_B64_SUFFIX}`;

  return clean ? `${clean}\n\n${token}` : token;
}

function getPracticeTotal(p: any, econ: EconomicPayload | null) {
  const candidates = [
    p?.costoPraticaEur,
    p?.practiceAmountEur,
    p?.totalAmountEur,
    p?.priceEur,
    p?.totalEur,
    p?.amountEur,
    p?.clientPriceEur,
    p?.valueEur,
    p?.price,
    p?.total,
    p?.amount,
    econ?.costoPraticaEur,
  ];

  for (const v of candidates) {
    const n = toNum(v);
    if (n !== 0) return n;
  }

  return 0;
}

function extractPaymentRows(p: any, econ: EconomicPayload | null): PaymentRow[] {
  const rows: PaymentRow[] = [];

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

    const rawYear =
      item.paidYear ??
      item.year ??
      item.anno ??
      (paidAt ? paidAt.getFullYear() : null);

    const paidYear =
      rawYear == null || rawYear === ""
        ? null
        : Number.isFinite(Number(rawYear))
        ? Number(rawYear)
        : null;

    const label =
      String(
        item.label ??
          item.name ??
          item.type ??
          item.tipo ??
          item.description ??
          ""
      ).trim() || `Pagamento ${i + 1}`;

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

export default async function EditPracticePage({
  params,
}: {
  params: { id: string; practiceId: string };
}) {
  const p = await prisma.clientPractice.findUnique({
    where: { id: params.practiceId },
    include: { client: true },
  });

  if (!p) return notFound();
  if (p.clientId !== params.id) return notFound();

  const row = p as any;
  const currentStatus = row.apertureStatus ?? "IN_ATTESA";
  const concluso = isConcluso(currentStatus);

  const notesParts = splitNotesAndEconomic(p.notes);
  const econ = notesParts.economic;

  const currentPayments = extractPaymentRows(row, econ);
  const extraPayments = currentPayments.filter(
    (x) => x.label.toUpperCase() !== "ACCONTO" && x.label.toUpperCase() !== "SALDO"
  );

  const accontoRow =
    currentPayments.find((x) => x.label.toUpperCase() === "ACCONTO") ?? null;
  const saldoRow =
    currentPayments.find((x) => x.label.toUpperCase() === "SALDO") ?? null;

  async function updatePractice(formData: FormData) {
    "use server";

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

    if (!title) {
      redirect(`/clients/${clientId}/practices/${practiceId}/edit`);
    }

    const costoPraticaRaw = String(formData.get("costoPraticaEur") ?? "").trim();
    const accontoEurRaw = String(formData.get("accontoEur") ?? "").trim();
    const accontoDateRaw = String(formData.get("accontoDate") ?? "").trim();
    const accontoYearRaw = String(formData.get("accontoYear") ?? "").trim();
    const accontoNotesRaw = String(formData.get("accontoNotes") ?? "").trim();

    const saldoEurRaw = String(formData.get("saldoEur") ?? "").trim();
    const saldoDateRaw = String(formData.get("saldoDate") ?? "").trim();
    const saldoYearRaw = String(formData.get("saldoYear") ?? "").trim();
    const saldoNotesRaw = String(formData.get("saldoNotes") ?? "").trim();

    const labels = formData.getAll("paymentLabel").map((v) => String(v ?? "").trim());
    const amounts = formData.getAll("paymentAmount").map((v) => String(v ?? "").trim());
    const dates = formData.getAll("paymentDate").map((v) => String(v ?? "").trim());
    const years = formData.getAll("paymentYear").map((v) => String(v ?? "").trim());
    const notesRows = formData.getAll("paymentNotes").map((v) => String(v ?? "").trim());

    const paymentRows = labels
      .map((label, i) => {
        const amount = toNum(amounts[i]);
        const paymentDate = dates[i] ? new Date(`${dates[i]}T12:00:00`) : null;
        const paymentYear =
          years[i] && Number.isFinite(Number(years[i]))
            ? Number(years[i])
            : paymentDate
            ? paymentDate.getFullYear()
            : null;
        const paymentNotes = notesRows[i] ?? "";

        if (!label && !amount && !paymentDate && !paymentNotes) return null;

        return {
          label: label || `Pagamento ${i + 1}`,
          amountEur: amount,
          paidAt: paymentDate ? paymentDate.toISOString() : null,
          paidYear: paymentYear,
          notes: paymentNotes || null,
        };
      })
      .filter(Boolean) as EconomicPayload["paymentRows"];

    const costoPraticaEur = costoPraticaRaw ? toNum(costoPraticaRaw) : null;
    const accontoEur = accontoEurRaw ? toNum(accontoEurRaw) : null;
    const accontoDate = accontoDateRaw ? new Date(`${accontoDateRaw}T12:00:00`) : null;
    const accontoYear =
      accontoYearRaw && Number.isFinite(Number(accontoYearRaw))
        ? Number(accontoYearRaw)
        : accontoDate
        ? accontoDate.getFullYear()
        : null;

    const saldoEur = saldoEurRaw ? toNum(saldoEurRaw) : null;
    const saldoDate = saldoDateRaw ? new Date(`${saldoDateRaw}T12:00:00`) : null;
    const saldoYear =
      saldoYearRaw && Number.isFinite(Number(saldoYearRaw))
        ? Number(saldoYearRaw)
        : saldoDate
        ? saldoDate.getFullYear()
        : null;

    const economicPayload: EconomicPayload = {
      costoPraticaEur,
      accontoEur,
      accontoDate: accontoDate ? accontoDate.toISOString() : null,
      accontoYear,
      accontoNotes: accontoNotesRaw || null,
      saldoEur,
      saldoDate: saldoDate ? saldoDate.toISOString() : null,
      saldoYear,
      saldoNotes: saldoNotesRaw || null,
      paymentRows,
    };

    await prisma.clientPractice.update({
      where: { id: practiceId },
      data: {
        title,
        practiceDate: practiceDateRaw ? new Date(`${practiceDateRaw}T12:00:00`) : null,
        determinaNumber,
        inApertureList,
        apertureStatus,
        startYear,
        notes: buildNotesWithEconomic(notes, economicPayload),
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
          <h2 style={{ marginBottom: 10 }}>Parte economica</h2>

          <div className="grid2">
            <div>
              <label>Costo pratica (€)</label>
              <input
                className="input"
                name="costoPraticaEur"
                defaultValue={fmtMoneyInput(getPracticeTotal(row, econ))}
                placeholder="Es. 2500"
              />
            </div>
            <div className="muted" style={{ marginTop: 28 }}>
              I dati economici vengono salvati in formato compatto e non devono più comparire come JSON nelle note.
            </div>
          </div>

          <div className="grid2" style={{ marginTop: 12 }}>
            <div>
              <label>Acconto (€)</label>
              <input
                className="input"
                name="accontoEur"
                defaultValue={fmtMoneyInput(accontoRow?.amount ?? econ?.accontoEur)}
                placeholder="Es. 500"
              />
            </div>
            <div>
              <label>Data acconto</label>
              <input
                className="input"
                type="date"
                name="accontoDate"
                defaultValue={fmtIso(accontoRow?.paidAt ?? parseMaybeDate(econ?.accontoDate))}
              />
            </div>
          </div>

          <div className="grid2" style={{ marginTop: 12 }}>
            <div>
              <label>Anno acconto</label>
              <input
                className="input"
                type="number"
                name="accontoYear"
                defaultValue={accontoRow?.paidYear ?? econ?.accontoYear ?? ""}
                placeholder="Es. 2026"
              />
            </div>
            <div>
              <label>Note acconto</label>
              <input
                className="input"
                name="accontoNotes"
                defaultValue={accontoRow?.notes ?? econ?.accontoNotes ?? ""}
              />
            </div>
          </div>

          <div className="grid2" style={{ marginTop: 12 }}>
            <div>
              <label>Saldo (€)</label>
              <input
                className="input"
                name="saldoEur"
                defaultValue={fmtMoneyInput(saldoRow?.amount ?? econ?.saldoEur)}
                placeholder="Es. 2000"
              />
            </div>
            <div>
              <label>Data saldo</label>
              <input
                className="input"
                type="date"
                name="saldoDate"
                defaultValue={fmtIso(saldoRow?.paidAt ?? parseMaybeDate(econ?.saldoDate))}
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
                defaultValue={saldoRow?.paidYear ?? econ?.saldoYear ?? ""}
                placeholder="Es. 2027"
              />
            </div>
            <div>
              <label>Note saldo</label>
              <input
                className="input"
                name="saldoNotes"
                defaultValue={saldoRow?.notes ?? econ?.saldoNotes ?? ""}
              />
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 12 }}>
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0 }}>Pagamenti intermedi / rate</h2>
            <div className="muted">Compila solo le righe che ti servono</div>
          </div>

          {Array.from({ length: 5 }).map((_, i) => {
            const current = extraPayments[i];

            return (
              <div
                key={i}
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: i === 0 ? "none" : "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <div className="grid2">
                  <div>
                    <label>Voce pagamento {i + 1}</label>
                    <input
                      className="input"
                      name="paymentLabel"
                      defaultValue={current?.label ?? ""}
                      placeholder="Es. Secondo acconto / SAL / Integrazione"
                    />
                  </div>

                  <div>
                    <label>Importo (€)</label>
                    <input
                      className="input"
                      name="paymentAmount"
                      defaultValue={fmtMoneyInput(current?.amount)}
                      placeholder="Es. 350"
                    />
                  </div>
                </div>

                <div className="grid2" style={{ marginTop: 12 }}>
                  <div>
                    <label>Data pagamento</label>
                    <input
                      className="input"
                      type="date"
                      name="paymentDate"
                      defaultValue={fmtIso(current?.paidAt ?? null)}
                    />
                  </div>

                  <div>
                    <label>Anno pagamento</label>
                    <input
                      className="input"
                      type="number"
                      name="paymentYear"
                      defaultValue={current?.paidYear ?? ""}
                      placeholder="Es. 2026"
                    />
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <label>Note pagamento</label>
                  <input
                    className="input"
                    name="paymentNotes"
                    defaultValue={current?.notes ?? ""}
                    placeholder="Facoltative"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Note</label>
          <textarea className="input" name="notes" rows={5} defaultValue={notesParts.cleanNotes} />
        </div>

        <div className="row" style={{ marginTop: 14, gap: 8 }}>
          <button className="btn primary" type="submit">
            Salva
          </button>

          <Link className="btn" href={`/clients/${params.id}`}>
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