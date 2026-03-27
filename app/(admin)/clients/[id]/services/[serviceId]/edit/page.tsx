import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { markClientServiceDone } from "@/app/actions/clientServices";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const STATI = ["DA_FARE", "SVOLTO", "IN_CORSO", "SOSPESO", "FATTURATO"] as const;
const PRIORITA = ["BASSA", "MEDIA", "ALTA"] as const;
const PERIODICITA = ["ANNUALE", "SEMESTRALE", "BIENNALE", "TRIENNALE", "QUINQUENNALE"] as const;
const REFERENTI_RX = ["DE ROSE", "IANNARELLA", "PHSC"] as const;

function fmtDate(d: Date | null) {
  return d ? new Date(d).toISOString().slice(0, 10) : "";
}

function fmtHuman(d: Date | null) {
  return d ? new Date(d).toLocaleDateString("it-IT") : "—";
}

function toPercString(v: any) {
  if (v == null) return "";
  const s = String(v?.toString?.() ?? v).trim();
  return s;
}

export default async function EditClientServicePage({
  params,
  searchParams,
}: {
  params: { id: string; serviceId: string };
  searchParams?: { err?: string };
}) {
  const { prisma } = await import("@/lib/prisma");

  const cs = await prisma.clientService.findUnique({
    where: { id: params.serviceId },
    include: { client: true, service: true, site: true },
  });

  if (!cs) return notFound();
  if (cs.clientId !== params.id) return notFound();

  const clientId = cs.clientId;
  const clientServiceId = cs.id;

  const [services, sites] = await Promise.all([
    prisma.serviceCatalog.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.clientSite.findMany({
      where: { clientId },
      orderBy: { name: "asc" },
    }),
  ]);

  async function updateCS(formData: FormData) {
    "use server";

    const { prisma } = await import("@/lib/prisma");

    const safeClientId = params.id;
    const safeClientServiceId = params.serviceId;

    const serviceId = String(formData.get("serviceId") ?? "").trim();
    const siteIdRaw = String(formData.get("siteId") ?? "").trim();
    const dueDateRaw = String(formData.get("dueDate") ?? "").trim();

    const status = String(formData.get("status") ?? "DA_FARE").trim() || "DA_FARE";
    const priority = String(formData.get("priority") ?? "MEDIA").trim() || "MEDIA";
    const periodicity = String(formData.get("periodicity") ?? "ANNUALE").trim() || "ANNUALE";

    const priceRaw = String(formData.get("priceEur") ?? "").trim();
    const notes = String(formData.get("notes") ?? "").trim() || null;

    const referenteNameRaw = String(formData.get("referenteName") ?? "").trim().toUpperCase();
    const referenteCustomRaw = String(formData.get("referenteCustom") ?? "").trim().toUpperCase();
    const referentePercRaw = String(formData.get("referentePerc") ?? "").trim();

    const rxEndRaw = String(formData.get("rxEndoralCount") ?? "").trim();
    const rxOptRaw = String(formData.get("rxOptCount") ?? "").trim();

    const rxEndoralCount = rxEndRaw ? Number(rxEndRaw) : null;
    const rxOptCount = rxOptRaw ? Number(rxOptRaw) : null;

    const priceEur = priceRaw ? new Prisma.Decimal(priceRaw.replace(",", ".")) : null;

    const selectedService = await prisma.serviceCatalog.findUnique({
      where: { id: serviceId },
      select: { name: true },
    });

    const isRxSelected = String(selectedService?.name ?? "").trim().toUpperCase() === "RX";

    let referenteName: string | null = null;
    if (isRxSelected) {
      referenteName =
        referenteNameRaw === "__ALTRO__"
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

    const data: any = {
      service: { connect: { id: serviceId } },
      dueDate: dueDateRaw ? new Date(dueDateRaw) : null,
      status: status as any,
      priority: priority as any,
      periodicity: periodicity as any,
      priceEur,
      notes,
      rxEndoralCount,
      rxOptCount,
      referenteName,
      referentePerc,
      source: referenteName,
    };

    if (siteIdRaw) {
      data.site = { connect: { id: siteIdRaw } };
    } else {
      data.site = { disconnect: true };
    }

    try {
      await prisma.clientService.update({
        where: { id: safeClientServiceId },
        data,
      });
    } catch (e: any) {
      const msg = encodeURIComponent(e?.message ?? "Errore salvataggio");
      redirect(`/clients/${safeClientId}/services/${safeClientServiceId}/edit?err=${msg}`);
    }

    redirect(`/clients/${safeClientId}`);
  }

  const rxEnd = (cs as any).rxEndoralCount ?? "";
  const rxOpt = (cs as any).rxOptCount ?? "";
  const referenteValue = String((cs as any).referenteName ?? "").trim().toUpperCase();
  const referentePercValue = toPercString((cs as any).referentePerc);

  const isKnownReferente = REFERENTI_RX.includes(referenteValue as any);
  const referenteSelectValue = referenteValue
    ? isKnownReferente
      ? referenteValue
      : "__ALTRO__"
    : "";

  const referenteCustomValue = referenteValue && !isKnownReferente ? referenteValue : "";

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Modifica mantenimento</h1>
        <Link className="btn" href={`/clients/${clientId}`}>
          ← Torna al cliente
        </Link>
      </div>

      {searchParams?.err ? (
        <div className="card" style={{ marginTop: 12, border: "1px solid #ff6b6b" }}>
          <b style={{ color: "#ff6b6b" }}>Errore:</b> {decodeURIComponent(searchParams.err)}
        </div>
      ) : null}

      <div className="card" style={{ marginTop: 12 }}>
        Cliente: <b>{cs.client.name}</b>
        <div style={{ marginTop: 6 }}>
          Servizio attuale: <b>{cs.service?.name ?? ""}</b>
        </div>
        <div style={{ marginTop: 6 }}>
          Sede attuale: <b>{cs.site?.name ?? "—"}</b>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <b>Azioni rapide</b>
          <div className="muted" style={{ fontSize: 13 }}>
            Ultimo svolto: <b>{fmtHuman((cs as any).lastDoneAt ?? null)}</b>
          </div>
        </div>

        <form action={markClientServiceDone} className="row" style={{ marginTop: 10, gap: 8 }}>
          <input type="hidden" name="clientId" value={clientId} />
          <input type="hidden" name="clientServiceId" value={clientServiceId} />
          <input type="hidden" name="redirectPath" value={`/clients/${clientId}`} />

          <button className="btn primary" type="submit">
            FATTO (SVOLTO + nuova scadenza)
          </button>

          <div className="muted" style={{ marginTop: 6 }}>
            Ricalcolo scadenza: oggi + periodicità ({String((cs as any).periodicity ?? "ANNUALE")})
          </div>
        </form>
      </div>

      <form action={updateCS} className="card" style={{ marginTop: 12 }}>
        <div>
          <label>Servizio</label>
          <select
            className="input"
            name="serviceId"
            defaultValue={(cs as any).serviceId ?? cs.service?.id ?? ""}
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Sede</label>
          <select className="input" name="siteId" defaultValue={cs.siteId ?? ""}>
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
            <input className="input" type="date" name="dueDate" defaultValue={fmtDate(cs.dueDate)} />
          </div>
          <div>
            <label>Prezzo (€)</label>
            <input className="input" name="priceEur" defaultValue={cs.priceEur ? String(cs.priceEur) : ""} />
          </div>
          <div>
            <label>Periodicità</label>
            <select className="input" name="periodicity" defaultValue={(cs as any).periodicity ?? "ANNUALE"}>
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
            <select className="input" name="status" defaultValue={cs.status as any}>
              {STATI.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Priorità</label>
            <select className="input" name="priority" defaultValue={cs.priority as any}>
              {PRIORITA.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div />
        </div>

        <div className="grid3" style={{ marginTop: 12 }}>
          <div>
            <label>Referente</label>
            <select
              className="input"
              name="referenteName"
              defaultValue={referenteSelectValue}
            >
              <option value="">— Nessuno</option>
              {REFERENTI_RX.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
              <option value="__ALTRO__">ALTRO</option>
            </select>
            <div className="muted" style={{ marginTop: 6 }}>
              Valido per il servizio RX. Se scegli RX in questa schermata puoi compilarlo subito.
            </div>
          </div>

          <div>
            <label>Altro referente</label>
            <input
              className="input"
              name="referenteCustom"
              defaultValue={referenteCustomValue}
              placeholder="Scrivi nome referente"
            />
          </div>

          <div>
            <label>% referente</label>
            <input
              className="input"
              name="referentePerc"
              defaultValue={referentePercValue}
              placeholder="Es: 40"
            />
            <div className="muted" style={{ marginTop: 6 }}>
              PHSC viene salvato a 0.
            </div>
          </div>
        </div>

        <div className="grid3" style={{ marginTop: 12 }}>
          <div>
            <label>RX Endorale (n°)</label>
            <input className="input" type="number" min={0} name="rxEndoralCount" defaultValue={rxEnd} />
          </div>
          <div>
            <label>RX OPT (n°)</label>
            <input className="input" type="number" min={0} name="rxOptCount" defaultValue={rxOpt} />
          </div>
          <div className="muted" style={{ marginTop: 28 }}>
            Compila solo se il servizio è RX.
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Note</label>
          <textarea className="input" name="notes" rows={5} defaultValue={cs.notes ?? ""} />
        </div>

        <div className="row" style={{ marginTop: 14, justifyContent: "space-between" }}>
          <div className="row">
            <button className="btn primary" type="submit">
              Salva
            </button>
            <Link className="btn" href={`/clients/${clientId}`}>
              Annulla
            </Link>
          </div>

          <Link
            className="btn"
            href={`/clients/${clientId}/services/${clientServiceId}/delete`}
            style={{ border: "1px solid #ff6b6b", color: "#ff6b6b" }}
          >
            Elimina
          </Link>
        </div>
      </form>
    </div>
  );
}