import Link from "next/link";
import { createOrUpdateUser, listUsers } from "@/app/actions/users";
import DeleteUserButton from "./DeleteUserButton";
import { IconPlus, IconUsers } from "@/app/ui/icons";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function roleLabel(role: string) {
  if (role === "admin") return "Socio (admin)";
  if (role === "ingegnere_clinico") return "Ingegnere Clinico";
  return "Collaboratore (staff)";
}

function roleDotStyle(role: string) {
  if (role === "admin") {
    return {
      background: "currentColor",
      border: "1px solid currentColor",
      opacity: 0.9,
    };
  }

  if (role === "ingegnere_clinico") {
    return {
      background: "transparent",
      border: "2px solid currentColor",
      opacity: 0.9,
    };
  }

  return {
    background: "transparent",
    border: "1px solid currentColor",
    opacity: 0.35,
  };
}

export default async function UsersPage() {
  const users = await listUsers();

  return (
    <div className="card">
      <div
        className="row"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div className="row" style={{ alignItems: "center", gap: 10 }}>
          <span className="muted" style={{ display: "inline-flex", fontSize: 20 }}>
            <IconUsers />
          </span>
          <div>
            <h1 style={{ margin: 0 }}>Utenti</h1>
            <div className="muted" style={{ marginTop: 4 }}>
              Crea, aggiorna e gestisci gli accessi al gestionale.
            </div>
          </div>
        </div>

        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href="/dashboard">
            Dashboard
          </Link>
          <Link className="btn" href="/clients">
            Clienti
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div
          className="row"
          style={{ justifyContent: "space-between", alignItems: "center", gap: 12 }}
        >
          <div>
            <h2 style={{ margin: 0 }}>Crea / aggiorna utente</h2>
            <div className="muted" style={{ marginTop: 6 }}>
              Se lo username esiste già, aggiorna password, ruolo e nome.
            </div>
          </div>

          <div className="row" style={{ gap: 8 }}>
            <span className="muted" title="Nuovo utente" style={{ display: "inline-flex" }}>
              <IconPlus />
            </span>
          </div>
        </div>

        <form
          action={createOrUpdateUser}
          className="card"
          style={{ marginTop: 12 }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div style={{ display: "grid", gap: 8 }}>
              <label>Username</label>
              <input className="input" name="username" placeholder="es: collab1" required />
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <label>Password</label>
              <input className="input" name="password" type="password" required />
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <label>Ruolo</label>
              <select name="role" className="input" defaultValue="staff">
                <option value="staff">Collaboratore (staff)</option>
                <option value="ingegnere_clinico">Ingegnere Clinico</option>
                <option value="admin">Socio (admin)</option>
              </select>
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <label>Nome (opzionale)</label>
              <input className="input" name="name" placeholder="es: Luca" />
            </div>
          </div>

          <div className="muted" style={{ marginTop: 12 }}>
            L’utente <b>Ingegnere Clinico</b> potrà accedere solo alla sezione di Ingegneria Clinica.
          </div>

          <div className="row" style={{ marginTop: 14, gap: 8, flexWrap: "wrap" }}>
            <button className="btn primary" type="submit">
              Salva utente
            </button>
            <Link className="btn" href="/users">
              Aggiorna lista
            </Link>
          </div>
        </form>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div
          className="row"
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <h2 style={{ margin: 0 }}>Lista utenti</h2>
          <div className="muted">
            Totale: <b>{users.length}</b>
          </div>
        </div>

        <table className="table" style={{ marginTop: 10 }}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Nome</th>
              <th>Ruolo</th>
              <th>Creato</th>
              <th style={{ width: 140 }}>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <code>{u.email}</code>
                </td>
                <td>{u.name ?? "-"}</td>
                <td>
                  <span
                    className="muted"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        ...roleDotStyle(u.role),
                      }}
                    />
                    {roleLabel(u.role)}
                  </span>
                </td>
                <td>{new Date(u.createdAt).toLocaleString("it-IT")}</td>
                <td>
                  <DeleteUserButton id={u.id} username={u.email} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="muted" style={{ marginTop: 8 }}>
          Nota: non puoi eliminare l’ultimo utente admin.
        </div>
      </div>
    </div>
  );
}