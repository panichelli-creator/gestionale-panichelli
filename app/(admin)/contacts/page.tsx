import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SP = {
  q?: string;
  marketingList?: string;
};

function normalizeText(value: any) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function splitMarketingLists(...values: any[]) {
  const out: string[] = [];
  const seen = new Set<string>();

  for (const value of values) {
    if (value == null) continue;

    if (Array.isArray(value)) {
      for (const item of value) {
        const v = String(item ?? "").trim().toUpperCase();
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
            const v = String(item ?? "").trim().toUpperCase();
            if (!v || seen.has(v)) continue;
            seen.add(v);
            out.push(v);
          }
          continue;
        }
      } catch {}
    }

    for (const part of raw.split(",")) {
      const v = String(part ?? "").trim().toUpperCase();
      if (!v || seen.has(v)) continue;
      seen.add(v);
      out.push(v);
    }
  }

  return out;
}

export default async function ContactsPage({
  searchParams,
}: {
  searchParams?: SP | Promise<SP>;
}) {
  const { prisma } = await import("@/lib/prisma");

  const resolvedSearchParams =
    searchParams && typeof (searchParams as Promise<SP>).then === "function"
      ? await (searchParams as Promise<SP>)
      : ((searchParams as SP | undefined) ?? {});

  const q = String(resolvedSearchParams?.q ?? "").trim();
  const qNorm = normalizeText(q);
  const marketingList = String(resolvedSearchParams?.marketingList ?? "")
    .trim()
    .toUpperCase();

  const allContacts = await prisma.clientContact.findMany({
    include: {
      client: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const contacts = allContacts.filter((c: any) => {
    const haystack = normalizeText(
      [
        c?.name,
        c?.email,
        c?.phone,
        c?.role,
        c?.notes,
        c?.client?.name,
      ]
        .filter(Boolean)
        .join(" ")
    );

    const matchesQ = !qNorm || haystack.includes(qNorm);

    const lists = splitMarketingLists(c?.marketingList);
    const matchesList = !marketingList || lists.includes(marketingList);

    return matchesQ && matchesList;
  });

  const uniqueLists: string[] = [];
  const seen = new Set<string>();

  for (const row of allContacts as any[]) {
    const lists = splitMarketingLists(row?.marketingList);

    for (const value of lists) {
      if (!value || seen.has(value)) continue;
      seen.add(value);
      uniqueLists.push(value);
    }
  }

  uniqueLists.sort((a, b) => a.localeCompare(b, "it"));

  const exportUrl =
    "/api/contacts/export?" +
    new URLSearchParams({
      q,
      marketingList,
    }).toString();

  const exportVoxmailUrl =
    "/api/contacts/export-voxmail?" +
    new URLSearchParams({
      q,
      marketingList,
    }).toString();

  return (
    <div className="card">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}
      >
        <h1>Contatti</h1>

        <div className="muted">
          Totale contatti: <b>{contacts.length}</b>
        </div>
      </div>

      <form
        method="GET"
        className="row"
        style={{ gap: 8, marginTop: 12, flexWrap: "wrap" }}
      >
        <input
          name="q"
          className="input"
          placeholder="Cerca nome / email / telefono / cliente / ruolo"
          defaultValue={q}
        />

        <select
          name="marketingList"
          className="input"
          defaultValue={marketingList}
        >
          <option value="">Lista marketing</option>
          {uniqueLists.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <button className="btn" type="submit">
          Cerca
        </button>

        <Link href="/contacts" className="btn">
          Reset
        </Link>
      </form>

      <div
        className="row"
        style={{ marginTop: 12, gap: 8, flexWrap: "wrap" }}
      >
        <a className="btn primary" href={exportUrl}>
          Export CSV
        </a>

        <a className="btn" href={exportVoxmailUrl}>
          Export Voxmail
        </a>
      </div>

      <table className="table" style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Ruolo</th>
            <th>Liste</th>
            <th>Cliente</th>
            <th>Email</th>
            <th>Telefono</th>
            <th>Apri cliente</th>
          </tr>
        </thead>

        <tbody>
          {contacts.map((c: any) => {
            const lists = splitMarketingLists(c?.marketingList).join(", ");

            return (
              <tr key={c.id}>
                <td>
                  <b>{c.name ?? "—"}</b>
                </td>
                <td>{c.role ?? "ALTRO"}</td>
                <td>{lists || "ALTRO"}</td>
                <td>{c.client?.name ?? "—"}</td>
                <td>{c.email ?? "—"}</td>
                <td>{c.phone ?? "—"}</td>
                <td>
                  {c.clientId ? (
                    <Link className="btn" href={`/clients/${c.clientId}`}>
                      Apri
                    </Link>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            );
          })}

          {contacts.length === 0 ? (
            <tr>
              <td colSpan={7}>Nessun risultato</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}