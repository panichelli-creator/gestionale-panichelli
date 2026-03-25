import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BackButton from "../BackButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function fmt(d: Date | null) {
  return d ? new Date(d).toLocaleDateString("it-IT") : "—";
}

type SP = {
  clientId?: string;
  returnTo?: string;
};

export default async function PersonDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: SP;
}) {
  const person = await prisma.person.findUnique({
    where: { id: params.id },
    include: {
      client: true,
      personClients: { include: { client: true } },
      personSites: {
        include: {
          site: {
            include: {
              client: true,
            },
          },
        },
      },
      trainings: {
        include: { course: true },
        orderBy: [{ dueDate: "asc" }],
      },
    },
  });

  if (!person) return notFound();

  const clientId = String(searchParams.clientId ?? "").trim();
  const returnTo = String(searchParams.returnTo ?? "").trim();
  const returnToParam = returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : "";
  const returnToAndClientParam = new URLSearchParams();
  if (clientId) returnToAndClientParam.set("clientId", clientId);
  if (returnTo) returnToAndClientParam.set("returnTo", returnTo);
  const tail = returnToAndClientParam.toString();
  const qs = tail ? `?${tail}` : "";

  const extraClientMap = new Map<string, { id: string; name: string }>();
  for (const pc of person.personClients ?? []) {
    const c = pc.client;
    if (!c) continue;
    if (person.clientId && c.id === person.clientId) continue;
    if (!extraClientMap.has(c.id)) {
      extraClientMap.set(c.id, { id: c.id, name: c.name });
    }
  }

  const extraClients = Array.from(extraClientMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name, "it")
  );

  const mainClientSites = (person.personSites ?? [])
    .filter((ps) => ps.site && ps.site.clientId === person.clientId)
    .map((ps) => ps.site!)
    .sort((a, b) => a.name.localeCompare(b.name, "it"));

  const otherSites = (person.personSites ?? [])
    .filter((ps) => ps.site && ps.site.clientId !== person.clientId)
    .map((ps) => ps.site!)
    .sort((a, b) => {
      const byClient = (a.client?.name ?? "").localeCompare(b.client?.name ?? "", "it");
      if (byClient !== 0) return byClient;
      return a.name.localeCompare(b.name, "it");
    });

  const backHref = returnTo || (clientId ? `/clients/${clientId}` : "/people");

  return (
    <div className="card" style={{ maxWidth: 1320, margin: "0 auto" }}>
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}
      >
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0 }}>
            {person.lastName} {person.firstName}
          </h1>

          <div className="muted" style={{ marginTop: 6 }}>
            {person.client ? (
              <>
                Cliente principale:{" "}
                <Link href={`/clients/${person.client.id}`}>{person.client.name}</Link>
              </>
            ) : (
              <>Cliente principale: —</>
            )}
          </div>
        </div>

        <div
          className="row"
          style={{ gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}
        >
          {returnTo || clientId ? (
            <Link className="btn" href={backHref}>
              ← Torna al cliente
            </Link>
          ) : (
            <BackButton />
          )}

          <Link className="btn" href={`/people/${person.id}/edit${qs}`}>
            Modifica
          </Link>

          <Link className="btn primary" href={`/people/${person.id}/training/new${qs}`}>
            + Aggiungi corso
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginBottom: 10 }}>Dati collegamenti</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div className="muted">Cliente principale</div>
            <div style={{ marginTop: 6, wordBreak: "break-word" }}>
              {person.client ? (
                <Link href={`/clients/${person.client.id}`}>{person.client.name}</Link>
              ) : (
                "—"
              )}
            </div>
          </div>

          <div style={{ minWidth: 0 }}>
            <div className="muted">Sedi del cliente principale</div>
            <div style={{ marginTop: 6 }}>
              {mainClientSites.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {mainClientSites.map((s) => (
                    <li key={s.id} style={{ marginBottom: 4, wordBreak: "break-word" }}>
                      <Link href={`/clients/${s.clientId}/sites/${s.id}`}>{s.name}</Link>
                    </li>
                  ))}
                </ul>
              ) : (
                "—"
              )}
            </div>
          </div>

          <div style={{ minWidth: 0 }}>
            <div className="muted">Altri clienti collegati</div>
            <div style={{ marginTop: 6 }}>
              {extraClients.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {extraClients.map((c) => (
                    <li key={c.id} style={{ marginBottom: 4, wordBreak: "break-word" }}>
                      <Link href={`/clients/${c.id}`}>{c.name}</Link>
                    </li>
                  ))}
                </ul>
              ) : (
                "—"
              )}
            </div>
          </div>

          <div style={{ minWidth: 0 }}>
            <div className="muted">Altre sedi collegate</div>
            <div style={{ marginTop: 6 }}>
              {otherSites.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {otherSites.map((s) => (
                    <li key={s.id} style={{ marginBottom: 4, wordBreak: "break-word" }}>
                      <Link href={`/clients/${s.clientId}/sites/${s.id}`}>
                        {s.client?.name ?? "—"} — {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                "—"
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <h3 style={{ marginBottom: 8 }}>Formazione</h3>

        {person.trainings.length === 0 ? (
          <div className="muted">Nessun corso associato.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="table" style={{ minWidth: 980 }}>
              <thead>
                <tr>
                  <th>Corso</th>
                  <th>Effettuato il</th>
                  <th>Scadenza</th>
                  <th>Stato</th>
                  <th>Attestato</th>
                  <th style={{ textAlign: "right" }}>Apri</th>
                </tr>
              </thead>
              <tbody>
                {person.trainings.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 700, wordBreak: "break-word" }}>
                      {t.course?.name ?? "—"}
                    </td>
                    <td>{fmt(t.performedAt)}</td>
                    <td>{fmt(t.dueDate)}</td>
                    <td>{t.status ?? "—"}</td>
                    <td>{t.certificateDelivered ? "SI" : "NO"}</td>
                    <td style={{ textAlign: "right" }}>
                      <Link href={`/people/${person.id}/training/${t.id}/edit${qs}`}>
                        Apri
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}