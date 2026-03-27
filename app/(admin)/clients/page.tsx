export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { getSession } from "@/lib/session";

type SP = {
  q?: string;
  type?: string;
  status?: string;
  page?: string;
  take?: string;
  sort?: string;
  dir?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function toInt(v: any, fallback: number) {
  const n = Number(String(v ?? "").trim());
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

function normDir(v: any) {
  const s = String(v ?? "").toLowerCase();
  return s === "desc" ? "desc" : "asc";
}

type SortKey = "name" | "type" | "status";
function normSort(v: any): SortKey {
  const s = String(v ?? "").toLowerCase();
  if (s === "type") return "type";
  if (s === "status") return "status";
  return "name";
}

function renderSitesCell(
  clientId: string,
  sites: { id: string; name: string }[],
  operativeSeat?: string | null
) {
  const n = sites.length;
  const goSites = `/clients/${clientId}/sites`;

  const op = String(operativeSeat ?? "").trim();
  if (n === 0) {
    if (op) {
      return (
        <span title="Sede operativa (da scheda cliente)" className="seat-fallback">
          {op}
        </span>
      );
    }
    return <span className="muted">—</span>;
  }

  if (n === 1) {
    return (
      <Link className="btn-site" href={goSites} title="Apri sedi">
        {sites[0].name}
      </Link>
    );
  }

  if (n === 2) {
    return (
      <Link className="btn-site" href={goSites} title="Apri sedi">
        {sites[0].name}, {sites[1].name}
      </Link>
    );
  }

  return (
    <Link className="btn-site" href={goSites} title={sites.map((s) => s.name).join(", ")}>
      🏢 {n} sedi
    </Link>
  );
}

export default async function ClientsPage({ searchParams }: { searchParams: SP }) {
  const { prisma } = await import("@/lib/prisma");
  const session = getSession();
  const isIngegnereClinico = session?.role === "ingegnere_clinico";

  const q = (searchParams.q ?? "").trim();
  const type = (searchParams.type ?? "TUTTE").trim();
  const status = (searchParams.status ?? "ATTIVO").trim();

  const page = clamp(toInt(searchParams.page, 1), 1, 9999);
  const take = clamp(toInt(searchParams.take, 50), 10, 200);

  const sort: SortKey = normSort(searchParams.sort);
  const dir = normDir(searchParams.dir);

  const where: any = {};
  if (q) where.name = { contains: q };
  if (type !== "TUTTE") where.type = type;
  if (status !== "TUTTI") where.status = status;

  const total = await prisma.client.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / take));
  const safePage = clamp(page, 1, totalPages);
  const skip = (safePage - 1) * take;

  const orderBy: any = { [sort]: dir };

  const clients = await prisma.client.findMany({
    where,
    include: {
      contacts: true,
      sites: { select: { id: true, name: true }, orderBy: { name: "asc" } },
    },
    orderBy,
    skip,
    take,
  });

  const types = [
    "STUDIO_ODONTOIATRICO",
    "STUDIO_ODONT_447",
    "AMBULATORIO_ODONTOIATRICO",
    "STUDIO_FISIOTERAPICO",
    "AMBULATORIO_FKT",
    "STUDIO",
    "AMBULATORIO",
    "POLIAMBULATORIO",
    "ALTRO",
  ];

  const qsBase = new URLSearchParams();
  if (q) qsBase.set("q", q);
  if (type && type !== "TUTTE") qsBase.set("type", type);
  if (status && status !== "TUTTI") qsBase.set("status", status);
  qsBase.set("take", String(take));
  qsBase.set("sort", sort);
  qsBase.set("dir", dir);

  function pageHref(p: number) {
    const qs = new URLSearchParams(qsBase);
    qs.set("page", String(p));
    return `/clients?${qs.toString()}`;
  }

  function sortHref(nextSort: SortKey) {
    const qs = new URLSearchParams(qsBase);
    const nextDir = nextSort === sort ? (dir === "asc" ? "desc" : "asc") : "asc";
    qs.set("sort", nextSort);
    qs.set("dir", nextDir);
    qs.set("page", "1");
    return `/clients?${qs.toString()}`;
  }

  function sortIcon(col: SortKey) {
    if (sort !== col) return <span style={{ opacity: 0.5 }}>↕</span>;
    return dir === "asc" ? <span>▲</span> : <span>▼</span>;
  }

  function ThSortable({ col, label }: { col: SortKey; label: string }) {
    return (
      <th>
        <Link
          href={sortHref(col)}
          style={{
            textDecoration: "none",
            color: "inherit",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontWeight: 900,
          }}
          title={`Ordina per ${label}`}
        >
          {label} {sortIcon(col)}
        </Link>
      </th>
    );
  }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Clienti</h1>
        {!isIngegnereClinico ? (
          <Link className="btn primary" href="/clients/new">
            + Aggiungi cliente
          </Link>
        ) : (
          <div className="muted">Accesso in sola consultazione</div>
        )}
      </div>

      <form method="GET" className="card" style={{ marginTop: 12 }}>
        <div className="grid3">
          <div>
            <label>Cerca cliente</label>
            <input className="input" name="q" defaultValue={q} placeholder="Scrivi nome cliente..." />
          </div>

          <div>
            <label>Tipologia</label>
            <select className="input" name="type" defaultValue={type}>
              <option value="TUTTE">Tutte</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Stato</label>
            <select className="input" name="status" defaultValue={status}>
              <option value="ATTIVO">ATTIVO</option>
              <option value="DISMESSO">DISMESSO</option>
              <option value="TUTTI">Tutti</option>
            </select>
          </div>
        </div>

        <input type="hidden" name="sort" value={sort} />
        <input type="hidden" name="dir" value={dir} />
        <input type="hidden" name="page" value="1" />

        <div className="row" style={{ marginTop: 12, justifyContent: "space-between", flexWrap: "wrap" }}>
          <div className="row">
            <button className="btn primary" type="submit">
              Applica
            </button>
            <Link className="btn" href="/clients">
              Reset
            </Link>
          </div>

          <div className="row" style={{ alignItems: "center" }}>
            <label style={{ margin: 0 }}>Righe</label>
            <select className="input" name="take" defaultValue={String(take)} style={{ width: 110 }}>
              {[25, 50, 100, 150, 200].map((n) => (
                <option key={n} value={String(n)}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>

      <div
        className="row"
        style={{
          marginTop: 10,
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div className="muted">
          Risultati: <b>{total}</b> • Pagina <b>{safePage}</b> / <b>{totalPages}</b> • Righe:{" "}
          <b>{take}</b> • Ordine: <b>{sort}</b> <b>{dir}</b>
        </div>

        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href={pageHref(1)}>
            {"<<"}
          </Link>
          <Link className="btn" href={pageHref(Math.max(1, safePage - 1))}>
            {"<"}
          </Link>
          <Link className="btn" href={pageHref(Math.min(totalPages, safePage + 1))}>
            {">"}
          </Link>
          <Link className="btn" href={pageHref(totalPages)}>
            {">>"}
          </Link>
        </div>
      </div>

      <table className="table" style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <ThSortable col="name" label="Nome" />
            <ThSortable col="type" label="Tipologia" />
            <th>Referente (tipo)</th>
            <th>Referente</th>
            <th>Sedi</th>
            <th>Email</th>
            <th>Telefono</th>
            <th>P.IVA</th>
            <th>PEC</th>
            <th>Cod. Univoco</th>
            <th className="col-notes">Note</th>
          </tr>
          <tr>
            <th colSpan={11} style={{ paddingTop: 0 }}>
              <div className="muted" style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span>Ordina anche per:</span>
                <Link
                  href={sortHref("status")}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontWeight: 900,
                  }}
                >
                  Stato {sortIcon("status")}
                </Link>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {clients.map((c) => {
            const ref = c.contacts?.[0] ?? null;

            return (
              <tr key={c.id}>
                <td>
                  {isIngegnereClinico ? (
                    <span>{c.name}</span>
                  ) : (
                    <Link href={`/clients/${c.id}`}>{c.name}</Link>
                  )}
                </td>
                <td>{c.type}</td>
                <td>{ref?.role ?? ""}</td>
                <td>{ref?.name ?? ""}</td>
                <td>{renderSitesCell(c.id, c.sites, c.operativeSeat)}</td>
                <td>{c.email ?? ""}</td>
                <td>{c.phone ?? ""}</td>
                <td>{c.vatNumber ?? ""}</td>
                <td>{c.pec ?? ""}</td>
                <td>{c.uniqueCode ?? ""}</td>
                <td className="col-notes">{c.notes ?? ""}</td>
              </tr>
            );
          })}

          {clients.length === 0 ? (
            <tr>
              <td colSpan={11} className="muted">
                Nessun cliente.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>

      <style>{`
        .col-notes {
          width: 320px;
          max-width: 320px;
          white-space: normal;
          word-break: break-word;
          overflow-wrap: anywhere;
        }
        .table td, .table th { vertical-align: top; }

        .btn-site{
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 999px;
          text-decoration: none;
          color: inherit;
          background: rgba(0,0,0,0.03);
          font-weight: 700;
          line-height: 1.2;
          max-width: 260px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .btn-site:hover{
          background: rgba(0,0,0,0.06);
        }

        .seat-fallback{
          display: inline-block;
          max-width: 260px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 4px 8px;
          border-radius: 999px;
          border: 1px dashed rgba(0,0,0,0.18);
          background: rgba(0,0,0,0.02);
          color: rgba(0,0,0,0.75);
          font-weight: 650;
        }
      `}</style>
    </div>
  );
}