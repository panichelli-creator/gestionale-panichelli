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

  const oldStart = text.indexOf("--- ECONOMICA_JSON ---");
  if (oldStart >= 0) return text.slice(0, oldStart).trim();

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
  const notesText = cleanNotes(p.notes);

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

    const apertureStatus =
      String(formData.get("apertureStatus") ?? "IN_ATTESA").trim().toUpperCase() || "IN_ATTESA";

    await prisma.clientPractice.update({
      where: { id: params.practiceId },
      data: {
        apertureStatus: apertureStatus as any,
      },
    });

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
      const billingStatus = String(stepStatuses[i] || "").trim().toUpperCase() || "-";
      const invoiceNumber = stepInvoiceNumbers[i] || null;
      const invoiceDateInput = stepInvoiceDates[i] ? new Date(`${stepInvoiceDates[i]}T12:00:00`) : null;
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

      let invoiceDate = invoiceDateInput;
      let paidAt = paidAtInput;

      if (billingStatus === "FATTURATA" && !invoiceDate) {
        invoiceDate = new Date();
      }

      if (billingStatus === "INCASSATA") {
        if (!invoiceDate) invoiceDate = new Date();
        if (!paidAt) paidAt = new Date();
      }

      if (billingStatus === "-") {
        invoiceDate = null;
        paidAt = null;
      }

      billingStepRows.push({
        id: id || null,
        sortOrder,
        label: label || `Voce ${i + 1}`,
        triggerStatus,
        amountEur: amountEurStep,
        billingStatus,
        invoiceNumber,
        invoiceDate,
        paidAt,
        notes: note,
      });
    }

    const deleteIds = Array.from(existingStepIds).filter((id) => !incomingUsedIds.has(id));

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

    revalidatePath(`/clients/${params.id}`);
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
            Modifica dati pratica
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
            <div className="muted">Stato pratica</div>
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

          <div>
            <div className="muted">Anno inizio</div>
            <div>{fmtYear(practiceAny.startYear)}</div>
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <div className="muted">Importo pratica da SAL</div>
            <div>
              <b>{summary.costoPratica > 0 ? fmtEur(summary.costoPratica) : "—"}</b>
            </div>
          </div>

          <div>
            <div className="muted">Ultimo aggiornamento</div>
            <div>{fmt(p.updatedAt)}</div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="muted">Note</div>
          <div>{notesText || "—"}</div>
        </div>
      </div>

      <form action={updateBillingSteps} className="card" style={{ marginTop: 12 }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Piano fatturazione / SAL</h2>

          <button className="btn primary" type="submit">
            Salva SAL
          </button>
        </div>

        <div className="card" style={{ marginTop: 12, padding: 12 }}>
          <label>Stato pratica</label>
          <select
            className="input"
            name="apertureStatus"
            defaultValue={practiceAny.apertureStatus ?? "IN_ATTESA"}
            style={{ maxWidth: 320 }}
          >
            <option value="IN_ATTESA">In attesa</option>
            <option value="INVIATA_REGIONE">Inviata Regione</option>
            <option value="INIZIO_LAVORI">Inizio lavori</option>
            <option value="ACCETTATO">Accettato</option>
            <option value="ISPEZIONE_ASL">Ispezione ASL</option>
            <option value="CONCLUSO">Concluso</option>
          </select>
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
        <h2 style={{ marginBottom: 10 }}>Riepilogo economico SAL</h2>

        <div className="grid4">
          <div>
            <div className="muted">Costo pratica</div>
            <div>
              <b>{summary.costoPratica > 0 ? fmtEur(summary.costoPratica) : "—"}</b>
            </div>
          </div>

          <div>
            <div className="muted">Totale fatturato</div>
            <div>
              <b>{summary.totaleFatturato > 0 ? fmtEur(summary.totaleFatturato) : "—"}</b>
            </div>
          </div>

          <div>
            <div className="muted">Totale incassato</div>
            <div>
              <b>{summary.totaleIncassato > 0 ? fmtEur(summary.totaleIncassato) : "—"}</b>
            </div>
          </div>

          <div>
            <div className="muted">Residuo</div>
            <div>
              <b>{summary.costoPratica > 0 ? fmtEur(summary.residuo) : "—"}</b>
            </div>
          </div>
        </div>

        <div className="muted" style={{ marginTop: 10 }}>
          Il riepilogo economico ora considera solo le righe del Piano fatturazione / SAL.
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h2 style={{ marginBottom: 10 }}>Stato SAL</h2>

        {billingSteps.length ? (
          <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
            {billingSteps.map((step: any) => (
              <span
                key={step.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 9px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 800,
                  ...billingStatusBadgeStyle(step.billingStatus),
                }}
              >
                {step.label}: {billingStatusLabel(step.billingStatus)} · {fmtEur(step.amountEur)}
              </span>
            ))}
          </div>
        ) : (
          <div className="muted">Nessuna voce SAL.</div>
        )}
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

        .grid4 {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        @media (max-width: 1000px) {
          .grid4 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .grid4 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}