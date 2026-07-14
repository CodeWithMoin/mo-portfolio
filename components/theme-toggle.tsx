"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const nextDark = !isDark;
    document.documentElement.classList.toggle("dark", nextDark);
    window.localStorage.setItem("theme", nextDark ? "dark" : "light");
    setIsDark(nextDark);
  }

  return (
    <button
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="grid size-9 place-items-center rounded-full border border-border bg-surface text-sm text-muted transition hover:border-foreground/25 hover:text-foreground"
      onClick={toggleTheme}
      type="button"
    >
      <span aria-hidden="true">{isDark ? "☼" : "◐"}</span>
    </button>
  );
}
