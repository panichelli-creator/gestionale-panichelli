import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NewPracticePage({ params }: { params: { id: string } }) {
  const client = await prisma.client.findUnique({ where: { id: params.id } });
  if (!client) return notFound();

  async function createPractice(formData: FormData) {
    "use server";

    const clientId = params.id;

    const title = String(formData.get("title") ?? "").trim();
    const practiceDateRaw = String(formData.get("practiceDate") ?? "").trim();
    const determinaNumber = String(formData.get("determinaNumber") ?? "").trim() || null;
    const inApertureList = String(formData.get("inApertureList") ?? "").trim() === "on";
    const notes = String(formData.get("notes") ?? "").trim() || null;

    if (!title) {
      throw new Error("Titolo pratica obbligatorio.");
    }

    const created = await prisma.clientPractice.create({
      data: {
        clientId,
        title,
        practiceDate: practiceDateRaw ? new Date(practiceDateRaw) : null,
        determinaNumber,
        inApertureList,
        notes,
      },
    });

    redirect(`/clients/${clientId}/practices/${created.id}`);
  }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Nuova pratica</h1>

        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href={`/clients/${params.id}`}>
            ← Torna al cliente
          </Link>
          <Link className="btn" href={`/clients/${params.id}/practices/new`}>
            Reset
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        Cliente: <b>{client.name}</b>
      </div>

      <form action={createPractice} className="card" style={{ marginTop: 12 }}>
        <div>
          <label>Pratica *</label>
          <input
            className="input"
            name="title"
            placeholder='Es: "Invio Regione Lazio" / "Comunicazione ASL" ...'
            required
          />
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <label>Data</label>
            <input className="input" type="date" name="practiceDate" />
          </div>

          <div>
            <label>Determina n°</label>
            <input className="input" name="determinaNumber" placeholder="Es: 123/2026" />
          </div>
        </div>

        <div
          className="card"
          style={{ marginTop: 12, padding: 12, border: "1px solid rgba(59,130,246,0.22)" }}
        >
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <input type="checkbox" name="inApertureList" />
            <span>
              <b>Aggiungi in lista Aperture</b>
            </span>
          </label>

          <div className="muted" style={{ marginTop: 8 }}>
            Se attivo, questa pratica comparirà nella nuova sezione <b>Aperture</b> in sidebar.
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Note</label>
          <textarea
            className="input"
            name="notes"
            rows={4}
            placeholder="Note (facoltative)"
          />
        </div>

        <div className="row" style={{ marginTop: 14, gap: 8 }}>
          <button className="btn primary" type="submit">
            Salva
          </button>

          <Link className="btn" href={`/clients/${params.id}`}>
            Annulla
          </Link>
        </div>
      </form>
    </div>
  );
}