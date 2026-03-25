import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

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

export default async function EditPersonPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: SP;
}) {
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

  const existingContact = person.clientId
    ? await prisma.clientContact.findFirst({
        where: {
          clientId: person.clientId,
          name: `${person.lastName} ${person.firstName}`.trim(),
        },
        select: {
          id: true,
          role: true,
          marketingList: true,
        },
      })
    : null;

  const clientIdFromQs = String(searchParams?.clientId ?? "").trim();
  const returnTo = String(searchParams?.returnTo ?? "").trim();

  const qs = new URLSearchParams();
  if (clientIdFromQs) qs.set("clientId", clientIdFromQs);
  if (returnTo) qs.set("returnTo", returnTo);
  const tail = qs.toString();
  const qsSuffix = tail ? `?${tail}` : "";

  const fmtDate = (d: Date | null) =>
    d ? new Date(d).toISOString().slice(0, 10) : "";

  const linkedClientIds = new Set<string>();
  if (person.clientId) linkedClientIds.add(person.clientId);
  for (const pc of person.personClients) linkedClientIds.add(pc.clientId);

  const mainClientId = person.clientId ?? "";
  const mainSiteId =
    person.personSites.find((ps) => ps.site?.clientId === person.clientId)?.siteId ?? "";

  const mainClientSites = mainClientId
    ? sites.filter((s) => s.clientId === mainClientId)
    : [];

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

    const medicalCheckDone =
      String(formData.get("medicalCheckDone") ?? "").trim() === "on";

    const clientIdRaw = String(formData.get("clientId") ?? "").trim();
    const clientId = clientIdRaw || null;

    const mainSiteIdRaw = String(formData.get("mainSiteId") ?? "").trim();
    const mainSiteId = mainSiteIdRaw || null;

    const extraClientIds = formData.getAll("extraClientIds").map(String);
    const extraSiteIds = formData.getAll("extraSiteIds").map(String);

    const createAlsoContact = formData.get("createAlsoContact") === "on";
    const contactRole = String(formData.get("contactRole") ?? "ALTRO").trim() || "ALTRO";
    const marketingList =
      String(formData.get("marketingList") ?? "ALTRO").trim() || "ALTRO";

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
              name: personDisplayName,
            },
            select: { id: true },
          });

          if (existingByName) {
            await tx.clientContact.update({
              where: { id: existingByName.id },
              data: {
                role: contactRole,
                marketingList,
                name: personDisplayName,
                email,
                phone,
                notes: role
                  ? `Aggiornato automaticamente da Persona • Mansione: ${role}`
                  : "Aggiornato automaticamente da Persona",
              },
            });
          } else {
            await tx.clientContact.create({
              data: {
                clientId,
                role: contactRole,
                marketingList,
                name: personDisplayName,
                email,
                phone,
                notes: role
                  ? `Creato automaticamente da Persona • Mansione: ${role}`
                  : "Creato automaticamente da Persona",
              },
            });
          }
        }
      });
    } catch (e: any) {
      const msg = e?.message ?? "Errore salvataggio";
      redirect(buildEditRedirect(msg));
    }

    redirect(returnToForm || `/people/${id}${clientIdQsForm ? `?clientId=${encodeURIComponent(clientIdQsForm)}` : ""}`);
  }

  async function deletePerson(formData: FormData) {
    "use server";

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

      {searchParams?.err ? (
        <div className="card" style={{ marginTop: 12, border: "1px solid #ff6b6b" }}>
          <b style={{ color: "#ff6b6b" }}>Errore:</b>{" "}
          {decodeURIComponent(searchParams.err)}
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

        <div className="card" style={{ marginTop: 12 }}>
          <h2>Cliente principale</h2>

          <div className="grid2" style={{ marginTop: 10 }}>
            <div style={{ minWidth: 0 }}>
              <label>Cliente principale</label>
              <select
                className="input"
                name="clientId"
                id="mainClientSelect"
                defaultValue={mainClientId}
              >
                <option value="">— nessun cliente —</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ minWidth: 0 }}>
              <label>Sede principale</label>
              <select
                className="input"
                name="mainSiteId"
                id="mainSiteSelect"
                defaultValue={mainSiteId}
              >
                <option value="">— nessuna sede —</option>
                {mainClientSites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="muted" style={{ marginTop: 6 }}>
            Prima scegli il cliente principale, poi seleziona una sede di quel cliente.
          </div>
        </div>

        <div className="card" style={{ marginTop: 12, overflow: "hidden" }}>
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <h2 style={{ margin: 0 }}>Altri collegamenti cliente / sede</h2>
            <button className="btn" type="button" id="add-link-row-btn">
              + Aggiungi riga
            </button>
          </div>

          <div className="muted" style={{ marginTop: 6 }}>
            Per ogni riga scegli un cliente e, se vuoi, una sede di quel cliente.
          </div>

          <div id="extra-link-rows" style={{ marginTop: 12, display: "grid", gap: 10 }}>
            {extraPairs.map((row, idx) => (
              <div
                key={`${row.clientId}-${row.siteId}-${idx}`}
                className="extra-link-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) auto",
                  gap: 10,
                  alignItems: "end",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <label>Cliente</label>
                  <select
                    className="input extra-client-select"
                    name="extraClientIds"
                    data-selected-client={row.clientId}
                    defaultValue={row.clientId}
                  >
                    <option value="">— nessun cliente —</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ minWidth: 0 }}>
                  <label>Sede</label>
                  <select
                    className="input extra-site-select"
                    name="extraSiteIds"
                    data-selected-site={row.siteId}
                    defaultValue={row.siteId}
                  >
                    <option value="">— nessuna sede —</option>
                  </select>
                </div>

                <div>
                  <button className="btn remove-link-row-btn" type="button">
                    Rimuovi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

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
              <label>Lista marketing</label>
              <select
                className="input"
                name="marketingList"
                defaultValue={existingContact?.marketingList ?? "ALTRO"}
              >
                {MARKETING_LISTS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
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

      <script
        dangerouslySetInnerHTML={{
          __html: `
(function () {
  const allSites = ${JSON.stringify(sites)};
  const allClients = ${JSON.stringify(clients.map(c => ({ id: c.id, name: c.name })))};

  function siteOptionsForClient(clientId) {
    if (!clientId) return [];
    return allSites.filter(s => s.clientId === clientId);
  }

  function fillSiteSelect(selectEl, clientId, selectedSiteId) {
    if (!selectEl) return;

    const current = selectedSiteId || "";
    const options = siteOptionsForClient(clientId);

    selectEl.innerHTML = "";

    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "— nessuna sede —";
    selectEl.appendChild(empty);

    for (const s of options) {
      const opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = s.name;
      if (current && current === s.id) opt.selected = true;
      selectEl.appendChild(opt);
    }

    if (current && !options.some(s => s.id === current)) {
      selectEl.value = "";
    }
  }

  function wireMain() {
    const clientSel = document.getElementById("mainClientSelect");
    const siteSel = document.getElementById("mainSiteSelect");
    if (!clientSel || !siteSel) return;

    clientSel.addEventListener("change", function () {
      fillSiteSelect(siteSel, clientSel.value, "");
    });
  }

  function wireRow(row) {
    if (!row) return;
    const clientSel = row.querySelector(".extra-client-select");
    const siteSel = row.querySelector(".extra-site-select");
    const removeBtn = row.querySelector(".remove-link-row-btn");

    if (!clientSel || !siteSel) return;

    const initialClient = clientSel.getAttribute("data-selected-client") || clientSel.value || "";
    const initialSite = siteSel.getAttribute("data-selected-site") || siteSel.value || "";
    fillSiteSelect(siteSel, initialClient, initialSite);

    clientSel.addEventListener("change", function () {
      fillSiteSelect(siteSel, clientSel.value, "");
    });

    if (removeBtn) {
      removeBtn.addEventListener("click", function () {
        const rows = document.querySelectorAll(".extra-link-row");
        if (rows.length <= 1) {
          clientSel.value = "";
          fillSiteSelect(siteSel, "", "");
          return;
        }
        row.remove();
      });
    }
  }

  function createRow() {
    const wrap = document.createElement("div");
    wrap.className = "extra-link-row";
    wrap.style.display = "grid";
    wrap.style.gridTemplateColumns = "minmax(0,1fr) minmax(0,1fr) auto";
    wrap.style.gap = "10px";
    wrap.style.alignItems = "end";

    const clientCol = document.createElement("div");
    clientCol.style.minWidth = "0";
    clientCol.innerHTML = '<label>Cliente</label>';

    const clientSel = document.createElement("select");
    clientSel.className = "input extra-client-select";
    clientSel.name = "extraClientIds";

    const emptyClient = document.createElement("option");
    emptyClient.value = "";
    emptyClient.textContent = "— nessun cliente —";
    clientSel.appendChild(emptyClient);

    for (const c of allClients) {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.name;
      clientSel.appendChild(opt);
    }

    clientCol.appendChild(clientSel);

    const siteCol = document.createElement("div");
    siteCol.style.minWidth = "0";
    siteCol.innerHTML = '<label>Sede</label>';

    const siteSel = document.createElement("select");
    siteSel.className = "input extra-site-select";
    siteSel.name = "extraSiteIds";
    siteCol.appendChild(siteSel);

    const btnCol = document.createElement("div");
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "btn remove-link-row-btn";
    removeBtn.textContent = "Rimuovi";
    btnCol.appendChild(removeBtn);

    wrap.appendChild(clientCol);
    wrap.appendChild(siteCol);
    wrap.appendChild(btnCol);

    const container = document.getElementById("extra-link-rows");
    if (container) {
      container.appendChild(wrap);
      wireRow(wrap);
    }
  }

  wireMain();
  document.querySelectorAll(".extra-link-row").forEach(wireRow);

  const addBtn = document.getElementById("add-link-row-btn");
  if (addBtn) {
    addBtn.addEventListener("click", function () {
      createRow();
    });
  }
})();
          `,
        }}
      />
    </div>
  );
}