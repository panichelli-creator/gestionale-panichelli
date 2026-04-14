import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SP = {
  q?: string;
  billingStatus?: string;
  triggerStatus?: string;
  year?: string;
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

function fmt(d: Date | null | undefined) {
  return d ? new Date(d).toLocaleDateString("it-IT") : "—";
}

function practiceStatusLabel(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();

  if (s === "INVIATA_REGIONE") return "Inviata Regione";
  if (s === "INIZIO_LAVORI") return "Inizio lavori";
  if (s === "ACCETTATO") return "Accettato";
  if (s === "ISPEZIONE_ASL") return "Ispezione ASL";
  if (s === "CONCLUSO") return "Concluso";
  return "In attesa";
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

export default async function PraticheFatturazionePage({
  searchParams,
}: {
  searchParams?: SP;
}) {
  const { prisma } = await import("@/lib/prisma");

  async function updateBillingStepStatus(formData: FormData) {
    "use server";

    const { prisma } = await import("@/lib/prisma");

    const id = String(formData.get("id") ?? "").trim();
    const billingStatus = String(formData.get("billingStatus") ?? "DA_FATTURARE")
      .trim()
      .toUpperCase();
    const invoiceNumber = String(formData.get("invoiceNumber") ?? "").trim() || null;
    const invoiceDateRaw = String(formData.get("invoiceDate") ?? "").trim();
    const paidAtRaw = String(formData.get("paidAt") ?? "").trim();

    if (!id) redirect("/pratiche-fatturazione");

    const current = await prisma.practiceBillingStep.findUnique({
      where: { id },
    });

    if (!current) redirect("/pratiche-fatturazione");

    let nextStatus = billingStatus;
    let nextInvoiceDate = invoiceDateRaw ? new Date(`${invoiceDateRaw}T12:00:00`) : current.invoiceDate;
    let nextPaidAt = paidAtRaw ? new Date(`${paidAtRaw}T12:00:00`) : current.paidAt;

    if (nextStatus === "FATTURATA" && !nextInvoiceDate) {
      nextInvoiceDate = new Date();
    }

    if (nextStatus === "INCASSATA") {
      if (!nextInvoiceDate) nextInvoiceDate = new Date();
      if (!nextPaidAt) nextPaidAt = new Date();
    }

    await prisma.practiceBillingStep.update({
      where: { id },
      data: {
        billingStatus: nextStatus,
        invoiceNumber,
        invoiceDate: nextInvoiceDate,
        paidAt: nextPaidAt,
      },
    });

    revalidatePath("/pratiche-fatturazione");
    revalidatePath("/aperture");
    redirect("/pratiche-fatturazione");
  }

  const q = String(searchParams?.q ?? "").trim();
  const billingStatus = String(searchParams?.billingStatus ?? "TUTTI").trim().toUpperCase();
  const triggerStatus = String(searchParams?.triggerStatus ?? "TUTTI").trim().toUpperCase();
  const year = String(searchParams?.year ?? "").trim();

  const rowsRaw = await prisma.practiceBillingStep.findMany({
    include: {
      practice: {
        include: {
          client: true,
        },
      },
    },
    orderBy: [
      { billingStatus: "asc" },
      { invoiceDate: "asc" },
      { sortOrder: "asc" },
      { createdAt: "desc" },
    ],
  });

  const rows = rowsRaw.filter((row) => {
    const clientName = String(row.practice?.client?.name ?? "").toLowerCase();
    const practiceTitle = String(row.practice?.title ?? "").toLowerCase();
    const label = String(row.label ?? "").toLowerCase();
    const invoiceNumber = String(row.invoiceNumber ?? "").toLowerCase();
    const rowBillingStatus = String(row.billingStatus ?? "").trim().toUpperCase();
    const rowTriggerStatus = String(row.triggerStatus ?? "").trim().toUpperCase();
    const practiceYear = String(row.practice?.startYear ?? "").trim();

    const hay = [clientName, practiceTitle, label, invoiceNumber].join(" ");

    if (q && !hay.includes(q.toLowerCase())) return false;
    if (billingStatus !== "TUTTI" && rowBillingStatus !== billingStatus) return false;
    if (triggerStatus !== "TUTTI" && rowTriggerStatus !== triggerStatus) return false;
    if (year && practiceYear !== year) return false;

    return true;
  });

  const tot = rows.length;
  const daFatturare = rows.filter(
    (row) => String(row.billingStatus ?? "").trim().toUpperCase() === "DA_FATTURARE"
  ).length;
  const daInviare = rows.filter(
    (row) => String(row.billingStatus ?? "").trim().toUpperCase() === "FATTURA_DA_INVIARE"
  ).length;
  const fatturate = rows.filter(
    (row) => String(row.billingStatus ?? "").trim().toUpperCase() === "FATTURATA"
  ).length;
  const incassate = rows.filter(
    (row) => String(row.billingStatus ?? "").trim().toUpperCase() === "INCASSATA"
  ).length;

  const totaleImporti = rows.reduce((acc, row) => acc + toNum(row.amountEur), 0);
  const totaleFatturato = rows
    .filter((row) =>
      ["FATTURATA", "INCASSATA"].includes(String(row.billingStatus ?? "").trim().toUpperCase())
    )
    .reduce((acc, row) => acc + toNum(row.amountEur), 0);
  const totaleIncassato = rows
    .filter((row) => String(row.billingStatus ?? "").trim().toUpperCase() === "INCASSATA")
    .reduce((acc, row) => acc + toNum(row.amountEur), 0);

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h1>Pratiche fatturazione</h1>

        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href="/aperture">
            ← Aperture
          </Link>
        </div>
      </div>

      <form className="row" style={{ gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
        <input
          className="input"
          name="q"
          placeholder="Cerca cliente / pratica / SAL / fattura"
          defaultValue={q}
        />

        <select name="billingStatus" className="input" defaultValue={billingStatus}>
          <option value="TUTTI">Tutti stati fattura</option>
          <option value="DA_FATTURARE">Da fatturare</option>
          <option value="FATTURA_DA_INVIARE">Fattura da inviare</option>
          <option value="FATTURATA">Fatturata</option>
          <option value="INCASSATA">Incassata</option>
        </select>

        <select name="triggerStatus" className="input" defaultValue={triggerStatus}>
          <option value="TUTTI">Tutti i trigger</option>
          <option value="IN_ATTESA">In attesa</option>
          <option value="INVIATA_REGIONE">Inviata Regione</option>
          <option value="INIZIO_LAVORI">Inizio lavori</option>
          <option value="ACCETTATO">Accettato</option>
          <option value="ISPEZIONE_ASL">Ispezione ASL</option>
          <option value="CONCLUSO">Concluso</option>
        </select>

        <input
          className="input"
          name="year"
          placeholder="Anno pratica"
          defaultValue={year}
        />

        <button className="btn primary" type="submit">
          Filtra
        </button>

        <Link className="btn" href="/pratiche-fatturazione">
          Reset
        </Link>
      </form>

      <div className="row" style={{ gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        <div className="card">
          Totali: <b>{tot}</b>
        </div>
        <div className="card">
          Da fatturare: <b>{daFatturare}</b>
        </div>
        <div className="card">
          Da inviare: <b>{daInviare}</b>
        </div>
        <div className="card">
          Fatturate: <b>{fatturate}</b>
        </div>
        <div className="card">
          Incassate: <b>{incassate}</b>
        </div>
        <div className="card">
          Totale SAL: <b>{eur(totaleImporti)}</b>
        </div>
        <div className="card">
          Totale fatturato: <b>{eur(totaleFatturato)}</b>
        </div>
        <div className="card">
          Totale incassato: <b>{eur(totaleIncassato)}</b>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Pratica</th>
            <th>Stato pratica</th>
            <th>SAL</th>
            <th>Tipo</th>
            <th>Trigger</th>
            <th>Importo</th>
            <th>Stato fattura</th>
            <th>Fattura</th>
            <th>Incasso</th>
            <th style={{ width: 340 }}>Aggiorna</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.practice?.client?.name ?? "—"}</td>

              <td>
                <Link
                  href={`/clients/${row.practice?.clientId}/practices/${row.practiceId}`}
                  style={{ fontWeight: 700 }}
                >
                  {row.practice?.title ?? "—"}
                </Link>
              </td>

              <td>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "4px 8px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 800,
                    ...practiceStatusBadgeStyle(row.practice?.apertureStatus),
                  }}
                >
                  {practiceStatusLabel(row.practice?.apertureStatus)}
                </span>
              </td>

              <td style={{ maxWidth: 220, whiteSpace: "normal", wordBreak: "break-word" }}>
                <b>{row.label ?? "—"}</b>
              </td>

              <td>{billingTypeLabel(row.billingType)}</td>

              <td>
                {row.triggerStatus ? (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "4px 8px",
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
              </td>

              <td>{toNum(row.amountEur) > 0 ? eur(toNum(row.amountEur)) : "—"}</td>

              <td>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "4px 8px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 800,
                    ...billingStatusBadgeStyle(row.billingStatus),
                  }}
                >
                  {billingStatusLabel(row.billingStatus)}
                </span>
              </td>

              <td>
                <div>{row.invoiceNumber ?? "—"}</div>
                <div className="muted">{fmt(row.invoiceDate)}</div>
              </td>

              <td>{fmt(row.paidAt)}</td>

              <td>
                <form action={updateBillingStepStatus} className="row" style={{ gap: 6, flexWrap: "wrap" }}>
                  <input type="hidden" name="id" value={row.id} />

                  <select
                    name="billingStatus"
                    defaultValue={row.billingStatus ?? "DA_FATTURARE"}
                    className="input"
                  >
                    <option value="DA_FATTURARE">Da fatturare</option>
                    <option value="FATTURA_DA_INVIARE">Fattura da inviare</option>
                    <option value="FATTURATA">Fatturata</option>
                    <option value="INCASSATA">Incassata</option>
                  </select>

                  <input
                    className="input"
                    name="invoiceNumber"
                    defaultValue={row.invoiceNumber ?? ""}
                    placeholder="N. fattura"
                  />

                  <input
                    className="input"
                    type="date"
                    name="invoiceDate"
                    defaultValue={row.invoiceDate ? new Date(row.invoiceDate).toISOString().slice(0, 10) : ""}
                  />

                  <input
                    className="input"
                    type="date"
                    name="paidAt"
                    defaultValue={row.paidAt ? new Date(row.paidAt).toISOString().slice(0, 10) : ""}
                  />

                  <button className="btn" type="submit">
                    Salva
                  </button>
                </form>
              </td>
            </tr>
          ))}

          {!rows.length ? (
            <tr>
              <td colSpan={11} className="muted">
                Nessuna riga fatturazione trovata
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}