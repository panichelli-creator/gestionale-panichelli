import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SP = {
  ym?: string;       // YYYY-MM
  q?: string;        // ricerca cliente/servizio
  clientId?: string; // filtro cliente
};

type UnifiedRow = {
  id: string;
  date: Date | null;
  clientName: string;
  clientId: string | null;
  serviceName: string;
  amount: number;
  notes: string;
  sourceType: "SERVIZIO" | "PRATICA";
  practiceTitle?: string;
};

function defaultYm() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function monthRangeFromYm(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  const from = new Date(y, m - 1, 1);
  const to = new Date(y, m, 1);
  return { from, to };
}

function toNum(v: any): number {
  if (v == null || v === "") return 0;
  const s = typeof v === "number" ? String(v) : String(v?.toString?.() ?? v);
  const n = Number(String(s).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function eur(n: any) {
  const x = toNum(n);
  return x.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

function parseMaybeDate(v: any): Date | null {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

function parseMaybeArray(v: any): any[] {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function extractPracticePayments(p: any) {
  const rows: Array<{
    label: string;
    amount: number;
    paidAt: Date | null;
    paidYear: number | null;
    notes: string;
  }> = [];

  const arrayCandidates = [
    ...parseMaybeArray(p?.payments),
    ...parseMaybeArray(p?.paymentRows),
    ...parseMaybeArray(p?.paymentSteps),
    ...parseMaybeArray(p?.incassi),
    ...parseMaybeArray(p?.rate),
  ];

  for (let i = 0; i < arrayCandidates.length; i++) {
    const item = arrayCandidates[i] ?? {};

    const amount = toNum(
      item.amountEur ??
        item.importoEur ??
        item.amount ??
        item.importo ??
        item.priceEur ??
        item.valueEur
    );

    const paidAt =
      parseMaybeDate(item.paidAt) ??
      parseMaybeDate(item.paymentDate) ??
      parseMaybeDate(item.date) ??
      parseMaybeDate(item.dataPagamento);

    const rawYear =
      item.paidYear ??
      item.year ??
      item.anno ??
      (paidAt ? paidAt.getFullYear() : null);

    const paidYear =
      rawYear == null || rawYear === ""
        ? null
        : Number.isFinite(Number(rawYear))
        ? Number(rawYear)
        : null;

    const label =
      String(
        item.label ??
          item.name ??
          item.type ??
          item.tipo ??
          item.description ??
          ""
      ).trim() || `Pagamento ${i + 1}`;

    const notes = String(item.notes ?? item.note ?? "").trim();

    if (amount > 0 || paidAt || notes) {
      rows.push({
        label,
        amount,
        paidAt,
        paidYear,
        notes,
      });
    }
  }

  const accontoAmount = toNum(
    p?.accontoEur ??
      p?.acceptanceAmountEur ??
      p?.downPaymentEur ??
      p?.depositEur
  );
  const accontoDate =
    parseMaybeDate(p?.accontoDate) ??
    parseMaybeDate(p?.acceptanceDate) ??
    parseMaybeDate(p?.downPaymentDate);
  const accontoYearRaw =
    p?.accontoYear ??
    p?.acceptanceYear ??
    p?.downPaymentYear ??
    (accontoDate ? accontoDate.getFullYear() : null);
  const accontoYear =
    accontoYearRaw == null || accontoYearRaw === ""
      ? null
      : Number.isFinite(Number(accontoYearRaw))
      ? Number(accontoYearRaw)
      : null;
  const accontoNotes = String(p?.accontoNotes ?? "").trim();

  if (accontoAmount > 0 || accontoDate || accontoNotes) {
    rows.push({
      label: "Acconto",
      amount: accontoAmount,
      paidAt: accontoDate,
      paidYear: accontoYear,
      notes: accontoNotes,
    });
  }

  const saldoAmount = toNum(
    p?.saldoEur ??
      p?.balanceEur ??
      p?.finalAmountEur
  );
  const saldoDate =
    parseMaybeDate(p?.saldoDate) ??
    parseMaybeDate(p?.balanceDate) ??
    parseMaybeDate(p?.finalPaymentDate);
  const saldoYearRaw =
    p?.saldoYear ??
    p?.balanceYear ??
    p?.finalPaymentYear ??
    (saldoDate ? saldoDate.getFullYear() : null);
  const saldoYear =
    saldoYearRaw == null || saldoYearRaw === ""
      ? null
      : Number.isFinite(Number(saldoYearRaw))
      ? Number(saldoYearRaw)
      : null;
  const saldoNotes = String(p?.saldoNotes ?? "").trim();

  if (saldoAmount > 0 || saldoDate || saldoNotes) {
    rows.push({
      label: "Saldo",
      amount: saldoAmount,
      paidAt: saldoDate,
      paidYear: saldoYear,
      notes: saldoNotes,
    });
  }

  return rows.sort((a, b) => {
    const at = a.paidAt ? a.paidAt.getTime() : Number.MAX_SAFE_INTEGER;
    const bt = b.paidAt ? b.paidAt.getTime() : Number.MAX_SAFE_INTEGER;
    return at - bt;
  });
}

export default async function WorkReportPage({ searchParams }: { searchParams: SP }) {
  const ym = (searchParams.ym ?? defaultYm()).trim();
  const q = (searchParams.q ?? "").trim().toLowerCase();
  const clientId = (searchParams.clientId ?? "TUTTI").trim();

  const { from, to } = monthRangeFromYm(ym);

  const workReportWhere: any = { ym };
  if (clientId !== "TUTTI") workReportWhere.clientId = clientId;

  if (q) {
    workReportWhere.OR = [
      { client: { name: { contains: q, mode: "insensitive" } } },
      { service: { name: { contains: q, mode: "insensitive" } } },
      { notes: { contains: q, mode: "insensitive" } },
    ];
  }

  const [clients, serviceRows, practiceRows] = await Promise.all([
    prisma.client.findMany({
      where: { status: "ATTIVO" },
      orderBy: { name: "asc" },
    }),
    prisma.workReport.findMany({
      where: workReportWhere,
      include: { client: true, service: true },
      orderBy: [{ workedAt: "desc" }, { client: { name: "asc" } }],
      take: 5000,
    }),
    prisma.clientPractice.findMany({
      where: clientId !== "TUTTI" ? { clientId } : undefined,
      include: { client: true },
      orderBy: [{ updatedAt: "desc" }],
      take: 5000,
    }),
  ]);

  const unifiedServiceRows: UnifiedRow[] = serviceRows.map((r: any) => ({
    id: `wr_${r.id}`,
    date: r.workedAt ? new Date(r.workedAt) : null,
    clientName: r.client?.name ?? "—",
    clientId: r.clientId ?? null,
    serviceName: r.service?.name ?? "—",
    amount: toNum(r.amountEur),
    notes: String(r.notes ?? "").trim(),
    sourceType: "SERVIZIO",
  }));

  const unifiedPracticeRows: UnifiedRow[] = [];

  for (const p of practiceRows as any[]) {
    const payments = extractPracticePayments(p);

    for (let i = 0; i < payments.length; i++) {
      const pay = payments[i];
      const date = pay.paidAt;

      if (!date) continue;
      if (!(date >= from && date < to)) continue;

      const clientName = p.client?.name ?? "—";
      const title = String(p.title ?? "Pratica").trim() || "Pratica";

      const searchText = [
        clientName,
        title,
        "PRATICHE",
        pay.label,
        pay.notes,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (q && !searchText.includes(q)) continue;

      unifiedPracticeRows.push({
        id: `pr_${p.id}_${i}`,
        date,
        clientName,
        clientId: p.clientId ?? null,
        serviceName: "PRATICHE",
        amount: toNum(pay.amount),
        notes: [title, pay.label, pay.notes].filter(Boolean).join(" • "),
        sourceType: "PRATICA",
        practiceTitle: title,
      });
    }
  }

  const rows: UnifiedRow[] = [...unifiedServiceRows, ...unifiedPracticeRows].sort((a, b) => {
    const ad = a.date ? new Date(a.date).getTime() : 0;
    const bd = b.date ? new Date(b.date).getTime() : 0;
    if (bd !== ad) return bd - ad;
    return a.clientName.localeCompare(b.clientName, "it");
  });

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0 }}>Report lavori svolti</h1>
        </div>

        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href="/monthly-work">
            Lavori mensili
          </Link>
        </div>
      </div>

      <form method="GET" className="card" style={{ marginTop: 12 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          <div>
            <label>Mese</label>
            <input className="input" type="month" name="ym" defaultValue={ym} />
          </div>

          <div>
            <label>Cliente</label>
            <select className="input" name="clientId" defaultValue={clientId}>
              <option value="TUTTI">Tutti</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Cerca (cliente/servizio/pratica)</label>
            <input className="input" name="q" defaultValue={searchParams.q ?? ""} placeholder="Es. Ideal / DVR / Apertura..." />
          </div>
        </div>

        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn primary" type="submit">Applica</button>
          <Link className="btn" href="/work-report">Reset</Link>
        </div>
      </form>

      <div className="card" style={{ marginTop: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 900, margin: 0 }}>Dettaglio righe</h2>

        <div className="muted" style={{ marginTop: 8 }}>
          Totale righe: <b>{rows.length}</b>
        </div>

        <table className="table" style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Cliente</th>
              <th>Voce</th>
              <th>Tipo</th>
              <th>Importo</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const d = r.date ? new Date(r.date) : null;

              return (
                <tr key={r.id}>
                  <td>{d ? d.toLocaleDateString("it-IT") : "—"}</td>
                  <td>{r.clientName}</td>
                  <td>{r.serviceName}</td>
                  <td>
                    <span
                      style={{
                        display: "inline-flex",
                        padding: "3px 8px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 800,
                        background:
                          r.sourceType === "PRATICA"
                            ? "rgba(245,158,11,0.12)"
                            : "rgba(59,130,246,0.12)",
                        color:
                          r.sourceType === "PRATICA" ? "#92400e" : "#1d4ed8",
                        border:
                          r.sourceType === "PRATICA"
                            ? "1px solid rgba(245,158,11,0.28)"
                            : "1px solid rgba(59,130,246,0.28)",
                      }}
                    >
                      {r.sourceType}
                    </span>
                  </td>
                  <td><b>{eur(r.amount)}</b></td>
                  <td style={{ maxWidth: 420, whiteSpace: "normal", wordBreak: "break-word" }}>
                    {r.notes ?? ""}
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="muted">Nessuna riga per i filtri selezionati.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}