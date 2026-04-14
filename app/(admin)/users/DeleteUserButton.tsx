"use client";

export default function DeleteUserButton({
  id,
  username,
  action,
}: {
  id: string;
  username: string;
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <form
      action={action}
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