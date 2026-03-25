import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { IconUsers, IconPlus, IconSearch } from "@/app/ui/icons";

type SP = {
  q?: string;
  clientId?: string;
  returnTo?: string;
};

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addMonths(d: Date, months: number) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + months);
  return x;
}

function fmtDate(d: Date | null | undefined) {
  return d ? new Date(d).toLocaleDateString("it-IT") : "—";
}

function dueBadge(dueDate: Date | null | undefined) {
  if (!dueDate) {
    return {
      label: "—",
      style: {
        background: "rgba(100,116,139,0.12)",
        color: "#475569",
        border: "1px solid rgba(100,116,139,0.18)",
      },
      rank: 999999,
    };
  }

  const today = startOfDay(new Date());
  const due = startOfDay(new Date(dueDate));
  const in2Months = startOfDay(addMonths(today, 2));

  if (due < today) {
    return {
      label: "Scaduto",
      style: {
        background: "rgba(239,68,68,0.12)",
        color: "#B91C1C",
        border: "1px solid rgba(239,68,68,0.22)",
      },
      rank: 0,
    };
  }

  if (due <= in2Months) {
    return {
      label: "In scadenza",
      style: {
        background: "rgba(245,158,11,0.12)",
        color: "#B45309",
        border: "1px solid rgba(245,158,11,0.24)",
      },
      rank: 1,
    };
  }

  return {
    label: "OK",
    style: {
      background: "rgba(34,197,94,0.12)",
      color: "#15803D",
      border: "1px solid rgba(34,197,94,0.22)",
    },
    rank: 2,
  };
}

export default async function PeoplePage({ searchParams }: { searchParams: SP }) {
  const qRaw = (searchParams.q ?? "").trim();
  const q = qRaw;
  const clientId = (searchParams.clientId ?? "TUTTI").trim();
  const returnTo = (searchParams.returnTo ?? "").trim();

  const where: Prisma.PersonWhereInput = {};

  if (q) {
    where.OR = [{ lastName: { contains: q } }, { firstName: { contains: q } }];
  }

  if (clientId !== "TUTTI") {
    where.AND = [
      {
        OR: [{ clientId }, { personClients: { some: { clientId } } }],
      },
    ];
  }

  const [peopleRaw, clients] = await Promise.all([
    prisma.person.findMany({
      where,
      include: {
        client: true,
        personClients: { include: { client: true } },
        trainings: {
          where: { dueDate: { not: null } },
          orderBy: { dueDate: "asc" },
          include: { course: true },
        },
      },
    }),
    prisma.client.findMany({
      where: { status: "ATTIVO" },
      orderBy: { name: "asc" },
    }),
  ]);

  const people = [...peopleRaw].sort((a, b) => {
    const aDue = a.trainings?.[0]?.dueDate ?? null;
    const bDue = b.trainings?.[0]?.dueDate ?? null;

    const aRank = dueBadge(aDue).rank;
    const bRank = dueBadge(bDue).rank;
    if (aRank !== bRank) return aRank - bRank;

    const aTime = aDue ? new Date(aDue).getTime() : Number.MAX_SAFE_INTEGER;
    const bTime = bDue ? new Date(bDue).getTime() : Number.MAX_SAFE_INTEGER;
    if (aTime !== bTime) return aTime - bTime;

    const byLast = String(a.lastName ?? "").localeCompare(String(b.lastName ?? ""), "it");
    if (byLast !== 0) return byLast;

    return String(a.firstName ?? "").localeCompare(String(b.firstName ?? ""), "it");
  });

  const returnToParam = returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : "";
  const addHref =
    clientId !== "TUTTI"
      ? `/people/new?clientId=${clientId}${returnToParam}`
      : `/people/new${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`;

  const resetHref = returnTo
    ? `/people?returnTo=${encodeURIComponent(returnTo)}`
    : "/people";

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div className="page-title">
          <span className="icon">
            <IconUsers />
          </span>
          <h1 style={{ margin: 0 }}>Persone</h1>
        </div>

        <div className="row" style={{ gap: 8 }}>
          {returnTo ? (
            <Link className="btn" href={returnTo}>
              ← Torna al cliente
            </Link>
          ) : null}

          <Link className="btn primary icon" href={addHref}>
            <IconPlus />
            Aggiungi persona
          </Link>
        </div>
      </div>

      <form method="GET" className="card" style={{ marginTop: 12 }}>
        <input type="hidden" name="returnTo" value={returnTo} />

        <div className="grid3">
          <div>
            <label>Cerca persona</label>
            <input className="input" name="q" defaultValue={qRaw} placeholder="Nome o cognome..." />
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

          <div className="row" style={{ alignItems: "end", gap: 8 }}>
            <button className="btn primary icon" type="submit">
              <IconSearch />
              Cerca
            </button>

            <Link className="btn" href={resetHref}>
              Reset
            </Link>
          </div>
        </div>
      </form>

      <div className="muted" style={{ marginTop: 10 }}>
        Risultati: <b>{people.length}</b>
      </div>

      <table className="table" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>Persona</th>
            <th>Cliente</th>
            <th>Altri clienti</th>
            <th>Mansione</th>
            <th>Visita medica</th>
            <th>Prossima scadenza</th>
            <th>Stato</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {people.map((p) => {
            const mainClientId = p.clientId ?? null;

            const extraClientMap = new Map<string, string>();
            for (const pc of p.personClients ?? []) {
              const c = pc.client;
              if (!c) continue;
              if (mainClientId && c.id === mainClientId) continue;
              if (!extraClientMap.has(c.id)) extraClientMap.set(c.id, c.name);
            }

            const extraClients = Array.from(extraClientMap.values()).sort((a, b) =>
              a.localeCompare(b, "it")
            );

            const personHref = returnTo
              ? `/people/${p.id}?clientId=${clientId}&returnTo=${encodeURIComponent(returnTo)}`
              : `/people/${p.id}${clientId !== "TUTTI" ? `?clientId=${clientId}` : ""}`;

            const nextTraining = p.trainings?.[0] ?? null;
            const badge = dueBadge(nextTraining?.dueDate ?? null);

            return (
              <tr key={p.id}>
                <td>
                  <Link href={personHref} style={{ fontWeight: 700 }}>
                    {p.lastName} {p.firstName}
                  </Link>
                </td>
                <td>{p.client?.name ?? "— (one-shot)"}</td>
                <td className="muted">{extraClients.length ? extraClients.join(", ") : "—"}</td>
                <td>{p.role ?? ""}</td>
                <td>{p.medicalCheckDone ? "✅" : "—"}</td>
                <td>
                  {nextTraining ? (
                    <div>
                      <div>{fmtDate(nextTraining.dueDate)}</div>
                      <div className="muted" style={{ fontSize: 12 }}>
                        {nextTraining.course?.name ?? "Corso"}
                      </div>
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "4px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 800,
                      ...badge.style,
                    }}
                  >
                    {badge.label}
                  </span>
                </td>
                <td>{p.email ?? ""}</td>
              </tr>
            );
          })}

          {people.length === 0 ? (
            <tr>
              <td colSpan={8} className="muted">
                Nessuna persona.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}