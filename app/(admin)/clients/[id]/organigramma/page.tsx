import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ROLES = [
  { value: "DDL", label: "DDL" },
  { value: "RSPP", label: "RSPP" },
  { value: "RLS", label: "RLS" },
  { value: "PREPOSTO", label: "Preposto" },
  { value: "ANTINCENDIO", label: "Addetto antincendio" },
  { value: "PRIMO_SOCCORSO", label: "Addetto primo soccorso" },
  { value: "DIRIGENTE", label: "Dirigente" },
  { value: "BLSD", label: "Addetto BLSD" },
];

function fmtIso(d: Date | null | undefined) {
  return d ? new Date(d).toISOString().slice(0, 10) : "";
}

function roleLabel(v: string | null | undefined) {
  const found = ROLES.find((r) => r.value === String(v ?? "").toUpperCase());
  return found?.label ?? v ?? "—";
}

function addYears(dateRaw: string, years: number) {
  if (!dateRaw) return "";
  const d = new Date(`${dateRaw}T12:00:00`);
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString().slice(0, 10);
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
        orderBy: [{ role: "asc" }, { name: "asc" }],
      },
      people: {
        orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      },
      personClients: {
        include: {
          person: true,
        },
      },
    },
  });

  if (!client) return notFound();

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
    const email = String(formData.get("email") ?? "").trim() || null;
    const phone = String(formData.get("phone") ?? "").trim() || null;
    const appointedAtRaw = String(formData.get("appointedAt") ?? "").trim();
    const dueDateRaw = String(formData.get("dueDate") ?? "").trim();
    const alertMonthsRaw = String(formData.get("alertMonths") ?? "").trim();
    const notes = String(formData.get("notes") ?? "").trim() || null;

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

    const data = {
      clientId,
      personId,
      role,
      name: finalName,
      email,
      phone,
      appointedAt: appointedAtRaw ? new Date(`${appointedAtRaw}T12:00:00`) : null,
      dueDate: dueDateRaw ? new Date(`${dueDateRaw}T12:00:00`) : null,
      alertMonths:
        alertMonthsRaw && Number.isFinite(Number(alertMonthsRaw))
          ? Number(alertMonthsRaw)
          : 2,
      notes,
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

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <label>Email</label>
            <input className="input" name="email" />
          </div>

          <div>
            <label>Telefono</label>
            <input className="input" name="phone" />
          </div>
        </div>

        <div className="grid3" style={{ marginTop: 12 }}>
          <div>
            <label>Data nomina</label>
            <input className="input" type="date" name="appointedAt" />
          </div>

          <div>
            <label>Scadenza</label>
            <input className="input" type="date" name="dueDate" />
          </div>

          <div>
            <label>Promemoria mesi prima</label>
            <input className="input" type="number" name="alertMonths" defaultValue={2} />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Note</label>
          <textarea className="input" name="notes" rows={3} />
        </div>

        <div className="row" style={{ gap: 8, marginTop: 14 }}>
          <button className="btn primary" type="submit">
            Aggiungi ruolo
          </button>
        </div>
      </form>

      <div className="card" style={{ marginTop: 12 }}>
        <h2>Ruoli inseriti</h2>

        {client.safetyRoles.length ? (
          <div className="tableWrap" style={{ marginTop: 10 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Ruolo</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefono</th>
                  <th>Nomina</th>
                  <th>Scadenza</th>
                  <th>Promemoria</th>
                  <th>Note</th>
                  <th>Salva</th>
                  <th>Elimina</th>
                </tr>
              </thead>

              <tbody>
                {client.safetyRoles.map((r: any) => (
                  <tr key={r.id}>
                    <td colSpan={10}>
                      <form action={saveRole}>
                        <input type="hidden" name="roleId" value={r.id} />

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "150px 180px 180px 150px 140px 140px 110px minmax(180px, 1fr) 90px 90px",
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

                          <input className="input" name="email" defaultValue={r.email ?? ""} />

                          <input className="input" name="phone" defaultValue={r.phone ?? ""} />

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

                          <input
                            className="input"
                            type="number"
                            name="alertMonths"
                            defaultValue={r.alertMonths ?? 2}
                          />

                          <input className="input" name="notes" defaultValue={r.notes ?? ""} />

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

                        <input type="hidden" name="personId" value={r.personId ?? ""} />
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
        <h2>Scadenze rapide</h2>

        <div className="muted">
          Per RLS puoi usare scadenza triennale. Per Primo soccorso puoi usare scadenza triennale.
          Per altri ruoli puoi lasciare vuoto oppure inserire una data manuale.
        </div>

        <div className="muted" style={{ marginTop: 8 }}>
          Ruoli disponibili: {ROLES.map((r) => r.label).join(", ")}.
        </div>
      </div>
    </div>
  );
}