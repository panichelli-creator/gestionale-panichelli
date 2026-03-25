import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function DeleteClientServicePage({
  params,
}: {
  params: { id: string; serviceId: string };
}) {
  const clientId = params.id;
  const clientServiceId = params.serviceId;

  if (!clientServiceId) return notFound();

  const cs = await prisma.clientService.findUnique({
    where: { id: clientServiceId },
    include: { client: true, service: true },
  });

  if (!cs) return notFound();

  async function doDelete() {
    "use server";
    await prisma.clientService.delete({ where: { id: clientServiceId } });

    // ✅ fondamentale
    revalidatePath(`/clients/${clientId}`);
    revalidatePath("/clients");

    redirect(`/clients/${clientId}`);
  }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Elimina mantenimento</h1>
        <Link className="btn" href={`/clients/${clientId}`}>← Torna al cliente</Link>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div><b>Cliente:</b> {cs.client?.name}</div>
        <div><b>Servizio:</b> {(cs.service?.name ?? "").toUpperCase()}</div>
        <div style={{ marginTop: 8 }} className="muted">
          Questa azione elimina il mantenimento dal cliente.
        </div>
      </div>

      <form action={doDelete} className="row" style={{ marginTop: 14 }}>
        <button className="btn" style={{ border: "1px solid #ff6b6b", color: "#ff6b6b" }} type="submit">
          Elimina definitivamente
        </button>
        <Link className="btn" href={`/clients/${clientId}`}>Annulla</Link>
      </form>
    </div>
  );
}