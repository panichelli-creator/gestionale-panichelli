import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ROLES = [
  "OWNER",
  "TITOLARE",
  "OFFICE_MANAGER",
  "ASO",
  "MEDICO",
  "AMMINISTRAZIONE",
  "ALTRO",
];

const MARKETING_LISTS = [
  "MEDICI",
  "ASO",
  "TITOLARI",
  "AMMINISTRAZIONE",
  "IGIENISTI",
  "FISIOTERAPISTI",
  "ALTRO",
];

type SP = {
  err?: string;
  ok?: string;
  edit?: string;
  returnTo?: string;
};

export default async function ClientContactsPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: SP;
}) {
  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: { contacts: { orderBy: { name: "asc" } } },
  });

  if (!client) return notFound();

  const clientId = client.id;
  const returnTo = String(searchParams?.returnTo ?? "").trim();
  const editId = String(searchParams?.edit ?? "").trim() || null;
  const contactInEdit =
    editId ? client.contacts.find((c) => c.id === editId) ?? null : null;

  function buildPageUrl(extra?: Record<string, string | null | undefined>) {
    const p = new URLSearchParams();
    if (returnTo) p.set("returnTo", returnTo);

    for (const [k, v] of Object.entries(extra ?? {})) {
      if (v != null && String(v).trim() !== "") {
        p.set(k, String(v));
      }
    }

    const qs = p.toString();
    return qs ? `/clients/${clientId}/contacts?${qs}` : `/clients/${clientId}/contacts`;
  }

  async function createContact(formData: FormData) {
    "use server";

    const clientId = params.id;
    const returnToForm = String(formData.get("returnTo") ?? "").trim();
    const role = String(formData.get("role") ?? "ALTRO").trim() || "ALTRO";
    const marketingList =
      String(formData.get("marketingList") ?? "ALTRO").trim() || "ALTRO";
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim() || null;
    const phone = String(formData.get("phone") ?? "").trim() || null;
    const notes = String(formData.get("notes") ?? "").trim() || null;

    const buildUrl = (extra?: Record<string, string | null | undefined>) => {
      const p = new URLSearchParams();
      if (returnToForm) p.set("returnTo", returnToForm);

      for (const [k, v] of Object.entries(extra ?? {})) {
        if (v != null && String(v).trim() !== "") {
          p.set(k, String(v));
        }
      }

      const qs = p.toString();
      return qs ? `/clients/${clientId}/contacts?${qs}` : `/clients/${clientId}/contacts`;
    };

    if (!name) {
      redirect(buildUrl({ err: "Nome contatto obbligatorio" }));
    }

    try {
      await prisma.clientContact.create({
        data: { clientId, role, marketingList, name, email, phone, notes },
      });
    } catch (e: any) {
      redirect(buildUrl({ err: e?.message ?? "Errore creazione contatto" }));
    }

    redirect(buildUrl({ ok: "Contatto creato" }));
  }

  async function updateContact(formData: FormData) {
    "use server";

    const clientId = params.id;
    const returnToForm = String(formData.get("returnTo") ?? "").trim();
    const contactId = String(formData.get("contactId") ?? "").trim();
    const role = String(formData.get("role") ?? "ALTRO").trim() || "ALTRO";
    const marketingList =
      String(formData.get("marketingList") ?? "ALTRO").trim() || "ALTRO";
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim() || null;
    const phone = String(formData.get("phone") ?? "").trim() || null;
    const notes = String(formData.get("notes") ?? "").trim() || null;

    const buildUrl = (extra?: Record<string, string | null | undefined>) => {
      const p = new URLSearchParams();
      if (returnToForm) p.set("returnTo", returnToForm);

      for (const [k, v] of Object.entries(extra ?? {})) {
        if (v != null && String(v).trim() !== "") {
          p.set(k, String(v));
        }
      }

      const qs = p.toString();
      return qs ? `/clients/${clientId}/contacts?${qs}` : `/clients/${clientId}/contacts`;
    };

    if (!contactId) {
      redirect(buildUrl({ err: "Contatto non valido" }));
    }

    if (!name) {
      redirect(buildUrl({ edit: contactId, err: "Nome contatto obbligatorio" }));
    }

    try {
      await prisma.clientContact.update({
        where: { id: contactId },
        data: { role, marketingList, name, email, phone, notes },
      });
    } catch (e: any) {
      redirect(
        buildUrl({
          edit: contactId,
          err: e?.message ?? "Errore modifica contatto",
        })
      );
    }

    redirect(buildUrl({ ok: "Contatto aggiornato" }));
  }

  async function deleteContact(formData: FormData) {
    "use server";

    const clientId = params.id;
    const returnToForm = String(formData.get("returnTo") ?? "").trim();
    const contactId = String(formData.get("contactId") ?? "").trim();

    const buildUrl = (extra?: Record<string, string | null | undefined>) => {
      const p = new URLSearchParams();
      if (returnToForm) p.set("returnTo", returnToForm);

      for (const [k, v] of Object.entries(extra ?? {})) {
        if (v != null && String(v).trim() !== "") {
          p.set(k, String(v));
        }
      }

      const qs = p.toString();
      return qs ? `/clients/${clientId}/contacts?${qs}` : `/clients/${clientId}/contacts`;
    };

    if (!contactId) redirect(buildUrl());

    try {
      await prisma.clientContact.delete({ where: { id: contactId } });
    } catch (e: any) {
      redirect(buildUrl({ err: e?.message ?? "Errore eliminazione contatto" }));
    }

    redirect(buildUrl({ ok: "Contatto eliminato" }));
  }

  const backHref = returnTo || `/clients/${clientId}`;
  const cancelEditHref = buildPageUrl();
  const editBaseHref = (contactId: string) => buildPageUrl({ edit: contactId });

  return (
    <div className="card">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <h1>Contatti — {client.name}</h1>
        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href={backHref}>
            ← Torna al cliente
          </Link>
          <Link className="btn" href="/clients">
            Clienti
          </Link>
        </div>
      </div>

      {searchParams?.err ? (
        <div
          className="card"
          style={{ marginTop: 12, border: "1px solid #ff6b6b" }}
        >
          <b style={{ color: "#ff6b6b" }}>Errore:</b>{" "}
          {decodeURIComponent(searchParams.err)}
        </div>
      ) : null}

      {searchParams?.ok ? (
        <div
          className="card"
          style={{
            marginTop: 12,
            border: "1px solid rgba(34,197,94,0.6)",
          }}
        >
          <b style={{ color: "rgba(34,197,94,0.95)" }}>OK:</b>{" "}
          {decodeURIComponent(searchParams.ok)}
        </div>
      ) : null}

      <div className="card" style={{ marginTop: 12 }}>
        <h2>Crea contatto</h2>

        <form action={createContact} className="card" style={{ marginTop: 10 }}>
          <input type="hidden" name="returnTo" value={returnTo} />

          <div className="grid2">
            <div>
              <label>Ruolo</label>
              <select className="input" name="role" defaultValue="ALTRO">
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Lista marketing</label>
              <select
                className="input"
                name="marketingList"
                defaultValue="ALTRO"
              >
                {MARKETING_LISTS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid2" style={{ marginTop: 12 }}>
            <div>
              <label>Nome *</label>
              <input
                className="input"
                name="name"
                placeholder="es: Mario Rossi"
                required
              />
            </div>

            <div>
              <label>Email</label>
              <input className="input" name="email" placeholder="nome@mail.it" />
            </div>
          </div>

          <div className="grid2" style={{ marginTop: 12 }}>
            <div>
              <label>Telefono</label>
              <input className="input" name="phone" placeholder="333..." />
            </div>

            <div>
              <label>Note</label>
              <input className="input" name="notes" />
            </div>
          </div>

          <div className="row" style={{ marginTop: 14 }}>
            <button className="btn primary" type="submit">
              Salva contatto
            </button>
          </div>
        </form>
      </div>

      {contactInEdit ? (
        <div className="card" style={{ marginTop: 12 }}>
          <div
            className="row"
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <h2>Modifica contatto</h2>
            <Link className="btn" href={cancelEditHref}>
              Annulla
            </Link>
          </div>

          <form action={updateContact} className="card" style={{ marginTop: 10 }}>
            <input type="hidden" name="contactId" value={contactInEdit.id} />
            <input type="hidden" name="returnTo" value={returnTo} />

            <div className="grid2">
              <div>
                <label>Ruolo</label>
                <select
                  className="input"
                  name="role"
                  defaultValue={contactInEdit.role ?? "ALTRO"}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Lista marketing</label>
                <select
                  className="input"
                  name="marketingList"
                  defaultValue={(contactInEdit as any).marketingList ?? "ALTRO"}
                >
                  {MARKETING_LISTS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid2" style={{ marginTop: 12 }}>
              <div>
                <label>Nome *</label>
                <input
                  className="input"
                  name="name"
                  defaultValue={contactInEdit.name}
                  placeholder="es: Mario Rossi"
                  required
                />
              </div>

              <div>
                <label>Email</label>
                <input
                  className="input"
                  name="email"
                  defaultValue={contactInEdit.email ?? ""}
                  placeholder="nome@mail.it"
                />
              </div>
            </div>

            <div className="grid2" style={{ marginTop: 12 }}>
              <div>
                <label>Telefono</label>
                <input
                  className="input"
                  name="phone"
                  defaultValue={contactInEdit.phone ?? ""}
                  placeholder="333..."
                />
              </div>

              <div>
                <label>Note</label>
                <input
                  className="input"
                  name="notes"
                  defaultValue={contactInEdit.notes ?? ""}
                />
              </div>
            </div>

            <div className="row" style={{ marginTop: 14, gap: 8 }}>
              <button className="btn primary" type="submit">
                Salva modifiche
              </button>
              <Link className="btn" href={cancelEditHref}>
                Annulla
              </Link>
            </div>
          </form>
        </div>
      ) : null}

      <div className="card" style={{ marginTop: 12 }}>
        <h2>Lista contatti</h2>

        <div className="muted" style={{ marginTop: 8 }}>
          Totale contatti: <b>{client.contacts.length}</b>
        </div>

        <table className="table" style={{ marginTop: 10 }}>
          <thead>
            <tr>
              <th>Ruolo</th>
              <th>Lista</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefono</th>
              <th style={{ width: 220 }}>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {client.contacts.map((ct) => (
              <tr key={ct.id}>
                <td className="muted">{ct.role}</td>
                <td className="muted">{(ct as any).marketingList ?? "ALTRO"}</td>
                <td>
                  <b>{ct.name}</b>
                </td>
                <td>{ct.email ?? "—"}</td>
                <td>{ct.phone ?? "—"}</td>
                <td>
                  <div className="row" style={{ gap: 8 }}>
                    <Link className="btn" href={editBaseHref(ct.id)}>
                      Modifica
                    </Link>

                    <form action={deleteContact}>
                      <input type="hidden" name="contactId" value={ct.id} />
                      <input type="hidden" name="returnTo" value={returnTo} />
                      <button className="btn" type="submit">
                        Elimina
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}

            {client.contacts.length === 0 ? (
              <tr>
                <td colSpan={6} className="muted">
                  Nessun contatto. Creane uno sopra.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}