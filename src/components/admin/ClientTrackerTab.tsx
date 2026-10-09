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

const STAGES: { id: ProjectStage; label: string; icon: string; desc: string }[] = [
  { id: "discovery", label: "Mahitaji (Discovery)", icon: "fa-clipboard-list", desc: "Kukusanya na kutathmini mahitaji ya mteja" },
  { id: "design", label: "Muundo (UI/UX Design)", icon: "fa-palette", desc: "Ubunifu wa mtiririko na vielelezo vya skrini" },
  { id: "development", label: "Utengenezaji (Build)", icon: "fa-code", desc: "Ujenzi wa programu, database na huduma za nje" },
  { id: "staging", label: "Majaribio (Staging & QA)", icon: "fa-vial", desc: "Majaribio ya pamoja, kupakia data na mafunzo" },
  { id: "live", label: "Umezinduliwa (Live & Handover)", icon: "fa-rocket", desc: "Mfumo uko hewani, makabidhiano na usaidizi wa 24/7" },
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
          overview: `Mfumo wa ${initialNewLead.systemName} uliotengenezwa mahsusi kwa ajili ya ${initialNewLead.clientName}.`,
          architecture: "Stack ya kisasa: Next.js / Flutter, PostgreSQL / SQLite na huduma salama za Cloud.",
          userGuide: "1. Fungua mfumo kupitia kiungo kilichotolewa.\n2. Weka jina la mtumiaji na nenosiri la awali.\n3. Badilisha nenosiri kwenye skrini ya Wasifu.",
          apiEndpoints: "REST API v1 na miunganisho ya malipo ya M-Pesa / ClickPesa.",
          slaSupport: "Msaada wa kiufundi: Saa 24/7 kwa simu na WhatsApp (+255 757 939 444).",
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
    notify("Mradi na nyaraka (documentation) zimehifadhiwa kwa mafanikio ✓", "success");
  };

  const handleDelete = async (id: string) => {
    if (!canManageNow()) {
      notify("Huna ruhusa — session ya admin imeisha. Ingia tena.", "error");
      return;
    }
    if (confirm("Je, una uhakika unataka kufuta mradi huu na nyaraka zake zote?")) {
      const updated = await deleteProject(id);
      setProjects(updated);
      if (activeProjectId === id) {
        setActiveProjectId(updated[0]?.id || null);
      }
      notify("Mradi umefutwa ✓", "info");
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
    notify(`Hatua ya mradi imesasishwa kuwa: ${STAGES[stageIndex].label} (${calculatedPercent}%) ✓`, "success");
  };

  return (
    <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-grotesk text-white">
            Ufuatiliaji wa Miradi na Nyaraka za Mifumo (Client Projects &amp; Docs)
          </h2>
          <p className="text-xs text-white/50 mt-1">
            Fuatilia hatua za utekelezaji (progress) za mifumo na toa mwongozo wa kiufundi (documentation, credentials, SLA) kwa kila mteja.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/portal"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all border border-white/15 flex items-center gap-2"
          >
            <i className="fa-solid fa-arrow-up-right-from-square text-violL" /> Fungua Client Portal ↗
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
            <i className="fa-solid fa-plus" /> Anzisha Mradi Mpya
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
          <i className="fa-solid fa-laptop-code text-4xl text-white/20 mb-3" />
          <p className="text-sm text-white/40">Hakuna miradi iliyorekodiwa bado. Bofya kitufe cha juu kuanzisha mradi wa kwanza.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[340px_1fr] gap-6 items-start">
          {/* LEFT LIST OF PROJECTS */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-white/40 font-bold px-1">
              Miradi Inayoendelea ({projects.length})
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
                      {activeProject.progressPercent}% Imekamilika
                    </span>
                  </div>
                  <div className="text-sm text-white/70 mt-1 flex items-center gap-4 flex-wrap">
                    <span>
                      <i className="fa-solid fa-user-tie text-white/40 mr-1.5" />
                      Mteja: <b className="text-white">{activeProject.clientName}</b>
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
                    title="Chapisha au onyesha nyaraka kamili za mfumo"
                  >
                    <i className="fa-solid fa-file-lines text-violL" /> Nyaraka / Docs
                  </button>
                  <button
                    onClick={() => {
                      setEditingProject(activeProject);
                      setShowEditModal(true);
                    }}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl bg-viol hover:bg-violD text-white transition-colors flex items-center gap-1.5"
                  >
                    <i className="fa-solid fa-pen" /> Hariri Mradi
                  </button>
                  <button
                    onClick={() => handleDelete(activeProject.id)}
                    className="text-xs text-white/40 hover:text-red-400 p-2 transition-colors"
                    title="Futa mradi"
                  >
                    <i className="fa-solid fa-trash" />
                  </button>
                </div>
              </div>

              {/* 5-STAGE MILESTONE PIPELINE */}
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-white/40 font-bold mb-3">
                  Mtiririko wa Hatua za Kazi (Project Milestones)
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
                      <i className="fa-solid fa-globe text-blue-400" /> Tovuti / Web Portal
                    </span>
                    {activeProject.liveUrl && (
                      <a
                        href={activeProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-violL hover:underline font-bold"
                      >
                        Fungua Tovuti →
                      </a>
                    )}
                  </div>
                  <p className="text-xs font-mono text-white/70 break-all">
                    {activeProject.liveUrl || "Bado haijawekwa hewani."}
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
                        Pakua APK →
                      </a>
                    )}
                  </div>
                  <p className="text-xs font-mono text-white/70 break-all">
                    {activeProject.apkDownloadUrl || "Hakuna faili la APK lililowekwa."}
                  </p>
                </div>
              </div>

              {/* CREDENTIALS HANDOVER */}
              {activeProject.adminCredentials && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <i className="fa-solid fa-key" /> Makabidhiano ya Akaunti (Admin Credentials Handover)
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3 text-xs pt-1">
                    <div>
                      <span className="text-white/40 block text-[10px]">URL ya Dashibodi:</span>
                      <span className="text-white font-mono">{activeProject.adminCredentials.portalUrl || "—"}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[10px]">Jina la Mtumiaji (Username):</span>
                      <span className="text-white font-mono">{activeProject.adminCredentials.username || "—"}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[10px]">Nenosiri la Awali (Temp Password):</span>
                      <span className="text-amber-200 font-mono font-bold bg-black/40 px-2 py-0.5 rounded">
                        {activeProject.adminCredentials.tempPassword || "—"}
                      </span>
                    </div>
                  </div>
                  {activeProject.adminCredentials.note && (
                    <p className="text-[11px] text-amber-300/80 italic pt-1">
                      Kumbuka: {activeProject.adminCredentials.note}
                    </p>
                  )}
                </div>
              )}

              {/* SYSTEM DOCUMENTATION SECTIONS */}
              <div className="space-y-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-white/40 font-bold">
                  Nyaraka za Mfumo (Comprehensive System Documentation)
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* OVERVIEW */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 space-y-1.5">
                    <h4 className="text-xs font-bold text-violL flex items-center gap-2">
                      <i className="fa-solid fa-circle-info" /> 1. Muhtasari wa Mfumo (Overview)
                    </h4>
                    <p className="text-xs text-white/80 leading-relaxed whitespace-pre-line font-sans">
                      {activeProject.documentation.overview || "Hakuna maelezo yaliyowekwa bado."}
                    </p>
                  </div>

                  {/* ARCHITECTURE */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 space-y-1.5">
                    <h4 className="text-xs font-bold text-blue-400 flex items-center gap-2">
                      <i className="fa-solid fa-network-wired" /> 2. Muundo wa Kiteknolojia (Architecture)
                    </h4>
                    <p className="text-xs text-white/80 leading-relaxed whitespace-pre-line font-sans">
                      {activeProject.documentation.architecture || "Hakuna maelezo ya kiteknolojia yaliyowekwa."}
                    </p>
                  </div>

                  {/* USER GUIDE */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 space-y-1.5">
                    <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                      <i className="fa-solid fa-book-open" /> 3. Mwongozo wa Watumiaji (User Guide)
                    </h4>
                    <p className="text-xs text-white/80 leading-relaxed whitespace-pre-line font-sans">
                      {activeProject.documentation.userGuide || "Hakuna hatua za watumiaji zilizowekwa."}
                    </p>
                  </div>

                  {/* API & SLA */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 space-y-1.5">
                    <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2">
                      <i className="fa-solid fa-shield-halved" /> 4. Usaidizi &amp; Makubaliano (SLA &amp; Support)
                    </h4>
                    <p className="text-xs text-white/80 leading-relaxed whitespace-pre-line font-sans">
                      {activeProject.documentation.slaSupport || "Huduma ya usaidizi wa kiufundi 24/7."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* EDIT / CREATE PROJECT MODAL */}
      {showEditModal && editingProject && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-deep/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0e101f] border border-white/15 rounded-3xl max-w-2xl w-full p-6 text-white shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-5 right-5 text-white/40 hover:text-white"
            >
              <i className="fa-solid fa-xmark text-lg" />
            </button>

            <h3 className="text-lg font-bold font-grotesk mb-1">
              {editingProject.clientName ? "Hariri Mradi & Nyaraka" : "Anzisha Mradi Mpya wa Mteja"}
            </h3>
            <p className="text-xs text-white/50 mb-5">
              Weka taarifa za mfumo, hatua inayofikiwa, credentials za makabidhiano na mwongozo wa mfumo.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Jina la Mteja / Kampuni *</label>
                  <input
                    type="text"
                    value={editingProject.clientName}
                    onChange={(e) => setEditingProject({ ...editingProject, clientName: e.target.value })}
                    required
                    placeholder="mf. Kariakoo Wholesalers Ltd"
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-viol"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Jina la Mfumo (System Name) *</label>
                  <input
                    type="text"
                    value={editingProject.systemName}
                    onChange={(e) => setEditingProject({ ...editingProject, systemName: e.target.value })}
                    required
                    placeholder="mf. Faida POS — Multi-Branch"
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-viol"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Namba ya Simu ya Mteja *</label>
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
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Barua Pepe ya Mteja</label>
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
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Hatua ya Mradi (Stage)</label>
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
                    Maendeleo: {editingProject.progressPercent}%
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
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Jina la Kampuni</label>
                  <input
                    type="text"
                    value={editingProject.company || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, company: e.target.value })}
                    placeholder="e.g. Kariakoo Ltd"
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-viol"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Gharama ya Mfumo (Quote TSh)</label>
                  <input
                    type="number"
                    value={editingProject.totalAmount || 0}
                    onChange={(e) => setEditingProject({ ...editingProject, totalAmount: Number(e.target.value) })}
                    placeholder="1200000"
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-viol font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Kiasi Kilicholipwa (Paid TSh)</label>
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
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Tovuti / Live URL</label>
                  <input
                    type="text"
                    value={editingProject.liveUrl || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                    placeholder="https://client-portal.co.tz"
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-viol"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Kiungo cha APK (Flutter/Android)</label>
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={editingProject.apkDownloadUrl || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, apkDownloadUrl: e.target.value })}
                      placeholder="https://... faida.pos.apk"
                      className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-viol"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/40">au pakia faili kutoka PC/simu:</span>
                      <CloudinaryUploader
                        compact
                        value={editingProject.apkDownloadUrl}
                        onChange={(url) => setEditingProject({ ...editingProject, apkDownloadUrl: url })}
                        label="Chagua Faili (PC)"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CREDENTIALS SECTION */}
              <div className="border border-white/10 rounded-xl p-3 bg-white/[0.02] space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                  Makabidhiano ya Akaunti (Admin Credentials)
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
                  Nyaraka &amp; Miongozo ya Mfumo (Documentation)
                </span>
                <div>
                  <label className="text-[10px] text-white/50 block mb-1">1. Muhtasari wa Mfumo (Overview)</label>
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
                  <label className="text-[10px] text-white/50 block mb-1">2. Mwongozo wa Watumiaji (User Guide)</label>
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
                  <label className="text-[10px] text-white/50 block mb-1">3. Usaidizi na SLA (24/7 Support Terms)</label>
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
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-viol hover:bg-violD text-white font-bold text-xs shadow-lg shadow-viol/20"
                >
                  Hifadhi Mradi &amp; Nyaraka
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT / VIEW DOCUMENTATION MODAL */}
      {printDocProject && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-deep/85 backdrop-blur-md">
          <div className="bg-[#0f1122] border border-white/20 rounded-3xl max-w-3xl w-full p-8 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-violL uppercase font-bold">
                  ALTRAWARE TECHNOLOGY · SYSTEM DOCUMENTATION
                </span>
                <h3 className="text-2xl font-bold font-grotesk mt-0.5">{printDocProject.systemName}</h3>
                <p className="text-xs text-white/50">Mteja: {printDocProject.clientName} · Tarehe: {new Date().toLocaleDateString("sw-TZ")}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-viol hover:bg-violD text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-print" /> Chapisha (Print)
                </button>
                <button
                  onClick={() => setPrintDocProject(null)}
                  className="text-white/40 hover:text-white p-2"
                >
                  <i className="fa-solid fa-xmark text-lg" />
                </button>
              </div>
            </div>

            <div className="space-y-6 text-sm text-white/90">
              <div>
                <h4 className="font-bold text-violL text-xs uppercase tracking-wider mb-2 font-mono">1. Muhtasari wa Mfumo</h4>
                <div className="bg-white/[0.03] p-4 rounded-xl border border-white/10 text-xs leading-relaxed whitespace-pre-line font-sans">
                  {printDocProject.documentation.overview}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-blue-400 text-xs uppercase tracking-wider mb-2 font-mono">2. Muundo wa Kiteknolojia (Architecture)</h4>
                <div className="bg-white/[0.03] p-4 rounded-xl border border-white/10 text-xs leading-relaxed whitespace-pre-line font-sans">
                  {printDocProject.documentation.architecture}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wider mb-2 font-mono">3. Mwongozo wa Awali wa Mtumiaji</h4>
                <div className="bg-white/[0.03] p-4 rounded-xl border border-white/10 text-xs leading-relaxed whitespace-pre-line font-sans">
                  {printDocProject.documentation.userGuide}
                </div>
              </div>

              {printDocProject.adminCredentials && (
                <div>
                  <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider mb-2 font-mono">4. Akaunti &amp; Makabidhiano</h4>
                  <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 text-xs grid sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-white/50 block text-[10px]">Portal URL:</span>
                      <span className="font-mono text-white">{printDocProject.adminCredentials.portalUrl}</span>
                    </div>
                    <div>
                      <span className="text-white/50 block text-[10px]">Username:</span>
                      <span className="font-mono text-white">{printDocProject.adminCredentials.username}</span>
                    </div>
                    <div>
                      <span className="text-white/50 block text-[10px]">Nenosiri:</span>
                      <span className="font-mono text-amber-200 font-bold">{printDocProject.adminCredentials.tempPassword}</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-bold text-purple-400 text-xs uppercase tracking-wider mb-2 font-mono">5. Mkataba wa Usaidizi (SLA &amp; Support)</h4>
                <div className="bg-white/[0.03] p-4 rounded-xl border border-white/10 text-xs leading-relaxed whitespace-pre-line font-sans">
                  {printDocProject.documentation.slaSupport}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
