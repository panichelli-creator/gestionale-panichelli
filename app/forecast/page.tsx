import { prisma } from "@/lib/prisma";

function euro(n: any) {
  if (n == null) return "€0";
  const v = Number(n);
  if (Number.isNaN(v)) return "€0";
  return v.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

export default async function ForecastPage() {
  const services = await prisma.clientService.findMany({
    include: { client: true, service: true },
  });

  // MVP rule: forecast value in the month of dueDate
  const map = new Map<string, number>();
  for (const s of services) {
    if (!s.dueDate || !s.priceEur) continue;
    const d = new Date(s.dueDate);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
    map.set(key, (map.get(key) ?? 0) + Number(s.priceEur));
  }

  const rows = Array.from(map.entries()).sort((a,b)=>a[0].localeCompare(b[0]));

  const total = rows.reduce((acc,r)=>acc+r[1],0);

  return (
    <div className="card">
      <h1>Previsionale fatturato (Mantenimenti)</h1>
      <p className="muted">
        Regola MVP: ogni mantenimento pesa sul mese della scadenza/rinnovo. Nel prossimo step possiamo aggiungere “mese fatturazione” o rateizzazioni.
      </p>

      <table className="table" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>Mese</th>
            <th>Totale</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([m, v]) => (
            <tr key={m}>
              <td>{m}</td>
              <td><b>{euro(v)}</b></td>
            </tr>
          ))}
          {rows.length === 0 ? (
            <tr><td colSpan={2} className="muted">Nessun dato. Aggiungi mantenimenti ai clienti o importa.</td></tr>
          ) : null}
        </tbody>
      </table>

      <div className="muted" style={{ marginTop: 12 }}>Totale annuo (somma righe): <b>{euro(total)}</b></div>
    </div>
  );
}
