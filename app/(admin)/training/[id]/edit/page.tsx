import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import BackButton from "../../BackButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const STATI = ["DA_FARE", "SVOLTO", "IN_CORSO", "SOSPESO"] as const;
const PRIORITA = ["BASSA", "MEDIA", "ALTA"] as const;

function toISODateInput(d: Date | null) {
  if (!d) return "";
  const x = new Date(d);
  const yyyy = x.getFullYear();
  const mm = String(x.getMonth() + 1).padStart(2, "0");
  const dd = String(x.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default async function EditTrainingRecordPage({ params }: { params: { id: string } }) {
  const rec = await prisma.trainingRecord.findUnique({
    where: { id: params.id },
    include: {
      person: true,
      course: true,
    },
  });

  if (!rec) return notFound();

  const personId = rec.personId;

  async function updateRec(formData: FormData) {
    "use server";

    const id = params.id;

    const performedAtRaw = String(formData.get("performedAt") ?? "").trim();
    const dueDateRaw = String(formData.get("dueDate") ?? "").trim();

    const status = String(formData.get("status") ?? "").trim() || "DA_FARE";
    const priority = String(formData.get("priority") ?? "").trim() || "MEDIA";

    const priceRaw = String(formData.get("priceEur") ?? "").trim();
    const notes = String(formData.get("notes") ?? "").trim() || null;

    const certificateDelivered = formData.get("certificateDelivered") === "on";

    const priceEur = priceRaw ? new Prisma.Decimal(priceRaw.replace(",", ".")) : null;

    await prisma.trainingRecord.update({
      where: { id },
      data: {
        performedAt: performedAtRaw ? new Date(performedAtRaw) : null,
        dueDate: dueDateRaw ? new Date(dueDateRaw) : null,
        status: status as any,
        priority: priority as any,
        priceEur,
        notes,
        certificateDelivered,
      } as any,
    });

    redirect(`/people/${personId}`);
  }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Modifica corso</h1>

        {/* ✅ torna davvero indietro (cliente/persona/lista) */}
        <BackButton label="← Torna indietro" />
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div>
          <b>Persona:</b> {rec.person.lastName} {rec.person.firstName}
        </div>
        <div style={{ marginTop: 6 }}>
          <b>Corso:</b> {rec.course?.name ?? "—"}
        </div>
      </div>

      <form action={updateRec} className="card" style={{ marginTop: 12 }}>
        <div className="grid2">
          <div>
            <label>Svolto il</label>
            <input
              className="input"
              type="date"
              name="performedAt"
              defaultValue={toISODateInput(rec.performedAt ?? null)}
            />
          </div>
          <div>
            <label>Prossima scadenza</label>
            <input
              className="input"
              type="date"
              name="dueDate"
              defaultValue={toISODateInput(rec.dueDate ?? null)}
            />
          </div>
        </div>

        <div className="grid3" style={{ marginTop: 12 }}>
          <div>
            <label>Stato</label>
            <select className="input" name="status" defaultValue={rec.status ?? "DA_FARE"}>
              {STATI.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Priorità</label>
            <select className="input" name="priority" defaultValue={rec.priority ?? "MEDIA"}>
              {PRIORITA.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Prezzo (€)</label>
            <input className="input" name="priceEur" defaultValue={rec.priceEur ? String(rec.priceEur) : ""} />
          </div>
        </div>

        <div className="row" style={{ gap: 10, marginTop: 12 }}>
          <input type="checkbox" name="certificateDelivered" defaultChecked={!!rec.certificateDelivered} />
          <span className="muted">Attestato consegnato</span>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Note</label>
          <textarea className="input" name="notes" rows={4} defaultValue={rec.notes ?? ""} />
        </div>

        <div className="row" style={{ marginTop: 14 }}>
          <button className="btn primary" type="submit">
            Salva
          </button>
          <Link className="btn" href={`/people/${rec.personId}`}>
            Annulla
          </Link>
        </div>
      </form>
    </div>
  );
}