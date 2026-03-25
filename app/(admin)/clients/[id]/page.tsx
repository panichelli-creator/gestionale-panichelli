import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function fmt(d: Date | null | undefined) {
  return d ? new Date(d).toLocaleDateString("it-IT") : "—";
}

function toNum(v: any): number {
  if (v == null) return 0;
  const s = typeof v === "number" ? String(v) : String(v?.toString?.() ?? v);
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function eur(n: number) {
  return n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

function periodicityFactor(p: string | null | undefined) {
  const s = String(p ?? "").toUpperCase();

  if (s === "SEMESTRALE") return 2;
  if (s === "BIENNALE") return 0.5;
  if (s === "TRIENNALE") return 0.33;
  if (s === "QUINQUENNALE") return 0.2;

  return 1;
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function vseBadge(next: Date | null) {
  if (!next) return { label: "—", cls: "badge muted" };

  const today = startOfDay(new Date());
  const d = startOfDay(next);
  const in30 = startOfDay(addDays(today, 30));

  if (d < today) return { label: "Scaduto", cls: "badge danger" };
  if (d <= in30) return { label: "Entro 30gg", cls: "badge warn" };
  return { label: "In regola", cls: "badge ok" };
}

function getReferenteLabel(serviceRow: any) {
  const referente = String(serviceRow?.referenteName ?? "").trim();
  return referente || "—";
}

function clientStatusBadgeStyle(status: string | null | undefined) {
  const s = String(status ?? "").trim().toUpperCase();

  if (s === "ATTIVO") {
    return {
      background: "rgba(34,197,94,0.12)",
      color: "#166534",
      border: "1px solid rgba(34,197,94,0.28)",
    };
  }

  if (s === "DISMESSO") {
    return {
      background: "rgba(245,158,11,0.12)",
      color: "#92400e",
      border: "1px solid rgba(245,158,11,0.28)",
    };
  }

  return {
    background: "rgba(0,0,0,0.05)",
    color: "rgba(0,0,0,0.70)",
    border: "1px solid rgba(0,0,0,0.10)",
  };
}

export default async function ClientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = getSession();
  const isIngegnereClinico = session?.role === "ingegnere_clinico";

  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: {
      contacts: true,
      sites: true,
      services: {
        include: { service: true, site: true },
        orderBy: { dueDate: "asc" },
      },
      people: {
        orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      },
      personClients: {
        include: {
          person: true,
        },
      },
      practices: { orderBy: [{ inApertureList: "desc" }, { practiceDate: "desc" }] as any },
    },
  });

  if (!client) return notFound();

  const returnTo = `/clients/${client.id}`;
  const returnToParam = encodeURIComponent(returnTo);

  const primaryContact = client.contacts?.[0] ?? null;

  const vseRows = await prisma.clinicalEngineeringCheck.findMany({
    where: { clientId: client.id },
    orderBy: { dataProssimoAppuntamento: "asc" },
  });

  const totalServices = client.services.length;

  const annualTotal = client.services.reduce((acc, s) => {
    const price = toNum(s.priceEur);
    const factor = periodicityFactor(s.periodicity);
    return acc + price * factor;
  }, 0);

  const personMap = new Map<string, any>();

  for (const p of client.people) {
    personMap.set(p.id, p);
  }

  for (const pc of client.personClients) {
    if (pc.person) {
      personMap.set(pc.person.id, pc.person);
    }
  }

  const peopleRows = Array.from(personMap.values()).sort((a, b) => {
    const byLast = String(a.lastName ?? "").localeCompare(String(b.lastName ?? ""), "it");
    if (byLast !== 0) return byLast;
    return String(a.firstName ?? "").localeCompare(String(b.firstName ?? ""), "it");
  });

  const apertureCount = client.practices.filter((p: any) => Boolean(p.inApertureList)).length;

  return (
    <div className="card">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <h1>{client.name}</h1>

        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href="/clients">
            ← Clienti
          </Link>
          {!isIngegnereClinico ? (
            <Link className="btn" href={`/clients/${client.id}/edit`}>
              Modifica
            </Link>
          ) : null}
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div
          className="row"
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <h2>Dati generali</h2>

          {!isIngegnereClinico ? (
            <Link className="btn" href={`/clients/${client.id}/edit`}>
              Modifica anagrafica
            </Link>
          ) : (
            <div className="muted">Sola consultazione</div>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 12,
            marginTop: 12,
          }}
        >
          <div>
            <div className="muted">Ragione sociale / Nome cliente</div>
            <div>
              <b>{client.name}</b>
            </div>
          </div>

          <div>
            <div className="muted">Tipo struttura</div>
            <div>{client.type ?? "—"}</div>
          </div>

          <div>
            <div className="muted">Stato</div>
            <div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 800,
                  ...clientStatusBadgeStyle(client.status),
                }}
              >
                {client.status ?? "—"}
              </span>
            </div>
          </div>

          <div>
            <div className="muted">P.IVA</div>
            <div>{client.vatNumber ?? "—"}</div>
          </div>

          <div>
            <div className="muted">Codice Univoco</div>
            <div>{client.uniqueCode ?? "—"}</div>
          </div>

          <div>
            <div className="muted">PEC</div>
            <div>{client.pec ?? "—"}</div>
          </div>

          <div>
            <div className="muted">Email</div>
            <div>{client.email ?? "—"}</div>
          </div>

          <div>
            <div className="muted">Telefono</div>
            <div>{client.phone ?? "—"}</div>
          </div>

          <div>
            <div className="muted">Numero dipendenti</div>
            <div>{client.employeesCount ?? "—"}</div>
          </div>

          <div>
            <div className="muted">Indirizzo</div>
            <div>{client.address ?? "—"}</div>
          </div>

          <div>
            <div className="muted">Sede legale</div>
            <div>{client.legalSeat ?? "—"}</div>
          </div>

          <div>
            <div className="muted">Medico competente</div>
            <div>{client.occupationalDoctorName ?? "—"}</div>
          </div>

          <div>
            <div className="muted">Referente principale</div>
            <div>{primaryContact?.name ?? "—"}</div>
          </div>

          <div>
            <div className="muted">Ruolo referente</div>
            <div>{primaryContact?.role ?? "—"}</div>
          </div>

          <div>
            <div className="muted">Telefono referente</div>
            <div>{primaryContact?.phone ?? "—"}</div>
          </div>

          <div>
            <div className="muted">Email referente</div>
            <div>{primaryContact?.email ?? "—"}</div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="muted">Note cliente</div>
          <div>{client.notes ?? "—"}</div>
        </div>

        {primaryContact?.notes ? (
          <div style={{ marginTop: 12 }}>
            <div className="muted">Note referente</div>
            <div>{primaryContact.notes}</div>
          </div>
        ) : null}
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2>Contatti</h2>

          {!isIngegnereClinico ? (
            <Link className="btn" href={`/clients/${client.id}/contacts?returnTo=${returnToParam}`}>
              Gestisci contatti
            </Link>
          ) : (
            <div className="muted">Sola consultazione</div>
          )}
        </div>

        <div className="muted">
          Totale contatti: <b>{client.contacts.length}</b>
        </div>

        {client.contacts.length ? (
          <table className="table" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Ruolo</th>
                <th>Lista</th>
                <th>Email</th>
                <th>Telefono</th>
              </tr>
            </thead>
            <tbody>
              {client.contacts.map((c: any) => (
                <tr key={c.id}>
                  <td>
                    <b>{c.name}</b>
                  </td>
                  <td>{c.role}</td>
                  <td>{c.marketingList ?? "ALTRO"}</td>
                  <td>{c.email ?? "—"}</td>
                  <td>{c.phone ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="muted" style={{ marginTop: 10 }}>
            Nessun contatto
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2>Sedi</h2>

          {!isIngegnereClinico ? (
            <Link className="btn" href={`/clients/${client.id}/sites?returnTo=${returnToParam}`}>
              Gestisci sedi
            </Link>
          ) : (
            <div className="muted">Sola consultazione</div>
          )}
        </div>

        <div className="muted">
          Totale sedi: <b>{client.sites.length}</b>
        </div>

        {client.sites.length ? (
          <table className="table" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>Nome sede</th>
                <th>Indirizzo</th>
                <th>Città</th>
                <th>Provincia</th>
                <th>CAP</th>
              </tr>
            </thead>
            <tbody>
              {client.sites.map((s) => (
                <tr key={s.id}>
                  <td>
                    <b>{s.name ?? "—"}</b>
                  </td>
                  <td>{s.address ?? "—"}</td>
                  <td>{"city" in s ? (s as any).city ?? "—" : "—"}</td>
                  <td>{"province" in s ? (s as any).province ?? "—" : "—"}</td>
                  <td>{"cap" in s ? (s as any).cap ?? "—" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="muted" style={{ marginTop: 10 }}>
            Nessuna sede
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2>Servizi (mantenimenti)</h2>

          {!isIngegnereClinico ? (
            <Link className="btn" href={`/clients/${client.id}/services?returnTo=${returnToParam}`}>
              Gestisci servizi
            </Link>
          ) : (
            <div className="muted">Sola consultazione</div>
          )}
        </div>

        <div className="muted">
          Totale servizi: <b>{totalServices}</b>
        </div>

        <div className="muted">
          Totale annuo stimato: <b>{eur(annualTotal)}</b>
        </div>

        {client.services.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Servizio</th>
                <th>Sede</th>
                <th>Referente</th>
                <th>Scadenza</th>
                <th>Periodicità</th>
                <th>Prezzo</th>
              </tr>
            </thead>

            <tbody>
              {client.services.map((s: any) => (
                <tr key={s.id}>
                  <td>
                    <b>{s.service?.name}</b>
                  </td>

                  <td>{s.site?.name ?? "—"}</td>

                  <td>{getReferenteLabel(s)}</td>

                  <td>{fmt(s.dueDate)}</td>

                  <td>{s.periodicity}</td>

                  <td>{s.priceEur ? eur(toNum(s.priceEur)) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="muted">Nessun servizio</div>
        )}
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2>Persone</h2>

          {!isIngegnereClinico ? (
            <div className="row" style={{ gap: 8 }}>
              <Link className="btn" href={`/people/new?clientId=${client.id}&returnTo=${returnToParam}`}>
                Nuova persona
              </Link>
              <Link className="btn primary" href={`/people?clientId=${client.id}&returnTo=${returnToParam}`}>
                Gestisci persone
              </Link>
            </div>
          ) : (
            <div className="muted">Sola consultazione</div>
          )}
        </div>

        <div className="muted">
          Totale persone: <b>{peopleRows.length}</b>
        </div>

        {peopleRows.length ? (
          <table className="table" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>Persona</th>
                <th>Mansione</th>
                <th>Email</th>
                <th>Telefono</th>
              </tr>
            </thead>
            <tbody>
              {peopleRows.map((p: any) => (
                <tr key={p.id}>
                  <td>
                    <Link
                      href={`/people/${p.id}?clientId=${client.id}&returnTo=${returnToParam}`}
                      style={{ fontWeight: 700 }}
                    >
                      {p.lastName} {p.firstName}
                    </Link>
                  </td>
                  <td>{p.role ?? "—"}</td>
                  <td>{p.email ?? "—"}</td>
                  <td>{p.phone ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="muted" style={{ marginTop: 10 }}>
            Nessuna persona
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2>Ingegneria Clinica (VSE)</h2>

          <div className="row" style={{ gap: 8 }}>
            {!isIngegnereClinico ? (
              <Link
                className="btn"
                href={`/ingegneria-clinica/new?clientId=${client.id}&returnTo=${returnToParam}`}
              >
                Nuova verifica
              </Link>
            ) : null}

            <Link
              className="btn primary"
              href={`/ingegneria-clinica?clientId=${client.id}&returnTo=${returnToParam}`}
            >
              Gestisci verifiche
            </Link>
          </div>
        </div>

        <div className="muted">
          Totale verifiche: <b>{vseRows.length}</b>
        </div>

        {vseRows.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Prossimo appuntamento</th>
                <th>Stato</th>
                <th>€ Servizio</th>
                <th>Apri</th>
              </tr>
            </thead>

            <tbody>
              {vseRows.map((r) => {
                const badge = vseBadge(r.dataProssimoAppuntamento);

                return (
                  <tr key={r.id}>
                    <td>{fmt(r.dataProssimoAppuntamento)}</td>

                    <td>
                      <span className={badge.cls}>{badge.label}</span>
                    </td>

                    <td>{eur(toNum(r.costoServizio))}</td>

                    <td>
                      <Link className="btn" href={`/ingegneria-clinica/${r.id}?clientId=${client.id}&returnTo=${returnToParam}`}>
                        Apri
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="muted">Nessuna verifica</div>
        )}
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <h2>Pratiche</h2>

          {!isIngegnereClinico ? (
            <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
              <Link className="btn" href={`/clients/${client.id}/practices/new?returnTo=${returnToParam}`}>
                Nuova pratica
              </Link>
              <Link className="btn primary" href="/aperture">
                Apri lista Aperture
              </Link>
            </div>
          ) : (
            <div className="muted">Sola consultazione</div>
          )}
        </div>

        <div className="muted">
          Totale pratiche: <b>{client.practices.length}</b> • In Aperture: <b>{apertureCount}</b>
        </div>

        {client.practices.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Pratica</th>
                <th>Data</th>
                <th>Numero determina</th>
                <th>In Aperture</th>
                <th>Apri</th>
              </tr>
            </thead>

            <tbody>
              {client.practices.map((p: any) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{fmt(p.practiceDate)}</td>
                  <td>{p.determinaNumber ?? "—"}</td>
                  <td>{p.inApertureList ? "SI" : "NO"}</td>
                  <td>
                    {!isIngegnereClinico ? (
                      <Link
                        className="btn"
                        href={`/clients/${client.id}/practices/${p.id}?returnTo=${returnToParam}`}
                      >
                        Apri
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="muted">Nessuna pratica</div>
        )}
      </div>
    </div>
  );
}