"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function safeYm(v: any) {
  const s = String(v ?? "").trim();
  if (/^\d{4}-\d{2}$/.test(s)) return s;
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);

  if (d.getDate() < day) {
    d.setDate(0);
  }

  return d;
}

function calcNextDueDate(fromDate: Date, periodicity: string | null | undefined) {
  const p = String(periodicity ?? "").trim().toUpperCase();

  if (p === "SEMESTRALE") return addMonths(fromDate, 6);
  if (p === "ANNUALE") return addMonths(fromDate, 12);
  if (p === "BIENNALE") return addMonths(fromDate, 24);
  if (p === "TRIENNALE") return addMonths(fromDate, 36);
  if (p === "QUINQUENNALE") return addMonths(fromDate, 60);

  return addMonths(fromDate, 12);
}

export async function markClientServiceWorked(formData: FormData) {
  const clientServiceId = String(formData.get("clientServiceId") ?? "").trim();
  const redirectPath = String(formData.get("redirectPath") ?? "/monthly-work").trim();

  if (!clientServiceId) redirect(redirectPath);

  await prisma.clientService.update({
    where: { id: clientServiceId },
    data: { status: "IN_CORSO" },
  });

  revalidatePath("/monthly-work");
  revalidatePath("/maintenance");
  revalidatePath("/clients");
  revalidatePath(redirectPath);
  redirect(redirectPath);
}

export async function markClientServiceDone(formData: FormData) {
  const clientServiceId = String(formData.get("clientServiceId") ?? "").trim();
  const redirectPath = String(formData.get("redirectPath") ?? "/monthly-work").trim();
  const ym = safeYm(formData.get("ym"));

  if (!clientServiceId) redirect(redirectPath);

  await prisma.$transaction(async (tx) => {
    const cs = await tx.clientService.findUnique({
      where: { id: clientServiceId },
      include: { client: true, service: true, site: true },
    });

    if (!cs) return;

    const existingReport = await tx.workReport.findFirst({
      where: {
        ym,
        clientId: cs.clientId,
        serviceId: cs.serviceId,
        siteId: cs.siteId ?? null,
      },
      orderBy: { workedAt: "desc" },
    });

    if (existingReport) return;

    const doneAt = new Date();
    const nextDueDate = calcNextDueDate(doneAt, cs.periodicity);

    await tx.workReport.create({
      data: {
        ym,
        clientId: cs.clientId,
        serviceId: cs.serviceId,
        siteId: cs.siteId ?? null,
        amountEur: cs.priceEur ?? null,
        workedAt: doneAt,
        notes: "FATTURATO",
      },
    });

    await tx.clientService.update({
      where: { id: clientServiceId },
      data: {
        status: "FATTURATO" as any,
        lastDoneAt: doneAt,
        dueDate: nextDueDate,
      },
    });
  });

  revalidatePath("/monthly-work");
  revalidatePath("/work-report");
  revalidatePath("/maintenance");
  revalidatePath("/clients");
  revalidatePath(redirectPath);
  redirect(redirectPath);
}