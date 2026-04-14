export const dynamic = "force-dynamic";
export const revalidate = 0;

function mapRole(role: string): "admin" | "staff" | "ingegnere_clinico" {
  if (role === "staff") return "staff";
  if (role === "ingegnere_clinico") return "ingegnere_clinico";
  return "admin";
}

export default function LoginPage() {
  async function loginAction(formData: FormData) {
    "use server";

    const { prisma } = await import("@/lib/prisma");
    const { setSessionCookie } = await import("@/lib/session");
    const { verifyPassword } = await import("@/lib/auth");
    const { redirect } = await import("next/navigation");

    const username = String(formData.get("username") ?? "").toLowerCase().trim();
    const password = String(formData.get("password") ?? "");

    if (!username || !password) return;

    const user = await prisma.user.findUnique({
      where: { email: username },
    });

    if (!user) return;

    let ok = false;

    try {
      ok = verifyPassword(password, user.password);
    } catch {
      ok = password === user.password;
    }

    if (!ok) return;

    const role = mapRole(user.role);

    setSessionCookie(user.id, role);

    if (role === "ingegnere_clinico") redirect("/ingegneria-clinica");
    if (role === "staff") redirect("/clients");

    redirect("/dashboard");
  }

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