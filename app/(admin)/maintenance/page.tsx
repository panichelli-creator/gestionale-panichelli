import Link from "next/link";

import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SP = {
  q?: string;
  serviceId?: string;
  from?: string;
  to?: string;
  status?: string;
  priority?: string;
  referente?: string;
};

const STATI = ["TUTTI", "DA_FARE", "SVOLTO", "IN_CORSO", "SOSPESO"] as const;
const PRIORITA = ["TUTTE", "BASSA", "MEDIA", "ALTA"] as const;
const REFERENTI = ["TUTTI", "DE ROSE", "IANNARELLA", "PHSC"] as const;

function startOfTodayLocal() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(base: Date, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function isoDateOnly(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseDateStart(value: string) {
  const v = String(value ?? "").trim();
  if (!v) return null;
  const d = new Date(`${v}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function parseDateEndExclusive(value: string) {
  const start = parseDateStart(value);
  if (!start) return null;
  const d = new Date(start);
  d.setDate(d.getDate() + 1);
  return d;
}

function fmt(d: Date | null | undefined) {
  return d ? new Date(d).toLocaleDateString("it-IT") : "—";
}

function badgeStyle(status: string) {
  const s = String(status ?? "").toUpperCase();

  if (s === "SVOLTO") {
    return {
      background: "rgba(34,197,94,0.12)",
      color: "#166534",
      border: "1px solid rgba(34,197,94,0.30)",
    };
  }

  if (s === "IN_CORSO") {
    return {
      background: "rgba(37,99,235,0.12)",
      color: "#1d4ed8",
      border: "1px solid rgba(37,99,235,0.30)",
    };
  }

  if (s === "SOSPESO") {
    return {
      background: "rgba(245,158,11,0.12)",
      color: "#92400e",
      border: "1px solid rgba(245,158,11,0.30)",
    };
  }

  return {
    background: "rgba(239,68,68,0.10)",
    color: "#b91c1c",
    border: "1px solid rgba(239,68,68,0.30)",
  };
}

function normalizeReferente(value: any) {
  const v = String(value ?? "").trim().toUpperCase();
  return v || "—";
}

function getReferenteLabel(row: any) {
  return normalizeReferente(row?.referenteName);
}

function buildMaintenanceHref(params: {
  q?: string;
  serviceId?: string;
  status?: string;
  priority?: string;
  referente?: string;
  from?: string;
  to?: string;
}) {
  const qs = new URLSearchParams();

  if (params.q) qs.set("q", params.q);
  if (params.serviceId && params.serviceId !== "TUTTI") qs.set("serviceId", params.serviceId);
  if (params.status && params.status !== "TUTTI") qs.set("status", params.status);
  if (params.priority && params.priority !== "TUTTE") qs.set("priority", params.priority);
  if (params.referente && params.referente !== "TUTTI") qs.set("referente", params.referente);
  if (params.from) qs.set("from", params.from);
  if (params.to) qs.set("to", params.to);

  const s = qs.toString();
  return s ? `/maintenance?${s}` : "/maintenance";
}

export default async function MaintenancePage({ searchParams }: { searchParams: SP }) {
  const { prisma } = await import("@/lib/prisma");
  const q = (searchParams.q ?? "").trim();
  const serviceId = (searchParams.serviceId ?? "TUTTI").trim();
  const status = (searchParams.status ?? "TUTTI").trim();
  const priority = (searchParams.priority ?? "TUTTE").trim();
  const referente = (searchParams.referente ?? "TUTTI").trim().toUpperCase();

  const fromRaw = (searchParams.from ?? "").trim();
  const toRaw = (searchParams.to ?? "").trim();

  const fromDate = parseDateStart(fromRaw);
  const toDateExclusive = parseDateEndExclusive(toRaw);

  const where: any = {};

  if (fromDate || toDateExclusive) {
    where.dueDate = {};
    if (fromDate) where.dueDate.gte = fromDate;
    if (toDateExclusive) where.dueDate.lt = toDateExclusive;
  }

  if (status !== "TUTTI") where.status = status;
  if (priority !== "TUTTE") where.priority = priority;
  if (serviceId !== "TUTTI") where.serviceId = serviceId;
  if (referente !== "TUTTI") where.referenteName = referente;

  if (q) {
    where.OR = [
      {
        client: {
          name: {
            contains: q,
          },
        },
      },
      {
        site: {
          name: {
            contains: q,
          },
        },
      },
      {
        service: {
          name: {
            contains: q,
          },
        },
      },
    ];
  }

  const today = startOfTodayLocal();
  const in7 = addDays(today, 7);
  const in30 = addDays(today, 30);

  const href7 = buildMaintenanceHref({
    q,
    serviceId,
    status,
    priority,
    referente,
    from: isoDateOnly(today),
    to: isoDateOnly(in7),
  });

  const href30 = buildMaintenanceHref({
    q,
    serviceId,
    status,
    priority,
    referente,
    from: isoDateOnly(today),
    to: isoDateOnly(in30),
  });

  const hrefExpired = buildMaintenanceHref({
    q,
    serviceId,
    status,
    priority,
    referente,
    to: isoDateOnly(addDays(today, -1)),
  });

  const hrefAll = buildMaintenanceHref({
    q,
    serviceId,
    status,
    priority,
    referente,
  });

  const [catalogRaw, rows, due7Count, due30Count, expiredCount, suggestionClients] =
    await Promise.all([
      prisma.serviceCatalog.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
      }),
      prisma.clientService.findMany({
        where,
        include: { client: true, service: true, site: true },
        orderBy: [{ dueDate: "asc" }, { client: { name: "asc" } }],
        take: 6000,
      }),
      prisma.clientService.count({
        where: {
          ...(referente !== "TUTTI" ? { referenteName: referente } : {}),
          dueDate: { gte: today, lte: in7 },
        },
      }),
      prisma.clientService.count({
        where: {
          ...(referente !== "TUTTI" ? { referenteName: referente } : {}),
          dueDate: { gte: today, lte: in30 },
        },
      }),
      prisma.clientService.count({
        where: {
          ...(referente !== "TUTTI" ? { referenteName: referente } : {}),
          dueDate: { lt: today },
        },
      }),
      prisma.client.findMany({
        where: q
          ? {
              name: {
                contains: q,
              },
            }
          : {},
        select: { name: true },
        orderBy: { name: "asc" },
        take: q ? 8 : 12,
      }),
    ]);

  const seenCatalog = new Set<string>();
  const catalog = catalogRaw.filter((s) => {
    const key = (s.name ?? "").trim().toUpperCase();
    if (!key) return false;
    if (seenCatalog.has(key)) return false;
    seenCatalog.add(key);
    return true;
  });

  const seenRows = new Set<string>();
  const rowsUnique = rows.filter((r: any) => {
    if (seenRows.has(r.id)) return false;
    seenRows.add(r.id);
    return true;
  });

  const suggestionNames = Array.from(
    new Set(
      suggestionClients
        .map((c) => String(c.name ?? "").trim())
        .filter(Boolean)
    )
  );

  return (
    <div className="card">
      <style>{`
        .miniBadge{
          display:inline-flex;
          align-items:center;
          padding:3px 7px;
          border-radius:999px;
          font-size:11px;
          font-weight:800;
          line-height:1;
          white-space:nowrap;
        }

        .searchSuggestions{
          display:flex;
          flex-wrap:wrap;
          gap:8px;
          margin-top:10px;
        }

        .searchSuggestion{
          display:inline-flex;
          align-items:center;
          padding:8px 12px;
          border-radius:12px;
          background:#ffffff;
          color:#1e3a8a;
          border:1px solid rgba(30,58,138,0.18);
          text-decoration:none;
          font-weight:800;
          font-size:13px;
          box-shadow:0 1px 2px rgba(0,0,0,0.04);
        }

        .searchSuggestion:hover{
          background:#eff6ff;
        }

        @media print {
          .no-print { display: none !important; }
          a { color: #000 !important; text-decoration: none !important; }
          .card { box-shadow: none !important; border: none !important; }
        }
      `}</style>

      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Agenda Mantenimenti</h1>

        <div className="row no-print" style={{ gap: 8 }}>
          <PrintButton />
        </div>
      </div>

      <div className="grid4 no-print" style={{ marginTop: 12 }}>
        <Link href={href7} style={{ textDecoration: "none" }}>
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #1E3A8A, #3B82F6)",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            title="Filtra scadenze entro 7 giorni"
          >
            <div style={{ opacity: 0.85, fontWeight: 700 }}>Scadenze entro 7 giorni</div>
            <div style={{ fontSize: 26, fontWeight: 900, marginTop: 8 }}>{due7Count}</div>
            <div style={{ opacity: 0.85, marginTop: 6, fontSize: 13 }}>
              Dal {today.toLocaleDateString("it-IT")} al {in7.toLocaleDateString("it-IT")}
            </div>
          </div>
        </Link>

        <Link href={href30} style={{ textDecoration: "none" }}>
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #92400E, #F59E0B)",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            title="Filtra scadenze entro 30 giorni"
          >
            <div style={{ opacity: 0.85, fontWeight: 700 }}>Scadenze entro 30 giorni</div>
            <div style={{ fontSize: 26, fontWeight: 900, marginTop: 8 }}>{due30Count}</div>
            <div style={{ opacity: 0.85, marginTop: 6, fontSize: 13 }}>
              Dal {today.toLocaleDateString("it-IT")} al {in30.toLocaleDateString("it-IT")}
            </div>
          </div>
        </Link>

        <Link href={hrefExpired} style={{ textDecoration: "none" }}>
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #991B1B, #EF4444)",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            title="Filtra solo gli scaduti"
          >
            <div style={{ opacity: 0.85, fontWeight: 700 }}>Scaduti</div>
            <div style={{ fontSize: 26, fontWeight: 900, marginTop: 8 }}>{expiredCount}</div>
            <div style={{ opacity: 0.85, marginTop: 6, fontSize: 13 }}>
              Scadenza precedente a oggi
            </div>
          </div>
        </Link>

        <Link href={hrefAll} style={{ textDecoration: "none" }}>
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #065F46, #10B981)",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            title="Togli filtro periodo (mantiene gli altri filtri)"
          >
            <div style={{ opacity: 0.85, fontWeight: 700 }}>Risultati con filtri</div>
            <div style={{ fontSize: 26, fontWeight: 900, marginTop: 8 }}>{rowsUnique.length}</div>
            <div style={{ opacity: 0.85, marginTop: 6, fontSize: 13 }}>Click per vedere “tutto”</div>
          </div>
        </Link>
      </div>

      <form method="GET" className="card no-print" style={{ marginTop: 12 }}>
        <div className="grid3">
          <div>
            <label>Cerca cliente</label>
            <input
              className="input"
              name="q"
              defaultValue={q}
              placeholder="Nome cliente, sede o servizio..."
              autoComplete="off"
            />

            {suggestionNames.length > 0 ? (
              <div className="searchSuggestions">
                {suggestionNames.map((name) => (
                  <Link
                    key={name}
                    className="searchSuggestion"
                    href={buildMaintenanceHref({
                      q: name,
                      serviceId,
                      status,
                      priority,
                      referente,
                      from: fromRaw || undefined,
                      to: toRaw || undefined,
                    })}
                  >
                    {name}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <label>Servizio</label>
            <select className="input" name="serviceId" defaultValue={serviceId}>
              <option value="TUTTI">Tutti</option>
              {catalog.map((s) => (
                <option key={s.id} value={s.id}>
                  {(s.name ?? "").toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Referente</label>
            <select className="input" name="referente" defaultValue={referente}>
              {REFERENTI.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid3" style={{ marginTop: 12 }}>
          <div>
            <label>Periodo DAL / AL</label>
            <div className="row" style={{ gap: 8 }}>
              <input type="date" className="input" name="from" defaultValue={fromRaw} />
              <input type="date" className="input" name="to" defaultValue={toRaw} />
            </div>
          </div>

          <div>
            <label>Stato</label>
            <select className="input" name="status" defaultValue={status}>
              {STATI.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Priorità</label>
            <select className="input" name="priority" defaultValue={priority}>
              {PRIORITA.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row" style={{ alignItems: "end", gap: 8, marginTop: 12 }}>
          <button className="btn primary" type="submit">
            Applica
          </button>

          <Link className="btn" href="/maintenance">
            Reset
          </Link>
        </div>
      </form>

      <div className="muted" style={{ marginTop: 10 }}>
        Risultati: <b>{rowsUnique.length}</b>
      </div>

      <table className="table" style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th>Scadenza</th>
            <th>Cliente</th>
            <th>Servizio</th>
            <th>Sede</th>
            <th>Referente</th>
            <th>Ultimo svolto</th>
            <th>Stato</th>
            <th>Priorità</th>
            <th>Prezzo</th>
            <th>RX End</th>
            <th>RX OPT</th>
            <th>Note</th>
          </tr>
        </thead>

        <tbody>
          {rowsUnique.map((r: any) => (
            <tr key={r.id}>
              <td>{fmt(r.dueDate)}</td>

              <td>
                <Link href={`/clients/${r.clientId}`}>{r.client?.name ?? ""}</Link>
              </td>

              <td>
                <Link href={`/clients/${r.clientId}/services/${r.id}/edit`}>
                  {r.service?.name ?? ""}
                </Link>
              </td>

              <td>{r.site?.name ?? "—"}</td>
              <td>
                <b>{getReferenteLabel(r)}</b>
              </td>
              <td>{fmt(r.lastDoneAt)}</td>

              <td>
                <span className="miniBadge" style={badgeStyle(r.status)}>
                  {r.status}
                </span>
              </td>

              <td>{r.priority}</td>
              <td>{r.priceEur ? `${r.priceEur} €` : ""}</td>
              <td>{r.rxEndoralCount ?? "—"}</td>
              <td>{r.rxOptCount ?? "—"}</td>
              <td style={{ maxWidth: 320, whiteSpace: "normal", wordBreak: "break-word" }}>
                {r.notes ?? ""}
              </td>
            </tr>
          ))}

          {rowsUnique.length === 0 && (
            <tr>
              <td colSpan={12} className="muted">
                Nessun risultato con i filtri selezionati.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}