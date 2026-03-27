import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SP = {
  q?: string;
  clientId?: string;
  serviceId?: string;
  status?: string;
  from?: string;
  to?: string;
  rx?: "TUTTI" | "QUALSIASI_RX" | "ENDORALI" | "OPT";
  print?: string;
};

function toDateStart(s?: string) {
  if (!s) return null;
  const d = new Date(s + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}
function toDateEndExclusive(s?: string) {
  if (!s) return null;
  const d = new Date(s + "T00:00:00");
  if (isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + 1);
  return d;
}
function euro(n: any) {
  const v = Number(n ?? 0);
  return v.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

export default async function MantenimentiPage({ searchParams }: { searchParams: SP }) {
  const q = (searchParams.q ?? "").trim();
  const clientId = (searchParams.clientId ?? "").trim();
  const serviceId = (searchParams.serviceId ?? "").trim();
  const status = (searchParams.status ?? "TUTTI").trim();
  const rx = (searchParams.rx ?? "TUTTI").trim() as any;
  const print = (searchParams.print ?? "") === "1";

  const today = new Date();
  const defFrom = today.toISOString().slice(0, 10);
  const plus90 = new Date(today); plus90.setDate(plus90.getDate() + 90);
  const defTo = plus90.toISOString().slice(0, 10);

  const fromStr = (searchParams.from ?? defFrom).trim();
  const toStr = (searchParams.to ?? defTo).trim();
  const from = toDateStart(fromStr);
  const toExcl = toDateEndExclusive(toStr);

  const clients = await prisma.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });
  const servicesCatalog = await prisma.serviceCatalog.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const where: any = {};
  if (from && toExcl) where.dueDate = { gte: from, lt: toExcl };
  if (serviceId) where.serviceId = serviceId;
  if (status !== "TUTTI") where.status = status;
  if (clientId) where.clientId = clientId;
  if (q) where.client = { name: { contains: q } };

  // RX filter: se nel tuo DB i campi non esistono ancora, questa parte NON esplode perché Prisma fallirebbe.
  // Quindi: se non hai ancora rxEndoraleCount/rxOptCount nel model, dimmelo e la adeguo al tuo schema reale.
  if (rx === "QUALSIASI_RX") {
    where.OR = [{ rxEndoraleCount: { gt: 0 } }, { rxOptCount: { gt: 0 } }];
  } else if (rx === "ENDORALI") {
    where.rxEndoraleCount = { gt: 0 };
  } else if (rx === "OPT") {
    where.rxOptCount = { gt: 0 };
  }

  const rows = await prisma.clientService.findMany({
    where,
    include: { client: true, service: true },
    orderBy: [{ dueDate: "asc" }, { client: { name: "asc" } }],
  });

  let tot = 0;
  let totEnd = 0;
  let totOpt = 0;
  for (const r of rows) {
    tot += Number(r.priceEur ?? 0);
    totEnd += (r as any).rxEndoraleCount ?? 0;
    totOpt += (r as any).rxOptCount ?? 0;
  }

  const printUrl = `/services/scadenze?from=${encodeURIComponent(fromStr)}&to=${encodeURIComponent(toStr)}&serviceId=${encodeURIComponent(serviceId)}&clientId=${encodeURIComponent(clientId)}&q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}&rx=${encodeURIComponent(rx)}&print=1`;

  return (
    <div className="card">
      <div className="row no-print" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Mantenimenti • Scadenze servizi</h1>
        <Link className="btn" href={printUrl}>Stampa</Link>
      </div>

      {!print ? (
        <form method="GET" className="card no-print" style={{ marginTop: 12 }}>
          <div className="grid2">
            <div>
              <label>Da</label>
              <input className="input" type="date" name="from" defaultValue={fromStr} />
            </div>
            <div>
              <label>A</label>
              <input className="input" type="date" name="to" defaultValue={toStr} />
            </div>
          </div>

          <div className="grid2" style={{ marginTop: 12 }}>
            <div>
              <label>Servizio</label>
              <select className="input" name="serviceId" defaultValue={serviceId}>
                <option value="">Tutti</option>
                {servicesCatalog.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label>Cliente</label>
              <select className="input" name="clientId" defaultValue={clientId}>
                <option value="">Tutti</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid2" style={{ marginTop: 12 }}>
            <div>
              <label>Cerca cliente</label>
              <input className="input" name="q" defaultValue={q} placeholder="Nome cliente..." />
            </div>
            <div>
              <label>Stato</label>
              <select className="input" name="status" defaultValue={status}>
                <option value="TUTTI">Tutti</option>
                <option value="DA_FARE">DA_FARE</option>
                <option value="SVOLTO">SVOLTO</option>
                <option value="IN_CORSO">IN_CORSO</option>
                <option value="SOSPESO">SOSPESO</option>
              </select>
            </div>
          </div>

          <div className="grid2" style={{ marginTop: 12 }}>
            <div>
              <label>Filtro RX</label>
              <select className="input" name="rx" defaultValue={rx}>
                <option value="TUTTI">Nessun filtro RX</option>
                <option value="QUALSIASI_RX">Solo righe con RX (endo o opt)</option>
                <option value="ENDORALI">Solo Endorali</option>
                <option value="OPT">Solo OPT</option>
              </select>
            </div>
            <div />
          </div>

          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn primary" type="submit">Applica</button>
            <Link className="btn" href="/services/scadenze">Reset</Link>
          </div>
        </form>
      ) : null}

      <div className="grid2" style={{ marginTop: 12 }}>
        <div className="card">
          <h2>Totali</h2>
          <div className="muted">Righe: <b>{rows.length}</b></div>
          <div className="muted">Somma prezzi: <b>{euro(tot)}</b></div>
          <div className="muted">RX End: <b>{totEnd}</b> • RX OPT: <b>{totOpt}</b></div>
        </div>
        <div className="card">
          <h2>Nota</h2>
          <div className="muted">Questa pagina è SOLO mantenimenti (non formazione).</div>
        </div>
      </div>

      <table className="table" style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th>Scadenza</th>
            <th>Servizio</th>
            <th>Cliente</th>
            <th>Prezzo</th>
            <th>Stato</th>
            <th>RX End</th>
            <th>RX OPT</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.dueDate ? new Date(r.dueDate).toLocaleDateString("it-IT") : ""}</td>
              <td>{r.service.name}</td>
              <td><Link href={`/clients/${r.clientId}`}>{r.client.name}</Link></td>
              <td>{euro(r.priceEur)}</td>
              <td>{r.status}</td>
              <td>{(r as any).rxEndoraleCount ?? ""}</td>
              <td>{(r as any).rxOptCount ?? ""}</td>
            </tr>
          ))}
          {rows.length === 0 ? <tr><td colSpan={7} className="muted">Nessun dato.</td></tr> : null}
        </tbody>
      </table>

      <style>{`@media print{.no-print{display:none!important} body{background:#fff!important}}`}</style>
    </div>
  );
}