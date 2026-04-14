"use server";

import { redirect } from "next/navigation";

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);
  if (d.getDate() < day) d.setDate(0);
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

export async function markWorkedMonthly(formData: FormData) {
  const { prisma } = await import("@/lib/prisma");

  const clientServiceId = String(formData.get("clientServiceId") ?? "").trim();
  const redirectPath =
    String(formData.get("redirectPath") ?? "/monthly-work").trim() || "/monthly-work";

  if (!clientServiceId) {
    redirect(redirectPath);
  }

  await prisma.clientService.update({
    where: { id: clientServiceId },
    data: {
      status: "SVOLTO",
      lastDoneAt: new Date(),
    },
  });

  redirect(redirectPath);
}

export async function markBilledMonthly(formData: FormData) {
  const { prisma } = await import("@/lib/prisma");

  const clientServiceId = String(formData.get("clientServiceId") ?? "").trim();
  const redirectPath =
    String(formData.get("redirectPath") ?? "/monthly-work").trim() || "/monthly-work";

  if (!clientServiceId) {
    redirect(redirectPath);
  }

  const current = await prisma.clientService.findUnique({
    where: { id: clientServiceId },
    select: {
      id: true,
      periodicity: true,
      lastDoneAt: true,
    },
  });

  if (!current) {
    redirect(redirectPath);
  }

  const doneAt = current.lastDoneAt ? new Date(current.lastDoneAt) : new Date();
  const nextDueDate = calcNextDueDate(doneAt, current.periodicity);

  await prisma.clientService.update({
    where: { id: clientServiceId },
    data: {
      status: "FATTURATO",
      lastDoneAt: doneAt,
      dueDate: nextDueDate,
    },
  });

  redirect(redirectPath);
}