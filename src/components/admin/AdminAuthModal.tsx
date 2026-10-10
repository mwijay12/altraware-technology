"use client";

import { useEffect, useState } from "react";
import {
  auth,
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  logoutUser,
  onAuthStateChanged,
  type User,
} from "@/lib/firebase";
import { clearAdminSession } from "@/lib/admin-session";
import { useLockBodyScroll } from "@/components/motion";

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { user, loading };
}

export function AdminAuthHeader({
  user,
  onOpenModal,
}: {
  user: User | null;
  onOpenModal: () => void;
}) {
  const handleLogout = async () => {
    try {
      clearAdminSession();
      await logoutUser();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      window.location.href = "/";
    }
  };

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <div className="flex items-center gap-3 bg-white/[0.06] border border-white/10 px-3 py-1.5 rounded-full">
          {user.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.photoURL} alt={user.displayName || "User"} className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-viol text-white text-[11px] font-bold flex items-center justify-center">
              {(user.displayName || user.email || "A")[0].toUpperCase()}
            </div>
          )}
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-white leading-tight">
              {user.displayName || user.email?.split("@")[0] || "Admin"}
            </div>
            <div className="text-[10px] text-green-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> Admin Verified
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-[11px] text-red-300 hover:text-white px-2 py-0.5 rounded hover:bg-red-500/20 transition-colors flex items-center gap-1"
            title="Ondoka (Logout & Go Home)"
          >
            <i className="fa-solid fa-arrow-right-from-bracket" />
            <span className="hidden md:inline text-[10px]">Logout</span>
          </button>
        </div>
      ) : (
        <button
          onClick={onOpenModal}
          className="flex items-center gap-2 bg-gradient-to-r from-viol to-violD hover:from-violD hover:to-viol text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-viol/20 transition-all hover:scale-105"
        >
          <i className="fa-brands fa-google text-[13px]" />
          <span>Sign In Admin</span>
        </button>
      )}
    </div>
  );
}

export function AdminAuthModal({
  isOpen,
  onClose,
  notify,
}: {
  isOpen: boolean;
  onClose: () => void;
  notify: (msg: string, type: "success" | "error" | "info") => void;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Lock background scroll while the auth dialog is open
  useLockBodyScroll(isOpen);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await loginWithGoogle();
      notify("Google login successful ✓", "success");
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google login failed";
      setErrorMsg(msg);
      notify("Google sign-in failed: " + msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter email and password");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      if (mode === "login") {
        await loginWithEmail(email, password);
        notify("Logged in successfully ✓", "success");
      } else {
        await registerWithEmail(email, password);
        notify("Admin account registered ✓", "success");
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication error";
      setErrorMsg(msg);
      notify(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto bg-deep/80 backdrop-blur-md">
      <div className="min-h-full flex items-center justify-center p-4">
      <div className="bg-[#0e101f] border border-white/15 rounded-3xl max-w-md w-full p-7 text-white shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors"
        >
          <i className="fa-solid fa-xmark text-lg" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-viol/20 border border-viol/40 text-violL flex items-center justify-center mx-auto mb-3 text-xl">
            <i className="fa-solid fa-lock" />
          </div>
          <h2 className="text-xl font-bold font-grotesk">Altraware Admin Access</h2>
          <p className="text-xs text-white/50 mt-1">
            Sign in with Google or Email to synchronize inquiries, project tracking and site configs.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs p-3 rounded-xl mb-4">
            {errorMsg}
          </div>
        )}

        {/* Quick Google Sign In */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-deep hover:bg-white/90 font-bold text-sm py-3 px-4 rounded-xl transition-all shadow-md mb-5"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[11px] text-white/40 uppercase font-mono">Or Email</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3.5">
          <div>
            <label className="text-[11px] font-bold text-white/60 uppercase tracking-wider block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@altraware.co.tz"
              className="w-full bg-white/[0.05] border border-white/15 focus:border-viol focus:outline-none rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20"
              required
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-white/60 uppercase tracking-wider block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-white/[0.05] border border-white/15 focus:border-viol focus:outline-none rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-viol hover:bg-violD text-white font-bold py-2.5 rounded-xl transition-all text-sm mt-2 disabled:opacity-50"
          >
            {loading ? "Working..." : mode === "login" ? "Sign In to Dashboard" : "Register New Account"}
          </button>
        </form>

        <div className="text-center mt-5">
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-xs text-violL hover:underline"
          >
            {mode === "login" ? "No account yet? Register here" : "Already have an account? Sign in here"}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
