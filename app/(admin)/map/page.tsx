import Link from "next/link";
import dynamicImport from "next/dynamic";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SP = {
  ym?: string;
  service?: string;
};

type PlanStatus =
  | "DA_FARE"
  | "APPUNTAMENTO_PRESO"
  | "SVOLTO"
  | "RINVIATO_DA_LORO"
  | "RINVIATO_DA_NOI";

type MarkerRow = {
  id: string;
  clientServiceId: string;
  clientId: string;
  clientName: string;
  serviceName: string;
  siteName: string;
  address: string;
  dueDate: string;
  dueDateRaw: Date | null | undefined;
  referenteName: string;
  referenteRole: string;
  referentePhone: string;
  clientPhone: string;
  mapsUrl: string;
  lat: number;
  lng: number;
  planStatus: PlanStatus;
  plannedDate: Date | null;
  planNotes: string;
  siteId: string | null;
  rxEndoralCount: number;
  rxOptCount: number;
};

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);

  if (d.getDate() < day) {
    d.setDate(0);
  }

  return d;
}

function calcNextDueDate(fromDate: Date, periodicity: string | null | undefined) {
  const p = String(periodicity ?? "").trim().toUpperCase();

  if (p === "SEMESTRALE") return addMonths(fromDate, 6);
  if (p === "ANNUALE") return addMonths(fromDate, 12);
  if (p === "BIENNALE") return addMonths(fromDate, 24);
  if (p === "TRIENNALE") return addMonths(fromDate, 36);
  if (p === "QUINQUENNALE") return addMonths(fromDate, 60);

  return addMonths(fromDate, 12);
}

function normalizePlanStatus(value: string | null | undefined): PlanStatus {
  const raw = String(value ?? "").trim().toUpperCase();

  if (raw === "SVOLTO") return "SVOLTO";
  if (raw === "APPUNTAMENTO_PRESO") return "APPUNTAMENTO_PRESO";
  if (raw === "RINVIATO_DA_LORO") return "RINVIATO_DA_LORO";
  if (raw === "RINVIATO_DA_NOI") return "RINVIATO_DA_NOI";

  if (raw === "RINVIATO") return "RINVIATO_DA_LORO";

  return "DA_FARE";
}

async function saveMapPlanItem(formData: FormData) {
  "use server";

  const { prisma } = await import("@/lib/prisma");

  const ym = String(formData.get("ym") ?? "").trim();
  const clientServiceId = String(formData.get("clientServiceId") ?? "").trim();
  const clientId = String(formData.get("clientId") ?? "").trim();
  const siteIdRaw = String(formData.get("siteId") ?? "").trim();
  const returnUrl = String(formData.get("returnUrl") ?? "/map").trim();

  const statusRaw = String(formData.get("planStatus") ?? "DA_FARE").trim();
  const notes = String(formData.get("planNotes") ?? "").trim();
  const plannedDateRaw = String(formData.get("plannedDate") ?? "").trim();

  if (!ym || !clientServiceId || !clientId) {
    redirect(returnUrl || "/map");
  }

  const planStatus = normalizePlanStatus(statusRaw);

  let plannedDate: Date | null = null;
  let plannedDay: number | null = null;

  if (plannedDateRaw) {
    const parsed = new Date(`${plannedDateRaw}T12:00:00`);
    if (!Number.isNaN(parsed.getTime())) {
      plannedDate = parsed;
      plannedDay = parsed.getDate();
    }
  }

  const siteId = siteIdRaw || null;

  await prisma.mapPlanItem.upsert({
    where: {
      ym_clientServiceId: {
        ym,
        clientServiceId,
      },
    },
    create: {
      ym,
      clientServiceId,
      clientId,
      siteId,
      plannedDay,
      plannedDate,
      status: planStatus as any,
      notes,
    },
    update: {
      clientId,
      siteId,
      plannedDay,
      plannedDate,
      status: planStatus as any,
      notes,
    },
  });

  if (planStatus === "SVOLTO") {
    const currentService = await prisma.clientService.findUnique({
      where: { id: clientServiceId },
      select: {
        id: true,
        periodicity: true,
      },
    });

    const doneAt = plannedDate ?? new Date();
    const nextDueDate = calcNextDueDate(doneAt, currentService?.periodicity);

    await prisma.clientService.update({
      where: { id: clientServiceId },
      data: {
        lastDoneAt: doneAt,
        dueDate: nextDueDate,
        status: "SVOLTO",
      },
    });
  }

  revalidatePath("/map");
  revalidatePath(returnUrl || "/map");
  revalidatePath("/maintenance");
  revalidatePath("/clients");
  redirect(returnUrl || "/map");
}

