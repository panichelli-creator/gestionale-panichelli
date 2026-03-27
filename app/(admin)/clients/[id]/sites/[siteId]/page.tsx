export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { notFound } from "next/navigation";


function fmtDate(d: Date | null | undefined) {
  return d ? new Date(d).toLocaleDateString("it-IT") : "—";
}

function toNum(v: any): number {
  if (v == null) return 0;
  const s = typeof v === "number" ? String(v) : String(v?.toString?.() ?? v);
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function eur(v: any) {
  return toNum(v).toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

function joinAddr(parts: (string | null | undefined)[]) {
  return parts
    .map((x) => String(x ?? "").trim())
    .filter(Boolean)
    .join(" ");
}

export default async function ClientSiteDetailPage({
  params,
}: {
  params: { id: string; siteId: string };
}) {
  const { prisma } = await import("@/lib/prisma");
  const site = await prisma.clientSite.findUnique({
    where: { id: params.siteId },
    include: {
      client: true,
      personSites: {
        include: {
          person: true,
        },
      },
      clientServices: {
        include: {
          service: true,
        },
        orderBy: { dueDate: "asc" },
      },
      clinicalChecks: {
        orderBy: [{ dataProssimoAppuntamento: "asc" }, { createdAt: "desc" }],
      },
    },
  });

  if (!site || site.clientId !== params.id) return notFound();

  const people = site.personSites.map((x) => x.person);
  const services = site.clientServices;
  const checks = site.clinicalChecks;

  const fullAddress = joinAddr([site.address, site.city, site.province, site.cap]);

  return (
    <div className="card">
      <div
        className="row"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>{site.name}</h1>
          <div className="muted" style={{ marginTop: 6 }}>
            Cliente: <b>{site.client.name}</b>
          </div>
        </div>

        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
          <Link className="btn" href={`/clients/${site.clientId}/sites`}>
            ← Torna alle sedi
          </Link>
          <Link className="btn" href={`/clients/${site.clientId}`}>
            Cliente
          </Link>
          <Link className="btn primary" href={`/clients/${site.clientId}/sites/${site.id}/edit`}>
            Modifica sede
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div
          className="row"
          style={{ justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}
        >
          <h2 style={{ margin: 0 }}>Dati sede</h2>

          <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
            <Link className="btn" href={`/clients/${site.clientId}/sites/${site.id}/edit`}>
              Modifica
            </Link>
            <Link className="btn" href={`/clients/${site.clientId}/sites`}>
              Gestisci sedi
            </Link>
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          <div className="muted">Indirizzo</div>
          <div>{fullAddress || "—"}</div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <div className="muted">Nome sede</div>
            <div>
              <b>{site.name}</b>
            </div>
          </div>

          <div>
            <div className="muted">Cliente</div>
            <div>{site.client.name}</div>
          </div>
        </div>

        <div className="grid3" style={{ marginTop: 12 }}>
          <div>
            <div className="muted">Città</div>
            <div>{site.city ?? "—"}</div>
          </div>
          <div>
            <div className="muted">Provincia</div>
            <div>{site.province ?? "—"}</div>
          </div>
          <div>
            <div className="muted">CAP</div>
            <div>{site.cap ?? "—"}</div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="muted">Note</div>
          <div>{site.notes ?? "—"}</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h2>Persone associate alla sede</h2>

        <div className="muted" style={{ marginTop: 8 }}>
          Persone collegate al cliente: <b>{people.length}</b> — Associate alla sede: <b>{people.length}</b>
        </div>

        {people.length ? (
          <table className="table" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Mansione</th>
                <th>Email</th>
                <th>Telefono</th>
              </tr>
            </thead>
            <tbody>
              {people.map((p) => (
                <tr key={p.id}>
                  <td>
                    <b>
                      {p.lastName} {p.firstName}
                    </b>
                  </td>
                  <td>{p.role ?? "—"}</td>
                  <td>{p.email ?? "—"}</td>
                  <td>{p.phone ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="muted" style={{ marginTop: 10 }}>
            Nessuna persona collegata a questa sede.
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h2>Servizi della sede (mantenimenti)</h2>

        {services.length ? (
          <table className="table" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>Servizio</th>
                <th>Scadenza</th>
                <th>Periodicità</th>
                <th>Prezzo</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id}>
                  <td>
                    <b>{s.service.name}</b>
                  </td>
                  <td>{fmtDate(s.dueDate)}</td>
                  <td>{s.periodicity}</td>
                  <td>{s.priceEur != null ? eur(s.priceEur) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="muted" style={{ marginTop: 10 }}>
            Nessun servizio associato a questa sede.
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div
          className="row"
          style={{ justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}
        >
          <h2 style={{ margin: 0 }}>Verifiche di sicurezza elettrica (VSE)</h2>

          <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
            <Link
              className="btn primary"
              href={`/ingegneria-clinica/new?clientId=${site.clientId}&siteId=${site.id}`}
            >
              Nuova VSE per questa sede
            </Link>
            <Link className="btn" href={`/ingegneria-clinica?clientId=${site.clientId}`}>
              Apri Ingegneria Clinica
            </Link>
          </div>
        </div>

        <div className="muted" style={{ marginTop: 8 }}>
          Totale verifiche sede: <b>{checks.length}</b>
        </div>

        {checks.length ? (
          <table className="table" style={{ marginTop: 12 }}>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Sede</th>
                <th>App.</th>
                <th>+App</th>
                <th>Costo</th>
                <th>Quota tecnico</th>
                <th>Trasf.</th>
                <th>Ultima</th>
                <th>Prossima</th>
                <th>Periodicità</th>
                <th>Fatta</th>
                <th>Dropbox</th>
                <th>Fatturato</th>
                <th>Apri</th>
              </tr>
            </thead>
            <tbody>
              {checks.map((c) => (
                <tr key={c.id}>
                  <td>{c.nomeClienteSnapshot ?? site.client.name}</td>
                  <td>{c.nomeSedeSnapshot ?? site.name}</td>
                  <td>{c.numApparecchiature}</td>
                  <td>{c.apparecchiatureAggiuntive}</td>
                  <td>{eur(c.costoServizio)}</td>
                  <td>{eur(c.quotaTecnico)}</td>
                  <td>{eur(c.importoTrasferta)}</td>
                  <td>{fmtDate(c.dataUltimoAppuntamento)}</td>
                  <td>{fmtDate(c.dataProssimoAppuntamento)}</td>
                  <td>{c.periodicita}</td>
                  <td>{c.verificheEseguite ? "✓" : "—"}</td>
                  <td>{c.fileSuDropbox ? "✓" : "—"}</td>
                  <td>{c.tecnicoFatturato ? "✓" : "—"}</td>
                  <td>
                    <Link className="btn" href={`/ingegneria-clinica/${c.id}`}>
                      Apri
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="muted" style={{ marginTop: 12 }}>
            Nessuna VSE associata a questa sede.
          </div>
        )}
      </div>
    </div>
  );
}