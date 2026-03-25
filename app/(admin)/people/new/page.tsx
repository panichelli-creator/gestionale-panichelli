import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

type SP = {
  clientId?: string;
  returnTo?: string;
};

const CONTACT_ROLES = [
  "OWNER",
  "TITOLARE",
  "OFFICE_MANAGER",
  "ASO",
  "MEDICO",
  "AMMINISTRAZIONE",
  "ALTRO",
] as const;

const MARKETING_LISTS = [
  "MEDICI",
  "ASO",
  "TITOLARI",
  "AMMINISTRAZIONE",
  "IGIENISTI",
  "FISIOTERAPISTI",
  "ALTRO",
] as const;

export default async function NewPersonPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const clients = await prisma.client.findMany({
    orderBy: { name: "asc" },
  });

  const defaultClientId = String(searchParams.clientId ?? "").trim();
  const returnTo = String(searchParams.returnTo ?? "").trim();

  async function createPerson(formData: FormData) {
    "use server";

    const lastName = String(formData.get("lastName") ?? "").trim();
    const firstName = String(formData.get("firstName") ?? "").trim();
    if (!lastName || !firstName) throw new Error("Nome e Cognome obbligatori");

    const email = String(formData.get("email") ?? "").trim() || null;
    const phone = String(formData.get("phone") ?? "").trim() || null;
    const role = String(formData.get("role") ?? "").trim() || null;
    const fiscalCode = String(formData.get("fiscalCode") ?? "").trim() || null;

    const clientIdRaw = String(formData.get("clientId") ?? "").trim();
    const clientId = clientIdRaw ? clientIdRaw : null;

    const medicalCheckDone = formData.get("medicalCheckDone") === "on";
    const returnToForm = String(formData.get("returnTo") ?? "").trim();

    const createAlsoContact = formData.get("createAlsoContact") === "on";
    const contactRole = String(formData.get("contactRole") ?? "ALTRO").trim() || "ALTRO";
    const marketingList =
      String(formData.get("marketingList") ?? "ALTRO").trim() || "ALTRO";

    const created = await prisma.person.create({
      data: {
        lastName,
        firstName,
        email,
        phone,
        role,
        fiscalCode,
        clientId,
        medicalCheckDone,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    if (createAlsoContact && clientId) {
      const contactName = `${created.lastName} ${created.firstName}`.trim();

      const existingContact = await prisma.clientContact.findFirst({
        where: {
          clientId,
          name: contactName,
        },
        select: { id: true },
      });

      if (!existingContact) {
        await prisma.clientContact.create({
          data: {
            clientId,
            role: contactRole,
            marketingList,
            name: contactName,
            email,
            phone,
            notes: role ? `Creato automaticamente da Persona • Mansione: ${role}` : "Creato automaticamente da Persona",
          },
        });
      }
    }

    redirect(returnToForm || "/people");
  }

  const backHref =
    returnTo ||
    (defaultClientId ? `/clients/${defaultClientId}` : "/people");

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Aggiungi persona</h1>
        <Link className="btn" href={backHref}>
          {returnTo || defaultClientId ? "← Torna al cliente" : "← Persone"}
        </Link>
      </div>

      <form action={createPerson} className="card" style={{ marginTop: 12 }}>
        <input type="hidden" name="returnTo" value={returnTo} />

        <div className="grid2">
          <div>
            <label>Cognome *</label>
            <input className="input" name="lastName" />
          </div>
          <div>
            <label>Nome *</label>
            <input className="input" name="firstName" />
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <label>Email</label>
            <input className="input" name="email" />
          </div>
          <div>
            <label>Telefono</label>
            <input className="input" name="phone" />
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <label>Mansione</label>
            <input className="input" name="role" />
          </div>
          <div>
            <label>Codice Fiscale</label>
            <input className="input" name="fiscalCode" />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Cliente (opzionale)</label>
          <select className="input" name="clientId" defaultValue={defaultClientId}>
            <option value="">— one-shot (nessun cliente) —</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="row" style={{ gap: 10, marginTop: 12 }}>
          <input type="checkbox" name="medicalCheckDone" />
          <span className="muted">Visita medica svolta</span>
        </div>

        <div className="card" style={{ marginTop: 12 }}>
          <label style={{ display: "flex", gap: 10, alignItems: "center", fontWeight: 700 }}>
            <input type="checkbox" name="createAlsoContact" />
            Crea anche come contatto cliente
          </label>

          <div className="grid2" style={{ marginTop: 12 }}>
            <div>
              <label>Ruolo contatto</label>
              <select className="input" name="contactRole" defaultValue="ALTRO">
                {CONTACT_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Lista marketing</label>
              <select className="input" name="marketingList" defaultValue="ALTRO">
                {MARKETING_LISTS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="muted" style={{ marginTop: 8 }}>
            Se selezioni la spunta e hai scelto un cliente, il contatto viene creato in automatico.
          </div>
        </div>

        <div className="row" style={{ marginTop: 14 }}>
          <button className="btn primary" type="submit">Salva</button>
          <Link className="btn" href={backHref}>Annulla</Link>
        </div>
      </form>
    </div>
  );
}