import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import {
  ensureLegionellaService,
  ensureInvioRegioneLazioService,
  upsertServiceCatalogByNameInsensitive,
} from "@/app/actions/serviceCatalog";

const STATI = ["DA_FARE", "SVOLTO", "IN_CORSO", "SOSPESO"] as const;
const PRIORITA = ["BASSA", "MEDIA", "ALTA"] as const;
const PERIODICITA = ["ANNUALE", "SEMESTRALE", "BIENNALE", "TRIENNALE", "QUINQUENNALE"] as const;
const REFERENTI_RX = ["DE ROSE", "IANNARELLA", "PHSC"] as const;

const ALERT_DEFAULT = 2;
const ALTRO_VALUE = "__ALTRO__";

export default async function NewClientServicePage({
  params,
}: {
  params: { id: string };
}) {
  await ensureLegionellaService();
  await ensureInvioRegioneLazioService();

  const client = await prisma.client.findUnique({ where: { id: params.id } });
  if (!client) redirect("/clients");

  const [servicesRaw, sites] = await Promise.all([
    prisma.serviceCatalog.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.clientSite.findMany({
      where: { clientId: params.id },
      orderBy: { name: "asc" },
    }),
  ]);

  const seen = new Set<string>();
  const services = servicesRaw.filter((s) => {
    const key = (s.name ?? "").trim().toUpperCase();
    if (!key) return false;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  async function createCS(formData: FormData) {
    "use server";

    const clientId = params.id;

    let serviceId = String(formData.get("serviceId") ?? "").trim();
    const otherServiceNameRaw = String(formData.get("otherServiceName") ?? "").trim();

    if (serviceId === ALTRO_VALUE) {
      if (!otherServiceNameRaw) {
        throw new Error("Hai selezionato ALTRO: inserisci il nome del servizio.");
      }

      serviceId = await upsertServiceCatalogByNameInsensitive(otherServiceNameRaw);
    }

    if (!serviceId) {
      throw new Error("Seleziona un servizio.");
    }

    const selectedService = await prisma.serviceCatalog.findUnique({
      where: { id: serviceId },
      select: { name: true },
    });

    const isRxSelected = String(selectedService?.name ?? "").trim().toUpperCase() === "RX";

    const siteIdRaw = String(formData.get("siteId") ?? "").trim();
    const siteId = siteIdRaw || null;

    const dueDateRaw = String(formData.get("dueDate") ?? "").trim();

    const status = String(formData.get("status") ?? "").trim() || "DA_FARE";
    const priority = String(formData.get("priority") ?? "").trim() || "MEDIA";
    const periodicity = String(formData.get("periodicity") ?? "").trim() || "ANNUALE";

    const alertMonthsRaw = String(formData.get("alertMonths") ?? "").trim();
    const alertMonthsNum = Number(alertMonthsRaw);
    const alertMonths =
      Number.isFinite(alertMonthsNum) && alertMonthsNum > 0
        ? alertMonthsNum
        : ALERT_DEFAULT;

    const priceRaw = String(formData.get("priceEur") ?? "").trim();
    const notes = String(formData.get("notes") ?? "").trim() || null;

    const referenteNameRaw = String(formData.get("referenteName") ?? "").trim().toUpperCase();
    const referenteCustomRaw = String(formData.get("referenteCustom") ?? "").trim().toUpperCase();
    const referentePercRaw = String(formData.get("referentePerc") ?? "").trim();

    const rxEndRaw = String(formData.get("rxEndoralCount") ?? "").trim();
    const rxOptRaw = String(formData.get("rxOptCount") ?? "").trim();

    const rxEndoralCount = rxEndRaw ? Number(rxEndRaw) : null;
    const rxOptCount = rxOptRaw ? Number(rxOptRaw) : null;

    const priceEur = priceRaw
      ? new Prisma.Decimal(priceRaw.replace(",", "."))
      : null;

    let referenteName: string | null = null;
    if (isRxSelected) {
      referenteName =
        referenteNameRaw === ALTRO_VALUE
          ? referenteCustomRaw || null
          : referenteNameRaw || null;
    }

    let referentePerc: Prisma.Decimal | null = null;
    if (isRxSelected) {
      if (referenteName === "PHSC") {
        referentePerc = new Prisma.Decimal(0);
      } else if (referentePercRaw) {
        referentePerc = new Prisma.Decimal(referentePercRaw.replace(",", "."));
      }
    }

    await prisma.clientService.create({
      data: {
        clientId,
        serviceId,
        siteId,
        dueDate: dueDateRaw ? new Date(dueDateRaw) : null,
        priceEur,
        periodicity: periodicity as any,
        priority: priority as any,
        status: status as any,
        alertMonths,
        notes,
        rxEndoralCount,
        rxOptCount,
        referenteName,
        referentePerc,
        source: referenteName,
      } as any,
    });

    redirect(`/clients/${clientId}`);
  }

  return (
    <div className="card">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <h1>Nuovo mantenimento</h1>
        <Link className="btn" href={`/clients/${params.id}`}>
          ← Torna al cliente
        </Link>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        Cliente: <b>{client.name}</b>
      </div>

      <form action={createCS} className="card" style={{ marginTop: 12 }}>
        <div>
          <label>Servizio</label>
          <select
            className="input"
            name="serviceId"
            defaultValue={services[0]?.id ?? ""}
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {(s.name ?? "").toUpperCase()}
              </option>
            ))}
            <option value={ALTRO_VALUE}>ALTRO (scrivi sotto)</option>
          </select>
        </div>

        <div style={{ marginTop: 10 }}>
          <label>Se hai scelto ALTRO: nome servizio</label>
          <input
            className="input"
            name="otherServiceName"
            placeholder='Es: "Ricarica cellulare" / "Invio Regione Lazio"'
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Sede</label>
          <select className="input" name="siteId" defaultValue="">
            <option value="">— Nessuna sede / generale cliente</option>
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid3" style={{ marginTop: 12 }}>
          <div>
            <label>Scadenza</label>
            <input className="input" type="date" name="dueDate" />
          </div>
          <div>
            <label>Prezzo (€)</label>
            <input className="input" name="priceEur" placeholder="es: 600" />
          </div>
          <div>
            <label>Periodicità</label>
            <select className="input" name="periodicity" defaultValue="ANNUALE">
              {PERIODICITA.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid3" style={{ marginTop: 12 }}>
          <div>
            <label>Stato</label>
            <select className="input" name="status" defaultValue="DA_FARE">
              {STATI.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Priorità</label>
            <select className="input" name="priority" defaultValue="MEDIA">
              {PRIORITA.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Alert (mesi)</label>
            <input
              className="input"
              type="number"
              min={1}
              name="alertMonths"
              defaultValue={ALERT_DEFAULT}
            />
          </div>
        </div>

        <div className="grid3" style={{ marginTop: 12 }}>
          <div>
            <label>Referente</label>
            <select className="input" name="referenteName" defaultValue="">
              <option value="">— Nessuno</option>
              {REFERENTI_RX.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
              <option value={ALTRO_VALUE}>ALTRO</option>
            </select>
            <div className="muted" style={{ marginTop: 6 }}>
              Usalo per RX: DE ROSE, IANNARELLA, PHSC.
            </div>
          </div>

          <div>
            <label>Altro referente</label>
            <input
              className="input"
              name="referenteCustom"
              placeholder="Scrivi nome referente"
            />
          </div>

          <div>
            <label>% referente</label>
            <input
              className="input"
              name="referentePerc"
              placeholder="Es: 40"
            />
            <div className="muted" style={{ marginTop: 6 }}>
              Per PHSC puoi lasciare vuoto o 0.
            </div>
          </div>
        </div>

        <div className="grid3" style={{ marginTop: 12 }}>
          <div>
            <label>RX Endorale (n°)</label>
            <input className="input" type="number" min={0} name="rxEndoralCount" />
          </div>
          <div>
            <label>RX OPT (n°)</label>
            <input className="input" type="number" min={0} name="rxOptCount" />
          </div>
          <div className="muted" style={{ marginTop: 28 }}>
            Compila solo se il servizio è RX.
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Note</label>
          <textarea
            className="input"
            name="notes"
            rows={4}
            placeholder="Note (facoltative)"
          />
        </div>

        <div className="row" style={{ marginTop: 14 }}>
          <button className="btn primary" type="submit">
            Salva
          </button>
          <Link className="btn" href={`/clients/${params.id}`}>
            Annulla
          </Link>
        </div>
      </form>
    </div>
  );
}
