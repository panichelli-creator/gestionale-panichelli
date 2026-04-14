import Link from "next/link";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SP = {
  q?: string;
  courseId?: string;
  clientId?: string;
  status?: string;
  cert?: string;
  ym?: string;
  bucket?: string; // ATTIVI | SCADUTI | NEXT30 | IN_REGOLA
};

const STATI = ["TUTTI", "DA_FARE", "SVOLTO", "IN_CORSO", "SOSPESO"] as const;

function firstDayOfMonth(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1));
}

function firstDayNextMonth(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, m, 1));
}

function startOfTodayLocal() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function fmt(d: Date | null) {
  return d ? new Date(d).toLocaleDateString("it-IT") : "—";
}

export default async function TrainingPage({ searchParams }: { searchParams: SP }) {
  const { prisma } = await import("@/lib/prisma");
  const q = (searchParams.q ?? "").trim();
  const courseId = (searchParams.courseId ?? "TUTTI").trim();
  const clientId = (searchParams.clientId ?? "TUTTI").trim();
  const status = (searchParams.status ?? "TUTTI").trim();
  const cert = (searchParams.cert ?? "TUTTI").trim();
  const bucket = (searchParams.bucket ?? "").trim();

  const now = new Date();
  const defaultYm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const ym = (searchParams.ym ?? defaultYm).trim();

  const today0 = startOfTodayLocal();
  const next30End = endOfDay(addDays(today0, 30));

  const where: any = {};

  if (bucket) {
    if (bucket === "SCADUTI") {
      where.dueDate = { lt: today0 };
    } else if (bucket === "NEXT30") {
      where.dueDate = { gte: today0, lte: next30End };
    } else if (bucket === "IN_REGOLA") {
      where.status = "SVOLTO";
      where.dueDate = { gt: next30End };
    } else if (bucket === "ATTIVI") {
      where.status = "IN_CORSO";
    }
  } else {
    if (ym) {
      where.dueDate = { gte: firstDayOfMonth(ym), lt: firstDayNextMonth(ym) };
    }
  }

  if (!bucket) {
    if (status !== "TUTTI") where.status = status;
  }

  if (cert === "SI") where.certificateDelivered = true;
  if (cert === "NO") where.certificateDelivered = false;
  if (courseId !== "TUTTI") where.courseId = courseId;

  if (q || clientId !== "TUTTI") {
    where.person = {};
    if (q) {
      where.person.OR = [{ lastName: { contains: q } }, { firstName: { contains: q } }];
    }
    if (clientId !== "TUTTI") {
      where.person.clientId = clientId;
    }
  }

  const baseCountsWhere: any = {};
  if (cert === "SI") baseCountsWhere.certificateDelivered = true;
  if (cert === "NO") baseCountsWhere.certificateDelivered = false;
  if (courseId !== "TUTTI") baseCountsWhere.courseId = courseId;

  if (q || clientId !== "TUTTI") {
    baseCountsWhere.person = {};
    if (q) {
      baseCountsWhere.person.OR = [{ lastName: { contains: q } }, { firstName: { contains: q } }];
    }
    if (clientId !== "TUTTI") baseCountsWhere.person.clientId = clientId;
  }

  const [coursesRaw, clients, rows, cntAttivi, cntScaduti, cntNext30, cntRegola] =
    await Promise.all([
      prisma.courseCatalog.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
      prisma.client.findMany({ where: { status: "ATTIVO" }, orderBy: { name: "asc" } }),
      prisma.trainingRecord.findMany({
        where,
        include: { person: { include: { client: true } }, course: true },
        orderBy: [{ dueDate: "asc" }, { person: { lastName: "asc" } }],
        take: 2000,
      }),
      prisma.trainingRecord.count({ where: { ...baseCountsWhere, status: "IN_CORSO" } }),
      prisma.trainingRecord.count({ where: { ...baseCountsWhere, dueDate: { lt: today0 } } }),
      prisma.trainingRecord.count({
        where: { ...baseCountsWhere, dueDate: { gte: today0, lte: next30End } },
      }),
      prisma.trainingRecord.count({
        where: { ...baseCountsWhere, status: "SVOLTO", dueDate: { gt: next30End } },
      }),
    ]);

  const seen = new Set<string>();
  const courses = coursesRaw.filter((c) => {
    const key = (c.name ?? "").trim().toUpperCase();
    if (!key) return false;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  function hrefWithBucket(b: string) {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (ym) p.set("ym", ym);
    if (courseId !== "TUTTI") p.set("courseId", courseId);
    if (clientId !== "TUTTI") p.set("clientId", clientId);
    if (status !== "TUTTI") p.set("status", status);
    if (cert !== "TUTTI") p.set("cert", cert);
    p.set("bucket", b);
    return `/training?${p.toString()}`;
  }

  function hrefResetBucket() {
    const p = new URLSearchParams();
    if (ym) p.set("ym", ym);
    if (q) p.set("q", q);
    if (courseId !== "TUTTI") p.set("courseId", courseId);
    if (clientId !== "TUTTI") p.set("clientId", clientId);
    if (status !== "TUTTI") p.set("status", status);
    if (cert !== "TUTTI") p.set("cert", cert);
    return `/training?${p.toString()}`;
  }

  const currentParams = new URLSearchParams();
  if (q) currentParams.set("q", q);
  if (courseId !== "TUTTI") currentParams.set("courseId", courseId);
  if (clientId !== "TUTTI") currentParams.set("clientId", clientId);
  if (status !== "TUTTI") currentParams.set("status", status);
  if (cert !== "TUTTI") currentParams.set("cert", cert);
  if (ym) currentParams.set("ym", ym);
  if (bucket) currentParams.set("bucket", bucket);

  const returnTo = `/training${currentParams.toString() ? `?${currentParams.toString()}` : ""}`;

  function personHref(personId: string, rowClientId?: string | null) {
    const p = new URLSearchParams();
    if (rowClientId) p.set("clientId", rowClientId);
    p.set("returnTo", returnTo);
    return `/people/${personId}?${p.toString()}`;
  }

  function trainingEditHref(personId: string, trainingId: string, rowClientId?: string | null) {
    const p = new URLSearchParams();
    if (rowClientId) p.set("clientId", rowClientId);
    p.set("returnTo", returnTo);
    return `/people/${personId}/training/${trainingId}/edit?${p.toString()}`;
  }

  return (
    <div className="card">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          a { color: #000 !important; text-decoration: none !important; }
          .card { box-shadow: none !important; border: none !important; }
          .container { max-width: 100% !important; }
        }
      `}</style>

      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Formazione</h1>
        <div className="row no-print" style={{ gap: 8 }}>
          <PrintButton />
          <Link className="btn" href="/people">
            Persone
          </Link>
        </div>
      </div>

      <div className="grid3 no-print" style={{ marginTop: 12 }}>
        <Link href={hrefWithBucket("ATTIVI")} style={{ textDecoration: "none" }}>
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #065F46, #10B981)",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            <div style={{ opacity: 0.85, fontWeight: 700 }}>Attivi</div>
            <div style={{ fontSize: 34, fontWeight: 900, marginTop: 8 }}>{cntAttivi}</div>
          </div>
        </Link>

        <Link href={hrefWithBucket("SCADUTI")} style={{ textDecoration: "none" }}>
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #7F1D1D, #DC2626)",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            <div style={{ opacity: 0.85, fontWeight: 700 }}>Scaduti</div>
            <div style={{ fontSize: 34, fontWeight: 900, marginTop: 8 }}>{cntScaduti}</div>
          </div>
        </Link>

        <Link href={hrefWithBucket("NEXT30")} style={{ textDecoration: "none" }}>
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #92400E, #F59E0B)",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            <div style={{ opacity: 0.85, fontWeight: 700 }}>Prossimi 30 gg</div>
            <div style={{ fontSize: 34, fontWeight: 900, marginTop: 8 }}>{cntNext30}</div>
          </div>
        </Link>
      </div>

      <div className="grid3 no-print" style={{ marginTop: 12 }}>
        <Link href={hrefWithBucket("IN_REGOLA")} style={{ textDecoration: "none" }}>
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #1E3A8A, #3B82F6)",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            <div style={{ opacity: 0.85, fontWeight: 700 }}>In regola</div>
            <div style={{ fontSize: 34, fontWeight: 900, marginTop: 8 }}>{cntRegola}</div>
          </div>
        </Link>

        <Link href={hrefResetBucket()} style={{ textDecoration: "none" }}>
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #111827, #374151)",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            title="Torna ai filtri mese"
          >
            <div style={{ opacity: 0.85, fontWeight: 700 }}>Torna ai filtri mese</div>
            <div style={{ opacity: 0.85, marginTop: 8, fontWeight: 800 }}>Click</div>
          </div>
        </Link>

        <div
          className="card no-print"
          style={{ background: "transparent", border: "none", boxShadow: "none" }}
        />
      </div>

      <form method="GET" className="card no-print" style={{ marginTop: 12 }}>
        <div className="grid3">
          <div>
            <label>Mese</label>
            <input className="input" type="month" name="ym" defaultValue={ym} />
          </div>

          <div>
            <label>Corso</label>
            <select className="input" name="courseId" defaultValue={courseId}>
              <option value="TUTTI">Tutti</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {(c.name ?? "").toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Cliente</label>
            <select className="input" name="clientId" defaultValue={clientId}>
              <option value="TUTTI">Tutti</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid3" style={{ marginTop: 12 }}>
          <div>
            <label>Ricerca persona</label>
            <input className="input" name="q" defaultValue={q} placeholder="Cognome o nome..." />
          </div>

          <div>
            <label>Stato</label>
            <select className="input" name="status" defaultValue={status}>
              {STATI.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Attestato consegnato</label>
            <select className="input" name="cert" defaultValue={cert}>
              <option value="TUTTI">Tutti</option>
              <option value="SI">Sì</option>
              <option value="NO">No</option>
            </select>
          </div>
        </div>

        <input type="hidden" name="bucket" value={bucket} />

        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn primary" type="submit">
            Applica
          </button>
          <Link className="btn" href="/training">
            Reset
          </Link>
        </div>
      </form>

      <div className="muted" style={{ marginTop: 10 }}>
        Risultati: <b>{rows.length}</b> (max 2000)
      </div>

      <table className="table" style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th>Persona</th>
            <th>Cliente</th>
            <th>Corso</th>
            <th>Svolto il</th>
            <th>Prossima scadenza</th>
            <th>Stato</th>
            <th>Priorità</th>
            <th>Attestato</th>
            <th>Fatturata</th>
            <th>Fatturata il</th>
            <th className="no-print">Apri</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r: any) => {
            const due = r.dueDate ? new Date(r.dueDate) : null;
            const isExpired = due ? due.getTime() < today0.getTime() : false;
            const rowClientId = r.person?.clientId ?? null;

            return (
              <tr
                key={r.id}
                style={isExpired ? { color: "#ff3b30", fontWeight: 700 } : undefined}
              >
                <td>
                  <Link href={personHref(r.personId, rowClientId)}>
                    {r.person.lastName} {r.person.firstName}
                  </Link>
                </td>
                <td>{r.person.client?.name ?? "one-shot"}</td>
                <td>
                  <Link href={trainingEditHref(r.personId, r.id, rowClientId)}>{r.course.name}</Link>
                </td>
                <td>{fmt(r.performedAt ?? null)}</td>
                <td>{fmt(r.dueDate ?? null)}</td>
                <td>{r.status}</td>
                <td>{r.priority}</td>
                <td>{r.certificateDelivered ? "Sì" : "No"}</td>
                <td>{r.fatturata ? "Sì" : "No"}</td>
                <td>{fmt(r.fatturataAt ?? null)}</td>
                <td className="no-print">
                  <Link className="btn" href={trainingEditHref(r.personId, r.id, rowClientId)}>
                    Apri
                  </Link>
                </td>
                <td style={{ maxWidth: 360, whiteSpace: "normal", wordBreak: "break-word" }}>
                  {r.notes ?? ""}
                </td>
              </tr>
            );
          })}

          {rows.length === 0 ? (
            <tr>
              <td colSpan={12} className="muted">
                Nessun risultato per i filtri selezionati.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}