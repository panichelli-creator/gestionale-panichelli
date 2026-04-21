import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const XLSX = await import("xlsx");

  function autoSizeColumns(ws: any, rows: any[][]) {
    const widths = rows[0].map((_, colIndex) => {
      let max = 10;

      for (const row of rows) {
        const value = row[colIndex];
        const len = String(value ?? "").length;
        if (len > max) max = len;
      }

      return { wch: Math.min(max + 2, 40) };
    });

    ws["!cols"] = widths;
    return ws;
  }

  function makeSheet(rows: any[][]) {
    const ws = XLSX.utils.aoa_to_sheet(rows);
    return autoSizeColumns(ws, rows);
  }

  const wb = XLSX.utils.book_new();

  const clientiRows = [
    [
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
    ],
    [
      "CLI001",
      "Studio Rossi SRL",
      "STUDIO_ODONTOIATRICO",
      "ATTIVO",
      "info@studiorossi.it",
      "0551234567",
      "studiorossi@pec.it",
      "01234567890",
      "ABC1234",
      "Via Roma 1, Firenze",
      "Via Milano 10, Firenze",
      "Via Milano 10, Firenze",
      8,
      "Dr. Bianchi",
      "Cliente esempio",
    ],
  ];

  const sediRows = [
    [
      "CODICE_IMPORT",
      "ClienteCodice",
      "ClienteNome",
      "NomeSede",
      "Indirizzo",
      "Città",
      "Provincia",
      "CAP",
      "Note",
    ],
    [
      "SED001",
      "CLI001",
      "Studio Rossi SRL",
      "Sede Centrale",
      "Via Milano 10",
      "Firenze",
      "FI",
      "50100",
      "Sede principale",
    ],
  ];

  const contattiRows = [
    [
      "CODICE_IMPORT",
      "ClienteCodice",
      "ClienteNome",
      "Nome",
      "Ruolo",
      "Email",
      "Telefono",
      "ListeMarketing",
      "Note",
    ],
    [
      "CON001",
      "CLI001",
      "Studio Rossi SRL",
      "Mario Rossi",
      "REFERENTE",
      "mario.rossi@studiorossi.it",
      "3331234567",
      "CLIENTI|NEWSLETTER",
      "Contatto principale",
    ],
  ];

  const personeRows = [
    [
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
    ],
    [
      "PER001",
      "CLI001",
      "Studio Rossi SRL",
      "Verdi",
      "Luigi",
      "luigi.verdi@email.it",
      "3391234567",
      "Assistente",
      "VRDLGU90A01H501X",
      "2024-01-15",
      "SI",
      "NO",
      "",
      "",
      "Sede Centrale",
      "",
      "",
      "Persona esempio",
    ],
  ];

  const serviziRows = [
    [
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
    ],
    [
      "SER001",
      "CLI001",
      "Studio Rossi SRL",
      "Sede Centrale",
      "Manutenzione RX",
      "ANNUALE",
      350,
      "2026-12-31",
      "DA_FARE",
      "Mario Rossi",
      10,
      2,
      1,
      "Servizio esempio",
    ],
  ];

  const formazioneRows = [
    [
      "CODICE_IMPORT",
      "ClienteCodice",
      "ClienteNome",
      "Persona",
      "Corso",
      "DataUltima",
      "DataScadenza",
      "Stato",
      "Note",
    ],
    [
      "FOR001",
      "CLI001",
      "Studio Rossi SRL",
      "Verdi Luigi",
      "BLSD",
      "2025-02-10",
      "2027-02-10",
      "DA_FARE",
      "Formazione esempio",
    ],
  ];

  const praticheRows = [
    [
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
    ],
    [
      "PRA001",
      "Studio Rossi SRL",
      "Apertura nuovo ambulatorio",
      "2026-01-20",
      "DET-45",
      "IN_ATTESA",
      2026,
      "SI",
      "NO",
      "Pratica esempio",
    ],
  ];

  const praticheSalRows = [
    [
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
    ],
    [
      "SAL001",
      "Studio Rossi SRL",
      "Apertura nuovo ambulatorio",
      1,
      "Acconto iniziale",
      "ACCONTO",
      "IN_ATTESA",
      500,
      "DA_FATTURARE",
      "",
      "",
      "",
      "SAL esempio",
    ],
  ];

  const vseRows = [
    [
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
    ],
    [
      "VSE001",
      "Studio Rossi SRL",
      "Sede Centrale",
      "Mario Rossi",
      "ANNUALE",
      "2026-06-15",
      "2025-06-10",
      "NO",
      "NO",
      "NO",
      "NO",
      "Verifica esempio",
    ],
  ];

  const mapRows = [
    [
      "CODICE_IMPORT",
      "ClienteNome",
      "Sede",
      "Servizio",
      "Mese",
      "DataPianificata",
      "Stato",
      "Note",
    ],
    [
      "MAP001",
      "Studio Rossi SRL",
      "Sede Centrale",
      "Manutenzione RX",
      "2026-06",
      "2026-06-15",
      "APPUNTAMENTO_PRESO",
      "Pianificazione esempio",
    ],
  ];

  const readmeRows = [
    ["FOGLIO", "NOTE"],
    ["CLIENTI", "Compilare almeno Nome. Date formato YYYY-MM-DD."],
    ["SEDI", "Usare preferibilmente ClienteCodice; in alternativa ClienteNome."],
    ["CONTATTI", "ListeMarketing separate da |. Foglio opzionale."],
    ["PERSONE", "Per l'import attuale sono fondamentali almeno Cognome e Nome. Cliente facoltativo."],
    ["SERVIZI", "Foglio previsto per import futuri. Periodicità: ANNUALE, SEMESTRALE, BIENNALE."],
    ["FORMAZIONE", "Meglio un solo foglio unico, una riga per ogni corso/persona."],
    ["PRATICHE", "Foglio opzionale per sviluppi successivi."],
    ["PRATICHE_SAL", "Foglio opzionale per sviluppi successivi."],
    ["VSE", "Foglio opzionale per sviluppi successivi."],
    ["MAP", "Foglio opzionale per sviluppi successivi."],
    ["IMPORT ATTUALE", "Al momento il gestionale importa sicuramente solo CLIENTI, SEDI, PERSONE."],
    ["REGOLE", "Non cambiare nomi fogli, non cambiare intestazioni, non aggiungere colonne."],
  ];

  XLSX.utils.book_append_sheet(wb, makeSheet(clientiRows), "CLIENTI");
  XLSX.utils.book_append_sheet(wb, makeSheet(sediRows), "SEDI");
  XLSX.utils.book_append_sheet(wb, makeSheet(contattiRows), "CONTATTI");
  XLSX.utils.book_append_sheet(wb, makeSheet(personeRows), "PERSONE");
  XLSX.utils.book_append_sheet(wb, makeSheet(serviziRows), "SERVIZI");
  XLSX.utils.book_append_sheet(wb, makeSheet(formazioneRows), "FORMAZIONE");
  XLSX.utils.book_append_sheet(wb, makeSheet(praticheRows), "PRATICHE");
  XLSX.utils.book_append_sheet(wb, makeSheet(praticheSalRows), "PRATICHE_SAL");
  XLSX.utils.book_append_sheet(wb, makeSheet(vseRows), "VSE");
  XLSX.utils.book_append_sheet(wb, makeSheet(mapRows), "MAP");
  XLSX.utils.book_append_sheet(wb, makeSheet(readmeRows), "README");

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