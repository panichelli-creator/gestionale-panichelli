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

function splitFullName(raw: string) {
  const full = String(raw ?? "").trim().replace(/\s+/g, " ");
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

      if (!file.name?.toLowerCase().endsWith(".xlsx")) {
        redirect("/import-export?err=" + encodeURIComponent("Seleziona un file .xlsx"));
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const XLSX = await import("xlsx");
      const workbook = XLSX.read(buffer, { type: "buffer" });

      const { prisma } = await import("@/lib/prisma");

      let clienti = 0;
      let sedi = 0;
      let persone = 0;
      const errori: string[] = [];

      // ===== CLIENTI =====
      if (workbook.Sheets["CLIENTI"]) {
        const rows = XLSX.utils.sheet_to_json<any>(workbook.Sheets["CLIENTI"]);

        for (const r of rows) {
          try {
            const name = String(r.Nome ?? "").trim();
            if (!name) continue;

            await prisma.client.create({
              data: {
                name,
                email: r.Email ? String(r.Email) : null,
                phone: r.Telefono ? String(r.Telefono) : null,
                vatNumber: r.PIVA ? String(r.PIVA) : null,
                address: r.Indirizzo ? String(r.Indirizzo) : null,
                notes: r.Note ? String(r.Note) : null,
              },
            });

            clienti++;
          } catch (e: any) {
            errori.push(`CLIENTE ${String(r.Nome ?? "")}: ${e?.message ?? "Errore"}`);
          }
        }
      }

      // ===== SEDI =====
      if (workbook.Sheets["SEDI"]) {
        const rows = XLSX.utils.sheet_to_json<any>(workbook.Sheets["SEDI"]);

        for (const r of rows) {
          try {
            const clientName = String(r.Cliente ?? "").trim();
            if (!clientName) continue;

            const client = await prisma.client.findFirst({
              where: { name: clientName },
            });

            if (!client) {
              errori.push(`Cliente non trovato: ${clientName}`);
              continue;
            }

            await prisma.clientSite.create({
              data: {
                clientId: client.id,
                name: String(r.NomeSede ?? "").trim() || "Sede",
                address: r.Indirizzo ? String(r.Indirizzo) : null,
                city: r.Città ? String(r.Città) : null,
                province: r.Provincia ? String(r.Provincia) : null,
                cap: r.CAP ? String(r.CAP) : null,
                notes: r.Note ? String(r.Note) : null,
              },
            });

            sedi++;
          } catch (e: any) {
            errori.push(`SEDE ${String(r.NomeSede ?? "")}: ${e?.message ?? "Errore"}`);
          }
        }
      }

      // ===== PERSONE =====
      if (workbook.Sheets["PERSONE"]) {
        const rows = XLSX.utils.sheet_to_json<any>(workbook.Sheets["PERSONE"]);

        for (const r of rows) {
          try {
            const firstNameRaw = String(r.Nome ?? r.FirstName ?? "").trim();
            const lastNameRaw = String(r.Cognome ?? r.LastName ?? "").trim();
            const fullNameRaw = String(r.Nominativo ?? r["Nome Completo"] ?? "").trim();

            let firstName = firstNameRaw;
            let lastName = lastNameRaw;

            if (!firstName || !lastName) {
              const split = splitFullName(fullNameRaw || firstNameRaw || lastNameRaw);
              if (!firstName) firstName = split.firstName;
              if (!lastName) lastName = split.lastName;
            }

            if (!firstName || !lastName) {
              errori.push(`PERSONA senza nome/cognome validi: ${JSON.stringify(r)}`);
              continue;
            }

            const clientName = String(r.Cliente ?? "").trim();
            let clientId: string | null = null;

            if (clientName) {
              const client = await prisma.client.findFirst({
                where: { name: clientName },
              });

              if (client) {
                clientId = client.id;
              } else {
                errori.push(`PERSONA ${firstName} ${lastName}: cliente non trovato (${clientName})`);
              }
            }

            await prisma.person.create({
              data: {
                firstName,
                lastName,
                email: r.Email ? String(r.Email) : null,
                phone: r.Telefono ? String(r.Telefono) : null,
                role: r.Ruolo ? String(r.Ruolo) : null,
                fiscalCode: r.CodiceFiscale ? String(r.CodiceFiscale) : null,
                clientId,
              },
            });

            persone++;
          } catch (e: any) {
            errori.push(
              `PERSONA ${String(r.Nominativo ?? r.Nome ?? "")}: ${e?.message ?? "Errore"}`
            );
          }
        }
      }

      revalidatePath("/import-export");
      revalidatePath("/people");
      revalidatePath("/clients");

      const msgBase = `Import completato: ${clienti} clienti, ${sedi} sedi, ${persone} persone`;
      const msg =
        errori.length > 0
          ? `${msgBase}. Errori: ${errori.slice(0, 10).join(" | ")}`
          : msgBase;

      redirect("/import-export?ok=" + encodeURIComponent(msg));
    } catch (e: any) {
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
        <h2>Import Excel Unico (.xlsx)</h2>

        <div className="muted" style={{ marginTop: 6 }}>
          Usa il template Excel unico e poi carica il file compilato.
          <br />
          Fogli supportati: CLIENTI, SEDI, PERSONE. Se mancano, non dà errore.
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
            <label htmlFor="file">File Excel unico</label>
            <input
              id="file"
              className="input"
              type="file"
              name="file"
              accept=".xlsx"
              required
            />
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
    </div>
  );
}