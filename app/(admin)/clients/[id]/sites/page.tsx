import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ClientSitesPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { err?: string; ok?: string };
}) {
  const client = await prisma.client.findUnique({
    where: { id: params.id },
  });

  if (!client) return notFound();

  const clientId = client.id;

  const sites = await prisma.clientSite.findMany({
    where: { clientId },
    orderBy: { name: "asc" },
  });

  async function createSite(formData: FormData) {
    "use server";

    const clientId = params.id;

    const name = String(formData.get("name") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim() || null;
    const city = String(formData.get("city") ?? "").trim() || null;
    const province = String(formData.get("province") ?? "").trim() || null;
    const cap = String(formData.get("cap") ?? "").trim() || null;
    const notes = String(formData.get("notes") ?? "").trim() || null;

    if (!name) {
      redirect(
        `/clients/${clientId}/sites?err=${encodeURIComponent("Nome sede obbligatorio")}`
      );
    }

    const existingSites = await prisma.clientSite.findMany({
      where: { clientId },
      select: { id: true, name: true },
    });

    const nameUpper = name.toUpperCase();
    const duplicate = existingSites.find((s) => s.name.toUpperCase() === nameUpper);

    if (duplicate) {
      redirect(
        `/clients/${clientId}/sites?err=${encodeURIComponent(
          `Sede già esistente: "${duplicate.name}"`
        )}`
      );
    }

    try {
      await prisma.clientSite.create({
        data: {
          clientId,
          name,
          address,
          city,
          province,
          cap,
          notes,
        },
      });
    } catch (e: any) {
      redirect(
        `/clients/${clientId}/sites?err=${encodeURIComponent(
          e?.message ?? "Errore creazione sede"
        )}`
      );
    }

    redirect(`/clients/${clientId}/sites?ok=${encodeURIComponent("Sede creata")}`);
  }

  async function deleteSite(formData: FormData) {
    "use server";

    const clientId = params.id;
    const siteId = String(formData.get("siteId") ?? "").trim();

    if (!siteId) redirect(`/clients/${clientId}/sites`);

    try {
      await prisma.clientSite.delete({
        where: { id: siteId },
      });
    } catch (e: any) {
      redirect(
        `/clients/${clientId}/sites?err=${encodeURIComponent(
          e?.message ?? "Errore eliminazione sede"
        )}`
      );
    }

    redirect(`/clients/${clientId}/sites?ok=${encodeURIComponent("Sede eliminata")}`);
  }

  return (
    <div className="card">
      <div
        className="row"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Sedi — {client.name}</h1>

        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href={`/clients/${clientId}`}>
            ← Torna al cliente
          </Link>
          <Link className="btn" href="/clients">
            Clienti
          </Link>
        </div>
      </div>

      {searchParams?.err ? (
        <div className="card" style={{ marginTop: 12, border: "1px solid #ff6b6b" }}>
          <b style={{ color: "#ff6b6b" }}>Errore:</b> {decodeURIComponent(searchParams.err)}
        </div>
      ) : null}

      {searchParams?.ok ? (
        <div
          className="card"
          style={{
            marginTop: 12,
            border: "1px solid rgba(34,197,94,0.6)",
          }}
        >
          <b style={{ color: "rgba(34,197,94,0.95)" }}>OK:</b> {decodeURIComponent(searchParams.ok)}
        </div>
      ) : null}

      <div className="card" style={{ marginTop: 12 }}>
        <h2>Crea sede</h2>

        <form action={createSite} className="card" style={{ marginTop: 10 }}>
          <div className="grid2">
            <div>
              <label>Nome sede *</label>
              <input
                className="input"
                name="name"
                placeholder="es: Studio Tuscolana"
                required
              />
            </div>

            <div>
              <label>Indirizzo</label>
              <input className="input" name="address" placeholder="Via..." />
            </div>
          </div>

          <div className="grid3" style={{ marginTop: 12 }}>
            <div>
              <label>Città</label>
              <input className="input" name="city" />
            </div>
            <div>
              <label>Provincia</label>
              <input className="input" name="province" />
            </div>
            <div>
              <label>CAP</label>
              <input className="input" name="cap" />
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label>Note</label>
            <input className="input" name="notes" />
          </div>

          <div className="row" style={{ marginTop: 14 }}>
            <button className="btn primary" type="submit">
              Salva sede
            </button>
          </div>
        </form>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h2>Lista sedi</h2>

        <table className="table" style={{ marginTop: 10 }}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Indirizzo</th>
              <th style={{ width: 220 }}>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {sites.map((s) => (
              <tr key={s.id}>
                <td>
                  <b>{s.name}</b>
                </td>

                <td className="muted">
                  {[s.address, s.city, s.province, s.cap].filter(Boolean).join(", ") || "—"}
                </td>

                <td>
                  <div className="row" style={{ gap: 8 }}>
                    <Link className="btn" href={`/clients/${clientId}/sites/${s.id}`}>
                      Apri
                    </Link>

                    <Link className="btn" href={`/clients/${clientId}/sites/${s.id}/edit`}>
                      Modifica
                    </Link>

                    <form action={deleteSite}>
                      <input type="hidden" name="siteId" value={s.id} />
                      <button className="btn" type="submit">
                        Elimina
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}

            {sites.length === 0 ? (
              <tr>
                <td colSpan={3} className="muted">
                  Nessuna sede. Creane una sopra.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}