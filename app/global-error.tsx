"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="it">
      <body>
        <div className="card" style={{ maxWidth: 900, margin: "40px auto" }}>
          <h1>Errore</h1>
          <div className="muted" style={{ marginTop: 8 }}>
            {error?.message ?? "Errore inatteso"}
          </div>

          <div className="row" style={{ marginTop: 14 }}>
            <button className="btn primary" onClick={() => reset()}>
              Riprova
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}