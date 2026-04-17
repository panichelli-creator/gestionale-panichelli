import Link from "next/link";
import { redirect } from "next/navigation";
import { backupNow, listBackups } from "@/app/actions/backup";
import RestoreBackupButton from "./RestoreBackupButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

type SP = {
  ok?: string;
  msg?: string;
};

function formatSize(bytes: number) {
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}

function isVercelRuntime() {
  return (
    String(process.env.VERCEL ?? "").trim() === "1" ||
    String(process.env.VERCEL_ENV ?? "").trim() !== ""
  );
}

export default async function BackupPage({
  searchParams,
}: {
  searchParams?: SP | Promise<SP>;
}) {
  const resolvedSearchParams =
    searchParams && typeof (searchParams as Promise<SP>).then === "function"
      ? await (searchParams as Promise<SP>)
      : ((searchParams as SP | undefined) ?? {});

  const backups = await listBackups();
  const isVercel = isVercelRuntime();

  async function createBackupAction() {
    "use server";

    const result = await backupNow();
    const p = new URLSearchParams();
    p.set("ok", result.ok ? "1" : "0");
    p.set("msg", result.message);
    redirect(`/backup?${p.toString()}`);
  }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Backup</h1>

        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href="/dashboard">
            Dashboard
          </Link>
          <Link className="btn" href="/import-export">
            Import/Export
          </Link>
        </div>
      </div>

      {resolvedSearchParams.msg ? (
        <div
          className="card"
          style={{
            marginTop: 12,
            border:
              String(resolvedSearchParams.ok) === "1"
                ? "1px solid rgba(34,197,94,0.45)"
                : "1px solid #ff6b6b",
          }}
        >
          <b
            style={{
              color:
                String(resolvedSearchParams.ok) === "1"
                  ? "rgba(34,197,94,0.95)"
                  : "#ff6b6b",
            }}
          >
            {String(resolvedSearchParams.ok) === "1" ? "OK:" : "Errore:"}
          </b>{" "}
          {decodeURIComponent(String(resolvedSearchParams.msg))}
        </div>
      ) : null}

      <div className="card" style={{ marginTop: 12 }}>
        <h2>Backup adesso</h2>

        <div className="muted" style={{ marginTop: 6 }}>
          {isVercel ? (
            <>
              Da qui invii una <b>richiesta</b>. Il backup reale viene eseguito dal PC locale e poi
              salvato su <b>Dropbox</b>.
            </>
          ) : (
            <>
              Crea subito una copia del DB e la salva in <b>Dropbox</b>.
            </>
          )}
        </div>

        <div className="muted" style={{ marginTop: 6 }}>
          Backup automatico giornaliero previsto alle <b>13:00</b>.
        </div>

        <form action={createBackupAction} style={{ marginTop: 12 }}>
          <button className="btn primary" type="submit">
            Backup adesso
          </button>
        </form>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h2>Ultimi backup</h2>

        {backups.length === 0 ? (
          <div className="muted" style={{ marginTop: 10 }}>
            Nessun backup trovato.
          </div>
        ) : (
          <div style={{ marginTop: 12 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>File</th>
                  <th>Data</th>
                  <th>Dimensione</th>
                  <th style={{ width: 180 }}>Azioni</th>
                </tr>
              </thead>

              <tbody>
                {backups.slice(0, 14).map((b) => (
                  <tr key={b.name}>
                    <td>
                      <code>{b.name}</code>
                    </td>
                    <td>{new Date(b.mtimeMs).toLocaleString("it-IT")}</td>
                    <td>{formatSize(b.size)}</td>
                    <td>
                      <RestoreBackupButton filename={b.name} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {backups.length > 14 ? (
              <div className="muted" style={{ marginTop: 10 }}>
                Visualizzati i primi 14 backup.
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}