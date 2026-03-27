import Link from "next/link";
import { importPeopleFromCsv } from "@/app/actions/importExport";
import { importTrainingFromCsv } from "@/app/actions/importTraining";
import ExportButtons from "./ExportButtons";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function ImportTrainingCard({ title, courseName }: { title: string; courseName: string }) {
  return (
    <div className="card" style={{ marginTop: 12 }}>
      <h2>{title}</h2>
      <div className="muted" style={{ marginTop: 6 }}>
        Carica il CSV (delimiter <b>;</b>). Header diversi ok.
      </div>

      <form action={importTrainingFromCsv.bind(null, courseName)} className="card" style={{ marginTop: 12 }}>
        <div>
          <label>File CSV</label>
          <input className="input" type="file" name="file" accept=".csv,text/csv" required />
        </div>

        <div className="row" style={{ marginTop: 14, gap: 8 }}>
          <button className="btn primary" type="submit">IMPORTA</button>
          <Link className="btn" href="/import-export">Reset</Link>
        </div>
      </form>
    </div>
  );
}

export default async function ImportExportPage() {
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

      {/* IMPORT PERSONE */}
      <div className="card" style={{ marginTop: 12 }}>
        <h2>Import Persone (CSV)</h2>
        <div className="muted" style={{ marginTop: 6 }}>
          Carica il file <b>PERSONALE.csv</b> (delimiter <b>;</b>). Header diversi ok.
        </div>

        <form action={importPeopleFromCsv} className="card" style={{ marginTop: 12 }}>
          <div>
            <label>File CSV</label>
            <input className="input" type="file" name="file" accept=".csv,text/csv" required />
          </div>

          <div className="row" style={{ marginTop: 14, gap: 8 }}>
            <button className="btn primary" type="submit">IMPORTA</button>
            <Link className="btn" href="/import-export">Reset</Link>
          </div>
        </form>
      </div>

      {/* IMPORT CORSI */}
      <div className="card" style={{ marginTop: 12 }}>
        <h2>Import Formazione (CSV)</h2>
        <div className="muted" style={{ marginTop: 6 }}>
          Import “generico” per BLSD / Antincendio / Generale / Preposti / Primo Soccorso / RLS / RSPP / SPEC.
        </div>
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

      {/* EXPORT */}
      <ExportButtons />
    </div>
  );
}