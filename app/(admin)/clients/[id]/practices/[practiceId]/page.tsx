import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function fmt(d: Date | null | undefined) {
  return d ? new Date(d).toLocaleDateString("it-IT") : "—";
}

function fmtIso(d: Date | null | undefined) {
  return d ? new Date(d).toISOString().slice(0, 10) : "";
}

function fmtYear(v: number | null | undefined) {
  return v ? String(v) : "—";
}

function toNum(v: any) {
  if (v == null || v === "") return 0;
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function fmtEur(v: any) {
  const n = toNum(v);
  if (!n) return "—";
  return n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

function fmtMoneyInput(v: any) {
  const n = toNum(v);
  return n ? String(n).replace(".", ",") : "";
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

  if (s === "CONCLUSO") return { background: "rgba(34,197,94,0.12)", color: "#166534", border: "1px solid rgba(34,197,94,0.30)" };
  if (s === "ACCETTATO") return { background: "rgba(37,99,235,0.12)", color: "#1d4ed8", border: "1px solid rgba(37,99,235,0.30)" };
  if (s === "ISPEZIONE_ASL") return { background: "rgba(245,158,11,0.12)", color: "#92400e", border: "1px solid rgba(245,158,11,0.30)" };
  if (s === "INIZIO_LAVORI") return { background: "rgba(168,85,247,0.12)", color: "#7c3aed", border: "1px solid rgba(168,85,247,0.30)" };
  if (s === "INVIATA_REGIONE") return { background: "rgba(14,165,233,0.12)", color: "#0369a1", border: "1px solid rgba(14,165,233,0.30)" };

  return { background: "rgba(0,0,0,0.04)", color: "rgba(0,0,0,0.72)", border: "1px solid rgba(0,0,0,0.12)" };
}

function billingStatusLabel(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();

  if (s === "DA_FATTURARE") return "Da fatturare";
  if (s === "FATTURA_DA_INVIARE") return "Fattura da inviare";
  if (s === "FATTURATA") return "Fatturata";
  if (s === "INCASSATA") return "Incassata";
  return "-";
}

function billingStatusBadgeStyle(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();

  if (s === "INCASSATA") return { background: "rgba(34,197,94,0.12)", color: "#166534", border: "1px solid rgba(34,197,94,0.30)" };
  if (s === "FATTURATA") return { background: "rgba(37,99,235,0.12)", color: "#1d4ed8", border: "1px solid rgba(37,99,235,0.30)" };
  if (s === "FATTURA_DA_INVIARE") return { background: "rgba(245,158,11,0.12)", color: "#92400e", border: "1px solid rgba(245,158,11,0.30)" };
  if (s === "DA_FATTURARE") return { background: "rgba(239,68,68,0.10)", color: "#b91c1c", border: "1px solid rgba(239,68,68,0.30)" };

  return { background: "rgba(0,0,0,0.04)", color: "rgba(0,0,0,0.60)", border: "1px dashed rgba(0,0,0,0.18)" };
}

function cleanNotes(raw: string | null | undefined) {
  const text = String(raw ?? "");
  const b64Start = text.indexOf("[[ECON_B64:");
  if (b64Start >= 0) return text.slice(0, b64Start).trim();
  return text.trim();
}

function getSalSummary(steps: any[]) {
  const costoPratica = steps.reduce((acc, row) => acc + toNum(row.amountEur), 0);

  const totaleFatturato = steps
    .filter((row) =>
      ["FATTURATA", "INCASSATA"].includes(String(row.billingStatus ?? "").trim().toUpperCase())
    )
    .reduce((acc, row) => acc + toNum(row.amountEur), 0);

  const totaleIncassato = steps
    .filter((row) => String(row.billingStatus ?? "").trim().toUpperCase() === "INCASSATA")
    .reduce((acc, row) => acc + toNum(row.amountEur), 0);

  const residuo = Math.max(costoPratica - totaleIncassato, 0);

  return {
    costoPratica,
    totaleFatturato,
    totaleIncassato,
    residuo,
  };
}

function getAutoPracticeStatus(steps: any[]) {
  const normalized = steps.map((s) => ({
    trigger: String(s?.triggerStatus ?? "").toUpperCase(),
    status: String(s?.billingStatus ?? "").toUpperCase(),
  }));

  if (normalized.some((s) => s.trigger === "CONCLUSO" && s.status === "INCASSATA"))
    return "CONCLUSO";

  if (normalized.some((s) => s.trigger === "ISPEZIONE_ASL"))
    return "ISPEZIONE_ASL";

  if (normalized.some((s) => s.trigger === "ACCETTATO"))
    return "ACCETTATO";

  if (normalized.some((s) => s.trigger === "INIZIO_LAVORI"))
    return "INIZIO_LAVORI";

  if (normalized.some((s) => s.trigger === "INVIATA_REGIONE"))
    return "INVIATA_REGIONE";

  return "IN_ATTESA";
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
  const billingSteps = Array.isArray(practiceAny.billingSteps) ? practiceAny.billingSteps : [];

  const summary = getSalSummary(billingSteps);
  const autoStatus = getAutoPracticeStatus(billingSteps);
  const notesText = cleanNotes(p.notes);

  async function updateBillingSteps(formData: FormData) {
    "use server";

    const { prisma } = await import("@/lib/prisma");

    const stepIds = formData.getAll("billingStepId").map((v) => String(v ?? "").trim());
    const stepSortOrders = formData.getAll("billingStepSortOrder").map((v) => String(v ?? "").trim());
    const stepLabels = formData.getAll("billingStepLabel").map((v) => String(v ?? "").trim());
    const stepTriggers = formData
      .getAll("billingStepTriggerStatus")
      .map((v) => String(v ?? "").trim().toUpperCase());
    const stepAmounts = formData.getAll("billingStepAmountEur").map((v) => String(v ?? "").trim());
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

    const existing = await prisma.practiceBillingStep.findMany({
      where: { practiceId: params.practiceId },
    });

    const existingIds = new Set(existing.map((x) => x.id));
    const incomingUsed = new Set<string>();

    const rows: any[] = [];

    for (let i = 0; i < stepLabels.length; i++) {
      const id = stepIds[i] || "";
      const label = stepLabels[i] || "";
      const trigger = stepTriggers[i] || null;
      const amount = toNum(stepAmounts[i]);
      const status = stepStatuses[i] || "-";

      if (!label && !amount && !trigger) continue;

      if (id) incomingUsed.add(id);

      rows.push({
        id: id || null,
        sortOrder: Number(stepSortOrders[i] || i + 1),
        label: label || `Voce ${i + 1}`,
        triggerStatus: trigger,
        amountEur: amount,
        billingStatus: status,
        invoiceNumber: stepInvoiceNumbers[i] || null,
        invoiceDate: stepInvoiceDates[i] ? new Date(stepInvoiceDates[i]) : null,
        paidAt: stepPaidAts[i] ? new Date(stepPaidAts[i]) : null,
        notes: stepNotes[i] || null,
      });
    }

    const deleteIds = Array.from(existingIds).filter((id) => !incomingUsed.has(id));

    if (deleteIds.length) {
      await prisma.practiceBillingStep.deleteMany({
        where: { id: { in: deleteIds } },
      });
    }

    for (const r of rows) {
      if (r.id) {
        await prisma.practiceBillingStep.update({
          where: { id: r.id },
          data: r,
        });
      } else {
        await prisma.practiceBillingStep.create({
          data: { ...r, practiceId: params.practiceId, billingType: "ALTRO" },
        });
      }
    }

    revalidatePath(`/clients/${params.id}/practices/${params.practiceId}`);
    redirect(`/clients/${params.id}/practices/${params.practiceId}`);
  }

  return (
    <div className="card">
      <h1>{p.title}</h1>

      <div className="card">
        <div>Cliente: {p.client.name}</div>
        <div>Data: {fmt(p.practiceDate)}</div>

        <div>
          Stato:
          <span style={practiceStatusBadgeStyle(autoStatus)}>
            {practiceStatusLabel(autoStatus)}
          </span>
        </div>

        <div>
          Totale: <b>{fmtEur(summary.costoPratica)}</b>
        </div>
      </div>

      <form action={updateBillingSteps} className="card">
        <table className="table">
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => {
              const s = billingSteps[i];

              return (
                <tr key={i}>
                  <td>
                    <input name="billingStepId" defaultValue={s?.id ?? ""} />
                  </td>

                  <td>
                    <input name="billingStepLabel" defaultValue={s?.label ?? ""} />
                  </td>

                  <td>
                    <input name="billingStepAmountEur" defaultValue={s?.amountEur ?? ""} />
                  </td>

                  <td>
                    <select name="billingStepStatus" defaultValue={s?.billingStatus ?? "-"}>
                      <option value="-">-</option>
                      <option value="DA_FATTURARE">Da fatturare</option>
                      <option value="FATTURATA">Fatturata</option>
                      <option value="INCASSATA">Incassata</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <button className="btn primary">Salva</button>
      </form>
    </div>
  );
}