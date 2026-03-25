-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'ALTRO',
    "status" TEXT NOT NULL DEFAULT 'ATTIVO',
    "dismissedAt" DATETIME,
    "vatNumber" TEXT,
    "uniqueCode" TEXT,
    "pec" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "legalSeat" TEXT,
    "operativeSeat" TEXT,
    "employeesCount" INTEGER,
    "notes" TEXT,
    "occupationalDoctorName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ClientContact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ALTRO',
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ClientContact_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClientSite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "province" TEXT,
    "cap" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ClientSite_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ServiceCatalog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "ClientService" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "siteId" TEXT,
    "rxEndoralCount" INTEGER,
    "rxOptCount" INTEGER,
    "dueDate" DATETIME,
    "lastDoneAt" DATETIME,
    "priceEur" DECIMAL,
    "periodicity" TEXT NOT NULL DEFAULT 'ANNUALE',
    "priority" TEXT NOT NULL DEFAULT 'MEDIA',
    "status" TEXT NOT NULL DEFAULT 'DA_FARE',
    "alertMonths" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ClientService_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "ClientSite" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ClientService_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClientService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "ServiceCatalog" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClinicalEngineeringCheck" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT,
    "nomeClienteSnapshot" TEXT,
    "numApparecchiature" INTEGER NOT NULL DEFAULT 0,
    "apparecchiatureAggiuntive" INTEGER NOT NULL DEFAULT 0,
    "costoServizio" DECIMAL NOT NULL DEFAULT 0,
    "quotaTecnico" DECIMAL NOT NULL DEFAULT 0,
    "importoTrasferta" DECIMAL NOT NULL DEFAULT 0,
    "dataProssimoAppuntamento" DATETIME,
    "verificheEseguite" BOOLEAN NOT NULL DEFAULT false,
    "fileSuDropbox" BOOLEAN NOT NULL DEFAULT false,
    "fatturata" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ClinicalEngineeringCheck_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fiscalCode" TEXT,
    "lastName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "role" TEXT,
    "hireDate" DATETIME,
    "medicalCheckDone" BOOLEAN NOT NULL DEFAULT false,
    "clientId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Person_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PersonClient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "personId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PersonClient_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PersonClient_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PersonSite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "personId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PersonSite_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PersonSite_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "ClientSite" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CourseCatalog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "defaultPriceEur" DECIMAL,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "TrainingRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "personId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "performedAt" DATETIME,
    "dueDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'DA_FARE',
    "priority" TEXT NOT NULL DEFAULT 'MEDIA',
    "priceEur" DECIMAL,
    "alertMonths" INTEGER NOT NULL DEFAULT 2,
    "alertMonths2" INTEGER NOT NULL DEFAULT 3,
    "certificateDelivered" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TrainingRecord_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TrainingRecord_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "CourseCatalog" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClientPractice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "practiceDate" DATETIME,
    "determinaNumber" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ClientPractice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ym" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "serviceId" TEXT,
    "siteId" TEXT,
    "amountEur" DECIMAL,
    "workedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WorkReport_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "ClientSite" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "WorkReport_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WorkReport_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "ServiceCatalog" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_name_key" ON "Client"("name");

-- CreateIndex
CREATE INDEX "ClientContact_clientId_idx" ON "ClientContact"("clientId");

-- CreateIndex
CREATE INDEX "ClientSite_clientId_idx" ON "ClientSite"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientSite_clientId_name_key" ON "ClientSite"("clientId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCatalog_name_key" ON "ServiceCatalog"("name");

-- CreateIndex
CREATE INDEX "ClientService_clientId_idx" ON "ClientService"("clientId");

-- CreateIndex
CREATE INDEX "ClientService_siteId_idx" ON "ClientService"("siteId");

-- CreateIndex
CREATE INDEX "ClientService_dueDate_idx" ON "ClientService"("dueDate");

-- CreateIndex
CREATE INDEX "ClinicalEngineeringCheck_clientId_idx" ON "ClinicalEngineeringCheck"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Person_fiscalCode_key" ON "Person"("fiscalCode");

-- CreateIndex
CREATE INDEX "Person_lastName_firstName_idx" ON "Person"("lastName", "firstName");

-- CreateIndex
CREATE INDEX "PersonClient_personId_idx" ON "PersonClient"("personId");

-- CreateIndex
CREATE INDEX "PersonClient_clientId_idx" ON "PersonClient"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonClient_personId_clientId_key" ON "PersonClient"("personId", "clientId");

-- CreateIndex
CREATE INDEX "PersonSite_personId_idx" ON "PersonSite"("personId");

-- CreateIndex
CREATE INDEX "PersonSite_siteId_idx" ON "PersonSite"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonSite_personId_siteId_key" ON "PersonSite"("personId", "siteId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseCatalog_name_key" ON "CourseCatalog"("name");

-- CreateIndex
CREATE INDEX "TrainingRecord_dueDate_idx" ON "TrainingRecord"("dueDate");

-- CreateIndex
CREATE INDEX "TrainingRecord_personId_idx" ON "TrainingRecord"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingRecord_personId_courseId_key" ON "TrainingRecord"("personId", "courseId");

-- CreateIndex
CREATE INDEX "ClientPractice_clientId_idx" ON "ClientPractice"("clientId");

-- CreateIndex
CREATE INDEX "ClientPractice_practiceDate_idx" ON "ClientPractice"("practiceDate");

-- CreateIndex
CREATE INDEX "WorkReport_ym_idx" ON "WorkReport"("ym");

-- CreateIndex
CREATE INDEX "WorkReport_clientId_idx" ON "WorkReport"("clientId");

-- CreateIndex
CREATE INDEX "WorkReport_serviceId_idx" ON "WorkReport"("serviceId");

-- CreateIndex
CREATE INDEX "WorkReport_siteId_idx" ON "WorkReport"("siteId");

-- CreateIndex
CREATE INDEX "WorkReport_workedAt_idx" ON "WorkReport"("workedAt");
