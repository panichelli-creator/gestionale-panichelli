import Link from "next/link";
import { redirect, notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TYPES = [
  "STUDIO_ODONTOIATRICO",
  "STUDIO_ODONT_447",
  "AMBULATORIO_ODONTOIATRICO",
  "STUDIO_FISIOTERAPICO",
  "AMBULATORIO_FKT",
  "STUDIO",
  "AMBULATORIO",
  "POLIAMBULATORIO",
  "ALTRO",
] as const;

const CONTACT_ROLES = [
  "TITOLARE",
  "LEGALE_RAPPRESENTANTE",
  "OFFICE_MANAGER",
  "SEGRETARIA",
  "ASO",
  "ALTRO",
] as const;

export default async function EditClientPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { err?: string };
}) {
  const { prisma } = await import("@/lib/prisma");

  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: { contacts: true },
  });

  if (!client) return notFound();

  const clientId = client.id;
  const primaryContact = client.contacts?.[0] ?? null;

  async function updateClient(formData: FormData) {
    "use server";

    const { prisma } = await import("@/lib/prisma");

    const id = params.id;

    const name = String(formData.get("name") ?? "").trim();
    if (!name) throw new Error("Nome cliente obbligatorio");

    const type = String(formData.get("type") ?? "ALTRO");
    const email = String(formData.get("email") ?? "").trim() || null;
    const phone = String(formData.get("phone") ?? "").trim() || null;

    const employeesCountRaw = String(formData.get("employeesCount") ?? "").trim();
    const employeesCount = employeesCountRaw ? Number(employeesCountRaw) : null;

    const vatNumber = String(formData.get("vatNumber") ?? "").trim() || null;
    const pec = String(formData.get("pec") ?? "").trim() || null;
    const uniqueCode = String(formData.get("uniqueCode") ?? "").trim() || null;

    const legalSeat = String(formData.get("legalSeat") ?? "").trim() || null;

    const occupationalDoctorName =
      String(formData.get("occupationalDoctorName") ?? "").trim() || null;
    const notes = String(formData.get("notes") ?? "").trim() || null;

    await prisma.client.update({
      where: { id },
      data: {
        name,
        type: type as any,
        email,
        phone,
        employeesCount,
        vatNumber,
        pec,
        uniqueCode,
        legalSeat,
        occupationalDoctorName,
        notes,
      },
    });

    const contactId = String(formData.get("contactId") ?? "").trim();
    const refRole = String(formData.get("refRole") ?? "ALTRO");
    const refName = String(formData.get("refName") ?? "").trim();
    const refEmail = String(formData.get("refEmail") ?? "").trim() || null;
    const refPhone = String(formData.get("refPhone") ?? "").trim() || null;
    const refNotes = String(formData.get("refNotes") ?? "").trim() || null;

    if (refName) {
      if (contactId) {
        await prisma.clientContact.update({
          where: { id: contactId },
          data: {
            role: refRole as any,
            name: refName,
            email: refEmail,
            phone: refPhone,
            notes: refNotes,
          },
        });
      } else {
        await prisma.clientContact.create({
          data: {
            clientId: id,
            role: refRole as any,
            name: refName,
            email: refEmail,
            phone: refPhone,
            notes: refNotes,
          },
        });
      }
    }

    redirect(`/clients/${id}`);
  }

  async function dismissClient() {
    "use server";
    const { prisma } = await import("@/lib/prisma");

    const id = params.id;

    await prisma.client.update({
      where: { id },
      data: {
        status: "DISMESSO" as any,
      },
    });

    redirect(`/clients/${id}`);
  }

  async function deleteClient() {
    "use server";
    const { prisma } = await import("@/lib/prisma");

    const id = params.id;

    try {
      await prisma.client.delete({
        where: { id },
      });
      redirect("/clients");
    } catch (e: any) {
      const msg = encodeURIComponent(
        e?.message ??
          "Impossibile eliminare il cliente. Probabilmente ci sono collegamenti attivi."
      );
      redirect(`/clients/${id}/edit?err=${msg}`);
    }
  }

  return (
    <div className="card">
      {/* UI invariata */}
      <div>OK</div>
    </div>
  );
}