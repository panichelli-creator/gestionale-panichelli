import Link from "next/link";

import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function startOfTodayLocal() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function addYearsSafe(base: Date, years: number) {
  const d = new Date(base);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

function calcDueDate(performedAt: Date | null, periodicity: string) {
  if (!performedAt) return null;

  const p = String(periodicity ?? "ANNUALE").toUpperCase();

  if (p === "BIENNALE") return addYearsSafe(performedAt, 2);
  if (p === "TRIENNALE") return addYearsSafe(performedAt, 3);
  if (p === "QUINQUENNALE") return addYearsSafe(performedAt, 5);

  return addYearsSafe(performedAt, 1);
}

type SP = {
  err?: string;
  clientId?: string;
  returnTo?: string;
};

export default async function NewPersonTrainingPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: SP;
}) {
  const { prisma } = await import("@/lib/prisma");
  const person = await prisma.person.findUnique({
    where: { id: params.id },
    select: { id: true, firstName: true, lastName: true },
  });

  if (!person) redirect("/people");

  const courses = await prisma.courseCatalog.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  const clientId = String(searchParams?.clientId ?? "").trim();
  const returnTo = String(searchParams?.returnTo ?? "").trim();

  async function createTraining(formData: FormData) {
    "use server";

    const personId = String(formData.get("personId") ?? "").trim();
    const courseIdRaw = String(formData.get("courseId") ?? "").trim();
    const courseNameAlt = String(formData.get("courseNameAlt") ?? "").trim();

    const performedAtRaw = String(formData.get("performedAt") ?? "").trim();
    const periodicity = String(formData.get("periodicity") ?? "ANNUALE").trim() || "ANNUALE";

    const status = String(formData.get("status") ?? "SVOLTO").trim() || "SVOLTO";
    const priority = String(formData.get("priority") ?? "MEDIA").trim() || "MEDIA";
    const certificateDelivered = String(formData.get("certificateDelivered") ?? "NO") === "SI";
    const notes = String(formData.get("notes") ?? "").trim();

    const returnToForm = String(formData.get("returnTo") ?? "").trim();
    const clientIdForm = String(formData.get("clientId") ?? "").trim();

    const buildRedirect = (base: string, errMsg?: string) => {
      const p = new URLSearchParams();
      if (clientIdForm) p.set("clientId", clientIdForm);
      if (returnToForm) p.set("returnTo", returnToForm);
      if (errMsg) p.set("err", errMsg);
      const qs = p.toString();
      return qs ? `${base}?${qs}` : base;
    };

    if (!personId) redirect(buildRedirect(`/people/${params.id}`));

    let courseId = courseIdRaw;

    if (courseIdRaw === "__ALTRO__") {
      if (!courseNameAlt) {
        redirect(buildRedirect(`/people/${params.id}/training/new`, "Inserisci il nome del corso"));
      }

      const existingCourse = await prisma.courseCatalog.findFirst({
        where: {
          name: {
            equals: courseNameAlt,
          },
        },
        select: { id: true },
      });

      if (existingCourse) {
        courseId = existingCourse.id;
      } else {
        const created = await prisma.courseCatalog.create({
          data: {
            name: courseNameAlt,
            isActive: true,
          } as any,
        });

        courseId = String(created.id);
      }
    }

    if (!courseId || courseId === "TUTTI") {
      redirect(buildRedirect(`/people/${params.id}/training/new`, "Seleziona un corso"));
    }

    const performedAt = performedAtRaw ? new Date(performedAtRaw) : null;
    const dueDate = calcDueDate(performedAt, periodicity);

    try {
      const existingRecord = await prisma.trainingRecord.findFirst({
        where: {
          personId,
          courseId,
        },
        select: { id: true },
      });

      if (existingRecord) {
        await prisma.trainingRecord.update({
          where: { id: existingRecord.id },
          data: {
            performedAt,
            dueDate,
            status,
            priority,
            certificateDelivered,
            notes: notes || null,
          } as any,
        });
      } else {
        await prisma.trainingRecord.create({
          data: {
            personId,
            courseId,
            performedAt,
            dueDate,
            status,
            priority,
            certificateDelivered,
            notes: notes || null,
          } as any,
        });
      }
    } catch (e: any) {
      redirect(
        buildRedirect(
          `/people/${params.id}/training/new`,
          e?.message ?? "Errore salvataggio corso"
        )
      );
    }

    redirect(returnToForm || buildRedirect(`/people/${params.id}`));
  }

  const today = startOfTodayLocal();
  const todayIso = today.toISOString().slice(0, 10);

  const qs = new URLSearchParams();
  if (clientId) qs.set("clientId", clientId);
  if (returnTo) qs.set("returnTo", returnTo);
  const qsSuffix = qs.toString() ? `?${qs.toString()}` : "";

  const backHref = returnTo || `/people/${person.id}${qsSuffix}`;
  const cancelHref = returnTo || `/people/${person.id}${qsSuffix}`;

  return (
    <div className="card" style={{ maxWidth: 1180, margin: "0 auto" }}>
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}
      >
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0 }}>Aggiungi corso</h1>
          <div className="muted" style={{ marginTop: 6 }}>
            {person.lastName} {person.firstName}
          </div>
        </div>

        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
          <Link className="btn" href={backHref}>
            {returnTo ? "← Torna al cliente" : "Indietro"}
          </Link>
        </div>
      </div>

      {searchParams?.err ? (
        <div className="card" style={{ marginTop: 12, border: "1px solid #ff6b6b" }}>
          <b style={{ color: "#ff6b6b" }}>Errore:</b> {decodeURIComponent(searchParams.err)}
        </div>
      ) : null}

      <form action={createTraining} className="card" style={{ marginTop: 12 }}>
        <input type="hidden" name="personId" value={person.id} />
        <input type="hidden" name="clientId" value={clientId} />
        <input type="hidden" name="returnTo" value={returnTo} />

        <div style={{ minWidth: 0 }}>
          <label>Corso</label>
          <select className="input" name="courseId" defaultValue="">
            <option value="" disabled>
              — Seleziona —
            </option>
            {courses.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {(c.name ?? "").toUpperCase()}
              </option>
            ))}
            <option value="__ALTRO__">ALTRO (nuovo corso…)</option>
          </select>

          <div className="muted" style={{ marginTop: 6 }}>
            Se scegli “ALTRO”, scrivi il nome sotto.
          </div>

          <input
            className="input"
            name="courseNameAlt"
            placeholder="Nome nuovo corso (solo se ALTRO)"
            style={{ marginTop: 8 }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 12,
            marginTop: 12,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <label>Data effettuazione</label>
            <input className="input" type="date" name="performedAt" defaultValue={todayIso} />
          </div>

          <div style={{ minWidth: 0 }}>
            <label>Periodicità</label>
            <select className="input" name="periodicity" defaultValue="ANNUALE">
              <option value="ANNUALE">ANNUALE</option>
              <option value="BIENNALE">BIENNALE</option>
              <option value="TRIENNALE">TRIENNALE</option>
              <option value="QUINQUENNALE">QUINQUENNALE</option>
            </select>
          </div>

          <div style={{ minWidth: 0 }}>
            <label>Stato</label>
            <select className="input" name="status" defaultValue="SVOLTO">
              <option value="DA_FARE">DA_FARE</option>
              <option value="IN_CORSO">IN_CORSO</option>
              <option value="SVOLTO">SVOLTO</option>
              <option value="SOSPESO">SOSPESO</option>
            </select>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 12,
            marginTop: 12,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <label>Prossima scadenza</label>
            <input className="input" type="date" value="" readOnly disabled />
            <div className="muted" style={{ marginTop: 6 }}>
              Viene calcolata automaticamente da data effettuazione + periodicità.
            </div>
          </div>

          <div style={{ minWidth: 0 }}>
            <label>Priorità</label>
            <select className="input" name="priority" defaultValue="MEDIA">
              <option value="BASSA">BASSA</option>
              <option value="MEDIA">MEDIA</option>
              <option value="ALTA">ALTA</option>
            </select>
          </div>

          <div style={{ minWidth: 0 }}>
            <label>Attestato consegnato</label>
            <select className="input" name="certificateDelivered" defaultValue="NO">
              <option value="NO">NO</option>
              <option value="SI">SI</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: 12, minWidth: 0 }}>
          <label>Note</label>
          <input className="input" name="notes" placeholder="Note (opzionale)" />
        </div>

        <div className="row" style={{ marginTop: 12, gap: 8, flexWrap: "wrap" }}>
          <button className="btn primary" type="submit">
            Salva
          </button>
          <Link className="btn" href={cancelHref}>
            Annulla
          </Link>
        </div>
      </form>
    </div>
  );
}