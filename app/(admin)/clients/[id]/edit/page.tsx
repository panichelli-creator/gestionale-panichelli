import Link from "next/link";
import { redirect, notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TYPES = [
  "STUDIO_ODONTOIATRICO",
  "STUDIO_ODONT_447",
  "AMBULATORIO_ODONTOIATRICO",
  "STUDIO_FISIOTERAPICO",
  "AMBULATORIO_FKT",
  "STUDIO",
  "AMBULATORIO",
  "POLIAMBULATORIO",
  "ALTRO",
] as const;

const CONTACT_ROLES = [
  "TITOLARE",
  "LEGALE_RAPPRESENTANTE",
  "OFFICE_MANAGER",
  "SEGRETARIA",
  "ASO",
  "ALTRO",
] as const;

export default async function EditClientPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { err?: string };
}) {
  const { prisma } = await import("@/lib/prisma");

  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: { contacts: { orderBy: [{ role: "asc" }, { name: "asc" }] } },
  });

  if (!client) return notFound();

  const primaryContact = client.contacts?.[0] ?? null;

  async function updateClient(formData: FormData) {
    "use server";

    const { prisma } = await import("@/lib/prisma");
    const id = params.id;

    const name = String(formData.get("name") ?? "").trim();
    if (!name) redirect(`/clients/${id}/edit?err=${encodeURIComponent("Nome cliente obbligatorio")}`);

    const employeesCountRaw = String(formData.get("employeesCount") ?? "").trim();
    const employeesCount = employeesCountRaw ? Number(employeesCountRaw) : null;

    await prisma.client.update({
      where: { id },
      data: {
        name,
        type: String(formData.get("type") ?? "ALTRO") as any,
        status: String(formData.get("status") ?? "ATTIVO") as any,
        email: String(formData.get("email") ?? "").trim() || null,
        phone: String(formData.get("phone") ?? "").trim() || null,
        employeesCount,
        vatNumber: String(formData.get("vatNumber") ?? "").trim() || null,
        pec: String(formData.get("pec") ?? "").trim() || null,
        uniqueCode: String(formData.get("uniqueCode") ?? "").trim() || null,
        address: String(formData.get("address") ?? "").trim() || null,
        legalSeat: String(formData.get("legalSeat") ?? "").trim() || null,
        operativeSeat: String(formData.get("operativeSeat") ?? "").trim() || null,
        occupationalDoctorName:
          String(formData.get("occupationalDoctorName") ?? "").trim() || null,
        notes: String(formData.get("notes") ?? "").trim() || null,
      },
    });

    const contactId = String(formData.get("contactId") ?? "").trim();
    const refName = String(formData.get("refName") ?? "").trim();

    if (refName) {
      const data = {
        role: String(formData.get("refRole") ?? "ALTRO") as any,
        name: refName,
        email: String(formData.get("refEmail") ?? "").trim() || null,
        phone: String(formData.get("refPhone") ?? "").trim() || null,
        notes: String(formData.get("refNotes") ?? "").trim() || null,
      };

      if (contactId) {
        await prisma.clientContact.update({ where: { id: contactId }, data });
      } else {
        await prisma.clientContact.create({ data: { clientId: id, ...data } });
      }
    }

    redirect(`/clients/${id}`);
  }

  async function dismissClient() {
    "use server";
    const { prisma } = await import("@/lib/prisma");

    await prisma.client.update({
      where: { id: params.id },
      data: { status: "DISMESSO" as any },
    });

    redirect(`/clients/${params.id}`);
  }

  async function deleteClient() {
    "use server";
    const { prisma } = await import("@/lib/prisma");

    try {
      await prisma.client.delete({ where: { id: params.id } });
      redirect("/clients");
    } catch (e: any) {
      const msg = encodeURIComponent(
        e?.message ??
          "Impossibile eliminare il cliente. Probabilmente ci sono collegamenti attivi."
      );
      redirect(`/clients/${params.id}/edit?err=${msg}`);
    }
  }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Modifica anagrafica</h1>

        <Link className="btn" href={`/clients/${client.id}`}>
          ← Torna al cliente
        </Link>
      </div>

      {searchParams?.err ? (
        <div
          className="card"
          style={{
            marginTop: 12,
            border: "1px solid rgba(239,68,68,0.35)",
            background: "rgba(239,68,68,0.08)",
            color: "#b91c1c",
            fontWeight: 800,
          }}
        >
          {decodeURIComponent(searchParams.err)}
        </div>
      ) : null}

      <form action={updateClient} className="card" style={{ marginTop: 12 }}>
        <h2>Dati cliente</h2>

        <div>
          <label>Ragione sociale / Nome cliente *</label>
          <input className="input" name="name" defaultValue={client.name} required />
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <label>Tipo struttura</label>
            <select className="input" name="type" defaultValue={client.type ?? "ALTRO"}>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Stato</label>
            <select className="input" name="status" defaultValue={client.status ?? "ATTIVO"}>
              <option value="ATTIVO">ATTIVO</option>
              <option value="DISMESSO">DISMESSO</option>
            </select>
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <label>Email</label>
            <input className="input" name="email" defaultValue={client.email ?? ""} />
          </div>

          <div>
            <label>Telefono</label>
            <input className="input" name="phone" defaultValue={client.phone ?? ""} />
          </div>
        </div>

        <div className="grid3" style={{ marginTop: 12 }}>
          <div>
            <label>P.IVA</label>
            <input className="input" name="vatNumber" defaultValue={client.vatNumber ?? ""} />
          </div>

          <div>
            <label>PEC</label>
            <input className="input" name="pec" defaultValue={client.pec ?? ""} />
          </div>

          <div>
            <label>Codice Univoco</label>
            <input className="input" name="uniqueCode" defaultValue={client.uniqueCode ?? ""} />
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <label>Numero dipendenti</label>
            <input
              className="input"
              type="number"
              name="employeesCount"
              defaultValue={client.employeesCount ?? ""}
            />
          </div>

          <div>
            <label>Medico competente</label>
            <input
              className="input"
              name="occupationalDoctorName"
              defaultValue={client.occupationalDoctorName ?? ""}
            />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Indirizzo</label>
          <input className="input" name="address" defaultValue={client.address ?? ""} />
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <label>Sede legale</label>
            <input className="input" name="legalSeat" defaultValue={client.legalSeat ?? ""} />
          </div>

          <div>
            <label>Sede operativa</label>
            <input className="input" name="operativeSeat" defaultValue={client.operativeSeat ?? ""} />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Note cliente</label>
          <textarea className="input" name="notes" rows={5} defaultValue={client.notes ?? ""} />
        </div>

        <div className="card" style={{ marginTop: 14 }}>
          <h2>Referente principale</h2>

          <input type="hidden" name="contactId" value={primaryContact?.id ?? ""} />

          <div className="grid2" style={{ marginTop: 12 }}>
            <div>
              <label>Nome referente</label>
              <input className="input" name="refName" defaultValue={primaryContact?.name ?? ""} />
            </div>

            <div>
              <label>Ruolo</label>
              <select className="input" name="refRole" defaultValue={primaryContact?.role ?? "ALTRO"}>
                {CONTACT_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid2" style={{ marginTop: 12 }}>
            <div>
              <label>Email referente</label>
              <input className="input" name="refEmail" defaultValue={primaryContact?.email ?? ""} />
            </div>

            <div>
              <label>Telefono referente</label>
              <input className="input" name="refPhone" defaultValue={primaryContact?.phone ?? ""} />
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label>Note referente</label>
            <textarea
              className="input"
              name="refNotes"
              rows={3}
              defaultValue={primaryContact?.notes ?? ""}
            />
          </div>
        </div>

        <div className="row" style={{ marginTop: 14, gap: 8, flexWrap: "wrap" }}>
          <button className="btn primary" type="submit">
            Salva
          </button>

          <Link className="btn" href={`/clients/${client.id}`}>
            Annulla
          </Link>
        </div>
      </form>

      <div
        className="card"
        style={{
          marginTop: 12,
          border: "1px solid rgba(245,158,11,0.35)",
          background: "rgba(245,158,11,0.06)",
        }}
      >
        <h2>Azioni cliente</h2>

        <div className="row" style={{ gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          <form action={dismissClient}>
            <button className="btn" type="submit">
              Segna dismesso
            </button>
          </form>

          <form action={deleteClient}>
            <button className="btn danger" type="submit">
              Elimina cliente
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}