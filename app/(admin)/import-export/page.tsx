import Link from "next/link";
import ExportButtons from "./ExportButtons";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
          <button className="btn primary" type="submit">IMPORTA</button>
          <Link className="btn" href="/import-export">Reset</Link>
        </div>
      </form>
    </div>
  );
}

export default async function ImportExportPage() {
  async function importPeopleAction(formData: FormData) {
    "use server";
    const { importPeopleFromCsv } = await import("@/app/actions/importExport");
    return importPeopleFromCsv(formData);
  }

  async function importExcelAction(formData: FormData) {
    "use server";

    const file = formData.get("file") as File;
    if (!file) throw new Error("File mancante");

    const buffer = Buffer.from(await file.arrayBuffer());

    const XLSX = await import("xlsx");
    const workbook = XLSX.read(buffer, { type: "buffer" });

    const { prisma } = await import("@/lib/prisma");

    const result = {
      clienti: 0,
      sedi: 0,
      errori: [] as string[],
    };

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
              email: r.Email || null,
              phone: r.Telefono || null,
              vatNumber: r.PIVA || null,
              address: r.Indirizzo || null,
              notes: r.Note || null,
            },
          });

          result.clienti++;
        } catch (e: any) {
          result.errori.push(`CLIENTE ${r.Nome}: ${e.message}`);
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
            result.errori.push(`Cliente non trovato: ${clientName}`);
            continue;
          }

          await prisma.clientSite.create({
            data: {
              clientId: client.id,
              name: r.NomeSede || "Sede",
              address: r.Indirizzo || null,
              city: r.Città || null,
              province: r.Provincia || null,
              cap: r.CAP || null,
            },
          });

          result.sedi++;
        } catch (e: any) {
          result.errori.push(`SEDE ${r.NomeSede}: ${e.message}`);
        }
      }
    }

    return {
      message: `Import completato: ${result.clienti} clienti, ${result.sedi} sedi`,
      errors: result.errori,
    };
  }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Import / Export</h1>
        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href="/dashboard">Dashboard</Link>
          <Link className="btn" href="/people">Persone</Link>
          <Link className="btn" href="/training">Formazione</Link>
        </div>
      </div>

      <ExportButtons />

      {/* IMPORT EXCEL UNICO */}
      <div className="card" style={{ marginTop: 12 }}>
        <h2>Import Excel Completo (.xlsx)</h2>
        <div className="muted" style={{ marginTop: 6 }}>
          File con fogli: <b>CLIENTI</b>, <b>SEDI</b>
        </div>

        <form action={importExcelAction} className="card" style={{ marginTop: 12 }}>
          <input className="input" type="file" name="file" accept=".xlsx" required />

          <div className="row" style={{ marginTop: 14, gap: 8 }}>
            <button className="btn primary" type="submit">IMPORTA EXCEL</button>
          </div>
        </form>
      </div>

      {/* IMPORT PERSONE */}
      <div className="card" style={{ marginTop: 12 }}>
        <h2>Import Persone (CSV)</h2>

        <form action={importPeopleAction} className="card" style={{ marginTop: 12 }}>
          <input className="input" type="file" name="file" accept=".csv,text/csv" required />

          <div className="row" style={{ marginTop: 14, gap: 8 }}>
            <button className="btn primary" type="submit">IMPORTA</button>
          </div>
        </form>
      </div>

      {/* IMPORT FORMAZIONE */}
      <div className="card" style={{ marginTop: 12 }}>
        <h2>Import Formazione (CSV)</h2>
      </div>

      <ImportTrainingCard title="BLSD" courseName="BLSD" />
      <ImportTrainingCard title="Formazione Generale" courseName="FORMAZIONE GENERALE" />
      <ImportTrainingCard title="Preposti" courseName="PREPOSTI" />
    </div>
  );
}