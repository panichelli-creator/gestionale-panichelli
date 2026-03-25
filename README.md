# Panichelli HSC – Gestionale (MVP)

Web app + PWA (installabile su PC/tablet/smartphone) con:
- Anagrafica clienti (tabella stile Excel)
- Scheda cliente (dati + medico del lavoro + mantenimenti)
- Formazione (persone, corsi, scadenze) con flag `attestato consegnato`
- Persone con flag `visita medica svolta`
- Scadenziario + alert (30/60/90 giorni)
- Previsionale fatturato (mantenimenti)

## Stack
- Next.js (App Router) + TypeScript
- Prisma ORM
- PostgreSQL (Docker per sviluppo)
- NextAuth (login base)

## Avvio rapido (locale)
1. Installa Node 20+ e Docker Desktop
2. Copia `.env.example` in `.env`
3. Avvia DB:
   ```bash
   docker compose up -d
   ```
4. Installa dipendenze:
   ```bash
   npm install
   ```
5. Crea tabelle:
   ```bash
   npx prisma migrate dev
   ```
6. Importa i tuoi CSV (opzionale):
   ```bash
   npm run import:csv
   ```
7. Avvia:
   ```bash
   npm run dev
   ```
Apri: http://localhost:3000

## Deploy (cloud)
Vedi `GUIDA-DEPLOY.pdf` (in questa cartella zip) per i passi con immagini.
