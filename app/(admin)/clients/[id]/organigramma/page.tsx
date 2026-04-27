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
  { value: "", label: "Nessuna / manuale", years: 0 },
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

function addYears(dateRaw: string, years: number) {
  if (!dateRaw || !years) return "";
  const d = new Date(`${dateRaw}T12:00:00`);
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString().slice(0, 10);
}

function yearsFromPeriod(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();
  return PERIODS.find((p) => p.value === s)?.years ?? 0;
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

      <form action={saveRole} className="card" style={{ marginTop: 12 }}>
        <h2>Nuovo ruolo</h2>

        <input type="hidden" name="roleId" value="" />

        <div className="grid3" style={{ marginTop: 12 }}>
          <div>
            <label>Ruolo *</label>
            <select className="input" name="role" required>
              <option value="">Seleziona</option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Persona già inserita</label>
            <select className="input" name="personId">
              <option value="">Manuale / non collegata</option>
              {people.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.lastName} {p.firstName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Nome manuale *</label>
            <input className="input" name="name" placeholder="Nome e cognome" />
          </div>
        </div>

        <div className="grid3" style={{ marginTop: 12 }}>
          <div>
            <label>Data nomina</label>
            <input className="input" type="date" name="appointedAt" />
          </div>

          <div>
            <label>Periodicità</label>
            <select className="input" name="period" defaultValue="">
              {PERIODS.map((p) => (
                <option key={p.value || "NONE"} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Scadenza manuale</label>
            <input className="input" type="date" name="dueDate" />
          </div>
        </div>

        <div className="muted" style={{ marginTop: 8 }}>
          Se scegli una periodicità e inserisci la data nomina, la scadenza viene calcolata in automatico.
          Promemoria impostato a 1 mese prima.
        </div>

        <div className="row" style={{ gap: 8, marginTop: 14 }}>
          <button className="btn primary" type="submit">
            Aggiungi ruolo
          </button>
        </div>
      </form>

      <div className="card" style={{ marginTop: 12 }}>
        <h2>Ruoli inseriti</h2>

        {safetyRoles.length ? (
          <div className="tableWrap" style={{ marginTop: 10 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Ruolo</th>
                  <th>Nome e cognome</th>
                  <th>Data nomina</th>
                  <th>Scadenza</th>
                  <th>Salva</th>
                  <th>Elimina</th>
                </tr>
              </thead>

              <tbody>
                {safetyRoles.map((r: any) => (
                  <tr key={r.id}>
                    <td colSpan={6}>
                      <form action={saveRole}>
                        <input type="hidden" name="roleId" value={r.id} />
                        <input type="hidden" name="personId" value={r.personId ?? ""} />

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "170px 220px 150px 150px 90px 90px",
                            gap: 8,
                            alignItems: "center",
                          }}
                        >
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

                          <input
                            className="input"
                            type="date"
                            name="dueDate"
                            defaultValue={fmtIso(r.dueDate)}
                          />

                          <input type="hidden" name="period" value={r.notes ?? ""} />

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
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="muted" style={{ marginTop: 10 }}>
            Nessun ruolo inserito.
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h2>Ordine organigramma</h2>

        <div className="muted">
          {ROLES.map((r) => r.label).join(" → ")}
        </div>

        <div className="muted" style={{ marginTop: 8 }}>
          Nella scheda cliente compariranno solo le nomine inserite.
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h2>Anteprima stato</h2>

        {safetyRoles.length ? (
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
              {safetyRoles.map((r: any) => {
                const badge = safetyDueBadge(r.dueDate);

                return (
                  <tr key={`preview-${r.id}`}>
                    <td>
                      <b>{roleLabel(r.role)}</b>
                    </td>
                    <td>{r.name ?? "—"}</td>
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
    </div>
  );
}