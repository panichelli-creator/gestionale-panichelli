import Link from "next/link";

export default function Home() {
  return (
    <div className="card">
      <h1>Gestionale Panichelli HSC (MVP)</h1>
      <p className="muted">
        Questa è la base del gestionale: anagrafica clienti, mantenimenti, formazione, scadenze e previsionale.
      </p>
      <div className="row" style={{ marginTop: 14 }}>
        <Link className="btn primary" href="/clients">Vai a Clienti</Link>
        <Link className="btn" href="/people">Vai a Persone</Link>
        <Link className="btn" href="/training">Vai a Formazione</Link>
        <Link className="btn" href="/forecast">Vai a Previsionale</Link>
      </div>
      <p className="muted" style={{ marginTop: 16 }}>
        Nota: per attivare il login obbligatorio su tutte le pagine, vedi TODO in README.
      </p>
    </div>
  );
}
