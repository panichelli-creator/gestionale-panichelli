# Modulo: Ingegneria Clinica (CRUD + Allegati + Export CSV)

## 1) Prisma (schema.prisma)

Aggiungi questi modelli/relazioni al tuo `schema.prisma`.

> Nota: uso `allegatiJson` come `String` (JSON serializzato) per restare 100% SQLite-friendly.

```prisma
model ClinicalEngineeringCheck {
  id String @id @default(cuid())

  // collegamenti al gestionale (opzionali)
  clientId     String?
  clientSiteId String?

  client     Client?     @relation(fields: [clientId], references: [id], onDelete: SetNull)
  clientSite ClientSite? @relation(fields: [clientSiteId], references: [id], onDelete: SetNull)

  // snapshot (così, anche se rinomini cliente/sede, la riga resta leggibile)
  nomeClienteSnapshot      String
  indirizzoSedeSnapshot    String?

  numApparecchiature       Int     @default(0)
  apparecchiatureAggiuntive Int    @default(0)

  costoServizio            Float   @default(0)
  quotaTecnico             Float   @default(0)
  importoTrasferta         Float   @default(0)

  dataUltimoAppuntamento   DateTime?
  dataProssimoAppuntamento DateTime

  contattiStudio           String?
  contattiMail             String?
  contattiCellulare        String?

  verificheEseguite        Boolean @default(false)
  fileSuDropbox            Boolean @default(false)
  fatturata                Boolean @default(false)

  notes                    String?

  // JSON serializzato: [{name,url,size,type,uploadedAt}, ...]
  allegatiJson             String  @default("[]")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([clientId])
  @@index([clientSiteId])
  @@index([dataProssimoAppuntamento])
}

// Nel model Client aggiungi:
// clinicalEngineeringChecks ClinicalEngineeringCheck[]

// Nel model ClientSite aggiungi (se esiste nel tuo schema):
// clinicalEngineeringChecks ClinicalEngineeringCheck[]
```

Poi esegui:

```bash
npx prisma migrate dev --name add_clinical_engineering
```

---

## 2) File da copiare nel gestionale

Copia queste cartelle dentro il tuo progetto Next.js:

- `app/ingegneria-clinica/**`
- `app/api/ingegneria-clinica/export/route.ts`
- `app/actions/clinicalEngineering.ts`
- `components/ingegneria-clinica/CheckForm.tsx`

---

## 3) Sidebar

Aggiungi una voce in sidebar (o menu) con:

- **Label:** `Ingegneria Clinica`
- **Href:** `/ingegneria-clinica`

---

## 4) Allegati

Gli allegati vengono salvati in:

`public/uploads/ingegneria-clinica/<ID>/<file>`

e referenziati in `allegatiJson`.

---

## 5) Export CSV

Pulsante già presente nella pagina lista.
Endpoint:

`/api/ingegneria-clinica/export?due=YYYY-MM&q=...&fatturata=TUTTE|0|1`

CSV con separatore `;` e BOM (compatibile Excel).
