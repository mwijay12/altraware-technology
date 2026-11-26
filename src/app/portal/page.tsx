"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  auth,
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  logoutUser,
  onAuthStateChanged,
  type User,
} from "@/lib/firebase";
import {
  type ClientProject,
  fetchAllProjects,
  fetchProjectsForClient,
  DEFAULT_PROJECTS,
  ProjectStage,
} from "@/lib/client-projects";
import { createInquiry } from "@/lib/leads";
import { formatTsh } from "@/lib/content";

const STAGES: { id: ProjectStage; label: string; icon: string; desc: string }[] = [
  { id: "discovery", label: "Discovery & Scope", icon: "fa-clipboard-list", desc: "Requirements gathering, user stories, and architecture roadmap" },
  { id: "design", label: "UI/UX Architecture", icon: "fa-palette", desc: "Interactive flows, design systems, and wireframe prototypes" },
  { id: "development", label: "Agile Engineering", icon: "fa-code", desc: "Core engine, database schema, offline sync, and APIs" },
  { id: "staging", label: "Staging & QA", icon: "fa-vial", desc: "Client sandbox verification, data migration, and usability testing" },
  { id: "live", label: "Live Production Handover", icon: "fa-rocket", desc: "Production launch, credentials vault, and 24/7 hypercare" },
];

type PortalTab = "overview" | "roadmap" | "docs" | "files" | "finance" | "support";

