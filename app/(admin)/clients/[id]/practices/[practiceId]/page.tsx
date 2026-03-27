import Link from "next/link";
import { notFound } from "next/navigation";


export const dynamic = "force-dynamic";
export const revalidate = 0;

function fmt(d: Date | null | undefined) {
  return d ? new Date(d).toLocaleDateString("it-IT") : "—";
}

function fmtYear(v: number | null | undefined) {
  return v ? String(v) : "—";
}

function fmtEur(v: any) {
  if (v == null || v === "") return "—";
  const n = Number(String(v).replace(",", "."));
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

function toNum(v: any) {
  if (v == null || v === "") return 0;
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function practiceStatusLabel(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();

  if (s === "INVIATA_REGIONE") return "Inviata Regione";
  if (s === "INIZIO_LAVORI") return "Inizio lavori";
  if (s === "ACCETTATO") return "Accettato";
  if (s === "ISPEZIONE_ASL") return "Ispezione ASL";
  if (s === "IN_ATTESA") return "In attesa";
  if (s === "CONCLUSO") return "Concluso";

  return s || "—";
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

function getPracticeTotal(p: any) {
  const candidates = [
    p?.costoPraticaEur,
    p?.practiceAmountEur,
    p?.totalAmountEur,
    p?.priceEur,
    p?.totalEur,
    p?.amountEur,
    p?.clientPriceEur,
    p?.valueEur,
    p?.price,
    p?.total,
    p?.amount,
  ];

  for (const v of candidates) {
    const n = Number(String(v ?? "").replace(",", "."));
    if (Number.isFinite(n) && n !== 0) return n;
  }

  return 0;
}

function extractPaymentRows(p: any) {
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

    const paidYearRaw =
      item.paidYear ??
      item.year ??
      item.anno ??
      (paidAt ? paidAt.getFullYear() : null);

    const paidYear =
      paidYearRaw == null || paidYearRaw === ""
        ? null
        : Number.isFinite(Number(paidYearRaw))
        ? Number(paidYearRaw)
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

  const scalarCandidates = [
    {
      label: "Acconto",
      amount: toNum(
        p?.accontoEur ??
          p?.acceptanceAmountEur ??
          p?.downPaymentEur ??
          p?.depositEur
      ),
      paidAt:
        parseMaybeDate(p?.accontoDate) ??
        parseMaybeDate(p?.acceptanceDate) ??
        parseMaybeDate(p?.downPaymentDate),
      paidYear:
        p?.accontoYear ??
        p?.acceptanceYear ??
        p?.downPaymentYear ??
        null,
      notes: String(p?.accontoNotes ?? "").trim(),
    },
    {
      label: "Saldo",
      amount: toNum(
        p?.saldoEur ??
          p?.balanceEur ??
          p?.finalAmountEur
      ),
      paidAt:
        parseMaybeDate(p?.saldoDate) ??
        parseMaybeDate(p?.balanceDate) ??
        parseMaybeDate(p?.finalPaymentDate),
      paidYear:
        p?.saldoYear ??
        p?.balanceYear ??
        p?.finalPaymentYear ??
        null,
      notes: String(p?.saldoNotes ?? "").trim(),
    },
  ];

  for (const item of scalarCandidates) {
    const paidYear =
      item.paidYear == null || item.paidYear === ""
        ? item.paidAt
          ? item.paidAt.getFullYear()
          : null
        : Number.isFinite(Number(item.paidYear))
        ? Number(item.paidYear)
        : null;

    if (item.amount > 0 || item.paidAt || item.notes) {
      rows.push({
        label: item.label,
        amount: item.amount,
        paidAt: item.paidAt,
        paidYear,
        notes: item.notes,
      });
    }
  }

  return rows.sort((a, b) => {
    const at = a.paidAt ? a.paidAt.getTime() : Number.MAX_SAFE_INTEGER;
    const bt = b.paidAt ? b.paidAt.getTime() : Number.MAX_SAFE_INTEGER;
    return at - bt;
  });
}

export default async function PracticeDetailPage({
  params,
}: {
  params: { id: string; practiceId: string };
}) {
  const { prisma } = await import("@/lib/prisma");
  const p = await prisma.clientPractice.findUnique({
    where: { id: params.practiceId },
    include: { client: true },
  });

  if (!p) return notFound();
  if (p.clientId !== params.id) return notFound();

  const practiceAny = p as any;
  const totalPracticeAmount = getPracticeTotal(practiceAny);
  const paymentRows = extractPaymentRows(practiceAny);
  const totalPaid = paymentRows.reduce((acc, row) => acc + row.amount, 0);
  const remaining = Math.max(totalPracticeAmount - totalPaid, 0);

  return (
    <div className="card">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <h1>Pratica</h1>

        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href={`/clients/${params.id}`}>
            ← Torna al cliente
          </Link>

          <Link
            className="btn"
            href={`/clients/${params.id}/practices/${params.practiceId}/edit`}
          >
            Modifica
          </Link>

          <Link
            className="btn"
            href={`/clients/${params.id}/practices/${params.practiceId}/delete`}
          >
            Elimina
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        Cliente: <b>{p.client.name}</b>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="grid2">
          <div>
            <div className="muted">Pratica</div>
            <div>
              <b>{p.title}</b>
            </div>
          </div>

          <div>
            <div className="muted">Data</div>
            <div>{fmt(p.practiceDate)}</div>
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <div className="muted">Numero determina</div>
            <div>{p.determinaNumber ?? "—"}</div>
          </div>

          <div>
            <div className="muted">Lista Aperture</div>
            <div>{practiceAny.inApertureList ? "SI" : "NO"}</div>
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <div className="muted">Stato</div>
            <div>{practiceStatusLabel(practiceAny.apertureStatus)}</div>
          </div>

          <div>
            <div className="muted">Anno inizio</div>
            <div>{fmtYear(practiceAny.startYear)}</div>
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <div className="muted">Creata il</div>
            <div>{fmt(p.createdAt)}</div>
          </div>

          <div>
            <div className="muted">Ultimo aggiornamento</div>
            <div>{fmt(p.updatedAt)}</div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="muted">Note</div>
          <div>{p.notes ?? "—"}</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h2 style={{ marginBottom: 10 }}>Riepilogo economico</h2>

        <div className="grid3">
          <div>
            <div className="muted">Costo pratica</div>
            <div>
              <b>{totalPracticeAmount > 0 ? fmtEur(totalPracticeAmount) : "—"}</b>
            </div>
          </div>

          <div>
            <div className="muted">Totale incassato</div>
            <div>
              <b>{totalPaid > 0 ? fmtEur(totalPaid) : "—"}</b>
            </div>
          </div>

          <div>
            <div className="muted">Residuo</div>
            <div>
              <b>{totalPracticeAmount > 0 ? fmtEur(remaining) : "—"}</b>
            </div>
          </div>
        </div>

        <div className="muted" style={{ marginTop: 10 }}>
          Qui sotto vedi acconti, saldi ed eventuali pagamenti intermedi con data e anno del pagamento.
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div
          className="row"
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <h2>Pagamenti pratica</h2>

          <Link
            className="btn"
            href={`/clients/${params.id}/practices/${params.practiceId}/edit`}
          >
            Gestisci pagamenti
          </Link>
        </div>

        {paymentRows.length ? (
          <table className="table" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>Voce</th>
                <th>Importo</th>
                <th>Data pagamento</th>
                <th>Anno fatturato</th>
                <th>Note</th>
              </tr>
            </thead>

            <tbody>
              {paymentRows.map((row, idx) => (
                <tr key={`${row.label}-${idx}`}>
                  <td>
                    <b>{row.label}</b>
                  </td>
                  <td>{row.amount > 0 ? fmtEur(row.amount) : "—"}</td>
                  <td>{fmt(row.paidAt)}</td>
                  <td>{fmtYear(row.paidYear)}</td>
                  <td style={{ maxWidth: 360, whiteSpace: "normal", wordBreak: "break-word" }}>
                    {row.notes || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="muted" style={{ marginTop: 10 }}>
            Nessun pagamento inserito.
          </div>
        )}
      </div>
    </div>
  );
}