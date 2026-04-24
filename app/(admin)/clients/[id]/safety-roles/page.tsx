import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ROLE_OPTIONS = [
  ["DDL", "DDL"],
  ["RSPP", "RSPP"],
  ["RLS", "RLS"],
  ["PREPOSTO", "Preposto"],
  ["ADDETTO_ANTINCENDIO", "Addetto antincendio"],
  ["ADDETTO_PRIMO_SOCCORSO", "Addetto primo soccorso"],
  ["DIRIGENTE", "Dirigente"],
  ["ADDETTO_BLSD", "Addetto BLSD"],
] as const;

function fmt(d: Date | null | undefined) {
  return d ? new Date(d).toLocaleDateString("it-IT") : "—";
}

function fmtIso(d: Date | null | undefined) {
  return d ? new Date(d).toISOString().slice(0, 10) : "";
}

function roleLabel(v: string | null | undefined) {
  const found = ROLE_OPTIONS.find(([key]) => key === String(v ?? "").trim().toUpperCase());
  return found?.[1] ?? String(v ?? "—");
}

function addYears(date: Date, years: number) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

function calcDueDate(role: string, appointedAtRaw: string) {
  if (!appointedAtRaw) return null;

  const appointedAt = new Date(`${appointedAtRaw}T12:00:00`);
  if (Number.isNaN(appointedAt.getTime())) return null;

  if (role === "RLS") return addYears(appointedAt, 3);
  if (role === "ADDETTO_PRIMO_SOCCORSO") return addYears(appointedAt, 3);

  return null;
}

function dueBadge(d: Date | null | undefined) {
  if (!d) return { label: "Nessuna scadenza", color: "rgba(0,0,0,0.65)" };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(d);
  due.setHours(0, 0, 0, 0);

  const in60 = new Date(today);
  in60.setDate(in60.getDate() + 60);

  if (due < today) return { label: "Scaduto", color: "#b91c1c" };
  if (due <= in60) return { label: "In scadenza", color: "#92400e" };
  return { label: "In regola", color: "#166534" };
}

