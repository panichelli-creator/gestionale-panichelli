import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const XLSX = await import("xlsx");

  function makeSheet(headers: string[]) {
    return XLSX.utils.aoa_to_sheet([headers]);
  }

  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    wb,
    makeSheet([
      "CODICE_IMPORT",
      "Nome",
      "Tipo",
      "Stato",
      "Email",
      "Telefono",
      "PEC",
      "PIVA",
      "CodiceUnivoco",
      "SedeLegale",
      "SedeOperativa",
      "Indirizzo",
      "Dipendenti",
      "MedicoLavoro",
      "Note",
    ]),
    "CLIENTI"
  );

  XLSX.utils.book_append_sheet(
    wb,
    makeSheet([
      "CODICE_IMPORT",
      "ClienteCodice",
      "ClienteNome",
      "NomeSede",
      "Indirizzo",
      "Città",
      "Provincia",
      "CAP",
      "Note",
    ]),
    "SEDI"
  );

  XLSX.utils.book_append_sheet(
    wb,
    makeSheet([
      "CODICE_IMPORT",
      "ClienteCodice",
      "ClienteNome",
      "Nome",
      "Ruolo",
      "Email",
      "Telefono",
      "ListeMarketing",
      "Note",
    ]),
    "CONTATTI"
  );

  XLSX.utils.book_append_sheet(
    wb,
    makeSheet([
      "CODICE_IMPORT",
      "ClientePrincipaleCodice",
      "ClientePrincipaleNome",
      "Cognome",
      "Nome",
      "Email",
      "Telefono",
      "Mansione",
      "CodiceFiscale",
      "DataAssunzione",
      "VisitaMedica",
      "CreaComeContatto",
      "RuoloContatto",
      "ListeMarketing",
      "SedePrincipale",
      "AltriClienti",
      "AltreSedi",
      "Note",
    ]),
    "PERSONE"
  );

  XLSX.utils.book_append_sheet(
    wb,
    makeSheet([
      "CODICE_IMPORT",
      "ClienteCodice",
      "ClienteNome",
      "Sede",
      "Servizio",
      "Periodicità",
      "Prezzo",
      "DataScadenza",
      "Stato",
      "Referente",
      "PercentualeReferente",
      "RXEndorali",
      "RXOpt",
      "Note",
    ]),
    "SERVIZI"
  );

  XLSX.utils.book_append_sheet(
    wb,
    makeSheet([
      "CODICE_IMPORT",
      "ClienteCodice",
      "ClienteNome",
      "Persona",
      "Corso",
      "DataUltima",
      "DataScadenza",
      "Stato",
      "Note",
    ]),
    "FORMAZIONE"
  );

  XLSX.utils.book_append_sheet(
    wb,
    makeSheet([
      "CODICE_IMPORT",
      "ClienteNome",
      "Titolo",
      "DataPratica",
      "Determina",
      "StatoApertura",
      "AnnoInizio",
      "InListaAperture",
      "Fatturata",
      "Note",
    ]),
    "PRATICHE"
  );

  XLSX.utils.book_append_sheet(
    wb,
    makeSheet([
      "CODICE_IMPORT",
      "ClienteNome",
      "PraticaTitolo",
      "Ordine",
      "Voce",
      "Tipo",
      "TriggerStato",
      "Importo",
      "StatoFattura",
      "NumeroFattura",
      "DataFattura",
      "DataIncasso",
      "Note",
    ]),
    "PRATICHE_SAL"
  );

  XLSX.utils.book_append_sheet(
    wb,
    makeSheet([
      "CODICE_IMPORT",
      "ClienteNome",
      "Sede",
      "Referente",
      "Periodicità",
      "DataAppuntamento",
      "DataUltimoAppuntamento",
      "VerificheEseguite",
      "FileDropbox",
      "FatturataCliente",
      "TecnicoPagato",
      "Note",
    ]),
    "VSE"
  );

  XLSX.utils.book_append_sheet(
    wb,
    makeSheet([
      "CODICE_IMPORT",
      "ClienteNome",
      "Sede",
      "Servizio",
      "Mese",
      "DataPianificata",
      "Stato",
      "Note",
    ]),
    "MAP"
  );

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([
      ["FOGLIO", "NOTE"],
      ["CLIENTI", "Date formato YYYY-MM-DD. Campi vuoti ok."],
      ["SEDI", "ClienteCodice o ClienteNome obbligatorio."],
      ["CONTATTI", "ListeMarketing separate da |"],
      ["PERSONE", "AltriClienti e AltreSedi separati da |"],
      ["SERVIZI", "Periodicità es: ANNUALE, SEMESTRALE, BIENNALE"],
      ["FORMAZIONE", "Persona come 'Cognome Nome'"],
      ["PRATICHE", "Foglio opzionale"],
      ["PRATICHE_SAL", "Foglio opzionale"],
      ["VSE", "Foglio opzionale"],
      ["MAP", "Foglio opzionale"],
    ]),
    "README"
  );

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="template_import.xlsx"',
      "Cache-Control": "no-store",
    },
  });
}