import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ROLES = [
  { value: "DDL", label: "DDL", order: 1 },
  { value: "DIRIGENTE", label: "Dirigente", order: 2 },
  { value: "PREPOSTO", label: "Preposto", order: 3 },
  { value: "RSPP", label: "RSPP", order: 4 },
  { value: "RLS", label: "RLS", order: 5 },
  { value: "BLSD", label: "Addetto BLSD", order: 6 },
  { value: "PRIMO_SOCCORSO", label: "Addetto primo soccorso", order: 7 },
  { value: "ANTINCENDIO", label: "Addetto antincendio", order: 8 },
];

const PERIODS = [
  { value: "", label: "Manuale", years: 0 },
  { value: "ANNUALE", label: "Annuale", years: 1 },
  { value: "BIENNALE", label: "Biennale", years: 2 },
  { value: "TRIENNALE", label: "Triennale", years: 3 },
  { value: "QUINQUENNALE", label: "Quinquennale", years: 5 },
];

function fmt(d: Date | null | undefined) {
  return d ? new Date(d).toLocaleDateString("it-IT") : "—";
}

function fmtIso(d: Date | null | undefined) {
  return d ? new Date(d).toISOString().slice(0, 10) : "";
}

function roleLabel(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();
  return ROLES.find((r) => r.value === s)?.label ?? s ?? "—";
}

function roleOrder(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();
  return ROLES.find((r) => r.value === s)?.order ?? 999;
}

function periodLabel(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();
  return PERIODS.find((p) => p.value === s)?.label ?? "Manuale";
}

function yearsFromPeriod(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();
  return PERIODS.find((p) => p.value === s)?.years ?? 0;
}

