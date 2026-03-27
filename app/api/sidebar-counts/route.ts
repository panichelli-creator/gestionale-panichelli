import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function startOfTodayLocal() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(base: Date, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

export async function GET() {
  const today = startOfTodayLocal();
  const in7 = addDays(today, 7);
  const in30 = addDays(today, 30);

  // âœ… 0â€“7 giorni
  const maintenance7 = await prisma.clientService.count({
    where: {
      dueDate: {
        gte: today,
        lte: in7,
      },
    },
  });

  // âœ… 0â€“30 giorni
  const maintenance30 = await prisma.clientService.count({
    where: {
      dueDate: {
        gte: today,
        lte: in30,
      },
    },
  });

  return NextResponse.json({
    maintenance: maintenance30, // compatibilitÃ  con vecchio codice
    maintenance7,
    maintenance30,
  });
}
