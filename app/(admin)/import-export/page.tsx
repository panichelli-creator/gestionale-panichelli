import Link from "next/link";
import ExportButtons from "./ExportButtons";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function ImportExportPage() {
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
          Usa il template Excel unico e poi carica il file compilato.
        </div>

        <form className="card" style={{ marginTop: 12 }}>
          <div>
            <label>File Excel unico</label>
            <input className="input" type="file" name="file" accept=".xlsx" />
          </div>

          <div className="row" style={{ marginTop: 14, gap: 8 }}>
            <button className="btn primary" type="button">
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