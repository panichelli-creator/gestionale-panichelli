import Link from "next/link";
import { notFound } from "next/navigation";
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

function safetyRoleLabel(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();

  if (s === "DDL") return "DDL";
  if (s === "RSPP") return "RSPP";
  if (s === "RLS") return "RLS";
  if (s === "PREPOSTO") return "Preposto";
  if (s === "ANTINCENDIO") return "Addetto antincendio";
  if (s === "PRIMO_SOCCORSO") return "Addetto primo soccorso";
  if (s === "DIRIGENTE") return "Dirigente";
  if (s === "BLSD") return "Addetto BLSD";

  return s || "—";
}

function safetyDueBadge(d: Date | null | undefined) {
  if (!d) return { label: "Senza scadenza", cls: "badge muted" };

  const today = startOfDay(new Date());
  const due = startOfDay(new Date(d));
  const in30 = startOfDay(addDays(today, 30));

  if (due < today) return { label: "Scaduto", cls: "badge danger" };
  if (due <= in30) return { label: "Promemoria", cls: "badge warn" };
  return { label: "In regola", cls: "badge ok" };
}

function safetyRoleOrder(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();

  if (s === "DDL") return 1;
  if (s === "DIRIGENTE") return 2;
  if (s === "PREPOSTO") return 3;
  if (s === "RSPP") return 4;
  if (s === "RLS") return 5;
  if (s === "BLSD") return 6;
  if (s === "PRIMO_SOCCORSO") return 7;
  if (s === "ANTINCENDIO") return 8;

  return 999;
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

function getPracticeStatusLabel(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();

  if (s === "INVIATA_REGIONE") return "Inviata Regione";
  if (s === "INIZIO_LAVORI") return "Inizio lavori";
  if (s === "ACCETTATO") return "Accettato";
  if (s === "ISPEZIONE_ASL") return "Ispezione ASL";
  if (s === "CONCLUSO") return "Concluso";

  return "In attesa";
}

function practiceStatusBadgeStyle(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();

  if (s === "CONCLUSO") {
    return {
      background: "rgba(34,197,94,0.12)",
      color: "#166534",
      border: "1px solid rgba(34,197,94,0.30)",
    };
  }

  if (s === "ACCETTATO") {
    return {
      background: "rgba(37,99,235,0.12)",
      color: "#1d4ed8",
      border: "1px solid rgba(37,99,235,0.30)",
    };
  }

  if (s === "ISPEZIONE_ASL") {
    return {
      background: "rgba(245,158,11,0.12)",
      color: "#92400e",
      border: "1px solid rgba(245,158,11,0.30)",
    };
  }

  if (s === "INIZIO_LAVORI") {
    return {
      background: "rgba(168,85,247,0.12)",
      color: "#7c3aed",
      border: "1px solid rgba(168,85,247,0.30)",
    };
  }

  if (s === "INVIATA_REGIONE") {
    return {
      background: "rgba(14,165,233,0.12)",
      color: "#0369a1",
      border: "1px solid rgba(14,165,233,0.30)",
    };
  }

  return {
    background: "rgba(0,0,0,0.04)",
    color: "rgba(0,0,0,0.72)",
    border: "1px solid rgba(0,0,0,0.12)",
  };
}

function getStartYear(p: any) {
  const raw = p?.startYear ?? null;
  if (raw == null || raw === "") return "—";
  return String(raw);
}

function billingStatusLabel(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();

  if (s === "DA_FATTURARE") return "Da fatturare";
  if (s === "FATTURA_DA_INVIARE") return "Fattura da inviare";
  if (s === "FATTURATA") return "Fatturata";
  if (s === "INCASSATA") return "Incassata";

  return "—";
}

function billingStatusStyle(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();

  if (s === "INCASSATA") {
    return {
      background: "rgba(34,197,94,0.12)",
      color: "#166534",
      border: "1px solid rgba(34,197,94,0.30)",
    };
  }

  if (s === "FATTURATA") {
    return {
      background: "rgba(37,99,235,0.12)",
      color: "#1d4ed8",
      border: "1px solid rgba(37,99,235,0.30)",
    };
  }

  if (s === "FATTURA_DA_INVIARE") {
    return {
      background: "rgba(245,158,11,0.12)",
      color: "#92400e",
      border: "1px solid rgba(245,158,11,0.30)",
    };
  }

  if (s === "DA_FATTURARE") {
    return {
      background: "rgba(239,68,68,0.10)",
      color: "#b91c1c",
      border: "1px solid rgba(239,68,68,0.30)",
    };
  }

  return {
    background: "rgba(0,0,0,0.04)",
    color: "rgba(0,0,0,0.72)",
    border: "1px solid rgba(0,0,0,0.12)",
  };
}

function getBillingSummary(p: any) {
  const steps = Array.isArray(p?.billingSteps) ? p.billingSteps : [];

  const valore = steps.reduce((acc: number, row: any) => acc + toNum(row?.amountEur), 0);

  const fatturato = steps
    .filter((row: any) =>
      ["FATTURATA", "INCASSATA"].includes(String(row?.billingStatus ?? "").trim().toUpperCase())
    )
    .reduce((acc: number, row: any) => acc + toNum(row?.amountEur), 0);

  const incassato = steps
    .filter((row: any) => String(row?.billingStatus ?? "").trim().toUpperCase() === "INCASSATA")
    .reduce((acc: number, row: any) => acc + toNum(row?.amountEur), 0);

  const normalizedSteps = steps.map((row: any) => ({
    ...row,
    billingStatusUpper: String(row?.billingStatus ?? "").trim().toUpperCase(),
    triggerStatusUpper: String(row?.triggerStatus ?? "").trim().toUpperCase(),
  }));

  const activeStep =
    normalizedSteps.find(
      (row: any) => !["FATTURATA", "INCASSATA"].includes(row.billingStatusUpper)
    ) ??
    normalizedSteps.find((row: any) => row.billingStatusUpper === "FATTURATA") ??
    normalizedSteps.find((row: any) => row.billingStatusUpper === "INCASSATA") ??
    null;

  return {
    valore,
    fatturato,
    incassato,
    residuo: Math.max(valore - incassato, 0),
    count: steps.length,
    activeTriggerStatus: activeStep?.triggerStatusUpper || "",
    activeBillingStatus: activeStep?.billingStatusUpper || "—",
  };
}

export default async function ClientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { prisma } = await import("@/lib/prisma");
  const session = getSession();
  const isIngegnereClinico = session?.role === "ingegnere_clinico";

  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: {
      contacts: true,
      sites: true,
      safetyRoles: {
        include: { person: true },
        orderBy: [{ role: "asc" }, { name: "asc" }],
      },
      services: {
        include: { service: true, site: true },
        orderBy: { dueDate: "asc" },
      },
      people: {
        include: {
          trainings: {
            include: { course: true },
            orderBy: [{ dueDate: "asc" }],
          },
        },
        orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      },
      personClients: {
        include: {
          person: {
            include: {
              trainings: {
                include: { course: true },
                orderBy: [{ dueDate: "asc" }],
              },
            },
          },
        },
      },
      practices: {
        include: {
          billingSteps: {
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
          },
        },
        orderBy: [{ inApertureList: "desc" }, { practiceDate: "desc" }] as any,
      },
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

  for (const p of client.people) personMap.set(p.id, p);
  for (const pc of client.personClients) {
    if (pc.person) personMap.set(pc.person.id, pc.person);
  }

  const peopleRows = Array.from(personMap.values()).sort((a, b) => {
    const byLast = String(a.lastName ?? "").localeCompare(String(b.lastName ?? ""), "it");
    if (byLast !== 0) return byLast;
    return String(a.firstName ?? "").localeCompare(String(b.firstName ?? ""), "it");
  });

  const trainingRows = peopleRows
    .flatMap((p: any) =>
      (Array.isArray(p.trainings) ? p.trainings : []).map((t: any) => ({
        ...t,
        __person: p,
      }))
    )
    .sort((a: any, b: any) => {
      const at = a?.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      const bt = b?.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      if (at !== bt) return at - bt;

      const al = String(a?.__person?.lastName ?? "").localeCompare(
        String(b?.__person?.lastName ?? ""),
        "it"
      );
      if (al !== 0) return al;

      return String(a?.course?.name ?? "").localeCompare(String(b?.course?.name ?? ""), "it");
    });

  const today = startOfDay(new Date());

  const trainingScaduti = trainingRows.filter(
    (t: any) => t?.dueDate && startOfDay(new Date(t.dueDate)) < today
  ).length;

  const trainingFatturati = trainingRows.filter((t: any) => Boolean(t?.fatturata)).length;

  const trainingTotalValue = trainingRows.reduce(
    (acc: number, t: any) => acc + toNum(t?.priceEur),
    0
  );

  const trainingBilledValue = trainingRows
    .filter((t: any) => Boolean(t?.fatturata))
    .reduce((acc: number, t: any) => acc + toNum(t?.priceEur), 0);

  const apertureCount = client.practices.filter((p: any) => Boolean(p.inApertureList)).length;

  const practicesInAttesa = client.practices.filter(
    (p: any) => String(p.apertureStatus ?? "IN_ATTESA").trim().toUpperCase() === "IN_ATTESA"
  ).length;

  const practicesInCorso = client.practices.filter((p: any) =>
    ["INVIATA_REGIONE", "INIZIO_LAVORI", "ACCETTATO", "ISPEZIONE_ASL"].includes(
      String(p.apertureStatus ?? "").trim().toUpperCase()
    )
  ).length;

  const practicesConcluse = client.practices.filter(
    (p: any) => String(p.apertureStatus ?? "").trim().toUpperCase() === "CONCLUSO"
  ).length;

  const totalPracticesValue = client.practices.reduce(
    (acc: number, p: any) => acc + getBillingSummary(p).valore,
    0
  );

  const totalBillingFatturato = client.practices.reduce(
    (acc: number, p: any) => acc + getBillingSummary(p).fatturato,
    0
  );

const safetyRolesOrdered = [...client.safetyRoles].sort((a: any, b: any) => {
  const byRole = safetyRoleOrder(a.role) - safetyRoleOrder(b.role);
  if (byRole !== 0) return byRole;
  return String(a.name ?? "").localeCompare(String(b.name ?? ""), "it");
});

  const totalBillingIncassato = client.practices.reduce(
    (acc: number, p: any) => acc + getBillingSummary(p).incassato,
    0
  );

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>{client.name}</h1>

        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href="/clients">
            ← Clienti
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
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
    <h2>Organigramma sicurezza</h2>

    {!isIngegnereClinico ? (
      <Link className="btn primary" href={`/clients/${client.id}/organigramma`}>
        Gestisci organigramma
      </Link>
    ) : (
      <div className="muted">Sola consultazione</div>
    )}
  </div>

  <div className="muted" style={{ marginTop: 6 }}>
    DDL, Dirigente, Preposto, RSPP, RLS, BLSD, Addetto primo soccorso, Addetto antincendio.
  </div>

  {safetyRolesOrdered.length ? (
    <table className="table" style={{ marginTop: 10 }}>
      <thead>
        <tr>
          <th>Ruolo</th>
          <th>Nome e cognome</th>
          <th>Data nomina</th>
          <th>Scadenza</th>
          <th>Stato</th>
        </tr>
      </thead>

      <tbody>
        {safetyRolesOrdered.map((r: any) => {
          const badge = safetyDueBadge(r.dueDate);
          const fullName = r.person
            ? `${r.person.lastName ?? ""} ${r.person.firstName ?? ""}`.trim()
            : String(r.name ?? "").trim();

          return (
            <tr key={r.id}>
              <td>
                <b>{safetyRoleLabel(r.role)}</b>
              </td>
              <td>{fullName || "—"}</td>
              <td>{fmt(r.appointedAt)}</td>
              <td>{fmt(r.dueDate)}</td>
              <td>
                <span className={badge.cls}>{badge.label}</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  ) : (
    <div className="muted" style={{ marginTop: 10 }}>
      Nessuna nomina inserita.
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
                <th>Corsi</th>
                <th>Fatturati</th>
              </tr>
            </thead>
            <tbody>
              {peopleRows.map((p: any) => {
                const trainings = Array.isArray(p.trainings) ? p.trainings : [];
                const billed = trainings.filter((t: any) => Boolean(t?.fatturata)).length;

                return (
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
                    <td>{trainings.length}</td>
                    <td>{billed}</td>
                  </tr>
                );
              })}
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
          <h2>Formazione</h2>

          {!isIngegnereClinico ? (
            <Link className="btn primary" href={`/training?clientId=${client.id}`}>
              Apri formazione
            </Link>
          ) : (
            <div className="muted">Sola consultazione</div>
          )}
        </div>

        <div className="row" style={{ gap: 12, flexWrap: "wrap", marginTop: 10 }}>
          <div className="card">
            Totale corsi: <b>{trainingRows.length}</b>
          </div>
          <div className="card">
            Scaduti: <b>{trainingScaduti}</b>
          </div>
          <div className="card">
            Fatturati: <b>{trainingFatturati}</b>
          </div>
          <div className="card">
            Valore totale: <b>{eur(trainingTotalValue)}</b>
          </div>
          <div className="card">
            Totale fatturato: <b>{eur(trainingBilledValue)}</b>
          </div>
        </div>

        {trainingRows.length ? (
          <table className="table" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>Persona</th>
                <th>Corso</th>
                <th>Effettuato il</th>
                <th>Scadenza</th>
                <th>Stato</th>
                <th>Prezzo</th>
                <th>Attestato</th>
                <th>Fatturata</th>
                <th>Fatturata il</th>
                <th>Apri</th>
              </tr>
            </thead>
            <tbody>
              {trainingRows.map((t: any) => (
                <tr key={t.id}>
                  <td>
                    <Link
                      href={`/people/${t.__person.id}?clientId=${client.id}&returnTo=${returnToParam}`}
                      style={{ fontWeight: 700 }}
                    >
                      {t.__person.lastName} {t.__person.firstName}
                    </Link>
                  </td>
                  <td>{t.course?.name ?? "—"}</td>
                  <td>{fmt(t.performedAt)}</td>
                  <td>{fmt(t.dueDate)}</td>
                  <td>{t.status ?? "—"}</td>
                  <td>{toNum(t.priceEur) > 0 ? eur(toNum(t.priceEur)) : "—"}</td>
                  <td>{t.certificateDelivered ? "SI" : "NO"}</td>
                  <td>{t.fatturata ? "SI" : "NO"}</td>
                  <td>{fmt(t.fatturataAt ?? null)}</td>
                  <td>
                    <Link
                      className="btn"
                      href={`/people/${t.__person.id}/training/${t.id}/edit?clientId=${client.id}&returnTo=${returnToParam}`}
                    >
                      Apri
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="muted" style={{ marginTop: 10 }}>
            Nessun corso associato
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
                      <Link
                        className="btn"
                        href={`/ingegneria-clinica/${r.id}?clientId=${client.id}&returnTo=${returnToParam}`}
                      >
                        Apri
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="muted" style={{ marginTop: 10 }}>
            Nessuna verifica
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2>Pratiche</h2>

          {!isIngegnereClinico ? (
            <div className="row" style={{ gap: 8 }}>
              <Link className="btn" href={`/clients/${client.id}/practices/new`}>
                Nuova pratica
              </Link>
              <Link className="btn" href="/aperture">
                Vai ad Aperture
              </Link>
              <Link className="btn primary" href="/pratiche-fatturazione">
                Fatturazione pratiche
              </Link>
            </div>
          ) : (
            <div className="muted">Sola consultazione</div>
          )}
        </div>

        <div className="row" style={{ gap: 12, flexWrap: "wrap", marginTop: 10 }}>
          <div className="card">
            In Aperture: <b>{apertureCount}</b>
          </div>
          <div className="card">
            In attesa: <b>{practicesInAttesa}</b>
          </div>
          <div className="card">
            In corso: <b>{practicesInCorso}</b>
          </div>
          <div className="card">
            Concluse: <b>{practicesConcluse}</b>
          </div>
          <div className="card">
            Valore SAL: <b>{eur(totalPracticesValue)}</b>
          </div>
          <div className="card">
            Fatturato SAL: <b>{eur(totalBillingFatturato)}</b>
          </div>
          <div className="card">
            Incassato SAL: <b>{eur(totalBillingIncassato)}</b>
          </div>
        </div>

        {client.practices.length ? (
          <table className="table" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>Pratica</th>
                <th>Data</th>
                <th>Anno</th>
                <th>Stato</th>
                <th>In Aperture</th>
                <th>Valore SAL</th>
                <th>Incassato</th>
                <th>Residuo</th>
                <th>Stato SAL</th>
                <th>Apri</th>
              </tr>
            </thead>
            <tbody>
              {client.practices.map((p: any) => {
                const billing = getBillingSummary(p);

                return (
                  <tr key={p.id}>
                    <td>
                      <b>{p.title ?? "—"}</b>
                    </td>
                    <td>{fmt(p.practiceDate)}</td>
                    <td>{getStartYear(p)}</td>
                    <td>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "4px 10px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 800,
                          ...practiceStatusBadgeStyle(p.apertureStatus),
                        }}
                      >
                        {getPracticeStatusLabel(p.apertureStatus)}
                      </span>
                    </td>
                    <td>{p.inApertureList ? "SI" : "NO"}</td>
                    <td>{billing.valore > 0 ? eur(billing.valore) : "—"}</td>
                    <td>{billing.incassato > 0 ? eur(billing.incassato) : "—"}</td>
                    <td>{billing.valore > 0 ? eur(billing.residuo) : "—"}</td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                          alignItems: "flex-start",
                        }}
                      >
                        {billing.activeTriggerStatus ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "4px 10px",
                              borderRadius: 999,
                              fontSize: 12,
                              fontWeight: 800,
                              ...practiceStatusBadgeStyle(billing.activeTriggerStatus),
                            }}
                          >
                            {getPracticeStatusLabel(billing.activeTriggerStatus)}
                          </span>
                        ) : null}

                        {billing.activeBillingStatus !== "—" ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "4px 10px",
                              borderRadius: 999,
                              fontSize: 12,
                              fontWeight: 800,
                              ...billingStatusStyle(billing.activeBillingStatus),
                            }}
                          >
                            {billingStatusLabel(billing.activeBillingStatus)}
                          </span>
                        ) : (
                          <span className="badge muted">—</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <Link className="btn" href={`/clients/${client.id}/practices/${p.id}`}>
                        Apri
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="muted" style={{ marginTop: 10 }}>
            Nessuna pratica
          </div>
        )}
      </div>
    </div>
  );
}