function addYears(dateRaw: string, years: number) {
  if (!dateRaw || !years) return "";
  const d = new Date(`${dateRaw}T12:00:00`);
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString().slice(0, 10);
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function safetyDueBadge(d: Date | null | undefined) {
  if (!d) return { label: "Senza scadenza", cls: "badge muted" };

  const today = startOfDay(new Date());
  const due = startOfDay(new Date(d));
  const in30 = new Date(today);
  in30.setDate(in30.getDate() + 30);

  if (due < today) return { label: "Scaduto", cls: "badge danger" };
  if (due <= in30) return { label: "Promemoria", cls: "badge warn" };
  return { label: "In regola", cls: "badge ok" };
}

export default async function ClientOrganigrammaPage({
  params,
}: {
  params: { id: string };
}) {
  const { prisma } = await import("@/lib/prisma");

  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: {
      safetyRoles: {
        include: { person: true },
      },
      people: {
        orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      },
      personClients: {
        include: { person: true },
      },
    },
  });

  if (!client) return notFound();

  const safetyRoles = [...client.safetyRoles].sort((a: any, b: any) => {
    const ro = roleOrder(a.role) - roleOrder(b.role);
    if (ro !== 0) return ro;
    return String(a.name ?? "").localeCompare(String(b.name ?? ""), "it");
  });

  const peopleMap = new Map<string, any>();

  for (const p of client.people) peopleMap.set(p.id, p);
  for (const pc of client.personClients) {
    if (pc.person) peopleMap.set(pc.person.id, pc.person);
  }

  const people = Array.from(peopleMap.values()).sort((a, b) => {
    const byLast = String(a.lastName ?? "").localeCompare(String(b.lastName ?? ""), "it");
    if (byLast !== 0) return byLast;
    return String(a.firstName ?? "").localeCompare(String(b.firstName ?? ""), "it");
  });

  async function saveRole(formData: FormData) {
    "use server";

    const { prisma } = await import("@/lib/prisma");

    const clientId = params.id;
    const roleId = String(formData.get("roleId") ?? "").trim();
    const role = String(formData.get("role") ?? "").trim().toUpperCase();
    const personIdRaw = String(formData.get("personId") ?? "").trim();
    const personId = personIdRaw || null;
    const manualName = String(formData.get("name") ?? "").trim();
    const appointedAtRaw = String(formData.get("appointedAt") ?? "").trim();
    const period = String(formData.get("period") ?? "").trim().toUpperCase();
    const dueDateManual = String(formData.get("dueDate") ?? "").trim();

    let finalName = manualName;

    if (personId) {
      const person = await prisma.person.findUnique({
        where: { id: personId },
      });

      if (person) {
        finalName = `${person.lastName ?? ""} ${person.firstName ?? ""}`.trim();
      }
    }

    if (!role || !finalName) {
      redirect(`/clients/${clientId}/organigramma`);
    }

    const years = yearsFromPeriod(period);
    const dueDateCalculated = appointedAtRaw && years ? addYears(appointedAtRaw, years) : "";
    const finalDueDate = dueDateCalculated || dueDateManual;

    const data = {
      clientId,
      personId,
      role,
      name: finalName,
      email: null,
      phone: null,
      appointedAt: appointedAtRaw ? new Date(`${appointedAtRaw}T12:00:00`) : null,
      dueDate: finalDueDate ? new Date(`${finalDueDate}T12:00:00`) : null,
      alertMonths: 1,
      notes: period || null,
    };

    if (roleId) {
      await prisma.clientSafetyRole.update({
        where: { id: roleId },
        data,
      });
    } else {
      await prisma.clientSafetyRole.create({
        data,
      });
    }

    revalidatePath(`/clients/${clientId}`);
    revalidatePath(`/clients/${clientId}/organigramma`);
    redirect(`/clients/${clientId}/organigramma`);
  }

  async function deleteRole(formData: FormData) {
    "use server";

    const { prisma } = await import("@/lib/prisma");

    const clientId = params.id;
    const roleId = String(formData.get("roleId") ?? "").trim();

    if (roleId) {
      await prisma.clientSafetyRole.deleteMany({
        where: {
          id: roleId,
          clientId,
        },
      });
    }

    revalidatePath(`/clients/${clientId}`);
    revalidatePath(`/clients/${clientId}/organigramma`);
    redirect(`/clients/${clientId}/organigramma`);
  }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Organigramma sicurezza</h1>

        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href={`/clients/${client.id}`}>
            ← Torna al cliente
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        Cliente: <b>{client.name}</b>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h2>Ruoli inseriti</h2>

        <div className="muted" style={{ marginTop: 6 }}>
          Ordine: DDL → Dirigente → Preposto → RSPP → RLS → BLSD → Primo soccorso → Antincendio.
          Promemoria automatico 1 mese prima della scadenza.
        </div>

        <div style={{ overflowX: "auto", marginTop: 12 }}>
          <table className="table organigramma-table">
<thead>
<tr>
  <th colSpan={7} style={{padding:0}}>
    <div className="org-row org-head">
      <div>Ruolo</div>
      <div>Nome e cognome</div>
      <div>Data nomina</div>
      <div>Periodicità</div>
      <div>Scadenza</div>
      <div>Stato</div>
      <div>Azioni</div>
    </div>
  </th>
