"use client";

import { useCallback, useEffect, useState } from "react";
import {
  auth,
  isAuthorizedAdmin,
  logoutUser,
  onAuthStateChanged,
  type User,
} from "@/lib/firebase";

/* ============================================================
   Admin session — timestamped, expiring, single source of truth.
   - Session huishi kwenye sessionStorage (hufa tab ikifungwa).
   - Kikomo cha juu: masaa 8 kutoka kuingia (absolute timeout).
   - Kujitoa ukikaa kimya: dakika 30 bila activity (idle timeout).
   - Thamani za zamani ("1" bila timestamp) zinahesabika zimeisha
     → mtumiaji lazima aingie tena.
   ============================================================ */

export const ADMIN_SESSION_KEY = "altraware_admin_session";

/** Muda wa juu wa session tangu kuingia — masaa 8 (siku ya kazi). */
export const ADMIN_ABS_TIMEOUT_MS = 8 * 60 * 60 * 1000;
/** Kujitoa ukikaa kimya bila kubofya/kuandika — dakika 30. */
export const ADMIN_IDLE_TIMEOUT_MS = 30 * 60 * 1000;

export type SessionMethod = "firebase" | "master";

export interface AdminSession {
  v: 1;
  method: SessionMethod;
  createdAt: number;
  lastActive: number;
}

function readRaw(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(ADMIN_SESSION_KEY);
  } catch {
    return null;
  }
}

export function createAdminSession(method: SessionMethod): void {
  if (typeof window === "undefined") return;
  const now = Date.now();
  const sess: AdminSession = { v: 1, method, createdAt: now, lastActive: now };
  try {
    window.sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sess));
  } catch {
    // storage imezuiwa — session itadumu kwenye memory ya hook tu
  }
  lastTouchWrite = now;
}

let lastTouchWrite = 0;

/** Hu-refresh lastActive (throttled — huandika mara 1 kwa sekunde 30). */
export function touchAdminSession(force = false): void {
  if (typeof window === "undefined") return;
  const now = Date.now();
  if (!force && now - lastTouchWrite < 30_000) return;
  const raw = readRaw();
  if (!raw) return;
  try {
    const obj = JSON.parse(raw) as Partial<AdminSession>;
    if (!obj || obj.v !== 1) return;
    obj.lastActive = now;
    window.sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(obj));
    lastTouchWrite = now;
  } catch {
    // ignore
  }
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {
    // ignore
  }
}

/**
 * Kusoma session iliyo VALID. Kama haipo, ni ya zamani ("1"),
 * imeharibika, au muda wake umeisha → inafutwa na kurudi null.
 */
export function getAdminSession(): AdminSession | null {
  const raw = readRaw();
  if (!raw) return null;
  let parsed: AdminSession | null = null;
  try {
    const obj = JSON.parse(raw) as Partial<AdminSession>;
    if (
      obj &&
      obj.v === 1 &&
      (obj.method === "firebase" || obj.method === "master") &&
      typeof obj.createdAt === "number" &&
      typeof obj.lastActive === "number"
    ) {
      parsed = obj as AdminSession;
    }
  } catch {
    parsed = null;
  }
  if (!parsed) {
    clearAdminSession();
    return null;
  }
  const now = Date.now();
  const absExpired = now - parsed.createdAt > ADMIN_ABS_TIMEOUT_MS;
  const idleExpired = now - parsed.lastActive > ADMIN_IDLE_TIMEOUT_MS;
  if (absExpired || idleExpired) {
    clearAdminSession();
    return null;
  }
  return parsed;
}

export function isAdminSessionValid(): boolean {
  return getAdminSession() !== null;
}

/** Muda uliobaki (ms) kabla session haijaisha — mdogo kati ya absolute na idle. */
export function sessionRemainingMs(sess: AdminSession): number {
  const now = Date.now();
  const absLeft = sess.createdAt + ADMIN_ABS_TIMEOUT_MS - now;
  const idleLeft = sess.lastActive + ADMIN_IDLE_TIMEOUT_MS - now;
  return Math.max(0, Math.min(absLeft, idleLeft));
}

