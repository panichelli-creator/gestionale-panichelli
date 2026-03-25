import Link from "next/link";
import { prisma } from "@/lib/prisma";

type SP = {
  year?: string;
  compareYear?: string;
};

function yearRangeUtc(year: number) {
  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year + 1, 0, 1));
  return { start, end };
}

function monthIndexUtc(d: Date) {
  return new Date(d).getUTCMonth();
}

const MONTHS_IT = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

function toNum(v: any) {
  if (v == null) return 0;
  const s = typeof v === "number" ? String(v) : String(v?.toString?.() ?? v);
  const n = Number(String(s).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function fmtEur(n: number) {
  return `${n.toFixed(2)} €`;
}

function fmtDate(d: Date | null | undefined) {
  return d ? new Date(d).toLocaleDateString("it-IT") : "—";
}

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

function isValidDate(v: any) {
  if (!v) return false;
  const d = new Date(v);
  return !Number.isNaN(d.getTime());
}

function pickDate(row: any) {
  const candidates = [
    row?.invoiceDate,
    row?.invoicedAt,
    row?.fatturataAt,
    row?.fatturatoAt,
    row?.billedAt,
    row?.closedAt,
    row?.completedAt,
    row?.doneAt,
    row?.workedAt,
    row?.practiceDate,
    row?.dueDate,
    row?.date,
    row?.dataUltimoAppuntamento,
    row?.dataProssimoAppuntamento,
    row?.createdAt,
    row?.updatedAt,
  ];

  for (const v of candidates) {
    if (isValidDate(v)) return new Date(v);
  }
  return null;
}

function pickAmount(row: any) {
  const directCandidates = [
    row?.invoiceAmountEur,
    row?.amountEur,
    row?.totalEur,
    row?.clientAmountEur,
    row?.clientPriceEur,
    row?.priceEur,
    row?.valueEur,
    row?.amount,
    row?.price,
    row?.total,
  ];

  for (const v of directCandidates) {
    const n = toNum(v);
    if (Number.isFinite(n) && n !== 0) return n;
  }

  const costoServizio = toNum(row?.costoServizio);
  const importoTrasferta = toNum(row?.importoTrasferta);

  if (costoServizio || importoTrasferta) {
    return costoServizio + importoTrasferta;
  }

  return 0;
}

function isBilledTrue(row: any) {
  const candidates = [
    row?.billed,
    row?.invoiced,
    row?.fatturata,
    row?.fatturato,
    row?.clientInvoiced,
    row?.clientBilled,
    row?.isClientBilled,
    row?.fatturatoCliente,
    row?.fattCliente,
  ];

  return candidates.some((v) => v === true);
}

function inRange(d: Date | null, start: Date, end: Date) {
  if (!d) return false;
  const t = d.getTime();
  return t >= start.getTime() && t < end.getTime();
}

async function loadRowsFromAnyDelegate(delegateNames: string[]) {
  const db = prisma as any;

  for (const name of delegateNames) {
    try {
      const delegate = db?.[name];
      if (!delegate || typeof delegate.findMany !== "function") continue;

      const rows = await delegate.findMany({
        take: 200000,
      });

      if (Array.isArray(rows)) return rows;
    } catch {}
  }

  return [];
}

function sumExtraBilledRowsByMonth(rows: any[], range: { start: Date; end: Date }) {
  const monthTotals = Array(12).fill(0) as number[];
  let total = 0;

  for (const row of rows) {
    if (!isBilledTrue(row)) continue;

    const d = pickDate(row);
    if (!inRange(d, range.start, range.end)) continue;

    const eur = pickAmount(row);
    const mi = monthIndexUtc(d!);

    monthTotals[mi] += eur;
    total += eur;
  }

  return { monthTotals, total };
}

function normalizeReferenteName(value: any) {
  const raw = String(value ?? "").trim().toUpperCase();
  if (!raw) return "PHSC";
  return raw;
}

function isInternalReferente(name: string) {
  return normalizeReferenteName(name) === "PHSC";
}

function calcReferenteAmount(priceEur: any, referentePerc: any, referenteName: any) {
  const name = normalizeReferenteName(referenteName);
  if (isInternalReferente(name)) return 0;

  const price = toNum(priceEur);
  const perc = toNum(referentePerc);

  if (!price || !perc) return 0;

  return price * (perc / 100);
}

function buildReferenteTotals(rows: any[]) {
  const byReferente = new Map<string, number>();

  for (const r of rows) {
    if (!r?.dueDate) continue;

    const referenteName = normalizeReferenteName(r?.referenteName);
    const amount = calcReferenteAmount(r?.priceEur, r?.referentePerc, referenteName);

    if (amount <= 0) continue;

    byReferente.set(referenteName, (byReferente.get(referenteName) ?? 0) + amount);
  }

  return byReferente;
}

function deltaTone(delta: number) {
  if (delta > 0) {
    return {
      color: "#166534",
      bg: "rgba(34,197,94,0.10)",
      border: "1px solid rgba(34,197,94,0.25)",
    };
  }
  if (delta < 0) {
    return {
      color: "#b91c1c",
      bg: "rgba(239,68,68,0.08)",
      border: "1px solid rgba(239,68,68,0.25)",
    };
  }
  return {
    color: "#92400e",
    bg: "rgba(245,158,11,0.10)",
    border: "1px solid rgba(245,158,11,0.25)",
  };
}

function sectionCardStyle(color: "green" | "blue" | "yellow" | "red" | "cyan" | "violet") {
  if (color === "green") {
    return { border: "1px solid rgba(16,185,129,0.25)", background: "rgba(16,185,129,0.04)" };
  }
  if (color === "blue") {
    return { border: "1px solid rgba(59,130,246,0.25)", background: "rgba(59,130,246,0.04)" };
  }
  if (color === "yellow") {
    return { border: "1px solid rgba(245,158,11,0.25)", background: "rgba(245,158,11,0.05)" };
  }
  if (color === "red") {
    return { border: "1px solid rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.04)" };
  }
  if (color === "cyan") {
    return { border: "1px solid rgba(6,182,212,0.25)", background: "rgba(6,182,212,0.04)" };
  }
  return { border: "1px solid rgba(168,85,247,0.25)", background: "rgba(168,85,247,0.04)" };
}

function getClientPhone(client: any, contacts?: any[]) {
  const direct = String(client?.phone ?? "").trim();
  if (direct) return direct;

  const list = Array.isArray(contacts) ? contacts : [];
  const preferred =
    list.find((c) => {
      const role = String(c?.role ?? "").toUpperCase();
      return (
        role.includes("REFERENTE") ||
        role.includes("TITOLARE") ||
        role.includes("SEGRETERIA") ||
        role.includes("AMMINISTRAZIONE")
      );
    }) ?? list.find((c) => String(c?.phone ?? "").trim());

  return String(preferred?.phone ?? "").trim() || "—";
}

function isRxServiceRow(row: any) {
  const serviceName = String(row?.service?.name ?? "").trim().toUpperCase();
  const end = toNum(row?.rxEndoralCount);
  const opt = toNum(row?.rxOptCount);

  return (
    end > 0 ||
    opt > 0 ||
    serviceName.includes(" RX") ||
    serviceName.startsWith("RX") ||
    serviceName.includes("RADIO")
  );
}

function calcRxRevenue(rows: any[]) {
  let total = 0;
  let referente = 0;

  for (const r of rows) {
    if (!r?.dueDate) continue;
    if (!isRxServiceRow(r)) continue;

    total += toNum(r?.priceEur);
    referente += calcReferenteAmount(r?.priceEur, r?.referentePerc, r?.referenteName);
  }

  return { total, referente, delta: total - referente };
}

function pickVseReferenteAmount(row: any) {
  const candidates = [
    row?.quotaTecnicoEur,
    row?.quotaTecnico,
    row?.technicianAmountEur,
    row?.tecnicoAmountEur,
    row?.compensoTecnicoEur,
    row?.totaleTecnicoEur,
    row?.totaleTecnico,
    row?.costoTecnicoEur,
    row?.costoTecnico,
    row?.quotaReferenteEur,
    row?.referenteAmountEur,
    row?.referenteEur,
  ];

  for (const v of candidates) {
    const n = toNum(v);
    if (n > 0) return n;
  }

  return 0;
}

function calcVseRevenue(rows: any[], range: { start: Date; end: Date }) {
  let total = 0;
  let referente = 0;

  for (const row of rows) {
    if (!isBilledTrue(row)) continue;

    const d = pickDate(row);
    if (!inRange(d, range.start, range.end)) continue;

    const revenue = pickAmount(row);
    total += revenue;
    referente += pickVseReferenteAmount(row);
  }

  return { total, referente, delta: total - referente };
}

export default async function DashboardPage({ searchParams }: { searchParams: SP }) {
  const now = new Date();
  const defaultYear = now.getFullYear();

  const year = Number((searchParams.year ?? String(defaultYear)).trim()) || defaultYear;
  const compareYearRaw = (searchParams.compareYear ?? "").trim();
  const compareYear = compareYearRaw ? Number(compareYearRaw) : null;

  const rA = yearRangeUtc(year);
  const rB = compareYear ? yearRangeUtc(compareYear) : null;

  const yearsOptions = Array.from({ length: 7 }, (_, i) => defaultYear - 3 + i);

  const today = startOfTodayLocal();
  const in7 = addDays(today, 7);
  const in30 = addDays(today, 30);
  const in60 = addDays(today, 60);
  const in90 = addDays(today, 90);

  const activeClientsCountPromise = prisma.client.count({
    where: { status: "ATTIVO" },
  });

  const missingContactsCountPromise = prisma.client.count({
    where: {
      contacts: {
        none: {},
      },
    },
  });

  const missingEmailCountPromise = prisma.client.count({
    where: {
      contacts: {
        some: {},
      },
      AND: [
        {
          NOT: {
            contacts: {
              some: {
                email: {
                  not: "",
                },
              },
            },
          },
        },
      ],
    },
  });

  const missingPhoneCountPromise = prisma.client.count({
    where: {
      contacts: {
        some: {},
      },
      AND: [
        {
          NOT: {
            contacts: {
              some: {
                phone: {
                  not: "",
                },
              },
            },
          },
        },
      ],
    },
  });

  const maintenance30Promise = prisma.clientService.count({
    where: { dueDate: { gte: today, lte: in30 } },
  });

  const maintenanceExpiredPromise = prisma.clientService.count({
    where: { dueDate: { lt: today } },
  });

  const maintenance30RowsPromise = prisma.clientService.findMany({
    where: { dueDate: { gte: today, lte: in30 } },
    select: { priceEur: true, rxEndoralCount: true, rxOptCount: true },
    take: 200000,
  });

  const servicesASelect = prisma.clientService.findMany({
    where: { dueDate: { gte: rA.start, lt: rA.end } },
    include: { service: true, client: true },
    take: 200000,
  });

  const servicesBSelect = compareYear
    ? prisma.clientService.findMany({
        where: { dueDate: { gte: rB!.start, lt: rB!.end } },
        include: { service: true, client: true },
        take: 200000,
      })
    : Promise.resolve([]);

  const vseRowsPromise = loadRowsFromAnyDelegate([
    "clinicalCheck",
    "clinicalChecks",
    "clinicalVerification",
    "clinicalVerifications",
    "vseCheck",
    "vseChecks",
    "engineeringCheck",
    "engineeringChecks",
    "clinicalEngineeringCheck",
    "clinicalEngineeringChecks",
    "verification",
    "verifications",
  ]);

  const practiceRowsPromise = loadRowsFromAnyDelegate([
    "practice",
    "practices",
    "clientPractice",
    "clientPractices",
    "administrativePractice",
    "administrativePractices",
  ]);

  const training30Promise = prisma.trainingRecord.count({
    where: {
      dueDate: { gte: today, lte: in30 },
    },
  });

  const training60Promise = prisma.trainingRecord.count({
    where: {
      dueDate: { gte: today, lte: in60 },
    },
  });

  const training90Promise = prisma.trainingRecord.count({
    where: {
      dueDate: { gte: today, lte: in90 },
    },
  });

  const trainingExpiredPromise = prisma.trainingRecord.count({
    where: {
      dueDate: { lt: today },
    },
  });

  const upcomingTrainingRowsPromise = prisma.trainingRecord.findMany({
    where: {
      dueDate: { gte: today, lte: in90 },
    },
    include: {
      person: true,
      course: true,
    },
    orderBy: { dueDate: "asc" },
    take: 12,
  });

  const upcomingServiceRowsPromise = prisma.clientService.findMany({
    where: {
      dueDate: { gte: today, lte: in90 },
    },
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
    orderBy: { dueDate: "asc" },
    take: 12,
  });

  const upcomingVseRowsPromise = prisma.clinicalEngineeringCheck.findMany({
    where: {
      dataProssimoAppuntamento: { gte: today, lte: in90 },
    },
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
      site: true,
    },
    orderBy: { dataProssimoAppuntamento: "asc" },
    take: 12,
  });

  const [
    activeClientsCount,
    missingContactsCount,
    missingEmailCount,
    missingPhoneCount,
    rowsA,
    rowsB,
    maintenance30,
    maintenanceExpired,
    maintenance30Rows,
    vseRows,
    practiceRows,
    training30,
    training60,
    training90,
    trainingExpired,
    upcomingTrainingRows,
    upcomingServiceRows,
    upcomingVseRows,
  ] = await Promise.all([
    activeClientsCountPromise,
    missingContactsCountPromise,
    missingEmailCountPromise,
    missingPhoneCountPromise,
    servicesASelect,
    servicesBSelect,
    maintenance30Promise,
    maintenanceExpiredPromise,
    maintenance30RowsPromise,
    vseRowsPromise,
    practiceRowsPromise,
    training30Promise,
    training60Promise,
    training90Promise,
    trainingExpiredPromise,
    upcomingTrainingRowsPromise,
    upcomingServiceRowsPromise,
    upcomingVseRowsPromise,
  ]);

  let value30 = 0;
  let end30 = 0;
  let opt30 = 0;
  for (const r of maintenance30Rows as any[]) {
    value30 += toNum(r.priceEur);
    end30 += toNum(r.rxEndoralCount);
    opt30 += toNum(r.rxOptCount);
  }

  const monthTotalsA = Array(12).fill(0) as number[];
  const byServiceA = new Map<string, number>();
  let totalEndA = 0;
  let totalOptA = 0;

  for (const r of rowsA as any[]) {
    if (!r.dueDate) continue;

    const eur = toNum(r.priceEur);
    const mi = monthIndexUtc(new Date(r.dueDate));
    monthTotalsA[mi] += eur;

    totalEndA += toNum(r.rxEndoralCount);
    totalOptA += toNum(r.rxOptCount);

    const sName = (r.service?.name ?? "—").trim().toUpperCase();
    byServiceA.set(sName, (byServiceA.get(sName) ?? 0) + eur);
  }

  const extraVseA = sumExtraBilledRowsByMonth(vseRows, rA);
  const extraPracticesA = sumExtraBilledRowsByMonth(practiceRows, rA);

  for (let i = 0; i < 12; i++) {
    monthTotalsA[i] += extraVseA.monthTotals[i] + extraPracticesA.monthTotals[i];
  }

  if (extraVseA.total > 0) {
    byServiceA.set("VSE", (byServiceA.get("VSE") ?? 0) + extraVseA.total);
  }

  if (extraPracticesA.total > 0) {
    byServiceA.set("PRATICHE", (byServiceA.get("PRATICHE") ?? 0) + extraPracticesA.total);
  }

  const totalYearA = monthTotalsA.reduce((a, b) => a + b, 0);

  const monthTotalsB = Array(12).fill(0) as number[];
  const byServiceB = new Map<string, number>();
  let totalEndB = 0;
  let totalOptB = 0;
  let extraVseB = { monthTotals: Array(12).fill(0) as number[], total: 0 };
  let extraPracticesB = { monthTotals: Array(12).fill(0) as number[], total: 0 };

  if (compareYear) {
    for (const r of rowsB as any[]) {
      if (!r.dueDate) continue;

      const eur = toNum(r.priceEur);
      const mi = monthIndexUtc(new Date(r.dueDate));
      monthTotalsB[mi] += eur;

      totalEndB += toNum(r.rxEndoralCount);
      totalOptB += toNum(r.rxOptCount);

      const sName = (r.service?.name ?? "—").trim().toUpperCase();
      byServiceB.set(sName, (byServiceB.get(sName) ?? 0) + eur);
    }

    extraVseB = sumExtraBilledRowsByMonth(vseRows, rB!);
    extraPracticesB = sumExtraBilledRowsByMonth(practiceRows, rB!);

    for (let i = 0; i < 12; i++) {
      monthTotalsB[i] += extraVseB.monthTotals[i] + extraPracticesB.monthTotals[i];
    }

    if (extraVseB.total > 0) {
      byServiceB.set("VSE", (byServiceB.get("VSE") ?? 0) + extraVseB.total);
    }

    if (extraPracticesB.total > 0) {
      byServiceB.set("PRATICHE", (byServiceB.get("PRATICHE") ?? 0) + extraPracticesB.total);
    }
  }

  const totalYearB = compareYear ? monthTotalsB.reduce((a, b) => a + b, 0) : 0;

  const deltaYear = compareYear ? totalYearA - totalYearB : 0;
  const deltaEnd = compareYear ? totalEndA - totalEndB : 0;
  const deltaOpt = compareYear ? totalOptA - totalOptB : 0;

  const totalVseA = extraVseA.total;
  const totalVseB = compareYear ? extraVseB.total : 0;
  const deltaVse = compareYear ? totalVseA - totalVseB : 0;

  const totalPracticesA = extraPracticesA.total;
  const totalPracticesB = compareYear ? extraPracticesB.total : 0;
  const deltaPractices = compareYear ? totalPracticesA - totalPracticesB : 0;

  const allServiceNames = new Set<string>([
    ...Array.from(byServiceA.keys()),
    ...Array.from(byServiceB.keys()),
  ]);

  const serviceRows = Array.from(allServiceNames)
    .map((name) => {
      const a = byServiceA.get(name) ?? 0;
      const b = byServiceB.get(name) ?? 0;
      return { name, a, b, delta: compareYear ? a - b : 0 };
    })
    .sort((x, y) => y.a - x.a);

  const byReferenteA = buildReferenteTotals(rowsA as any[]);
  const byReferenteB = compareYear ? buildReferenteTotals(rowsB as any[]) : new Map<string, number>();

  const allReferenteNames = new Set<string>([
    ...Array.from(byReferenteA.keys()),
    ...Array.from(byReferenteB.keys()),
  ]);

  const referenteRows = Array.from(allReferenteNames)
    .map((name) => {
      const a = byReferenteA.get(name) ?? 0;
      const b = byReferenteB.get(name) ?? 0;
      return { name, a, b, delta: compareYear ? a - b : 0 };
    })
    .sort((x, y) => y.a - x.a);

  const serviziClientServiceA = totalYearA - totalVseA - totalPracticesA;
  const serviziClientServiceB = compareYear ? totalYearB - totalVseB - totalPracticesB : 0;
  const deltaServiziNetti = compareYear ? serviziClientServiceA - serviziClientServiceB : 0;

  const yearDeltaTone = deltaTone(deltaYear);
  const vseDeltaTone = deltaTone(deltaVse);
  const praticheDeltaTone = deltaTone(deltaPractices);
  const serviziDeltaTone = deltaTone(deltaServiziNetti);

  const rxA = calcRxRevenue(rowsA as any[]);
  const rxB = compareYear ? calcRxRevenue(rowsB as any[]) : { total: 0, referente: 0, delta: 0 };
  const rxCompareDelta = compareYear ? rxA.total - rxB.total : 0;
  const rxReferenteCompareDelta = compareYear ? rxA.referente - rxB.referente : 0;
  const rxCardDelta = deltaTone(rxA.delta);
  const rxCompareTone = deltaTone(rxCompareDelta);
  const rxReferenteCompareTone = deltaTone(rxReferenteCompareDelta);

  const vseRevenueA = calcVseRevenue(vseRows as any[], rA);
  const vseRevenueB = compareYear
    ? calcVseRevenue(vseRows as any[], rB!)
    : { total: 0, referente: 0, delta: 0 };
  const vseRevenueCompareDelta = compareYear ? vseRevenueA.total - vseRevenueB.total : 0;
  const vseReferenteCompareDelta = compareYear ? vseRevenueA.referente - vseRevenueB.referente : 0;
  const vseCardDelta = deltaTone(vseRevenueA.delta);
  const vseCompareTone = deltaTone(vseRevenueCompareDelta);
  const vseReferenteCompareTone = deltaTone(vseReferenteCompareDelta);

  return (
    <div className="card">
      <style>{`
        .sectionTitle{
          font-size:18px;
          font-weight:900;
          margin:0;
        }
        .sectionSub{
          margin-top:6px;
          color:rgba(0,0,0,0.58);
          font-size:13px;
        }
        .kpiCard{
          border-radius:16px;
          padding:14px;
          min-height:148px;
          display:flex;
          flex-direction:column;
          justify-content:space-between;
        }
        .kpiLabel{
          font-size:13px;
          font-weight:700;
          color:rgba(0,0,0,0.62);
        }
        .kpiValue{
          font-size:24px;
          font-weight:900;
          margin-top:8px;
          line-height:1.1;
        }
        .kpiSub{
          margin-top:8px;
          font-size:13px;
          color:rgba(0,0,0,0.62);
        }
        .deltaBadge{
          display:inline-flex;
          align-items:center;
          gap:6px;
          padding:4px 10px;
          border-radius:999px;
          font-size:12px;
          font-weight:800;
          white-space:nowrap;
        }
        .miniStat{
          font-size:15px;
          font-weight:800;
          margin-top:6px;
        }
        .reportSection{
          margin-top:14px;
        }
        .tableClean th{
          background:rgba(0,0,0,0.03);
          font-size:12px;
        }
        .tableClean td{
          vertical-align:top;
        }
        .gridTop{
          display:grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap:12px;
          margin-top:12px;
        }
        @media (max-width: 1200px){
          .gridTop{
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>

      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>Control Center</h1>
          <div className="muted" style={{ marginTop: 6 }}>
            KPI + scadenzario automatico + report
          </div>
        </div>

        <Link className="btn primary" href="/maintenance">
          Vai a Mantenimenti
        </Link>
      </div>

      <form method="GET" className="card" style={{ marginTop: 12 }}>
        <div className="grid3">
          <div>
            <label>Anno</label>
            <select className="input" name="year" defaultValue={String(year)}>
              {yearsOptions.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Confronta con</label>
            <select
              className="input"
              name="compareYear"
              defaultValue={compareYear ? String(compareYear) : ""}
            >
              <option value="">— Nessun confronto</option>
              {yearsOptions.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="row" style={{ alignItems: "end", gap: 8 }}>
            <button className="btn primary" type="submit">
              Applica
            </button>
            <Link className="btn" href="/dashboard">
              Reset
            </Link>
          </div>
        </div>
      </form>

      <div className="reportSection">
        <h2 className="sectionTitle">Sintesi fatturato</h2>
        <div className="sectionSub">
          Tutta la parte economica e servizi in alto, più compatta e leggibile.
        </div>

        <div className="gridTop">
          <div className="card kpiCard" style={sectionCardStyle("green")}>
            <div className="kpiLabel">Totale annuo previsto ({year})</div>
            <div className="kpiValue">{fmtEur(totalYearA)}</div>
            {compareYear ? (
              <div className="kpiSub">
                <span className="deltaBadge" style={yearDeltaTone as any}>
                  {compareYear}: {fmtEur(totalYearB)} • Δ {fmtEur(deltaYear)}
                </span>
              </div>
            ) : (
              <div className="kpiSub">Totale complessivo dell’anno</div>
            )}
          </div>

          <div className="card kpiCard" style={sectionCardStyle("blue")}>
            <div className="kpiLabel">Servizi da ClientService ({year})</div>
            <div className="kpiValue">{fmtEur(serviziClientServiceA)}</div>
            {compareYear ? (
              <div className="kpiSub">
                <span className="deltaBadge" style={serviziDeltaTone as any}>
                  {compareYear}: {fmtEur(serviziClientServiceB)} • Δ {fmtEur(deltaServiziNetti)}
                </span>
              </div>
            ) : (
              <div className="kpiSub">Fatturato servizi ricorrenti</div>
            )}
          </div>

          <div className="card kpiCard" style={sectionCardStyle("green")}>
            <div className="kpiLabel">Valore previsto 30 giorni</div>
            <div className="kpiValue">{fmtEur(value30)}</div>
            <div className="kpiSub">RX End: {end30} • RX OPT: {opt30}</div>
          </div>

          <div className="card kpiCard" style={sectionCardStyle("green")}>
            <div className="kpiLabel">Fatturato VSE ({year})</div>
            <div className="kpiValue">{fmtEur(vseRevenueA.total)}</div>
            <div className="kpiSub">Referente/tecnico: {fmtEur(vseRevenueA.referente)}</div>
            <div className="kpiSub">
              <span className="deltaBadge" style={vseCardDelta as any}>
                Delta: {fmtEur(vseRevenueA.delta)}
              </span>
            </div>
            {compareYear ? (
              <div className="kpiSub">
                <span className="deltaBadge" style={vseCompareTone as any}>
                  {compareYear} fatturato: {fmtEur(vseRevenueB.total)}
                </span>{" "}
                <span className="deltaBadge" style={vseReferenteCompareTone as any}>
                  {compareYear} referente: {fmtEur(vseRevenueB.referente)}
                </span>
              </div>
            ) : null}
          </div>

          <div className="card kpiCard" style={sectionCardStyle("cyan")}>
            <div className="kpiLabel">Fatturato RX ({year})</div>
            <div className="kpiValue">{fmtEur(rxA.total)}</div>
            <div className="kpiSub">Referenti RX: {fmtEur(rxA.referente)}</div>
            <div className="kpiSub">
              <span className="deltaBadge" style={rxCardDelta as any}>
                Delta: {fmtEur(rxA.delta)}
              </span>
            </div>
            {compareYear ? (
              <div className="kpiSub">
                <span className="deltaBadge" style={rxCompareTone as any}>
                  {compareYear} fatturato: {fmtEur(rxB.total)}
                </span>{" "}
                <span className="deltaBadge" style={rxReferenteCompareTone as any}>
                  {compareYear} referenti: {fmtEur(rxB.referente)}
                </span>
              </div>
            ) : null}
          </div>

          <div className="card kpiCard" style={sectionCardStyle("violet")}>
            <div className="kpiLabel">Fatturato Pratiche ({year})</div>
            <div className="kpiValue">{fmtEur(totalPracticesA)}</div>
            {compareYear ? (
              <div className="kpiSub">
                <span className="deltaBadge" style={praticheDeltaTone as any}>
                  {compareYear}: {fmtEur(totalPracticesB)} • Δ {fmtEur(deltaPractices)}
                </span>
              </div>
            ) : (
              <div className="kpiSub">Da migliorare con incassi a step</div>
            )}
          </div>

          <div className="card kpiCard" style={sectionCardStyle("yellow")}>
            <div className="kpiLabel">RX Totali ({year})</div>
            <div className="miniStat">Endorali: {totalEndA}</div>
            <div className="miniStat">OPT: {totalOptA}</div>
            {compareYear ? (
              <div className="kpiSub">
                {compareYear} → End: {totalEndB} • OPT: {totalOptB} • Δ End: {deltaEnd} • Δ OPT: {deltaOpt}
              </div>
            ) : (
              <div className="kpiSub">Volumi RX dell’anno</div>
            )}
          </div>

          <div className="card kpiCard" style={sectionCardStyle("yellow")}>
            <div className="kpiLabel">Clienti attivi</div>
            <div className="kpiValue">{activeClientsCount}</div>
            <div className="kpiSub">Base clienti attualmente attiva</div>
          </div>
        </div>
      </div>

      <div className="grid2" style={{ marginTop: 12 }}>
        <div className="card">
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 900, margin: 0 }}>Totali per mese</h2>
              <div className="sectionSub" style={{ marginTop: 4 }}>
                Andamento economico mensile.
              </div>
            </div>
            {compareYear ? (
              <span className="deltaBadge" style={yearDeltaTone as any}>
                Confronto {year} vs {compareYear}
              </span>
            ) : null}
          </div>

          <table className="table tableClean" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>Mese</th>
                <th>{year}</th>
                {compareYear && <th>{compareYear}</th>}
                {compareYear && <th>Δ</th>}
              </tr>
            </thead>

            <tbody>
              {MONTHS_IT.map((m, i) => {
                const a = monthTotalsA[i] ?? 0;
                const b = compareYear ? monthTotalsB[i] ?? 0 : 0;
                const d = compareYear ? a - b : 0;
                const tone = deltaTone(d);

                return (
                  <tr key={m}>
                    <td>{m}</td>
                    <td>{fmtEur(a)}</td>
                    {compareYear && <td>{fmtEur(b)}</td>}
                    {compareYear && (
                      <td>
                        <span className="deltaBadge" style={tone as any}>
                          {fmtEur(d)}
                        </span>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 900, margin: 0 }}>Totali per servizio</h2>
              <div className="sectionSub" style={{ marginTop: 4 }}>
                Le aree che producono di più nell’anno selezionato.
              </div>
            </div>
          </div>

          <table className="table tableClean" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>Servizio</th>
                <th>{year}</th>
                {compareYear && <th>{compareYear}</th>}
                {compareYear && <th>Δ</th>}
              </tr>
            </thead>

            <tbody>
              {serviceRows.map((r) => {
                const tone = deltaTone(r.delta);

                return (
                  <tr key={r.name}>
                    <td>{r.name}</td>
                    <td>{fmtEur(r.a)}</td>
                    {compareYear && <td>{fmtEur(r.b)}</td>}
                    {compareYear && (
                      <td>
                        <span className="deltaBadge" style={tone as any}>
                          {fmtEur(r.delta)}
                        </span>
                      </td>
                    )}
                  </tr>
                );
              })}

              {serviceRows.length === 0 && (
                <tr>
                  <td colSpan={compareYear ? 4 : 2} className="muted">
                    Nessun dato per l’anno selezionato.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="reportSection">
        <h2 className="sectionTitle">Qualità anagrafica clienti</h2>
        <div className="sectionSub">
          Controlli anagrafici separati dal fatturato.
        </div>

        <div className="grid3" style={{ marginTop: 12 }}>
          <div className="card kpiCard" style={sectionCardStyle("red")}>
            <div className="kpiLabel">Clienti senza contatti</div>
            <div className="kpiValue">{missingContactsCount}</div>
            <div style={{ marginTop: 10 }}>
              <Link className="btn" href="/contacts/missing">
                Apri lista
              </Link>
            </div>
          </div>

          <div className="card kpiCard" style={sectionCardStyle("yellow")}>
            <div className="kpiLabel">Clienti senza email</div>
            <div className="kpiValue">{missingEmailCount}</div>
            <div style={{ marginTop: 10 }}>
              <Link className="btn" href="/contacts/missing">
                Apri lista
              </Link>
            </div>
          </div>

          <div className="card kpiCard" style={sectionCardStyle("blue")}>
            <div className="kpiLabel">Clienti senza telefono</div>
            <div className="kpiValue">{missingPhoneCount}</div>
            <div style={{ marginTop: 10 }}>
              <Link className="btn" href="/contacts/missing">
                Apri lista
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="reportSection">
        <h2 className="sectionTitle">Scadenze e scadenzario</h2>
        <div className="sectionSub">
          Solo scadenze essenziali.
        </div>

        <div className="gridTop">
          <div className="card kpiCard" style={sectionCardStyle("yellow")}>
            <div className="kpiLabel">Scadenze 30 giorni</div>
            <div className="kpiValue">{maintenance30}</div>
          </div>

          <div className="card kpiCard" style={sectionCardStyle("red")}>
            <div className="kpiLabel">Formazione scaduta</div>
            <div className="kpiValue">{trainingExpired}</div>
          </div>

          <div className="card kpiCard" style={sectionCardStyle("yellow")}>
            <div className="kpiLabel">Formazione entro 30gg</div>
            <div className="kpiValue">{training30}</div>
          </div>

          <div className="card kpiCard" style={sectionCardStyle("yellow")}>
            <div className="kpiLabel">Formazione entro 90gg</div>
            <div className="kpiValue">{training90}</div>
          </div>

          <div className="card kpiCard" style={sectionCardStyle("red")}>
            <div className="kpiLabel">Mantenimenti scaduti</div>
            <div className="kpiValue">{maintenanceExpired}</div>
          </div>
        </div>
      </div>

      <div className="grid3" style={{ marginTop: 12 }}>
        <div className="card">
          <h2 style={{ fontSize: 16, fontWeight: 900 }}>Formazione in scadenza</h2>

          <table className="table tableClean" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>Persona</th>
                <th>Corso</th>
                <th>Scadenza</th>
              </tr>
            </thead>
            <tbody>
              {upcomingTrainingRows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <Link href={`/people/${r.personId}`}>
                      {r.person?.lastName} {r.person?.firstName}
                    </Link>
                  </td>
                  <td>{r.course?.name ?? "—"}</td>
                  <td>{fmtDate(r.dueDate)}</td>
                </tr>
              ))}

              {upcomingTrainingRows.length === 0 && (
                <tr>
                  <td colSpan={3} className="muted">
                    Nessuna scadenza formazione entro 90 giorni.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="muted" style={{ marginTop: 8 }}>
            Entro 30gg: <b>{training30}</b> • Entro 60gg: <b>{training60}</b> • Entro 90gg: <b>{training90}</b>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 16, fontWeight: 900 }}>Mantenimenti in scadenza</h2>

          <table className="table tableClean" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Sede</th>
                <th>Servizio</th>
                <th>Scadenza</th>
              </tr>
            </thead>
            <tbody>
              {upcomingServiceRows.map((r: any) => (
                <tr key={r.id}>
                  <td>
                    <Link href={`/clients/${r.clientId}`}>{r.client?.name ?? "—"}</Link>
                  </td>
                  <td>{r.site?.name ?? "—"}</td>
                  <td>{r.service?.name ?? "—"}</td>
                  <td>{fmtDate(r.dueDate)}</td>
                </tr>
              ))}

              {upcomingServiceRows.length === 0 && (
                <tr>
                  <td colSpan={4} className="muted">
                    Nessuna scadenza mantenimenti entro 90 giorni.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 16, fontWeight: 900 }}>VSE in scadenza</h2>

          <table className="table tableClean" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Sede</th>
                <th>Scadenza</th>
              </tr>
            </thead>
            <tbody>
              {upcomingVseRows.map((r: any) => (
                <tr key={r.id}>
                  <td>
                    <Link href={`/clients/${r.clientId}`}>
                      {r.client?.name ?? r.nomeClienteSnapshot ?? "—"}
                    </Link>
                  </td>
                  <td>{r.site?.name ?? r.nomeSedeSnapshot ?? "—"}</td>
                  <td>{fmtDate(r.dataProssimoAppuntamento)}</td>
                </tr>
              ))}

              {upcomingVseRows.length === 0 && (
                <tr>
                  <td colSpan={3} className="muted">
                    Nessuna VSE entro 90 giorni.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}