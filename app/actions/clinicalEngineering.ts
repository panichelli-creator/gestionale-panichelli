"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import path from "path";
import fs from "fs/promises";

function s(v: any) {
  return String(v ?? "").trim();
}

function n(v: any) {
  const num = Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(num) ? num : 0;
}

function i(v: any) {
  const num = Number(String(v ?? "").trim());
  return Number.isFinite(num) ? Math.trunc(num) : 0;
}

function boolFromForm(v: any) {
  return v === "on" || v === true || v === "true" || v === 1 || v === "1";
}

function dateFromYmd(v: any) {
  const val = s(v);
  if (!val) return null;
  const m = /^\d{4}-\d{2}-\d{2}$/.exec(val);
  if (!m) return null;
  const d = new Date(val + "T00:00:00.000Z");
  return Number.isFinite(d.getTime()) ? d : null;
}

function ymFromDate(d: Date | null | undefined) {
  const x = d ? new Date(d) : new Date();
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}`;
}

async function saveAttachmentFile(file: File, checkId: string) {
  if (!file || file.size === 0) return null;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);

  const relDir = path.posix.join("/uploads/ingegneria-clinica", checkId);
  const absDir = path.join(process.cwd(), "public", relDir);

  await fs.mkdir(absDir, { recursive: true });

  const absPath = path.join(absDir, safeName);
  await fs.writeFile(absPath, buffer);

  return {
    name: safeName,
    url: path.posix.join(relDir, safeName),
    size: file.size,
    type: file.type,
    uploadedAt: new Date().toISOString(),
  };
}

async function findVseServiceId() {
  const vseService = await prisma.serviceCatalog.findFirst({
    where: {
      OR: [{ name: "VSE" }, { name: "INGEGNERIA CLINICA" }, { name: "Ingegneria Clinica" }],
    },
    select: { id: true },
  });

  return vseService?.id ?? null;
}

async function syncClinicalCheckWorkReport(checkId: string) {
  const check = await prisma.clinicalEngineeringCheck.findUnique({
    where: { id: checkId },
    include: {
      client: true,
      site: true,
    },
  });

  if (!check || !check.clientId) return;

  const noteTag = `[VSE_CHECK:${check.id}]`;

  const workedAt =
    check.dataUltimoAppuntamento ??
    check.dataProssimoAppuntamento ??
    check.updatedAt ??
    new Date();

  const ym = ymFromDate(workedAt);
  const amountEur = n(check.costoServizio) + n(check.importoTrasferta);

  const existing = await prisma.workReport.findFirst({
    where: {
      clientId: check.clientId,
      notes: { contains: noteTag },
    },
    select: { id: true },
  });

  if (!check.fatturata) {
    if (existing) {
      await prisma.workReport.delete({
        where: { id: existing.id },
      });
    }
    return;
  }

  const serviceId = await findVseServiceId();

  const notesParts = [
    noteTag,
    "VSE",
    check.client?.name ?? check.nomeClienteSnapshot ?? "",
    check.site?.name ?? check.nomeSedeSnapshot ?? "",
  ].filter(Boolean);

  if (existing) {
    await prisma.workReport.update({
      where: { id: existing.id },
      data: {
        ym,
        clientId: check.clientId,
        serviceId,
        siteId: (check as any).clientSiteId ?? null,
        amountEur,
        workedAt,
        notes: notesParts.join(" • "),
      },
    });
    return;
  }

  await prisma.workReport.create({
    data: {
      ym,
      clientId: check.clientId,
      serviceId,
      siteId: (check as any).clientSiteId ?? null,
      amountEur,
      workedAt,
      notes: notesParts.join(" • "),
    },
  });
}

export async function createClinicalEngineeringCheck(formData: FormData) {
  const redirectPath = s(formData.get("redirectPath") || "/ingegneria-clinica");

  const clientId = s(formData.get("clientId")) || null;
  const clientSiteId = s(formData.get("clientSiteId")) || null;

  const dataProssimo = dateFromYmd(formData.get("dataProssimoAppuntamento"));
  if (!dataProssimo) redirect(redirectPath);

  const created = await prisma.clinicalEngineeringCheck.create({
    data: {
      clientId,
      clientSiteId,

      nomeClienteSnapshot: s(formData.get("nomeClienteSnapshot")),
      indirizzoSedeSnapshot: s(formData.get("indirizzoSedeSnapshot")) || null,

      numApparecchiature: i(formData.get("numApparecchiature")),
      apparecchiatureAggiuntive: i(formData.get("apparecchiatureAggiuntive")),

      costoServizio: n(formData.get("costoServizio")),
      quotaTecnico: n(formData.get("quotaTecnico")),
      importoTrasferta: n(formData.get("importoTrasferta")),

      contattiStudio: s(formData.get("contattiStudio")) || null,
      contattiMail: s(formData.get("contattiMail")) || null,
      contattiCellulare: s(formData.get("contattiCellulare")) || null,

      dataUltimoAppuntamento: dateFromYmd(formData.get("dataUltimoAppuntamento")),
      dataProssimoAppuntamento: dataProssimo,

      verificheEseguite: boolFromForm(formData.get("verificheEseguite")),
      fileSuDropbox: boolFromForm(formData.get("fileSuDropbox")),
      fatturata: boolFromForm(formData.get("fatturata")),

      notes: s(formData.get("notes")) || null,
      allegatiJson: "[]",
    },
  });

  const file = formData.get("allegato") as File | null;
  if (file && typeof file === "object") {
    const meta = await saveAttachmentFile(file, created.id);
    if (meta) {
      await prisma.clinicalEngineeringCheck.update({
        where: { id: created.id },
        data: { allegatiJson: JSON.stringify([meta]) },
      });
    }
  }

  await syncClinicalCheckWorkReport(created.id);

  revalidatePath("/ingegneria-clinica");
  revalidatePath("/dashboard");
  revalidatePath("/work-report");
  redirect(`/ingegneria-clinica/${created.id}`);
}

export async function updateClinicalEngineeringCheck(formData: FormData) {
  const id = s(formData.get("id"));
  const redirectPath = s(formData.get("redirectPath") || "/ingegneria-clinica");
  if (!id) redirect(redirectPath);

  const existing = await prisma.clinicalEngineeringCheck.findUnique({ where: { id } });
  if (!existing) redirect(redirectPath);

  const clientId = s(formData.get("clientId")) || null;
  const clientSiteId = s(formData.get("clientSiteId")) || null;

  await prisma.clinicalEngineeringCheck.update({
    where: { id },
    data: {
      clientId,
      clientSiteId,

      nomeClienteSnapshot: s(formData.get("nomeClienteSnapshot")) || existing.nomeClienteSnapshot,
      indirizzoSedeSnapshot: s(formData.get("indirizzoSedeSnapshot")) || null,

      numApparecchiature: i(formData.get("numApparecchiature")),
      apparecchiatureAggiuntive: i(formData.get("apparecchiatureAggiuntive")),

      costoServizio: n(formData.get("costoServizio")),
      quotaTecnico: n(formData.get("quotaTecnico")),
      importoTrasferta: n(formData.get("importoTrasferta")),

      contattiStudio: s(formData.get("contattiStudio")) || null,
      contattiMail: s(formData.get("contattiMail")) || null,
      contattiCellulare: s(formData.get("contattiCellulare")) || null,

      dataUltimoAppuntamento: dateFromYmd(formData.get("dataUltimoAppuntamento")),
      dataProssimoAppuntamento:
        dateFromYmd(formData.get("dataProssimoAppuntamento")) ?? existing.dataProssimoAppuntamento,

      verificheEseguite: boolFromForm(formData.get("verificheEseguite")),
      fileSuDropbox: boolFromForm(formData.get("fileSuDropbox")),
      fatturata: boolFromForm(formData.get("fatturata")),

      notes: s(formData.get("notes")) || null,
    },
  });

  const file = formData.get("allegato") as File | null;
  if (file && typeof file === "object" && file.size > 0) {
    const meta = await saveAttachmentFile(file, id);
    if (meta) {
      let list: any[] = [];
      try {
        list = JSON.parse(existing.allegatiJson || "[]");
        if (!Array.isArray(list)) list = [];
      } catch {
        list = [];
      }
      list.push(meta);
      await prisma.clinicalEngineeringCheck.update({
        where: { id },
        data: { allegatiJson: JSON.stringify(list) },
      });
    }
  }

  await syncClinicalCheckWorkReport(id);

  revalidatePath("/ingegneria-clinica");
  revalidatePath(`/ingegneria-clinica/${id}`);
  revalidatePath("/dashboard");
  revalidatePath("/work-report");
  redirect(`/ingegneria-clinica/${id}`);
}

export async function deleteClinicalEngineeringCheck(formData: FormData) {
  const id = s(formData.get("id"));
  const redirectPath = s(formData.get("redirectPath") || "/ingegneria-clinica");
  if (!id) redirect(redirectPath);

  const existingWr = await prisma.workReport.findFirst({
    where: {
      notes: { contains: `[VSE_CHECK:${id}]` },
    },
    select: { id: true },
  });

  if (existingWr) {
    await prisma.workReport.delete({
      where: { id: existingWr.id },
    });
  }

  await prisma.clinicalEngineeringCheck.delete({ where: { id } });

  revalidatePath("/ingegneria-clinica");
  revalidatePath("/dashboard");
  revalidatePath("/work-report");
  redirect("/ingegneria-clinica");
}

export async function removeClinicalEngineeringAttachment(formData: FormData) {
  const id = s(formData.get("id"));
  const url = s(formData.get("url"));
  if (!id || !url) redirect(`/ingegneria-clinica/${id}`);

  const existing = await prisma.clinicalEngineeringCheck.findUnique({ where: { id } });
  if (!existing) redirect("/ingegneria-clinica");

  let list: any[] = [];
  try {
    list = JSON.parse(existing.allegatiJson || "[]");
    if (!Array.isArray(list)) list = [];
  } catch {
    list = [];
  }

  const next = list.filter((a) => a?.url !== url);
  await prisma.clinicalEngineeringCheck.update({
    where: { id },
    data: { allegatiJson: JSON.stringify(next) },
  });

  try {
    const abs = path.join(process.cwd(), "public", url);
    await fs.unlink(abs);
  } catch {
    // ignore
  }

  revalidatePath(`/ingegneria-clinica/${id}`);
  redirect(`/ingegneria-clinica/${id}`);
}
