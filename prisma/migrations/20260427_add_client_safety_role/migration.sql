CREATE TABLE IF NOT EXISTS "ClientSafetyRole" (
  "id" TEXT NOT NULL,
  "clientId" TEXT NOT NULL,
  "personId" TEXT,
  "role" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "appointedAt" TIMESTAMP(3),
  "dueDate" TIMESTAMP(3),
  "alertMonths" INTEGER NOT NULL DEFAULT 2,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientSafetyRole_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ClientSafetyRole_clientId_idx" ON "ClientSafetyRole"("clientId");
CREATE INDEX IF NOT EXISTS "ClientSafetyRole_personId_idx" ON "ClientSafetyRole"("personId");
CREATE INDEX IF NOT EXISTS "ClientSafetyRole_role_idx" ON "ClientSafetyRole"("role");
CREATE INDEX IF NOT EXISTS "ClientSafetyRole_dueDate_idx" ON "ClientSafetyRole"("dueDate");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ClientSafetyRole_clientId_fkey'
  ) THEN
    ALTER TABLE "ClientSafetyRole"
    ADD CONSTRAINT "ClientSafetyRole_clientId_fkey"
    FOREIGN KEY ("clientId") REFERENCES "Client"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ClientSafetyRole_personId_fkey'
  ) THEN
    ALTER TABLE "ClientSafetyRole"
    ADD CONSTRAINT "ClientSafetyRole_personId_fkey"
    FOREIGN KEY ("personId") REFERENCES "Person"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;