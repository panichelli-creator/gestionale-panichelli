"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function ExportButtons() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <h2>Export CSV</h2>

      <div className="row" style={{ marginTop: 12, gap: 8 }}>
        <a className="btn" href="/import-export/export/people">
          Scarica Persone
        </a>

        <a className="btn" href="/import-export/export/clients">
          Scarica Clienti
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