import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import ExportButtons from "./ExportButtons";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

type SP = {
  ok?: string;
  err?: string;
};

const OLD_COURSE_SHEETS = new Set([
  "ANTINCENDIO ALTO",
  "ANTINCENDIO BASSO",
  "ANTINCENDIO MEDIO",
  "BLSD",
  "GENERALE",
  "PREPOSTI",
  "PRIMO SOCCORSO GRUPPO A",
  "PRIMO SOCCORSO GRUPPO BC",
  "RLS MENO DI 50 DIP",
  "RLS PIU' DI 50 DIP",
  "RSPP DATORE DI LAVORO",
  "SPEC. ALTO",
  "SPEC. BASSO",
  "SPEC. MEDIO",
]);

function norm(v: unknown) {
  return String(v ?? "").trim();
}

function upper(v: unknown) {
  return norm(v).toUpperCase();
}

function emptyToNull(v: unknown) {
  const s = norm(v);
  if (!s) return null;
  if (["NULL", "N/D", "ND", "-", "--"].includes(s.toUpperCase())) return null;
  return s;
}

function splitFullName(raw: string) {
  const full = norm(raw).replace(/\s+/g, " ");
  if (!full) {
    return { firstName: "", lastName: "" };
  }

  const parts = full.split(" ").filter(Boolean);

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: parts[0] };
  }

  const firstName = parts.slice(0, -1).join(" ").trim();
  const lastName = parts.slice(-1).join(" ").trim();

  return {
    firstName: firstName || lastName,
    lastName: lastName || firstName,
  };
}

