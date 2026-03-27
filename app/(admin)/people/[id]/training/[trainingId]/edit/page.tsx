import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const STATI = ["DA_FARE", "SVOLTO", "IN_CORSO", "SOSPESO"] as const;
const PRIORITA = ["BASSA", "MEDIA", "ALTA"] as const;

const PERIODICITA = [
  { value: "ANNUALE", years: 1 },
  { value: "BIENNALE", years: 2 },
  { value: "TRIENNALE", years: 3 },
  { value: "QUINQUENNALE", years: 5 },
] as const;

function fmtDateInput(d: Date | null) {
  return d ? new Date(d).toISOString().slice(0, 10) : "";
}

function addYearsSafe(base: Date, years: number) {
  const d = new Date(base);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

function inferPeriodicityFromDates(performedAt: Date | null, dueDate: Date | null) {
  if (!performedAt || !dueDate) return "ANNUALE";

  const p = new Date(performedAt);
  const d = new Date(dueDate);

  const years =
    d.getFullYear() - p.getFullYear() +
    (d.getMonth() - p.getMonth()) / 12 +
    (d.getDate() - p.getDate()) / 365;

  if (years >= 4.5) return "QUINQUENNALE";
  if (years >= 2.5) return "TRIENNALE";
  if (years >= 1.5) return "BIENNALE";
  return "ANNUALE";
}

type SP = {
  err?: string;
  clientId?: string;
  returnTo?: string;
};

export default async function EditTrainingForPerson({
  params,
  searchParams,
}: {
  params: { id: string; trainingId: string };
  searchParams?: SP;
}) {
  const { prisma } = await import("@/lib/prisma");
  const training = await prisma.trainingRecord.findUnique({
    where: { id: params.trainingId },
    include: {
      person: { include: { client: true } },
      course: true,
    },
  });

  if (!training) return notFound();
  if (training.personId !== params.id) return notFound();

  const clientId = String(searchParams?.clientId ?? "").trim();
  const returnTo = String(searchParams?.returnTo ?? "").trim();

  const coursesRaw = await prisma.courseCatalog.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  const seen = new Set<string>();
  const courses = coursesRaw.filter((c) => {
    const key = (c.name ?? "").trim().toUpperCase();
    if (!key) return false;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  async function updateTraining(formData: FormData) {
    "use server";

    const personId = params.id;
    const trainingId = params.trainingId;

    const courseIdRaw = String(formData.get("courseId") ?? "").trim();
    const courseNameAlt = String(formData.get("courseNameAlt") ?? "").trim();
    const clientIdForm = String(formData.get("clientId") ?? "").trim();
    const returnToForm = String(formData.get("returnTo") ?? "").trim();

    const buildRedirect = (base: string, errMsg?: string) => {
      const p = new URLSearchParams();
      if (errMsg) p.set("err", errMsg);
      if (clientIdForm) p.set("clientId", clientIdForm);
      if (returnToForm) p.set("returnTo", returnToForm);
      const qs = p.toString();
      return qs ? `${base}?${qs}` : base;
    };

    let courseId = courseIdRaw;

    if (courseIdRaw === "__ALTRO__") {
      if (!courseNameAlt) {
        redirect(buildRedirect(`/people/${personId}/training/${trainingId}/edit`, "Scrivi il nome del nuovo corso (ALTRO)"));
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
          data: { name: courseNameAlt, isActive: true } as any,
        });

        courseId = String(created.id);
      }
    }

    if (!courseId) {
      redirect(buildRedirect(`/people/${personId}/training/${trainingId}/edit`, "Seleziona un corso"));
    }

    const performedAtRaw = String(formData.get("performedAt") ?? "").trim();
    const status = String(formData.get("status") ?? "DA_FARE").trim() || "DA_FARE";
    const periodicity = String(formData.get("periodicity") ?? "ANNUALE").trim() || "ANNUALE";
    const dueDateRaw = String(formData.get("dueDate") ?? "").trim();

    const priority = String(formData.get("priority") ?? "MEDIA").trim() || "MEDIA";
    const priceRaw = String(formData.get("priceEur") ?? "").trim();
    const notes = String(formData.get("notes") ?? "").trim() || null;

    const certificateDelivered = formData.get("certificateDelivered") === "on";

    const alertMonthsRaw = String(formData.get("alertMonths") ?? "").trim();
    const alertMonths2Raw = String(formData.get("alertMonths2") ?? "").trim();

    const alertMonths = alertMonthsRaw ? Number(alertMonthsRaw) : 2;
    const alertMonths2 = alertMonths2Raw ? Number(alertMonths2Raw) : 3;

    const priceEur = priceRaw ? new Prisma.Decimal(priceRaw.replace(",", ".")) : null;

    const performedAt = performedAtRaw ? new Date(performedAtRaw) : null;
    let dueDate = dueDateRaw ? new Date(dueDateRaw) : null;

    if (status === "SVOLTO" && performedAt) {
      const years = PERIODICITA.find((p) => p.value === periodicity)?.years ?? 1;
      dueDate = addYearsSafe(performedAt, years);
    }

    try {
      await prisma.trainingRecord.update({
        where: { id: trainingId },
        data: {
          courseId,
          performedAt,
          dueDate,
          status: status as any,
          priority: priority as any,
          priceEur,
          notes,
          certificateDelivered,
          alertMonths,
          alertMonths2,
        } as any,
      });
    } catch (e: any) {
      redirect(
        buildRedirect(
          `/people/${personId}/training/${trainingId}/edit`,
          e?.message ?? "Errore salvataggio"
        )
      );
    }

    redirect(returnToForm || buildRedirect(`/people/${personId}`));
  }

  const defaultPeriodicity = inferPeriodicityFromDates(
    training.performedAt,
    training.dueDate
  );

  const qs = new URLSearchParams();
  if (clientId) qs.set("clientId", clientId);
  if (returnTo) qs.set("returnTo", returnTo);
  const qsSuffix = qs.toString() ? `?${qs.toString()}` : "";

  const backHref = returnTo || `/people/${params.id}${qsSuffix}`;
  const cancelHref = returnTo || `/people/${params.id}${qsSuffix}`;
  const deleteHref = `/people/${params.id}/training/${params.trainingId}/delete${qsSuffix}`;

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Modifica corso</h1>
        <Link className="btn" href={backHref}>
          {returnTo ? "← Torna al cliente" : "← Torna alla persona"}
        </Link>
      </div>

      {searchParams?.err ? (
        <div className="card" style={{ marginTop: 12, border: "1px solid #ff6b6b" }}>
          <b style={{ color: "#ff6b6b" }}>Errore:</b> {decodeURIComponent(searchParams.err)}
        </div>
      ) : null}

      <div className="card" style={{ marginTop: 12 }}>
        <div className="muted">
          Persona:{" "}
          <b>
            {training.person.lastName} {training.person.firstName}
          </b>{" "}
          — Cliente: <b>{training.person.client?.name ?? "one-shot"}</b>
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
(function(){
  function addYearsISO(iso, years){
    if(!iso) return "";
    var d = new Date(iso + "T00:00:00");
    if(isNaN(d.getTime())) return "";
    var y = d.getFullYear() + years;
    var m = d.getMonth();
    var day = d.getDate();

    var nd = new Date(Date.UTC(y, m, day));
    if (nd.getUTCMonth() !== m) {
      nd = new Date(Date.UTC(y, m + 1, 0));
    }

    var mm = String(nd.getUTCMonth() + 1).padStart(2, "0");
    var dd = String(nd.getUTCDate()).padStart(2, "0");
    return nd.getUTCFullYear() + "-" + mm + "-" + dd;
  }

  function recalc(){
    var statusEl = document.querySelector('select[name="status"]');
    var performedEl = document.querySelector('input[name="performedAt"]');
    var dueEl = document.querySelector('input[name="dueDate"]');
    var perEl = document.querySelector('select[name="periodicity"]');

    if(!statusEl || !performedEl || !dueEl || !perEl) return;

    var status = statusEl.value || "";
    var performed = performedEl.value || "";
    var per = perEl.value || "ANNUALE";

    if(status !== "SVOLTO") return;
    if(!performed) return;

    var yearsMap = { ANNUALE:1, BIENNALE:2, TRIENNALE:3, QUINQUENNALE:5 };
    var years = yearsMap[per] || 1;

    var nextDue = addYearsISO(performed, years);
    if(nextDue){
      dueEl.value = nextDue;
    }
  }

  document.addEventListener("change", function(e){
    var t = e.target;
    if(!t) return;
    var name = t.getAttribute("name");
    if(name === "status" || name === "performedAt" || name === "periodicity"){
      recalc();
    }
  });

  document.addEventListener("input", function(e){
    var t = e.target;
    if(!t) return;
    var name = t.getAttribute("name");
    if(name === "performedAt"){
      recalc();
    }
  });

  setTimeout(recalc, 0);
})();
          `,
        }}
      />

      <form action={updateTraining} className="card" style={{ marginTop: 12 }}>
        <input type="hidden" name="clientId" value={clientId} />
        <input type="hidden" name="returnTo" value={returnTo} />

        <div>
          <label>Corso</label>
          <select className="input" name="courseId" defaultValue={training.courseId}>
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

        <div className="grid4" style={{ marginTop: 12 }}>
          <div>
            <label>Data svolgimento</label>
            <input
              className="input"
              type="date"
              name="performedAt"
              defaultValue={fmtDateInput(training.performedAt)}
            />
          </div>

          <div>
            <label>Stato</label>
            <select className="input" name="status" defaultValue={training.status}>
              {STATI.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Periodicità</label>
            <select className="input" name="periodicity" defaultValue={defaultPeriodicity}>
              {PERIODICITA.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Scadenza</label>
            <input
              className="input"
              type="date"
              name="dueDate"
              defaultValue={fmtDateInput(training.dueDate)}
            />
            <div className="muted" style={{ marginTop: 6 }}>
              Si aggiorna in automatico quando metti SVOLTO.
            </div>
          </div>
        </div>

        <div className="grid3" style={{ marginTop: 12 }}>
          <div>
            <label>Prezzo (€)</label>
            <input className="input" name="priceEur" defaultValue={training.priceEur ? String(training.priceEur) : ""} />
          </div>

          <div>
            <label>Priorità</label>
            <select className="input" name="priority" defaultValue={training.priority}>
              {PRIORITA.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Attestato consegnato</label>
            <div className="row" style={{ gap: 10, marginTop: 8 }}>
              <input type="checkbox" name="certificateDelivered" defaultChecked={training.certificateDelivered} />
              <span className="muted">Sì</span>
            </div>
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <label>Alert mesi 1</label>
            <input className="input" type="number" name="alertMonths" min={0} defaultValue={training.alertMonths ?? 2} />
          </div>

          <div>
            <label>Alert mesi 2</label>
            <input className="input" type="number" name="alertMonths2" min={0} defaultValue={training.alertMonths2 ?? 3} />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Note</label>
          <textarea className="input" name="notes" rows={4} defaultValue={training.notes ?? ""} />
        </div>

        <div className="row" style={{ marginTop: 14, justifyContent: "space-between" }}>
          <div className="row">
            <button className="btn primary" type="submit">
              Salva
            </button>
            <Link className="btn" href={cancelHref}>
              Annulla
            </Link>
          </div>

          <Link
            className="btn"
            href={deleteHref}
            style={{ border: "1px solid #ff6b6b", color: "#ff6b6b" }}
          >
            Elimina
          </Link>
        </div>
      </form>
    </div>
  );
}