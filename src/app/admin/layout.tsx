"use client";

import { useState } from "react";
import { loginWithGoogle, loginWithEmail } from "@/lib/firebase";
import {
  createAdminSession,
  useAdminSession,
} from "@/lib/admin-session";

/* ============================================================
   Admin layout — Production Gate.
   Njia za kuingia:
   1. Google Sign-In (Firebase Auth — emails zilizoidhinishwa tu)
   2. Email & Password (Firebase Auth — emails zilizoidhinishwa tu)
   3. Master passphrase — huthibitishwa SERVER-SIDE kupitia
      /api/admin/session (ADMIN_MASTER_KEY kwenye env).
      Hakuna password iliyo-hardcoded kwenye bundle.
   Session: huisha baada ya masaa 8, hujitoa baada ya dakika 30
   za ukimya — ukiacha tab wazi, unatolewa kiotomatiki.
   ============================================================ */

function errMsg(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { status, rejectedEmail, refresh } = useAdminSession();
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);

  const handleMasterLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pass) {
      setError("Tafadhali weka master passphrase.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passphrase: pass }),
      });
      if (res.ok) {
        createAdminSession("master");
        setPass("");
        setError("");
        refresh();
      } else if (res.status === 503) {
        setError("Master key haijawekwa kwenye server — tumia Google au Email kuingia.");
      } else {
        setError("Nenosiri si sahihi — jaribu tena.");
      }
    } catch {
      setError("Mtandao una shida — jaribu tena.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      refresh();
    } catch (err: unknown) {
      setError(errMsg(err, "Imeshindwa kuingia na Google."));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pass) {
      setError("Tafadhali jaza barua pepe na nenosiri.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await loginWithEmail(email, pass);
      setPass("");
      refresh();
    } catch (err: unknown) {
      setError(errMsg(err, "Taarifa za kuingia si sahihi."));
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return <div className="min-h-screen bg-deep3" />;

  if (status !== "active") {
    return (
      <div className="min-h-screen bg-[#070913] flex items-center justify-center p-5 relative overflow-hidden font-sans">
        <div className="absolute inset-0 noise-blue opacity-50" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-viol/20 blur-[130px] rounded-full pointer-events-none" />

        <div className="relative bg-white/[0.04] border border-white/15 backdrop-blur-2xl rounded-3xl p-8 w-full max-w-sm shadow-2xl z-10 text-white">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#0a1735] p-2 flex items-center justify-center border border-white/10 shadow-lg shadow-viol/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Altraware" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="text-white font-grotesk font-extrabold text-sm tracking-tight">ALTRAWARE TECHNOLOGY</div>
              <div className="text-[10px] tracking-[0.25em] text-violL font-mono font-bold uppercase">ADMIN CONSOLE</div>
            </div>
          </div>

          <p className="text-xs text-white/60 mb-5 leading-relaxed">
            Tovuti salama ya usimamizi wa miradi ya wateja, maombi ya mifumo (leads), ankara, na maudhui.
          </p>

          {status === "expired" && (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs p-3 rounded-xl mb-4 flex items-start gap-2">
              <i className="fa-solid fa-clock mt-0.5" />
              <span>Kipindi cha admin kimeisha (muda umeisha) — umetolewa kiotomatiki. Ingia tena kuendelea.</span>
            </div>
          )}

          {rejectedEmail && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs p-3 rounded-xl mb-4">
              Anuani ya &quot;{rejectedEmail}&quot; haina ruhusa ya Admin. Wasiliana na Altraware.
            </div>
          )}

          {/* GOOGLE SIGN IN BUTTON */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white hover:bg-white/95 text-deep font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2.5 transition-all shadow-md mb-4"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.24v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.59H1.24C.45 8.16 0 9.94 0 12s.45 3.84 1.24 5.41l4.04-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.59l4.04 3.15c.95-2.84 3.6-4.99 6.72-4.99z"
              />
            </svg>
            <span>{loading ? "Inathibitisha..." : "Ingia kama Admin (Google)"}</span>
          </button>

          {/* DIVIDER */}
          <div className="my-4 flex items-center gap-3">
            <span className="flex-1 h-[1px] bg-white/10" />
            <span className="text-[10px] font-mono text-white/40 uppercase">AU KWA NENOSIRI</span>
            <span className="flex-1 h-[1px] bg-white/10" />
          </div>

          {showEmailLogin ? (
            /* EMAIL & PASSWORD FORM */
            <form onSubmit={handleEmailAuth} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono font-bold text-white/50 block mb-1">EMAIL YA ADMIN</label>
                <input
                  type="email"
                  placeholder="admin@altraware.co.tz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-viol"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono font-bold text-white/50 block mb-1">NENOSIRI</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-viol"
                />
              </div>

              {error && <div className="text-red-400 text-xs">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="mt-3 w-full bg-viol hover:bg-violD text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-lg shadow-viol/20"
              >
                Thibitisha &amp; Ingia <i className="fa-solid fa-arrow-right ml-1.5 text-[10px]" />
              </button>

              <button
                type="button"
                onClick={() => setShowEmailLogin(false)}
                className="text-[11px] text-white/40 hover:text-white block text-center w-full pt-1"
              >
                Rudi kwenye Master Passphrase
              </button>
            </form>
          ) : (
            /* MASTER PASSPHRASE FORM (server-verified) */
            <form onSubmit={handleMasterLogin} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono font-bold text-white/50 block mb-1">MASTER PASSPHRASE</label>
                <input
                  type="password"
                  autoFocus
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-viol"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
              </div>

              {error && <div className="text-red-400 text-xs">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-viol hover:bg-violD text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-lg shadow-viol/20 flex items-center justify-center gap-2"
              >
                <span>{loading ? "Inathibitisha..." : "Fungua Console"}</span>
                <i className="fa-solid fa-arrow-right text-[10px]" />
              </button>

              <div className="pt-2 flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={() => setShowEmailLogin(true)}
                  className="text-violL hover:underline font-mono"
                >
                  Ingia kwa Email &amp; Password
                </button>
                <span className="text-white/30 font-mono">v2.4 (Prod)</span>
              </div>
            </form>
          )}

          <p className="text-[10px] text-white/30 mt-5 text-center font-mono">
            Session hudumu max masaa 8 · hujitoa baada ya dakika 30 za ukimya.
          </p>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen font-sans">{children}</div>;
}
