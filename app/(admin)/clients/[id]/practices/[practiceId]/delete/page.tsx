import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function fmt(d: Date | null | undefined) {
  return d ? new Date(d).toLocaleDateString("it-IT") : "—";
}

export default async function DeletePracticePage({
  params,
}: {
  params: { id: string; practiceId: string };
}) {
  const { prisma } = await import("@/lib/prisma");

  const p = await prisma.clientPractice.findUnique({
    where: { id: params.practiceId },
    include: { client: true },
  });

  if (!p) return notFound();
  if (p.clientId !== params.id) return notFound();

  async function deletePractice() {
    "use server";

    const { prisma } = await import("@/lib/prisma");

    const clientId = params.id;
    const practiceId = params.practiceId;

    await prisma.clientPractice.delete({
      where: { id: practiceId },
    });

    redirect(`/clients/${clientId}`);
  }

  return (
    <div className="card">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <h1>Elimina pratica</h1>

        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href={`/clients/${params.id}`}>
            ← Torna al cliente
          </Link>

          <Link
            className="btn"
            href={`/clients/${params.id}/practices/${params.practiceId}`}
          >
            Torna alla pratica
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        Cliente: <b>{p.client.name}</b>
      </div>

      <div
        className="card"
        style={{ marginTop: 12, border: "1px solid rgba(239,68,68,0.35)" }}
      >
        <div>Stai per eliminare questa pratica:</div>

        <div style={{ marginTop: 10 }}>
          <div>
            <span className="muted">Pratica:</span> <b>{p.title}</b>
          </div>
          <div style={{ marginTop: 6 }}>
            <span className="muted">Data:</span> {fmt(p.practiceDate)}
          </div>
          <div style={{ marginTop: 6 }}>
            <span className="muted">Determina:</span> {p.determinaNumber ?? "—"}
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          Questa operazione non si può annullare.
        </div>
      </div>

      <form action={deletePractice} className="row" style={{ marginTop: 14, gap: 8 }}>
        <button className="btn primary" type="submit">
          Conferma eliminazione
        </button>

        <Link
          className="btn"
          href={`/clients/${params.id}/practices/${params.practiceId}`}
        >
          Annulla
        </Link>
      </form>
    </div>
  );
}