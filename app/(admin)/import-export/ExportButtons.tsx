"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function ExportButtons() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <h2>Export</h2>

      <div className="muted" style={{ marginTop: 6 }}>
        CSV rapidi + file Excel unico per template/import completo.
      </div>

      <div className="row" style={{ marginTop: 12, gap: 8, flexWrap: "wrap" }}>
        <a className="btn" href="/import-export/export/people">
          Scarica Persone CSV
        </a>

        <a className="btn" href="/import-export/export/clients">
          Scarica Clienti CSV
        </a>

    <a className="btn primary" href="/import-export/template-xlsx">
  Scarica Template Excel
</a>

        <a className="btn" href="/api/import-export/export/full-xlsx">
          Esporta Excel Completo
        </a>

        <button
          className="btn"
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => router.refresh())}
        >
          {pending ? "Aggiorno..." : "Aggiorna"}
        </button>
      </div>
    </div>
  );
}