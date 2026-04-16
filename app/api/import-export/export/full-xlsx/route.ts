import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function fmtDate(value: Date | string | null | undefined) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function yesNo(value: any) {
  return value ? "SI" : "NO";
}

export async function GET() {
  const XLSX = await import("xlsx");
  const { prisma } = await import("@/lib/prisma");
  const db: any = prisma as any;

  const [
    clients,
    sites,
    contacts,
    people,
    personClients,
    personSites,
    serviceCatalog,
    clientServices,
    courses,
    trainingRecords,
    practices,
    practiceBillingSteps,
    vseRows,
    mapRows,
  ] = await Promise.all([
    db.client.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        type: true,
        status: true,
        email: true,
        phone: true,
        pec: true,
        vatNumber: true,
        uniqueCode: true,
        legalSeat: true,
        operativeSeat: true,
        address: true,
        employeesCount: true,
        occupationalDoctorName: true,
        notes: true,
      },
    }),

    db.clientSite.findMany({
      orderBy: [{ client: { name: "asc" } }, { name: "asc" }],
      include: {
        client: {
          select: { id: true, name: true },
        },
      },
    }),

    db.clientContact.findMany({
      orderBy: [{ client: { name: "asc" } }, { name: "asc" }],
      include: {
        client: {
          select: { id: true, name: true },
        },
      },
    }),

    db.person.findMany({
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      include: {
        client: {
          select: { id: true, name: true },
        },
      },
    }),

    db.personClient.findMany({
      include: {
        client: {
          select: { id: true, name: true },
        },
        person: {
          select: { id: true },
        },
      },
    }),

    db.personSite.findMany({
      include: {
        site: {
          include: {
            client: {
              select: { id: true, name: true },
            },
          },
        },
        person: {
          select: { id: true },
        },
      },
    }),

    db.serviceCatalog.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),

    db.clientService.findMany({
      orderBy: [{ client: { name: "asc" } }, { dueDate: "asc" }],
      include: {
        client: {
          select: { id: true, name: true },
        },
        site: {
          select: { id: true, name: true },
        },
        service: {
          select: { id: true, name: true },
        },
      },
    }),

    db.course?.findMany
      ? db.course.findMany({
          orderBy: { name: "asc" },
          select: { id: true, name: true },
        })
      : Promise.resolve([]),

    db.trainingRecord?.findMany
      ? db.trainingRecord.findMany({
          include: {
            person: {
              include: {
                client: {
                  select: { id: true, name: true },
                },
              },
            },
            course: {
              select: { id: true, name: true },
            },
          },
        })
      : Promise.resolve([]),

    db.clientPractice?.findMany
      ? db.clientPractice.findMany({
          orderBy: [{ client: { name: "asc" } }, { title: "asc" }],
          include: {
            client: {
              select: { id: true, name: true },
            },
          },
        })
      : Promise.resolve([]),

    db.practiceBillingStep?.findMany
      ? db.practiceBillingStep.findMany({
          orderBy: [{ practice: { client: { name: "asc" } } }, { sortOrder: "asc" }],
          include: {
            practice: {
              include: {
                client: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        })
      : Promise.resolve([]),

    db.clinicalEngineeringCheck?.findMany
      ? db.clinicalEngineeringCheck.findMany({
          orderBy: [{ client: { name: "asc" } }],
          include: {
            client: {
              select: { id: true, name: true, phone: true },
            },
            site: {
              select: { id: true, name: true },
            },
          },
        })
      : Promise.resolve([]),

    db.mapPlanItem?.findMany
      ? db.mapPlanItem.findMany({
          orderBy: [{ ym: "asc" }],
          include: {
            client: {
              select: { id: true, name: true },
            },
            site: {
              select: { id: true, name: true },
            },
            clientService: {
              include: {
                service: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        })
      : Promise.resolve([]),
  ]);

  const clientsById = new Map<string, any>(clients.map((c: any) => [c.id, c]));
  const coursesById = new Map<string, any>((courses ?? []).map((c: any) => [c.id, c]));

  const extraClientsByPersonId = new Map<string, string[]>();
  for (const row of personClients ?? []) {
    const personId = row.personId ?? row.person?.id;
    const clientId = row.clientId ?? row.client?.id;
    const clientName = row.client?.name ?? "";
    if (!personId || !clientName) continue;

    if (!extraClientsByPersonId.has(personId)) extraClientsByPersonId.set(personId, []);
    const personMainClientId =
      people.find((p: any) => p.id === personId)?.clientId ?? null;

    if (personMainClientId && clientId === personMainClientId) continue;

    const arr = extraClientsByPersonId.get(personId)!;
    if (!arr.includes(clientName)) arr.push(clientName);
  }

  const sitesByPersonId = new Map<string, string[]>();
  for (const row of personSites ?? []) {
    const personId = row.personId ?? row.person?.id;
    const siteName = row.site?.name ?? "";
    if (!personId || !siteName) continue;

    if (!sitesByPersonId.has(personId)) sitesByPersonId.set(personId, []);
    const arr = sitesByPersonId.get(personId)!;
    if (!arr.includes(siteName)) arr.push(siteName);
  }

  const clientCode = (id: string) => `CLI-${id}`;
  const siteCode = (id: string) => `SED-${id}`;
  const contactCode = (id: string) => `CON-${id}`;
  const personCode = (id: string) => `PER-${id}`;
  const serviceCode = (id: string) => `SER-${id}`;
  const practiceCode = (id: string) => `PRA-${id}`;
  const vseCode = (id: string) => `VSE-${id}`;
  const mapCode = (id: string) => `MAP-${id}`;

  const clientiRows = clients.map((c: any) => ({
    CODICE_IMPORT: clientCode(c.id),
    Nome: c.name ?? "",
    Tipo: c.type ?? "",
    Stato: c.status ?? "",
    Email: c.email ?? "",
    Telefono: c.phone ?? "",
    PEC: c.pec ?? "",
    PIVA: c.vatNumber ?? "",
    CodiceUnivoco: c.uniqueCode ?? "",
    SedeLegale: c.legalSeat ?? "",
    SedeOperativa: c.operativeSeat ?? "",
    Indirizzo: c.address ?? "",
    Dipendenti: c.employeesCount ?? "",
    MedicoLavoro: c.occupationalDoctorName ?? "",
    Note: c.notes ?? "",
  }));

  const sediRows = sites.map((s: any) => ({
    CODICE_IMPORT: siteCode(s.id),
    ClienteCodice: clientCode(s.clientId),
    ClienteNome: s.client?.name ?? "",
    NomeSede: s.name ?? "",
    Indirizzo: s.address ?? "",
    Città: s.city ?? "",
    Provincia: s.province ?? "",
    CAP: s.cap ?? "",
    Note: s.notes ?? "",
  }));

  const contattiRows = contacts.map((c: any) => ({
    CODICE_IMPORT: contactCode(c.id),
    ClienteCodice: c.clientId ? clientCode(c.clientId) : "",
    ClienteNome: c.client?.name ?? "",
    Nome: c.name ?? "",
    Ruolo: c.role ?? "",
    Email: c.email ?? "",
    Telefono: c.phone ?? "",
    ListeMarketing: c.marketingList ?? "",
    Note: c.notes ?? "",
  }));

  const personeRows = people.map((p: any) => {
    const allSites = sitesByPersonId.get(p.id) ?? [];
    const mainSite = allSites[0] ?? "";
    const otherSites = allSites.slice(1).join("|");
    const extraClients = (extraClientsByPersonId.get(p.id) ?? []).join("|");

    return {
      CODICE_IMPORT: personCode(p.id),
      ClientePrincipaleCodice: p.clientId ? clientCode(p.clientId) : "",
      ClientePrincipaleNome: p.client?.name ?? "",
      Cognome: p.lastName ?? "",
      Nome: p.firstName ?? "",
      Email: p.email ?? "",
      Telefono: p.phone ?? "",
      Mansione: p.role ?? "",
      CodiceFiscale: p.fiscalCode ?? "",
      DataAssunzione: fmtDate(p.hireDate),
      VisitaMedica: yesNo(p.medicalCheckDone),
      CreaComeContatto: "",
      RuoloContatto: "",
      ListeMarketing: "",
      SedePrincipale: mainSite,
      AltriClienti: extraClients,
      AltreSedi: otherSites,
      Note: p.notes ?? "",
    };
  });

  const serviziRows = clientServices.map((s: any) => ({
    CODICE_IMPORT: serviceCode(s.id),
    ClienteCodice: clientCode(s.clientId),
    ClienteNome: s.client?.name ?? "",
    Sede: s.site?.name ?? "",
    Servizio: s.service?.name ?? "",
    Periodicità: s.periodicity ?? "",
    Prezzo: s.priceEur ?? "",
    DataScadenza: fmtDate(s.dueDate),
    Stato: s.status ?? "",
    Referente: s.referenteName ?? "",
    PercentualeReferente: s.referentePerc ?? "",
    RXEndorali: s.rxEndoralCount ?? "",
    RXOpt: s.rxOptCount ?? "",
    Note: s.notes ?? "",
  }));

  const formazioneRows = (trainingRecords ?? []).map((r: any) => ({
    CODICE_IMPORT: `FOR-${r.id}`,
    ClienteCodice: r.person?.clientId ? clientCode(r.person.clientId) : "",
    ClienteNome: r.person?.client?.name ?? "",
    PersonaCodice: r.personId ? personCode(r.personId) : "",
    Persona: `${r.person?.lastName ?? ""} ${r.person?.firstName ?? ""}`.trim(),
    Corso: r.course?.name ?? coursesById.get(r.courseId)?.name ?? "",
    DataUltima: fmtDate(r.completedAt),
    DataScadenza: fmtDate(r.dueDate),
    Stato: "",
    Note: r.notes ?? "",
  }));

  const praticheRows = (practices ?? []).map((p: any) => ({
    CODICE_IMPORT: practiceCode(p.id),
    ClienteCodice: clientCode(p.clientId),
    ClienteNome: p.client?.name ?? "",
    Titolo: p.title ?? "",
    DataPratica: fmtDate(p.practiceDate),
    Determina: p.determinaNumber ?? "",
    StatoApertura: p.apertureStatus ?? "",
    AnnoInizio: p.startYear ?? "",
    InListaAperture: yesNo(p.inApertureList),
    Fatturata: yesNo(p.fatturata),
    CostoPratica: "",
    Acconto: "",
    DataAcconto: "",
    Saldo: "",
    DataSaldo: "",
    Note: p.notes ?? "",
  }));

  const praticheSalRows = (practiceBillingSteps ?? []).map((s: any) => ({
    CODICE_IMPORT: `SAL-${s.id}`,
    PraticaCodice: s.practiceId ? practiceCode(s.practiceId) : "",
    ClienteNome: s.practice?.client?.name ?? "",
    PraticaTitolo: s.practice?.title ?? "",
    Ordine: s.sortOrder ?? "",
    Voce: s.label ?? "",
    Tipo: s.billingType ?? "",
    TriggerStato: s.triggerStatus ?? "",
    Importo: s.amountEur ?? "",
    StatoFattura: s.billingStatus ?? "",
    NumeroFattura: s.invoiceNumber ?? "",
    DataFattura: fmtDate(s.invoiceDate),
    DataIncasso: fmtDate(s.paidAt),
    Note: s.notes ?? "",
  }));

  const vseExportRows = (vseRows ?? []).map((v: any) => ({
    CODICE_IMPORT: vseCode(v.id),
    ClienteCodice: v.clientId ? clientCode(v.clientId) : "",
    ClienteNome: v.client?.name ?? "",
    Sede: v.site?.name ?? "",
    Referente: v.referente ?? "",
    TelefonoCliente: v.client?.phone ?? "",
    Periodicità: v.periodicity ?? "",
    DataAppuntamento: fmtDate(v.dataAppuntamentoPreso),
    DataUltimoAppuntamento: fmtDate(v.dataUltimoAppuntamento),
    VerificheEseguite: yesNo(v.verificheEseguite),
    FileDropbox: yesNo(v.fileSuDropbox),
    FatturataCliente: yesNo(v.fatturata),
    TecnicoPagato: yesNo(v.tecnicoFatturato),
    Note: v.notes ?? "",
  }));

  const mapExportRows = (mapRows ?? []).map((m: any) => ({
    CODICE_IMPORT: mapCode(m.id),
    ClienteCodice: m.clientId ? clientCode(m.clientId) : "",
    ClienteNome: m.client?.name ?? "",
    Sede: m.site?.name ?? "",
    Servizio: m.clientService?.service?.name ?? "",
    Mese: m.ym ?? "",
    DataPianificata: fmtDate(m.plannedDate),
    Stato: m.status ?? "",
    Note: m.notes ?? "",
  }));

  const readmeRows = [
    {
      FOGLIO: "CLIENTI",
      NOTE: "Anagrafica clienti",
    },
    {
      FOGLIO: "SEDI",
      NOTE: "Usa ClienteCodice o ClienteNome per collegare la sede",
    },
    {
      FOGLIO: "CONTATTI",
      NOTE: "ListeMarketing separate da |",
    },
    {
      FOGLIO: "PERSONE",
      NOTE: "AltriClienti e AltreSedi separati da |",
    },
    {
      FOGLIO: "SERVIZI",
      NOTE: "Periodicità: ANNUALE, SEMESTRALE, BIENNALE, ...",
    },
    {
      FOGLIO: "FORMAZIONE",
      NOTE: "Persona nel formato Cognome Nome",
    },
    {
      FOGLIO: "PRATICHE",
      NOTE: "Opzionale",
    },
    {
      FOGLIO: "PRATICHE_SAL",
      NOTE: "Opzionale",
    },
    {
      FOGLIO: "VSE",
      NOTE: "Opzionale",
    },
    {
      FOGLIO: "MAP",
      NOTE: "Opzionale",
    },
    {
      FOGLIO: "DATE",
      NOTE: "Formato consigliato YYYY-MM-DD",
    },
  ];

  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(clientiRows), "CLIENTI");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sediRows), "SEDI");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(contattiRows), "CONTATTI");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(personeRows), "PERSONE");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(serviziRows), "SERVIZI");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(formazioneRows), "FORMAZIONE");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(praticheRows), "PRATICHE");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(praticheSalRows), "PRATICHE_SAL");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(vseExportRows), "VSE");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(mapExportRows), "MAP");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(readmeRows), "README");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="export_completo_gestionale.xlsx"',
      "Cache-Control": "no-store",
    },
  });
}