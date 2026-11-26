"use client";

import { useEffect, useSyncExternalStore } from "react";

/* ============================================================
   ThemeToggle — Usiku (dark) ⇄ Mchana (light)

   Runs before paint via the inline script in layout.tsx, so the page
   never flashes the wrong theme. This component only reflects and
   flips the stored choice.
   ============================================================ */

const KEY = "altraware_theme";

/* The <html data-theme> attribute is the single source of truth. The React
   tree subscribes to it instead of mirroring it in state, which keeps SSR
   and client markup identical and avoids setState-inside-effect. */
let themeListeners: Array<() => void> = [];
function emitTheme() {
  for (const l of themeListeners) l();
}
function subscribeTheme(cb: () => void) {
  themeListeners = [...themeListeners, cb];
  return () => {
    themeListeners = themeListeners.filter((l) => l !== cb);
  };
}
function getTheme(): "dark" | "light" {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  // Server renders the dark glyph; the client subscribes to the live value.
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => "dark" as const);
  // useSyncExternalStore already re-renders after hydration, so no mounted flag.
  useEffect(() => {
    // The inline script in <head> applies the stored theme before paint.
    // Re-read it here so React agrees with the DOM.
    emitTheme();
  }, []);

  const flip = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* private mode: the choice simply does not persist */
    }
    emitTheme();
  };

  return (
    <button
      type="button"
      onClick={flip}
      aria-label={theme === "dark" ? "Switch to light theme (Mchana)" : "Switch to dark theme (Usiku)"}
      aria-pressed={theme === "light"}
      title={theme === "dark" ? "Mchana — light" : "Usiku — dark"}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full border border-wire text-bone/70 hover:text-bone hover:border-bone/40 transition-colors ${className}`}
    >
      {/* Render nothing theme-specific until mounted, so SSR and client agree. */}
      <span aria-hidden="true" className="text-[11px] leading-none">
        {theme === "dark" ? "☾" : "☀"}
      </span>
    </button>
  );
}
