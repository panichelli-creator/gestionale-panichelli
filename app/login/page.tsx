import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  return (
    <div className="card" style={{ maxWidth: 520, margin: "40px auto" }}>
      <h1>Accesso</h1>
      <div className="muted" style={{ marginBottom: 12 }}>
        Inserisci username e password (rilasciati da Panichelli HSC).
      </div>

      <form action={loginAction} className="card">
        <label>Username</label>
        <input
          className="input"
          type="text"
          name="username"
          autoComplete="username"
          required
        />

        <label>Password</label>
        <input
          className="input"
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />

        <div className="row" style={{ marginTop: 14 }}>
          <button className="btn primary" type="submit">
            Entra
          </button>
        </div>
      </form>
    </div>
  );
}