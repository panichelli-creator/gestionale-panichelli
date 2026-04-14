import Link from "next/link";
import { notFound, redirect } from "next/navigation";

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

type SP = {
  err?: string;
  ok?: string;
  edit?: string;
  returnTo?: string;
};

function normalize(v: string) {
  return String(v ?? "").trim().toUpperCase();
}

function parseLists(...values: any[]) {
  const out: string[] = [];
  const seen = new Set<string>();

  for (const value of values) {
    if (value == null) continue;

    if (Array.isArray(value)) {
      for (const item of value) {
        const v = normalize(String(item ?? ""));
        if (!v || seen.has(v)) continue;
        seen.add(v);
        out.push(v);
      }
      continue;
    }

    const raw = String(value ?? "").trim();
    if (!raw) continue;

    if (
      (raw.startsWith("[") && raw.endsWith("]")) ||
      (raw.startsWith('["') && raw.endsWith('"]'))
    ) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            const v = normalize(String(item ?? ""));
            if (!v || seen.has(v)) continue;
            seen.add(v);
            out.push(v);
          }
          continue;
        }
      } catch {}
    }

    for (const part of raw.split(",")) {
      const v = normalize(part);
      if (!v || seen.has(v)) continue;
      seen.add(v);
      out.push(v);
    }
  }

  return out;
}

function stringifyLists(values: string[]) {
  const out: string[] = [];
  const seen = new Set<string>();

  for (const raw of values) {
    const value = normalize(raw);
    if (!value) continue;
    if (seen.has(value)) continue;
    seen.add(value);
    out.push(value);
  }

  return out.length ? out.join(", ") : "ALTRO";
}

