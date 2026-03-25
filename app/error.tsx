"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="card">
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
  );
}