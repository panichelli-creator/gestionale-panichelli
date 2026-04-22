import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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

function fmt(d: Date | null | undefined) {
  return d ? new Date(d).toLocaleDateString("it-IT") : "—";
}

function fmtIso(d: Date | null | undefined) {
  return d ? new Date(d).toISOString().slice(0, 10) : "";
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

function fmtMoneyInput(v: any) {
  if (v == null || v === "") return "";
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) && n !== 0 ? String(n).replace(".", ",") : "";
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