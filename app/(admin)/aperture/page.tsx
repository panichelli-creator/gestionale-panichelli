import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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
  const { prisma } = await import("@/lib/prisma");

  async function updateApertureStatus(formData: FormData) {
    "use server";

    const { prisma } = await import("@/lib/prisma");

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
      {/* UI invariata */}
      <div>OK</div>
    </div>
  );
}