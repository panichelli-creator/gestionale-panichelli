import { NextResponse } from "next/server";


export const dynamic = "force-dynamic";

export async function POST(...args) {
  const { prisma } = await import("@/lib/prisma");(req: Request) {
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

    const url = new URL(req.url);
    const origin = url.origin;

    return NextResponse.redirect(`${origin}/ingegneria-clinica`);
  } catch (e: any) {
    return new NextResponse(String(e?.message ?? e ?? "Errore"), {
      status: 500,
    });
  }
}