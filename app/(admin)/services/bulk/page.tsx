import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

async function bulkUpdate(formData: FormData) {
  "use server";

  const serviceId = String(formData.get("serviceId") || "");
  const status = String(formData.get("status") || "ATTIVO"); // per default solo attivi
  const setPriceStr = String(formData.get("setPrice") || "").replace(",", ".").trim();
  const setPeriodicity = String(formData.get("setPeriodicity") || "").trim();
  const setAlertMonthsStr = String(formData.get("setAlertMonths") || "").trim();

  // Opzionale: sposta tutte le scadenze di +N mesi (es. +12)
  const shiftMonthsStr = String(formData.get("shiftMonths") || "").trim();

  if (!serviceId) throw new Error("Seleziona un servizio.");

  const data: any = {};
  if (setPriceStr) data.priceEur = setPriceStr as any;
  if (setPeriodicity) data.periodicity = setPeriodicity;
  if (setAlertMonthsStr) data.alertMonths = Number(setAlertMonthsStr);

  // Aggiorna righe
  const where: any = {
    serviceId,
  };
  if (status !== "TUTTI") where.client = { status };

  // 1) update semplice su campi
  if (Object.keys(data).length > 0) {
    await prisma.clientService.updateMany({ where, data });
  }

  // 2) shift scadenze (se richiesto)
  const shiftMonths = shiftMonthsStr ? Number(shiftMonthsStr) : 0;
  if (shiftMonths && Number.isFinite(shiftMonths)) {
    const rows = await prisma.clientService.findMany({
      where,
      select: { id: true, dueDate: true },
    });

    for (const r of rows) {
      if (!r.dueDate) continue;
      const d = new Date(r.dueDate);
      d.setMonth(d.getMonth() + shiftMonths);
      await prisma.clientService.update({
        where: { id: r.id },
        data: { dueDate: d },
      });
    }
  }

  redirect("/clients");
}

export default async function BulkServicesPage() {
  const services = await prisma.serviceCatalog.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Modifica mantenimenti (bulk)</h1>
        <Link className="btn" href="/clients">← Torna ai Clienti</Link>
      </div>

      <p className="muted" style={{ marginTop: 8 }}>
        Qui aggiorni in blocco i mantenimenti di un servizio (es. aumentare prezzo DVR per tutti gli attivi, o spostare di +12 mesi le scadenze).
      </p>

      <form action={bulkUpdate} className="card" style={{ marginTop: 12 }}>
        <div className="grid2">
          <div>
            <label>Servizio</label>
            <select className="input" name="serviceId" defaultValue="">
              <option value="" disabled>Seleziona...</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Applica a clienti</label>
            <select className="input" name="status" defaultValue="ATTIVO">
              <option value="ATTIVO">Solo ATTIVI</option>
              <option value="DISMESSO">Solo DISMESSI</option>
              <option value="TUTTI">Tutti</option>
            </select>
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <label>Imposta nuovo prezzo (€) (opzionale)</label>
            <input className="input" name="setPrice" placeholder="Es. 450" />
          </div>

          <div>
            <label>Imposta periodicità (opzionale)</label>
            <select className="input" name="setPeriodicity" defaultValue="">
              <option value="">(non cambiare)</option>
              <option value="ANNUALE">ANNUALE</option>
              <option value="BIENNALE">BIENNALE</option>
              <option value="TRIENNALE">TRIENNALE</option>
              <option value="QUINQUENNALE">QUINQUENNALE</option>
            </select>
          </div>

          <div>
            <label>Imposta alert mesi (opzionale)</label>
            <input className="input" name="setAlertMonths" placeholder="Es. 1" />
          </div>

          <div>
            <label>Sposta scadenze di N mesi (opzionale)</label>
            <input className="input" name="shiftMonths" placeholder="Es. 12 (per +1 anno)" />
          </div>
        </div>

        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn primary" type="submit">Applica modifiche</button>
        </div>

        <p className="muted" style={{ marginTop: 10 }}>
          Nota: lo “sposta scadenze” modifica solo le righe che hanno una scadenza valorizzata.
        </p>
      </form>
    </div>
  );
}