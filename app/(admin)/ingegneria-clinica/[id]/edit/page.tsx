import Link from "next/link";
import CheckForm from "@/components/ingegneria-clinica/CheckForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EditIngegneriaClinicaPage({
  params,
}: {
  params: { id: string };
}) {
  const { prisma } = await import("@/lib/prisma");
  const id = String(params.id);

  const item = await prisma.clinicalEngineeringCheck.findUnique({
    where: { id },
    include: {
      client: {
        select: { id: true, name: true },
      },
      site: {
        select: { id: true, name: true, clientId: true },
      },
    },
  });

  if (!item) {
    return (
      <div className="card">
        <h1>Modifica verifica VSE</h1>
        <div className="muted">Voce non trovata.</div>
        <div style={{ marginTop: 12 }}>
          <Link className="btn" href="/ingegneria-clinica">
            Torna alla lista
          </Link>
        </div>
      </div>
    );
  }

  const clients = await prisma.client.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
    take: 2000,
  });

  const selectedClientId = item.clientId ?? item.site?.clientId ?? "";

  const sites = selectedClientId
    ? await prisma.clientSite.findMany({
        where: { clientId: selectedClientId },
        select: { id: true, name: true, clientId: true },
        orderBy: { name: "asc" },
        take: 2000,
      })
    : [];

  return (
    <div className="card">
      <div
        className="row"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ margin: 0 }}>Modifica verifica VSE</h1>

        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href="/ingegneria-clinica">
            Indietro
          </Link>
        </div>
      </div>

      <CheckForm
        id={item.id}
        mode="edit"
        clients={clients}
        sites={sites}
        data={{
          id: item.id,
          clientId: item.clientId ?? "",
          siteId: item.siteId ?? "",
          nomeClienteSnapshot: item.nomeClienteSnapshot ?? "",
          nomeSedeSnapshot: item.nomeSedeSnapshot ?? "",
          indirizzoSedeSnapshot: item.indirizzoSedeSnapshot ?? "",
          studioRifAmministrativo: item.studioRifAmministrativo ?? "",
          contattiMail: item.contattiMail ?? "",
          contattiCellulare: item.contattiCellulare ?? "",
          numApparecchiature: item.numApparecchiature ?? 0,
          apparecchiatureAggiuntive: item.apparecchiatureAggiuntive ?? 0,
          costoServizio: Number(item.costoServizio ?? 0),
          quotaTecnicoPerc: Number(item.quotaTecnicoPerc ?? 40),
          quotaTecnico: Number(item.quotaTecnico ?? 0),
          importoTrasferta: Number(item.importoTrasferta ?? 0),
          periodicita:
            (item.periodicita as "ANNUALE" | "SEMESTRALE" | "BIENNALE") ?? "ANNUALE",
          dataUltimoAppuntamento: item.dataUltimoAppuntamento,
          dataAppuntamentoPreso: item.dataAppuntamentoPreso ?? null,
          dataProssimoAppuntamento: item.dataProssimoAppuntamento,
          verificheEseguite: item.verificheEseguite,
          fileSuDropbox: item.fileSuDropbox,
          fatturata: item.fatturata ?? false,
          tecnicoFatturato: item.tecnicoFatturato ?? false,
          notes: item.notes ?? "",
        }}
      />
    </div>
  );
}