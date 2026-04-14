import Link from "next/link";
import { redirect } from "next/navigation";

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

  const clientId = String(searchParams?.clientId ?? "").trim();
  const returnTo = String(searchParams?.returnTo ?? "").trim();

  const createTraining = async (formData: FormData) => {
    "use server";

    const { prisma } = await import("@/lib/prisma");

    const personId = String(formData.get("personId") ?? "").trim();
    const courseIdRaw = String(formData.get("courseId") ?? "").trim();
    const courseNameAlt = String(formData.get("courseNameAlt") ?? "").trim();

    const performedAtRaw = String(formData.get("performedAt") ?? "").trim();
    const periodicity = String(formData.get("periodicity") ?? "ANNUALE").trim() || "ANNUALE";
    const dueDateRaw = String(formData.get("dueDate") ?? "").trim();

    const status = String(formData.get("status") ?? "SVOLTO").trim() || "SVOLTO";
    const priority = String(formData.get("priority") ?? "MEDIA").trim() || "MEDIA";
    const certificateDelivered = formData.get("certificateDelivered") === "on";
    const fatturata = formData.get("fatturata") === "on";
    const fatturataAtRaw = String(formData.get("fatturataAt") ?? "").trim();
    const priceRaw = String(formData.get("priceEur") ?? "").trim();
    const notes = String(formData.get("notes") ?? "").trim() || null;

    const alertMonthsRaw = String(formData.get("alertMonths") ?? "").trim();
    const alertMonths2Raw = String(formData.get("alertMonths2") ?? "").trim();

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

    const performedAt = performedAtRaw ? new Date(`${performedAtRaw}T12:00:00`) : null;

    let dueDate = dueDateRaw ? new Date(`${dueDateRaw}T12:00:00`) : null;
    if (status === "SVOLTO" && performedAt) {
      dueDate = calcDueDate(performedAt, periodicity);
    }

    const fatturataAt = fatturata
      ? fatturataAtRaw
        ? new Date(`${fatturataAtRaw}T12:00:00`)
        : new Date()
      : null;

    const alertMonths = alertMonthsRaw ? Number(alertMonthsRaw) : 2;
    const alertMonths2 = alertMonths2Raw ? Number(alertMonths2Raw) : 3;
    const priceEur = priceRaw ? new Prisma.Decimal(priceRaw.replace(",", ".")) : null;

    try {
      const existingRecord = await prisma.trainingRecord.findFirst({
        where: {
          personId,
          courseId,
        },
        select: { id: true, fatturataAt: true },
      });

      if (existingRecord) {
        await prisma.trainingRecord.update({
          where: { id: existingRecord.id },
          data: {
            performedAt,
            dueDate,
            status,
            priority,
            priceEur,
            certificateDelivered,
            fatturata,
            fatturataAt: fatturata
              ? fatturataAt ?? existingRecord.fatturataAt ?? new Date()
              : null,
            alertMonths,
            alertMonths2,
            notes,
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
            priceEur,
            certificateDelivered,
            fatturata,
            fatturataAt,
            alertMonths,
            alertMonths2,
            notes,
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
  };

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

      <form action={createTraining} className="card" style={{ marginTop: 12 }}>
        <input type="hidden" name="personId" value={person.id} />
        <input type="hidden" name="clientId" value={clientId} />
        <input type="hidden" name="returnTo" value={returnTo} />

        <div>
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

        <div className="grid4" style={{ marginTop: 12 }}>
          <div>
            <label>Data svolgimento</label>
            <input
              className="input"
              type="date"
              name="performedAt"
              defaultValue={todayIso}
            />
          </div>

          <div>
            <label>Stato</label>
            <select className="input" name="status" defaultValue="SVOLTO">
              {STATI.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Periodicità</label>
            <select className="input" name="periodicity" defaultValue="ANNUALE">
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
              defaultValue=""
            />
            <div className="muted" style={{ marginTop: 6 }}>
              Si aggiorna in automatico quando metti SVOLTO.
            </div>
          </div>
        </div>

        <div className="grid3" style={{ marginTop: 12 }}>
          <div>
            <label>Prezzo (€)</label>
            <input className="input" name="priceEur" defaultValue="" />
          </div>

          <div>
            <label>Priorità</label>
            <select className="input" name="priority" defaultValue="MEDIA">
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
              <input type="checkbox" name="certificateDelivered" defaultChecked={false} />
              <span className="muted">Sì</span>
            </div>
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <label>Fatturata</label>
            <div className="row" style={{ gap: 10, marginTop: 8 }}>
              <input type="checkbox" name="fatturata" defaultChecked={false} />
              <span className="muted">Sì</span>
            </div>
          </div>

          <div>
            <label>Fatturata il</label>
            <input
              className="input"
              type="date"
              name="fatturataAt"
              defaultValue=""
            />
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <label>Alert mesi 1</label>
            <input className="input" type="number" name="alertMonths" min={0} defaultValue={2} />
          </div>

          <div>
            <label>Alert mesi 2</label>
            <input className="input" type="number" name="alertMonths2" min={0} defaultValue={3} />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Note</label>
          <textarea className="input" name="notes" rows={4} defaultValue="" />
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