export default async function ClientContactsPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: SP | Promise<SP>;
}) {
  const { prisma } = await import("@/lib/prisma");

  const resolvedSearchParams =
    searchParams && typeof (searchParams as Promise<SP>).then === "function"
      ? await (searchParams as Promise<SP>)
      : ((searchParams as SP | undefined) ?? {});

  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: {
      contacts: {
        orderBy: { name: "asc" },
      },
    },
  });

  if (!client) return notFound();

  const marketingListsDb = await prisma.marketingList.findMany({
    where: { isActive: true },
    orderBy: [{ isSystem: "desc" }, { name: "asc" }],
  });

  const returnTo = String(resolvedSearchParams?.returnTo ?? "").trim();
  const editId = String(resolvedSearchParams?.edit ?? "").trim();
  const contactEdit =
    editId ? client.contacts.find((c: any) => c.id === editId) ?? null : null;

  const allLists: string[] = [];
  const seenLists = new Set<string>();

  for (const row of marketingListsDb as any[]) {
    const value = normalize(row?.name);
    if (!value) continue;
    if (seenLists.has(value)) continue;
    seenLists.add(value);
    allLists.push(value);
  }

  for (const contact of client.contacts as any[]) {
    for (const item of parseLists(contact.marketingList, (contact as any).marketingLists)) {
      if (seenLists.has(item)) continue;
      seenLists.add(item);
      allLists.push(item);
    }
  }

  allLists.sort((a, b) => a.localeCompare(b, "it"));

  function buildUrl(extra?: Record<string, string | null | undefined>) {
    const qs = new URLSearchParams();

    if (returnTo) qs.set("returnTo", returnTo);

    for (const [k, v] of Object.entries(extra ?? {})) {
      if (v != null && String(v).trim() !== "") {
        qs.set(k, String(v));
      }
    }

    const s = qs.toString();
    return s ? `/clients/${params.id}/contacts?${s}` : `/clients/${params.id}/contacts`;
  }

  async function createContact(formData: FormData) {
    "use server";

    const { prisma } = await import("@/lib/prisma");

    const returnToForm = String(formData.get("returnTo") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const role = String(formData.get("role") ?? "ALTRO").trim() || "ALTRO";
    const email = String(formData.get("email") ?? "").trim() || null;
    const phone = String(formData.get("phone") ?? "").trim() || null;
    const notes = String(formData.get("notes") ?? "").trim() || null;
    const lists = formData.getAll("marketingLists").map((x) => normalize(String(x)));

    const qs = new URLSearchParams();
    if (returnToForm) qs.set("returnTo", returnToForm);
    const base = qs.toString() ? `/clients/${params.id}/contacts?${qs.toString()}` : `/clients/${params.id}/contacts`;

    if (!name) {
      return redirect(`${base}${base.includes("?") ? "&" : "?"}err=Nome obbligatorio`);
    }

    const listsString = stringifyLists(lists);

    try {
      await prisma.clientContact.create({
        data: {
          clientId: params.id,
          name,
          role,
          email,
          phone,
          notes,
          marketingList: listsString,
          marketingLists: JSON.stringify(parseLists(listsString)),
        } as any,
      });
    } catch {
      try {
        await prisma.clientContact.create({
          data: {
            clientId: params.id,
            name,
            role,
            email,
            phone,
            notes,
            marketingList: listsString,
          } as any,
        });
      } catch {
        await prisma.clientContact.create({
          data: {
            clientId: params.id,
            name,
            role,
            email,
            phone,
            notes,
            marketingLists: JSON.stringify(parseLists(listsString)),
          } as any,
        });
      }
    }

    return redirect(`${base}${base.includes("?") ? "&" : "?"}ok=Creato`);
  }

  async function updateContact(formData: FormData) {
    "use server";

    const { prisma } = await import("@/lib/prisma");

    const returnToForm = String(formData.get("returnTo") ?? "").trim();
    const id = String(formData.get("id") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const role = String(formData.get("role") ?? "ALTRO").trim() || "ALTRO";
    const email = String(formData.get("email") ?? "").trim() || null;
    const phone = String(formData.get("phone") ?? "").trim() || null;
    const notes = String(formData.get("notes") ?? "").trim() || null;
    const lists = formData.getAll("marketingLists").map((x) => normalize(String(x)));

    const qs = new URLSearchParams();
    if (returnToForm) qs.set("returnTo", returnToForm);
    const base = qs.toString() ? `/clients/${params.id}/contacts?${qs.toString()}` : `/clients/${params.id}/contacts`;

    if (!id || !name) {
      return redirect(`${base}${base.includes("?") ? "&" : "?"}err=Errore`);
    }

    const listsString = stringifyLists(lists);

    try {
      await prisma.clientContact.update({
        where: { id },
        data: {
          name,
          role,
          email,
          phone,
          notes,
          marketingList: listsString,
          marketingLists: JSON.stringify(parseLists(listsString)),
        } as any,
      });
    } catch {
      try {
        await prisma.clientContact.update({
          where: { id },
          data: {
            name,
            role,
            email,
            phone,
            notes,
            marketingList: listsString,
          } as any,
        });
      } catch {
        await prisma.clientContact.update({
          where: { id },
          data: {
            name,
            role,
            email,
            phone,
            notes,
            marketingLists: JSON.stringify(parseLists(listsString)),
          } as any,
        });
      }
    }

    return redirect(`${base}${base.includes("?") ? "&" : "?"}ok=Aggiornato`);
  }

  async function deleteContact(formData: FormData) {
    "use server";

    const { prisma } = await import("@/lib/prisma");

    const returnToForm = String(formData.get("returnTo") ?? "").trim();
    const id = String(formData.get("id") ?? "").trim();

    const qs = new URLSearchParams();
    if (returnToForm) qs.set("returnTo", returnToForm);
    const base = qs.toString() ? `/clients/${params.id}/contacts?${qs.toString()}` : `/clients/${params.id}/contacts`;

    if (!id) {
      return redirect(`${base}${base.includes("?") ? "&" : "?"}err=Contatto non valido`);
    }

    await prisma.clientContact.delete({
      where: { id },
    });

    return redirect(`${base}${base.includes("?") ? "&" : "?"}ok=Eliminato`);
  }

  const editLists = contactEdit
    ? parseLists(contactEdit.marketingList, (contactEdit as any).marketingLists)
    : [];
  const backHref = returnTo || `/clients/${params.id}`;

  return (
    <div className="card">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}
      >
        <h1 style={{ margin: 0 }}>Contatti — {client.name}</h1>

        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href={backHref}>
            ← Torna al cliente
          </Link>
          <Link className="btn" href="/clients">
            Clienti
          </Link>
        </div>
      </div>

      {resolvedSearchParams?.err ? (
        <div
          className="card"
          style={{ marginTop: 12, border: "1px solid #ff6b6b" }}
        >
          <b style={{ color: "#ff6b6b" }}>Errore:</b>{" "}
          {decodeURIComponent(String(resolvedSearchParams.err))}
        </div>
      ) : null}

      {resolvedSearchParams?.ok ? (
        <div
          className="card"
          style={{
            marginTop: 12,
            border: "1px solid rgba(34,197,94,0.6)",
          }}
        >
          <b style={{ color: "rgba(34,197,94,0.95)" }}>OK:</b>{" "}
          {decodeURIComponent(String(resolvedSearchParams.ok))}
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
              <label>Liste</label>
              <div className="card" style={{ marginTop: 8, padding: 10 }}>
                {allLists.map((m) => (
                  <label key={`create-${m}`} style={{ display: "block" }}>
                    <input type="checkbox" name="marketingLists" value={m} /> {m}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid2" style={{ marginTop: 12 }}>
            <input
              name="name"
              className="input"
              placeholder="Nome *"
              required
            />
            <input name="email" className="input" placeholder="Email" />
          </div>

          <div className="grid2" style={{ marginTop: 12 }}>
            <input name="phone" className="input" placeholder="Telefono" />
            <input name="notes" className="input" placeholder="Note" />
          </div>

          <button className="btn primary" style={{ marginTop: 10 }} type="submit">
            Salva
          </button>
        </form>
      </div>

      {contactEdit ? (
        <div className="card" style={{ marginTop: 12 }}>
          <div
            className="row"
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <h2>Modifica contatto</h2>
            <Link className="btn" href={buildUrl()}>
              Annulla
            </Link>
          </div>

          <form action={updateContact} className="card" style={{ marginTop: 10 }}>
            <input type="hidden" name="id" value={contactEdit.id} />
            <input type="hidden" name="returnTo" value={returnTo} />

            <div className="grid2">
              <div>
                <label>Ruolo</label>
                <select
                  className="input"
                  name="role"
                  defaultValue={contactEdit.role ?? "ALTRO"}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Liste</label>
                <div className="card" style={{ marginTop: 8, padding: 10 }}>
                  {allLists.map((m) => (
                    <label key={`edit-${m}`} style={{ display: "block" }}>
                      <input
                        type="checkbox"
                        name="marketingLists"
                        value={m}
                        defaultChecked={editLists.includes(m)}
                      />{" "}
                      {m}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid2" style={{ marginTop: 12 }}>
              <input
                name="name"
                defaultValue={contactEdit.name ?? ""}
                className="input"
                placeholder="Nome *"
                required
              />
              <input
                name="email"
                defaultValue={contactEdit.email ?? ""}
                className="input"
                placeholder="Email"
              />
            </div>

            <div className="grid2" style={{ marginTop: 12 }}>
              <input
                name="phone"
                defaultValue={contactEdit.phone ?? ""}
                className="input"
                placeholder="Telefono"
              />
              <input
                name="notes"
                defaultValue={contactEdit.notes ?? ""}
                className="input"
                placeholder="Note"
              />
            </div>

            <button className="btn primary" style={{ marginTop: 10 }} type="submit">
              Salva
            </button>
          </form>
        </div>
      ) : null}

      <div className="card" style={{ marginTop: 12 }}>
        <h2>Lista contatti</h2>

        <div className="muted" style={{ marginTop: 8 }}>
          Totale contatti: <b>{client.contacts.length}</b>
        </div>

        <table className="table" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>Ruolo</th>
              <th>Liste</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefono</th>
              <th style={{ width: 220 }}>Azioni</th>
            </tr>
          </thead>

          <tbody>
            {client.contacts.map((c: any) => (
              <tr key={c.id}>
                <td>{c.role ?? "ALTRO"}</td>
                <td>{parseLists(c.marketingList, c.marketingLists).join(", ") || "ALTRO"}</td>
                <td>{c.name}</td>
                <td>{c.email ?? "—"}</td>
                <td>{c.phone ?? "—"}</td>
                <td>
                  <div className="row" style={{ gap: 8 }}>
                    <Link
                      className="btn"
                      href={buildUrl({ edit: c.id })}
                    >
                      Modifica
                    </Link>

                    <form action={deleteContact}>
                      <input type="hidden" name="id" value={c.id} />
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
                <td colSpan={6}>Nessun contatto</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}