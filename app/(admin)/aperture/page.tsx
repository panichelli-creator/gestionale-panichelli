import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SP = {
  q?: string;
  status?: string;
  year?: string;
};

function getPracticeStatusLabel(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();

  if (s === "INVIATA_REGIONE") return "Inviata Regione";
  if (s === "INIZIO_LAVORI") return "Inizio lavori";
  if (s === "ACCETTATO") return "Accettato";
  if (s === "ISPEZIONE_ASL") return "Ispezione ASL";
  if (s === "CONCLUSO") return "Concluso";
  if (s === "IN_ATTESA") return "In attesa";

  return "In attesa";
}

function getStartYear(p: any) {
  const raw = p?.startYear ?? null;
  if (raw == null || raw === "") return "—";
  return String(raw);
}

function getSede(p: any) {
  return (
    p?.site?.name ??
    p?.clientSite?.name ??
    p?.client?.operativeSeat ??
    p?.client?.legalSeat ??
    "—"
  );
}

function isConcluso(v: string | null | undefined) {
  return String(v ?? "").trim().toUpperCase() === "CONCLUSO";
}

function statusBadgeStyle(v: string | null | undefined) {
  const s = String(v ?? "").trim().toUpperCase();

  if (s === "CONCLUSO") {
    return {
      background: "rgba(34,197,94,0.12)",
      color: "#166534",
      border: "1px solid rgba(34,197,94,0.30)",
    };
  }

  if (s === "ACCETTATO") {
    return {
      background: "rgba(37,99,235,0.12)",
      color: "#1d4ed8",
      border: "1px solid rgba(37,99,235,0.30)",
    };
  }

  if (s === "ISPEZIONE_ASL") {
    return {
      background: "rgba(245,158,11,0.12)",
      color: "#92400e",
      border: "1px solid rgba(245,158,11,0.30)",
    };
  }

  if (s === "INIZIO_LAVORI") {
    return {
      background: "rgba(168,85,247,0.12)",
      color: "#7c3aed",
      border: "1px solid rgba(168,85,247,0.30)",
    };
  }

  if (s === "INVIATA_REGIONE") {
    return {
      background: "rgba(14,165,233,0.12)",
      color: "#0369a1",
      border: "1px solid rgba(14,165,233,0.30)",
    };
  }

  return {
    background: "rgba(0,0,0,0.04)",
    color: "rgba(0,0,0,0.72)",
    border: "1px solid rgba(0,0,0,0.12)",
  };
}

