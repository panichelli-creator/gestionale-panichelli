import Link from "next/link";


export const dynamic = "force-dynamic";
export const revalidate = 0;

type SP = {
  month?: string;   // formato YYYY-MM (es. 2026-03)
  courseId?: string;
  q?: string;       // cerca persona/cliente
  status?: string;  // DA_FARE / SVOLTO / ecc
};

function monthRange(ym: string) {
  // ym: "YYYY-MM"
  const [Y, M] = ym.split("-").map(Number);
  const start = new Date(Y, M - 1, 1);
  const end = new Date(Y, M, 1);
  return { start, end };
}

export default async function TrainingScadenzePage({ searchParams }: { searchParams: SP }) {
  const { prisma } = await import("@/lib/prisma");
  const month = (searchParams.month ?? new Date().toISOString().slice(0, 7)).trim();
  const courseId = (searchParams.courseId ?? "").trim();
  const q = (searchParams.q ?? "").trim();
  const status = (searchParams.status ?? "TUTTI").trim();

  const { start, end } = monthRange(month);

  const courses = await prisma.courseCatalog.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  const where: any = {
    dueDate: { gte: start, lt: end },
  };
  if (courseId) where.courseId = courseId;
  if (status !== "TUTTI") where.status = status;

  // filtro ricerca su persona e cliente
  if (q) {
    where.OR = [
      { person: { lastName: { contains: q } } },
      { person: { firstName: { contains: q } } },
      { person: { fiscalCode: { contains: q } } },
      { person: { client: { name: { contains: q } } } },
    ];
  }

  const rows = await prisma.trainingRecord.findMany({
    where,
    include: {
      course: true,
      person: { include: { client: true } },
    },
    orderBy: [{ dueDate: "asc" }, { person: { lastName: "asc" } }],
  });

  // conteggi rapidi
  const byCourse = new Map<string, number>();
  for (const r of rows) {
    const k = r.course.name;
    byCourse.set(k, (byCourse.get(k) ?? 0) + 1);
  }
  const courseCounts = Array.from(byCourse.entries()).sort((a, b) => b[1] - a[1]);

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Scadenze Formazione</h1>
        <div className="row">
          <Link className="btn" href="/people">Persone</Link>
          <Link className="btn" href="/clients">Clienti</Link>
          <Link className="btn" href="/services/scadenze">Scadenze mantenimenti</Link>
        </div>
      </div>

      <form method="GET" className="card" style={{ marginTop: 12 }}>
        <div className="grid2">
          <div>
            <label>Mese</label>
            <input className="input" type="month" name="month" defaultValue={month} />
          </div>
          <div>
            <label>Corso</label>
            <select className="input" name="courseId" defaultValue={courseId}>
              <option value="">Tutti</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <label>Cerca (persona / cliente / CF)</label>
            <input className="input" name="q" defaultValue={q} placeholder="Es. Rossi / Ideal Dent" />
          </div>
          <div>
            <label>Stato</label>
            <select className="input" name="status" defaultValue={status}>
              <option value="TUTTI">Tutti</option>
              <option value="DA_FARE">DA_FARE</option>
              <option value="SVOLTO">SVOLTO</option>
              <option value="IN_CORSO">IN_CORSO</option>
              <option value="SOSPESO">SOSPESO</option>
            </select>
          </div>
        </div>

        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn primary" type="submit">Applica</button>
          <Link className="btn" href="/training/scadenze">Reset</Link>
        </div>
      </form>

      <div className="grid2" style={{ marginTop: 12 }}>
        <div className="card">
          <h2>Totale scadenze mese</h2>
          <div className="muted"><b>{rows.length}</b> record</div>
        </div>
        <div className="card">
          <h2>Top corsi nel mese</h2>
          <div className="muted">
            {courseCounts.slice(0, 6).map(([n, c]) => (
              <div key={n}>{n}: <b>{c}</b></div>
            ))}
            {courseCounts.length === 0 ? <div>Nessuna scadenza</div> : null}
          </div>
        </div>
      </div>

      <table className="table" style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th>Scadenza</th>
            <th>Corso</th>
            <th>Persona</th>
            <th>Cliente</th>
            <th>Stato</th>
            <th>Attestato</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.dueDate ? new Date(r.dueDate).toLocaleDateString("it-IT") : ""}</td>
              <td>{r.course.name}</td>
              <td>{r.person.lastName} {r.person.firstName}</td>
              <td>{r.person.client?.name ?? "—"}</td>
              <td>{r.status}</td>
              <td>{r.certificateDelivered ? "✅" : "—"}</td>
            </tr>
          ))}
          {rows.length === 0 ? (
            <tr><td colSpan={6} className="muted">Nessuna scadenza nel mese selezionato.</td></tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}