export function formatRemainingSw(ms: number): string {
  if (ms <= 0) return "muda umeisha";
  const totalMin = Math.ceil(ms / 60_000);
  if (totalMin < 60) return `dak ${totalMin}`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m === 0 ? `saa ${h}` : `saa ${h} dak ${m}`;
}

/**
 * Ukaguzi wa click-time kwa vitendo vya hatari (futa, reset).
 * True = Firebase admin halali AU master session iliyo valid.
 */
export function canManageNow(): boolean {
  if (typeof window === "undefined") return false;
  const email = auth.currentUser?.email ?? null;
  if (isAuthorizedAdmin(email)) {
    touchAdminSession();
    return true;
  }
  return isAdminSessionValid();
}

/* ============================================================
   Hook — auth state moja kwa layout + admin page.
   ============================================================ */

export type AdminStatus = "loading" | "active" | "expired" | "locked";

export interface AdminSessionState {
  user: User | null;
  authLoading: boolean;
  session: AdminSession | null;
  status: AdminStatus;
  /** Nimeisha muda (kuonyesha ujumbe "ingia tena"). */
  expiredNotice: boolean;
  /** Barua pepe iliyokataliwa (si admin) — kuonyesha ujumbe. */
  rejectedEmail: string | null;
  remainingMs: number;
  refresh: () => void;
  logout: () => Promise<void>;
}

export function useAdminSession(): AdminSessionState {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [session, setSession] = useState<AdminSession | null>(null);
  const [expiredNotice, setExpiredNotice] = useState(false);
  const [rejectedEmail, setRejectedEmail] = useState<string | null>(null);

  const refresh = useCallback(() => {
    const rawBefore = readRaw();
    const sess = getAdminSession();
    setSession(sess);
    if (rawBefore && !sess) {
      // Kulikuwa na session lakini muda umeisha → toka kikamilifu
      setExpiredNotice(true);
      void logoutUser().catch(() => {});
      setUser(null);
    }
  }, []);

  // 1) Firebase auth subscription
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
      if (u && isAuthorizedAdmin(u.email)) {
        const existing = getAdminSession();
        if (!existing || existing.method !== "firebase") {
          createAdminSession("firebase");
        } else {
          touchAdminSession(true);
        }
        setSession(getAdminSession());
        setExpiredNotice(false);
        setRejectedEmail(null);
      } else if (u) {
        // Ameingia Firebase lakini si admin → mtoe mara moja
        setRejectedEmail(u.email ?? "hiyo akaunti");
        void logoutUser().catch(() => {});
        clearAdminSession();
        setSession(null);
        setUser(null);
      }
    });
    return () => unsub();
  }, []);

  // 2) Revalidate kila sekunde 30 + refresh activity
  useEffect(() => {
    refresh();
    const id = window.setInterval(refresh, 30_000);
    const onActivity = () => touchAdminSession();
    window.addEventListener("click", onActivity);
    window.addEventListener("keydown", onActivity);
    window.addEventListener("touchstart", onActivity);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("click", onActivity);
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener("touchstart", onActivity);
    };
  }, [refresh]);

  const logout = useCallback(async () => {
    clearAdminSession();
    setSession(null);
    setExpiredNotice(false);
    try {
      await logoutUser();
    } catch {
      // ignore
    }
    setUser(null);
  }, []);

  const isAdmin = session !== null;
  const status: AdminStatus = authLoading
    ? "loading"
    : isAdmin
      ? "active"
      : expiredNotice
        ? "expired"
        : "locked";

  return {
    user,
    authLoading,
    session,
    status,
    expiredNotice,
    rejectedEmail,
    remainingMs: session ? sessionRemainingMs(session) : 0,
    refresh,
    logout,
  };
}
