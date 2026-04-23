import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import { markBilledMonthly, markWorkedMonthly } from "@/app/actions/monthly-work";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SP = {
  ym?: string;
  serviceId?: string;
  siteId?: string;
  q?: string;
  from?: string;
  to?: string;
};

function firstDayOfMonth(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1));
}

function firstDayNextMonth(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, m, 1));
}

function fmt(d: Date | null) {
  return d ? new Date(d).toLocaleDateString("it-IT") : "—";
}

function getReferenteLabel(row: any) {
  const referente = String(row?.referenteName ?? "").trim();
  if (!referente) return "PHSC";
  return referente;
}

function getTelefono(row: any) {
  const direct = String(row?.client?.phone ?? "").trim();
  if (direct) return direct;

  const contacts = Array.isArray(row?.client?.contacts) ? row.client.contacts : [];
  const preferred =
    contacts.find((c: any) => {
      const role = String(c?.role ?? "").toUpperCase();
      return (
        role.includes("REFERENTE") ||
        role.includes("TITOLARE") ||
        role.includes("SEGRETERIA") ||
        role.includes("AMMINISTRAZIONE")
      );
    }) ?? contacts.find((c: any) => String(c?.phone ?? "").trim());

  return String(preferred?.phone ?? "").trim() || "—";
}

function getSiteLabel(row: any) {
  return String(row?.site?.name ?? "").trim() || "—";
}

