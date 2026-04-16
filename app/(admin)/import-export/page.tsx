import Link from "next/link";
import ExportButtons from "./ExportButtons";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

function ImportTrainingCard({ title, courseName }: { title: string; courseName: string }) {
  async function action(formData: FormData) {
    "use server";
    const { importTrainingFromCsv } = await import("@/app/actions/importTraining");
    return importTrainingFromCsv(courseName, formData);
  }

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <h2>{title}</h2>
      <div className="muted" style={{ marginTop: 6 }}>
        Carica il CSV (delimiter <b>;</b>). Header diversi ok.
      </div>

      <form action={action} className="card" style={{ marginTop: 12 }}>
        <input className="input" type="file" name="file" accept=".csv,text/csv" required />

        <div className="row" style={{ marginTop: 14, gap: 8 }}>
          <button className="btn primary" type="submit">
            IMPORTA
          </button>
          <Link className="btn" href="/import-export">
            Reset
          </Link>
        </div>
      </form>
    </div>
  );
}

function normalizeText(value: any) {
  return String(value ?? "").trim();
}

function normalizeUpper(value: any) {
  return normalizeText(value).toUpperCase();
}

function normalizeKey(value: any) {
  return normalizeText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function toNum(value: any) {
  if (value == null || value === "") return 0;
  const n = Number(String(value).replace(",", ".").trim());
  return Number.isFinite(n) ? n : 0;
}

function toNullableNum(value: any) {
  if (value == null || String(value).trim() === "") return null;
  const n = toNum(value);
  return Number.isFinite(n) ? n : null;
}

function toBool(value: any) {
  const v = normalizeUpper(value);
  return v === "SI" || v === "SÌ" || v === "TRUE" || v === "1" || v === "ON" || v === "YES";
}

function toDate(value: any): Date | null {
  const raw = normalizeText(value);
  if (!raw) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const d = new Date(`${raw}T12:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
    const [dd, mm, yyyy] = raw.split("/");
    const d = new Date(`${yyyy}-${mm}-${dd}T12:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function splitMulti(value: any) {
  return normalizeText(value)
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean);
}

function splitMarketingLists(value: any) {
  return splitMulti(value).map((x) => x.toUpperCase());
}

function firstNonEmpty(...values: any[]) {
  for (const v of values) {
    const s = normalizeText(v);
    if (s) return s;
  }
  return "";
}

export default async function ImportExportPage() {
  async function importPeopleAction(formData: FormData) {
    "use server";
    const { importPeopleFromCsv } = await import("@/app/actions/importExport");
    return importPeopleFromCsv(formData);
  }

  async function importExcelAction(formData: FormData) {
    "use server";

    const file = formData.get("file") as File | null;
    if (!file) throw new Error("File mancante");

    const buffer = Buffer.from(await file.arrayBuffer());
    const XLSX = await import("xlsx");
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const { prisma } = await import("@/lib/prisma");
    const db: any = prisma as any;

    const report = {
      clienti: 0,
      sedi: 0,
      contatti: 0,
      persone: 0,
      servizi: 0,
      formazione: 0,
      pratiche: 0,
      sal: 0,
      vse: 0,
      map: 0,
      errori: [] as string[],
      warning: [] as string[],
    };

    const clientsByCode = new Map<string, any>();
    const clientsByName = new Map<string, any>();
    const sitesByKey = new Map<string, any>();
    const peopleByKey = new Map<string, any>();
    const practicesByKey = new Map<string, any>();

    async function loadExistingIndexes() {
      const [clients, sites, people, practices] = await Promise.all([
        db.client.findMany({
          select: { id: true, name: true },
        }),
        db.clientSite.findMany({
          select: { id: true, clientId: true, name: true },
          include: { client: { select: { id: true, name: true } } },
        }),
        db.person.findMany({
          select: {
            id: true,
            firstName: true,
            lastName: true,
            fiscalCode: true,
            clientId: true,
          },
          include: {
            client: { select: { id: true, name: true } },
          },
        }),
        db.clientPractice?.findMany
          ? db.clientPractice.findMany({
              select: { id: true, title: true, clientId: true },
              include: { client: { select: { id: true, name: true } } },
            })
          : Promise.resolve([]),
      ]);

      for (const c of clients ?? []) {
        clientsByName.set(normalizeKey(c.name), c);
      }

      for (const s of sites ?? []) {
        const clientName = s.client?.name ?? "";
        sitesByKey.set(`${normalizeKey(clientName)}__${normalizeKey(s.name)}`, s);
      }

      for (const p of people ?? []) {
        const clientName = p.client?.name ?? "";
        const fullName = `${p.lastName ?? ""} ${p.firstName ?? ""}`.trim();
        const fiscal = normalizeUpper(p.fiscalCode);
        if (fiscal) peopleByKey.set(`cf__${fiscal}`, p);
        if (fullName) {
          peopleByKey.set(
            `person__${normalizeKey(clientName)}__${normalizeKey(fullName)}`,
            p
          );
        }
      }

      for (const pr of practices ?? []) {
        const clientName = pr.client?.name ?? "";
        practicesByKey.set(
          `practice__${normalizeKey(clientName)}__${normalizeKey(pr.title)}`,
          pr
        );
      }
    }

    async function resolveClient(row: any, rowLabel: string) {
      const clientCode = firstNonEmpty(row.ClienteCodice, row.CODICE_IMPORT_CLIENTE, row.CodiceCliente);
      const clientName = firstNonEmpty(
        row.ClienteNome,
        row.Cliente,
        row.NomeCliente,
        row.ClientePrincipaleNome
      );

      if (clientCode && clientsByCode.has(clientCode)) return clientsByCode.get(clientCode);

      if (clientName && clientsByName.has(normalizeKey(clientName))) {
        return clientsByName.get(normalizeKey(clientName));
      }

      if (clientName) {
        const found = await db.client.findFirst({
          where: {
            name: clientName,
          },
          select: { id: true, name: true },
        });

        if (found) {
          clientsByName.set(normalizeKey(found.name), found);
          if (clientCode) clientsByCode.set(clientCode, found);
          return found;
        }
      }

      report.errori.push(`${rowLabel}: cliente non trovato`);
      return null;
    }

    async function resolveSite(clientName: string, siteName: string) {
      if (!clientName || !siteName) return null;

      const key = `${normalizeKey(clientName)}__${normalizeKey(siteName)}`;
      if (sitesByKey.has(key)) return sitesByKey.get(key);

      const found = await db.clientSite.findFirst({
        where: {
          name: siteName,
          client: { name: clientName },
        },
        include: { client: { select: { id: true, name: true } } },
      });

      if (found) {
        sitesByKey.set(key, found);
        return found;
      }

      return null;
    }

    async function resolvePerson(row: any, rowLabel: string) {
      const fiscal = normalizeUpper(firstNonEmpty(row.CodiceFiscale, row.CF));
      const personName = firstNonEmpty(row.Persona, row.NomeCompleto, row.Nome);
      const clientName = firstNonEmpty(row.ClienteNome, row.Cliente, row.ClientePrincipaleNome);

      if (fiscal && peopleByKey.has(`cf__${fiscal}`)) {
        return peopleByKey.get(`cf__${fiscal}`);
      }

      if (personName) {
        const key = `person__${normalizeKey(clientName)}__${normalizeKey(personName)}`;
        if (peopleByKey.has(key)) return peopleByKey.get(key);

        const parts = personName.trim().split(/\s+/);
        const firstName = parts.length > 1 ? parts.slice(1).join(" ") : parts[0] ?? "";
        const lastName = parts.length > 1 ? parts[0] : "";

        const found = await db.person.findFirst({
          where: {
            firstName,
            ...(lastName ? { lastName } : {}),
            ...(clientName ? { client: { name: clientName } } : {}),
          },
          include: { client: { select: { id: true, name: true } } },
        });

        if (found) {
          const foundFullName = `${found.lastName ?? ""} ${found.firstName ?? ""}`.trim();
          peopleByKey.set(
            `person__${normalizeKey(found.client?.name ?? "")}__${normalizeKey(foundFullName)}`,
            found
          );
          if (normalizeUpper(found.fiscalCode)) {
            peopleByKey.set(`cf__${normalizeUpper(found.fiscalCode)}`, found);
          }
          return found;
        }
      }

      report.errori.push(`${rowLabel}: persona non trovata`);
      return null;
    }

    await loadExistingIndexes();

    // ===== CLIENTI =====
    if (workbook.Sheets["CLIENTI"]) {
      const rows = XLSX.utils.sheet_to_json<any>(workbook.Sheets["CLIENTI"], { defval: "" });

      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const rowLabel = `CLIENTI riga ${i + 2}`;

        try {
          const code = normalizeText(r.CODICE_IMPORT);
          const name = normalizeText(r.Nome);
          if (!name) continue;

          let existing =
            clientsByName.get(normalizeKey(name)) ||
            (code ? clientsByCode.get(code) : null) ||
            null;

          const data: any = {
            name,
            type: normalizeUpper(r.Tipo) || "ALTRO",
            status: normalizeUpper(r.Stato) || "ATTIVO",
            email: normalizeText(r.Email) || null,
            phone: normalizeText(r.Telefono) || null,
            pec: normalizeText(r.PEC) || null,
            vatNumber: normalizeText(r.PIVA) || null,
            uniqueCode: normalizeText(r.CodiceUnivoco) || null,
            legalSeat: normalizeText(r.SedeLegale) || null,
            operativeSeat: normalizeText(r.SedeOperativa) || null,
            address: normalizeText(r.Indirizzo) || null,
            employeesCount: toNullableNum(r.Dipendenti),
            occupationalDoctorName: normalizeText(r.MedicoLavoro) || null,
            notes: normalizeText(r.Note) || null,
          };

          if (existing) {
            existing = await db.client.update({
              where: { id: existing.id },
              data,
              select: { id: true, name: true },
            });
          } else {
            existing = await db.client.create({
              data,
              select: { id: true, name: true },
            });
            report.clienti++;
          }

          clientsByName.set(normalizeKey(existing.name), existing);
          if (code) clientsByCode.set(code, existing);
        } catch (e: any) {
          report.errori.push(`${rowLabel}: ${e?.message ?? "errore creazione cliente"}`);
        }
      }
    }

    // ===== SEDI =====
    if (workbook.Sheets["SEDI"]) {
      const rows = XLSX.utils.sheet_to_json<any>(workbook.Sheets["SEDI"], { defval: "" });

      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const rowLabel = `SEDI riga ${i + 2}`;

        try {
          const client = await resolveClient(r, rowLabel);
          if (!client) continue;

          const siteName = firstNonEmpty(r.NomeSede, r.Sede, r.Nome);
          if (!siteName) continue;

          const existing = await db.clientSite.findFirst({
            where: {
              clientId: client.id,
              name: siteName,
            },
            select: { id: true, name: true, clientId: true },
          });

          const data: any = {
            clientId: client.id,
            name: siteName,
            address: normalizeText(r.Indirizzo) || null,
            city: normalizeText(r.Città) || null,
            province: normalizeText(r.Provincia) || null,
            cap: normalizeText(r.CAP) || null,
          };

          const saved = existing
            ? await db.clientSite.update({
                where: { id: existing.id },
                data,
                include: { client: { select: { id: true, name: true } } },
              })
            : await db.clientSite.create({
                data,
                include: { client: { select: { id: true, name: true } } },
              });

          sitesByKey.set(
            `${normalizeKey(client.name)}__${normalizeKey(saved.name)}`,
            saved
          );

          if (!existing) report.sedi++;
        } catch (e: any) {
          report.errori.push(`${rowLabel}: ${e?.message ?? "errore creazione sede"}`);
        }
      }
    }

    // ===== CONTATTI =====
    if (workbook.Sheets["CONTATTI"]) {
      const rows = XLSX.utils.sheet_to_json<any>(workbook.Sheets["CONTATTI"], { defval: "" });

      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const rowLabel = `CONTATTI riga ${i + 2}`;

        try {
          const client = await resolveClient(r, rowLabel);
          if (!client) continue;

          const name = normalizeText(r.Nome);
          if (!name) continue;

          const existing = await db.clientContact.findFirst({
            where: {
              clientId: client.id,
              name,
            },
            select: { id: true },
          });

          const data: any = {
            clientId: client.id,
            name,
            role: normalizeUpper(r.Ruolo) || "ALTRO",
            email: normalizeText(r.Email) || null,
            phone: normalizeText(r.Telefono) || null,
            marketingList: splitMarketingLists(r.ListeMarketing).join(", ") || null,
            notes: normalizeText(r.Note) || null,
          };

          if (existing) {
            await db.clientContact.update({
              where: { id: existing.id },
              data,
            });
          } else {
            await db.clientContact.create({ data });
            report.contatti++;
          }
        } catch (e: any) {
          report.errori.push(`${rowLabel}: ${e?.message ?? "errore creazione contatto"}`);
        }
      }
    }

    // ===== PERSONE =====
    if (workbook.Sheets["PERSONE"]) {
      const rows = XLSX.utils.sheet_to_json<any>(workbook.Sheets["PERSONE"], { defval: "" });

      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const rowLabel = `PERSONE riga ${i + 2}`;

        try {
          const lastName = normalizeText(r.Cognome);
          const firstName = normalizeText(r.Nome);
          if (!lastName || !firstName) continue;

          const mainClient = await resolveClient(
            {
              ClienteCodice: r.ClientePrincipaleCodice,
              ClienteNome: r.ClientePrincipaleNome,
            },
            rowLabel
          );

          const fiscalCode = normalizeUpper(r.CodiceFiscale) || null;

          let existing =
            (fiscalCode
              ? await db.person.findFirst({
                  where: { fiscalCode },
                  include: { client: true },
                })
              : null) ||
            (await db.person.findFirst({
              where: {
                firstName,
                lastName,
                ...(mainClient?.id ? { clientId: mainClient.id } : {}),
              },
              include: { client: true },
            }));

          const data: any = {
            lastName,
            firstName,
            email: normalizeText(r.Email) || null,
            phone: normalizeText(r.Telefono) || null,
            role: normalizeText(r.Mansione) || null,
            fiscalCode,
            hireDate: toDate(r.DataAssunzione),
            medicalCheckDone: toBool(r.VisitaMedica),
            ...(mainClient?.id ? { clientId: mainClient.id } : {}),
          };

          if (existing) {
            existing = await db.person.update({
              where: { id: existing.id },
              data,
              include: { client: true },
            });
          } else {
            existing = await db.person.create({
              data,
              include: { client: true },
            });
            report.persone++;
          }

          if (mainClient?.id) {
            const relExists = await db.personClient.findFirst({
              where: { personId: existing.id, clientId: mainClient.id },
              select: { personId: true },
            });

            if (!relExists) {
              await db.personClient.create({
                data: { personId: existing.id, clientId: mainClient.id },
              });
            }
          }

          const mainSiteName = normalizeText(r.SedePrincipale);
          if (mainClient?.name && mainSiteName) {
            const site = await resolveSite(mainClient.name, mainSiteName);
            if (site) {
              const psExists = await db.personSite.findFirst({
                where: { personId: existing.id, siteId: site.id },
                select: { personId: true },
              });

              if (!psExists) {
                await db.personSite.create({
                  data: { personId: existing.id, siteId: site.id },
                });
              }
            }
          }

          for (const extraClientName of splitMulti(r.AltriClienti)) {
            const extraClient = await resolveClient(
              { ClienteNome: extraClientName },
              `${rowLabel} (altri clienti)`
            );
            if (!extraClient) continue;

            const relExists = await db.personClient.findFirst({
              where: { personId: existing.id, clientId: extraClient.id },
              select: { personId: true },
            });

            if (!relExists) {
              await db.personClient.create({
                data: { personId: existing.id, clientId: extraClient.id },
              });
            }
          }

          const personFullName = `${existing.lastName ?? ""} ${existing.firstName ?? ""}`.trim();
          peopleByKey.set(
            `person__${normalizeKey(existing.client?.name ?? mainClient?.name ?? "")}__${normalizeKey(personFullName)}`,
            existing
          );
          if (normalizeUpper(existing.fiscalCode)) {
            peopleByKey.set(`cf__${normalizeUpper(existing.fiscalCode)}`, existing);
          }

          if (toBool(r.CreaComeContatto) && mainClient?.id) {
            const existingContact = await db.clientContact.findFirst({
              where: {
                clientId: mainClient.id,
                name: personFullName,
              },
              select: { id: true },
            });

            const contactData: any = {
              clientId: mainClient.id,
              name: personFullName,
              role: normalizeUpper(r.RuoloContatto) || "ALTRO",
              email: normalizeText(r.Email) || null,
              phone: normalizeText(r.Telefono) || null,
              marketingList: splitMarketingLists(r.ListeMarketing).join(", ") || null,
              notes: normalizeText(r.Note) || null,
            };

            if (existingContact) {
              await db.clientContact.update({
                where: { id: existingContact.id },
                data: contactData,
              });
            } else {
              await db.clientContact.create({ data: contactData });
            }
          }
        } catch (e: any) {
          report.errori.push(`${rowLabel}: ${e?.message ?? "errore creazione persona"}`);
        }
      }
    }

    // ===== SERVIZI =====
    if (workbook.Sheets["SERVIZI"]) {
      const rows = XLSX.utils.sheet_to_json<any>(workbook.Sheets["SERVIZI"], { defval: "" });

      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const rowLabel = `SERVIZI riga ${i + 2}`;

        try {
          const client = await resolveClient(r, rowLabel);
          if (!client) continue;

          const serviceName = normalizeText(r.Servizio);
          if (!serviceName) continue;

          const siteName = normalizeText(r.Sede);
          const site = siteName ? await resolveSite(client.name, siteName) : null;

          let catalog = await db.serviceCatalog.findFirst({
            where: { name: serviceName },
            select: { id: true, name: true },
          });

          if (!catalog) {
            catalog = await db.serviceCatalog.create({
              data: {
                name: serviceName,
                isActive: true,
              },
              select: { id: true, name: true },
            });
          }

          const existing = await db.clientService.findFirst({
            where: {
              clientId: client.id,
              serviceId: catalog.id,
              ...(site?.id ? { siteId: site.id } : {}),
            },
            select: { id: true },
          });

          const data: any = {
            clientId: client.id,
            serviceId: catalog.id,
            siteId: site?.id ?? null,
            periodicity: normalizeUpper(r.Periodicità) || null,
            priceEur: toNullableNum(r.Prezzo),
            dueDate: toDate(r.DataScadenza),
            status: normalizeUpper(r.Stato) || "DA_FARE",
            referenteName: normalizeText(r.Referente) || null,
            referentePerc: toNullableNum(r.PercentualeReferente),
            rxEndoralCount: toNum(r.RXEndorali),
            rxOptCount: toNum(r.RXOpt),
            notes: normalizeText(r.Note) || null,
          };

          if (existing) {
            await db.clientService.update({
              where: { id: existing.id },
              data,
            });
          } else {
            await db.clientService.create({ data });
            report.servizi++;
          }
        } catch (e: any) {
          report.errori.push(`${rowLabel}: ${e?.message ?? "errore creazione servizio"}`);
        }
      }
    }

    // ===== FORMAZIONE =====
    if (workbook.Sheets["FORMAZIONE"]) {
      const rows = XLSX.utils.sheet_to_json<any>(workbook.Sheets["FORMAZIONE"], { defval: "" });

      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const rowLabel = `FORMAZIONE riga ${i + 2}`;

        try {
          const person = await resolvePerson(r, rowLabel);
          if (!person) continue;

          const courseName = normalizeText(r.Corso);
          if (!courseName) continue;

          let course = await db.course?.findFirst?.({
            where: { name: courseName },
            select: { id: true, name: true },
          });

          if (!course && db.course?.create) {
            course = await db.course.create({
              data: { name: courseName },
              select: { id: true, name: true },
            });
          }

          if (!course || !db.trainingRecord) {
            report.warning.push(`${rowLabel}: corso/trainingRecord non disponibile nello schema`);
            continue;
          }

          const existing = await db.trainingRecord.findFirst({
            where: {
              personId: person.id,
              courseId: course.id,
            },
            select: { id: true },
          });

          const data: any = {
            personId: person.id,
            courseId: course.id,
            dueDate: toDate(r.DataScadenza),
            notes: normalizeText(r.Note) || null,
          };

          if (toDate(r.DataUltima)) {
            data.completedAt = toDate(r.DataUltima);
          }

          if (existing) {
            await db.trainingRecord.update({
              where: { id: existing.id },
              data,
            });
          } else {
            await db.trainingRecord.create({ data });
            report.formazione++;
          }
        } catch (e: any) {
          report.errori.push(`${rowLabel}: ${e?.message ?? "errore formazione"}`);
        }
      }
    }

    // ===== PRATICHE =====
    if (workbook.Sheets["PRATICHE"] && db.clientPractice) {
      const rows = XLSX.utils.sheet_to_json<any>(workbook.Sheets["PRATICHE"], { defval: "" });

      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const rowLabel = `PRATICHE riga ${i + 2}`;

        try {
          const client = await resolveClient(r, rowLabel);
          if (!client) continue;

          const title = normalizeText(r.Titolo);
          if (!title) continue;

          const existing =
            practicesByKey.get(`practice__${normalizeKey(client.name)}__${normalizeKey(title)}`) ||
            (await db.clientPractice.findFirst({
              where: { clientId: client.id, title },
              select: { id: true, title: true, clientId: true },
              include: { client: { select: { id: true, name: true } } },
            }));

          const data: any = {
            clientId: client.id,
            title,
            practiceDate: toDate(r.DataPratica),
            determinaNumber: normalizeText(r.Determina) || null,
            apertureStatus: normalizeUpper(r.StatoApertura) || "IN_ATTESA",
            startYear: toNullableNum(r.AnnoInizio),
            inApertureList: toBool(r.InListaAperture),
            fatturata: toBool(r.Fatturata),
            notes: normalizeText(r.Note) || null,
          };

          const saved = existing
            ? await db.clientPractice.update({
                where: { id: existing.id },
                data,
                include: { client: { select: { id: true, name: true } } },
              })
            : await db.clientPractice.create({
                data,
                include: { client: { select: { id: true, name: true } } },
              });

          practicesByKey.set(
            `practice__${normalizeKey(client.name)}__${normalizeKey(saved.title)}`,
            saved
          );

          if (!existing) report.pratiche++;
        } catch (e: any) {
          report.errori.push(`${rowLabel}: ${e?.message ?? "errore pratica"}`);
        }
      }
    }

    // ===== PRATICHE_SAL =====
    if (workbook.Sheets["PRATICHE_SAL"] && db.practiceBillingStep) {
      const rows = XLSX.utils.sheet_to_json<any>(workbook.Sheets["PRATICHE_SAL"], { defval: "" });

      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const rowLabel = `PRATICHE_SAL riga ${i + 2}`;

        try {
          const practiceTitle = normalizeText(r.PraticaTitolo);
          const clientName = normalizeText(r.ClienteNome);
          if (!practiceTitle || !clientName) continue;

          const practice =
            practicesByKey.get(
              `practice__${normalizeKey(clientName)}__${normalizeKey(practiceTitle)}`
            ) ||
            null;

          if (!practice) {
            report.errori.push(`${rowLabel}: pratica non trovata`);
            continue;
          }

          const label = normalizeText(r.Voce);
          if (!label) continue;

          const existing = await db.practiceBillingStep.findFirst({
            where: {
              practiceId: practice.id,
              label,
            },
            select: { id: true },
          });

          const data: any = {
            practiceId: practice.id,
            sortOrder: toNum(r.Ordine) || i + 1,
            label,
            billingType: normalizeUpper(r.Tipo) || "ALTRO",
            triggerStatus: normalizeUpper(r.TriggerStato) || null,
            amountEur: toNum(r.Importo),
            billingStatus: normalizeUpper(r.StatoFattura) || "DA_FATTURARE",
            invoiceNumber: normalizeText(r.NumeroFattura) || null,
            invoiceDate: toDate(r.DataFattura),
            paidAt: toDate(r.DataIncasso),
            notes: normalizeText(r.Note) || null,
          };

          if (existing) {
            await db.practiceBillingStep.update({
              where: { id: existing.id },
              data,
            });
          } else {
            await db.practiceBillingStep.create({ data });
            report.sal++;
          }
        } catch (e: any) {
          report.errori.push(`${rowLabel}: ${e?.message ?? "errore SAL pratica"}`);
        }
      }
    }

    // ===== VSE =====
    if (workbook.Sheets["VSE"] && db.clinicalEngineeringCheck) {
      const rows = XLSX.utils.sheet_to_json<any>(workbook.Sheets["VSE"], { defval: "" });

      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const rowLabel = `VSE riga ${i + 2}`;

        try {
          const client = await resolveClient(r, rowLabel);
          if (!client) continue;

          const siteName = normalizeText(r.Sede);
          const site = siteName ? await resolveSite(client.name, siteName) : null;

          const existing = await db.clinicalEngineeringCheck.findFirst({
            where: {
              clientId: client.id,
              ...(site?.id ? { siteId: site.id } : {}),
              ...(toDate(r.DataAppuntamento)
                ? { dataAppuntamentoPreso: toDate(r.DataAppuntamento) }
                : {}),
            },
            select: { id: true },
          });

          const data: any = {
            clientId: client.id,
            siteId: site?.id ?? null,
            referente: normalizeText(r.Referente) || null,
            periodicity: normalizeUpper(r.Periodicità) || null,
            dataAppuntamentoPreso: toDate(r.DataAppuntamento),
            dataUltimoAppuntamento: toDate(r.DataUltimoAppuntamento),
            verificheEseguite: toBool(r.VerificheEseguite),
            fileSuDropbox: toBool(r.FileDropbox),
            fatturata: toBool(r.FatturataCliente),
            tecnicoFatturato: toBool(r.TecnicoPagato),
            notes: normalizeText(r.Note) || null,
          };

          if (existing) {
            await db.clinicalEngineeringCheck.update({
              where: { id: existing.id },
              data,
            });
          } else {
            await db.clinicalEngineeringCheck.create({ data });
            report.vse++;
          }
        } catch (e: any) {
          report.errori.push(`${rowLabel}: ${e?.message ?? "errore VSE"}`);
        }
      }
    }

    // ===== MAP =====
    if (workbook.Sheets["MAP"] && db.mapPlanItem) {
      const rows = XLSX.utils.sheet_to_json<any>(workbook.Sheets["MAP"], { defval: "" });

      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const rowLabel = `MAP riga ${i + 2}`;

        try {
          const client = await resolveClient(r, rowLabel);
          if (!client) continue;

          const siteName = normalizeText(r.Sede);
          const serviceName = normalizeText(r.Servizio);
          const ym = normalizeText(r.Mese);
          if (!serviceName || !ym) continue;

          const site = siteName ? await resolveSite(client.name, siteName) : null;

          const catalog = await db.serviceCatalog.findFirst({
            where: { name: serviceName },
            select: { id: true },
          });

          if (!catalog) {
            report.errori.push(`${rowLabel}: servizio catalogo non trovato`);
            continue;
          }

          const clientService = await db.clientService.findFirst({
            where: {
              clientId: client.id,
              serviceId: catalog.id,
              ...(site?.id ? { siteId: site.id } : {}),
            },
            select: { id: true },
          });

          if (!clientService) {
            report.errori.push(`${rowLabel}: clientService non trovato`);
            continue;
          }

          const plannedDate = toDate(r.DataPianificata);
          const plannedDay = plannedDate ? plannedDate.getDate() : null;

          await db.mapPlanItem.upsert({
            where: {
              ym_clientServiceId: {
                ym,
                clientServiceId: clientService.id,
              },
            },
            create: {
              ym,
              clientServiceId: clientService.id,
              clientId: client.id,
              siteId: site?.id ?? null,
              plannedDay,
              plannedDate,
              status: normalizeUpper(r.Stato) || "DA_FARE",
              notes: normalizeText(r.Note) || null,
            },
            update: {
              clientId: client.id,
              siteId: site?.id ?? null,
              plannedDay,
              plannedDate,
              status: normalizeUpper(r.Stato) || "DA_FARE",
              notes: normalizeText(r.Note) || null,
            },
          });

          report.map++;
        } catch (e: any) {
          report.errori.push(`${rowLabel}: ${e?.message ?? "errore MAP"}`);
        }
      }
    }

    return {
      ok: true,
      message:
        `Import completato. ` +
        `Clienti: ${report.clienti}, ` +
        `Sedi: ${report.sedi}, ` +
        `Contatti: ${report.contatti}, ` +
        `Persone: ${report.persone}, ` +
        `Servizi: ${report.servizi}, ` +
        `Formazione: ${report.formazione}, ` +
        `Pratiche: ${report.pratiche}, ` +
        `SAL: ${report.sal}, ` +
        `VSE: ${report.vse}, ` +
        `MAP: ${report.map}`,
      warning: report.warning,
      errors: report.errori,
    };
  }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Import / Export</h1>

        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href="/dashboard">
            Dashboard
          </Link>
          <Link className="btn" href="/people">
            Persone
          </Link>
          <Link className="btn" href="/training">
            Formazione
          </Link>
        </div>
      </div>

      <ExportButtons />

      <div className="card" style={{ marginTop: 12 }}>
        <h2>Import Excel Unico (.xlsx)</h2>

        <div className="muted" style={{ marginTop: 6 }}>
          Fogli supportati: <b>CLIENTI</b>, <b>SEDI</b>, <b>CONTATTI</b>, <b>PERSONE</b>,{" "}
          <b>SERVIZI</b>, <b>FORMAZIONE</b>, <b>PRATICHE</b>, <b>PRATICHE_SAL</b>, <b>VSE</b>,{" "}
          <b>MAP</b>.
        </div>

        <div className="muted" style={{ marginTop: 6 }}>
          Se un foglio manca o resta vuoto, viene saltato. Le righe con errore non bloccano tutto
          l’import.
        </div>

        <form action={importExcelAction} className="card" style={{ marginTop: 12 }}>
          <div>
            <label>File Excel unico</label>
            <input className="input" type="file" name="file" accept=".xlsx" required />
          </div>

          <div className="row" style={{ marginTop: 14, gap: 8 }}>
            <button className="btn primary" type="submit">
              IMPORTA EXCEL COMPLETO
            </button>

            <Link className="btn" href="/import-export">
              Reset
            </Link>
          </div>
        </form>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h2>Import Persone (CSV)</h2>

        <form action={importPeopleAction} className="card" style={{ marginTop: 12 }}>
          <div>
            <label>File CSV</label>
            <input className="input" type="file" name="file" accept=".csv,text/csv" required />
          </div>

          <div className="row" style={{ marginTop: 14, gap: 8 }}>
            <button className="btn primary" type="submit">
              IMPORTA
            </button>
          </div>
        </form>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h2>Import Formazione (CSV)</h2>
      </div>

      <ImportTrainingCard title="BLSD" courseName="BLSD" />
      <ImportTrainingCard title="Formazione Generale" courseName="FORMAZIONE GENERALE" />
      <ImportTrainingCard title="Preposti" courseName="PREPOSTI" />
      <ImportTrainingCard title="Antincendio Basso" courseName="ANTINCENDIO BASSO" />
      <ImportTrainingCard title="Antincendio Medio" courseName="ANTINCENDIO MEDIO" />
      <ImportTrainingCard title="Antincendio Alto" courseName="ANTINCENDIO ALTO" />
      <ImportTrainingCard title="Primo Soccorso Gruppo A" courseName="PRIMO SOCCORSO GRUPPO A" />
      <ImportTrainingCard title="Primo Soccorso Gruppo B/C" courseName="PRIMO SOCCORSO GRUPPO BC" />
      <ImportTrainingCard title="RLS (meno di 50 dip.)" courseName="RLS MENO DI 50 DIP" />
      <ImportTrainingCard title="RLS (più di 50 dip.)" courseName="RLS PIU DI 50 DIP" />
      <ImportTrainingCard title="RSPP Datore di Lavoro" courseName="RSPP DATORE DI LAVORO" />
      <ImportTrainingCard title="SPEC Basso" courseName="SPEC BASSO" />
      <ImportTrainingCard title="SPEC Medio" courseName="SPEC MEDIO" />
      <ImportTrainingCard title="SPEC Alto" courseName="SPEC ALTO" />
    </div>
  );
}