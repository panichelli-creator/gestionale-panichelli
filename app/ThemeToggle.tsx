"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme | null) ?? "dark";
    setTheme(saved);
    document.documentElement.dataset.theme = saved;
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.dataset.theme = next;
  }

  return (
    <button className="theme-toggle" type="button" onClick={toggle} title="Cambia tema">
      <span className="theme-dot" />
      {theme === "dark" ? "Tema scuro" : "Tema chiaro"}
    </button>
  );
}