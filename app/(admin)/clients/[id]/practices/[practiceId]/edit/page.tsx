import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ECON_START = "--- ECONOMICA_JSON ---";
const ECON_B64_PREFIX = "[[ECON_B64:";

function fmtIso(d: Date | null) {
  return d ? new Date(d).toISOString().slice(0, 10) : "";
}

function cleanNotes(rawNotes: string | null | undefined) {
  const text = String(rawNotes ?? "");

  const b64Start = text.indexOf(ECON_B64_PREFIX);
  if (b64Start >= 0) return text.slice(0, b64Start).trim();

  const oldStart = text.indexOf(ECON_START);
  if (oldStart >= 0) return text.slice(0, oldStart).trim();

  return text.trim();
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
  const cleanNotesText = cleanNotes(p.notes);

  async function updatePractice(formData: FormData) {
    "use server";

    const { prisma } = await import("@/lib/prisma");

    const clientId = params.id;
    const practiceId = params.practiceId;

    const title = String(formData.get("title") ?? "").trim();
    const practiceDateRaw = String(formData.get("practiceDate") ?? "").trim();
    const determinaNumber = String(formData.get("determinaNumber") ?? "").trim() || null;
    const inApertureList = String(formData.get("inApertureList") ?? "") === "on";
    const startYearRaw = String(formData.get("startYear") ?? "").trim();
    const startYear = startYearRaw ? Number(startYearRaw) : null;
    const notes = String(formData.get("notes") ?? "").trim() || null;

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
        startYear,
        notes,
      },
    });

    redirect(`/clients/${clientId}/practices/${practiceId}`);
  }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Modifica dati pratica</h1>

        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href={`/clients/${params.id}/practices/${params.practiceId}`}>
            ← Torna alla pratica
          </Link>

          <Link className="btn" href={`/clients/${params.id}`}>
            Cliente
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
            <input className="input" name="determinaNumber" defaultValue={p.determinaNumber ?? ""} />
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <label>Anno inizio</label>
            <input
              className="input"
              type="number"
              name="startYear"
              defaultValue={row.startYear ?? ""}
            />
          </div>

          <div className="card" style={{ marginTop: 0, padding: 12 }}>
            <label style={{ display: "flex", gap: 10 }}>
              <input
                type="checkbox"
                name="inApertureList"
                defaultChecked={row.inApertureList ?? false}
              />
              <b>Aggiungi in lista Aperture</b>
            </label>
          </div>
        </div>

        <div className="card" style={{ marginTop: 12, background: "rgba(37,99,235,0.06)" }}>
          <b>Nota</b>
          <div className="muted" style={{ marginTop: 6 }}>
            Stato pratica e parte economica ora si gestiscono direttamente nella pagina pratica,
            dentro Piano fatturazione / SAL.
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Note</label>
          <textarea className="input" name="notes" rows={5} defaultValue={cleanNotesText} />
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