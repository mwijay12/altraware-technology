"use client";

import { useCallback, useEffect, useState } from "react";

/* ============================================================
   Smart pricing by visitor location (VPN-proof).
   - Tanzania (TZ) → Tanzanian Shilling (TSh)
   - Everyone else (USA, UK, Kenya, …) → US Dollar (USD)
   Detection: IP geolocation (ipapi.co → ip-api.com fallback),
   then device timezone, then TZ default. Result cached 24h.
   Visitor can always override manually with the toggle.
   ============================================================ */

export type VisitorCurrency = "TZS" | "USD";

/** Approximate rate used for display conversion (marketing only). */
export const TZS_PER_USD = 2600;

const GEO_CACHE_KEY = "altraware_geo_v1";
const PREF_KEY = "altraware_currency_pref";
const DAY_MS = 24 * 3600 * 1000;

interface GeoCache {
  countryCode: string;
  countryName: string;
  at: number;
}

function readCache(): GeoCache | null {
  try {
    const raw = localStorage.getItem(GEO_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GeoCache;
    if (!parsed.countryCode || Date.now() - parsed.at > DAY_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(c: GeoCache) {
  try {
    localStorage.setItem(GEO_CACHE_KEY, JSON.stringify(c));
  } catch {
    /* ignore */
  }
}

async function fetchWithTimeout(url: string, ms: number): Promise<Response> {
  const ctrl = new AbortController();
  const t = window.setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { signal: ctrl.signal });
  } finally {
    window.clearTimeout(t);
  }
}

async function detectViaIp(): Promise<GeoCache | null> {
  // 1) ipapi.co — no key, CORS-enabled
  try {
    const res = await fetchWithTimeout("https://ipapi.co/json/", 4000);
    if (res.ok) {
      const j = (await res.json()) as { country_code?: string; country_name?: string; error?: boolean };
      if (j.country_code && !j.error) {
        return { countryCode: j.country_code.toUpperCase(), countryName: j.country_name || j.country_code, at: Date.now() };
      }
    }
  } catch {
    /* try next provider */
  }
  // 2) ip-api.com fallback — no key, CORS-enabled
  try {
    const res = await fetchWithTimeout("https://ip-api.com/json/?fields=status,country,countryCode", 4000);
    if (res.ok) {
      const j = (await res.json()) as { status?: string; country?: string; countryCode?: string };
      if (j.status === "success" && j.countryCode) {
        return { countryCode: j.countryCode.toUpperCase(), countryName: j.country || j.countryCode, at: Date.now() };
      }
    }
  } catch {
    /* fall through */
  }
  return null;
}

function guessFromTimezone(): GeoCache | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz === "Africa/Dar_es_Salaam") {
      return { countryCode: "TZ", countryName: "Tanzania", at: Date.now() };
    }
    // Other African timezones are still billed in USD for marketing display.
    if (tz.startsWith("Africa/")) {
      return { countryCode: tz.split("/")[1]?.slice(0, 2).toUpperCase() || "—", countryName: tz.replace("_", " "), at: Date.now() };
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function tzsToUsd(tzs: number): number {
  return Math.round(tzs / TZS_PER_USD);
}

/** "TSh 1.2M" style for TZS, "$460" style for USD. Input is always a TZS amount. */
export function formatSmartPriceTag(tzs: number | "custom", currency: VisitorCurrency): string {
  if (tzs === "custom") return "Custom";
  if (currency === "USD") {
    const usd = tzsToUsd(tzs);
    return usd >= 1000 ? `$${(usd / 1000).toFixed(1).replace(/\.0$/, "")}K` : `$${usd}`;
  }
  if (tzs >= 1_000_000) return `TSh ${(tzs / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  return `TSh ${Math.round(tzs / 1000)}K`;
}

/** Full "TSh 1,200,000" / "$460" format. Input is always a TZS amount. */
export function formatSmartFull(tzs: number, currency: VisitorCurrency): string {
  if (currency === "USD") return "$" + tzsToUsd(tzs).toLocaleString("en-US");
  return "TSh " + tzs.toLocaleString("en-US");
}

/** Compact "350K" / "1.2M" without symbol (caller adds TSh/$). */
export function formatSmartK(tzs: number, currency: VisitorCurrency): string {
  const v = currency === "USD" ? tzsToUsd(tzs) : tzs;
  if (currency === "TZS") {
    return v >= 1_000_000 ? (v / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M" : Math.round(v / 1000) + "K";
  }
  return v >= 1000 ? (v / 1000).toFixed(1).replace(/\.0$/, "") + "K" : String(v);
}

export interface VisitorPricing {
  currency: VisitorCurrency;
  countryCode: string;
  countryName: string;
  detecting: boolean;
  setCurrency: (c: VisitorCurrency) => void;
  /** Format a TZS amount in the visitor currency (full). */
  fmt: (tzs: number) => string;
  /** Format a TZS amount as a short price tag. */
  fmtTag: (tzs: number | "custom") => string;
  /** Compact number without symbol. */
  fmtK: (tzs: number) => string;
  symbol: string;
}

export function useVisitorCurrency(): VisitorPricing {
  const [currency, setCurrencyState] = useState<VisitorCurrency>("TZS");
  const [countryCode, setCountryCode] = useState("TZ");
  const [countryName, setCountryName] = useState("Tanzania");
  const [detecting, setDetecting] = useState(true);

  useEffect(() => {
    let cancelled = false;
    // Manual preference always wins (sticky for VPN testers).
    try {
      const pref = localStorage.getItem(PREF_KEY);
      if (pref === "USD" || pref === "TZS") {
        setCurrencyState(pref);
        setDetecting(false);
        return;
      }
    } catch {
      /* ignore */
    }
    (async () => {
      const cached = readCache();
      if (cached) {
        if (!cancelled) {
          setCountryCode(cached.countryCode);
          setCountryName(cached.countryName);
          setCurrencyState(cached.countryCode === "TZ" ? "TZS" : "USD");
          setDetecting(false);
        }
        return;
      }
      const viaIp = await detectViaIp();
      const found = viaIp ?? guessFromTimezone();
      if (found) writeCache(found);
      if (!cancelled) {
        if (found) {
          setCountryCode(found.countryCode);
          setCountryName(found.countryName);
          setCurrencyState(found.countryCode === "TZ" ? "TZS" : "USD");
        }
        setDetecting(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrency = useCallback((c: VisitorCurrency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(PREF_KEY, c);
    } catch {
      /* ignore */
    }
  }, []);

  return {
    currency,
    countryCode,
    countryName,
    detecting,
    setCurrency,
    fmt: (tzs: number) => formatSmartFull(tzs, currency),
    fmtTag: (tzs: number | "custom") => formatSmartPriceTag(tzs, currency),
    fmtK: (tzs: number) => formatSmartK(tzs, currency),
    symbol: currency === "USD" ? "$" : "TSh",
  };
}

/* Small TSh/USD switcher with detected-location label. */
export function CurrencyToggle({ pricing, dark = false }: { pricing: VisitorPricing; dark?: boolean }) {
  const box = dark
    ? "bg-white/10 border-white/15 text-white"
    : "bg-white border-deep/15 text-deep";
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`inline-flex items-center gap-1 rounded-full border px-1 py-1 text-[11px] font-bold shadow-sm ${box}`}>
        {(["TZS", "USD"] as const).map((c) => (
          <button
            key={c}
            onClick={() => pricing.setCurrency(c)}
            className={`px-3 py-1 rounded-full transition-all ${
              pricing.currency === c ? "bg-viol text-white shadow" : "opacity-60 hover:opacity-100"
            }`}
          >
            {c === "TZS" ? "TSh" : "$ USD"}
          </button>
        ))}
      </div>
      <div className={`text-[10px] font-mono ${dark ? "text-white/45" : "text-deep/45"}`}>
        {pricing.detecting
          ? "Detecting your location…"
          : `Prices in ${pricing.currency === "USD" ? "USD" : "TSh"} · detected: ${pricing.countryName}`}
      </div>
    </div>
  );
}
