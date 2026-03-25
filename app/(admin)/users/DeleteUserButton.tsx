"use client";

import { deleteUser } from "@/app/actions/users";

export default function DeleteUserButton({ id, username }: { id: string; username: string }) {
  return (
    <form
      action={deleteUser}
      style={{ margin: 0 }}
      onSubmit={(e) => {
        const ok = confirm(`Eliminare l’utente "${username}"?`);
        if (!ok) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="btn" type="submit">
        Elimina
      </button>
    </form>
  );
}