export default async function MonthlyWorkPage({
  searchParams,
}: {
  searchParams?: SP | Promise<SP>;
}) {
  const { prisma } = await import("@/lib/prisma");

  const resolvedSearchParams =
    searchParams && typeof (searchParams as Promise<SP>).then === "function"
      ? await (searchParams as Promise<SP>)
      : ((searchParams as SP | undefined) ?? {});

  const now = new Date();
  const defaultYm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const ym = (resolvedSearchParams.ym ?? defaultYm).trim();

  const serviceId = (resolvedSearchParams.serviceId ?? "TUTTI").trim();
  const siteId = (resolvedSearchParams.siteId ?? "TUTTE").trim();
  const q = (resolvedSearchParams.q ?? "").trim();

  const from = firstDayOfMonth(ym);
  const to = firstDayNextMonth(ym);

  const filterFromRaw = (resolvedSearchParams.from ?? "").trim();
  const filterToRaw = (resolvedSearchParams.to ?? "").trim();

  const filterFrom = filterFromRaw ? new Date(`${filterFromRaw}T00:00:00`) : null;
  const filterTo = filterToRaw ? new Date(`${filterToRaw}T23:59:59.999`) : null;

  const servicesRaw = await prisma.serviceCatalog.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  const seen = new Set<string>();
  const services = servicesRaw.filter((s) => {
    const key = (s.name ?? "").trim().toUpperCase();
    if (!key) return false;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const sites = await prisma.clientSite.findMany({
    orderBy: [{ client: { name: "asc" } }, { name: "asc" }],
    include: { client: true },
  });

  const where: any = {
    OR: [
      {
        dueDate: { lt: to },
        status: { notIn: ["SVOLTO", "FATTURATO"] },
      },
      {
        status: "SVOLTO",
        lastDoneAt: { gte: from, lt: to },
      },
      {
        status: "FATTURATO",
        lastDoneAt: { gte: from, lt: to },
      },
    ],
  };

  if (serviceId !== "TUTTI") where.serviceId = serviceId;
  if (siteId !== "TUTTE") where.siteId = siteId;

  if (q) {
    where.AND = [
      ...(where.AND ?? []),
      {
        OR: [
          { client: { name: { contains: q } } },
          { service: { name: { contains: q } } },
          { referenteName: { contains: q } },
          { site: { name: { contains: q } } },
        ],
      },
    ];
  }

  if (filterFrom || filterTo) {
    where.AND = [
      ...(where.AND ?? []),
      {
        OR: [
          {
            dueDate: {
              ...(filterFrom ? { gte: filterFrom } : {}),
              ...(filterTo ? { lte: filterTo } : {}),
            },
          },
          {
            lastDoneAt: {
              ...(filterFrom ? { gte: filterFrom } : {}),
              ...(filterTo ? { lte: filterTo } : {}),
            },
          },
        ],
      },
    ];
  }

  const today = new Date();
  const startToday = new Date();
  startToday.setHours(0, 0, 0, 0);

  const in7 = new Date(startToday);
  in7.setDate(in7.getDate() + 7);

  const in30 = new Date(startToday);
  in30.setDate(in30.getDate() + 30);

  const baseQS = new URLSearchParams();
  if (q) baseQS.set("q", q);
  if (serviceId && serviceId !== "TUTTI") baseQS.set("serviceId", serviceId);
  if (siteId && siteId !== "TUTTE") baseQS.set("siteId", siteId);

  const href7 = (() => {
    const qs = new URLSearchParams(baseQS);
    qs.set("from", startToday.toISOString().slice(0, 10));
    qs.set("to", in7.toISOString().slice(0, 10));
    return `/monthly-work?${qs.toString()}`;
  })();

  const href30 = (() => {
    const qs = new URLSearchParams(baseQS);
    qs.set("from", startToday.toISOString().slice(0, 10));
    qs.set("to", in30.toISOString().slice(0, 10));
    return `/monthly-work?${qs.toString()}`;
  })();

  const hrefAll = (() => {
    const qs = new URLSearchParams(baseQS);
    qs.set("ym", ym);
    return `/monthly-work?${qs.toString()}`;
  })();

  const [rows, due7Count, due30Count] = await Promise.all([
    prisma.clientService.findMany({
      where,
      include: {
        client: {
          include: {
            contacts: {
              select: {
                name: true,
                phone: true,
                role: true,
              },
              orderBy: [{ role: "asc" }, { name: "asc" }],
            },
          },
        },
        service: true,
        site: true,
      },
      orderBy: [
        { status: "asc" },
        { lastDoneAt: "desc" },
        { dueDate: "asc" },
        { client: { name: "asc" } },
      ],
      take: 5000,
    }),
    prisma.clientService.count({
      where: {
        dueDate: { gte: startToday, lte: in7 },
        status: { notIn: ["SVOLTO", "FATTURATO"] },
      },
    }),
    prisma.clientService.count({
      where: {
        dueDate: { gte: startToday, lte: in30 },
        status: { notIn: ["SVOLTO", "FATTURATO"] },
      },
    }),
  ]);

  const seenRows = new Set<string>();
  const rowsUnique = rows.filter((r: any) => {
    if (seenRows.has(r.id)) return false;
    seenRows.add(r.id);
    return true;
  });

  const overdueCount = rowsUnique.filter(
    (r: any) =>
      r.status !== "SVOLTO" &&
      r.status !== "FATTURATO" &&
      r.dueDate &&
      new Date(r.dueDate) < from
  ).length;

  const redirectPath = `/monthly-work?ym=${encodeURIComponent(ym)}&serviceId=${encodeURIComponent(
    serviceId
  )}&siteId=${encodeURIComponent(siteId)}${q ? `&q=${encodeURIComponent(q)}` : ""}${
    filterFromRaw ? `&from=${encodeURIComponent(filterFromRaw)}` : ""
  }${filterToRaw ? `&to=${encodeURIComponent(filterToRaw)}` : ""}`;

  return (
    <div className="card">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .card { box-shadow: none !important; border: none !important; }
          a { text-decoration: none !important; color: #000 !important; }
          .print-header { display: block !important; margin-bottom: 20px; }
        }

        .print-header { display: none; }

        .late { color: #d32f2f; font-weight: 800; }
        .priority-high { color: #ff6b00; font-weight: 800; }

        .tag {
          font-size: 12px;
          padding: 2px 8px;
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 999px;
        }

        .row-done {
          background: rgba(34, 197, 94, 0.16);
          border-top: 1px solid rgba(34, 197, 94, 0.30);
          border-bottom: 1px solid rgba(34, 197, 94, 0.30);
        }

        .row-billed {
          background: rgba(168, 85, 247, 0.14);
          border-top: 1px solid rgba(168, 85, 247, 0.28);
          border-bottom: 1px solid rgba(168, 85, 247, 0.28);
        }

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

        .monthlyTable th,
        .monthlyTable td{
          font-size:12px;
          vertical-align:top;
        }
      `}</style>

      <div className="print-header">
        <h2>Panichelli HSC SRLS</h2>
        <div>Lavori mensili – {ym}</div>
        <div>Stampato il: {new Date().toLocaleDateString("it-IT")}</div>
        <hr />
      </div>

      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Lavori mensili</h1>

        <div className="row no-print" style={{ gap: 8 }}>
          <PrintButton />
          <Link className="btn" href="/clients">
            Clienti
          </Link>
          <Link className="btn" href="/work-report">
            Report lavori svolti
          </Link>
        </div>
      </div>

      <div className="grid3 no-print" style={{ marginTop: 12 }}>
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
              Dal {startToday.toLocaleDateString("it-IT")} al {in7.toLocaleDateString("it-IT")}
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
              Dal {startToday.toLocaleDateString("it-IT")} al {in30.toLocaleDateString("it-IT")}
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
            <label>Mese</label>
            <input className="input" type="month" name="ym" defaultValue={ym} />
          </div>

          <div>
            <label>Servizio</label>
            <select className="input" name="serviceId" defaultValue={serviceId}>
              <option value="TUTTI">Tutti</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {(s.name ?? "").toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Sede</label>
            <select className="input" name="siteId" defaultValue={siteId}>
              <option value="TUTTE">Tutte</option>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.client.name} — {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid3" style={{ marginTop: 10 }}>
          <div>
            <label>Cerca cliente / servizio / referente</label>
            <input
              className="input"
              name="q"
              defaultValue={q}
              placeholder="Es. De Rose / RX / Marco..."
            />
          </div>

          <div>
            <label>Dal</label>
            <input className="input" type="date" name="from" defaultValue={filterFromRaw} />
          </div>

          <div>
            <label>Al</label>
            <input className="input" type="date" name="to" defaultValue={filterToRaw} />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "end", gap: 8, marginTop: 10 }}>
          <button className="btn primary" type="submit">
            Applica
          </button>
          <Link className="btn" href="/monthly-work">
            Reset
          </Link>
        </div>

        <div className="muted" style={{ marginTop: 10 }}>
          Include scaduti precedenti e anche i servizi segnati come svolti o fatturati nel mese selezionato.
        </div>
      </form>

      <div
        className="row"
        style={{ marginTop: 10, justifyContent: "space-between", alignItems: "center" }}
      >
        <div className="muted">
          Totale lavori: <b>{rowsUnique.length}</b>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <div className="tag">
            Scaduti precedenti: <b>{overdueCount}</b>
          </div>
        </div>
      </div>

      <table className="table monthlyTable" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>Scadenza</th>
            <th>Cliente</th>
            <th>Sede</th>
            <th>Telefono</th>
            <th>Referente</th>
            <th>Servizio</th>
            <th>Ultimo svolto</th>
            <th>Stato</th>
            <th>Priorità</th>
            <th>Prezzo</th>
            <th>RX End</th>
            <th>RX OPT</th>
            <th>Note</th>
            <th className="no-print">Svolto</th>
            <th className="no-print">Da fatturare</th>
          </tr>
        </thead>

        <tbody>
          {rowsUnique.map((r: any) => {
            const due = r.dueDate ? new Date(r.dueDate) : null;
            const isOverdue =
              !!due &&
              r.status !== "SVOLTO" &&
              r.status !== "FATTURATO" &&
              due < from;
            const isLateToday =
              !!due &&
              r.status !== "SVOLTO" &&
              r.status !== "FATTURATO" &&
              due < today;
            const isHigh = r.priority === "ALTA";
            const isDone = r.status === "SVOLTO";
            const isBilled = r.status === "FATTURATO";

            return (
              <tr
                key={r.id}
                className={isBilled ? "row-billed" : isDone ? "row-done" : ""}
              >
                <td className={isLateToday ? "late" : ""}>
                  {fmt(r.dueDate)}
                  {isOverdue ? (
                    <span className="tag" style={{ marginLeft: 8, borderColor: "#d32f2f" }}>
                      SCADUTO
                    </span>
                  ) : null}
                </td>

                <td>
                  <Link href={`/clients/${r.clientId}`}>{r.client?.name ?? ""}</Link>
                </td>

                <td>{getSiteLabel(r)}</td>
                <td>{getTelefono(r)}</td>
                <td>
                  <b>{getReferenteLabel(r)}</b>
                </td>

                <td className={isHigh ? "priority-high" : ""}>
                  <Link href={`/clients/${r.clientId}/services/${r.id}/edit`}>
                    {r.service?.name ?? ""}
                  </Link>
                </td>

                <td>{fmt(r.lastDoneAt)}</td>

                <td>
                  <span
                    className="miniBadge"
                    style={
                      isBilled
                        ? {
                            background: "rgba(168,85,247,0.14)",
                            color: "#6d28d9",
                            border: "1px solid rgba(168,85,247,0.32)",
                          }
                        : isDone
                        ? {
                            background: "rgba(34,197,94,0.12)",
                            color: "#166534",
                            border: "1px solid rgba(34,197,94,0.30)",
                          }
                        : {
                            background: "rgba(239,68,68,0.10)",
                            color: "#b91c1c",
                            border: "1px solid rgba(239,68,68,0.30)",
                          }
                    }
                  >
                    {r.status}
                  </span>
                </td>

                <td className={isHigh ? "priority-high" : ""}>{r.priority}</td>
                <td>{r.priceEur ? `${r.priceEur} €` : ""}</td>
                <td>{r.rxEndoralCount ?? "—"}</td>
                <td>{r.rxOptCount ?? "—"}</td>
                <td style={{ maxWidth: 320, whiteSpace: "normal", wordBreak: "break-word" }}>
                  {r.notes ?? ""}
                </td>

                <td className="no-print">
                  {isBilled ? (
                    <span
                      className="miniBadge"
                      style={{
                        background: "rgba(168,85,247,0.14)",
                        color: "#6d28d9",
                        border: "1px solid rgba(168,85,247,0.32)",
                      }}
                    >
                      GIÀ FATTURATO
                    </span>
                  ) : isDone ? (
                    <span
                      className="miniBadge"
                      style={{
                        background: "rgba(34,197,94,0.12)",
                        color: "#166534",
                        border: "1px solid rgba(34,197,94,0.30)",
                      }}
                    >
                      GIÀ SVOLTO
                    </span>
                  ) : (
                    <form action={markWorkedMonthly}>
                      <input type="hidden" name="clientServiceId" value={r.id} />
                      <input type="hidden" name="redirectPath" value={redirectPath} />
                      <button className="btn" type="submit">
                        SVOLTO
                      </button>
                    </form>
                  )}
                </td>

                <td className="no-print">
                  {isBilled ? (
                    <span
                      className="miniBadge"
                      style={{
                        background: "rgba(168,85,247,0.14)",
                        color: "#6d28d9",
                        border: "1px solid rgba(168,85,247,0.32)",
                      }}
                    >
                      GIÀ FATTURATO
                    </span>
                  ) : (
                    <form action={markBilledMonthly}>
                      <input type="hidden" name="clientServiceId" value={r.id} />
                      <input type="hidden" name="redirectPath" value={redirectPath} />
                      <button className="btn primary" type="submit">
                        FATTURATO
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            );
          })}

          {rowsUnique.length === 0 ? (
            <tr>
              <td colSpan={15} className="muted">
                Nessun lavoro per i filtri selezionati.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}