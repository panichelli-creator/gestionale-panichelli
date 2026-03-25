import "./globals.css";
import { getSession } from "@/lib/session";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // teniamo la sessione qui se ti serve in futuro,
  // ma per ora NON renderizziamo la topbar globale
  getSession();

  return (
    <html lang="it">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}