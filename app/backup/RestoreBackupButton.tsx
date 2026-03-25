"use client";

import { restoreBackup } from "@/app/actions/backup";

export default function RestoreBackupButton({ filename }: { filename: string }) {
  return (
    <form
      action={restoreBackup}
      style={{ margin: 0 }}
      onSubmit={(e) => {
        const ok = confirm(
          `Ripristinare questo backup?\n\n${filename}\n\nTutti i dati torneranno a quella data.`
        );
        if (!ok) e.preventDefault();
      }}
    >
      <input type="hidden" name="filename" value={filename} />
      <button className="btn" type="submit">
        Ripristina
      </button>
    </form>
  );
}