"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function ExportButtons() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <h2>Export</h2>

      <div className="row" style={{ marginTop: 12, gap: 8, flexWrap: "wrap" }}>
        <a className="btn" href="/import-export/export/people">
          Scarica Persone CSV
        </a>

        <a className="btn" href="/import-export/export/clients">
          Scarica Clienti CSV
        </a>

        <a className="btn primary" href="/api/import-export/export/template-xlsx">
          Scarica Template Excel
        </a>

        <button className="btn" type="button" disabled>
          Esporta Excel Completo (da fare)
        </button>

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