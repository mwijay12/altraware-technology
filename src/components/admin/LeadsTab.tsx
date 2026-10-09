"use client";

import { useEffect, useState } from "react";
import {
  type SystemInquiry,
  fetchAllInquiries,
  updateInquiry,
  removeInquiry,
  createInquiry,
} from "@/lib/leads";
import { canManageNow } from "@/lib/admin-session";

const STATUS_CONFIG: Record<
  SystemInquiry["status"],
  { label: string; bg: string; text: string; border: string }
> = {
  new: { label: "MPYA (New)", bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30" },
  contacted: { label: "Amepewa Jibu (Contacted)", bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/30" },
  in_progress: { label: "Inashughulikiwa (In Progress)", bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" },
  converted: { label: "Imekuwa Mradi (Converted)", bg: "bg-purple-500/15", text: "text-purple-400", border: "border-purple-500/30" },
  closed: { label: "Imefungwa (Closed)", bg: "bg-slate-500/15", text: "text-slate-400", border: "border-slate-500/30" },
};

export default function LeadsTab({
  notify,
  onConvertToProject,
}: {
  notify: (msg: string, type: "success" | "error" | "info") => void;
  onConvertToProject?: (lead: SystemInquiry) => void;
}) {
  const [inquiries, setInquiries] = useState<SystemInquiry[]>([]);
  const [filter, setFilter] = useState<"all" | SystemInquiry["status"]>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Lead Form State
  const [newLead, setNewLead] = useState({
    name: "",
    org: "",
    phone: "",
    email: "",
    type: "Faida POS",
    message: "",
    budget: "",
    timeline: "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllInquiries();
      setInquiries(data);
    } catch {
      notify("Failed to fetch leads from database", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: string, status: SystemInquiry["status"]) => {
    const updated = await updateInquiry(id, { status });
    setInquiries(updated);
    notify(`Hali ya ombi imebadilishwa kuwa: ${STATUS_CONFIG[status].label} ✓`, "success");
  };

  const handleSaveNotes = async (id: string) => {
    const updated = await updateInquiry(id, { notes: noteDraft });
    setInquiries(updated);
    setEditingNotesId(null);
    notify("Maelezo ya ndani yamehifadhiwa ✓", "success");
  };

  const handleDelete = async (id: string) => {
    if (!canManageNow()) {
      notify("Huna ruhusa — session ya admin imeisha. Ingia tena.", "error");
      return;
    }
    if (confirm("Je, una uhakika unataka kufuta ombi hili?")) {
      const updated = await removeInquiry(id);
      setInquiries(updated);
      notify("Ombi limefutwa ✓", "info");
    }
  };

  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.phone) {
      notify("Weka angalau Jina na Namba ya Simu", "error");
      return;
    }
    const created = await createInquiry({
      ...newLead,
      status: "new",
    });
    setInquiries((prev) => [created, ...prev]);
    setShowAddModal(false);
    setNewLead({
      name: "",
      org: "",
      phone: "",
      email: "",
      type: "Faida POS",
      message: "",
      budget: "",
      timeline: "",
    });
    notify("Ombi jipya limeongezwa kwa mafanikio ✓", "success");
  };

  const filtered = inquiries.filter((inq) => {
    const matchesFilter = filter === "all" || inq.status === filter;
    const term = search.toLowerCase();
    const matchesSearch =
      inq.name.toLowerCase().includes(term) ||
      (inq.org && inq.org.toLowerCase().includes(term)) ||
      inq.phone.toLowerCase().includes(term) ||
      (inq.email && inq.email.toLowerCase().includes(term)) ||
      inq.type.toLowerCase().includes(term) ||
      inq.message.toLowerCase().includes(term);
    return matchesFilter && matchesSearch;
  });

  const newCount = inquiries.filter((x) => x.status === "new").length;

  return (
    <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
      {/* HEADER & ACTIONS */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold font-grotesk text-white">Maombi &amp; Wateja Wapya (Leads)</h2>
            {newCount > 0 && (
              <span className="bg-emerald-500 text-deep text-xs font-bold px-2.5 py-0.5 rounded-full animate-pulse">
                {newCount} Mpya
              </span>
            )}
          </div>
          <p className="text-xs text-white/50 mt-1">
            Ufuatiliaji wa maombi ya mifumo (Faida POS, CareTrack, Tovuti) yanayotumwa kutoka fomu ya mawasiliano au estimator.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadData()}
            className="text-xs font-bold px-3 py-2 rounded-xl border border-white/15 text-white/70 hover:text-white hover:border-white/40 transition-colors flex items-center gap-2"
            title="Refresh leads"
          >
            <i className={`fa-solid fa-arrows-rotate ${loading ? "fa-spin" : ""}`} /> Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-viol hover:bg-violD text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-viol/20 flex items-center gap-2"
          >
            <i className="fa-solid fa-plus" /> Weka Ombi kwa Mkono
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex gap-2 flex-wrap">
          {(
            [
              { id: "all", label: `Zote (${inquiries.length})` },
              { id: "new", label: `Mpya (${inquiries.filter((x) => x.status === "new").length})` },
              { id: "contacted", label: "Amepewa Jibu" },
              { id: "in_progress", label: "Inashughulikiwa" },
              { id: "converted", label: "Mradi" },
              { id: "closed", label: "Zilizo Funga" },
            ] as const
          ).map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all ${
                filter === btn.id
                  ? "bg-white text-deep border-white"
                  : "border-white/10 text-white/50 hover:border-white/30"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64 relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-xs" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tafuta jina, simu, mfumo..."
            className="w-full bg-white/[0.05] border border-white/15 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-viol"
          />
        </div>
      </div>

      {/* LEADS LIST */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
          <i className="fa-regular fa-folder-open text-3xl text-white/20 mb-3" />
          <p className="text-sm text-white/40">Hakuna maombi yanayolingana na vigezo ulivyoweka.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((inq) => {
            const statusStyle = STATUS_CONFIG[inq.status] || STATUS_CONFIG.new;
            const cleanPhone = inq.phone.replace(/[^0-9]/g, "");
            const waPhone = cleanPhone.startsWith("0") ? "255" + cleanPhone.slice(1) : cleanPhone;
            const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(
              `Habari ${inq.name}! Nawasiliana kutoka Altraware Technologies kuhusu ombi lako la ${inq.type} (${inq.refCode || "Ref: #"}). Tunafurahi kukusaidia kufanikisha mfumo wako.`
            )}`;

            return (
              <div
                key={inq.id}
                className="bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-2xl p-5 md:p-6 transition-all space-y-4"
              >
                {/* TOP INFO ROW */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-bold text-violL">
                        {inq.refCode || `#ALT-${inq.id.slice(-4)}`}
                      </span>
                      <h3 className="text-base font-bold text-white">{inq.name}</h3>
                      {inq.org && (
                        <span className="text-xs bg-white/10 text-white/80 px-2 py-0.5 rounded-md">
                          {inq.org}
                        </span>
                      )}
                      <span className="text-xs bg-viol/20 text-violL border border-viol/30 font-semibold px-2 py-0.5 rounded-md">
                        {inq.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-white/50 mt-1 flex-wrap">
                      <span>
                        <i className="fa-regular fa-clock mr-1" />
                        {new Date(inq.createdAt).toLocaleDateString("sw-TZ", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {inq.budget && (
                        <span>
                          <i className="fa-solid fa-coins mr-1 text-amber-400" />
                          Budget: <b className="text-white">{inq.budget}</b>
                        </span>
                      )}
                      {inq.timeline && (
                        <span>
                          <i className="fa-regular fa-calendar-check mr-1 text-blue-400" />
                          Timeline: {inq.timeline}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* STATUS SELECTOR */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                    >
                      {statusStyle.label}
                    </span>
                    <select
                      value={inq.status}
                      onChange={(e) => handleStatusChange(inq.id, e.target.value as SystemInquiry["status"])}
                      className="bg-[#0e101f] border border-white/20 rounded-lg text-xs text-white px-2 py-1 focus:outline-none focus:border-viol"
                    >
                      <option value="new">Weka Mpya</option>
                      <option value="contacted">Weka Amepewa Jibu</option>
                      <option value="in_progress">Weka Inashughulikiwa</option>
                      <option value="converted">Weka Imekuwa Mradi</option>
                      <option value="closed">Weka Imefungwa</option>
                    </select>
                  </div>
                </div>

                {/* BRIEF MESSAGE */}
                <div className="bg-black/30 border border-white/5 rounded-xl p-3.5 text-sm text-white/90 leading-relaxed font-sans">
                  {inq.message}
                </div>

                {/* INTERNAL ADMIN NOTES */}
                <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-white/40 tracking-wider uppercase text-[10px]">
                      Maelezo ya Ndani (Admin Notes)
                    </span>
                    {editingNotesId !== inq.id && (
                      <button
                        onClick={() => {
                          setEditingNotesId(inq.id);
                          setNoteDraft(inq.notes || "");
                        }}
                        className="text-[11px] text-violL hover:underline"
                      >
                        <i className="fa-solid fa-pen mr-1" />
                        {inq.notes ? "Hariri maelezo" : "+ Ongeza maelezo"}
                      </button>
                    )}
                  </div>

                  {editingNotesId === inq.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={noteDraft}
                        onChange={(e) => setNoteDraft(e.target.value)}
                        placeholder="Andika maelezo ya mazungumzo, makubaliano ya bei, au ratiba ya demo..."
                        rows={2}
                        className="w-full bg-[#0a0c18] border border-white/20 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-viol"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingNotesId(null)}
                          className="px-2.5 py-1 rounded bg-white/10 text-white/60 hover:text-white text-[11px]"
                        >
                          Ghairi
                        </button>
                        <button
                          onClick={() => handleSaveNotes(inq.id)}
                          className="px-3 py-1 rounded bg-viol hover:bg-violD text-white font-bold text-[11px]"
                        >
                          Hifadhi
                        </button>
                      </div>
                    </div>
                  ) : inq.notes ? (
                    <p className="text-white/70 italic">&ldquo;{inq.notes}&rdquo;</p>
                  ) : (
                    <p className="text-white/30 italic">Hakuna maelezo ya ndani yaliyowekwa bado.</p>
                  )}
                </div>

                {/* BOTTOM ACTION BAR */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/5">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* WHATSAPP ACTION */}
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow"
                    >
                      <i className="fa-brands fa-whatsapp text-sm" />
                      Chat WhatsApp ({inq.phone})
                    </a>

                    {/* PHONE CALL */}
                    <a
                      href={`tel:${inq.phone}`}
                      className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <i className="fa-solid fa-phone text-xs" /> Piga Simu
                    </a>

                    {/* EMAIL */}
                    {inq.email && (
                      <a
                        href={`mailto:${inq.email}?subject=Altraware Technologies — ${encodeURIComponent(inq.type)}`}
                        className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <i className="fa-regular fa-envelope text-xs" /> Tuma Email
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {onConvertToProject && (
                      <button
                        onClick={() => onConvertToProject(inq)}
                        className="text-xs font-bold text-violL hover:text-viol flex items-center gap-1.5 transition-colors"
                        title="Anzisha mradi katika Project Tracker"
                      >
                        <i className="fa-solid fa-rocket" /> Unda Mradi Rasmi →
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(inq.id)}
                      className="text-xs text-white/30 hover:text-red-400 transition-colors"
                      title="Futa ombi hili"
                    >
                      <i className="fa-solid fa-trash" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL YA KUONGEZA OMBI KWA MKONO */}
      {showAddModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-deep/80 backdrop-blur-md">
          <div className="bg-[#0e101f] border border-white/15 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-white/40 hover:text-white"
            >
              <i className="fa-solid fa-xmark text-lg" />
            </button>

            <h3 className="text-lg font-bold font-grotesk mb-1">Ongeza Ombi la Mteja kwa Mkono</h3>
            <p className="text-xs text-white/50 mb-5">
              Hifadhi mawasiliano na mahitaji ya mteja aliyepiga simu au kufika ofisini.
            </p>

            <form onSubmit={handleManualAdd} className="space-y-3.5">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Jina la Mteja *</label>
                  <input
                    type="text"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    required
                    placeholder="mf. Michael Sanga"
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-viol"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Kampuni / Taasisi</label>
                  <input
                    type="text"
                    value={newLead.org}
                    onChange={(e) => setNewLead({ ...newLead, org: e.target.value })}
                    placeholder="mf. Sanga Pharmacy"
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-viol"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Namba ya Simu *</label>
                  <input
                    type="text"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    required
                    placeholder="mf. +255 712 345 678"
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-viol"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Barua Pepe (Email)</label>
                  <input
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    placeholder="mteja@domain.com"
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-viol"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Aina ya Mfumo</label>
                  <select
                    value={newLead.type}
                    onChange={(e) => setNewLead({ ...newLead, type: e.target.value })}
                    className="w-full bg-[#14172b] border border-white/15 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-viol"
                  >
                    <option value="Faida POS">Faida POS</option>
                    <option value="CareTrack">CareTrack</option>
                    <option value="ShuleDirect Pro">ShuleDirect Pro</option>
                    <option value="Website">Website</option>
                    <option value="Custom Software">Custom Software</option>
                    <option value="Consultation">Consultation</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Estimated Budget</label>
                  <input
                    type="text"
                    value={newLead.budget}
                    onChange={(e) => setNewLead({ ...newLead, budget: e.target.value })}
                    placeholder="e.g. TSh 900,000"
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-viol"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Timeline</label>
                  <input
                    type="text"
                    value={newLead.timeline}
                    onChange={(e) => setNewLead({ ...newLead, timeline: e.target.value })}
                    placeholder="mf. Wiki 2"
                    className="w-full bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-viol"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-white/60 block mb-1">Ujumbe / Mahitaji ya Mteja</label>
                <textarea
                  value={newLead.message}
                  onChange={(e) => setNewLead({ ...newLead, message: e.target.value })}
                  rows={3}
                  placeholder="Eleza kile mteja anachotaka mfumo umfanyie..."
                  className="w-full bg-white/[0.05] border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-viol"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white/70 hover:text-white text-xs font-semibold"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-viol hover:bg-violD text-white font-bold text-xs"
                >
                  Hifadhi Ombi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
