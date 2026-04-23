import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SP = {
  err?: string;
};

async function createClient(formData: FormData) {
  "use server";

  const { prisma } = await import("@/lib/prisma");

  const name = String(formData.get("name") || "").trim();
  const type = String(formData.get("type") || "ALTRO");
  const phone = String(formData.get("phone") || "").trim() || null;
  const email = String(formData.get("email") || "").trim() || null;
  const pec = String(formData.get("pec") || "").trim() || null;
  const occupationalDoctorName =
    String(formData.get("occupationalDoctorName") || "").trim() || null;

  const contactName = String(formData.get("contactName") || "").trim();
  const contactPhone = String(formData.get("contactPhone") || "").trim() || null;
  const contactEmail = String(formData.get("contactEmail") || "").trim() || null;
  const contactRole = String(formData.get("contactRole") || "").trim() || "REFERENTE";

  const marketingList = String(formData.get("marketingList") || "").trim() || null;

  if (!name) {
    redirect(`/clients/new?err=${encodeURIComponent("Nome obbligatorio")}`);
  }

  const existing = await prisma.client.findUnique({
    where: { name },
    select: { id: true, name: true },
  });

  if (existing) {
    redirect(
      `/clients/new?err=${encodeURIComponent(`Cliente già esistente: "${existing.name}"`)}`
    );
  }

  try {
    const client = await prisma.client.create({
      data: {
        name,
        type: type as any,
        phone,
        email,
        pec,
        occupationalDoctorName,
        contacts: contactName
          ? {
              create: {
                name: contactName,
                phone: contactPhone,
                email: contactEmail,
                role: contactRole,
                ...(marketingList ? { marketingList } : {}),
              },
            }
          : undefined,
      },
    });

    redirect(`/clients/${client.id}`);
  } catch (e: any) {
    if (e?.code === "P2002") {
      redirect(
        `/clients/new?err=${encodeURIComponent(`Cliente già esistente: "${name}"`)}`
      );
    }

    redirect(
      `/clients/new?err=${encodeURIComponent(e?.message ?? "Errore creazione cliente")}`
    );
  }
}

export default async function NewClientPage({
  searchParams,
}: {
  searchParams?: SP;
}) {
  const err = searchParams?.err ? decodeURIComponent(searchParams.err) : "";

  return (
    <div className="card">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <h1>Nuovo cliente</h1>

        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href="/clients">
            ← Clienti
          </Link>
          <Link className="btn" href="/clients/new">
            Reset
          </Link>
        </div>
      </div>

      {err ? (
        <div
          className="card"
          style={{
            marginTop: 12,
            border: "1px solid #ff6b6b",
          }}
        >
          <b style={{ color: "#ff6b6b" }}>Errore:</b> {err}
        </div>
      ) : null}

      <form action={createClient} className="card" style={{ marginTop: 12 }}>
        <div className="grid2">
          <div>
            <label>Nome azienda / cliente</label>
            <input className="input" name="name" placeholder="Es. Studio Rossi" />
          </div>

          <div>
            <label>Tipologia attività</label>
            <select className="input" name="type" defaultValue="ALTRO">
              <option value="STUDIO_ODONTOIATRICO">Studio odontoiatrico</option>
              <option value="STUDIO_ODONT_447">Studio odont. 447</option>
              <option value="AMBULATORIO_ODONTOIATRICO">Ambulatorio odontoiatrico</option>
              <option value="STUDIO_FISIOTERAPICO">Studio fisioterapico</option>
              <option value="AMBULATORIO_FKT">Ambulatorio FKT</option>
              <option value="STUDIO">Studio</option>
              <option value="AMBULATORIO">Ambulatorio</option>
              <option value="POLIAMBULATORIO">Poliambulatorio</option>
              <option value="ALTRO">Altro</option>
            </select>
          </div>

          <div>
            <label>Telefono</label>
            <input className="input" name="phone" />
          </div>

          <div>
            <label>Email</label>
            <input className="input" name="email" />
          </div>

          <div>
            <label>PEC</label>
            <input className="input" name="pec" />
          </div>

          <div>
            <label>Medico del lavoro</label>
            <input
              className="input"
              name="occupationalDoctorName"
              placeholder="Es. Dott. Mario Bianchi"
            />
          </div>
        </div>

        <div className="card" style={{ marginTop: 12 }}>
          <h2 style={{ marginBottom: 10 }}>Referente / Contatto</h2>

          <div className="grid2">
            <div>
              <label>Nome referente</label>
              <input className="input" name="contactName" placeholder="Es. Dott. Rossi" />
            </div>

            <div>
              <label>Ruolo</label>
              <select className="input" name="contactRole" defaultValue="REFERENTE">
                <option value="REFERENTE">Referente</option>
                <option value="TITOLARE">Titolare</option>
                <option value="ASO">ASO</option>
                <option value="SEGRETERIA">Segreteria</option>
                <option value="AMMINISTRAZIONE">Amministrazione</option>
                <option value="ALTRO">Altro</option>
              </select>
            </div>

            <div>
              <label>Telefono</label>
              <input className="input" name="contactPhone" />
            </div>

            <div>
              <label>Email</label>
              <input className="input" name="contactEmail" />
            </div>

            <div>
              <label>Lista marketing</label>
              <select className="input" name="marketingList">
                <option value="">— Nessuna —</option>
                <option value="ASO">ASO</option>
                <option value="MEDICI">Medici</option>
                <option value="SEGRETERIA">Segreteria</option>
                <option value="CLIENTI">Clienti</option>
                <option value="ALTRO">Altro</option>
              </select>
            </div>
          </div>
        </div>

        <div className="row" style={{ marginTop: 14, gap: 8 }}>
          <button className="btn primary" type="submit">
            Salva
          </button>

          <Link className="btn" href="/clients">
            Annulla
          </Link>
        </div>
      </form>
    </div>
  );
}