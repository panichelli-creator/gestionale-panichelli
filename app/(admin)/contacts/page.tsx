import Link from "next/link";


export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ContactsPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    role?: string;
    marketingList?: string;
    type?: string;
    service?: string;
  };
}) {
  const { prisma } = await import("@/lib/prisma");
  const q = String(searchParams?.q ?? "").trim();
  const role = String(searchParams?.role ?? "").trim();
  const marketingList = String(searchParams?.marketingList ?? "").trim();
  const type = String(searchParams?.type ?? "").trim();
  const service = String(searchParams?.service ?? "").trim();

  const contacts = await prisma.clientContact.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { name: { contains: q } },
                { email: { contains: q } },
                { phone: { contains: q } },
              ],
            }
          : {},
        role ? { role } : {},
        marketingList ? { marketingList } : {},
        type
          ? {
              client: {
                type,
              },
            }
          : {},
        service
          ? {
              client: {
                services: {
                  some: {
                    service: {
                      name: service,
                    },
                  },
                },
              },
            }
          : {},
      ],
    },
    include: {
      client: true,
    },
    orderBy: [{ marketingList: "asc" }, { role: "asc" }, { name: "asc" }],
  });

  const roles = await prisma.clientContact.findMany({
    select: { role: true },
    distinct: ["role"],
    orderBy: { role: "asc" },
  });

  const marketingLists = await prisma.clientContact.findMany({
    select: { marketingList: true },
    distinct: ["marketingList"],
    orderBy: { marketingList: "asc" },
  });

  const types = await prisma.client.findMany({
    select: { type: true },
    distinct: ["type"],
    orderBy: { type: "asc" },
  });

  const services = await prisma.serviceCatalog.findMany({
    select: { name: true },
    orderBy: { name: "asc" },
  });

  const exportUrl =
    "/api/contacts/export?" +
    new URLSearchParams({
      q,
      role,
      marketingList,
      type,
      service,
    }).toString();

  const exportVoxmailUrl =
    "/api/contacts/export-voxmail?" +
    new URLSearchParams({
      q,
      role,
      marketingList,
      type,
      service,
    }).toString();

  return (
    <div className="card">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <h1>Contatti</h1>

        <div className="muted">
          Totale contatti: <b>{contacts.length}</b>
        </div>
      </div>

      <form
        className="row"
        style={{ marginTop: 12, gap: 8, flexWrap: "wrap" }}
      >
        <input
          className="input"
          placeholder="Cerca nome / email / telefono"
          name="q"
          defaultValue={q}
        />

        <select name="role" className="input" defaultValue={role}>
          <option value="">Ruolo</option>
          {roles.map((r) => (
            <option key={r.role} value={r.role}>
              {r.role}
            </option>
          ))}
        </select>

        <select
          name="marketingList"
          className="input"
          defaultValue={marketingList}
        >
          <option value="">Lista marketing</option>
          {marketingLists
            .filter((m) => m.marketingList)
            .map((m) => (
              <option key={m.marketingList ?? "ALTRO"} value={m.marketingList ?? ""}>
                {m.marketingList}
              </option>
            ))}
        </select>

        <select name="type" className="input" defaultValue={type}>
          <option value="">Tipo struttura</option>
          {types.map((t) => (
            <option key={t.type} value={t.type}>
              {t.type}
            </option>
          ))}
        </select>

        <select name="service" className="input" defaultValue={service}>
          <option value="">Servizio</option>
          {services.map((s) => (
            <option key={s.name} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>

        <button className="btn">Filtra</button>

        <Link href="/contacts" className="btn">
          Reset
        </Link>
      </form>

      <div className="row" style={{ marginTop: 12, gap: 8, flexWrap: "wrap" }}>
        <a className="btn primary" href={exportUrl}>
          Export CSV
        </a>

        <a className="btn" href={exportVoxmailUrl}>
          Export Voxmail
        </a>
      </div>

      {contacts.length ? (
        <table className="table" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Ruolo</th>
              <th>Lista</th>
              <th>Cliente</th>
              <th>Email</th>
              <th>Telefono</th>
              <th>Apri cliente</th>
            </tr>
          </thead>

          <tbody>
            {contacts.map((c) => (
              <tr key={c.id}>
                <td>
                  <b>{c.name}</b>
                </td>

                <td className="muted">{c.role}</td>

                <td className="muted">{(c as any).marketingList ?? "ALTRO"}</td>

                <td>{c.client?.name}</td>

                <td>{c.email ?? "—"}</td>

                <td>{c.phone ?? "—"}</td>

                <td>
                  <Link className="btn" href={`/clients/${c.clientId}`}>
                    Apri
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="muted" style={{ marginTop: 12 }}>
          Nessun contatto trovato
        </div>
      )}
    </div>
  );
}