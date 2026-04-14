import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import PersonClientSiteFields from "@/components/people/PersonClientSiteFields";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SiteRow = {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
};

type SP = {
  err?: string;
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

function splitMarketingLists(value: any) {
  return normalizeLists(
    String(value ?? "")
      .split(",")
      .map((x) => String(x ?? ""))
  );
}

function stringifyLists(values: string[]) {
  const out = normalizeLists(values);
  return out.length ? out.join(", ") : "ALTRO";
}

function fmtDate(d: Date | null) {
  return d ? new Date(d).toISOString().slice(0, 10) : "";
}

export default async function EditPersonPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: SP | Promise<SP>;
}) {
  const { prisma } = await import("@/lib/prisma");

  const resolvedSearchParams =
    searchParams && typeof (searchParams as Promise<SP>).then === "function"
      ? await (searchParams as Promise<SP>)
      : ((searchParams as SP | undefined) ?? {});

  const person = await prisma.person.findUnique({
    where: { id: params.id },
    include: {
      client: true,
      personClients: { include: { client: true } },
      personSites: {
        include: {
          site: {
            include: { client: true },
          },
        },
      },
    },
  });

  if (!person) return notFound();

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

  const personDisplayName = `${person.lastName} ${person.firstName}`.trim();

  const existingContact = person.clientId
    ? await prisma.clientContact.findFirst({
        where: {
          clientId: person.clientId,
          name: personDisplayName,
        },
        select: {
          id: true,
          role: true,
          marketingList: true,
        },
      })
    : null;

  const clientIdFromQs = String(resolvedSearchParams?.clientId ?? "").trim();
  const returnTo = String(resolvedSearchParams?.returnTo ?? "").trim();
  const err = String(resolvedSearchParams?.err ?? "").trim();

  const qs = new URLSearchParams();
  if (clientIdFromQs) qs.set("clientId", clientIdFromQs);
  if (returnTo) qs.set("returnTo", returnTo);
  const tail = qs.toString();
  const qsSuffix = tail ? `?${tail}` : "";

  const linkedClientIds = new Set<string>();
  if (person.clientId) linkedClientIds.add(person.clientId);
  for (const pc of person.personClients) linkedClientIds.add(pc.clientId);

  const mainClientId = person.clientId ?? "";
  const mainSiteId =
    person.personSites.find((ps) => ps.site?.clientId === person.clientId)?.siteId ?? "";

  const extraPairs: { clientId: string; siteId: string }[] = [];
  const usedPairKeys = new Set<string>();

  for (const ps of person.personSites) {
    const s = ps.site;
    if (!s) continue;
    if (person.clientId && s.clientId === person.clientId && ps.siteId === mainSiteId) continue;

    const key = `${s.clientId}__${s.id}`;
    if (!usedPairKeys.has(key)) {
      usedPairKeys.add(key);
      extraPairs.push({ clientId: s.clientId, siteId: s.id });
    }
  }

  for (const cid of linkedClientIds) {
    if (cid === mainClientId) continue;
    const alreadyHasSite = extraPairs.some((p) => p.clientId === cid);
    if (!alreadyHasSite) {
      extraPairs.push({ clientId: cid, siteId: "" });
    }
  }

  if (extraPairs.length === 0) {
    extraPairs.push({ clientId: "", siteId: "" });
  }

  async function updatePerson(formData: FormData) {
    "use server";

    const { prisma } = await import("@/lib/prisma");
    const id = params.id;

    const lastName = String(formData.get("lastName") ?? "").trim();
    const firstName = String(formData.get("firstName") ?? "").trim();

    const returnToForm = String(formData.get("returnTo") ?? "").trim();
    const clientIdQsForm = String(formData.get("clientIdQs") ?? "").trim();

    const buildEditRedirect = (errMsg: string) => {
      const p = new URLSearchParams();
      p.set("err", errMsg);
      if (clientIdQsForm) p.set("clientId", clientIdQsForm);
      if (returnToForm) p.set("returnTo", returnToForm);
      return `/people/${id}/edit?${p.toString()}`;
    };

    if (!lastName || !firstName) {
      redirect(buildEditRedirect("Nome e Cognome obbligatori"));
    }

    const email = String(formData.get("email") ?? "").trim() || null;
    const phone = String(formData.get("phone") ?? "").trim() || null;
    const role = String(formData.get("role") ?? "").trim() || null;

    const fiscalCodeRaw = String(formData.get("fiscalCode") ?? "").trim();
    const fiscalCode = fiscalCodeRaw ? fiscalCodeRaw.toUpperCase() : null;

    const hireDateRaw = String(formData.get("hireDate") ?? "").trim();
    const hireDate = hireDateRaw ? new Date(hireDateRaw) : null;

    const medicalCheckDone = String(formData.get("medicalCheckDone") ?? "").trim() === "on";

    const clientIdRaw = String(formData.get("clientId") ?? "").trim();
    const clientId = clientIdRaw || null;

    const mainSiteIdRaw = String(formData.get("mainSiteId") ?? "").trim();
    const mainSiteId = mainSiteIdRaw || null;

    const extraClientIds = formData.getAll("extraClientIds").map(String);
    const extraSiteIds = formData.getAll("extraSiteIds").map(String);

    const createAlsoContact = formData.get("createAlsoContact") === "on";
    const contactRole = String(formData.get("contactRole") ?? "ALTRO").trim() || "ALTRO";
    const marketingLists = normalizeLists(
      formData.getAll("marketingLists").map((x) => String(x))
    );
    const marketingList = stringifyLists(marketingLists);

    if (fiscalCode) {
      const existing = await prisma.person.findFirst({
        where: { fiscalCode, NOT: { id } },
        select: { id: true, lastName: true, firstName: true },
      });

      if (existing) {
        const msg = `Codice Fiscale già presente su: ${existing.lastName} ${existing.firstName}`;
        redirect(buildEditRedirect(msg));
      }
    }

    if (clientId) {
      const clientExists = await prisma.client.findUnique({
        where: { id: clientId },
        select: { id: true },
      });

      if (!clientExists) {
        redirect(buildEditRedirect("Cliente principale non valido"));
      }
    }

    if (mainSiteId) {
      const siteExists = await prisma.clientSite.findUnique({
        where: { id: mainSiteId },
        select: { id: true, clientId: true },
      });

      if (!siteExists) {
        redirect(buildEditRedirect("Sede principale non valida"));
      }

      if (clientId && siteExists.clientId !== clientId) {
        redirect(buildEditRedirect("La sede principale non appartiene al cliente principale"));
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

    const updatedPersonDisplayName = `${lastName} ${firstName}`.trim();

    try {
      await prisma.$transaction(async (tx) => {
        await tx.person.update({
          where: { id },
          data: {
            lastName,
            firstName,
            email,
            phone,
            role,
            fiscalCode,
            hireDate,
            medicalCheckDone,
            client: clientId ? { connect: { id: clientId } } : { disconnect: true },
          },
        });

        await tx.personClient.deleteMany({ where: { personId: id } });

        for (const cid of Array.from(finalClientIds)) {
          await tx.personClient.create({
            data: { personId: id, clientId: cid },
          });
        }

        await tx.personSite.deleteMany({ where: { personId: id } });

        for (const sid of Array.from(finalSiteIds)) {
          await tx.personSite.create({
            data: { personId: id, siteId: sid },
          });
        }

        if (createAlsoContact && clientId) {
          const existingByName = await tx.clientContact.findFirst({
            where: {
              clientId,
              name: updatedPersonDisplayName,
            },
            select: { id: true },
          });

          const noteText = role
            ? `Aggiornato automaticamente da Persona • Mansione: ${role}`
            : "Aggiornato automaticamente da Persona";

          const baseData: any = {
            clientId,
            role: contactRole,
            name: updatedPersonDisplayName,
            email,
            phone,
            notes: noteText,
            marketingList,
          };

          if (existingByName) {
            await tx.clientContact.update({
              where: { id: existingByName.id },
              data: baseData,
            });
          } else {
            await tx.clientContact.create({
              data: baseData,
            });
          }
        }
      });
    } catch (e: any) {
      const msg = e?.message ?? "Errore salvataggio";
      redirect(buildEditRedirect(msg));
    }

    redirect(
      returnToForm ||
        `/people/${id}${clientIdQsForm ? `?clientId=${encodeURIComponent(clientIdQsForm)}` : ""}`
    );
  }

  async function deletePerson(formData: FormData) {
    "use server";

    const { prisma } = await import("@/lib/prisma");
    const id = params.id;
    const returnToForm = String(formData.get("returnTo") ?? "").trim();
    const clientIdQsForm = String(formData.get("clientIdQs") ?? "").trim();

    const buildEditRedirect = (errMsg: string) => {
      const p = new URLSearchParams();
      p.set("err", errMsg);
      if (clientIdQsForm) p.set("clientId", clientIdQsForm);
      if (returnToForm) p.set("returnTo", returnToForm);
      return `/people/${id}/edit?${p.toString()}`;
    };

    try {
      await prisma.person.delete({
        where: { id },
      });
    } catch (e: any) {
      const msg = e?.message ?? "Errore eliminazione persona";
      redirect(buildEditRedirect(msg));
    }

    redirect(returnToForm || "/people");
  }

  const backHref = returnTo || `/people/${person.id}${qsSuffix}`;
  const cancelHref = returnTo || `/people/${person.id}${qsSuffix}`;
  const selectedMarketingLists = splitMarketingLists(existingContact?.marketingList);

  return (
    <div className="card" style={{ maxWidth: 1180, margin: "0 auto" }}>
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}
      >
        <h1>Modifica persona</h1>

        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
          <Link className="btn" href={backHref}>
            {returnTo ? "← Torna al cliente" : "← Torna alla persona"}
          </Link>

          <form action={deletePerson}>
            <input type="hidden" name="returnTo" value={returnTo} />
            <input type="hidden" name="clientIdQs" value={clientIdFromQs} />
            <button
              className="btn"
              type="submit"
              style={{ border: "1px solid #ff6b6b", color: "#ff6b6b" }}
            >
              Elimina persona
            </button>
          </form>
        </div>
      </div>

      {err ? (
        <div className="card" style={{ marginTop: 12, border: "1px solid #ff6b6b" }}>
          <b style={{ color: "#ff6b6b" }}>Errore:</b> {decodeURIComponent(err)}
        </div>
      ) : null}

      <form action={updatePerson} className="card" style={{ marginTop: 12 }}>
        <input type="hidden" name="returnTo" value={returnTo} />
        <input type="hidden" name="clientIdQs" value={clientIdFromQs} />

        <div className="grid2">
          <div style={{ minWidth: 0 }}>
            <label>Cognome *</label>
            <input className="input" name="lastName" defaultValue={person.lastName} />
          </div>
          <div style={{ minWidth: 0 }}>
            <label>Nome *</label>
            <input className="input" name="firstName" defaultValue={person.firstName} />
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div style={{ minWidth: 0 }}>
            <label>Email</label>
            <input className="input" name="email" defaultValue={person.email ?? ""} />
          </div>
          <div style={{ minWidth: 0 }}>
            <label>Telefono</label>
            <input className="input" name="phone" defaultValue={person.phone ?? ""} />
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div style={{ minWidth: 0 }}>
            <label>Mansione</label>
            <input className="input" name="role" defaultValue={person.role ?? ""} />
          </div>
          <div style={{ minWidth: 0 }}>
            <label>Codice Fiscale</label>
            <input className="input" name="fiscalCode" defaultValue={person.fiscalCode ?? ""} />
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div style={{ minWidth: 0 }}>
            <label>Data assunzione</label>
            <input
              type="date"
              className="input"
              name="hireDate"
              defaultValue={fmtDate(person.hireDate ?? null)}
            />
          </div>

          <div style={{ display: "flex", alignItems: "end", minWidth: 0 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <input
                type="checkbox"
                name="medicalCheckDone"
                defaultChecked={person.medicalCheckDone}
              />
              Visita medica effettuata
            </label>
          </div>
        </div>

        <PersonClientSiteFields
          clients={clients}
          sites={sites}
          defaultClientId={mainClientId}
          defaultMainSiteId={mainSiteId}
          initialExtraPairs={extraPairs}
        />

        <div className="card" style={{ marginTop: 12 }}>
          <label style={{ display: "flex", gap: 10, alignItems: "center", fontWeight: 700 }}>
            <input
              type="checkbox"
              name="createAlsoContact"
              defaultChecked={Boolean(existingContact)}
            />
            Crea / aggiorna anche come contatto cliente
          </label>

          <div className="grid2" style={{ marginTop: 12 }}>
            <div>
              <label>Ruolo contatto</label>
              <select
                className="input"
                name="contactRole"
                defaultValue={existingContact?.role ?? "ALTRO"}
              >
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
                    <input
                      type="checkbox"
                      name="marketingLists"
                      value={m}
                      defaultChecked={selectedMarketingLists.includes(m)}
                    />{" "}
                    {m}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="muted" style={{ marginTop: 8 }}>
            Se attivo e hai un cliente principale selezionato, il contatto viene creato o aggiornato in automatico.
          </div>
        </div>

        <div className="row" style={{ marginTop: 14, gap: 8, flexWrap: "wrap" }}>
          <button className="btn primary" type="submit">
            Salva
          </button>

          <Link className="btn" href={cancelHref}>
            Annulla
          </Link>
        </div>
      </form>
    </div>
  );
}