function firstDayOfMonth(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1);
}

function firstDayNextMonth(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m, 1);
}

function safeYm(v?: string) {
  const s = String(v ?? "").trim();
  if (/^\d{4}-\d{2}$/.test(s)) return s;

  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function fmtDate(d: Date | null | undefined) {
  return d ? new Date(d).toLocaleDateString("it-IT") : "—";
}

function ymd(d: Date | null | undefined) {
  if (!d) return "";
  const x = new Date(d);
  const yyyy = x.getFullYear();
  const mm = String(x.getMonth() + 1).padStart(2, "0");
  const dd = String(x.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function buildGoogleMapsQuery(parts: Array<string | null | undefined>) {
  return encodeURIComponent(
    parts
      .map((v) => String(v ?? "").trim())
      .filter(Boolean)
      .join(", ")
  );
}

function pickPreferredContact(
  contacts: Array<{
    name: string;
    phone: string | null;
    role: string;
  }>
) {
  const withPhone = contacts.filter((c) => String(c.phone ?? "").trim());

  if (!withPhone.length) return null;

  return (
    withPhone.find((c) => {
      const role = String(c.role ?? "").toUpperCase();
      return (
        role.includes("REFERENTE") ||
        role.includes("TITOLARE") ||
        role.includes("SEGRETERIA") ||
        role.includes("AMMINISTRAZIONE")
      );
    }) ?? withPhone[0]
  );
}

function pickClientPhone(
  contacts: Array<{
    name: string;
    phone: string | null;
    role: string;
  }>,
  fallbackClientPhone?: string | null
) {
  const direct = String(fallbackClientPhone ?? "").trim();
  if (direct) return direct;

  const preferred = pickPreferredContact(contacts);
  return preferred?.phone?.trim() || "—";
}

function pickReferentePhone(
  contacts: Array<{
    name: string;
    phone: string | null;
    role: string;
  }>,
  fallbackClientPhone?: string | null
) {
  const preferred = pickPreferredContact(contacts);
  if (preferred?.phone?.trim()) return preferred.phone.trim();
  return String(fallbackClientPhone ?? "").trim() || "—";
}

function normalizeReferenteName(value: string | null | undefined) {
  const v = String(value ?? "").trim();
  return v || "—";
}

async function geocodeAddress(address: string) {
  try {
    const url =
      "https://nominatim.openstreetmap.org/search?" +
      new URLSearchParams({
        q: address,
        format: "jsonv2",
        limit: "1",
      }).toString();

    const res = await fetch(url, {
      headers: {
        "User-Agent": "PanichelliHSC/1.0",
      },
      cache: "force-cache",
    });

    if (!res.ok) return null;

    const data = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (!Array.isArray(data) || data.length === 0) return null;

    const lat = Number(data[0].lat);
    const lng = Number(data[0].lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    return { lat, lng };
  } catch {
    return null;
  }
}

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const aa =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(a.lat)) *
      Math.cos(toRad(b.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
  return R * c;
}

function buildNearestRoute(markers: MarkerRow[]) {
  if (markers.length <= 2) return markers;

  const remaining = [...markers].sort((a, b) => {
    const ad = a.dueDateRaw ? new Date(a.dueDateRaw).getTime() : Number.MAX_SAFE_INTEGER;
    const bd = b.dueDateRaw ? new Date(b.dueDateRaw).getTime() : Number.MAX_SAFE_INTEGER;
    return ad - bd;
  });

  const ordered: MarkerRow[] = [remaining.shift() as MarkerRow];

  while (remaining.length) {
    const last = ordered[ordered.length - 1];
    let bestIndex = 0;
    let bestDistance = haversineKm(last, remaining[0]);

    for (let i = 1; i < remaining.length; i++) {
      const distance = haversineKm(last, remaining[i]);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = i;
      }
    }

    ordered.push(remaining.splice(bestIndex, 1)[0]);
  }

  return ordered;
}

function monthKeyFromDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function statusLabel(status: PlanStatus) {
  if (status === "SVOLTO") return "Svolto";
  if (status === "APPUNTAMENTO_PRESO") return "App. preso";
  if (status === "RINVIATO_DA_LORO") return "Rinviato da loro";
  if (status === "RINVIATO_DA_NOI") return "Rinviato da noi";
  return "Da fare";
}

function statusBadgeStyle(status: PlanStatus) {
  if (status === "SVOLTO") {
    return {
      background: "rgba(34,197,94,0.12)",
      color: "#166534",
      border: "1px solid rgba(34,197,94,0.30)",
    };
  }

  if (status === "APPUNTAMENTO_PRESO") {
    return {
      background: "rgba(37,99,235,0.12)",
      color: "#1d4ed8",
      border: "1px solid rgba(37,99,235,0.30)",
    };
  }

  if (status === "RINVIATO_DA_LORO") {
    return {
      background: "rgba(245,158,11,0.12)",
      color: "#92400e",
      border: "1px solid rgba(245,158,11,0.30)",
    };
  }

  if (status === "RINVIATO_DA_NOI") {
    return {
      background: "rgba(249,115,22,0.12)",
      color: "#9a3412",
      border: "1px solid rgba(249,115,22,0.30)",
    };
  }

  return {
    background: "rgba(239,68,68,0.10)",
    color: "#b91c1c",
    border: "1px solid rgba(239,68,68,0.30)",
  };
}

function agendaBorderColor(status: PlanStatus) {
  if (status === "SVOLTO") return "#22c55e";
  if (status === "APPUNTAMENTO_PRESO") return "#2563eb";
  if (status === "RINVIATO_DA_LORO") return "#f59e0b";
  if (status === "RINVIATO_DA_NOI") return "#f97316";
  return "#ef4444";
}

function isWeekend(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function nextBusinessDate(base: Date, offsetBusinessDays: number) {
  const d = new Date(base);
  let moved = 0;

  while (moved < offsetBusinessDays) {
    d.setDate(d.getDate() + 1);
    if (!isWeekend(d)) moved++;
  }

  return d;
}

function autoPlannedDate(monthStart: Date, index: number) {
  const businessSlot = Math.floor(index / 3);
  let d = new Date(monthStart);
  d.setHours(12, 0, 0, 0);

  if (isWeekend(d)) {
    while (isWeekend(d)) {
      d.setDate(d.getDate() + 1);
    }
  }

  return nextBusinessDate(d, businessSlot);
}

function startOfWeekMonday(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(12, 0, 0, 0);
  return d;
}

function endOfWeekSunday(date: Date) {
  const d = startOfWeekMonday(date);
  d.setDate(d.getDate() + 6);
  return d;
}

function buildAgendaWeeks(ym: string, rows: MarkerRow[]) {
  const monthStart = firstDayOfMonth(ym);
  const monthEnd = firstDayNextMonth(ym);

  const firstGridDay = startOfWeekMonday(monthStart);
  const lastGridDay = endOfWeekSunday(new Date(monthEnd.getFullYear(), monthEnd.getMonth(), 0));

  const byDate = new Map<string, MarkerRow[]>();
  for (const row of rows) {
    const key = ymd(row.plannedDate);
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key)!.push(row);
  }

  const weeks: Array<{
    label: string;
    days: Array<{
      key: string;
      date: Date;
      inMonth: boolean;
      isWeekend: boolean;
      items: MarkerRow[];
    }>;
  }> = [];

  let cursor = new Date(firstGridDay);
  let weekIndex = 1;

  while (cursor <= lastGridDay) {
    const days = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(cursor);
      d.setDate(cursor.getDate() + i);

      days.push({
        key: ymd(d),
        date: d,
        inMonth: d >= monthStart && d < monthEnd,
        isWeekend: isWeekend(d),
        items: byDate.get(ymd(d)) ?? [],
      });
    }

    weeks.push({
      label: `Settimana ${weekIndex}`,
      days,
    });

    cursor.setDate(cursor.getDate() + 7);
    weekIndex += 1;
  }

  return weeks;
}

const MapClient = dynamicImport(() => import("@/app/map/MapClient"), {
  ssr: false,
});

export default async function MapPage({
  searchParams,
}: {
  searchParams?: SP;
}) {
  const { prisma } = await import("@/lib/prisma");
  const ym = safeYm(searchParams?.ym);
  const service = String(searchParams?.service ?? "").trim();

  const from = firstDayOfMonth(ym);
  const to = firstDayNextMonth(ym);

  const services = await prisma.serviceCatalog.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const existingPlanRows = await prisma.mapPlanItem.findMany({
    where: { ym },
    select: {
      clientServiceId: true,
      plannedDate: true,
      status: true,
      notes: true,
    },
    take: 200000,
  });

  const plannedServiceIds = existingPlanRows.map((p) => p.clientServiceId);

  const rows = await prisma.clientService.findMany({
    where: {
      site: {
        isNot: null,
      },
      OR: [
        { dueDate: { gte: from, lt: to } },
        ...(plannedServiceIds.length ? [{ id: { in: plannedServiceIds } }] : []),
      ],
      ...(service
        ? {
            service: {
              name: service,
            },
          }
        : {}),
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
    orderBy: [{ client: { name: "asc" } }, { dueDate: "asc" }],
    take: 200000,
  });

  const planMap = new Map(
    existingPlanRows.map((p) => [
      p.clientServiceId,
      {
        plannedDate: p.plannedDate,
        status: normalizePlanStatus(String(p.status ?? "DA_FARE")),
        notes: String(p.notes ?? "").trim(),
      },
    ])
  );

  const validRows = rows.filter(
    (r) =>
      r.site &&
      (String(r.site.address ?? "").trim() ||
        String(r.site.city ?? "").trim() ||
        String(r.site.province ?? "").trim() ||
        String(r.site.cap ?? "").trim())
  );

  const rawMarkers = validRows.map((r) => {
    const address = [r.site?.address, r.site?.city, r.site?.province, r.site?.cap]
      .filter(Boolean)
      .join(", ");

    const q = buildGoogleMapsQuery([
      r.site?.name,
      r.site?.address,
      r.site?.city,
      r.site?.province,
      r.site?.cap,
      r.client?.name,
    ]);

    const clientPhone = pickClientPhone(r.client?.contacts ?? [], r.client?.phone);
    const referentePhone = pickReferentePhone(r.client?.contacts ?? [], r.client?.phone);
    const plan = planMap.get(r.id);

    let planStatus: PlanStatus = "DA_FARE";

    if (plan?.status) {
      planStatus = plan.status;
    } else if (r.lastDoneAt && monthKeyFromDate(new Date(r.lastDoneAt)) === ym) {
      planStatus = "SVOLTO";
    }

    return {
      id: r.id,
      clientServiceId: r.id,
      clientId: r.clientId,
      clientName: r.client?.name ?? "—",
      serviceName: r.service?.name ?? "—",
      siteName: r.site?.name ?? "—",
      address,
      dueDate: fmtDate(r.dueDate),
      dueDateRaw: r.dueDate,
      referenteName: normalizeReferenteName((r as any).referenteName),
      referenteRole: "REFERENTE RX",
      referentePhone,
      clientPhone,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${q}`,
      planStatus,
      plannedDate: plan?.plannedDate ?? null,
      planNotes: plan?.notes ?? "",
      siteId: r.site?.id ?? null,
      rxEndoralCount: Number((r as any).rxEndoralCount ?? 0),
      rxOptCount: Number((r as any).rxOptCount ?? 0),
      lat: 0,
      lng: 0,
    };
  });

  const geocoded = await Promise.all(
    rawMarkers.map(async (m) => {
      const geo = await geocodeAddress(m.address);
      return geo ? { ...m, ...geo } : null;
    })
  );

  const markers = geocoded.filter(Boolean) as MarkerRow[];
  const routeOrdered = buildNearestRoute(markers);

  const orderedMarkers = routeOrdered.map((m, index) => {
    if (m.plannedDate) return m;

    const autoDate = autoPlannedDate(from, index);

    return {
      ...m,
      plannedDate: autoDate,
    };
  });

  const agendaWeeks = buildAgendaWeeks(ym, orderedMarkers);

  const doneCount = orderedMarkers.filter((m) => m.planStatus === "SVOLTO").length;
  const bookedCount = orderedMarkers.filter((m) => m.planStatus === "APPUNTAMENTO_PRESO").length;
  const todoCount = orderedMarkers.filter((m) => m.planStatus === "DA_FARE").length;
  const rinviatiDaLoroCount = orderedMarkers.filter(
    (m) => m.planStatus === "RINVIATO_DA_LORO"
  ).length;
  const rinviatiDaNoiCount = orderedMarkers.filter(
    (m) => m.planStatus === "RINVIATO_DA_NOI"
  ).length;

  const returnUrl = `/map?ym=${encodeURIComponent(ym)}${
    service ? `&service=${encodeURIComponent(service)}` : ""
  }`;

  return (
    <div className="card">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center", gap: 12 }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>MAP</h1>
          <div className="muted" style={{ marginTop: 6 }}>
            Clienti in scadenza su mappa per ottimizzare gli appuntamenti
          </div>
        </div>

        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href="/dashboard">
            Dashboard
          </Link>
          <Link className="btn" href="/maintenance">
            Mantenimenti
          </Link>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 12,
          marginTop: 12,
        }}
      >
        <div className="card" style={{ marginTop: 0 }}>
          <h2 style={{ fontSize: 15, fontWeight: 900, marginBottom: 10 }}>Mappa</h2>

          {orderedMarkers.length ? (
            <MapClient markers={orderedMarkers} />
          ) : (
            <div className="muted">Nessun cliente con sede mappabile per i filtri selezionati.</div>
          )}
        </div>

        <div className="card" style={{ marginTop: 0 }}>
          <h2 style={{ fontSize: 15, fontWeight: 900, marginBottom: 10 }}>Filtri mese</h2>

          <form>
            <div style={{ display: "grid", gap: 10 }}>
              <div>
                <label>Mese</label>
                <input className="input" type="month" name="ym" defaultValue={ym} />
              </div>

              <div>
                <label>Servizio</label>
                <select className="input" name="service" defaultValue={service}>
                  <option value="">Tutti i servizi</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="row" style={{ gap: 8, flexWrap: "wrap", marginTop: 2 }}>
                <button className="btn primary" type="submit">
                  Filtra
                </button>
                <Link className="btn" href="/map">
                  Reset
                </Link>
                <a className="btn" href="javascript:window.print()">
                  Stampa
                </a>
              </div>
            </div>
          </form>

          <div className="card" style={{ marginTop: 12, padding: 10 }}>
            <div className="muted">
              Risultati con sede mappabile: <b>{orderedMarkers.length}</b>
            </div>

            <div className="row" style={{ gap: 6, flexWrap: "wrap", marginTop: 8 }}>
              <span className="miniBadge" style={statusBadgeStyle("DA_FARE")}>
                Da fare: <b style={{ marginLeft: 6 }}>{todoCount}</b>
              </span>
              <span className="miniBadge" style={statusBadgeStyle("APPUNTAMENTO_PRESO")}>
                App. preso: <b style={{ marginLeft: 6 }}>{bookedCount}</b>
              </span>
              <span className="miniBadge" style={statusBadgeStyle("SVOLTO")}>
                Svolto: <b style={{ marginLeft: 6 }}>{doneCount}</b>
              </span>
              <span className="miniBadge" style={statusBadgeStyle("RINVIATO_DA_LORO")}>
                Rinviato da loro: <b style={{ marginLeft: 6 }}>{rinviatiDaLoroCount}</b>
              </span>
              <span className="miniBadge" style={statusBadgeStyle("RINVIATO_DA_NOI")}>
                Rinviato da noi: <b style={{ marginLeft: 6 }}>{rinviatiDaNoiCount}</b>
              </span>
            </div>

            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              Automatico: <b>3 appuntamenti al giorno</b> con accorpamento per vicinanza.
              Sabato e domenica esclusi solo dall’assegnazione automatica.
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h2 style={{ fontSize: 15, fontWeight: 900 }}>Lista appuntamenti mappabili</h2>

        {orderedMarkers.length ? (
          <table className="table mapManageTable" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Servizio</th>
                <th>Sede</th>
                <th>Telefono cliente</th>
                <th>Referente</th>
                <th>Telefono referente</th>
                <th>Stato</th>
                <th>Data agenda</th>
                <th>Vista</th>
              </tr>
            </thead>

            <tbody>
              {orderedMarkers.map((m, index) => (
                <tr key={m.id}>
                  <td>
                    <b>{index + 1}</b>
                  </td>
                  <td>
                    <b>{m.clientName}</b>
                    <div className="muted" style={{ marginTop: 3, fontSize: 12 }}>
                      {m.address}
                    </div>
                  </td>
                  <td>
                    <div>{m.serviceName}</div>
                    {(m.rxEndoralCount > 0 || m.rxOptCount > 0) && (
                      <div className="muted" style={{ marginTop: 3, fontSize: 12 }}>
                        RX Endorali: <b>{m.rxEndoralCount}</b> • RX OPT: <b>{m.rxOptCount}</b>
                      </div>
                    )}
                  </td>
                  <td>{m.siteName}</td>
                  <td>
                    {m.clientPhone !== "—" ? <a href={`tel:${m.clientPhone}`}>{m.clientPhone}</a> : "—"}
                  </td>
                  <td>
                    <b>{m.referenteName}</b>
                  </td>
                  <td>
                    {m.referentePhone !== "—" ? (
                      <a href={`tel:${m.referentePhone}`}>{m.referentePhone}</a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <form action={saveMapPlanItem} className="inlineEditor">
                      <input type="hidden" name="ym" value={ym} />
                      <input type="hidden" name="clientServiceId" value={m.clientServiceId} />
                      <input type="hidden" name="clientId" value={m.clientId} />
                      <input type="hidden" name="siteId" value={m.siteId ?? ""} />
                      <input type="hidden" name="returnUrl" value={returnUrl} />
                      <input type="hidden" name="plannedDate" value={ymd(m.plannedDate)} />
                      <input type="hidden" name="planNotes" value={m.planNotes} />
                      <select
                        className="input miniInput"
                        name="planStatus"
                        defaultValue={m.planStatus}
                      >
                        <option value="DA_FARE">Da fare</option>
                        <option value="APPUNTAMENTO_PRESO">App. preso</option>
                        <option value="RINVIATO_DA_LORO">Rinviato da loro</option>
                        <option value="RINVIATO_DA_NOI">Rinviato da noi</option>
                        <option value="SVOLTO">Svolto</option>
                      </select>
                      <button className="btn smallBtn" type="submit">
                        OK
                      </button>
                    </form>
                  </td>
                  <td>
                    <form action={saveMapPlanItem} className="inlineEditor">
                      <input type="hidden" name="ym" value={ym} />
                      <input type="hidden" name="clientServiceId" value={m.clientServiceId} />
                      <input type="hidden" name="clientId" value={m.clientId} />
                      <input type="hidden" name="siteId" value={m.siteId ?? ""} />
                      <input type="hidden" name="returnUrl" value={returnUrl} />
                      <input type="hidden" name="planStatus" value={m.planStatus} />
                      <input type="hidden" name="planNotes" value={m.planNotes} />
                      <input
                        className="input miniInput"
                        type="date"
                        name="plannedDate"
                        defaultValue={ymd(m.plannedDate)}
                      />
                      <button className="btn smallBtn" type="submit">
                        Sposta
                      </button>
                    </form>
                  </td>
                  <td>
                    <span className="miniBadge" style={statusBadgeStyle(m.planStatus)}>
                      {statusLabel(m.planStatus)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="muted" style={{ marginTop: 10 }}>
            Nessun appuntamento da mostrare.
          </div>
        )}
      </div>

      <div className="card printArea" style={{ marginTop: 12 }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 900, margin: 0 }}>Agenda mensile</h2>
            <div className="muted" style={{ marginTop: 6 }}>
              Vista generale del mese, divisa per settimane.
            </div>
          </div>

          <a className="btn printOnlyHide" href="javascript:window.print()">
            Stampa
          </a>
        </div>

        <div style={{ marginTop: 12, display: "grid", gap: 14 }}>
          {agendaWeeks.map((week, idx) => (
            <div
              key={week.label}
              className="weekBlock"
              style={{
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: 14,
                overflow: "hidden",
                background:
                  idx % 2 === 0 ? "rgba(59,130,246,0.03)" : "rgba(16,185,129,0.03)",
              }}
            >
              <div
                style={{
                  padding: "8px 10px",
                  fontWeight: 900,
                  fontSize: 13,
                  background:
                    idx % 2 === 0 ? "rgba(59,130,246,0.08)" : "rgba(16,185,129,0.08)",
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                {week.label}
              </div>

              <div className="agendaGrid">
                {week.days.map((day) => (
                  <div
                    key={day.key}
                    className={`agendaCell ${day.inMonth ? "" : "outMonth"} ${
                      day.isWeekend ? "weekendCell" : ""
                    }`}
                  >
                    <div className="agendaHead">
                      <div className="agendaDayName">
                        {day.date.toLocaleDateString("it-IT", { weekday: "short" })}
                      </div>
                      <div className="agendaDayNum">{day.date.getDate()}</div>
                    </div>

                    <div className="agendaBody">
                      {day.items.length === 0 ? (
                        <div className="agendaEmpty">—</div>
                      ) : (
                        day.items.map((item) => (
                          <div
                            key={`${day.key}-${item.id}`}
                            className="agendaItem"
                            style={{
                              borderLeft: `4px solid ${agendaBorderColor(item.planStatus)}`,
                              background:
                                item.planStatus === "DA_FARE"
                                  ? "rgba(239,68,68,0.06)"
                                  : "rgba(255,255,255,0.96)",
                            }}
                          >
                            <div className="agendaClient">{item.clientName}</div>
                            <div className="agendaMeta">{item.serviceName}</div>
                            <div className="agendaMeta">{item.siteName}</div>
                            <div className="agendaMeta">
                              Telefono cliente: <b>{item.clientPhone}</b>
                            </div>
                            <div className="agendaMeta">
                              Referente: <b>{item.referenteName}</b>
                            </div>
                            <div className="agendaMeta">
                              Telefono referente: <b>{item.referentePhone}</b>
                            </div>
                            {(item.rxEndoralCount > 0 || item.rxOptCount > 0) && (
                              <div className="agendaMeta">
                                RX Endorali: <b>{item.rxEndoralCount}</b> • RX OPT: <b>{item.rxOptCount}</b>
                              </div>
                            )}
                            <div style={{ marginTop: 4 }}>
                              <span className="miniBadge" style={statusBadgeStyle(item.planStatus)}>
                                {statusLabel(item.planStatus)}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
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

        .mapManageTable th,
        .mapManageTable td{
          font-size:12px;
          padding-top:7px;
          padding-bottom:7px;
          vertical-align:top;
        }

        .inlineEditor{
          display:flex;
          gap:6px;
          align-items:center;
          flex-wrap:nowrap;
        }

        .miniInput{
          min-width: 150px;
          padding-top: 5px;
          padding-bottom: 5px;
          font-size: 12px;
          height: 34px;
        }

        .smallBtn{
          padding: 6px 10px;
          min-height: 34px;
          line-height: 1;
          white-space: nowrap;
        }

        .agendaGrid{
          display:grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 8px;
          padding: 10px;
        }

        .agendaCell{
          min-height: 180px;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 12px;
          background: white;
          display:flex;
          flex-direction:column;
          overflow:hidden;
        }

        .agendaCell.outMonth{
          opacity:.35;
          background: rgba(0,0,0,0.02);
        }

        .agendaCell.weekendCell{
          background: rgba(245,158,11,0.05);
        }

        .agendaHead{
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding: 7px 8px;
          border-bottom:1px solid rgba(0,0,0,0.06);
          background: rgba(255,255,255,0.8);
        }

        .agendaDayName{
          font-size:11px;
          font-weight:800;
          text-transform:capitalize;
        }

        .agendaDayNum{
          font-size:13px;
          font-weight:900;
        }

        .agendaBody{
          padding: 8px;
          display:grid;
          gap:6px;
        }

        .agendaItem{
          border-radius:10px;
          padding: 6px 7px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.04);
        }

        .agendaClient{
          font-size:11px;
          font-weight:900;
          line-height:1.2;
        }

        .agendaMeta{
          font-size:11px;
          color: rgba(0,0,0,0.68);
          margin-top:2px;
          line-height:1.2;
        }

        .agendaEmpty{
          font-size:12px;
          color: rgba(0,0,0,0.35);
        }

        @media (max-width: 1200px){
          .inlineEditor{
            flex-wrap:wrap;
          }

          .agendaGrid{
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media print {
          .printOnlyHide,
          .btn,
          form,
          nav,
          aside {
            display: none !important;
          }

          .printArea {
            border: none !important;
            box-shadow: none !important;
          }

          .agendaGrid{
            grid-template-columns: repeat(7, minmax(0, 1fr));
          }

          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}