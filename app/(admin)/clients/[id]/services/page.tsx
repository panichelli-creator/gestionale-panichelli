import Link from "next/link";
import { notFound } from "next/navigation";


export const dynamic = "force-dynamic";
export const revalidate = 0;

function fmtDate(d: Date | null | undefined) {
  return d ? new Date(d).toLocaleDateString("it-IT") : "—";
}

function toNum(v: any): number {
  if (v == null) return 0;
  const s = typeof v === "number" ? String(v) : String(v?.toString?.() ?? v);
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function fmtEur(v: any) {
  if (v == null) return "—";
  return toNum(v).toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

function getReferenteLabel(v: any) {
  const referente = String(v ?? "").trim();
  return referente || "—";
}

export default async function ClientServicesPage({
  params,
}: {
  params: { id: string };
}) {
  const { prisma } = await import("@/lib/prisma");
  const client = await prisma.client.findUnique({
    where: { id: params.id },
  });

  if (!client) return notFound();

  const services = await prisma.clientService.findMany({
    where: { clientId: params.id },
    include: {
      service: true,
      site: true,
    },
    orderBy: {
      dueDate: "asc",
    },
  });

  return (
    <div className="card">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <h1>Servizi cliente</h1>

        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href={`/clients/${params.id}`}>
            ← Cliente
          </Link>

          <Link className="btn primary" href={`/clients/${params.id}/services/new`}>
            + Nuovo servizio
          </Link>
        </div>
      </div>

      <div className="muted" style={{ marginTop: 6 }}>
        Cliente: <b>{client.name}</b>
      </div>

      <table className="table" style={{ marginTop: 16 }}>
        <thead>
          <tr>
            <th>Servizio</th>
            <th>Sede</th>
            <th>Referente</th>
            <th>Scadenza</th>
            <th>Stato</th>
            <th>Prezzo</th>
            <th style={{ width: 160 }}>Azioni</th>
          </tr>
        </thead>

        <tbody>
          {services.map((s: any) => (
            <tr key={s.id}>
              <td>
                <b>{s.service?.name ?? "—"}</b>
              </td>

              <td className="muted">{s.site?.name ?? "—"}</td>

              <td>{getReferenteLabel(s.referenteName)}</td>

              <td>{fmtDate(s.dueDate)}</td>

              <td className="muted">{s.status}</td>

              <td>{fmtEur(s.priceEur)}</td>

              <td>
                <div className="row" style={{ gap: 8 }}>
                  <Link
                    className="btn"
                    href={`/clients/${params.id}/services/${s.id}/edit`}
                  >
                    Apri
                  </Link>
                </div>
              </td>
            </tr>
          ))}

          {!services.length && (
            <tr>
              <td colSpan={7} className="muted">
                Nessun servizio associato.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}