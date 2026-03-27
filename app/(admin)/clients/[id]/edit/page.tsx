import { prisma } from "@/lib/prisma";
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
  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: { contacts: true },
  });

  if (!client) return notFound();

  const clientId = client.id;
  const primaryContact = client.contacts?.[0] ?? null;

  async function updateClient(formData: FormData) {
    "use server";

    const id = params.id;

    const name = String(formData.get("name") ?? "").trim();
    if (!name) throw new Error("Nome cliente obbligatorio");

    const type = String(formData.get("type") ?? "ALTRO");
    const email = String(formData.get("email") ?? "").trim() || null;
    const phone = String(formData.get("phone") ?? "").trim() || null;

    const employeesCountRaw = String(formData.get("employeesCount") ?? "").trim();
    const employeesCount = employeesCountRaw ? Number(employeesCountRaw) : null;

    const vatNumber = String(formData.get("vatNumber") ?? "").trim() || null;
    const pec = String(formData.get("pec") ?? "").trim() || null;
    const uniqueCode = String(formData.get("uniqueCode") ?? "").trim() || null;

    const legalSeat = String(formData.get("legalSeat") ?? "").trim() || null;

    const occupationalDoctorName =
      String(formData.get("occupationalDoctorName") ?? "").trim() || null;
    const notes = String(formData.get("notes") ?? "").trim() || null;

    await prisma.client.update({
      where: { id },
      data: {
        name,
        type: type as any,
        email,
        phone,
        employeesCount,
        vatNumber,
        pec,
        uniqueCode,
        legalSeat,
        occupationalDoctorName,
        notes,
      },
    });

    const contactId = String(formData.get("contactId") ?? "").trim();
    const refRole = String(formData.get("refRole") ?? "ALTRO");
    const refName = String(formData.get("refName") ?? "").trim();
    const refEmail = String(formData.get("refEmail") ?? "").trim() || null;
    const refPhone = String(formData.get("refPhone") ?? "").trim() || null;
    const refNotes = String(formData.get("refNotes") ?? "").trim() || null;

    if (refName) {
      if (contactId) {
        await prisma.clientContact.update({
          where: { id: contactId },
          data: {
            role: refRole as any,
            name: refName,
            email: refEmail,
            phone: refPhone,
            notes: refNotes,
          },
        });
      } else {
        await prisma.clientContact.create({
          data: {
            clientId: id,
            role: refRole as any,
            name: refName,
            email: refEmail,
            phone: refPhone,
            notes: refNotes,
          },
        });
      }
    }

    redirect(`/clients/${id}`);
  }

  async function dismissClient() {
    "use server";

    const id = params.id;

    await prisma.client.update({
      where: { id },
      data: {
        status: "DISMESSO" as any,
      },
    });

    redirect(`/clients/${id}`);
  }

  async function deleteClient() {
    "use server";

    const id = params.id;

    try {
      await prisma.client.delete({
        where: { id },
      });
      redirect("/clients");
    } catch (e: any) {
      const msg = encodeURIComponent(
        e?.message ??
          "Impossibile eliminare il cliente. Probabilmente ci sono sedi, servizi, pratiche o altri collegamenti attivi."
      );
      redirect(`/clients/${id}/edit?err=${msg}`);
    }
  }

  return (
    <div className="card">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <h1>Modifica cliente</h1>
        <Link className="btn" href={`/clients/${clientId}`}>
          ← Torna al cliente
        </Link>
      </div>

      {searchParams?.err ? (
        <div
          className="card"
          style={{ marginTop: 12, border: "1px solid #ff6b6b", color: "#b42318" }}
        >
          <b>Errore:</b> {decodeURIComponent(searchParams.err)}
        </div>
      ) : null}

      <form action={updateClient} className="card" style={{ marginTop: 12 }}>
        <input type="hidden" name="contactId" value={primaryContact?.id ?? ""} />

        <div className="grid2">
          <div>
            <label>Nome cliente *</label>
            <input className="input" name="name" defaultValue={client.name} />
          </div>

          <div>
            <label>Tipologia</label>
            <select
              className="input"
              name="type"
              defaultValue={client.type ?? "ALTRO"}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <label>Numero dipendenti</label>
            <input
              className="input"
              name="employeesCount"
              type="number"
              min={0}
              defaultValue={client.employeesCount ?? ""}
            />
          </div>
          <div>
            <label>Telefono</label>
            <input className="input" name="phone" defaultValue={client.phone ?? ""} />
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <label>Email</label>
            <input className="input" name="email" defaultValue={client.email ?? ""} />
          </div>
          <div>
            <label>PEC</label>
            <input className="input" name="pec" defaultValue={client.pec ?? ""} />
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <label>Partita IVA</label>
            <input
              className="input"
              name="vatNumber"
              defaultValue={client.vatNumber ?? ""}
            />
          </div>
          <div>
            <label>Codice Univoco</label>
            <input
              className="input"
              name="uniqueCode"
              defaultValue={client.uniqueCode ?? ""}
            />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Sede legale</label>
          <input
            className="input"
            name="legalSeat"
            defaultValue={client.legalSeat ?? ""}
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Medico del lavoro (nome e cognome)</label>
          <input
            className="input"
            name="occupationalDoctorName"
            defaultValue={client.occupationalDoctorName ?? ""}
          />
        </div>

        <div className="card" style={{ marginTop: 14 }}>
          <h2 style={{ marginBottom: 8 }}>Referente principale</h2>

          <div className="grid2">
            <div>
              <label>Tipologia referente</label>
              <select
                className="input"
                name="refRole"
                defaultValue={primaryContact?.role ?? "ALTRO"}
              >
                {CONTACT_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Nome referente</label>
              <input
                className="input"
                name="refName"
                defaultValue={primaryContact?.name ?? ""}
                placeholder="Es. Mario Rossi"
              />
            </div>
          </div>

          <div className="grid2" style={{ marginTop: 12 }}>
            <div>
              <label>Email referente</label>
              <input
                className="input"
                name="refEmail"
                defaultValue={primaryContact?.email ?? ""}
              />
            </div>
            <div>
              <label>Telefono referente</label>
              <input
                className="input"
                name="refPhone"
                defaultValue={primaryContact?.phone ?? ""}
              />
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

          <div className="muted" style={{ marginTop: 8 }}>
            Nota: se lasci “Nome referente” vuoto, non viene creato/aggiornato alcun referente.
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Note cliente</label>
          <textarea
            className="input"
            name="notes"
            rows={5}
            defaultValue={client.notes ?? ""}
          />
        </div>

        <div
          className="row"
          style={{ marginTop: 14, justifyContent: "space-between", alignItems: "center" }}
        >
          <div className="row">
            <button className="btn primary" type="submit">
              Salva
            </button>
            <Link className="btn" href={`/clients/${clientId}`}>
              Annulla
            </Link>
          </div>

          <div
            className="muted"
            style={{
              fontSize: 12,
              textAlign: "right",
              maxWidth: 320,
            }}
          >
            La dismissione mantiene il cliente in archivio. L’eliminazione prova a cancellarlo
            definitivamente e può fallire se esistono collegamenti attivi.
          </div>
        </div>
      </form>

      <div className="card" style={{ marginTop: 12 }}>
        <h2 style={{ marginBottom: 8 }}>Azioni cliente</h2>

        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
          <form action={dismissClient}>
            <button
              className="btn"
              type="submit"
              style={{ border: "1px solid #f59e0b", color: "#b45309" }}
            >
              Dismetti cliente
            </button>
          </form>

          <form action={deleteClient}>
            <button
              className="btn"
              type="submit"
              style={{ border: "1px solid #ff6b6b", color: "#ff6b6b" }}
            >
              Elimina cliente
            </button>
          </form>
        </div>

        <div className="muted" style={{ marginTop: 8 }}>
          Elimina cliente può non riuscire se il cliente ha ancora sedi, servizi, pratiche,
          contatti o altri collegamenti nel gestionale.
        </div>
      </div>
    </div>
  );
}