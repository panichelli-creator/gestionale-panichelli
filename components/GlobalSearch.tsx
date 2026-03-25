"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

type R = { label: string; type: string; url: string };

export default function GlobalSearch({ dark }: { dark: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<R[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (query.trim().length < 2) {
      setResults([]);
      setErr(null);
      return;
    }

    const t = setTimeout(async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await fetch(`/api/global-search?q=${encodeURIComponent(query)}`, {
          cache: "no-store",
        });

        const text = await res.text();
        let data: any = null;
        try {
          data = JSON.parse(text);
        } catch {
          data = null;
        }

        if (!res.ok) {
          setResults([]);
          setErr((data?.error as string) ?? `Errore ricerca (${res.status})`);
          return;
        }

        setResults((data?.results as R[]) ?? []);
      } catch (e: any) {
        setResults([]);
        setErr("Errore rete / server");
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(t);
  }, [query, open]);

  if (!open) {
    return (
      <div
        onClick={() => setOpen(true)}
        style={{
          background: dark ? "#0B1220" : "#F3F4F6",
          border: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(0,0,0,0.08)",
          padding: "8px 12px",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          userSelect: "none",
          color: dark ? "#FFFFFF" : "#0F172A",
        }}
        title="Cerca (Ctrl+K)"
      >
        <Search size={16} />
        <span style={{ opacity: 0.85, fontSize: 13 }}>
          Cerca… <span style={{ opacity: 0.65 }}>(Ctrl+K)</span>
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        justifyContent: "center",
        paddingTop: 100,
        zIndex: 9999,
      }}
      onMouseDown={() => setOpen(false)}
    >
      <div
        style={{
          width: 680,
          maxWidth: "calc(100vw - 24px)",
          background: dark ? "#0F172A" : "white",
          borderRadius: 18,
          padding: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          border: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(0,0,0,0.08)",
          color: dark ? "#FFFFFF" : "#0F172A",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Search size={18} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca clienti o persone…"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 15,
              background: "transparent",
              color: dark ? "#FFFFFF" : "#0F172A",
            }}
          />
          <button
            onClick={() => setOpen(false)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: dark ? "#FFFFFF" : "#0F172A",
              opacity: 0.9,
            }}
            title="Chiudi"
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          {loading && <div style={{ opacity: 0.8, fontSize: 13 }}>Ricerca…</div>}
          {err && <div style={{ opacity: 0.95, fontSize: 13, color: "#DC2626" }}>{err}</div>}

          {!loading && !err && results.length === 0 && query.trim().length >= 2 && (
            <div style={{ opacity: 0.8, fontSize: 13 }}>Nessun risultato</div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
            {results.map((r, i) => (
              <div
                key={i}
                onClick={() => {
                  router.push(r.url);
                  setOpen(false);
                }}
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  cursor: "pointer",
                  background: dark ? "#1D4ED8" : "#DBEAFE",
                  border: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(59,130,246,0.22)",
                  color: dark ? "#FFFFFF" : "#0F172A",
                }}
              >
                <div style={{ fontWeight: 800, color: dark ? "#FFFFFF" : "#0F172A" }}>
                  {r.label}
                </div>
                <div style={{ fontSize: 12, color: dark ? "rgba(255,255,255,0.88)" : "rgba(15,23,42,0.78)" }}>
                  {r.type}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 12, opacity: 0.7, fontSize: 12 }}>
          Suggerimento: Esc per chiudere
        </div>
      </div>
    </div>
  );
}