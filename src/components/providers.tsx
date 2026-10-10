"use client";

import { usePathname } from "next/navigation";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_CONTENT,
  loadOverrides,
  saveOverrides,
  fetchRemoteContent,
  saveRemoteContent,
  subscribeRemoteContent,
  type SiteContent,
} from "@/lib/content";

/* ============================================================
   Content provider — defaults merged with saved overrides,
   synced with Firebase Firestore so changes appear across all devices.
   ============================================================ */

interface ContentCtx {
  content: SiteContent;
  updateContent: (next: SiteContent) => void;
  resetContent: () => void;
}

const ContentContext = createContext<ContentCtx>({
  content: DEFAULT_CONTENT,
  updateContent: () => {},
  resetContent: () => {},
});
export const useContent = () => useContext(ContentContext);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);

  useEffect(() => {
    // 1. Instant local cache for zero delay
    const ov = loadOverrides();
    if (ov) setContent((prev) => ({ ...prev, ...ov }));

    // 2. Real-time Firebase Firestore live listener (instant updates without refresh)
    const unsub = subscribeRemoteContent((remote) => {
      setContent((prev) => ({ ...prev, ...remote }));
      saveOverrides({ ...DEFAULT_CONTENT, ...remote });
    });

    // 3. Fallback sync: if Firestore is empty but this browser has local edits,
    // automatically push them to Firestore so all other devices receive them!
    fetchRemoteContent().then((remote) => {
      if (!remote && ov) {
        saveRemoteContent({ ...DEFAULT_CONTENT, ...ov }).catch((err) =>
          console.warn("[content] Initial sync to Firestore:", err)
        );
      }
    });

    return () => unsub();
  }, []);

  const updateContent = useCallback((next: SiteContent) => {
    setContent(next);
    saveOverrides(next);
    saveRemoteContent(next).catch((err) => {
      console.error("[content] Firebase Firestore save failed:", err);
    });
  }, []);

  const resetContent = useCallback(() => {
    setContent(DEFAULT_CONTENT);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("altraware_content_v2");
      window.localStorage.removeItem("altraware_content_v1");
    }
    saveRemoteContent(DEFAULT_CONTENT).catch((err) => {
      console.error("[content] Firebase reset failed:", err);
    });
  }, []);

  const value = useMemo(() => ({ content, updateContent, resetContent }), [content, updateContent, resetContent]);
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export interface Toast {
  id: number;
  message: string;
  kind: "info" | "success" | "error";
}

interface NotifyCtx {
  notify: (message: string, kind?: Toast["kind"]) => void;
}

const NotifyContext = createContext<NotifyCtx>({ notify: () => {} });
export const useNotify = () => useContext(NotifyContext);

const TOAST_MS = 5000; // fade away after 5 seconds

export function NotifyProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(1);

  const dismiss = useCallback((id: number) => {
    // two-phase: mark hidden -> remove after fade-out transition
    setToasts((t) => t.map((x) => (x.id === id ? { ...x } : x)));
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, kind: Toast["kind"] = "info") => {
      const id = idRef.current++;
      setToasts((t) => [...t, { id, message, kind }]);
      window.setTimeout(() => dismiss(id), TOAST_MS);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <NotifyContext.Provider value={value}>
      {children}
      {/* Toast stack — bottom right, slide in, fade out after 5s */}
      <div className="fixed bottom-6 right-6 z-[170] flex flex-col gap-2.5 items-end pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="toast show pointer-events-auto bg-deep text-white pl-4 pr-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 max-w-[92vw] md:max-w-sm"
            role="status"
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                t.kind === "success" ? "bg-green-500" : t.kind === "error" ? "bg-red-500" : "bg-viol"
              }`}
            >
              <i
                className={`fa-solid text-sm ${
                  t.kind === "success" ? "fa-check" : t.kind === "error" ? "fa-triangle-exclamation" : "fa-bell"
                }`}
              />
            </div>
            <div className="text-sm font-medium">{t.message}</div>
            <button
              onClick={() => dismiss(t.id)}
              className="ml-1 text-white/40 hover:text-white transition-colors shrink-0"
              aria-label="Dismiss"
            >
              <i className="fa-solid fa-xmark text-xs" />
            </button>
          </div>
        ))}
      </div>
    </NotifyContext.Provider>
  );
}


/* ============================================================
   Smooth scroll (Lenis) + GSAP ScrollTrigger wiring
   ============================================================ */

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // MOBILE PERF: Lenis + GSAP ticker costs ~60fps main-thread work and
    // hurts INP/TBT on phones. Use native scroll on touch / small screens,
    // save-data, or prefers-reduced-motion. Desktop keeps the smooth feel.
    if (typeof window === "undefined") return;
    const isCoarse = window.matchMedia("(hover: none)").matches;
    const isSmall = window.innerWidth < 768;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // @ts-expect-error saveData is Chromium-only
    const saveData = navigator?.connection?.saveData === true;
    if (isCoarse || isSmall || reduced || saveData) return;

    let killed = false;
    let lenis: import("lenis").default | null = null;

    (async () => {
      const Lenis = (await import("lenis")).default;
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (killed) return;
      gsap.registerPlugin(ScrollTrigger);
      lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis!.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    })();

    return () => {
      killed = true;
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}

/* ============================================================
   Preloader — disabled to ensure instantaneous First Paint and
   sub-1.5s Largest Contentful Paint (LCP) across mobile and desktop.
   ============================================================ */

export function Preloader() {
  return null;
}

/* ============================================================
/* ============ PAGE TRANSITION (5-Column Curtain Sweep) ============ */

export function PageTransition() {
  const pathname = usePathname();
  const prev = useRef<string | null>(null);

  useEffect(() => {
    prev.current = pathname;
  }, [pathname]);

  return (
    <div id="page-transition" aria-hidden className="fixed inset-0 pointer-events-none z-[150]">
      {/* Layer 1: Violet curtain cols */}
      <div className="absolute inset-0 flex pointer-events-none z-[151]">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="curtain-col-viol h-full flex-1 origin-top bg-gradient-to-b from-[#7c3aed] to-[#5b21b6]"
            style={{ transform: "scaleY(0)" }}
          />
        ))}
      </div>

      {/* Layer 2: Deep blue curtain cols */}
      <div className="absolute inset-0 flex pointer-events-none z-[152]">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="curtain-col-deep h-full flex-1 origin-top bg-[#0a1735]"
            style={{ transform: "scaleY(0)" }}
          />
        ))}
      </div>

      {/* Center brand & transition word */}
      <div
        id="transitionCenter"
        className="absolute inset-0 z-[153] flex flex-col items-center justify-center opacity-0 pointer-events-none"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Altraware" className="w-14 h-14 object-contain mb-3 drop-shadow-md brightness-110" />
        <span id="transitionWord" className="font-serif italic text-white text-3xl md:text-5xl font-light tracking-wide">
          Let&apos;s Go
        </span>
        <span className="text-violet-300/70 font-mono text-xs uppercase tracking-[0.25em] mt-2">
          Altraware Technology
        </span>
      </div>
    </div>
  );
}