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

function billingStatusLabel(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();

  if (s === "-" || s === "NONE") return "-";
  if (s === "DA_FATTURARE") return "Da fatturare";
  if (s === "FATTURA_DA_INVIARE") return "Fattura da inviare";
  if (s === "FATTURATA") return "Fatturata";
  if (s === "INCASSATA") return "Incassata";

  return s || "—";
}

function billingStatusBadgeStyle(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();

  if (s === "-" || s === "NONE") {
    return {
      background: "rgba(0,0,0,0.04)",
      color: "rgba(0,0,0,0.60)",
      border: "1px dashed rgba(0,0,0,0.18)",
    };
  }

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
  const billingIncassato = billingSteps
    .filter((row: any) => String(row.billingStatus ?? "").toUpperCase() === "INCASSATA")
    .reduce((acc: number, row: any) => acc + toNum(row.amountEur), 0);

  const paymentRowsTotal = paymentRows.reduce((acc, row) => acc + row.amount, 0);
  const totalPaid = Math.max(paymentRowsTotal, billingIncassato);
  const remaining = Math.max(totalPracticeAmount - totalPaid, 0);

  async function updateBillingSteps(formData: FormData) {
    "use server";

    const { prisma } = await import("@/lib/prisma");

    const practice = await prisma.clientPractice.findUnique({
      where: { id: params.practiceId },
      include: {
        billingSteps: {
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        },
      },
    });

    if (!practice || practice.clientId !== params.id) {
      redirect(`/clients/${params.id}`);
    }

    const currentStatus =
      String((practice as any).apertureStatus ?? "").trim().toUpperCase() || "IN_ATTESA";

    const stepIds = formData.getAll("billingStepId").map((v) => String(v ?? "").trim());
    const stepSortOrders = formData.getAll("billingStepSortOrder").map((v) => String(v ?? "").trim());
    const stepLabels = formData.getAll("billingStepLabel").map((v) => String(v ?? "").trim());
    const stepTriggers = formData
      .getAll("billingStepTriggerStatus")
      .map((v) => String(v ?? "").trim().toUpperCase());
    const stepAmounts = formData
      .getAll("billingStepAmountEur")
      .map((v) => String(v ?? "").trim());
    const stepStatuses = formData
      .getAll("billingStepStatus")
      .map((v) => String(v ?? "").trim().toUpperCase());
    const stepInvoiceNumbers = formData
      .getAll("billingStepInvoiceNumber")
      .map((v) => String(v ?? "").trim());
    const stepInvoiceDates = formData
      .getAll("billingStepInvoiceDate")
      .map((v) => String(v ?? "").trim());
    const stepPaidAts = formData.getAll("billingStepPaidAt").map((v) => String(v ?? "").trim());
    const stepNotes = formData.getAll("billingStepNotes").map((v) => String(v ?? "").trim());

    const existingStepIds = new Set<string>(
      ((practice as any).billingSteps ?? []).map((x: any) => String(x.id))
    );

    const incomingUsedIds = new Set<string>();
    const billingStepRows: Array<{
      id: string | null;
      sortOrder: number;
      label: string;
      triggerStatus: string | null;
      amountEur: number;
      billingStatus: string;
      invoiceNumber: string | null;
      invoiceDate: Date | null;
      paidAt: Date | null;
      notes: string | null;
    }> = [];

    for (let i = 0; i < stepLabels.length; i++) {
      const id = stepIds[i] || "";
      const label = stepLabels[i] || "";
      const triggerStatus = stepTriggers[i] || null;
      const amountEurStep = toNum(stepAmounts[i]);
      const rawBillingStatus = String(stepStatuses[i] || "").trim().toUpperCase();
      const billingStatus = rawBillingStatus || "-";
      const invoiceNumber = stepInvoiceNumbers[i] || null;
      const invoiceDateInput = stepInvoiceDates[i]
        ? new Date(`${stepInvoiceDates[i]}T12:00:00`)
        : null;
      const paidAtInput = stepPaidAts[i] ? new Date(`${stepPaidAts[i]}T12:00:00`) : null;
      const note = stepNotes[i] || null;
      const sortOrderRaw = stepSortOrders[i];
      const sortOrder =
        sortOrderRaw && Number.isFinite(Number(sortOrderRaw)) ? Number(sortOrderRaw) : i + 1;

      const isBlank =
        !label &&
        !amountEurStep &&
        !triggerStatus &&
        !invoiceNumber &&
        !invoiceDateInput &&
        !paidAtInput &&
        !note &&
        (billingStatus === "-" || billingStatus === "");

      if (isBlank) continue;

      if (id) incomingUsedIds.add(id);

      let nextBillingStatus = billingStatus;

      if (
        nextBillingStatus === "DA_FATTURARE" &&
        triggerStatus &&
        triggerStatus === currentStatus
      ) {
        nextBillingStatus = "FATTURA_DA_INVIARE";
      }

      let invoiceDate = invoiceDateInput;
      let paidAt = paidAtInput;

      if (nextBillingStatus === "FATTURATA" && !invoiceDate) {
        invoiceDate = new Date();
      }

      if (nextBillingStatus === "INCASSATA") {
        if (!invoiceDate) invoiceDate = new Date();
        if (!paidAt) paidAt = new Date();
      }

      if (nextBillingStatus === "-") {
        invoiceDate = null;
        paidAt = null;
      }

      billingStepRows.push({
        id: id || null,
        sortOrder,
        label: label || `Voce ${i + 1}`,
        triggerStatus,
        amountEur: amountEurStep,
        billingStatus: nextBillingStatus,
        invoiceNumber,
        invoiceDate,
        paidAt,
        notes: note,
      });
    }

    const deleteIds = Array.from(existingStepIds).filter((id: string) => !incomingUsedIds.has(id));

    if (deleteIds.length) {
      await prisma.practiceBillingStep.deleteMany({
        where: {
          id: { in: deleteIds },
          practiceId: params.practiceId,
        },
      });
    }

    for (const step of billingStepRows) {
      if (step.id) {
        await prisma.practiceBillingStep.update({
          where: { id: step.id },
          data: {
            sortOrder: step.sortOrder,
            label: step.label,
            triggerStatus: step.triggerStatus,
            amountEur: step.amountEur,
            billingStatus: step.billingStatus,
            invoiceNumber: step.invoiceNumber,
            invoiceDate: step.invoiceDate,
            paidAt: step.paidAt,
            notes: step.notes,
          },
        });
      } else {
        await prisma.practiceBillingStep.create({
          data: {
            practiceId: params.practiceId,
            sortOrder: step.sortOrder,
            label: step.label,
            billingType: "ALTRO",
            triggerStatus: step.triggerStatus,
            amountEur: step.amountEur,
            billingStatus: step.billingStatus,
            invoiceNumber: step.invoiceNumber,
            invoiceDate: step.invoiceDate,
            paidAt: step.paidAt,
            notes: step.notes,
          },
        });
      }
    }

    revalidatePath(`/clients/${params.id}/practices/${params.practiceId}`);
    redirect(`/clients/${params.id}/practices/${params.practiceId}`);
  }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Pratica</h1>

        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href={`/clients/${params.id}`}>
            ← Torna al cliente
          </Link>

          <Link className="btn" href={`/clients/${params.id}/practices/${params.practiceId}/edit`}>
            Modifica pratica
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

      <form action={updateBillingSteps} className="card" style={{ marginTop: 12 }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Piano fatturazione / SAL</h2>

          <button className="btn primary" type="submit">
            Salva SAL
          </button>
        </div>

        <div style={{ overflowX: "auto", marginTop: 10 }}>
          <table className="table sal-edit-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Voce</th>
                <th>Trigger stato</th>
                <th>Importo</th>
                <th>Stato fattura</th>
                <th>N. fattura</th>
                <th>Data fattura</th>
                <th>Incasso</th>
                <th>Note</th>
              </tr>
            </thead>

            <tbody>
              {Array.from({ length: Math.max(billingSteps.length, 4) }).map((_, i) => {
                const current = billingSteps[i];
                const triggerNow =
                  String(current?.triggerStatus ?? "").trim().toUpperCase() !== "" &&
                  String(current?.triggerStatus ?? "").trim().toUpperCase() ===
                    String(practiceAny.apertureStatus ?? "").trim().toUpperCase() &&
                  String(current?.billingStatus ?? "").trim().toUpperCase() === "DA_FATTURARE";

                return (
                  <tr key={current?.id ?? `new-${i}`}>
                    <td>
                      {current?.sortOrder ?? i + 1}
                      <input type="hidden" name="billingStepId" value={current?.id ?? ""} />
                      <input
                        type="hidden"
                        name="billingStepSortOrder"
                        value={String(current?.sortOrder ?? i + 1)}
                      />
                    </td>

                    <td>
                      <select
                        className="input sal-input"
                        name="billingStepLabel"
                        defaultValue={current?.label ?? ""}
                      >
                        <option value="">—</option>
                        <option value="Accettazione">Accettazione</option>
                        <option value="Primo acconto">Primo acconto</option>
                        <option value="Secondo acconto">Secondo acconto</option>
                        <option value="Saldo">Saldo</option>
                      </select>
                    </td>

                    <td>
                      <select
                        className="input sal-input"
                        name="billingStepTriggerStatus"
                        defaultValue={current?.triggerStatus ?? ""}
                      >
                        <option value="">Nessuno</option>
                        <option value="IN_ATTESA">In attesa</option>
                        <option value="INVIATA_REGIONE">Inviata Regione</option>
                        <option value="INIZIO_LAVORI">Inizio lavori</option>
                        <option value="ACCETTATO">Accettato</option>
                        <option value="ISPEZIONE_ASL">Ispezione ASL</option>
                        <option value="CONCLUSO">Concluso</option>
                      </select>

                      {triggerNow ? (
                        <div className="muted" style={{ marginTop: 6, color: "#92400e", fontWeight: 700 }}>
                          Da attivare
                        </div>
                      ) : null}
                    </td>

                    <td>
                      <input
                        className="input sal-input"
                        name="billingStepAmountEur"
                        defaultValue={fmtMoneyInput(current?.amountEur)}
                        placeholder="500"
                      />
                    </td>

                    <td>
                      <select
                        className="input sal-input"
                        name="billingStepStatus"
                        defaultValue={current?.billingStatus ?? "-"}
                      >
                        <option value="-">-</option>
                        <option value="DA_FATTURARE">Da fatturare</option>
                        <option value="FATTURA_DA_INVIARE">Fattura da inviare</option>
                        <option value="FATTURATA">Fatturata</option>
                        <option value="INCASSATA">Incassata</option>
                      </select>
                    </td>

                    <td>
                      <input
                        className="input sal-input"
                        name="billingStepInvoiceNumber"
                        defaultValue={current?.invoiceNumber ?? ""}
                        placeholder="45/2026"
                      />
                    </td>

                    <td>
                      <input
                        className="input sal-input"
                        type="date"
                        name="billingStepInvoiceDate"
                        defaultValue={fmtIso(current?.invoiceDate ?? null)}
                      />
                    </td>

                    <td>
                      <input
                        className="input sal-input"
                        type="date"
                        name="billingStepPaidAt"
                        defaultValue={fmtIso(current?.paidAt ?? null)}
                      />
                    </td>

                    <td>
                      <input
                        className="input sal-input"
                        name="billingStepNotes"
                        defaultValue={current?.notes ?? ""}
                        placeholder="Facoltative"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="row" style={{ marginTop: 14, gap: 8 }}>
          <button className="btn primary" type="submit">
            Salva SAL
          </button>
        </div>
      </form>

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

      <style>{`
        .sal-edit-table {
          min-width: 1200px;
        }
        .sal-edit-table td,
        .sal-edit-table th {
          vertical-align: top;
        }
        .sal-input {
          min-width: 140px;
          width: 100%;
        }
      `}</style>
    </div>
  );
}