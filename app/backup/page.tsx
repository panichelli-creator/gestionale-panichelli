import Link from "next/link";
import { backupNow, listBackups } from "@/app/actions/backup";
import RestoreBackupButton from "./RestoreBackupButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  const sorted = backups.slice().sort((a, b) => b.mtimeMs - a.mtimeMs);

  const latest = sorted[0];

  return (
    <div className="card">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <h1>Backup Database</h1>

        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href="/dashboard">
            Dashboard
          </Link>

          <Link className="btn" href="/import-export">
            Import/Export
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h2>Crea backup</h2>

        <div className="muted" style={{ marginTop: 6 }}>
          Copia del database salvata in <b>/backups</b>
        </div>

        {latest && (
          <div className="muted" style={{ marginTop: 8 }}>
            Ultimo backup: <b>{new Date(latest.mtimeMs).toLocaleString("it-IT")}</b>
          </div>
        )}

        <form action={backupNow} style={{ marginTop: 12 }}>
          <button className="btn primary" type="submit">
            Crea backup adesso
          </button>
        </form>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h2>Storico backup</h2>

        {sorted.length === 0 ? (
          <div className="muted" style={{ marginTop: 10 }}>
            Nessun backup trovato
          </div>
        ) : (
          <div style={{ marginTop: 12 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>File</th>
                  <th>Data</th>
                  <th>Dimensione</th>
                  <th style={{ width: 260 }}>Azioni</th>
                </tr>
              </thead>

              <tbody>
                {sorted.slice(0, 14).map((b) => (
                  <tr key={b.name}>
                    <td>
                      <code>{b.name}</code>
                    </td>

                    <td>{new Date(b.mtimeMs).toLocaleString("it-IT")}</td>

                    <td>{formatSize(b.size)}</td>

                    <td>
                      <div className="row" style={{ gap: 8 }}>
                        <a
                          className="btn"
                          href={`/api/backup/download?file=${encodeURIComponent(b.name)}`}
                        >
                          Download
                        </a>

                        <RestoreBackupButton filename={b.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="muted" style={{ marginTop: 8 }}>
              Storico ultimi <b>14 backup</b>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}