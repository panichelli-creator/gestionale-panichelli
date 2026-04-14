import "./globals.css";
import { getSession } from "@/lib/session";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  getSession();

  return (
    <html lang="it">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}