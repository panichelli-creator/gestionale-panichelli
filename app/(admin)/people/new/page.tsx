import Link from "next/link";
import { redirect } from "next/navigation";
import PersonClientSiteFields from "@/components/people/PersonClientSiteFields";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SP = {
  clientId?: string;
  returnTo?: string;
  err?: string;
};

type SiteRow = {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
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

function normalize(v: string) {
  return String(v ?? "").trim().toUpperCase();
}

function normalizeLists(values: string[]) {
  const out: string[] = [];
  const seen = new Set<string>();

  for (const raw of values) {
    const value = normalize(raw);
    if (!value) continue;
    if (seen.has(value)) continue;
    seen.add(value);
    out.push(value);
  }

  return out;
}

function stringifyLists(values: string[]) {
  const out = normalizeLists(values);
  return out.length ? out.join(", ") : "ALTRO";
}

function buildBackHref(returnTo: string, clientId: string) {
  return returnTo || (clientId ? `/clients/${clientId}` : "/people");
}

function buildErrorRedirect(returnTo: string, clientId: string, message: string) {
  const params = new URLSearchParams();
  if (clientId) params.set("clientId", clientId);
  if (returnTo) params.set("returnTo", returnTo);
  params.set("err", message);
  return `/people/new?${params.toString()}`;
}

export default async function NewPersonPage({
  searchParams,
}: {
  searchParams?: SP | Promise<SP>;
}) {
  const { prisma } = await import("@/lib/prisma");

  const resolvedSearchParams =
    searchParams && typeof (searchParams as Promise<SP>).then === "function"
      ? await (searchParams as Promise<SP>)
      : ((searchParams as SP | undefined) ?? {});

  const clients = await prisma.client.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });

  const sitesRaw = await prisma.clientSite.findMany({
    orderBy: [{ client: { name: "asc" } }, { name: "asc" }],
    include: { client: true },
  });

  const sites: SiteRow[] = sitesRaw.map((s) => ({
    id: s.id,
    name: s.name,
    clientId: s.clientId,
    clientName: s.client?.name ?? "—",
  }));

  const defaultClientId = String(resolvedSearchParams.clientId ?? "").trim();
  const returnTo = String(resolvedSearchParams.returnTo ?? "").trim();
  const err = String(resolvedSearchParams.err ?? "").trim();

  async function createPerson(formData: FormData) {
    "use server";

    const { prisma } = await import("@/lib/prisma");

    const lastName = String(formData.get("lastName") ?? "").trim();
    const firstName = String(formData.get("firstName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim() || null;
    const phone = String(formData.get("phone") ?? "").trim() || null;
    const role = String(formData.get("role") ?? "").trim() || null;

    const fiscalCodeRaw = String(formData.get("fiscalCode") ?? "").trim();
    const fiscalCode = fiscalCodeRaw ? fiscalCodeRaw.toUpperCase() : null;

    const hireDateRaw = String(formData.get("hireDate") ?? "").trim();
    const hireDate = hireDateRaw ? new Date(hireDateRaw) : null;

    const clientIdRaw = String(formData.get("clientId") ?? "").trim();
    const clientId = clientIdRaw || null;

    const mainSiteIdRaw = String(formData.get("mainSiteId") ?? "").trim();
    const mainSiteId = mainSiteIdRaw || null;

    const extraClientIds = formData.getAll("extraClientIds").map(String);
    const extraSiteIds = formData.getAll("extraSiteIds").map(String);

    const medicalCheckDone = formData.get("medicalCheckDone") === "on";
    const returnToForm = String(formData.get("returnTo") ?? "").trim();

    const createAlsoContact = formData.get("createAlsoContact") === "on";
    const contactRole = String(formData.get("contactRole") ?? "ALTRO").trim() || "ALTRO";
    const marketingLists = normalizeLists(
      formData.getAll("marketingLists").map((x) => String(x))
    );

    if (!lastName || !firstName) {
      redirect(buildErrorRedirect(returnToForm, clientIdRaw, "Nome e Cognome obbligatori"));
    }

    if (fiscalCode) {
      const existing = await prisma.person.findFirst({
        where: { fiscalCode },
        select: { id: true, lastName: true, firstName: true },
      });

      if (existing) {
        redirect(
          buildErrorRedirect(
            returnToForm,
            clientIdRaw,
            `Codice Fiscale già presente su: ${existing.lastName} ${existing.firstName}`
          )
        );
      }
    }

    if (clientId) {
      const clientExists = await prisma.client.findUnique({
        where: { id: clientId },
        select: { id: true },
      });

      if (!clientExists) {
        redirect(buildErrorRedirect(returnToForm, clientIdRaw, "Cliente principale non valido"));
      }
    }

    if (mainSiteId) {
      const siteExists = await prisma.clientSite.findUnique({
        where: { id: mainSiteId },
        select: { id: true, clientId: true },
      });

      if (!siteExists) {
        redirect(buildErrorRedirect(returnToForm, clientIdRaw, "Sede principale non valida"));
      }

      if (clientId && siteExists.clientId !== clientId) {
        redirect(
          buildErrorRedirect(
            returnToForm,
            clientIdRaw,
            "La sede principale non appartiene al cliente principale"
          )
        );
      }
    }

    const finalClientIds = new Set<string>();
    const finalSiteIds = new Set<string>();

    if (clientId) finalClientIds.add(clientId);
    if (mainSiteId) finalSiteIds.add(mainSiteId);

    for (let i = 0; i < Math.max(extraClientIds.length, extraSiteIds.length); i++) {
      const cid = String(extraClientIds[i] ?? "").trim();
      const sid = String(extraSiteIds[i] ?? "").trim();

      if (cid) finalClientIds.add(cid);
      if (sid) finalSiteIds.add(sid);
    }

    const personDisplayName = `${lastName} ${firstName}`.trim();
    const marketingList = stringifyLists(marketingLists);

    let createdId = "";

    try {
      const created = await prisma.$transaction(async (tx) => {
        const createdPerson = await tx.person.create({
          data: {
            lastName,
            firstName,
            email,
            phone,
            role,
            fiscalCode,
            hireDate,
            medicalCheckDone,
            clientId,
          },
          select: {
            id: true,
          },
        });

        for (const cid of Array.from(finalClientIds)) {
          await tx.personClient.create({
            data: { personId: createdPerson.id, clientId: cid },
          });
        }

        for (const sid of Array.from(finalSiteIds)) {
          await tx.personSite.create({
            data: { personId: createdPerson.id, siteId: sid },
          });
        }

        if (createAlsoContact && clientId) {
          const existingContact = await tx.clientContact.findFirst({
            where: {
              clientId,
              name: personDisplayName,
            },
            select: { id: true },
          });

          if (!existingContact) {
            const noteText = role
              ? `Creato automaticamente da Persona • Mansione: ${role}`
              : "Creato automaticamente da Persona";

            await tx.clientContact.create({
              data: {
                clientId,
                role: contactRole,
                name: personDisplayName,
                email,
                phone,
                notes: noteText,
                marketingList,
              },
            });
          }
        }

        return createdPerson;
      });

      createdId = created.id;
    } catch (e: any) {
      redirect(
        buildErrorRedirect(
          returnToForm,
          clientIdRaw,
          e?.message ?? "Errore salvataggio persona"
        )
      );
    }

    redirect(returnToForm || `/people/${createdId}`);
  }

  const backHref = buildBackHref(returnTo, defaultClientId);

  return (
    <div className="card" style={{ maxWidth: 1180, margin: "0 auto" }}>
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}
      >
        <h1>Aggiungi persona</h1>

        <Link className="btn" href={backHref}>
          {returnTo || defaultClientId ? "← Torna al cliente" : "← Persone"}
        </Link>
      </div>

      {err ? (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 12,
            background: "rgba(239,68,68,0.10)",
            border: "1px solid rgba(239,68,68,0.30)",
            color: "#b91c1c",
            fontWeight: 700,
          }}
        >
          {decodeURIComponent(err)}
        </div>
      ) : null}

      <form action={createPerson} className="card" style={{ marginTop: 12 }}>
        <input type="hidden" name="returnTo" value={returnTo} />

        <div className="grid2">
          <div style={{ minWidth: 0 }}>
            <label>Cognome *</label>
            <input className="input" name="lastName" />
          </div>
          <div style={{ minWidth: 0 }}>
            <label>Nome *</label>
            <input className="input" name="firstName" />
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div style={{ minWidth: 0 }}>
            <label>Email</label>
            <input className="input" name="email" />
          </div>
          <div style={{ minWidth: 0 }}>
            <label>Telefono</label>
            <input className="input" name="phone" />
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div style={{ minWidth: 0 }}>
            <label>Mansione</label>
            <input className="input" name="role" />
          </div>
          <div style={{ minWidth: 0 }}>
            <label>Codice Fiscale</label>
            <input className="input" name="fiscalCode" />
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div style={{ minWidth: 0 }}>
            <label>Data assunzione</label>
            <input type="date" className="input" name="hireDate" />
          </div>

          <div style={{ display: "flex", alignItems: "end", minWidth: 0 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <input type="checkbox" name="medicalCheckDone" />
              Visita medica effettuata
            </label>
          </div>
        </div>

        <PersonClientSiteFields
          clients={clients}
          sites={sites}
          defaultClientId={defaultClientId}
          defaultMainSiteId=""
          initialExtraPairs={[{ clientId: "", siteId: "" }]}
        />

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
              <label>Liste marketing</label>
              <div className="card" style={{ marginTop: 8, padding: 10 }}>
                {MARKETING_LISTS.map((m) => (
                  <label key={m} style={{ display: "block" }}>
                    <input type="checkbox" name="marketingLists" value={m} /> {m}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="muted" style={{ marginTop: 8 }}>
            Se attivo e hai un cliente principale selezionato, il contatto viene creato in automatico.
          </div>
        </div>

        <div className="row" style={{ marginTop: 14, gap: 8, flexWrap: "wrap" }}>
          <button className="btn primary" type="submit">
            Salva
          </button>
          <Link className="btn" href={backHref}>
            Annulla
          </Link>
        </div>
      </form>
    </div>
  );
}