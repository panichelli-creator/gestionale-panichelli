"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function s(v: FormDataEntryValue | null) {
  return typeof v === "string" ? v.trim() : "";
}

export async function addPersonClient(formData: FormData) {
  const personId = s(formData.get("personId"));
  const clientId = s(formData.get("clientId"));
  const redirectPath = s(formData.get("redirectPath")) || `/people/${personId}`;

  if (!personId || !clientId) throw new Error("Dati mancanti (personId/clientId).");

  const person = await prisma.person.findUnique({
    where: { id: personId },
    select: { id: true, clientId: true },
  });
  if (!person) throw new Error("Persona non trovata.");

  // se è già sede principale, non inserirla tra le aggiuntive
  if (person.clientId === clientId) {
    revalidatePath(redirectPath);
    return;
  }

  const existing = await prisma.personClient.findFirst({
    where: { personId, clientId },
    select: { id: true },
  });

  if (!existing) {
    await prisma.personClient.create({
      data: { personId, clientId },
    });
  }

  revalidatePath(redirectPath);
}

export async function removePersonClient(formData: FormData) {
  const personClientId = s(formData.get("personClientId"));
  const personId = s(formData.get("personId"));
  const redirectPath = s(formData.get("redirectPath")) || `/people/${personId}`;

  if (!personClientId) throw new Error("personClientId mancante.");

  await prisma.personClient.delete({
    where: { id: personClientId },
  });

  revalidatePath(redirectPath);
}

export async function setPrimaryClient(formData: FormData) {
  const personId = s(formData.get("personId"));
  const clientId = s(formData.get("clientId"));
  const redirectPath = s(formData.get("redirectPath")) || `/people/${personId}`;

  if (!personId || !clientId) throw new Error("Dati mancanti (personId/clientId).");

  await prisma.person.update({
    where: { id: personId },
    data: { clientId },
  });

  // se era tra le aggiuntive, rimuovila
  const pc = await prisma.personClient.findFirst({
    where: { personId, clientId },
    select: { id: true },
  });

  if (pc) {
    await prisma.personClient.delete({ where: { id: pc.id } });
  }

  revalidatePath(redirectPath);
}