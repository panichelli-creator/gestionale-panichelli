-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ClinicalEngineeringCheck" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT,
    "nomeClienteSnapshot" TEXT,
    "indirizzoSedeSnapshot" TEXT,
    "studioRifAmministrativo" TEXT,
    "contattiMail" TEXT,
    "contattiCellulare" TEXT,
    "numApparecchiature" INTEGER NOT NULL DEFAULT 0,
    "apparecchiatureAggiuntive" INTEGER NOT NULL DEFAULT 0,
    "costoServizio" DECIMAL NOT NULL DEFAULT 0,
    "quotaTecnicoPerc" DECIMAL NOT NULL DEFAULT 40,
    "quotaTecnico" DECIMAL NOT NULL DEFAULT 0,
    "importoTrasferta" DECIMAL NOT NULL DEFAULT 0,
    "dataUltimoAppuntamento" DATETIME,
    "dataProssimoAppuntamento" DATETIME,
    "verificheEseguite" BOOLEAN NOT NULL DEFAULT false,
    "fileSuDropbox" BOOLEAN NOT NULL DEFAULT false,
    "fatturata" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ClinicalEngineeringCheck_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ClinicalEngineeringCheck" ("apparecchiatureAggiuntive", "clientId", "costoServizio", "createdAt", "dataProssimoAppuntamento", "fatturata", "fileSuDropbox", "id", "importoTrasferta", "nomeClienteSnapshot", "numApparecchiature", "quotaTecnico", "updatedAt", "verificheEseguite") SELECT "apparecchiatureAggiuntive", "clientId", "costoServizio", "createdAt", "dataProssimoAppuntamento", "fatturata", "fileSuDropbox", "id", "importoTrasferta", "nomeClienteSnapshot", "numApparecchiature", "quotaTecnico", "updatedAt", "verificheEseguite" FROM "ClinicalEngineeringCheck";
DROP TABLE "ClinicalEngineeringCheck";
ALTER TABLE "new_ClinicalEngineeringCheck" RENAME TO "ClinicalEngineeringCheck";
CREATE INDEX "ClinicalEngineeringCheck_clientId_idx" ON "ClinicalEngineeringCheck"("clientId");
CREATE INDEX "ClinicalEngineeringCheck_dataProssimoAppuntamento_idx" ON "ClinicalEngineeringCheck"("dataProssimoAppuntamento");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
