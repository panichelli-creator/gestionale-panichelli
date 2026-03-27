import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DeleteTrainingPage({
  params,
}: {
  params: { id: string; trainingId: string };
}) {
  const training = await prisma.trainingRecord.findUnique({
    where: { id: params.trainingId },
    include: {
      person: { include: { client: true } },
      course: true,
    },
  });

  if (!training) return notFound();
  if (training.personId !== params.id) return notFound();

  async function doDelete() {
    "use server";
    const personId = params.id;
    const trainingId = params.trainingId;

    await prisma.trainingRecord.delete({ where: { id: trainingId } });
    redirect(`/people/${personId}`);
  }

  return (
    <div className="card">
      <h1>Conferma eliminazione</h1>

      <div className="card" style={{ marginTop: 12 }}>
        <div>
          Persona: <b>{training.person.lastName} {training.person.firstName}</b>
        </div>
        <div>
          Cliente: <b>{training.person.client?.name ?? "one-shot"}</b>
        </div>
        <div style={{ marginTop: 8 }}>
          Corso da eliminare: <b>{training.course.name}</b>
        </div>
        <div className="muted" style={{ marginTop: 10 }}>
          Questa operazione elimina SOLO questo corso per la persona. Non cancella la persona.
        </div>
      </div>

      <div className="row" style={{ marginTop: 14, justifyContent: "space-between" }}>
        <Link className="btn" href={`/people/${params.id}`}>Annulla</Link>

        <form action={doDelete}>
          <button
            className="btn primary"
            type="submit"
            style={{ background: "#ff6b6b", border: "1px solid #ff6b6b" }}
          >
            Sì, elimina
          </button>
        </form>
      </div>
    </div>
  );
}