import Link from "next/link";
import { backupNow, listBackups } from "@/app/actions/backup";
import RestoreBackupButton from "./RestoreBackupButton";

function formatSize(bytes: number) {
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}

export default async function BackupPage() {
  const backups = await listBackups();

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Backup</h1>
        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href="/dashboard">Dashboard</Link>
          <Link className="btn" href="/import-export">Import/Export</Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h2>Backup adesso</h2>
        <div className="muted" style={{ marginTop: 6 }}>
          Crea una copia del DB in <b>/backups</b>. Manteniamo automaticamente lo storico degli ultimi <b>7 giorni</b>.
        </div>

        <form action={backupNow} style={{ marginTop: 12 }}>
          <button className="btn primary" type="submit">Backup adesso</button>
        </form>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h2>Ultimi backup</h2>

        {backups.length === 0 ? (
          <div className="muted" style={{ marginTop: 10 }}>Nessun backup trovato.</div>
        ) : (
          <div style={{ marginTop: 12 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>File</th>
                  <th>Data</th>
                  <th>Dimensione</th>
                  <th style={{ width: 140 }}>Azione</th>
                </tr>
              </thead>
              <tbody>
                {backups.slice(0, 7).map((b) => (
                  <tr key={b.name}>
                    <td><code>{b.name}</code></td>
                    <td>{new Date(b.mtimeMs).toLocaleString("it-IT")}</td>
                    <td>{formatSize(b.size)}</td>
                    <td>
                      <RestoreBackupButton filename={b.name} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {backups.length > 7 && (
              <div className="muted" style={{ marginTop: 10 }}>
                Visualizzati i primi 7 (gli altri restano in cartella <b>/backups</b>).
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}