import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SP = {
  q?: string;
  status?: string;
  year?: string;
  clientId?: string;
  onlyAperture?: string;
  sort?: string;
  dir?: string;
};

type SortKey = "client" | "practice" | "date" | "status";

function fmt(d: Date | null | undefined) {
  return d ? new Date(d).toLocaleDateString("it-IT") : "—";
}

function toNum(v: any) {
  if (v == null) return 0;
  const s = typeof v === "number" ? String(v) : String(v?.toString?.() ?? v);
  const n = Number(String(s).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function eur(n: number) {
  return n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

function normalizePracticeStatus(value: any) {
  return String(value ?? "IN_ATTESA").trim().toUpperCase() || "IN_ATTESA";
}

function getPracticeStatusLabel(v: string | null | undefined) {
  const s = normalizePracticeStatus(v);

  if (s === "INVIATA_REGIONE") return "Inviata Regione";
  if (s === "INIZIO_LAVORI") return "Inizio lavori";
  if (s === "ACCETTATO") return "Accettato";
  if (s === "ISPEZIONE_ASL") return "Ispezione ASL";
  if (s === "CONCLUSO") return "Concluso";
  return "In attesa";
}

function practiceStatusBadgeStyle(v: string | null | undefined) {
  const s = normalizePracticeStatus(v);

  if (s === "CONCLUSO") {
    return {
      background: "rgba(34,197,94,0.12)",
      color: "#166534",
      border: "1px solid rgba(34,197,94,0.30)",
    };
  }

  if (s === "ACCETTATO") {
    return {
      background: "rgba(37,99,235,0.12)",
      color: "#1d4ed8",
      border: "1px solid rgba(37,99,235,0.30)",
    };
  }

  if (s === "ISPEZIONE_ASL") {
    return {
      background: "rgba(245,158,11,0.12)",
      color: "#92400e",
      border: "1px solid rgba(245,158,11,0.30)",
    };
  }

  if (s === "INIZIO_LAVORI") {
    return {
      background: "rgba(168,85,247,0.12)",
      color: "#7c3aed",
      border: "1px solid rgba(168,85,247,0.30)",
    };
  }

  if (s === "INVIATA_REGIONE") {
    return {
      background: "rgba(14,165,233,0.12)",
      color: "#0369a1",
      border: "1px solid rgba(14,165,233,0.30)",
    };
  }

  return {
    background: "rgba(0,0,0,0.04)",
    color: "rgba(0,0,0,0.72)",
    border: "1px solid rgba(0,0,0,0.12)",
  };
}

function billingStatusLabel(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();

  if (s === "DA_FATTURARE") return "Da fatturare";
  if (s === "FATTURA_DA_INVIARE") return "Fattura da inviare";
  if (s === "FATTURATA") return "Fatturata";
  if (s === "INCASSATA") return "Incassata";

  return "—";
}

function billingStatusStyle(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();

  if (s === "INCASSATA") {
    return {
      background: "rgba(34,197,94,0.12)",
      color: "#166534",
      border: "1px solid rgba(34,197,94,0.30)",
    };
  }

  if (s === "FATTURATA") {
    return {
      background: "rgba(37,99,235,0.12)",
      color: "#1d4ed8",
      border: "1px solid rgba(37,99,235,0.30)",
    };
  }

  if (s === "FATTURA_DA_INVIARE") {
    return {
      background: "rgba(245,158,11,0.12)",
      color: "#92400e",
      border: "1px solid rgba(245,158,11,0.30)",
    };
  }

  return {
    background: "rgba(0,0,0,0.04)",
    color: "rgba(0,0,0,0.72)",
    border: "1px solid rgba(0,0,0,0.12)",
  };
}

function getBillingSummary(p: any) {
  const steps = Array.isArray(p?.billingSteps) ? p.billingSteps : [];

  const fatturato = steps
    .filter((row: any) =>
      ["FATTURATA", "INCASSATA"].includes(String(row?.billingStatus ?? "").trim().toUpperCase())
    )
    .reduce((acc: number, row: any) => acc + toNum(row?.amountEur), 0);

  const incassato = steps
    .filter((row: any) => String(row?.billingStatus ?? "").trim().toUpperCase() === "INCASSATA")
    .reduce((acc: number, row: any) => acc + toNum(row?.amountEur), 0);

  const normalizedSteps = steps.map((row: any) => ({
    ...row,
    billingStatusUpper: String(row?.billingStatus ?? "").trim().toUpperCase(),
    triggerStatusUpper: String(row?.triggerStatus ?? "").trim().toUpperCase(),
  }));

  const activeStep =
    normalizedSteps.find(
      (row: any) => !["FATTURATA", "INCASSATA"].includes(row.billingStatusUpper)
    ) ??
    normalizedSteps.find((row: any) => row.billingStatusUpper === "FATTURATA") ??
    normalizedSteps.find((row: any) => row.billingStatusUpper === "INCASSATA") ??
    null;

  return {
    fatturato,
    incassato,
    count: steps.length,
    activeTriggerStatus: activeStep?.triggerStatusUpper || "",
    activeBillingStatus: activeStep?.billingStatusUpper || "—",
  };
}

function getPracticeAmount(p: any) {
  const candidates = [
    p?.amountEur,
    p?.practiceAmountEur,
    p?.totalAmountEur,
    p?.priceEur,
    p?.totalEur,
    p?.clientPriceEur,
    p?.valueEur,
    p?.price,
    p?.total,
    p?.amount,
  ];

  for (const v of candidates) {
    const n = toNum(v);
    if (n !== 0) return n;
  }

  return 0;
}

function normSort(v: any): SortKey {
  const s = String(v ?? "").toLowerCase();
  if (s === "client") return "client";
  if (s === "practice") return "practice";
  if (s === "date") return "date";
  if (s === "status") return "status";
  return "date";
}

function normDir(v: any): "asc" | "desc" {
  return String(v ?? "").toLowerCase() === "asc" ? "asc" : "desc";
}

export default async function AperturePage({
  searchParams,
}: {
  searchParams?: SP;
}) {
  const { prisma } = await import("@/lib/prisma");

  const q = String(searchParams?.q ?? "").trim();
  const status = String(searchParams?.status ?? "").trim();
  const year = String(searchParams?.year ?? "").trim();
  const clientId = String(searchParams?.clientId ?? "").trim();
  const onlyAperture = String(searchParams?.onlyAperture ?? "SI").trim();
  const sort = normSort(searchParams?.sort);
  const dir = normDir(searchParams?.dir);

  const where: any = {};

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { client: { name: { contains: q, mode: "insensitive" } } },
      { notes: { contains: q, mode: "insensitive" } },
      { determinaNumber: { contains: q, mode: "insensitive" } },
    ];
  }

  if (status) {
    where.apertureStatus = status;
  }

  if (clientId) {
    where.clientId = clientId;
  }

  if (onlyAperture === "SI") {
    where.inApertureList = true;
  }

  if (year) {
    const n = Number(year);
    if (Number.isFinite(n)) {
      where.OR = [
        ...(Array.isArray(where.OR) ? where.OR : []),
        { startYear: n },
        {
          practiceDate: {
            gte: new Date(Date.UTC(n, 0, 1)),
            lt: new Date(Date.UTC(n + 1, 0, 1)),
          },
        },
      ];
    }
  }

  const [rawRows, clients] = await Promise.all([
    prisma.clientPractice.findMany({
      where,
      include: {
        client: true,
        billingSteps: {
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        },
      },
      take: 2000,
    }),
    prisma.client.findMany({
      where: { status: "ATTIVO" },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const rows = [...rawRows].sort((a: any, b: any) => {
    const aConcluso = normalizePracticeStatus(a.apertureStatus) === "CONCLUSO" ? 1 : 0;
    const bConcluso = normalizePracticeStatus(b.apertureStatus) === "CONCLUSO" ? 1 : 0;
    if (aConcluso !== bConcluso) return aConcluso - bConcluso;

    let cmp = 0;

    if (sort === "client") {
      cmp = String(a.client?.name ?? "").localeCompare(String(b.client?.name ?? ""), "it");
    } else if (sort === "practice") {
      cmp = String(a.title ?? "").localeCompare(String(b.title ?? ""), "it");
    } else if (sort === "status") {
      cmp = getPracticeStatusLabel(a.apertureStatus).localeCompare(
        getPracticeStatusLabel(b.apertureStatus),
        "it"
      );
    } else {
      const at = a.practiceDate ? new Date(a.practiceDate).getTime() : 0;
      const bt = b.practiceDate ? new Date(b.practiceDate).getTime() : 0;
      cmp = at - bt;
    }

    if (cmp === 0) {
      cmp = String(a.client?.name ?? "").localeCompare(String(b.client?.name ?? ""), "it");
    }
    if (cmp === 0) {
      cmp = String(a.title ?? "").localeCompare(String(b.title ?? ""), "it");
    }

    return dir === "asc" ? cmp : -cmp;
  });

  const apertureTotal = rows.filter((r: any) => r.inApertureList).length;
  const inAttesa = rows.filter((r: any) => normalizePracticeStatus(r.apertureStatus) === "IN_ATTESA").length;
  const inCorso = rows.filter((r: any) =>
    ["INVIATA_REGIONE", "INIZIO_LAVORI", "ACCETTATO", "ISPEZIONE_ASL"].includes(
      normalizePracticeStatus(r.apertureStatus)
    )
  ).length;
  const concluse = rows.filter((r: any) => normalizePracticeStatus(r.apertureStatus) === "CONCLUSO").length;
  const totaleImporti = rows.reduce((acc: number, r: any) => acc + getPracticeAmount(r), 0);
  const totaleFatturatoSal = rows.reduce((acc: number, r: any) => acc + getBillingSummary(r).fatturato, 0);
  const totaleIncassatoSal = rows.reduce((acc: number, r: any) => acc + getBillingSummary(r).incassato, 0);

  const yearOptions = Array.from(
    new Set(
      rows
        .flatMap((r: any) => {
          const vals: number[] = [];
          if (r.startYear) vals.push(Number(r.startYear));
          if (r.practiceDate) vals.push(new Date(r.practiceDate).getFullYear());
          return vals;
        })
        .filter((n) => Number.isFinite(n))
    )
  ).sort((a, b) => b - a);

  const qsBase = new URLSearchParams();
  if (q) qsBase.set("q", q);
  if (status) qsBase.set("status", status);
  if (year) qsBase.set("year", year);
  if (clientId) qsBase.set("clientId", clientId);
  if (onlyAperture) qsBase.set("onlyAperture", onlyAperture);

  function sortHref(nextSort: SortKey) {
    const qs = new URLSearchParams(qsBase);
    const nextDir = nextSort === sort ? (dir === "asc" ? "desc" : "asc") : "asc";
    qs.set("sort", nextSort);
    qs.set("dir", nextDir);
    return `/aperture?${qs.toString()}`;
  }

  function sortIcon(col: SortKey) {
    if (sort !== col) return <span style={{ opacity: 0.45 }}>↕</span>;
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
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <div>
          <h1 style={{ margin: 0 }}>Aperture</h1>
          <div className="muted" style={{ marginTop: 6 }}>
            Elenco pratiche e stato avanzamento.
          </div>
        </div>

        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
          <Link className="btn" href="/clients">
            Clienti
          </Link>
          <Link className="btn" href="/pratiche-fatturazione">
            Fatturazione pratiche
          </Link>
        </div>
      </div>

      <form method="GET" className="card" style={{ marginTop: 12 }}>
        <input type="hidden" name="sort" value={sort} />
        <input type="hidden" name="dir" value={dir} />

        <div className="grid3">
          <div>
            <label>Cerca</label>
            <input
              className="input"
              name="q"
              defaultValue={q}
              placeholder="Titolo, cliente, note, determina..."
            />
          </div>

          <div>
            <label>Stato</label>
            <select className="input" name="status" defaultValue={status}>
              <option value="">Tutti</option>
              <option value="IN_ATTESA">In attesa</option>
              <option value="INVIATA_REGIONE">Inviata Regione</option>
              <option value="INIZIO_LAVORI">Inizio lavori</option>
              <option value="ACCETTATO">Accettato</option>
              <option value="ISPEZIONE_ASL">Ispezione ASL</option>
              <option value="CONCLUSO">Concluso</option>
            </select>
          </div>

          <div>
            <label>Cliente</label>
            <select className="input" name="clientId" defaultValue={clientId}>
              <option value="">Tutti</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid3" style={{ marginTop: 12 }}>
          <div>
            <label>Anno</label>
            <select className="input" name="year" defaultValue={year}>
              <option value="">Tutti</option>
              {yearOptions.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Mostra</label>
            <select className="input" name="onlyAperture" defaultValue={onlyAperture}>
              <option value="SI">Solo in Aperture</option>
              <option value="NO">Tutte le pratiche</option>
            </select>
          </div>

          <div className="row" style={{ alignItems: "end", gap: 8 }}>
            <button className="btn primary" type="submit">
              Applica
            </button>
            <Link className="btn" href="/aperture">
              Reset
            </Link>
          </div>
        </div>
      </form>

      <div className="row" style={{ gap: 12, flexWrap: "wrap", marginTop: 12 }}>
        <div className="card">Pratiche: <b>{rows.length}</b></div>
        <div className="card">In Aperture: <b>{apertureTotal}</b></div>
        <div className="card">In attesa: <b>{inAttesa}</b></div>
        <div className="card">In corso: <b>{inCorso}</b></div>
        <div className="card">Concluse: <b>{concluse}</b></div>
        <div className="card">Valore pratiche: <b>{eur(totaleImporti)}</b></div>
        <div className="card">Fatturato SAL: <b>{eur(totaleFatturatoSal)}</b></div>
        <div className="card">Incassato SAL: <b>{eur(totaleIncassatoSal)}</b></div>
      </div>

      <div className="muted" style={{ marginTop: 12 }}>
        Risultati: <b>{rows.length}</b> (max 2000)
      </div>

      {rows.length ? (
        <table className="table" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <ThSortable col="practice" label="Pratica" />
              <ThSortable col="client" label="Cliente" />
              <ThSortable col="date" label="Data" />
              <th>Anno</th>
              <ThSortable col="status" label="Stato" />
              <th>In Aperture</th>
              <th>Importo</th>
              <th>Incassato</th>
              <th>Stato SAL</th>
              <th>Apri</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p: any) => {
              const billing = getBillingSummary(p);
              const practiceAmount = getPracticeAmount(p);

              return (
                <tr key={p.id}>
                  <td>
                    <b>{p.title ?? "—"}</b>
                  </td>
                  <td>
                    <Link href={`/clients/${p.clientId}`}>{p.client?.name ?? "—"}</Link>
                  </td>
                  <td>{fmt(p.practiceDate)}</td>
                  <td>{p.startYear ?? "—"}</td>
                  <td>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "4px 10px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 800,
                        ...practiceStatusBadgeStyle(p.apertureStatus),
                      }}
                    >
                      {getPracticeStatusLabel(p.apertureStatus)}
                    </span>
                  </td>
                  <td>{p.inApertureList ? "SI" : "NO"}</td>
                  <td>{practiceAmount > 0 ? eur(practiceAmount) : "—"}</td>
                  <td>{billing.incassato > 0 ? eur(billing.incassato) : "—"}</td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
                      {billing.activeTriggerStatus ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "4px 10px",
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 800,
                            ...practiceStatusBadgeStyle(billing.activeTriggerStatus),
                          }}
                        >
                          {getPracticeStatusLabel(billing.activeTriggerStatus)}
                        </span>
                      ) : null}

                      {billing.activeBillingStatus !== "—" ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "4px 10px",
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 800,
                            ...billingStatusStyle(billing.activeBillingStatus),
                          }}
                        >
                          {billingStatusLabel(billing.activeBillingStatus)}
                        </span>
                      ) : (
                        "—"
                      )}
                    </div>
                  </td>
                  <td>
                    <Link className="btn" href={`/clients/${p.clientId}/practices/${p.id}`}>
                      Apri
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className="muted" style={{ marginTop: 12 }}>
          Nessuna pratica trovata.
        </div>
      )}
    </div>
  );
}