function parseDateLoose(v: unknown): Date | null {
  const s = norm(v);
  if (!s) return null;

  if (
    s === "00-00-00" ||
    s === "0000-00-00" ||
    s === "00/00/00" ||
    s === "00/00/0000"
  ) {
    return null;
  }

  const ddmmyyyy = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (ddmmyyyy) {
    const [, dd, mm, yyyy] = ddmmyyyy;
    const d = new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const ddmmyy = s.match(/^(\d{2})\/(\d{2})\/(\d{2})$/);
  if (ddmmyy) {
    const [, dd, mm, yy] = ddmmyy;
    const yyyy = Number(yy) >= 70 ? `19${yy}` : `20${yy}`;
    const d = new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const ymd = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (ymd) {
    const d = new Date(`${s}T00:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const direct = new Date(s);
  return Number.isNaN(direct.getTime()) ? null : direct;
}

function cleanFiscalCode(v: unknown) {
  const s = norm(v).replace(/\s+/g, "").toUpperCase();
  return s || null;
}

function normalizeSheetName(name: string) {
  return norm(name).replace(/\.csv$/i, "").trim();
}

export default async function ImportExportPage({
  searchParams,
}: {
  searchParams?: Promise<SP>;
}) {
  const sp = (await searchParams) ?? {};
  const ok = sp.ok ? decodeURIComponent(sp.ok) : "";
  const err = sp.err ? decodeURIComponent(sp.err) : "";

  async function importExcelAction(formData: FormData) {
    "use server";

    try {
      const file = formData.get("file");

      if (!(file instanceof File)) {
        redirect("/import-export?err=" + encodeURIComponent("File mancante"));
      }

      const fileName = norm(file.name);
      const isXlsx = /\.xlsx$/i.test(fileName);
      const isCsv = /\.csv$/i.test(fileName);

      if (!isXlsx && !isCsv) {
        redirect(
          "/import-export?err=" +
            encodeURIComponent("Seleziona un file .xlsx oppure .csv")
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const XLSX = await import("xlsx");

      let workbook: any;

      if (isXlsx) {
        workbook = XLSX.read(buffer, { type: "buffer" });
      } else {
        const csvText = buffer.toString("utf8");
        workbook = XLSX.read(csvText, { type: "string" });

        const originalSheetName =
          Array.isArray(workbook.SheetNames) && workbook.SheetNames.length > 0
            ? workbook.SheetNames[0]
            : "Sheet1";

        const normalizedName = normalizeSheetName(fileName) || "CSV_IMPORT";

        if (
          originalSheetName &&
          originalSheetName !== normalizedName &&
          workbook.Sheets[originalSheetName]
        ) {
          workbook.Sheets[normalizedName] = workbook.Sheets[originalSheetName];
          delete workbook.Sheets[originalSheetName];
          workbook.SheetNames = [normalizedName];
        } else if (!workbook.SheetNames?.length) {
          workbook.SheetNames = [normalizedName];
        }
      }

      const { prisma } = await import("@/lib/prisma");

      let clienti = 0;
      let sedi = 0;
      let personeCreate = 0;
      let personeUpdate = 0;
      let corsi = 0;
      let formazioneCreate = 0;
      let formazioneUpdate = 0;

      const errori: string[] = [];

      async function getOrCreateClientByName(nameRaw: unknown) {
        const name = norm(nameRaw);
        if (!name) return null;

        const existing = await prisma.client.findUnique({
          where: { name },
        });

        if (existing) return existing;

        const created = await prisma.client.create({
          data: { name },
        });

        clienti++;
        return created;
      }

      async function getOrCreateCourseByName(nameRaw: unknown) {
        const name = norm(nameRaw);
        if (!name) return null;

        const existing = await prisma.courseCatalog.findUnique({
          where: { name },
        });

        if (existing) return existing;

        const created = await prisma.courseCatalog.create({
          data: { name },
        });

        corsi++;
        return created;
      }

      async function findExistingPerson(params: {
        fiscalCode?: string | null;
        firstName: string;
        lastName: string;
        clientId?: string | null;
      }) {
        if (params.fiscalCode) {
          const byCf = await prisma.person.findUnique({
            where: { fiscalCode: params.fiscalCode },
          });
          if (byCf) return byCf;
        }

        const byName = await prisma.person.findFirst({
          where: {
            firstName: params.firstName,
            lastName: params.lastName,
            ...(params.clientId ? { clientId: params.clientId } : {}),
          },
          orderBy: { createdAt: "asc" },
        });

        if (byName) return byName;

        if (!params.clientId) {
          return prisma.person.findFirst({
            where: {
              firstName: params.firstName,
              lastName: params.lastName,
            },
            orderBy: { createdAt: "asc" },
          });
        }

        return null;
      }

      async function upsertPersonFromRow(
        r: any,
        opts?: {
          clientFieldNames?: string[];
          firstNameFieldNames?: string[];
          lastNameFieldNames?: string[];
          roleFieldNames?: string[];
          emailFieldNames?: string[];
          phoneFieldNames?: string[];
          fiscalCodeFieldNames?: string[];
          hireDateFieldNames?: string[];
          medicalFieldNames?: string[];
        }
      ) {
        const clientFieldNames = opts?.clientFieldNames ?? [
          "Cliente",
          "ClienteNome",
          "ClientePrincipaleNome",
          "Azienda",
        ];
        const firstNameFieldNames = opts?.firstNameFieldNames ?? ["Nome"];
        const lastNameFieldNames = opts?.lastNameFieldNames ?? ["Cognome"];
        const roleFieldNames = opts?.roleFieldNames ?? ["Ruolo", "Mansione", "mansione"];
        const emailFieldNames = opts?.emailFieldNames ?? ["Email", "email"];
        const phoneFieldNames = opts?.phoneFieldNames ?? ["Telefono", "telefono"];
        const fiscalCodeFieldNames = opts?.fiscalCodeFieldNames ?? [
          "CodiceFiscale",
          "codice fiscale",
        ];
        const hireDateFieldNames = opts?.hireDateFieldNames ?? [
          "DataAssunzione",
          "data assunzione",
        ];
        const medicalFieldNames = opts?.medicalFieldNames ?? [
          "VisitaMedica",
          "giudizio di idoneita'",
        ];

        const pick = (names: string[]) => {
          for (const key of names) {
            if (r[key] != null && norm(r[key])) return r[key];
          }
          return null;
        };

        const firstNameRaw = norm(pick(firstNameFieldNames));
        const lastNameRaw = norm(pick(lastNameFieldNames));
        const fullNameRaw = norm(r.Nominativo ?? r["Nome Completo"] ?? "");

        let firstName = firstNameRaw;
        let lastName = lastNameRaw;

        if (!firstName || !lastName) {
          const split = splitFullName(fullNameRaw || `${firstNameRaw} ${lastNameRaw}`.trim());
          if (!firstName) firstName = split.firstName;
          if (!lastName) lastName = split.lastName;
        }

        if (!firstName || !lastName) {
          throw new Error("Nome/Cognome mancanti");
        }

        const clientName = norm(pick(clientFieldNames));
        const client = clientName ? await getOrCreateClientByName(clientName) : null;

        const fiscalCode = cleanFiscalCode(pick(fiscalCodeFieldNames));
        const email = emptyToNull(pick(emailFieldNames));
        const phone = emptyToNull(pick(phoneFieldNames));
        const role = emptyToNull(pick(roleFieldNames));
        const hireDate = parseDateLoose(pick(hireDateFieldNames));

        let medicalCheckDone = false;
        const medicalRaw = pick(medicalFieldNames);
        if (medicalRaw != null) {
          const s = upper(medicalRaw);
          medicalCheckDone =
            !["", "NO", "NESSUNA VISITA", "NON FATTA", "FALSE", "0"].includes(s);
        }

        const existing = await findExistingPerson({
          fiscalCode,
          firstName,
          lastName,
          clientId: client?.id ?? null,
        });

        if (existing) {
          await prisma.person.update({
            where: { id: existing.id },
            data: {
              firstName,
              lastName,
              email: existing.email || email ? email ?? existing.email : null,
              phone: existing.phone || phone ? phone ?? existing.phone : null,
              role: existing.role || role ? role ?? existing.role : null,
              fiscalCode: existing.fiscalCode || fiscalCode ? fiscalCode ?? existing.fiscalCode : null,
              clientId: existing.clientId ?? client?.id ?? null,
              hireDate: existing.hireDate ?? hireDate ?? null,
              medicalCheckDone: existing.medicalCheckDone || medicalCheckDone,
            },
          });

          personeUpdate++;
          return await prisma.person.findUnique({ where: { id: existing.id } });
        }

        const created = await prisma.person.create({
          data: {
            firstName,
            lastName,
            email,
            phone,
            role,
            fiscalCode,
            clientId: client?.id ?? null,
            hireDate,
            medicalCheckDone,
          },
        });

        personeCreate++;
        return created;
      }

      async function upsertTrainingRecord(args: {
        personId: string;
        courseName: string;
        performedAt?: Date | null;
        dueDate?: Date | null;
        status?: string | null;
        notes?: string | null;
      }) {
        const course = await getOrCreateCourseByName(args.courseName);
        if (!course) throw new Error("Corso mancante");

        const existing = await prisma.trainingRecord.findUnique({
          where: {
            personId_courseId: {
              personId: args.personId,
              courseId: course.id,
            },
          },
        });

        if (existing) {
          await prisma.trainingRecord.update({
            where: {
              personId_courseId: {
                personId: args.personId,
                courseId: course.id,
              },
            },
            data: {
              performedAt: args.performedAt ?? existing.performedAt,
              dueDate: args.dueDate ?? existing.dueDate,
              status: args.status || existing.status,
              notes: args.notes || existing.notes,
            },
          });

          formazioneUpdate++;
          return;
        }

        await prisma.trainingRecord.create({
          data: {
            personId: args.personId,
            courseId: course.id,
            performedAt: args.performedAt ?? null,
            dueDate: args.dueDate ?? null,
            status: args.status || "DA_FARE",
            notes: args.notes || null,
          },
        });

        formazioneCreate++;
      }

      if (workbook.Sheets["CLIENTI"]) {
        const rows = XLSX.utils.sheet_to_json<any>(workbook.Sheets["CLIENTI"], { defval: "" });

        for (const r of rows) {
          try {
            const name = norm(r.Nome);
            if (!name) continue;

            const existing = await prisma.client.findUnique({
              where: { name },
            });

            if (existing) {
              await prisma.client.update({
                where: { id: existing.id },
                data: {
                  type: norm(r.Tipo) || existing.type,
                  status: norm(r.Stato) || existing.status,
                  email: existing.email ?? emptyToNull(r.Email),
                  phone: existing.phone ?? emptyToNull(r.Telefono),
                  pec: existing.pec ?? emptyToNull(r.PEC),
                  vatNumber: existing.vatNumber ?? emptyToNull(r.PIVA),
                  uniqueCode: existing.uniqueCode ?? emptyToNull(r.CodiceUnivoco),
                  legalSeat: existing.legalSeat ?? emptyToNull(r.SedeLegale),
                  operativeSeat: existing.operativeSeat ?? emptyToNull(r.SedeOperativa),
                  address: existing.address ?? emptyToNull(r.Indirizzo),
                  occupationalDoctorName:
                    existing.occupationalDoctorName ?? emptyToNull(r.MedicoLavoro),
                  notes: existing.notes ?? emptyToNull(r.Note),
                },
              });
            } else {
              await prisma.client.create({
                data: {
                  name,
                  type: norm(r.Tipo) || "ALTRO",
                  status: norm(r.Stato) || "ATTIVO",
                  email: emptyToNull(r.Email),
                  phone: emptyToNull(r.Telefono),
                  pec: emptyToNull(r.PEC),
                  vatNumber: emptyToNull(r.PIVA),
                  uniqueCode: emptyToNull(r.CodiceUnivoco),
                  legalSeat: emptyToNull(r.SedeLegale),
                  operativeSeat: emptyToNull(r.SedeOperativa),
                  address: emptyToNull(r.Indirizzo),
                  occupationalDoctorName: emptyToNull(r.MedicoLavoro),
                  notes: emptyToNull(r.Note),
                },
              });

              clienti++;
            }
          } catch (e: any) {
            errori.push(`CLIENTE ${norm(r.Nome)}: ${e?.message ?? "Errore"}`);
          }
        }
      }

      if (workbook.Sheets["SEDI"]) {
        const rows = XLSX.utils.sheet_to_json<any>(workbook.Sheets["SEDI"], { defval: "" });

        for (const r of rows) {
          try {
            const clientName =
              norm(r.ClienteNome) ||
              norm(r.Cliente) ||
              norm(r.Azienda);

            if (!clientName) continue;

            const client = await getOrCreateClientByName(clientName);
            if (!client) throw new Error("Cliente non trovato");

            const siteName = norm(r.NomeSede) || "Sede";

            const existing = await prisma.clientSite.findFirst({
              where: {
                clientId: client.id,
                name: siteName,
              },
            });

            if (existing) continue;

            await prisma.clientSite.create({
              data: {
                clientId: client.id,
                name: siteName,
                address: emptyToNull(r.Indirizzo),
                city: emptyToNull(r.Città ?? r.Citta),
                province: emptyToNull(r.Provincia),
                cap: emptyToNull(r.CAP),
                notes: emptyToNull(r.Note),
              },
            });

            sedi++;
          } catch (e: any) {
            errori.push(`SEDE ${norm(r.NomeSede)}: ${e?.message ?? "Errore"}`);
          }
        }
      }

      if (workbook.Sheets["PERSONE"]) {
        const rows = XLSX.utils.sheet_to_json<any>(workbook.Sheets["PERSONE"], { defval: "" });

        for (const r of rows) {
          try {
            await upsertPersonFromRow(r, {
              clientFieldNames: ["ClientePrincipaleNome", "ClienteNome", "Cliente", "Azienda"],
              firstNameFieldNames: ["Nome"],
              lastNameFieldNames: ["Cognome"],
              roleFieldNames: ["Mansione", "Ruolo"],
              emailFieldNames: ["Email"],
              phoneFieldNames: ["Telefono"],
              fiscalCodeFieldNames: ["CodiceFiscale"],
              hireDateFieldNames: ["DataAssunzione"],
              medicalFieldNames: ["VisitaMedica"],
            });
          } catch (e: any) {
            errori.push(`PERSONE ${norm(r.Cognome)} ${norm(r.Nome)}: ${e?.message ?? "Errore"}`);
          }
        }
      }

      if (workbook.Sheets["PERSONALE"]) {
        const rows = XLSX.utils.sheet_to_json<any>(workbook.Sheets["PERSONALE"], { defval: "" });

        for (const r of rows) {
          try {
            await upsertPersonFromRow(r, {
              clientFieldNames: ["Azienda"],
              firstNameFieldNames: ["nome"],
              lastNameFieldNames: ["cognome"],
              roleFieldNames: ["mansione"],
              emailFieldNames: ["email"],
              phoneFieldNames: ["telefono"],
              fiscalCodeFieldNames: ["codice fiscale"],
              hireDateFieldNames: ["data assunzione"],
              medicalFieldNames: ["giudizio di idoneita'"],
            });
          } catch (e: any) {
            errori.push(`PERSONALE ${norm(r.cognome)} ${norm(r.nome)}: ${e?.message ?? "Errore"}`);
          }
        }
      }

      if (workbook.Sheets["FORMAZIONE"]) {
        const rows = XLSX.utils.sheet_to_json<any>(workbook.Sheets["FORMAZIONE"], { defval: "" });

        for (const r of rows) {
          try {
            let person = null as any;

            const fiscalCode = cleanFiscalCode(r.CodiceFiscale);
            if (fiscalCode) {
              person = await prisma.person.findUnique({
                where: { fiscalCode },
              });
            }

            if (!person) {
              const fullName = norm(r.Persona);
              const split = splitFullName(fullName);
              if (split.firstName && split.lastName) {
                person = await prisma.person.findFirst({
                  where: {
                    firstName: split.firstName,
                    lastName: split.lastName,
                  },
                });
              }
            }

            if (!person) {
              throw new Error("Persona non trovata");
            }

            const courseName = norm(r.Corso);
            if (!courseName) throw new Error("Corso mancante");

            await upsertTrainingRecord({
              personId: person.id,
              courseName,
              performedAt: parseDateLoose(r.DataUltima),
              dueDate: parseDateLoose(r.DataScadenza),
              status: emptyToNull(r.Stato),
              notes: emptyToNull(r.Note),
            });
          } catch (e: any) {
            errori.push(
              `FORMAZIONE ${norm(r.Persona)} / ${norm(r.Corso)}: ${e?.message ?? "Errore"}`
            );
          }
        }
      }

      for (const rawSheetName of workbook.SheetNames) {
        const sheetName = normalizeSheetName(rawSheetName);
        if (!OLD_COURSE_SHEETS.has(sheetName.toUpperCase())) continue;

        const rows = XLSX.utils.sheet_to_json<any>(workbook.Sheets[rawSheetName], { defval: "" });

        for (const r of rows) {
          try {
            const person = await upsertPersonFromRow(r, {
              clientFieldNames: ["Azienda"],
              firstNameFieldNames: ["nome"],
              lastNameFieldNames: ["cognome"],
              roleFieldNames: ["mansione"],
              emailFieldNames: ["email"],
              phoneFieldNames: [],
              fiscalCodeFieldNames: ["codice fiscale"],
              hireDateFieldNames: ["data assunzione"],
              medicalFieldNames: [],
            });

            if (!person) throw new Error("Persona non trovata/creata");

            await upsertTrainingRecord({
              personId: person.id,
              courseName: sheetName,
              performedAt: parseDateLoose(r["data consegna"]),
              dueDate: parseDateLoose(r["data scadenza"]),
              status: emptyToNull(r["stato item"]),
              notes: emptyToNull(r.nota),
            });
          } catch (e: any) {
            errori.push(
              `${sheetName} ${norm(r.cognome)} ${norm(r.nome)}: ${e?.message ?? "Errore"}`
            );
          }
        }
      }

      revalidatePath("/import-export");
      revalidatePath("/people");
      revalidatePath("/clients");
      revalidatePath("/training");

      const msgBase =
        `Import completato: ${clienti} clienti nuovi, ${sedi} sedi nuove, ` +
        `${personeCreate} persone create, ${personeUpdate} persone aggiornate, ` +
        `${corsi} corsi nuovi, ${formazioneCreate} record formazione creati, ` +
        `${formazioneUpdate} record formazione aggiornati`;

      const msg =
        errori.length > 0
          ? `${msgBase}. Errori: ${errori.slice(0, 12).join(" | ")}`
          : msgBase;

      redirect("/import-export?ok=" + encodeURIComponent(msg));
    } catch (e: any) {
      if (typeof e?.digest === "string" && e.digest.startsWith("NEXT_REDIRECT")) {
        throw e;
      }

      redirect(
        "/import-export?err=" +
          encodeURIComponent(e?.message ?? "Errore durante import")
      );
    }
  }

  return (
    <div className="card">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
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
        <h2>Import File (.xlsx / .csv)</h2>

        <div className="muted" style={{ marginTop: 6 }}>
          Puoi caricare:
          <br />
          - un file Excel unico `.xlsx` con più fogli
          <br />
          - oppure un singolo file `.csv` del vecchio gestionale
          <br />
          Se carichi un CSV corso, il nome del file deve restare uguale al nome del corso.
        </div>

        {ok ? (
          <div
            className="card"
            style={{
              marginTop: 12,
              border: "1px solid #1f7a1f",
              background: "rgba(20,120,20,0.08)",
            }}
          >
            <strong>OK:</strong> {ok}
          </div>
        ) : null}

        {err ? (
          <div
            className="card"
            style={{
              marginTop: 12,
              border: "1px solid #b42318",
              background: "rgba(180,35,24,0.08)",
            }}
          >
            <strong>Errore:</strong> {err}
          </div>
        ) : null}

        <form action={importExcelAction} className="card" style={{ marginTop: 12 }}>
          <div>
            <label htmlFor="file">File import</label>
            <input
              id="file"
              className="input"
              type="file"
              name="file"
              accept=".xlsx,.csv"
              required
            />
          </div>

          <div className="row" style={{ marginTop: 14, gap: 8 }}>
            <button className="btn primary" type="submit">
              IMPORTA FILE
            </button>

            <Link className="btn" href="/import-export">
              Reset
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}