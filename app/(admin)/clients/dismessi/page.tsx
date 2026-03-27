import Link from "next/link";


export const dynamic = "force-dynamic";
export const revalidate = 0;

function pill(text: string) {
  return (
    <span className="pill" key={text}>
      {text}
    </span>
  );
}

export default async function ClientsDismissedPage() {
  const { prisma } = await import("@/lib/prisma");
  const clients = await prisma.client.findMany({
    where: { status: "DISMESSO" },
    orderBy: { name: "asc" },
    include: { services: { include: { service: true } } },
  });

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Clienti dismessi</h1>
        <div className="row">
          <Link className="btn" href="/clients">← Clienti attivi</Link>
          <Link className="btn primary" href="/clients/new">+ Aggiungi cliente</Link>
        </div>
      </div>

      <table className="table" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipologia</th>
            <th>Telefono</th>
            <th>PEC</th>
            <th>Medico del lavoro</th>
            <th>Mantenimenti (riepilogo)</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id}>
              <td>
                <Link href={`/clients/${c.id}`}>{c.name}</Link>
              </td>
              <td>{c.type}</td>
              <td>{c.phone ?? ""}</td>
              <td>{c.pec ?? ""}</td>
              <td>{c.occupationalDoctorName ?? ""}</td>
              <td>
                {(c.services ?? []).slice(0, 6).map((s) => pill(s.service.name))}
                {c.services.length > 6 ? pill(`+${c.services.length - 6}`) : null}
              </td>
            </tr>
          ))}
          {clients.length === 0 ? (
            <tr>
              <td colSpan={6} className="muted">
                Nessun cliente dismesso.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}