export default async function AperturePage({
  searchParams,
}: {
  searchParams?: SP;
}) {
  async function updateApertureStatus(formData: FormData) {
    "use server";

    const id = String(formData.get("id") ?? "").trim();
    const status = String(formData.get("apertureStatus") ?? "IN_ATTESA")
      .trim()
      .toUpperCase();

    const q = String(formData.get("q") ?? "").trim();
    const year = String(formData.get("year") ?? "").trim();
    const currentStatus = String(formData.get("currentStatus") ?? "").trim();

    if (!id) redirect("/aperture");

    await prisma.clientPractice.update({
      where: { id },
      data: {
        apertureStatus: status || "IN_ATTESA",
      },
    });

    const qs = new URLSearchParams();
    if (q) qs.set("q", q);
    if (year) qs.set("year", year);
    if (currentStatus) qs.set("status", currentStatus);

    revalidatePath("/aperture");
    revalidatePath("/clients");
    redirect(qs.toString() ? `/aperture?${qs.toString()}` : "/aperture");
  }

  const q = String(searchParams?.q ?? "").trim();
  const status = String(searchParams?.status ?? "TUTTI").trim().toUpperCase();
  const year = String(searchParams?.year ?? "").trim();

  const practicesRaw = await prisma.clientPractice.findMany({
    where: {
      inApertureList: true,
    },
    include: {
      client: true,
    },
    orderBy: [{ startYear: "desc" }, { practiceDate: "desc" }, { createdAt: "desc" }],
  });

  const practices = practicesRaw.filter((p) => {
    const clientName = String(p.client?.name ?? "").toLowerCase();
    const title = String(p.title ?? "").toLowerCase();
    const determina = String(p.determinaNumber ?? "").toLowerCase();
    const apertureStatus = String((p as any).apertureStatus ?? "IN_ATTESA").toUpperCase();
    const startYear = String((p as any).startYear ?? "").trim();

    const hay = [clientName, title, determina].join(" ");

    if (q && !hay.includes(q.toLowerCase())) return false;
    if (status !== "TUTTI" && apertureStatus !== status) return false;
    if (year && startYear !== year) return false;

    return true;
  });

  return (
    <div className="card">
      <style>{`
        .miniBadge{
          display:inline-flex;
          align-items:center;
          padding:4px 8px;
          border-radius:999px;
          font-size:12px;
          font-weight:800;
          line-height:1;
          white-space:nowrap;
        }
      `}</style>

      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Aperture</h1>
          <div className="muted" style={{ marginTop: 6 }}>
            Elenco pratiche segnate come apertura
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

      <form method="GET" className="card" style={{ marginTop: 12 }}>
        <div className="grid3">
          <div>
            <label>Filtro cliente / pratica / determina</label>
            <input
              className="input"
              name="q"
              defaultValue={q}
              placeholder="Scrivi nome cliente, pratica o determina..."
            />
          </div>

          <div>
            <label>Stato</label>
            <select className="input" name="status" defaultValue={status}>
              <option value="TUTTI">Tutti</option>
              <option value="IN_ATTESA">In attesa</option>
              <option value="INVIATA_REGIONE">Inviata Regione</option>
              <option value="INIZIO_LAVORI">Inizio lavori</option>
              <option value="ACCETTATO">Accettato</option>
              <option value="ISPEZIONE_ASL">Ispezione ASL</option>
              <option value="CONCLUSO">Concluso</option>
            </select>
          </div>

          <div>
            <label>Anno inizio</label>
            <input
              className="input"
              type="number"
              name="year"
              min="2000"
              max="2100"
              step="1"
              defaultValue={year}
              placeholder="Es: 2026"
            />
          </div>
        </div>

        <div className="row" style={{ gap: 8, marginTop: 12 }}>
          <button className="btn primary" type="submit">
            Applica
          </button>
          <Link className="btn" href="/aperture">
            Reset
          </Link>
        </div>
      </form>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="muted">
          Totale pratiche in Aperture: <b>{practices.length}</b>
        </div>

        {practices.length ? (
          <table className="table" style={{ marginTop: 12 }}>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Sede</th>
                <th>Pratica</th>
                <th>Anno inizio</th>
                <th>Stato</th>
                <th>Determina</th>
                <th>Apri</th>
              </tr>
            </thead>

            <tbody>
              {practices.map((p) => {
                const row = p as any;
                const concluso = isConcluso(row.apertureStatus);

                return (
                  <tr key={p.id}>
                    <td>
                      <Link href={`/clients/${p.clientId}`}>
                        <b>{p.client?.name ?? "—"}</b>
                      </Link>
                    </td>

                    <td>{getSede(row)}</td>

                    <td>{p.title}</td>

                    <td>{getStartYear(row)}</td>

                    <td style={{ minWidth: 250 }}>
                      <form
                        action={updateApertureStatus}
                        className="row"
                        style={{ gap: 8, alignItems: "center", flexWrap: "nowrap" }}
                      >
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="q" value={q} />
                        <input type="hidden" name="year" value={year} />
                        <input type="hidden" name="currentStatus" value={status} />

                        <select
                          className="input"
                          name="apertureStatus"
                          defaultValue={row.apertureStatus ?? "IN_ATTESA"}
                          style={{ minWidth: 170 }}
                        >
                          <option value="IN_ATTESA">In attesa</option>
                          <option value="INVIATA_REGIONE">Inviata Regione</option>
                          <option value="INIZIO_LAVORI">Inizio lavori</option>
                          <option value="ACCETTATO">Accettato</option>
                          <option value="ISPEZIONE_ASL">Ispezione ASL</option>
                          <option value="CONCLUSO">Concluso</option>
                        </select>

                        <button className="btn" type="submit">
                          Salva
                        </button>
                      </form>

                      <div style={{ marginTop: 6 }}>
                        <span className="miniBadge" style={statusBadgeStyle(row.apertureStatus)}>
                          {getPracticeStatusLabel(row.apertureStatus)}
                        </span>
                      </div>
                    </td>

                    <td
                      style={
                        concluso
                          ? {
                              color: "#166534",
                              fontWeight: 900,
                              background: "rgba(34,197,94,0.08)",
                            }
                          : undefined
                      }
                    >
                      {p.determinaNumber ?? "—"}
                    </td>

                    <td>
                      <Link
                        className="btn"
                        href={`/clients/${p.clientId}/practices/${p.id}`}
                      >
                        Apri
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="muted" style={{ marginTop: 12 }}>
            Nessuna pratica presente nella lista Aperture.
          </div>
        )}
      </div>
    </div>
  );
}