import Link from "next/link";
import { redirect, notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function toDecimalOrNull(v: FormDataEntryValue | null) {
  const s = String(v ?? "").trim().replace(",", ".");
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return n;
}

export default async function NewPracticePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { err?: string };
}) {
  const { prisma } = await import("@/lib/prisma");
  const client = await prisma.client.findUnique({ where: { id: params.id } });
  if (!client) return notFound();

  async function createPractice(formData: FormData) {
    "use server";

    const { prisma } = await import("@/lib/prisma");

    const clientId = params.id;

    const title = String(formData.get("title") ?? "").trim();
    const practiceDateRaw = String(formData.get("practiceDate") ?? "").trim();
    const determinaNumber = String(formData.get("determinaNumber") ?? "").trim() || null;
    const inApertureList = String(formData.get("inApertureList") ?? "").trim() === "on";
    const apertureStatus = String(formData.get("apertureStatus") ?? "IN_ATTESA")
      .trim()
      .toUpperCase();
    const startYearRaw = String(formData.get("startYear") ?? "").trim();
    const amountEur = toDecimalOrNull(formData.get("amountEur"));
    const fatturata = String(formData.get("fatturata") ?? "").trim() === "on";
    const notes = String(formData.get("notes") ?? "").trim() || null;

    const createDefaultSal = String(formData.get("createDefaultSal") ?? "").trim() === "on";

    const sal1Label = String(formData.get("sal1Label") ?? "").trim();
    const sal1Type = String(formData.get("sal1Type") ?? "ACCETTAZIONE").trim().toUpperCase();
    const sal1TriggerStatus = String(formData.get("sal1TriggerStatus") ?? "ACCETTATO")
      .trim()
      .toUpperCase();
    const sal1AmountEur = toDecimalOrNull(formData.get("sal1AmountEur"));

    const sal2Label = String(formData.get("sal2Label") ?? "").trim();
    const sal2Type = String(formData.get("sal2Type") ?? "PRIMO_ACCONTO").trim().toUpperCase();
    const sal2TriggerStatus = String(formData.get("sal2TriggerStatus") ?? "INIZIO_LAVORI")
      .trim()
      .toUpperCase();
    const sal2AmountEur = toDecimalOrNull(formData.get("sal2AmountEur"));

    const sal3Label = String(formData.get("sal3Label") ?? "").trim();
    const sal3Type = String(formData.get("sal3Type") ?? "SECONDO_ACCONTO").trim().toUpperCase();
    const sal3TriggerStatus = String(formData.get("sal3TriggerStatus") ?? "ISPEZIONE_ASL")
      .trim()
      .toUpperCase();
    const sal3AmountEur = toDecimalOrNull(formData.get("sal3AmountEur"));

    const sal4Label = String(formData.get("sal4Label") ?? "").trim();
    const sal4Type = String(formData.get("sal4Type") ?? "SALDO").trim().toUpperCase();
    const sal4TriggerStatus = String(formData.get("sal4TriggerStatus") ?? "CONCLUSO")
      .trim()
      .toUpperCase();
    const sal4AmountEur = toDecimalOrNull(formData.get("sal4AmountEur"));

    if (!title) {
      redirect(`/clients/${clientId}/practices/new?err=1`);
    }

    const startYear =
      startYearRaw && Number.isFinite(Number(startYearRaw)) ? Number(startYearRaw) : null;

    if (startYearRaw && !Number.isInteger(startYear)) {
      redirect(`/clients/${clientId}/practices/new?err=1`);
    }

    const created = await prisma.clientPractice.create({
      data: {
        clientId,
        title,
        practiceDate: practiceDateRaw ? new Date(`${practiceDateRaw}T12:00:00`) : null,
        determinaNumber,
        inApertureList,
        apertureStatus: apertureStatus || "IN_ATTESA",
        startYear,
        amountEur,
        fatturata,
        fatturataAt: fatturata ? new Date() : null,
        notes,
      },
    });

    const defaultRows = [
      {
        sortOrder: 1,
        label: sal1Label || "Accettazione",
        billingType: sal1Type || "ACCETTAZIONE",
        triggerStatus: sal1TriggerStatus || "ACCETTATO",
        amountEur: sal1AmountEur ?? 0,
      },
      {
        sortOrder: 2,
        label: sal2Label || "Primo acconto",
        billingType: sal2Type || "PRIMO_ACCONTO",
        triggerStatus: sal2TriggerStatus || "INIZIO_LAVORI",
        amountEur: sal2AmountEur ?? 0,
      },
      {
        sortOrder: 3,
        label: sal3Label || "Secondo acconto",
        billingType: sal3Type || "SECONDO_ACCONTO",
        triggerStatus: sal3TriggerStatus || "ISPEZIONE_ASL",
        amountEur: sal3AmountEur ?? 0,
      },
      {
        sortOrder: 4,
        label: sal4Label || "Saldo",
        billingType: sal4Type || "SALDO",
        triggerStatus: sal4TriggerStatus || "CONCLUSO",
        amountEur: sal4AmountEur ?? 0,
      },
    ];

    if (createDefaultSal) {
      const rowsToCreate = defaultRows.filter((row) => row.label || (row.amountEur ?? 0) > 0);

      for (const row of rowsToCreate) {
        let billingStatus = "DA_FATTURARE";

        if (row.triggerStatus && row.triggerStatus === (apertureStatus || "IN_ATTESA")) {
          billingStatus = "FATTURA_DA_INVIARE";
        }

        if (fatturata) {
          billingStatus = "FATTURATA";
        }

        await prisma.practiceBillingStep.create({
          data: {
            practiceId: created.id,
            sortOrder: row.sortOrder,
            label: row.label,
            billingType: row.billingType,
            triggerStatus: row.triggerStatus,
            amountEur: row.amountEur ?? 0,
            billingStatus,
            invoiceDate: fatturata ? new Date() : null,
          },
        });
      }
    }

    redirect(`/clients/${clientId}/practices/${created.id}`);
  }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Nuova pratica</h1>

        <div className="row" style={{ gap: 8 }}>
          <Link className="btn" href={`/clients/${params.id}`}>
            ← Torna al cliente
          </Link>
          <Link className="btn" href={`/clients/${params.id}/practices/new`}>
            Reset
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        Cliente: <b>{client.name}</b>
      </div>

      {searchParams?.err ? (
        <div
          className="card"
          style={{
            marginTop: 12,
            border: "1px solid rgba(239,68,68,0.28)",
            background: "rgba(239,68,68,0.08)",
            color: "#991b1b",
          }}
        >
          Errore salvataggio pratica.
        </div>
      ) : null}

      <form action={createPractice} className="card" style={{ marginTop: 12 }}>
        <div>
          <label>Pratica *</label>
          <input
            className="input"
            name="title"
            placeholder='Es: "Invio Regione Lazio" / "Comunicazione ASL" ...'
            required
          />
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <label>Data</label>
            <input className="input" type="date" name="practiceDate" />
          </div>

          <div>
            <label>Determina n°</label>
            <input className="input" name="determinaNumber" placeholder="Es: 123/2026" />
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <label>Anno</label>
            <input className="input" type="number" name="startYear" placeholder="Es: 2026" />
          </div>

          <div>
            <label>Stato pratica</label>
            <select className="input" name="apertureStatus" defaultValue="IN_ATTESA">
              <option value="IN_ATTESA">In attesa</option>
              <option value="INVIATA_REGIONE">Inviata Regione</option>
              <option value="INIZIO_LAVORI">Inizio lavori</option>
              <option value="ACCETTATO">Accettato</option>
              <option value="ISPEZIONE_ASL">Ispezione ASL</option>
              <option value="CONCLUSO">Concluso</option>
            </select>
          </div>
        </div>

        <div className="grid2" style={{ marginTop: 12 }}>
          <div>
            <label>Importo €</label>
            <input
              className="input"
              type="number"
              step="0.01"
              min="0"
              name="amountEur"
              placeholder="Es: 450"
            />
          </div>

          <div
            className="card"
            style={{ padding: 12, border: "1px solid rgba(34,197,94,0.20)" }}
          >
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <input type="checkbox" name="fatturata" />
              <span>
                <b>Già fatturata</b>
              </span>
            </label>

            <div className="muted" style={{ marginTop: 8 }}>
              Se attivo, la pratica risulta già nel fatturato reale.
            </div>
          </div>
        </div>

        <div
          className="card"
          style={{ marginTop: 12, padding: 12, border: "1px solid rgba(59,130,246,0.22)" }}
        >
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <input type="checkbox" name="inApertureList" />
            <span>
              <b>Aggiungi in lista Aperture</b>
            </span>
          </label>

          <div className="muted" style={{ marginTop: 8 }}>
            Se attivo, questa pratica comparirà nella nuova sezione <b>Aperture</b> in sidebar.
          </div>
        </div>

        <div
          className="card"
          style={{ marginTop: 12, padding: 12, border: "1px solid rgba(168,85,247,0.22)" }}
        >
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <input type="checkbox" name="createDefaultSal" defaultChecked />
            <span>
              <b>Crea piano SAL base</b>
            </span>
          </label>

          <div className="muted" style={{ marginTop: 8 }}>
            Crea automaticamente le righe SAL amministrative collegate agli stati pratica.
          </div>

          <div className="grid2" style={{ marginTop: 12 }}>
            <div>
              <label>Voce 1</label>
              <input className="input" name="sal1Label" defaultValue="Accettazione" />
            </div>
            <div>
              <label>Importo 1 €</label>
              <input className="input" type="number" step="0.01" min="0" name="sal1AmountEur" />
            </div>
          </div>

          <div className="grid2" style={{ marginTop: 12 }}>
            <div>
              <label>Tipo 1</label>
              <select className="input" name="sal1Type" defaultValue="ACCETTAZIONE">
                <option value="ACCETTAZIONE">Accettazione</option>
                <option value="PRIMO_ACCONTO">Primo acconto</option>
                <option value="SECONDO_ACCONTO">Secondo acconto</option>
                <option value="SALDO">Saldo</option>
                <option value="ALTRO">Altro</option>
              </select>
            </div>
            <div>
              <label>Trigger 1</label>
              <select className="input" name="sal1TriggerStatus" defaultValue="ACCETTATO">
                <option value="IN_ATTESA">In attesa</option>
                <option value="INVIATA_REGIONE">Inviata Regione</option>
                <option value="INIZIO_LAVORI">Inizio lavori</option>
                <option value="ACCETTATO">Accettato</option>
                <option value="ISPEZIONE_ASL">Ispezione ASL</option>
                <option value="CONCLUSO">Concluso</option>
              </select>
            </div>
          </div>

          <div className="grid2" style={{ marginTop: 12 }}>
            <div>
              <label>Voce 2</label>
              <input className="input" name="sal2Label" defaultValue="Primo acconto" />
            </div>
            <div>
              <label>Importo 2 €</label>
              <input className="input" type="number" step="0.01" min="0" name="sal2AmountEur" />
            </div>
          </div>

          <div className="grid2" style={{ marginTop: 12 }}>
            <div>
              <label>Tipo 2</label>
              <select className="input" name="sal2Type" defaultValue="PRIMO_ACCONTO">
                <option value="ACCETTAZIONE">Accettazione</option>
                <option value="PRIMO_ACCONTO">Primo acconto</option>
                <option value="SECONDO_ACCONTO">Secondo acconto</option>
                <option value="SALDO">Saldo</option>
                <option value="ALTRO">Altro</option>
              </select>
            </div>
            <div>
              <label>Trigger 2</label>
              <select className="input" name="sal2TriggerStatus" defaultValue="INIZIO_LAVORI">
                <option value="IN_ATTESA">In attesa</option>
                <option value="INVIATA_REGIONE">Inviata Regione</option>
                <option value="INIZIO_LAVORI">Inizio lavori</option>
                <option value="ACCETTATO">Accettato</option>
                <option value="ISPEZIONE_ASL">Ispezione ASL</option>
                <option value="CONCLUSO">Concluso</option>
              </select>
            </div>
          </div>

          <div className="grid2" style={{ marginTop: 12 }}>
            <div>
              <label>Voce 3</label>
              <input className="input" name="sal3Label" defaultValue="Secondo acconto" />
            </div>
            <div>
              <label>Importo 3 €</label>
              <input className="input" type="number" step="0.01" min="0" name="sal3AmountEur" />
            </div>
          </div>

          <div className="grid2" style={{ marginTop: 12 }}>
            <div>
              <label>Tipo 3</label>
              <select className="input" name="sal3Type" defaultValue="SECONDO_ACCONTO">
                <option value="ACCETTAZIONE">Accettazione</option>
                <option value="PRIMO_ACCONTO">Primo acconto</option>
                <option value="SECONDO_ACCONTO">Secondo acconto</option>
                <option value="SALDO">Saldo</option>
                <option value="ALTRO">Altro</option>
              </select>
            </div>
            <div>
              <label>Trigger 3</label>
              <select className="input" name="sal3TriggerStatus" defaultValue="ISPEZIONE_ASL">
                <option value="IN_ATTESA">In attesa</option>
                <option value="INVIATA_REGIONE">Inviata Regione</option>
                <option value="INIZIO_LAVORI">Inizio lavori</option>
                <option value="ACCETTATO">Accettato</option>
                <option value="ISPEZIONE_ASL">Ispezione ASL</option>
                <option value="CONCLUSO">Concluso</option>
              </select>
            </div>
          </div>

          <div className="grid2" style={{ marginTop: 12 }}>
            <div>
              <label>Voce 4</label>
              <input className="input" name="sal4Label" defaultValue="Saldo" />
            </div>
            <div>
              <label>Importo 4 €</label>
              <input className="input" type="number" step="0.01" min="0" name="sal4AmountEur" />
            </div>
          </div>

          <div className="grid2" style={{ marginTop: 12 }}>
            <div>
              <label>Tipo 4</label>
              <select className="input" name="sal4Type" defaultValue="SALDO">
                <option value="ACCETTAZIONE">Accettazione</option>
                <option value="PRIMO_ACCONTO">Primo acconto</option>
                <option value="SECONDO_ACCONTO">Secondo acconto</option>
                <option value="SALDO">Saldo</option>
                <option value="ALTRO">Altro</option>
              </select>
            </div>
            <div>
              <label>Trigger 4</label>
              <select className="input" name="sal4TriggerStatus" defaultValue="CONCLUSO">
                <option value="IN_ATTESA">In attesa</option>
                <option value="INVIATA_REGIONE">Inviata Regione</option>
                <option value="INIZIO_LAVORI">Inizio lavori</option>
                <option value="ACCETTATO">Accettato</option>
                <option value="ISPEZIONE_ASL">Ispezione ASL</option>
                <option value="CONCLUSO">Concluso</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Note</label>
          <textarea
            className="input"
            name="notes"
            rows={4}
            placeholder="Note (facoltative)"
          />
        </div>

        <div className="row" style={{ marginTop: 14, gap: 8 }}>
          <button className="btn primary" type="submit">
            Salva
          </button>

          <Link className="btn" href={`/clients/${params.id}`}>
            Annulla
          </Link>
        </div>
      </form>
    </div>
  );
}