export default async function ClientSafetyRolesPage({
  params,
}: {
  params: { id: string };
}) {
  const { prisma } = await import("@/lib/prisma");

  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: {
      safetyRoles: {
        orderBy: [{ role: "asc" }, { name: "asc" }],
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

  const personMap = new Map<string, any>();

  for (const p of client.people ?? []) personMap.set(p.id, p);
  for (const pc of client.personClients ?? []) {
    if (pc.person) personMap.set(pc.person.id, pc.person);
  }

  const peopleRows = Array.from(personMap.values()).sort((a, b) => {
    const byLast = String(a.lastName ?? "").localeCompare(String(b.lastName ?? ""), "it");
    if (byLast !== 0) return byLast;
    return String(a.firstName ?? "").localeCompare(String(b.firstName ?? ""), "it");
  });

  async function createSafetyRole(formData: FormData) {
    "use server";

    const { prisma } = await import("@/lib/prisma");

    const clientId = params.id;
    const role = String(formData.get("role") ?? "").trim().toUpperCase();
    const personId = String(formData.get("personId") ?? "").trim() || null;
    const manualName = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim() || null;
    const phone = String(formData.get("phone") ?? "").trim() || null;
    const appointedAtRaw = String(formData.get("appointedAt") ?? "").trim();
    const dueDateRaw = String(formData.get("dueDate") ?? "").trim();
    const notes = String(formData.get("notes") ?? "").trim() || null;

    if (!role) redirect(`/clients/${clientId}/safety-roles`);

    let name = manualName;

    if (personId) {
      const person = await prisma.person.findUnique({ where: { id: personId } });
      if (person) {
        name = `${person.lastName} ${person.firstName}`.trim();
      }
    }

    if (!name) redirect(`/clients/${clientId}/safety-roles`);

    const autoDue = calcDueDate(role, appointedAtRaw);

    await prisma.clientSafetyRole.create({
      data: {
        clientId,
        role,
        personId,
        name,
        email,
        phone,
        appointedAt: appointedAtRaw ? new Date(`${appointedAtRaw}T12:00:00`) : null,
        dueDate: dueDateRaw ? new Date(`${dueDateRaw}T12:00:00`) : autoDue,
        alertMonths: role === "RLS" || role === "ADDETTO_PRIMO_SOCCORSO" ? 2 : 0,
        notes,
      },
    });

    revalidatePath(`/clients/${clientId}`);
    revalidatePath(`/clients/${clientId}/safety-roles`);
    redirect(`/clients/${clientId}/safety-roles`);
  }

  async function deleteSafetyRole(formData: FormData) {
    "use server";

    const { prisma } = await import("@/lib/prisma");

    const clientId = params.id;
    const id = String(formData.get("id") ?? "").trim();

    if (id) {
      await prisma.clientSafetyRole.deleteMany({
        where: { id, clientId },
      });
    }

    revalidatePath(`/clients/${clientId}`);
    revalidatePath(`/clients/${clientId}/safety-roles`);
    redirect(`/clients/${clientId}/safety-roles`);
  }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Organigramma sicurezza</h1>

        <Link className="btn" href={`/clients/${client.id}`}>
          ← Torna al cliente
        </Link>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        Cliente: <b>{client.name}</b>
      </div>

      <form action={createSafetyRole} className="card" style={{ marginTop: 12 }}>
        <h2>Nuova nomina</h2>

        <div className="grid3" style={{ marginTop: 12 }}>
          <div>
            <label>Ruolo</label>
            <select className="input" name="role" defaultValue="DDL" required>
              {ROLE_OPTIONS.map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Persona già censita</label>
            <select className="input" name="personId" defaultValue="">
              <option value="">— Inserimento manuale —</option>
              {peopleRows.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.lastName} {p.firstName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Nome manuale</label>
            <input className="input" name="name" placeholder="Usa se non scegli una persona" />
          </div>
        </div>

        <div className="grid3" style={{ marginTop: 12 }}>
          <div>
            <label>Email</label>
            <input className="input" name="email" />
          </div>

          <div>
            <label>Telefono</label>
            <input className="input" name="phone" />
          </div>

          <div>
            <label>Data nomina</label>
            <input className="input" type="date" name="appointedAt" />
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <label>Scadenza</label>
            <input className="input" type="date" name="dueDate" />
            <div className="muted" style={{ marginTop: 4 }}>
              Se lasci vuoto: RLS e Primo soccorso calcolano 3 anni dalla nomina.
            </div>
          </div>

          <div>
            <label>Note</label>
            <input className="input" name="notes" />
          </div>
        </div>

        <div className="row" style={{ marginTop: 14, gap: 8 }}>
          <button className="btn primary" type="submit">
            Aggiungi
          </button>
        </div>
      </form>

      <div className="card" style={{ marginTop: 12 }}>
        <h2>Nomine inserite</h2>

        {client.safetyRoles.length ? (
          <table className="table" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>Ruolo</th>
                <th>Nome</th>
                <th>Telefono</th>
                <th>Email</th>
                <th>Nomina</th>
                <th>Scadenza</th>
                <th>Stato</th>
                <th>Note</th>
                <th>Elimina</th>
              </tr>
            </thead>

            <tbody>
              {client.safetyRoles.map((r: any) => {
                const badge = dueBadge(r.dueDate);

                return (
                  <tr key={r.id}>
                    <td>
                      <b>{roleLabel(r.role)}</b>
                    </td>
                    <td>{r.name}</td>
                    <td>{r.phone ?? "—"}</td>
                    <td>{r.email ?? "—"}</td>
                    <td>{fmt(r.appointedAt)}</td>
                    <td>{fmt(r.dueDate)}</td>
                    <td>
                      <span style={{ fontWeight: 900, color: badge.color }}>{badge.label}</span>
                    </td>
                    <td>{r.notes ?? "—"}</td>
                    <td>
                      <form action={deleteSafetyRole}>
                        <input type="hidden" name="id" value={r.id} />
                        <button className="btn danger" type="submit">
                          Elimina
                        </button>
                      </form>
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