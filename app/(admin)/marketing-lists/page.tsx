import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SP = {
  err?: string;
  ok?: string;
  q?: string;
};

function normalize(v: string) {
  return String(v ?? "").trim().toUpperCase();
}

function normalizeSearch(v: string) {
  return String(v ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function slugify(v: string) {
  return normalize(v)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-")
    .toLowerCase();
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

export default async function MarketingListsPage({
  searchParams,
}: {
  searchParams?: SP | Promise<SP>;
}) {
  const { prisma } = await import("@/lib/prisma");

  const resolvedSearchParams =
    searchParams && typeof (searchParams as Promise<SP>).then === "function"
      ? await (searchParams as Promise<SP>)
      : ((searchParams as SP | undefined) ?? {});

  const qRaw = String(resolvedSearchParams?.q ?? "").trim();
  const qNorm = normalizeSearch(qRaw);

  const [listsDb, contacts] = await Promise.all([
    prisma.marketingList.findMany({
      where: { isActive: true },
      orderBy: [{ isSystem: "desc" }, { name: "asc" }],
    }),
    prisma.clientContact.findMany({
      select: {
        id: true,
        name: true,
        marketingList: true,
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const listMap = new Map<
    string,
    {
      id: string;
      name: string;
      slug: string;
      isSystem: boolean;
      isActive: boolean;
      contactsCount: number;
    }
  >();

  for (const list of listsDb) {
    const key = normalize(list.name);
    if (!key) continue;

    listMap.set(key, {
      id: list.id,
      name: key,
      slug: list.slug,
      isSystem: list.isSystem,
      isActive: list.isActive,
      contactsCount: 0,
    });
  }

  for (const contact of contacts as any[]) {
    const names = parseLists(contact?.marketingList);
    for (const listName of names) {
      if (!listMap.has(listName)) {
        listMap.set(listName, {
          id: `derived_${listName}`,
          name: listName,
          slug: slugify(listName),
          isSystem: false,
          isActive: true,
          contactsCount: 0,
        });
      }
      listMap.get(listName)!.contactsCount += 1;
    }
  }

  const lists = Array.from(listMap.values())
    .filter((row) => {
      if (!qNorm) return true;
      return normalizeSearch(row.name).includes(qNorm);
    })
    .sort((a, b) => {
      if (a.isSystem !== b.isSystem) return a.isSystem ? -1 : 1;
      return a.name.localeCompare(b.name, "it");
    });

  async function createList(formData: FormData) {
    "use server";

    const { prisma } = await import("@/lib/prisma");

    const rawName = String(formData.get("name") ?? "");
    const name = normalize(rawName);
    const slug = slugify(rawName);

    if (!name || !slug) {
      redirect("/marketing-lists?err=Nome lista obbligatorio");
    }

    const existing = await prisma.marketingList.findFirst({
      where: {
        OR: [{ name }, { slug }],
      },
      select: { id: true, name: true },
    });

    if (existing) {
      redirect(
        `/marketing-lists?ok=${encodeURIComponent(
          `Lista già presente: ${existing.name}`
        )}`
      );
    }

    await prisma.marketingList.create({
      data: {
        name,
        slug,
        isSystem: false,
        isActive: true,
      },
    });

    redirect(
      `/marketing-lists?ok=${encodeURIComponent(`Lista creata: ${name}`)}`
    );
  }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
        <h1>Liste Marketing</h1>

        <Link className="btn" href="/contacts">
          Apri Contatti
        </Link>
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
        <h2>Crea nuova lista</h2>

        <form
          action={createList}
          className="row"
          style={{ gap: 8, marginTop: 10, flexWrap: "wrap" }}
        >
          <input
            className="input"
            name="name"
            placeholder="es: ODONTOIATRI ESTETICI"
          />
          <button className="btn primary" type="submit">
            Crea
          </button>
        </form>

        <div className="muted" style={{ marginTop: 6 }}>
          La lista viene salvata nel database.
        </div>
      </div>

      <form method="GET" className="card" style={{ marginTop: 12 }}>
        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
          <input
            className="input"
            name="q"
            placeholder="Cerca lista marketing..."
            defaultValue={qRaw}
          />
          <button className="btn" type="submit">
            Cerca
          </button>
          <Link className="btn" href="/marketing-lists">
            Reset
          </Link>
        </div>
      </form>

      <div className="muted" style={{ marginTop: 10 }}>
        Liste trovate: <b>{lists.length}</b>
      </div>

      <table className="table" style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th>Lista</th>
            <th>Tipo</th>
            <th>Contatti</th>
            <th>Apri contatti</th>
            <th>Export Voxmail</th>
          </tr>
        </thead>

        <tbody>
          {lists.map((list) => (
            <tr key={list.id}>
              <td>
                <b>{list.name}</b>
              </td>

              <td>{list.isSystem ? "Sistema" : "Custom"}</td>

              <td>{list.contactsCount}</td>

              <td>
                <Link
                  className="btn"
                  href={`/contacts?marketingList=${encodeURIComponent(list.name)}`}
                >
                  Apri
                </Link>
              </td>

              <td>
                <a
                  className="btn primary"
                  href={`/api/contacts/export-voxmail?marketingList=${encodeURIComponent(list.name)}`}
                >
                  Export Voxmail
                </a>
              </td>
            </tr>
          ))}

          {lists.length === 0 ? (
            <tr>
              <td colSpan={5} className="muted">
                Nessuna lista presente.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}