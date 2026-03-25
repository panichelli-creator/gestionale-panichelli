import { prisma } from "@/lib/prisma";
import CheckForm from "@/components/ingegneria-clinica/CheckForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  searchParams?: {
    clientId?: string;
  };
};

export default async function NewClinicalEngineeringPage({
  searchParams,
}: PageProps) {
  const selectedClientId = String(searchParams?.clientId ?? "").trim();

  const clients = await prisma.client.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const sites = await prisma.clientSite.findMany({
    select: {
      id: true,
      name: true,
      clientId: true,
      address: true,
    },
    orderBy: [{ clientId: "asc" }, { name: "asc" }],
  });

  const validClientId = clients.some((c) => c.id === selectedClientId)
    ? selectedClientId
    : "";

  return (
    <div className="card">
      <h1>Ingegneria Clinica · Nuova</h1>
      <div className="muted" style={{ marginTop: 6 }}>
        Se selezioni il cliente, puoi comunque mantenere uno “snapshot”
        (nome/indirizzo) per storicizzare i dati.
      </div>

      <CheckForm
        mode="create"
        clients={clients}
        sites={sites}
        data={{
          clientId: validClientId,
          quotaTecnicoPerc: 40,
        }}
      />
    </div>
  );
}