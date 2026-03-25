import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    await prisma.clinicalEngineeringCheck.updateMany({
      where: {
        verificheEseguite: true,
        tecnicoFatturato: false,
      },
      data: {
        tecnicoFatturato: true,
      },
    });

    return NextResponse.redirect(new URL("/ingegneria-clinica", "http://localhost:3000"));
  } catch (e: any) {
    return new NextResponse(String(e?.message ?? e ?? "Errore"), {
      status: 500,
    });
  }
}