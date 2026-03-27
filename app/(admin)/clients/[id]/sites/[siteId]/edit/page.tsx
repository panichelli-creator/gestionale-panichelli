import Link from "next/link";
import { notFound, redirect } from "next/navigation";


export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EditClientSitePage({
  params,
  searchParams,
}: {
  params: { id: string; siteId: string };
  searchParams?: { err?: string };
}) {
  const { prisma } = await import("@/lib/prisma");
  const site = await prisma.clientSite.findUnique({
    where: { id: params.siteId },
    include: {
      client: true,
    },
  });

  if (!site) return notFound();
  if (site.clientId !== params.id) return notFound();

  async function updateSite(formData: FormData) {
    "use server";

    const clientId = params.id;
    const siteId = params.siteId;

    const name = String(formData.get("name") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim() || null;
    const city = String(formData.get("city") ?? "").trim() || null;
    const province = String(formData.get("province") ?? "").trim() || null;
    const cap = String(formData.get("cap") ?? "").trim() || null;
    const notes = String(formData.get("notes") ?? "").trim() || null;

    if (!name) {
      redirect(
        `/clients/${clientId}/sites/${siteId}/edit?err=${encodeURIComponent(
          "Nome sede obbligatorio"
        )}`
      );
    }

    const existingSites = await prisma.clientSite.findMany({
      where: {
        clientId,
        NOT: { id: siteId },
      },
      select: { id: true, name: true },
    });

    const nameUpper = name.toUpperCase();

    const duplicate = existingSites.find(
      (s) => String(s.name ?? "").trim().toUpperCase() === nameUpper
    );

    if (duplicate) {
      redirect(
        `/clients/${clientId}/sites/${siteId}/edit?err=${encodeURIComponent(
          `Esiste già una sede con nome "${duplicate.name}"`
        )}`
      );
    }

    try {
      await prisma.clientSite.update({
        where: { id: siteId },
        data: {
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
        `/clients/${clientId}/sites/${siteId}/edit?err=${encodeURIComponent(
          e?.message ?? "Errore salvataggio sede"
        )}`
      );
    }

    redirect(`/clients/${clientId}/sites/${siteId}`);
  }

  async function deleteSite(formData: FormData) {
    "use server";

    const clientId = params.id;
    const siteId = params.siteId;
    const confirm = String(formData.get("confirmDelete") ?? "").trim();

    if (confirm !== "ELIMINA") {
      redirect(
        `/clients/${clientId}/sites/${siteId}/edit?err=${encodeURIComponent(
          'Per eliminare la sede scrivi "ELIMINA"'
        )}`
      );
    }

    try {
      await prisma.clientSite.delete({
        where: { id: siteId },
      });
    } catch (e: any) {
      redirect(
        `/clients/${clientId}/sites/${siteId}/edit?err=${encodeURIComponent(
          e?.message ??
            "Impossibile eliminare la sede. Potrebbe essere collegata a servizi, persone o verifiche."
        )}`
      );
    }

    redirect(`/clients/${clientId}/sites`);
  }

  return (
    <div className="card">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}
      >
        <h1>Modifica sede</h1>

        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
          <Link className="btn" href={`/clients/${params.id}/sites/${params.siteId}`}>
            ← Torna alla sede
          </Link>
          <Link className="btn" href={`/clients/${params.id}/sites`}>
            Tutte le sedi
          </Link>
          <Link className="btn" href={`/clients/${params.id}`}>
            Cliente
          </Link>
        </div>
      </div>

      {searchParams?.err ? (
        <div
          className="card"
          style={{ marginTop: 12, border: "1px solid #ff6b6b" }}
        >
          <b style={{ color: "#ff6b6b" }}>Errore:</b>{" "}
          {decodeURIComponent(searchParams.err)}
        </div>
      ) : null}

      <div className="card" style={{ marginTop: 12 }}>
        Cliente: <b>{site.client.name}</b>
      </div>

      <form action={updateSite} className="card" style={{ marginTop: 12 }}>
        <div className="grid2">
          <div>
            <label>Nome sede *</label>
            <input
              className="input"
              name="name"
              defaultValue={site.name}
              placeholder="Es: Studio Tuscolana"
              required
            />
          </div>

          <div>
            <label>Indirizzo</label>
            <input
              className="input"
              name="address"
              defaultValue={site.address ?? ""}
              placeholder="Via..."
            />
          </div>
        </div>

        <div className="grid3" style={{ marginTop: 12 }}>
          <div>
            <label>Città</label>
            <input
              className="input"
              name="city"
              defaultValue={site.city ?? ""}
            />
          </div>

          <div>
            <label>Provincia</label>
            <input
              className="input"
              name="province"
              defaultValue={site.province ?? ""}
            />
          </div>

          <div>
            <label>CAP</label>
            <input
              className="input"
              name="cap"
              defaultValue={site.cap ?? ""}
            />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Note</label>
          <textarea
            className="input"
            name="notes"
            rows={4}
            defaultValue={site.notes ?? ""}
          />
        </div>

        <div className="row" style={{ marginTop: 14, gap: 8, flexWrap: "wrap" }}>
          <button className="btn primary" type="submit">
            Salva
          </button>

          <Link className="btn" href={`/clients/${params.id}/sites/${params.siteId}`}>
            Annulla
          </Link>
        </div>
      </form>

      <div
        className="card"
        style={{ marginTop: 12, border: "1px solid rgba(239,68,68,0.35)" }}
      >
        <h2>Elimina sede</h2>

        <div className="muted" style={{ marginTop: 8 }}>
          Attenzione: se la sede è collegata a servizi, persone o verifiche VSE,
          l’eliminazione potrebbe non riuscire.
        </div>

        <form action={deleteSite} style={{ marginTop: 12 }}>
          <div>
            <label>
              Per confermare scrivi <b>ELIMINA</b>
            </label>
            <input
              className="input"
              name="confirmDelete"
              placeholder="ELIMINA"
              style={{ marginTop: 8, maxWidth: 220 }}
            />
          </div>

          <div className="row" style={{ marginTop: 14, gap: 8, flexWrap: "wrap" }}>
            <button className="btn" type="submit" style={{ border: "1px solid #ff6b6b", color: "#ff6b6b" }}>
              Elimina sede
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}