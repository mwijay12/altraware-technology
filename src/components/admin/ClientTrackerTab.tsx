"use client";

import { useEffect, useState } from "react";
import {
  type ClientProject,
  type ProjectStage,
  fetchAllProjects,
  saveProject,
  deleteProject,
  DEFAULT_MILESTONES,
} from "@/lib/client-projects";
import CloudinaryUploader from "@/components/ui/CloudinaryUploader";
import { canManageNow } from "@/lib/admin-session";
import { useLockBodyScroll } from "@/components/motion";
import { downloadSystemDocPdf } from "@/lib/system-doc-pdf";

const STAGES: { id: ProjectStage; label: string; icon: string; desc: string }[] = [
  { id: "discovery", label: "Discovery", icon: "fa-clipboard-list", desc: "Gather and assess client requirements" },
  { id: "design", label: "Design (UI/UX)", icon: "fa-palette", desc: "Flow and screen mockups" },
  { id: "development", label: "Build", icon: "fa-code", desc: "App, database and external integrations" },
  { id: "staging", label: "Staging & QA", icon: "fa-vial", desc: "Joint testing, data loading and training" },
  { id: "live", label: "Live & Handover", icon: "fa-rocket", desc: "System is live, handover plus 24/7 support" },
];

export default function ClientTrackerTab({
  notify,
  initialNewLead,
}: {
  notify: (msg: string, type: "success" | "error" | "info") => void;
  initialNewLead?: { clientName: string; clientPhone: string; clientEmail?: string; systemName: string } | null;
}) {
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ClientProject | null>(null);
  const [printDocProject, setPrintDocProject] = useState<ClientProject | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Lock background scroll while any modal is open — wheel stays inside the dialog card
  useLockBodyScroll(showEditModal || printDocProject !== null);

  // Close modals with ESC (English admin console)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowEditModal(false);
        setPrintDocProject(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleDownloadDocPdf = async (project: ClientProject) => {
    setDownloadingPdf(true);
    try {
      await downloadSystemDocPdf(project);
      notify("System documentation PDF downloaded ✓", "success");
    } catch {
      notify("PDF download failed — please try again.", "error");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllProjects();
      setProjects(data);
      if (data.length > 0 && !activeProjectId) {
        setActiveProjectId(data[0].id);
      }
    } catch {
      notify("Failed to load projects", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle incoming lead conversion
  useEffect(() => {
    if (initialNewLead) {
      const newProj: ClientProject = {
        id: "proj-" + Date.now(),
        clientName: initialNewLead.clientName,
        clientPhone: initialNewLead.clientPhone,
        clientEmail: initialNewLead.clientEmail || "",
        systemName: initialNewLead.systemName,
        stage: "discovery",
        progressPercent: 15,
        startDate: new Date().toISOString().split("T")[0],
        targetLaunchDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split("T")[0],
        documentation: {
          overview: `A custom ${initialNewLead.systemName} system built for ${initialNewLead.clientName}.`,
          architecture: "Modern stack: Next.js / Flutter, PostgreSQL / SQLite with secure cloud services.",
          userGuide: "1. Open the system via the provided link.\n2. Sign in with the initial username and password.\n3. Change the password on the Profile screen.",
          apiEndpoints: "REST API v1 with M-Pesa / ClickPesa payment integrations.",
          slaSupport: "Technical support: 24/7 by phone and WhatsApp (+255 757 939 444).",
        },
        updatedAt: new Date().toISOString(),
      };
      setEditingProject(newProj);
      setShowEditModal(true);
    }
  }, [initialNewLead]);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const updated = await saveProject(editingProject);
    setProjects(updated);
    setActiveProjectId(editingProject.id);
    setShowEditModal(false);
    setEditingProject(null);
    notify("Project & documentation saved ✓", "success");
  };

  const handleDelete = async (id: string) => {
    if (!canManageNow()) {
      notify("No permission — admin session expired. Please sign in again.", "error");
      return;
    }
    if (confirm("Are you sure you want to delete this project and all its documents?")) {
      const updated = await deleteProject(id);
      setProjects(updated);
      if (activeProjectId === id) {
        setActiveProjectId(updated[0]?.id || null);
      }
      notify("Project deleted ✓", "info");
    }
  };

  const handleStageSelect = async (projectId: string, stage: ProjectStage) => {
    const proj = projects.find((p) => p.id === projectId);
    if (!proj) return;
    const stageIndex = STAGES.findIndex((s) => s.id === stage);
    const calculatedPercent = Math.min(100, Math.max(10, Math.round(((stageIndex + 1) / STAGES.length) * 100)));
    const updatedProj = { ...proj, stage, progressPercent: calculatedPercent };
    const updated = await saveProject(updatedProj);
    setProjects(updated);
    notify(`Project stage updated to: ${STAGES[stageIndex].label} (${calculatedPercent}%) ✓`, "success");
  };

  return (
    <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-grotesk text-white">
            Client Projects &amp; System Docs
          </h2>
          <p className="text-xs text-white/50 mt-1">
            Track build progress and publish technical documentation, credentials and SLAs for every client.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/portal"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all border border-white/15 flex items-center gap-2"
          >
            <i className="fa-solid fa-arrow-up-right-from-square text-violL" /> Open Client Portal ↗
          </a>
          <button
            onClick={() => loadData()}
            className="text-xs font-bold px-3 py-2 rounded-xl border border-white/15 text-white/70 hover:text-white transition-colors flex items-center gap-2"
          >
            <i className={`fa-solid fa-arrows-rotate ${loading ? "fa-spin" : ""}`} /> Refresh
          </button>
          <button
            onClick={() => {
              setEditingProject({
                id: "proj-" + Date.now(),
                clientName: "",
                clientPhone: "+255 ",
                systemName: "",
                stage: "discovery",
                progressPercent: 20,
                totalAmount: 1200000,
                amountPaid: 600000,
                startDate: new Date().toISOString().split("T")[0],
                targetLaunchDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split("T")[0],
                milestones: DEFAULT_MILESTONES,
                documentation: {
                  overview: "",
                  architecture: "",
                  userGuide: "",
                  apiEndpoints: "",
                  slaSupport: "",
                },
                updatedAt: new Date().toISOString(),
              });
              setShowEditModal(true);
            }}
            className="bg-viol hover:bg-violD text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-viol/20 flex items-center gap-2"
          >
            <i className="fa-solid fa-plus" /> New Project
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
          <i className="fa-solid fa-laptop-code text-4xl text-white/20 mb-3" />
          <p className="text-sm text-white/40">No projects recorded yet. Use the button above to start the first project.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[340px_1fr] gap-6 items-start">
          {/* LEFT LIST OF PROJECTS */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-white/40 font-bold px-1">
              Active Projects ({projects.length})
            </div>
            {projects.map((proj) => {
              const isSelected = proj.id === activeProject?.id;
              const currentStage = STAGES.find((s) => s.id === proj.stage);

              return (
                <div
                  key={proj.id}
                  onClick={() => setActiveProjectId(proj.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-white/[0.08] border-viol shadow-lg shadow-viol/10"
                      : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-white line-clamp-1">{proj.systemName}</h3>
                    <span className="text-xs font-mono font-bold text-violL shrink-0">
                      {proj.progressPercent}%
                    </span>
                  </div>
                  <div className="text-xs text-white/60 mt-0.5">{proj.clientName}</div>

                  {/* MINI PROGRESS BAR */}
                  <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-viol to-violL rounded-full transition-all duration-500"
                      style={{ width: `${proj.progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-white/40 mt-2">
                    <span className="flex items-center gap-1.5 text-white/70">
                      <i className={`fa-solid ${currentStage?.icon} text-violL text-[10px]`} />
                      {currentStage?.label.split(" ")[0]}
                    </span>
                    <span>T Launch: {proj.targetLaunchDate}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT PROJECT DETAILS & DOCUMENTATION VIEWER */}
          {activeProject && (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-6">
              {/* TOP HEADER */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-bold font-grotesk text-white">{activeProject.systemName}</h3>
                    <span className="text-xs bg-viol/20 text-violL border border-viol/30 font-semibold px-2.5 py-0.5 rounded-full">
                      {activeProject.progressPercent}% Complete
                    </span>
                  </div>
                  <div className="text-sm text-white/70 mt-1 flex items-center gap-4 flex-wrap">
                    <span>
                      <i className="fa-solid fa-user-tie text-white/40 mr-1.5" />
                      Client: <b className="text-white">{activeProject.clientName}</b>
                    </span>
                    <span>
                      <i className="fa-solid fa-phone text-white/40 mr-1.5" />
                      {activeProject.clientPhone}
                    </span>
                    {activeProject.clientEmail && (
                      <span>
                        <i className="fa-regular fa-envelope text-white/40 mr-1.5" />
                        {activeProject.clientEmail}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPrintDocProject(activeProject)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5"
                    title="Print or view the full system documents"
                  >
                    <i className="fa-solid fa-file-lines text-violL" /> Docs
                  </button>
                  <button
                    onClick={() => {
                      setEditingProject(activeProject);
                      setShowEditModal(true);
                    }}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl bg-viol hover:bg-violD text-white transition-colors flex items-center gap-1.5"
                  >
                    <i className="fa-solid fa-pen" /> Edit Project
                  </button>
                  <button
                    onClick={() => handleDelete(activeProject.id)}
                    className="text-xs text-white/40 hover:text-red-400 p-2 transition-colors"
                    title="Delete project"
                  >
                    <i className="fa-solid fa-trash" />
                  </button>
                </div>
              </div>

              {/* 5-STAGE MILESTONE PIPELINE */}
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-white/40 font-bold mb-3">
                  Project Milestones
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {STAGES.map((s, idx) => {
                    const isPassed =
                      STAGES.findIndex((st) => st.id === activeProject.stage) >= idx;
                    const isCurrent = activeProject.stage === s.id;

                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleStageSelect(activeProject.id, s.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isCurrent
                            ? "bg-viol/20 border-viol text-white shadow-md shadow-viol/20 ring-1 ring-viol"
                            : isPassed
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                            : "bg-white/[0.02] border-white/10 text-white/40 hover:border-white/30"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <i
                            className={`fa-solid ${s.icon} text-sm ${
                              isCurrent ? "text-violL" : isPassed ? "text-emerald-400" : "text-white/30"
                            }`}
                          />
                          <span className="text-[10px] font-mono font-bold opacity-60">0{idx + 1}</span>
                        </div>
                        <div className="text-xs font-bold leading-tight line-clamp-1">{s.label.split(" ")[0]}</div>
                        <div className="text-[10px] opacity-60 mt-0.5 line-clamp-1">{s.label.split("(")[1]?.replace(")", "") || ""}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* QUICK LINKS & ACCESS */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* LIVE WEB LINK */}
                <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <i className="fa-solid fa-globe text-blue-400" /> Website / Web Portal
                    </span>
                    {activeProject.liveUrl && (
                      <a
                        href={activeProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-violL hover:underline font-bold"
                      >
                        Open Website →
                      </a>
                    )}
                  </div>
                  <p className="text-xs font-mono text-white/70 break-all">
                    {activeProject.liveUrl || "Not published yet."}
                  </p>
                </div>

                {/* APK DOWNLOAD LINK */}
                <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <i className="fa-brands fa-android text-emerald-400" /> Android APK Release
                    </span>
                    {activeProject.apkDownloadUrl && (
                      <a
                        href={activeProject.apkDownloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-emerald-400 hover:underline font-bold"
                      >
                        Download APK →
                      </a>
                    )}
                  </div>
                  <p className="text-xs font-mono text-white/70 break-all">
                    {activeProject.apkDownloadUrl || "No APK file uploaded."}
                  </p>
                </div>
              </div>

              {/* CREDENTIALS HANDOVER */}
              {activeProject.adminCredentials && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <i className="fa-solid fa-key" /> Account Handover (Admin Credentials)
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3 text-xs pt-1">
                    <div>
                      <span className="text-white/40 block text-[10px]">Dashboard URL:</span>
                      <span className="text-white font-mono">{activeProject.adminCredentials.portalUrl || "—"}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[10px]">Username:</span>
                      <span className="text-white font-mono">{activeProject.adminCredentials.username || "—"}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[10px]">Temp Password:</span>
                      <span className="text-amber-200 font-mono font-bold bg-black/40 px-2 py-0.5 rounded">
                        {activeProject.adminCredentials.tempPassword || "—"}
                      </span>
                    </div>
                  </div>
                  {activeProject.adminCredentials.note && (
                    <p className="text-[11px] text-amber-300/80 italic pt-1">
                      Note: {activeProject.adminCredentials.note}
                    </p>
                  )}
                </div>
              )}

              {/* SYSTEM DOCUMENTATION SECTIONS */}
              <div className="space-y-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-white/40 font-bold">
                  System Documentation
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* OVERVIEW */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 space-y-1.5">
                    <h4 className="text-xs font-bold text-violL flex items-center gap-2">
                      <i className="fa-solid fa-circle-info" /> 1. System Overview
                    </h4>
                    <p className="text-xs text-white/80 leading-relaxed whitespace-pre-line font-sans">
                      {activeProject.documentation.overview || "No overview written yet."}
                    </p>
                  </div>

                  {/* ARCHITECTURE */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 space-y-1.5">
                    <h4 className="text-xs font-bold text-blue-400 flex items-center gap-2">
                      <i className="fa-solid fa-network-wired" /> 2. Technical Architecture
                    </h4>
                    <p className="text-xs text-white/80 leading-relaxed whitespace-pre-line font-sans">
                      {activeProject.documentation.architecture || "No technical details written yet."}
                    </p>
                  </div>

                  {/* USER GUIDE */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 space-y-1.5">
                    <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                      <i className="fa-solid fa-book-open" /> 3. User Guide
                    </h4>
                    <p className="text-xs text-white/80 leading-relaxed whitespace-pre-line font-sans">
                      {activeProject.documentation.userGuide || "No user steps written yet."}
                    </p>
                  </div>

                  {/* API & SLA */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 space-y-1.5">
                    <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2">
                      <i className="fa-solid fa-shield-halved" /> 4. SLA &amp; Support
                    </h4>
                    <p className="text-xs text-white/80 leading-relaxed whitespace-pre-line font-sans">
                      {activeProject.documentation.slaSupport || "24/7 technical support."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* EDIT / CREATE PROJECT MODAL — scroll stays INSIDE the card */}
      {showEditModal && editingProject && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-hidden">
          <div
            className="absolute inset-0 bg-deep/80 backdrop-blur-md"
            onClick={() => setShowEditModal(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={editingProject.clientName ? "Edit project and documentation" : "New client project"}
            className="relative bg-[#0e101f] border border-white/15 rounded-3xl max-w-2xl w-full p-6 text-white shadow-2xl max-h-[90vh] md:max-h-[85vh] overflow-y-auto overscroll-contain"
            onWheel={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-5 right-5 text-white/40 hover:text-white"
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark text-lg" />
            </button>

            <h3 className="text-lg font-bold font-grotesk mb-1">
              {editingProject.clientName ? "Edit Project & Documentation" : "New Client Project"}
            </h3>
            <p className="text-xs text-white/50 mb-5">
              Enter the system details, delivery stage reached, handover credentials and the system guide.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Client / Company Name *</label>
                  <input
                    type="text"
                    value={editingProject.clientName}
                    onChange={(e) => setEditingProject({ ...editingProject, clientName: e.target.value })}
                    required
                    placeholder="e.g. Kariakoo Wholesalers Ltd"
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-viol"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">System Name *</label>
                  <input
                    type="text"
                    value={editingProject.systemName}
                    onChange={(e) => setEditingProject({ ...editingProject, systemName: e.target.value })}
                    required
                    placeholder="e.g. Faida POS — Multi-Branch"
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-viol"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Client Phone *</label>
                  <input
                    type="text"
                    value={editingProject.clientPhone}
                    onChange={(e) => setEditingProject({ ...editingProject, clientPhone: e.target.value })}
                    required
                    placeholder="+255 754 ..."
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-viol"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Client Email</label>
                  <input
                    type="email"
                    value={editingProject.clientEmail || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, clientEmail: e.target.value })}
                    placeholder="manager@client.tz"
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-viol"
                  />
                </div>
              </div>

              {/* STAGE & PERCENT */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Project Stage</label>
                  <select
                    value={editingProject.stage}
                    onChange={(e) => setEditingProject({ ...editingProject, stage: e.target.value as ProjectStage })}
                    className="w-full bg-[#14172b] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-viol"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">
                    Progress: {editingProject.progressPercent}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={editingProject.progressPercent}
                    onChange={(e) => setEditingProject({ ...editingProject, progressPercent: Number(e.target.value) })}
                    className="w-full accent-purple-500 mt-2"
                  />
                </div>
              </div>

              {/* COMPANY & FINANCIAL AMOUNTS */}
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Company Name</label>
                  <input
                    type="text"
                    value={editingProject.company || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, company: e.target.value })}
                    placeholder="e.g. Kariakoo Ltd"
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-viol"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Quoted Price (TSh)</label>
                  <input
                    type="number"
                    value={editingProject.totalAmount || 0}
                    onChange={(e) => setEditingProject({ ...editingProject, totalAmount: Number(e.target.value) })}
                    placeholder="1200000"
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-viol font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Amount Paid (TSh)</label>
                  <input
                    type="number"
                    value={editingProject.amountPaid || 0}
                    onChange={(e) => setEditingProject({ ...editingProject, amountPaid: Number(e.target.value) })}
                    placeholder="600000"
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-viol font-mono"
                  />
                </div>
              </div>

              {/* LINKS & CLOUDINARY UPLOAD */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Website / Live URL</label>
                  <input
                    type="text"
                    value={editingProject.liveUrl || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                    placeholder="https://client-portal.co.tz"
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-viol"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">APK Link (Flutter/Android)</label>
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={editingProject.apkDownloadUrl || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, apkDownloadUrl: e.target.value })}
                      placeholder="https://... faida.pos.apk"
                      className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-viol"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/40">or upload a file from PC/phone:</span>
                      <CloudinaryUploader
                        compact
                        value={editingProject.apkDownloadUrl}
                        onChange={(url) => setEditingProject({ ...editingProject, apkDownloadUrl: url })}
                        label="Choose File (PC)"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CREDENTIALS SECTION */}
              <div className="border border-white/10 rounded-xl p-3 bg-white/[0.02] space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                  Account Handover (Admin Credentials)
                </span>
                <div className="grid sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={editingProject.adminCredentials?.portalUrl || ""}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        adminCredentials: { ...editingProject.adminCredentials, portalUrl: e.target.value },
                      })
                    }
                    placeholder="Portal URL"
                    className="bg-black/30 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={editingProject.adminCredentials?.username || ""}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        adminCredentials: { ...editingProject.adminCredentials, username: e.target.value },
                      })
                    }
                    placeholder="Username"
                    className="bg-black/30 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={editingProject.adminCredentials?.tempPassword || ""}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        adminCredentials: { ...editingProject.adminCredentials, tempPassword: e.target.value },
                      })
                    }
                    placeholder="Temp Password"
                    className="bg-black/30 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* DOCUMENTATION EDITORS */}
              <div className="space-y-3 pt-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white/50 block">
                  System Documentation
                </span>
                <div>
                  <label className="text-[10px] text-white/50 block mb-1">1. System Overview</label>
                  <textarea
                    rows={2}
                    value={editingProject.documentation.overview}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        documentation: { ...editingProject.documentation, overview: e.target.value },
                      })
                    }
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-viol"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 block mb-1">2. User Guide</label>
                  <textarea
                    rows={3}
                    value={editingProject.documentation.userGuide}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        documentation: { ...editingProject.documentation, userGuide: e.target.value },
                      })
                    }
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-viol"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/50 block mb-1">3. Support &amp; SLA Terms</label>
                  <textarea
                    rows={2}
                    value={editingProject.documentation.slaSupport}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        documentation: { ...editingProject.documentation, slaSupport: e.target.value },
                      })
                    }
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-viol"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white/70 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-viol hover:bg-violD text-white font-bold text-xs shadow-lg shadow-viol/20"
                >
                  Save Project &amp; Documentation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SYSTEM DOCUMENTATION MODAL — clean paper, scroll stays INSIDE the card */}
      {printDocProject && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 overflow-hidden">
          <div
            className="absolute inset-0 bg-deep/85 backdrop-blur-md"
            onClick={() => setPrintDocProject(null)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`System documentation for ${printDocProject.systemName}`}
            onWheel={(e) => e.stopPropagation()}
            className="relative bg-white text-deep rounded-3xl max-w-3xl w-full shadow-2xl max-h-[90vh] md:max-h-[85vh] overflow-y-auto overscroll-contain"
          >
            {/* Toolbar — sticky so actions stay reachable while the paper scrolls */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-deep/10 px-6 sm:px-8 py-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Altraware" className="w-9 h-9 rounded-xl object-contain bg-deep p-1 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] font-mono tracking-[0.2em] text-viol font-bold uppercase">
                    Altraware Technology · System Documentation
                  </div>
                  <div className="text-sm font-bold font-grotesk truncate">{printDocProject.systemName}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => void handleDownloadDocPdf(printDocProject)}
                  disabled={downloadingPdf}
                  className="bg-viol hover:bg-violD disabled:opacity-60 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <i className={`fa-solid ${downloadingPdf ? "fa-circle-notch fa-spin" : "fa-file-arrow-down"}`} />
                  {downloadingPdf ? "Preparing…" : "Download PDF"}
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-deep/5 hover:bg-deep/10 border border-deep/15 text-deep text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-print" /> Print
                </button>
                <button
                  onClick={() => setPrintDocProject(null)}
                  className="text-deep/40 hover:text-deep p-2"
                  aria-label="Close"
                >
                  <i className="fa-solid fa-xmark text-lg" />
                </button>
              </div>
            </div>

            {/* Clean paper body — this is what prints */}
            <div id="system-doc-paper" className="px-6 sm:px-8 py-6 sm:py-8">
              <div className="bg-deep text-white rounded-2xl px-5 py-4 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="" className="w-10 h-10 rounded-xl object-contain bg-white/10 p-1 shrink-0" />
                <div className="min-w-0">
                  <div className="font-grotesk font-extrabold tracking-tight text-sm">ALTRAWARE TECHNOLOGY</div>
                  <div className="text-[10px] font-mono tracking-[0.2em] text-violL uppercase">Official system documentation</div>
                </div>
                <div className="ml-auto text-right shrink-0">
                  <div className="text-[10px] font-mono text-white/60">PROGRESS</div>
                  <div className="font-grotesk font-extrabold text-lg">{printDocProject.progressPercent}%</div>
                </div>
              </div>

              <h3 className="text-2xl font-bold font-grotesk mt-5 text-deep">{printDocProject.systemName || "Untitled System"}</h3>
              <p className="text-xs text-deep/60 mt-1">
                Client: <span className="font-semibold text-deep">{printDocProject.clientName || "—"}</span>
                {printDocProject.company ? ` · ${printDocProject.company}` : ""} · Date: {new Date().toLocaleDateString("en-GB")}
              </p>
              <p className="text-xs text-deep/60 mt-0.5">
                Contact: {printDocProject.clientPhone || "—"}
                {printDocProject.clientEmail ? ` · ${printDocProject.clientEmail}` : ""} · Target launch: {printDocProject.targetLaunchDate || "—"}
              </p>

              <div className="mt-6 space-y-6 text-sm">
                <div>
                  <h4 className="font-bold text-viol text-xs uppercase tracking-wider mb-2 font-mono">01 · System overview</h4>
                  <div className="bg-[#faf9ff] p-4 rounded-xl border border-viol/15 text-xs leading-relaxed whitespace-pre-line text-deep/85">
                    {printDocProject.documentation.overview || "Not documented yet."}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-blue-700 text-xs uppercase tracking-wider mb-2 font-mono">02 · Technical architecture</h4>
                  <div className="bg-[#f8fafc] p-4 rounded-xl border border-blue-200/70 text-xs leading-relaxed whitespace-pre-line text-deep/85">
                    {printDocProject.documentation.architecture || "Not documented yet."}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-emerald-700 text-xs uppercase tracking-wider mb-2 font-mono">03 · User guide</h4>
                  <div className="bg-[#f0fdf4] p-4 rounded-xl border border-emerald-200/70 text-xs leading-relaxed whitespace-pre-line text-deep/85">
                    {printDocProject.documentation.userGuide || "Not documented yet."}
                  </div>
                </div>

                {printDocProject.documentation.apiEndpoints?.trim() && (
                  <div>
                    <h4 className="font-bold text-purple-700 text-xs uppercase tracking-wider mb-2 font-mono">04 · Integration endpoints</h4>
                    <div className="bg-[#0f172a] text-slate-100 p-4 rounded-xl text-xs font-mono leading-relaxed whitespace-pre-line">
                      {printDocProject.documentation.apiEndpoints}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-bold text-amber-700 text-xs uppercase tracking-wider mb-2 font-mono">
                    {printDocProject.documentation.apiEndpoints?.trim() ? "05" : "04"} · Accounts &amp; handover
                  </h4>
                  {printDocProject.adminCredentials &&
                  (printDocProject.adminCredentials.portalUrl ||
                    printDocProject.adminCredentials.username ||
                    printDocProject.adminCredentials.tempPassword) ? (
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs grid sm:grid-cols-3 gap-3">
                      <div>
                        <span className="text-deep/50 block text-[10px] font-mono">PORTAL URL</span>
                        <span className="font-mono text-deep break-all">{printDocProject.adminCredentials.portalUrl || "—"}</span>
                      </div>
                      <div>
                        <span className="text-deep/50 block text-[10px] font-mono">USERNAME</span>
                        <span className="font-mono text-deep font-semibold">{printDocProject.adminCredentials.username || "—"}</span>
                      </div>
                      <div>
                        <span className="text-deep/50 block text-[10px] font-mono">TEMP PASSWORD</span>
                        <span className="font-mono text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded">
                          {printDocProject.adminCredentials.tempPassword || "—"}
                        </span>
                      </div>
                      {printDocProject.adminCredentials.note && (
                        <p className="text-[11px] text-amber-900 italic sm:col-span-3">Note: {printDocProject.adminCredentials.note}</p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-deep/[0.03] p-4 rounded-xl border border-deep/10 text-xs text-deep/50 italic">
                      No handover credentials recorded yet.
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-deep text-xs uppercase tracking-wider mb-2 font-mono">
                    {printDocProject.documentation.apiEndpoints?.trim() ? "06" : "05"} · Support agreement (SLA)
                  </h4>
                  <div className="bg-deep/[0.03] p-4 rounded-xl border border-deep/10 text-xs leading-relaxed whitespace-pre-line text-deep/85">
                    {printDocProject.documentation.slaSupport || "24/7 technical support by phone and WhatsApp (+255 757 939 444)."}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-deep/10 text-center text-[10px] font-mono text-deep/40">
                Altraware Technology · Dar es Salaam, Tanzania · Official handover document
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