export default function ClientPortalPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Auth form state
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [emailInput, setEmailInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Projects state
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<PortalTab>("overview");

  // New Request Form state for clients without active project
  const [showBriefForm, setShowBriefForm] = useState(false);
  const [briefSubmitted, setBriefSubmitted] = useState(false);
  const [briefSystem, setBriefSystem] = useState("Faida POS — Retail & Inventory");
  const [briefPhone, setBriefPhone] = useState("");
  const [briefOrg, setBriefOrg] = useState("");
  const [briefNotes, setBriefNotes] = useState("");

  // Listen to Firebase auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // Fetch projects when user changes or demo mode is toggled
  useEffect(() => {
    async function loadProjects() {
      setProjectsLoading(true);
      try {
        if (isDemoMode) {
          const all = await fetchAllProjects();
          setProjects(all.length > 0 ? all : DEFAULT_PROJECTS);
          if (all.length > 0) setActiveProjectId(all[0].id);
        } else if (user) {
          const userProjects = await fetchProjectsForClient(user.email || user.uid);
          setProjects(userProjects);
          if (userProjects.length > 0) {
            setActiveProjectId(userProjects[0].id);
          }
        } else {
          setProjects([]);
          setActiveProjectId(null);
        }
      } catch (err) {
        console.error("Failed to load client projects:", err);
      } finally {
        setProjectsLoading(false);
      }
    }

    if (!authLoading) {
      loadProjects();
    }
  }, [user, isDemoMode, authLoading]);

  // Auth handlers
  const handleGoogleSignIn = async () => {
    setAuthError("");
    setAuthSubmitting(true);
    try {
      await loginWithGoogle();
      setIsDemoMode(false);
    } catch (err: any) {
      setAuthError(err.message || "Failed to sign in with Google.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passInput) {
      setAuthError("Please provide both email address and password.");
      return;
    }
    setAuthError("");
    setAuthSubmitting(true);
    try {
      if (authMode === "login") {
        await loginWithEmail(emailInput, passInput);
      } else {
        await registerWithEmail(emailInput, passInput);
      }
      setIsDemoMode(false);
    } catch (err: any) {
      setAuthError(err.message || "Authentication error. Please check details and retry.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await logoutUser();
    setIsDemoMode(false);
    setProjects([]);
    setActiveProjectId(null);
  };

  // Submit project request for pending client
  const handleSubmitBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!briefPhone) {
      alert("Please provide your phone number");
      return;
    }
    try {
      const clientName = user?.displayName || user?.email?.split("@")[0] || "Client";
      const clientEmail = user?.email || "";
      const generatedRef = "#ALT-" + Math.floor(1000 + Math.random() * 9000);

      await createInquiry({
        name: clientName,
        email: clientEmail,
        phone: briefPhone,
        org: briefOrg,
        type: briefSystem,
        message: briefNotes || "System deployment request submitted via Client Portal.",
        status: "new",
        refCode: generatedRef,
      });

      // Send branded emails via Nodemailer
      try {
        await fetch("/api/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: clientName,
            email: clientEmail,
            phone: briefPhone,
            org: briefOrg,
            type: briefSystem,
            message: briefNotes || "System deployment request submitted via Client Portal.",
            refCode: generatedRef,
          }),
        });
      } catch (mailErr) {
        console.warn("Portal email dispatch error:", mailErr);
      }

      setBriefSubmitted(true);
      setShowBriefForm(false);
    } catch (err) {
      console.error("Failed to submit inquiry:", err);
      alert("Error submitting brief. Please try again or message via WhatsApp.");
    }
  };

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const handlePrintDocs = () => {
    window.print();
  };

  // 1. Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-6 text-deep font-sans">
        <div className="w-12 h-12 rounded-full border-4 border-viol border-t-transparent animate-spin mb-4" />
        <p className="text-xs font-mono tracking-widest text-deep/50 uppercase">
          Loading Client Project Terminal...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated View (Login / Register / Demo Gate) — Clean Light Aesthetic
  if (!user && !isDemoMode) {
    return (
      <div className="min-h-screen bg-[#faf8f5] text-deep flex flex-col justify-center items-center px-4 pt-32 pb-16 relative overflow-hidden font-sans">
        {/* Soft background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-viol/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-amber-400/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md relative z-10 bg-white/90 border border-deep/10 backdrop-blur-xl rounded-3xl p-7 sm:p-9 shadow-2xl shadow-deep/5">
          {/* Logo & Header */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#0a1735] p-2 flex items-center justify-center shadow-md shadow-viol/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Altraware" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="text-deep font-grotesk font-extrabold text-base tracking-tight leading-none">
                ALTRAWARE TECHNOLOGY
              </div>
              <div className="text-[10px] tracking-[0.25em] text-viol font-mono font-bold uppercase mt-1">
                CLIENT TERMINAL · PORTAL
              </div>
            </div>
          </div>

          <h1 className="text-xl font-bold font-grotesk text-deep">
            {authMode === "login" ? "Access Your Project Terminal" : "Create Client Account"}
          </h1>
          <p className="text-xs text-deep/60 mt-1 leading-relaxed">
            Track real-time engineering milestones, inspect technical documentation, access APK releases, and manage handover vaults.
          </p>

          {/* GOOGLE SIGN IN BUTTON */}
          <button
            onClick={handleGoogleSignIn}
            disabled={authSubmitting}
            className="mt-6 w-full bg-white hover:bg-slate-50 border border-deep/15 text-deep font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-3 transition-all shadow-sm hover:border-viol cursor-pointer"
          >
            {/* Google SVG Icon */}
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
            <span>{authSubmitting ? "Authenticating..." : "Continue with Google"}</span>
          </button>

          {/* DIVIDER */}
          <div className="my-5 flex items-center gap-3">
            <span className="flex-1 h-[1px] bg-deep/10" />
            <span className="text-[10px] font-mono text-deep/40 uppercase">OR WITH EMAIL</span>
            <span className="flex-1 h-[1px] bg-deep/10" />
          </div>

          {/* EMAIL FORM */}
          <form onSubmit={handleEmailAuth} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-mono font-bold text-deep/70 block mb-1">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                placeholder="client@company.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-[#fbfbfd] border border-deep/15 rounded-xl px-4 py-3 text-xs text-deep placeholder:text-deep/30 focus:outline-none focus:border-viol focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono font-bold text-deep/70 block mb-1">
                PASSWORD
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                className="w-full bg-[#fbfbfd] border border-deep/15 rounded-xl px-4 py-3 text-xs text-deep placeholder:text-deep/30 focus:outline-none focus:border-viol focus:bg-white transition-colors"
              />
            </div>

            {authError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600">
                <i className="fa-solid fa-triangle-exclamation mr-1.5" />
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={authSubmitting}
              className="w-full bg-deep hover:bg-viol text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-lg shadow-deep/15 cursor-pointer"
            >
              {authSubmitting ? (
                <span>Processing...</span>
              ) : authMode === "login" ? (
                <span>Access Project Terminal →</span>
              ) : (
                <span>Create Client Account →</span>
              )}
            </button>
          </form>

          {/* TOGGLE LOGIN / REGISTER */}
          <div className="mt-4 text-center">
            {authMode === "login" ? (
              <p className="text-xs text-deep/60">
                Don&apos;t have an account yet?{" "}
                <button
                  onClick={() => {
                    setAuthMode("register");
                    setAuthError("");
                  }}
                  className="text-viol hover:underline font-bold cursor-pointer"
                >
                  Register here
                </button>
              </p>
            ) : (
              <p className="text-xs text-deep/60">
                Already registered?{" "}
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setAuthError("");
                  }}
                  className="text-viol hover:underline font-bold cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>

          {/* DEMO MODE EXPLORE BUTTON */}
          <div className="mt-6 pt-5 border-t border-deep/10 text-center">
            <button
              onClick={() => setIsDemoMode(true)}
              className="text-xs text-viol font-semibold hover:underline inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-eye" />
              Explore Portal Sandbox (Live Demo Mode)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated Portal View — Clean Light Architecture
  return (
    <div className="min-h-screen bg-[#faf8f5] text-deep flex flex-col font-sans pt-28 pb-20">
      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* TOP STATUS BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white/80 border border-deep/10 backdrop-blur-xl rounded-2xl px-5 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-xs">
              <span className="text-deep/50">Verified Client: </span>
              <span className="font-bold text-deep font-mono">
                {user?.displayName || user?.email || (isDemoMode ? "Live Demo Client" : "Client")}
              </span>
            </div>
            {isDemoMode && (
              <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                DEMO MODE
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={handleSignOut}
                className="text-xs font-semibold text-deep/70 hover:text-red-600 px-3 py-1.5 rounded-lg border border-deep/10 hover:border-red-200 transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-right-from-bracket mr-1.5 text-[10px]" />
                Sign Out
              </button>
            ) : isDemoMode ? (
              <button
                onClick={() => setIsDemoMode(false)}
                className="text-xs bg-viol hover:bg-violD text-white font-bold px-3.5 py-1.5 rounded-lg transition-all shadow cursor-pointer"
              >
                Sign In With Your Account
              </button>
            ) : null}
          </div>
        </div>

        {/* CASE A: No active project assigned yet */}
        {!projectsLoading && projects.length === 0 && (
          <div className="bg-white border border-deep/10 rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto shadow-xl shadow-deep/5 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-viol/10 border border-viol/20 text-viol flex items-center justify-center text-2xl mx-auto shadow-sm">
              <i className="fa-solid fa-hourglass-half" />
            </div>

            <div>
              <h2 className="text-2xl font-bold font-grotesk text-deep">
                Welcome, {user?.displayName || user?.email?.split("@")[0]}!
              </h2>
              <p className="text-xs text-deep/60 mt-2 leading-relaxed">
                Your client terminal account is verified. An active project has not been linked to this email address (
                <span className="text-viol font-mono font-bold">{user?.email}</span>) yet.
              </p>
            </div>

            {briefSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-emerald-800 text-xs space-y-2">
                <i className="fa-solid fa-circle-check text-base text-emerald-600" />
                <div className="font-bold">Project Brief Received Successfully!</div>
                <p className="text-deep/70">
                  Our engineering lead will reach out promptly and link your architecture roadmap to this portal account.
                </p>
              </div>
            ) : !showBriefForm ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowBriefForm(true)}
                  className="w-full sm:w-auto bg-deep hover:bg-viol text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-deep/15 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <i className="fa-solid fa-plus" /> Request New System Deployment
                </button>
                <a
                  href="https://wa.me/255757939444?text=Habari%20Altraware,%20nimejisajili%20kwenye%20Client%20Portal%20nahitaji%20kuunganisha%20mradi%20wangu."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs px-5 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow"
                >
                  <i className="fa-brands fa-whatsapp text-sm" /> Connect on WhatsApp
                </a>
              </div>
            ) : (
              /* BRIEF SUBMISSION FORM */
              <form onSubmit={handleSubmitBrief} className="text-left bg-[#fbfbfd] border border-deep/10 rounded-2xl p-6 space-y-4">
                <div className="text-xs font-bold text-deep border-b border-deep/10 pb-2">
                  Project Scope &amp; Target Specifications
                </div>

                <div>
                  <label className="text-[11px] font-mono text-deep/60 block mb-1">SYSTEM CATEGORY</label>
                  <select
                    value={briefSystem}
                    onChange={(e) => setBriefSystem(e.target.value)}
                    className="w-full bg-white border border-deep/15 rounded-xl px-3 py-2 text-xs text-deep focus:border-viol"
                  >
                    <option value="Faida POS — Retail & Inventory">Faida POS — Retail, Inventory &amp; M-Pesa</option>
                    <option value="CareTrack — Health & Attendance">CareTrack — Early Childhood &amp; Health Records</option>
                    <option value="Corporate Web Platform">Corporate High-Conversion Web Platform</option>
                    <option value="Custom App / Portal">Custom Web &amp; Mobile Client Portal</option>
                    <option value="Enterprise Custom ERP">Enterprise Custom ERP &amp; Operations</option>
                  </select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-deep/60 block mb-1">WHATSAPP PHONE NUMBER *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+255 7XX XXX XXX"
                      value={briefPhone}
                      onChange={(e) => setBriefPhone(e.target.value)}
                      className="w-full bg-white border border-deep/15 rounded-xl px-3 py-2 text-xs text-deep focus:border-viol"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-deep/60 block mb-1">COMPANY / ORGANIZATION</label>
                    <input
                      type="text"
                      placeholder="e.g. Kariakoo Wholesalers"
                      value={briefOrg}
                      onChange={(e) => setBriefOrg(e.target.value)}
                      className="w-full bg-white border border-deep/15 rounded-xl px-3 py-2 text-xs text-deep focus:border-viol"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-deep/60 block mb-1">PROJECT REQUIREMENTS &amp; TIMELINE</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe your business workflow and primary operational bottlenecks..."
                    value={briefNotes}
                    onChange={(e) => setBriefNotes(e.target.value)}
                    className="w-full bg-white border border-deep/15 rounded-xl p-3 text-xs text-deep focus:border-viol"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowBriefForm(false)}
                    className="text-xs text-deep/60 hover:text-deep px-4 py-2 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-deep hover:bg-viol text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow cursor-pointer"
                  >
                    Submit Project Brief →
                  </button>
                </div>
              </form>
            )}

            {/* DEMO BUTTON IN PENDING */}
            <div className="pt-4 border-t border-deep/10">
              <button
                onClick={() => setIsDemoMode(true)}
                className="text-xs text-viol font-semibold hover:underline transition-colors cursor-pointer"
              >
                Or click here to preview how an active deployment appears in this portal →
              </button>
            </div>
          </div>
        )}

        {/* CASE B: User has Active Project */}
        {activeProject && (
          <div className="space-y-6">
            {/* MULTI-PROJECT SELECTOR (if more than 1) */}
            {projects.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <span className="text-[10px] font-mono text-deep/50 uppercase tracking-widest">Your Projects:</span>
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveProjectId(p.id)}
                    className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      p.id === activeProjectId
                        ? "bg-deep text-white border-deep shadow-md"
                        : "bg-white border-deep/10 text-deep/60 hover:border-deep/25"
                    }`}
                  >
                    {p.systemName}
                  </button>
                ))}
              </div>
            )}

            {/* HERO PROJECT STATUS CARD — Luxury Light Aesthetic */}
            <div className="relative overflow-hidden bg-white border border-deep/10 rounded-3xl p-6 sm:p-8 shadow-xl shadow-deep/5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-viol uppercase bg-viol/10 border border-viol/20 px-3 py-1 rounded-full">
                      {activeProject.clientName}
                    </span>
                    {activeProject.company && (
                      <span className="text-[10px] font-mono text-deep/60 tracking-wider">
                        • {activeProject.company}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold font-grotesk text-deep mt-2">
                    {activeProject.systemName}
                  </h1>
                  <p className="text-xs text-deep/70 mt-1 max-w-2xl leading-relaxed">
                    {activeProject.documentation.overview}
                  </p>
                </div>

                {/* CURRENT STAGE PILL */}
                <div className="bg-[#f8f7fd] border border-viol/20 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shrink-0 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-viol/15 border border-viol/30 text-viol flex items-center justify-center text-xl">
                    <i className={`fa-solid ${STAGES.find((s) => s.id === activeProject.stage)?.icon || "fa-laptop-code"}`} />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-deep/50 uppercase tracking-widest">CURRENT STAGE</div>
                    <div className="text-sm font-bold text-deep font-grotesk">
                      {STAGES.find((s) => s.id === activeProject.stage)?.label}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-mono font-semibold flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Managed by Altraware
                    </div>
                  </div>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="mt-8 pt-6 border-t border-deep/10">
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <span className="font-mono text-deep/70 font-semibold">
                    Overall Build Progress:
                  </span>
                  <span className="font-mono text-base font-extrabold text-viol">
                    {activeProject.progressPercent}%
                  </span>
                </div>
                <div className="w-full h-3 bg-deep/5 rounded-full overflow-hidden p-0.5 border border-deep/10">
                  <div
                    className="h-full bg-gradient-to-r from-viol via-violL to-emerald-500 rounded-full transition-all duration-1000 shadow-sm"
                    style={{ width: `${activeProject.progressPercent}%` }}
                  />
                </div>

                {/* DATES & QUICK METRICS */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-xs">
                  <div className="bg-[#fbfbfd] border border-deep/10 rounded-xl p-3">
                    <span className="text-[10px] font-mono text-deep/40 block">START DATE</span>
                    <span className="font-semibold text-deep font-mono">{activeProject.startDate}</span>
                  </div>
                  <div className="bg-[#fbfbfd] border border-deep/10 rounded-xl p-3">
                    <span className="text-[10px] font-mono text-deep/40 block">TARGET LAUNCH</span>
                    <span className="font-semibold text-emerald-600 font-mono">{activeProject.targetLaunchDate}</span>
                  </div>
                  <div className="bg-[#fbfbfd] border border-deep/10 rounded-xl p-3">
                    <span className="text-[10px] font-mono text-deep/40 block">PAYMENTS CONFIRMED</span>
                    <span className="font-semibold text-deep font-mono">
                      {formatTsh(activeProject.amountPaid || 0)}
                    </span>
                  </div>
                  <div className="bg-[#fbfbfd] border border-deep/10 rounded-xl p-3">
                    <span className="text-[10px] font-mono text-deep/40 block">REMAINING BALANCE</span>
                    <span className="font-semibold text-amber-700 font-mono">
                      {formatTsh((activeProject.totalAmount || 0) - (activeProject.amountPaid || 0))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex items-center gap-2 border-b border-deep/10 overflow-x-auto pb-1 text-xs">
              {(
                [
                  { id: "overview", label: "Overview & Roadmap", icon: "fa-bars-progress" },
                  { id: "docs", label: "System Documentation (Docs)", icon: "fa-book-open" },
                  { id: "files", label: "Deliverables & Vault", icon: "fa-folder-closed" },
                  { id: "finance", label: "Invoices & Payments", icon: "fa-receipt" },
                  { id: "support", label: "24/7 SLA Support", icon: "fa-headset" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                    activeTab === t.id
                      ? "border-viol text-viol bg-white shadow-sm"
                      : "border-transparent text-deep/60 hover:text-deep hover:bg-white/50"
                  }`}
                >
                  <i className={`fa-solid ${t.icon} text-xs`} />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* TAB CONTENT: 1. OVERVIEW & ROADMAP */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* MILESTONE PIPELINE */}
                <div className="bg-white border border-deep/10 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-lg font-bold font-grotesk text-deep">
                      Project Milestones &amp; Delivery Roadmap
                    </h3>
                    <p className="text-xs text-deep/60 mt-0.5">
                      Track the delivery of every phase of your system with complete transparency.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {(activeProject.milestones || []).map((m, idx) => (
                      <div
                        key={m.id || idx}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all ${
                          m.status === "completed"
                            ? "bg-emerald-50/70 border-emerald-200"
                            : m.status === "in_progress"
                            ? "bg-viol/5 border-viol/30 shadow-md shadow-viol/5"
                            : "bg-[#fbfbfd] border-deep/10 opacity-70"
                        }`}
                      >
                        <div className="flex items-start sm:items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              m.status === "completed"
                                ? "bg-emerald-600 text-white"
                                : m.status === "in_progress"
                                ? "bg-viol text-white animate-pulse"
                                : "bg-deep/10 text-deep/50"
                            }`}
                          >
                            {m.status === "completed" ? (
                              <i className="fa-solid fa-check" />
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-deep flex items-center gap-2">
                              <span>{m.name}</span>
                              {m.status === "in_progress" && (
                                <span className="bg-viol text-white text-[9px] font-mono px-2 py-0.5 rounded-full uppercase">
                                  In Active Development
                                </span>
                              )}
                            </div>
                            {m.notes && (
                              <p className="text-[11px] text-deep/70 mt-0.5 font-sans leading-relaxed">
                                {m.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-2 sm:mt-0 font-mono text-[11px] text-deep/50 shrink-0">
                          {m.completedAt ? `Completed: ${m.completedAt}` : m.status === "in_progress" ? "In Active Sprint" : "Scheduled"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* QUICK DOWNLOADS & PREVIEW SECTION */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* APK RELEASE */}
                  <div className="bg-white border border-deep/10 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg mb-3">
                        <i className="fa-brands fa-android" />
                      </div>
                      <h4 className="text-sm font-bold text-deep">Download Android Build (APK)</h4>
                      <p className="text-xs text-deep/60 mt-1">
                        Official production APK release for testing on your phone or POS hardware terminal.
                      </p>
                    </div>

                    <div className="mt-5">
                      {activeProject.apkDownloadUrl ? (
                        <a
                          href={activeProject.apkDownloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all inline-flex items-center gap-2 shadow"
                        >
                          <i className="fa-solid fa-download" /> Download Production APK (.apk)
                        </a>
                      ) : (
                        <span className="text-xs text-deep/40 italic">
                          APK binary will be published upon conclusion of the Agile build phase.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* STAGING / WEB PREVIEW */}
                  <div className="bg-white border border-deep/10 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-lg mb-3">
                        <i className="fa-solid fa-globe" />
                      </div>
                      <h4 className="text-sm font-bold text-deep">Live Staging Sandbox</h4>
                      <p className="text-xs text-deep/60 mt-1">
                        Interactive staging environment to test web portals and operational dashboards.
                      </p>
                    </div>

                    <div className="mt-5">
                      {activeProject.liveUrl ? (
                        <a
                          href={activeProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-deep hover:bg-viol text-white font-bold text-xs px-5 py-3 rounded-xl transition-all inline-flex items-center gap-2 shadow"
                        >
                          <i className="fa-solid fa-arrow-up-right-from-square" /> Open Staging Environment
                        </a>
                      ) : (
                        <span className="text-xs text-deep/40 italic">
                          Staging sandbox link will be activated after milestone validation.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 2. SYSTEM DOCUMENTATION */}
            {activeTab === "docs" && (
              <div className="bg-white border border-deep/10 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8" id="printDocsArea">
                {/* DOCS HEADER */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-deep/10 pb-6">
                  <div>
                    <div className="text-[10px] font-mono text-viol uppercase tracking-widest font-bold">
                      OFFICIAL SYSTEM SPECIFICATION &amp; MANUAL
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-grotesk text-deep mt-1">
                      System Documentation: {activeProject.systemName}
                    </h3>
                    <p className="text-xs text-deep/60 mt-1">
                      Comprehensive technical architecture, administrative guide, and SLA prepared by Altraware Technology.
                    </p>
                  </div>

                  <button
                    onClick={handlePrintDocs}
                    className="bg-deep hover:bg-viol text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <i className="fa-solid fa-print" /> Download / Print Documentation (PDF)
                  </button>
                </div>

                {/* SECTION 1: OVERVIEW */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-viol flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-viol/15 text-viol flex items-center justify-center text-xs">1</span>
                    System Overview &amp; Objectives
                  </h4>
                  <div className="bg-[#fcfbfe] border border-deep/10 rounded-2xl p-5 text-xs text-deep/85 leading-relaxed whitespace-pre-line font-sans">
                    {activeProject.documentation.overview || "No overview specification added yet."}
                  </div>
                </div>

                {/* SECTION 2: ARCHITECTURE */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-blue-700 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs">2</span>
                    System Architecture &amp; Database Blueprint
                  </h4>
                  <div className="bg-[#f8fafc] border border-blue-200/60 rounded-2xl p-5 text-xs text-deep/85 leading-relaxed whitespace-pre-line font-sans">
                    {activeProject.documentation.architecture || "Technical architecture specifications pending final sign-off."}
                  </div>
                </div>

                {/* SECTION 3: USER GUIDE */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-emerald-700 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">3</span>
                    User &amp; Administrative Staff Manual
                  </h4>
                  <div className="bg-[#f0fdf4] border border-emerald-200/60 rounded-2xl p-5 text-xs text-deep/85 leading-relaxed whitespace-pre-line font-sans">
                    {activeProject.documentation.userGuide || "Standard operating guidelines will appear here."}
                  </div>
                </div>

                {/* SECTION 4: API & WEBHOOKS */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-purple-700 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-xs">4</span>
                    Integration Endpoints &amp; Webhooks
                  </h4>
                  <div className="bg-[#0f172a] text-slate-100 rounded-2xl p-5 text-xs font-mono leading-relaxed whitespace-pre-line shadow-inner">
                    {activeProject.documentation.apiEndpoints || "No public API endpoints published for this build."}
                  </div>
                </div>

                {/* SECTION 5: SLA & SUPPORT */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-amber-800 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs">5</span>
                    Service Level Agreement (SLA) &amp; Emergency Escalation
                  </h4>
                  <div className="bg-[#fefce8] border border-amber-200 rounded-2xl p-5 text-xs text-deep/85 leading-relaxed whitespace-pre-line font-sans">
                    {activeProject.documentation.slaSupport || "24/7 technical hotline & WhatsApp emergency escalation."}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 3. DELIVERABLES & VAULT */}
            {activeTab === "files" && (
              <div className="space-y-6">
                {/* CREDENTIALS HANDOVER VAULT */}
                {activeProject.adminCredentials && (
                  <div className="bg-amber-50/90 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
                      <i className="fa-solid fa-key text-amber-600" /> Administrative Access &amp; Credentials Vault
                    </div>
                    <p className="text-xs text-amber-800/80">
                      Initial access keys for your deployed system. Please update temporary passwords immediately upon first administrative sign-in.
                    </p>

                    <div className="grid sm:grid-cols-3 gap-4 pt-2">
                      <div className="bg-white border border-amber-200/80 rounded-xl p-3 shadow-xs">
                        <span className="text-[10px] font-mono text-deep/40 block">SYSTEM URL</span>
                        <a
                          href={activeProject.adminCredentials.portalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-mono text-viol hover:underline break-all"
                        >
                          {activeProject.adminCredentials.portalUrl || "—"}
                        </a>
                      </div>
                      <div className="bg-white border border-amber-200/80 rounded-xl p-3 shadow-xs">
                        <span className="text-[10px] font-mono text-deep/40 block">MASTER USERNAME</span>
                        <span className="text-xs font-mono text-deep font-bold">
                          {activeProject.adminCredentials.username || "—"}
                        </span>
                      </div>
                      <div className="bg-white border border-amber-200/80 rounded-xl p-3 shadow-xs">
                        <span className="text-[10px] font-mono text-deep/40 block">TEMPORARY PASSWORD</span>
                        <span className="text-xs font-mono text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded">
                          {activeProject.adminCredentials.tempPassword || "—"}
                        </span>
                      </div>
                    </div>

                    {activeProject.adminCredentials.note && (
                      <p className="text-[11px] text-amber-900 italic pt-1">
                        Note: {activeProject.adminCredentials.note}
                      </p>
                    )}
                  </div>
                )}

                {/* DELIVERABLES LIST */}
                <div className="bg-white border border-deep/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
                  <h3 className="text-base font-bold font-grotesk text-deep">
                    Project Deliverables &amp; Downloads
                  </h3>
                  <div className="space-y-3 pt-2">
                    {(activeProject.deliverables || []).map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-4 bg-[#fbfbfd] border border-deep/10 rounded-2xl hover:border-viol/30 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-viol/10 text-viol flex items-center justify-center text-base">
                            <i
                              className={`fa-solid ${
                                file.fileType === "apk"
                                  ? "fa-android text-emerald-600"
                                  : file.fileType === "pdf"
                                  ? "fa-file-pdf text-red-600"
                                  : "fa-file text-viol"
                              }`}
                            />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-deep">{file.name}</div>
                            <div className="text-[10px] font-mono text-deep/40">
                              {file.size ? `${file.size} • ` : ""}
                              {file.uploadedAt ? `Uploaded: ${file.uploadedAt}` : ""}
                            </div>
                          </div>
                        </div>

                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-deep hover:bg-viol text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <i className="fa-solid fa-download text-[11px]" /> Download
                        </a>
                      </div>
                    ))}

                    {(!activeProject.deliverables || activeProject.deliverables.length === 0) && (
                      <p className="text-xs text-deep/40 italic py-4">
                        No files uploaded yet. Deliverables will appear here as engineering phases conclude.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 4. FINANCE & PAYMENTS */}
            {activeTab === "finance" && (
              <div className="bg-white border border-deep/10 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
                <div>
                  <h3 className="text-lg font-bold font-grotesk text-deep">Financial Status &amp; Invoices</h3>
                  <p className="text-xs text-deep/60 mt-0.5">
                    Real-time summary of contract quotes, confirmed payments, and next milestone billing.
                  </p>
                </div>

                {/* SUMMARY STATS */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-[#fbfbfd] border border-deep/10 rounded-2xl p-5">
                    <span className="text-[10px] font-mono text-deep/40 uppercase block">TOTAL CONTRACT QUOTE</span>
                    <span className="text-xl font-extrabold text-deep font-mono mt-1 block">
                      {formatTsh(activeProject.totalAmount || 0)}
                    </span>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                    <span className="text-[10px] font-mono text-emerald-800 uppercase block">CONFIRMED PAYMENTS</span>
                    <span className="text-xl font-extrabold text-emerald-700 font-mono mt-1 block">
                      {formatTsh(activeProject.amountPaid || 0)}
                    </span>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                    <span className="text-[10px] font-mono text-amber-800 uppercase block">REMAINING BALANCE</span>
                    <span className="text-xl font-extrabold text-amber-700 font-mono mt-1 block">
                      {formatTsh((activeProject.totalAmount || 0) - (activeProject.amountPaid || 0))}
                    </span>
                  </div>
                </div>

                {/* PAYMENT INSTRUCTIONS */}
                <div className="bg-[#fbfbfd] border border-deep/10 rounded-2xl p-6 space-y-4">
                  <h4 className="text-xs font-bold text-deep font-mono uppercase tracking-widest">
                    Approved Official Payment Channels
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-xs">
                    {/* M-PESA */}
                    <div className="bg-white border border-deep/10 rounded-xl p-4 space-y-1 shadow-xs">
                      <div className="font-bold text-emerald-700 flex items-center gap-2">
                        <i className="fa-solid fa-mobile-screen" /> M-Pesa / Tigo Pesa (Lipa Namba)
                      </div>
                      <div className="font-mono text-deep text-sm pt-1">
                        Lipa Namba: <span className="font-bold text-emerald-600">5566778</span>
                      </div>
                      <div className="text-[11px] text-deep/60">
                        Business Name: <span className="text-deep font-semibold">ALTRAWARE TECHNOLOGY</span>
                      </div>
                    </div>

                    {/* BANK */}
                    <div className="bg-white border border-deep/10 rounded-xl p-4 space-y-1 shadow-xs">
                      <div className="font-bold text-blue-700 flex items-center gap-2">
                        <i className="fa-solid fa-building-columns" /> Bank Transfer (CRDB Bank)
                      </div>
                      <div className="font-mono text-deep text-sm pt-1">
                        A/C: <span className="font-bold text-blue-700">0150XXXXXXXXX</span>
                      </div>
                      <div className="text-[11px] text-deep/60">
                        Account Name: <span className="text-deep font-semibold">Altraware Technology Co.</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-deep/50 italic">
                    Upon completing milestone transfers, please forward the reference ID via WhatsApp for immediate automated receipt generation.
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 5. 24/7 SUPPORT */}
            {activeTab === "support" && (
              <div className="bg-white border border-deep/10 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-grotesk text-deep">Direct Engineering Support</h3>
                  <p className="text-xs text-deep/60 mt-0.5">
                    Connect directly with the software architects and engineering team assigned to your deployment.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* WHATSAPP HOTLINE */}
                  <a
                    href={`https://wa.me/255757939444?text=${encodeURIComponent(
                      `Hello Altraware Engineer, I am ${activeProject.clientName} regarding the ${activeProject.systemName} deployment. I require technical assistance.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366]/5 hover:bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-6 transition-all flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#25D366] text-white flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform shadow">
                      <i className="fa-brands fa-whatsapp" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-deep group-hover:text-[#25D366] transition-colors">
                        Chat with Engineer on WhatsApp
                      </div>
                      <div className="text-[11px] text-deep/60 mt-0.5 font-mono">+255 757 939 444</div>
                      <span className="text-[10px] text-emerald-600 font-bold block mt-1">Instant priority response →</span>
                    </div>
                  </a>

                  {/* DIRECT CALL */}
                  <a
                    href="tel:+255757939444"
                    className="bg-deep/5 hover:bg-deep/10 border border-deep/10 rounded-2xl p-6 transition-all flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-deep text-white flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform shadow">
                      <i className="fa-solid fa-phone" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-deep group-hover:text-viol transition-colors">
                        Direct Emergency Hotline
                      </div>
                      <div className="text-[11px] text-deep/60 mt-0.5 font-mono">+255 757 939 444</div>
                      <span className="text-[10px] text-viol font-bold block mt-1">Available 24/7 for active contracts →</span>
                    </div>
                  </a>
                </div>

                <div className="bg-[#f8f7fd] border border-viol/15 rounded-2xl p-5 text-xs text-deep/80 space-y-2">
                  <div className="font-bold text-deep flex items-center gap-2">
                    <i className="fa-solid fa-shield-halved text-emerald-600" />
                    30-Day Hypercare Commitment
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Every production platform deployed by Altraware includes 30 days of complimentary engineering hypercare post-launch. Our team actively monitors database queues, transaction sync logs, and peak load uptime.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
