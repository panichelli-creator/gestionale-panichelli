"use client";

import Link from "next/link";
import GlobalSearch from "@/components/GlobalSearch";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  GraduationCap,
  Wrench,
  FileText,
  Folder,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Bell,
  UserCircle2,
  X,
  Megaphone,
  Database,
  DoorOpen,
  Map,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;
const FONT =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"';

type AppRole = "admin" | "staff" | "ingegnere_clinico";

type NotiRow = {
  id: string;
  dueDate: string | null;
  clientId: string | null;
  clientName: string;
  serviceName: string;
  priceEur: any;
  urlClient: string | null;
};

type NotiPayload = { due7: NotiRow[]; due30: NotiRow[]; error?: string };

type NavLinkRow = {
  href: string;
  label: string;
  icon: any;
  roles: AppRole[];
};

function fmtDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}

function fmtEur(n: any) {
  const v = Number(n ?? 0);
  return `${v.toFixed(2)} €`;
}

function readCookie(name: string) {
  if (typeof document === "undefined") return null;
  const parts = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`));
  return parts ? decodeURIComponent(parts.split("=")[1]) : null;
}

function decodeBase64UrlJson(value: string) {
  try {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4 || 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getRoleFromSessionCookie(): AppRole {
  const token = readCookie("phsc_session");
  if (!token) return "admin";

  const parts = token.split(".");
  if (parts.length !== 2) return "admin";

  const payload = decodeBase64UrlJson(parts[0]);
  const role = String(payload?.role ?? "").toLowerCase();

  if (role === "staff") return "staff";
  if (role === "ingegnere_clinico") return "ingegnere_clinico";
  return "admin";
}

function roleLabel(role: AppRole) {
  if (role === "ingegnere_clinico") return "Ingegnere Clinico";
  if (role === "staff") return "Staff";
  return "Admin";
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const [role, setRole] = useState<AppRole>("admin");

  useEffect(() => {
    const savedTheme = localStorage.getItem("phsc-theme");
    if (savedTheme === "dark") setDark(true);

    const savedCollapsed = localStorage.getItem("phsc-sidebar-collapsed");
    if (savedCollapsed === "1") setCollapsed(true);

    setRole(getRoleFromSessionCookie());
  }, []);

  useEffect(() => {
    localStorage.setItem("phsc-theme", dark ? "dark" : "light");
    document.documentElement.classList.toggle("phsc-dark", dark);
    document.body.classList.toggle("phsc-dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  }, [dark]);

  useEffect(() => {
    localStorage.setItem("phsc-sidebar-collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        background: dark ? "#05070C" : "#EEF2F7",
        color: dark ? "#E5E7EB" : "#0B1220",
        transition: "background 0.2s ease, color 0.2s ease",
        fontFamily: FONT,
      }}
    >
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        dark={dark}
        setDark={setDark}
        role={role}
      />

      <main style={{ flex: 1, width: "100%", padding: 24, maxWidth: "none", margin: 0 }}>
        {children}
      </main>
    </div>
  );
}

function Sidebar({
  collapsed,
  setCollapsed,
  dark,
  setDark,
  role,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  dark: boolean;
  setDark: (v: boolean) => void;
  role: AppRole;
}) {
  const pathname = usePathname();

  const [notiOpen, setNotiOpen] = useState(false);
  const [noti, setNoti] = useState<NotiPayload>({ due7: [], due30: [] });
  const [notiLoading, setNotiLoading] = useState(false);

  useEffect(() => {
    if (!notiOpen || role === "ingegnere_clinico") return;
    setNotiLoading(true);
    fetch("/api/notifications", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setNoti(data))
      .catch(() => setNoti({ due7: [], due30: [], error: "Errore rete" }))
      .finally(() => setNotiLoading(false));
  }, [notiOpen, role]);

  const links = useMemo<NavLinkRow[]>(
    () => [
      {
        href: "/dashboard",
        label: "Fatturato",
        icon: LayoutDashboard,
        roles: ["admin"],
      },
      {
        href: "/clients",
        label: "Clienti",
        icon: Building2,
        roles: ["admin", "staff"],
      },
      {
        href: "/contacts",
        label: "Contatti",
        icon: Users,
        roles: ["admin", "staff"],
      },
      {
        href: "/marketing-lists",
        label: "Marketing",
        icon: Megaphone,
        roles: ["admin", "staff"],
      },
      {
        href: "/people",
        label: "Persone",
        icon: Users,
        roles: ["admin", "staff"],
      },
      {
        href: "/training",
        label: "Formazione",
        icon: GraduationCap,
        roles: ["admin", "staff"],
      },
      {
        href: "/maintenance",
        label: "Mantenimenti",
        icon: Wrench,
        roles: ["admin", "staff"],
      },
      {
        href: "/monthly-work",
        label: "Mensile",
        icon: FileText,
        roles: ["admin", "staff"],
      },
      {
        href: "/work-report",
        label: "Report lavori",
        icon: FileText,
        roles: ["admin", "staff"],
      },
      {
        href: "/ingegneria-clinica",
        label: "Ingegneria Clinica",
        icon: Wrench,
        roles: ["admin", "staff", "ingegnere_clinico"],
      },
      {
        href: "/aperture",
        label: "Aperture",
        icon: DoorOpen,
        roles: ["admin", "staff"],
      },
      {
        href: "/map",
        label: "MAP",
        icon: Map,
        roles: ["admin", "staff"],
      },
      {
        href: "/import-export",
        label: "Import / Export",
        icon: Folder,
        roles: ["admin"],
      },
      {
        href: "/backup",
        label: "Backup",
        icon: Database,
        roles: ["admin"],
      },
      {
        href: "/users",
        label: "Utenti",
        icon: Users,
        roles: ["admin"],
      },
    ],
    []
  );

  const visibleLinks = links.filter((link) => link.roles.includes(role));

  return (
    <>
      <aside
        style={{
          width: collapsed ? 92 : 300,
          background: dark ? "#0A1020" : "#0F172A",
          color: "white",
          padding: collapsed ? 14 : 18,
          display: "flex",
          flexDirection: "column",
          transition: "all 0.2s ease",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          fontFamily: FONT,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            marginBottom: 14,
          }}
        >
          {!collapsed && (
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: 0.8 }}>
                PANICHELLI HSC
              </div>
              <div style={{ fontSize: 12, opacity: 0.65 }}>Control Center</div>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            style={iconBtnStyle()}
            title={collapsed ? "Apri" : "Chiudi"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {!collapsed && role !== "ingegnere_clinico" && (
          <div style={{ marginBottom: 10 }}>
            <GlobalSearch dark={dark} />
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: collapsed ? "center" : "space-between",
            alignItems: "center",
            gap: 10,
            marginBottom: 12,
          }}
        >
          {role !== "ingegnere_clinico" ? (
            <button style={iconBtnStyle()} title="Notifiche" onClick={() => setNotiOpen(true)}>
              <Bell size={18} />
            </button>
          ) : (
            <div style={{ width: 40 }} />
          )}

          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: 0.95 }}>
              <UserCircle2 size={22} />
              <span style={{ fontWeight: 700, fontSize: 13 }}>{roleLabel(role)}</span>
            </div>
          )}

          <button
            onClick={() => setDark(!dark)}
            style={iconBtnStyle()}
            title={dark ? "Light mode" : "Dark mode"}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "10px 0 12px" }} />

        <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {visibleLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                title={collapsed ? link.label : ""}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: collapsed ? "center" : "space-between",
                  padding: "10px 12px",
                  borderRadius: 14,
                  textDecoration: "none",
                  background: active ? "#3B82F6" : "transparent",
                  color: "white",
                  fontWeight: active ? 800 : 600,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: collapsed ? 0 : 10 }}>
                  <Icon size={18} />
                  {!collapsed && link.label}
                </div>
              </Link>
            );
          })}
        </nav>

        {!collapsed && (
          <div style={{ marginTop: "auto", fontSize: 12, opacity: 0.55 }}>
            © {new Date().getFullYear()} Panichelli HSC
          </div>
        )}
      </aside>

      {notiOpen && role !== "ingegnere_clinico" && (
        <div
          onMouseDown={() => setNotiOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              width: 460,
              maxWidth: "calc(100vw - 20px)",
              height: "100%",
              background: dark ? "#0B1220" : "white",
              color: dark ? "#E5E7EB" : "#0B1220",
              borderLeft: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(0,0,0,0.10)",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              fontFamily: FONT,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: 16 }}>Notifiche</div>
                <div className="muted" style={{ marginTop: 4 }}>
                  Scadenze prossime
                </div>
              </div>
              <button style={iconBtnStyle()} onClick={() => setNotiOpen(false)} title="Chiudi">
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Link className="btn primary" href="/maintenance">
                Vai a Mantenimenti
              </Link>
              <Link className="btn" href="/aperture">
                Vai ad Aperture
              </Link>
            </div>

            {notiLoading && <div className="muted">Caricamento…</div>}
            {!notiLoading && noti.error && (
              <div style={{ color: "#DC2626", fontWeight: 800 }}>{noti.error}</div>
            )}

            {!notiLoading && !noti.error && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, overflow: "auto" }}>
                <Section title="Entro 7 giorni" rows={noti.due7} dark={dark} />
                <Section title="Entro 30 giorni" rows={noti.due30} dark={dark} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Section({ title, rows, dark }: { title: string; rows: NotiRow[]; dark: boolean }) {
  return (
    <div
      style={{
        border: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(0,0,0,0.10)",
        borderRadius: 16,
        padding: 12,
        background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
      }}
    >
      <div style={{ fontWeight: 900, marginBottom: 8 }}>
        {title} <span className="muted">({rows.length})</span>
      </div>

      {rows.length === 0 && <div className="muted">Nessuna scadenza.</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.map((r) => (
          <div
            key={r.id}
            style={{
              padding: 10,
              borderRadius: 14,
              background: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.85)",
              border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div style={{ fontWeight: 900 }}>{r.clientName}</div>
              <div className="muted" style={{ whiteSpace: "nowrap" }}>
                {fmtDate(r.dueDate)}
              </div>
            </div>

            <div className="muted" style={{ marginTop: 4 }}>
              {r.serviceName || "—"} • {fmtEur(r.priceEur)}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              {r.urlClient && (
                <Link className="btn" href={r.urlClient}>
                  Apri cliente
                </Link>
              )}
              <Link className="btn" href="/maintenance">
                Apri lista
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function iconBtnStyle() {
  return {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "white",
    cursor: "pointer",
    borderRadius: 12,
    padding: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as const;
}