</tr>
</thead>

            <tbody>
              {safetyRoles.map((r: any) => {
                const badge = safetyDueBadge(r.dueDate);

                return (
                  <tr key={r.id}>
                    <td colSpan={7}>
                      <form action={saveRole}>
                        <input type="hidden" name="roleId" value={r.id} />
                        <input type="hidden" name="personId" value={r.personId ?? ""} />

                        <div className="org-row">
                          <select className="input" name="role" defaultValue={r.role}>
                            {ROLES.map((x) => (
                              <option key={x.value} value={x.value}>
                                {x.label}
                              </option>
                            ))}
                          </select>

                          <input className="input" name="name" defaultValue={r.name ?? ""} />

                          <input
                            className="input"
                            type="date"
                            name="appointedAt"
                            defaultValue={fmtIso(r.appointedAt)}
                          />

                          <select className="input" name="period" defaultValue={r.notes ?? ""}>
                            {PERIODS.map((p) => (
                              <option key={p.value || "NONE"} value={p.value}>
                                {p.label}
                              </option>
                            ))}
                          </select>

                          <input
                            className="input"
                            type="date"
                            name="dueDate"
                            defaultValue={fmtIso(r.dueDate)}
                          />

                          <span className={badge.cls}>{badge.label}</span>

                          <div className="actions">
                            <button className="btn primary" type="submit">
                              Salva
                            </button>

                            <button
                              className="btn"
                              type="submit"
                              formAction={deleteRole}
                              name="roleId"
                              value={r.id}
                            >
                              Elimina
                            </button>
                          </div>
                        </div>
                      </form>
                    </td>
                  </tr>
                );
              })}

              <tr>
                <td colSpan={7}>
                  <form action={saveRole}>
                    <input type="hidden" name="roleId" value="" />

                    <div className="org-row new-row">
                      <select className="input" name="role" required defaultValue="">
                        <option value="">Seleziona ruolo</option>
                        {ROLES.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>

                      <div>
                        <select className="input" name="personId" defaultValue="">
                          <option value="">Manuale / non collegata</option>
                          {people.map((p: any) => (
                            <option key={p.id} value={p.id}>
                              {p.lastName} {p.firstName}
                            </option>
                          ))}
                        </select>

                        <input
                          className="input"
                          name="name"
                          placeholder="Oppure scrivi nome manuale"
                          style={{ marginTop: 6 }}
                        />
                      </div>

                      <input className="input" type="date" name="appointedAt" />

                      <select className="input" name="period" defaultValue="">
                        {PERIODS.map((p) => (
                          <option key={p.value || "NONE"} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </select>

                      <input className="input" type="date" name="dueDate" />

                      <span className="badge muted">Nuovo</span>

                      <button className="btn primary" type="submit">
                        Aggiungi
                      </button>
                    </div>
                  </form>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {!safetyRoles.length ? (
          <div className="muted" style={{ marginTop: 10 }}>
            Nessun ruolo inserito. Usa la riga “Nuovo ruolo” per aggiungere la prima nomina.
          </div>
        ) : null}
      </div>

      <style>{`
     <style>{`
  .organigramma-table {
    width: 100%;
    min-width: 1350px;
  }

  .organigramma-table td,
  .organigramma-table th {
    vertical-align: middle;
  }

  .org-row {
    display: grid;
    grid-template-columns: 180px minmax(300px, 1.6fr) 170px 170px 170px 150px 190px;
    column-gap: 16px;
    align-items: center;
    width: 100%;
  }

  .org-head {
    font-weight: 700;
    padding: 10px 12px;
    background: #f8fafc;
  }

  .org-row .input {
    width: 100%;
    min-width: 0;
  }

  .org-row .badge {
    justify-self: start;
    white-space: nowrap;
  }

  .actions {
    display: flex;
    gap: 8px;
    justify-content: flex-start;
    flex-wrap: nowrap;
  }

  .table td {
    padding: 8px 12px;
    vertical-align: middle;
  }
`}</style>

        .organigramma-table td,
        .organigramma-table th {
          vertical-align: middle;
        }

 .org-row{
display:grid;
grid-template-columns:
160px
250px
150px
150px
150px
120px
170px;
column-gap:12px;
align-items:center;
width:100%;
}

.org-head{
font-weight:700;
padding:10px 12px;
background:#f8fafc;
}

.org-row .input{
width:100%;
min-width:0;
}

.org-row .badge{
white-space:nowrap;
}

.actions{
display:flex;
gap:8px;
justify-content:flex-start;
}

.table td{
padding:8px 12px;
vertical-align:middle;
}

.org-row .input {
  width: 100%;
  min-width: 0;
}

.org-row .badge {
  justify-self: start;
  white-space: nowrap;
}

.org-row .actions {
  display: flex;
  gap: 6px;
  flex-wrap: nowrap;
}

        .new-row {
          background: rgba(37, 99, 235, 0.04);
          border-radius: 12px;
          padding: 8px;
        }
      `}</style>
    </div>
  );
}