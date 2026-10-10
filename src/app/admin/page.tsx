"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useContent, useNotify } from "@/components/providers";
import { formatTsh } from "@/lib/content";
import type { BlogPost, SiteContent } from "@/lib/content";
import {
  downloadInvoicePdf,
  invoiceTotals,
  loadInvoices,
  makeInvoiceNumber,
  saveInvoices,
  type Invoice,
  type InvoiceItem,
} from "@/lib/invoice";
import { AdminAuthHeader, AdminAuthModal } from "@/components/admin/AdminAuthModal";
import {
  canManageNow,
  clearAdminSession,
  formatRemainingSw,
  useAdminSession,
} from "@/lib/admin-session";
import LeadsTab from "@/components/admin/LeadsTab";
import ClientTrackerTab from "@/components/admin/ClientTrackerTab";
import { uploadFileToCloudinary } from "@/lib/cloudinary";
import type { SystemInquiry } from "@/lib/leads";
import CloudinaryUploader from "@/components/ui/CloudinaryUploader";
import WarmTooltip, { WarmTooltipGroup } from "@/components/ui/WarmTooltip";

/* ============================================================
   Admin console — tabs:
   • Leads    : inquiries from website brief & estimator (Firestore + local)
   • Tracker  : active client projects, milestones & system documentation
   • Pricing  : packages, estimator bases & feature costs, support plans
   • Blog     : create / edit / delete / publish posts
   • Invoices : branded PDF invoices/receipts with logo
   • Content  : hero copy, contact info, portfolio projects
   • Images   : Cloudinary file upload picker directly from PC
   ============================================================ */

type Tab = "leads" | "tracker" | "pricing" | "blog" | "invoices" | "content" | "images";

export default function AdminPage() {
  const { content, updateContent, resetContent } = useContent();
  const { notify } = useNotify();
  const { user, session, remainingMs, logout } = useAdminSession();
  const [tab, setTab] = useState<Tab>("leads");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [leadToConvert, setLeadToConvert] = useState<{
    clientName: string;
    clientPhone: string;
    clientEmail?: string;
    systemName: string;
  } | null>(null);

  // work on a draft copy; Save writes through to the provider
  const [draft, setDraft] = useState(content);
  useEffect(() => setDraft(content), [content]);
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(content), [draft, content]);

  const save = () => {
    updateContent(draft);
    notify("Changes saved ✓ — the live site is updated", "success");
  };

  // Kitalu cha vitendo vya hatari (futa / reset) — lazima admin
  // awe verified SASA HIVI, si "alishawahi kuingia". True = zuia.
  const denyIfLocked = (): boolean => {
    if (!canManageNow()) {
      notify("No permission — admin session expired. Please sign in again.", "error");
      return true;
    }
    return false;
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "leads", label: "Leads & Inquiries", icon: "fa-inbox" },
    { id: "tracker", label: "Projects & Docs", icon: "fa-diagram-project" },
    { id: "pricing", label: "Pricing", icon: "fa-tags" },
    { id: "blog", label: "Blog", icon: "fa-pen-nib" },
    { id: "invoices", label: "Invoices", icon: "fa-file-invoice-dollar" },
    { id: "content", label: "Content", icon: "fa-sliders" },
    { id: "images", label: "Images (Cloudinary)", icon: "fa-images" },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("altraware_admin_theme") as "dark" | "light") : null;
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("altraware_admin_theme", next);
    }
    notify(next === "light" ? "Light mode on ☀️" : "Dark mode on 🌙", "info");
  };

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 ${
        theme === "dark" ? "bg-[#070913] text-white admin-dark" : "bg-[#f4f6fa] text-slate-900 admin-light"
      }`}
    >
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-[#0c0f1d] border-r border-white/10 flex flex-col justify-between z-50 transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 p-1.5 flex items-center justify-center">
                  <img src="/logo.png" alt="Altraware" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="font-grotesk font-bold text-sm tracking-wide text-white">ALTRAWARE</div>
                  <div className="text-[9px] tracking-[0.25em] text-violL font-mono">OPERATIONS CONSOLE</div>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden text-white/40 hover:text-white text-lg p-1"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-mono">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>LIVE CLOUD SYNCED</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="text-[10px] font-mono tracking-widest text-white/35 px-3 py-2 uppercase">
              Management Modules
            </div>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                  tab === t.id
                    ? "bg-viol text-white shadow-lg shadow-viol/30"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <i className={`fa-solid ${t.icon} w-4 text-center text-sm`} />
                <span className="flex-1">{t.label}</span>
                {tab === t.id && <i className="fa-solid fa-chevron-right text-[10px] opacity-70" />}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-[#090b16]">
          <button
            onClick={save}
            disabled={!dirty}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              dirty
                ? "bg-viol hover:bg-violD text-white shadow-lg shadow-viol/30"
                : "bg-white/5 text-white/30 cursor-not-allowed"
            }`}
          >
            <i className="fa-solid fa-floppy-disk" />
            <span>{dirty ? "Save changes ✓" : "Saved"}</span>
          </button>

          {/* Theme Switcher in Sidebar */}
          <div className="flex items-center justify-between text-xs px-1 py-1">
            <span className="text-white/40 text-[10px] font-mono uppercase tracking-wider">Theme Mode</span>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition-all"
              title="Switch between Light and Dark mode"
            >
              <i className={`fa-solid ${theme === "dark" ? "fa-sun text-yellow-400" : "fa-moon text-viol"} text-xs`} />
              <span>{theme === "dark" ? "Light" : "Dark"}</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <a
              href="/"
              className="text-white/50 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
              <span>View Site</span>
            </a>

            <button
              onClick={async () => {
                clearAdminSession();
                try {
                  await logout();
                } catch {
                  // ignore
                }
                window.location.href = "/";
              }}
              className="text-red-400/80 hover:text-red-300 flex items-center gap-1 transition-colors"
              title="Sign out of the console and return to Homepage"
            >
              <i className="fa-solid fa-arrow-right-from-bracket text-[10px]" />
              <span>Log out</span>
            </button>
          </div>

          <div className="pt-1 text-center">
            <button
              onClick={() => {
                if (denyIfLocked()) return;
                if (confirm("Reset ALL content to defaults? Unsaved changes will be lost.")) {
                  resetContent();
                  setDraft(content);
                  notify("Content reset to defaults", "info");
                }
              }}
              className="text-[10px] text-white/30 hover:text-white/60 transition-colors"
            >
              Reset site defaults
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN VIEW */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 border-b border-white/10 px-4 sm:px-6 flex items-center justify-between bg-[#0c0f1d]/70 backdrop-blur sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-white/70 hover:text-white p-2 rounded-lg bg-white/5 border border-white/10"
              aria-label="Open sidebar"
            >
              <i className="fa-solid fa-bars text-sm" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-white/40">
              <span>ALTRAWARE</span>
              <span>/</span>
              <span className="text-white font-grotesk font-bold capitalize">
                {tabs.find((t) => t.id === tab)?.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Theme Toggle Button in Header */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl border border-white/15 hover:border-viol/60 hover:bg-white/5 text-xs font-bold transition-all"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <i className={`fa-solid ${theme === "dark" ? "fa-sun text-yellow-400" : "fa-moon text-viol"} text-xs`} />
              <span className="hidden sm:inline">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </button>

            <AdminAuthHeader user={user} onOpenModal={() => setAuthModalOpen(true)} />
            {session && (
              <span
                className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                title="Session type + time left before auto sign-out"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {session.method === "master" ? "Master" : "Google"} · {formatRemainingSw(remainingMs)}
              </span>
            )}

            <button
              onClick={save}
              disabled={!dirty}
              className={`md:hidden text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                dirty ? "bg-viol text-white" : "bg-white/10 text-white/30"
              }`}
            >
              {dirty ? "Save" : "Saved"}
            </button>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1360px] w-full mx-auto">
          {tab === "leads" && (
            <LeadsTab
              notify={notify}
              onConvertToProject={(lead: SystemInquiry) => {
                setLeadToConvert({
                  clientName: lead.org ? `${lead.name} (${lead.org})` : lead.name,
                  clientPhone: lead.phone,
                  clientEmail: lead.email,
                  systemName: lead.type,
                });
                setTab("tracker");
                notify(`Inquiry from ${lead.name} moved to the Project Tracker ✓`, "info");
              }}
            />
          )}
          {tab === "tracker" && <ClientTrackerTab notify={notify} initialNewLead={leadToConvert} />}
          {tab === "pricing" && <PricingTab draft={draft} setDraft={setDraft} />}
          {tab === "blog" && <BlogTab draft={draft} setDraft={setDraft} notify={notify} />}
          {tab === "invoices" && <InvoicesTab notify={notify} content={draft} />}
          {tab === "content" && <ContentTab draft={draft} setDraft={setDraft} notify={notify} />}
          {tab === "images" && <ImagesTab draft={draft} setDraft={setDraft} notify={notify} />}
        </div>

        {/* Sticky save bar — inaonekana mabadiliko yakisubiri kuhifadhiwa */}
        {dirty && (
          <div className="sticky bottom-4 z-40 mx-4 sm:mx-6 lg:mx-8 mb-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-viol border border-white/25 rounded-2xl px-4 py-3 shadow-2xl shadow-viol/40">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />
                Unsaved changes — press Save to publish them live
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setDraft(content);
                    notify("Changes discarded — back to the saved version", "info");
                  }}
                  className="text-xs font-bold px-4 py-2 rounded-xl border border-white/40 text-white hover:bg-white/10 transition-all"
                >
                  Discard
                </button>
                <button
                  onClick={save}
                  className="text-xs font-bold px-5 py-2 rounded-xl bg-white text-viol hover:bg-white/90 transition-all shadow"
                >
                  <i className="fa-solid fa-floppy-disk mr-1.5" /> Save changes ✓
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <AdminAuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} notify={notify} />
    </div>
  );
}

/* ================= MEDIA HELPERS (picsum + where-used) ================= */

type NotifyFn = (msg: string, type: "success" | "error" | "info") => void;
type MediaItem = SiteContent["projects"][number]["media"][number];

/** Picsum placeholder: https://picsum.photos/seed/<seed>/900/600 */
export function picsumUrl(seed: string, w = 900, h = 600): string {
  const clean =
    seed
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "altraware";
  return `https://picsum.photos/seed/${clean}/${w}/${h}`;
}

/** Ramani: kila key ya image registry inaonekana WAPI kwenye site. */
const IMAGE_LOCATIONS: Record<string, string> = {
  liveDemoPoster: "📍 🏠 Homepage → Faida sandbox cover (Live Demo)",
  heroDar: "⚠️ Legacy — not used anywhere (editing it changes nothing)",
  streetTz: "📍 🏠 Homepage → Roots collage · 📄 /about → photo strip",
  mediaBanner: "⚠️ Legacy — not used anywhere (editing it changes nothing)",
  community: "📍 🏠 Homepage → Roots collage · 📄 /about → photo strip",
  clientAvatar: "📍 🏠 Homepage → testimonial avatar (Roots)",
  webPreview: "📍 📄 /about → photo strip · 📄 /services → collage",
  sectorSchool: "📍 📄 /about → photo strip · 📄 /services → collage",
  sectorRetail: "📍 📄 /services → collage",
  sectorNgo: "⚠️ Legacy — not used (sector cards read Impact → Sectors below)",
};

/** 📍 Mstari unaoeleza picha/content inaonekana WAPI kwenye site. */
function Spot({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-1.5 text-[11px] font-mono text-violL/90 bg-viol/10 border border-viol/25 rounded-xl px-3 py-2 leading-relaxed">
      <i className="fa-solid fa-location-dot mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

/** ⚠️ Beji ya field ambayo HAIJATUMIKA popote — kuibadilisha hakutaonyesha tofauti. */
function LegacyBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded-md border border-amber-500/40 bg-amber-500/10 text-amber-300">
      <i className="fa-solid fa-triangle-exclamation" />
      <span>{children}</span>
    </span>
  );
}

/* ================= MEDIA SLOTS EDITOR ([Image 1] [Video 2] …) ================= */

function MediaSlotsEditor({
  media,
  onChange,
  notify,
  seedPrefix,
}: {
  media: MediaItem[];
  onChange: (next: MediaItem[]) => void;
  notify: NotifyFn;
  seedPrefix: string;
}) {
  const move = (from: number, dir: -1 | 1) => {
    const to = from + dir;
    if (to < 0 || to >= media.length) return;
    const next = [...media];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  const removeAt = (idx: number) => {
    onChange(media.filter((_, k) => k !== idx));
  };

  const setAt = (idx: number, patch: Partial<MediaItem>) => {
    onChange(media.map((m, k) => (k === idx ? { ...m, ...patch } : m)));
  };

  const handleUpload = async (file: File | undefined, kind: "image" | "video") => {
    if (!file) return;
    notify(`Uploading ${kind === "video" ? "a video" : "a photo"} from PC to Cloudinary...`, "info");
    try {
      const url = await uploadFileToCloudinary(file);
      onChange([...media, { type: kind, url, caption: file.name }]);
      notify(`${kind === "video" ? "Video" : "Photo"} uploaded ✓ — remember to press "Save changes"`, "success");
    } catch (err) {
      notify(err instanceof Error ? err.message : "Upload failed", "error");
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap gap-2">
        <label className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-viol/40 bg-viol/20 text-violL hover:bg-viol hover:text-white transition-all cursor-pointer flex items-center gap-1">
          <i className="fa-solid fa-cloud-arrow-up text-[9px]" />
          <span>+ Photo (PC)</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              void handleUpload(f, "image");
            }}
          />
        </label>
        <label className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-teal-500/40 bg-teal-500/20 text-teal-300 hover:bg-teal-500 hover:text-white transition-all cursor-pointer flex items-center gap-1">
          <i className="fa-solid fa-video text-[9px]" />
          <span>+ Video (PC)</span>
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              void handleUpload(f, "video");
            }}
          />
        </label>
        <button
          onClick={() => onChange([...media, { type: "image", url: "", caption: "" }])}
          className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-white/15 text-white/50 hover:border-viol hover:text-violL transition-all"
        >
          + Image URL
        </button>
        <button
          onClick={() => onChange([...media, { type: "video", url: "", caption: "" }])}
          className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-white/15 text-white/50 hover:border-viol hover:text-violL transition-all"
        >
          + Video URL
        </button>
      </div>

      {media.map((m, mi) => (
        <div key={mi} className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center bg-white/[0.02] border border-white/10 rounded-xl p-2.5">
          {/* Thumbnail */}
          <div className="w-full sm:w-20 h-14 rounded-lg overflow-hidden border border-white/15 bg-black/50 shrink-0 flex items-center justify-center relative">
            {m.url ? (
              m.type === "video" ? (
                <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
                  <i className="fa-solid fa-play text-violL text-sm" />
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.url} alt={m.caption || `Slot ${mi + 1}`} className="w-full h-full object-cover" onError={(e) => ((e.target as HTMLImageElement).style.opacity = "0.3")} />
              )
            ) : (
              <span className="text-[10px] text-white/30">Empty</span>
            )}
          </div>

          {/* Numbered slot badge */}
          <span className={`text-[10px] font-bold px-2 py-1 rounded-md shrink-0 whitespace-nowrap ${m.type === "video" ? "bg-teal-500/20 text-teal-300" : "bg-viol/20 text-violL"}`}>
            {m.type === "video" ? `[Video ${mi + 1}]` : `[Image ${mi + 1}]`}
          </span>

          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex gap-1.5">
              <input
                className={inputCls + " flex-1"}
                placeholder={m.type === "video" ? "https://... .mp4 or Cloudinary video URL" : "https://... image URL"}
                value={m.url}
                onChange={(e) => setAt(mi, { url: e.target.value })}
              />
              {m.type === "image" && (
                <WarmTooltip content="Fill with a temporary sample photo" size="sm">
                  <button
                    type="button"
                    title="Fill with a temporary Picsum photo"
                    onClick={() => {
                      setAt(mi, { url: picsumUrl(`${seedPrefix}-${mi + 1}`) });
                      notify(`Slot ${mi + 1} filled with Picsum — remember "Save changes"`, "info");
                    }}
                    className="px-2.5 py-1 rounded-lg border border-white/15 text-white/50 hover:border-viol hover:text-violL transition-all text-xs shrink-0"
                  >
                    🎲
                  </button>
                </WarmTooltip>
              )}
            </div>
            <input
              className={inputCls}
              placeholder="Caption under the photo (e.g. Team dashboards & systems)"
              value={m.caption}
              onChange={(e) => setAt(mi, { caption: e.target.value })}
            />
          </div>

          <div className="flex sm:flex-col gap-1 shrink-0">
            <WarmTooltipGroup delay={350} warmWindow={300}>
              <WarmTooltip content="Move slot up" size="sm">
                <button onClick={() => move(mi, -1)} disabled={mi === 0} className="text-white/40 hover:text-white transition-colors p-1 disabled:opacity-20" aria-label="Move up" title="Move up">
                  <i className="fa-solid fa-chevron-up text-xs" />
                </button>
              </WarmTooltip>
              <WarmTooltip content="Move slot down" size="sm">
                <button onClick={() => move(mi, 1)} disabled={mi === media.length - 1} className="text-white/40 hover:text-white transition-colors p-1 disabled:opacity-20" aria-label="Move down" title="Move down">
                  <i className="fa-solid fa-chevron-down text-xs" />
                </button>
              </WarmTooltip>
              <WarmTooltip content="Remove this slot" size="sm">
                <button onClick={() => removeAt(mi)} className="text-white/40 hover:text-red-400 transition-colors p-1" aria-label="Delete slot" title="Delete slot">
                  <i className="fa-solid fa-trash text-xs" />
                </button>
              </WarmTooltip>
            </WarmTooltipGroup>
          </div>
        </div>
      ))}
      {media.length === 0 && (
        <div className="text-[11px] text-white/25 py-2">No media yet — add a photo or video above. The order here is the order on the site.</div>
      )}
    </div>
  );
}

/* ================= SERVICES EDITOR (HUDUMA + MEDIA) ================= */

function ServicesEditor({
  draft,
  setDraft,
  notify,
}: {
  draft: SiteContent;
  setDraft: (d: SiteContent) => void;
  notify: NotifyFn;
}) {
  const setS = (fn: (sv: SiteContent["services"]) => void) => {
    const next = structuredClone(draft.services);
    fn(next);
    setDraft({ ...draft, services: next });
  };

  return (
    <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[11px] font-grotesk font-bold tracking-[0.25em] text-white/40">
          SERVICES &amp; MEDIA ({draft.services.length})
        </div>
      </div>
      <div className="space-y-2 mb-6">
        <Spot>
          These are the 3 cards of the marquee strip (parallel scroll) on the Homepage — the photos/videos below are exactly what scrolls by, each with its own caption.
        </Spot>
      </div>
      <div className="space-y-4">
        {draft.services.map((s, si) => (
          <div key={s.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-full bg-deep text-white flex items-center justify-center font-grotesk font-bold text-xs border border-white/10">
                  {s.num}
                </span>
                <div>
                  <div className="font-bold text-white text-sm">{s.title}</div>
                  <div className="text-[10px] text-white/40 font-mono">id: {s.id}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <a href="/#services" className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-white/15 text-white/50 hover:border-viol hover:text-violL transition-all">
                  View Homepage ↗
                </a>
                <a href={`/services#${s.id}`} className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-white/15 text-white/50 hover:border-viol hover:text-violL transition-all">
                  View /services ↗
                </a>
              </div>
            </div>

            <Spot>
              Shown on: 🏠 Homepage → Accordion + Marquee strip · 📄 /services#{s.id}
              {s.id === "systems" && " · 📄 /process strip · 📄 /about motion (first media item only)"}
            </Spot>

            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <Field label="Title">
                <TextInput value={s.title} onChange={(v) => setS((x) => void (x[si].title = v))} />
              </Field>
              <Field label="Title (Swahili)">
                <TextInput value={s.titleSw ?? ""} onChange={(v) => setS((x) => void (x[si].titleSw = v))} placeholder="Websites / Apps / Systems" />
              </Field>
              <Field label="Starting price (TSh)">
                <NumInput value={s.startingPrice ?? 0} onChange={(n) => setS((x) => void (x[si].startingPrice = n))} suffix="TSh" />
              </Field>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <Field label="Subtitle">
                <TextInput value={s.subtitle} onChange={(v) => setS((x) => void (x[si].subtitle = v))} />
              </Field>
              <Field label="Tags (comma)">
                <TextInput
                  value={s.tags.join(", ")}
                  onChange={(v) => setS((x) => void (x[si].tags = v.split(",").map((t) => t.trim()).filter(Boolean)))}
                />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Description">
                <AreaInput value={s.description} onChange={(v) => setS((x) => void (x[si].description = v))} rows={2} />
              </Field>
            </div>

            {/* Highlights */}
            <div className="mt-4">
              <div className="text-[10px] font-grotesk font-bold tracking-[0.2em] text-white/35 mb-2">
                HIGHLIGHT CARDS ({s.highlights.length})
              </div>
              <div className="space-y-2">
                {s.highlights.map((h, hi) => (
                  <div key={hi} className="grid md:grid-cols-[1fr_1.4fr_1fr] gap-2">
                    <TextInput value={h.title} onChange={(v) => setS((x) => void (x[si].highlights[hi].title = v))} placeholder="Heading" />
                    <TextInput value={h.body} onChange={(v) => setS((x) => void (x[si].highlights[hi].body = v))} placeholder="Details" />
                    <TextInput value={h.proof} onChange={(v) => setS((x) => void (x[si].highlights[hi].proof = v))} placeholder="Proof (e.g. 1.4s load on 3G)" />
                  </div>
                ))}
              </div>
            </div>

            {/* previewImage — legacy, haijatumika */}
            <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:items-center">
              <div className="flex-1">
                <Field label="Cover (previewImage)">
                  <TextInput value={s.previewImage ?? ""} onChange={(v) => setS((x) => void (x[si].previewImage = v))} placeholder="https://..." />
                </Field>
              </div>
              <LegacyBadge>not used anywhere yet — the media below is what appears</LegacyBadge>
            </div>

            {/* Media slots */}
            <div className="mt-4">
              <div className="text-[10px] font-grotesk font-bold tracking-[0.2em] text-white/35 mb-2">
                MEDIA — MARQUEE PHOTOS &amp; VIDEOS ({(s.media ?? []).length})
              </div>
              <MediaSlotsEditor
                media={s.media ?? []}
                onChange={(next) => setS((x) => void (x[si].media = next))}
                notify={notify}
                seedPrefix={s.id}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= SHARED UI ================= */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-grotesk font-bold tracking-widest text-white/45">{label.toUpperCase()}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

const inputCls =
  "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 transition-all focus:border-viol";

function NumInput({ value, onChange, suffix }: { value: number; onChange: (n: number) => void; suffix?: string }) {
  return (
    <div className="relative">
      <input
        type="number"
        className={inputCls + " pr-14"}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/35">{suffix}</span>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, className }: { value: string; onChange: (s: string) => void; placeholder?: string; className?: string }) {
  return <input className={`${inputCls} ${className ?? ""}`} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}

function AreaInput({ value, onChange, rows = 3 }: { value: string; onChange: (s: string) => void; rows?: number }) {
  return <textarea className={inputCls + " resize-none"} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />;
}

/* ================= PRICING TAB ================= */

function PricingTab({ draft, setDraft }: { draft: typeof import("@/lib/content").DEFAULT_CONTENT; setDraft: (d: typeof import("@/lib/content").DEFAULT_CONTENT) => void }) {
  const p = draft.pricing;

  const setP = (fn: (p: typeof draft.pricing) => void) => {
    const next = structuredClone(p);
    fn(next);
    setDraft({ ...draft, pricing: next });
  };

  return (
    <div className="space-y-10">
      {/* INTRO */}
      <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6">
        <div className="text-[11px] font-grotesk font-bold tracking-[0.25em] text-white/40 mb-4">PRICING INTRO</div>
        <AreaInput value={p.intro} onChange={(v) => setP((x) => void (x.intro = v))} />
      </section>

      {/* PACKAGES */}
      <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6">
        <div className="text-[11px] font-grotesk font-bold tracking-[0.25em] text-white/40 mb-5">
          PACKAGES ({p.packages.length})
        </div>
        <div className="space-y-4">
          {p.packages.map((pkg, i) => (
            <div key={pkg.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <div className="grid md:grid-cols-4 gap-4">
                <Field label="Name">
                  <TextInput value={pkg.name} onChange={(v) => setP((x) => void (x.packages[i].name = v))} />
                </Field>
                <Field label="Price (TSh) — 0 = Custom">
                  <NumInput
                    value={pkg.price === "custom" ? 0 : pkg.price}
                    onChange={(n) => setP((x) => void (x.packages[i].price = n <= 0 ? "custom" : n))}
                  />
                </Field>
                <Field label="Tagline">
                  <TextInput value={pkg.tagline} onChange={(v) => setP((x) => void (x.packages[i].tagline = v))} />
                </Field>
                <Field label="Weeks (min–max)">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      className={inputCls}
                      value={pkg.durationWeeks[0]}
                      onChange={(e) => setP((x) => void (x.packages[i].durationWeeks[0] = Number(e.target.value)))}
                    />
                    <input
                      type="number"
                      className={inputCls}
                      value={pkg.durationWeeks[1]}
                      onChange={(e) => setP((x) => void (x.packages[i].durationWeeks[1] = Number(e.target.value)))}
                    />
                  </div>
                </Field>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <Field label="Features (one per line)">
                  <AreaInput
                    value={pkg.features.join("\n")}
                    onChange={(v) => setP((x) => void (x.packages[i].features = v.split("\n").filter(Boolean)))}
                  />
                </Field>
                <div className="flex items-end gap-3">
                  <button
                    onClick={() => setP((x) => void (x.packages[i].featured = !pkg.featured))}
                    className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition-all ${
                      pkg.featured ? "bg-viol border-viol text-white" : "border-white/15 text-white/50"
                    }`}
                  >
                    ★ Featured package
                  </button>
                  <button
                    onClick={() => setP((x) => void x.packages.splice(i, 1))}
                    className="text-xs text-red-400/70 hover:text-red-400 underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() =>
            setP((x) =>
              void x.packages.push({
                id: "pkg-" + Date.now(),
                name: "New package",
                tagline: "Tagline here",
                price: 500000,
                priceUnit: "one-time",
                durationWeeks: [4, 6],
                features: ["Feature one"],
              })
            )
          }
          className="mt-4 text-sm font-bold px-5 py-2.5 rounded-xl border border-dashed border-white/25 text-white/60 hover:border-viol hover:text-violL transition-all"
        >
          + Add package
        </button>
      </section>

      {/* ESTIMATOR */}
      <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6">
        <div className="text-[11px] font-grotesk font-bold tracking-[0.25em] text-white/40 mb-5">
          ESTIMATOR
        </div>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {p.estimator.types.map((t, i) => (
            <Field key={t.id} label={`Type: ${t.label}`}>
              <NumInput value={t.base} onChange={(n) => setP((x) => void (x.estimator.types[i].base = n))} suffix="TSh" />
            </Field>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {p.estimator.features.map((f, i) => (
            <div key={f.id} className="flex gap-2 items-end">
              <div className="flex-1">
                <Field label="Feature">
                  <TextInput value={f.label} onChange={(v) => setP((x) => void (x.estimator.features[i].label = v))} />
                </Field>
              </div>
              <div className="w-40">
                <Field label="Cost">
                  <NumInput value={f.cost} onChange={(n) => setP((x) => void (x.estimator.features[i].cost = n))} suffix="TSh" />
                </Field>
              </div>
              <button
                onClick={() => setP((x) => void x.estimator.features.splice(i, 1))}
                className="text-white/40 hover:text-red-400 transition-colors pb-3"
                aria-label="Remove feature"
              >
                <i className="fa-solid fa-trash" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() =>
            setP((x) => void x.estimator.features.push({ id: "f-" + Date.now(), label: "New feature", cost: 100000 }))
          }
          className="mt-4 text-sm font-bold px-5 py-2.5 rounded-xl border border-dashed border-white/25 text-white/60 hover:border-viol hover:text-violL transition-all"
        >
          + Add estimator feature
        </button>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <Field label="VAT %">
            <NumInput value={p.estimator.vatPercent} onChange={(n) => setP((x) => void (x.estimator.vatPercent = n))} suffix="%" />
          </Field>
          <Field label="Base contingency % (complexity adds more)">
            <NumInput
              value={p.estimator.contingencyPercent}
              onChange={(n) => setP((x) => void (x.estimator.contingencyPercent = n))}
              suffix="%"
            />
          </Field>
        </div>
      </section>

      {/* SUPPORT PLANS */}
      <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6">
        <div className="text-[11px] font-grotesk font-bold tracking-[0.25em] text-white/40 mb-5">
          SUPPORT PLANS
        </div>
        <div className="space-y-4">
          {p.supportPlans.map((plan, i) => (
            <div key={plan.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 grid md:grid-cols-4 gap-4">
              <Field label="Name">
                <TextInput value={plan.name} onChange={(v) => setP((x) => void (x.supportPlans[i].name = v))} />
              </Field>
              <Field label="Monthly (0 = custom)">
                <NumInput
                  value={plan.price === "custom" ? 0 : plan.price}
                  onChange={(n) => setP((x) => void (x.supportPlans[i].price = n <= 0 ? "custom" : n))}
                  suffix="TSh"
                />
              </Field>
              <Field label="Features (one per line)">
                <AreaInput
                  value={plan.features.join("\n")}
                  onChange={(v) => setP((x) => void (x.supportPlans[i].features = v.split("\n").filter(Boolean)))}
                />
              </Field>
              <div className="flex flex-col justify-end gap-2">
                <button
                  onClick={() => setP((x) => void (x.supportPlans[i].popular = !plan.popular))}
                  className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition-all ${
                    plan.popular ? "bg-viol border-viol text-white" : "border-white/15 text-white/50"
                  }`}
                >
                  ★ Popular
                </button>
                <button
                  onClick={() => setP((x) => void x.supportPlans.splice(i, 1))}
                  className="text-xs text-red-400/70 hover:text-red-400 underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() =>
            setP((x) =>
              void x.supportPlans.push({
                id: "plan-" + Date.now(),
                name: "New plan",
                nameSw: "New",
                price: 150000,
                unit: "/mo",
                features: ["Benefit one"],
              })
            )
          }
          className="mt-4 text-sm font-bold px-5 py-2.5 rounded-xl border border-dashed border-white/25 text-white/60 hover:border-viol hover:text-violL transition-all"
        >
          + Add support plan
        </button>
      </section>

      {/* FAQ */}
      <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6">
        <div className="text-[11px] font-grotesk font-bold tracking-[0.25em] text-white/40 mb-5">FAQ</div>
        <div className="space-y-4">
          {p.faqs.map((f, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <Field label="Question">
                <TextInput value={f.q} onChange={(v) => setP((x) => void (x.faqs[i].q = v))} />
              </Field>
              <div className="mt-3">
                <Field label="Answer">
                  <AreaInput value={f.a} onChange={(v) => setP((x) => void (x.faqs[i].a = v))} />
                </Field>
              </div>
              <button
                onClick={() => setP((x) => void x.faqs.splice(i, 1))}
                className="mt-3 text-xs text-red-400/70 hover:text-red-400 underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setP((x) => void x.faqs.push({ q: "New question?", a: "The honest answer." }))}
          className="mt-4 text-sm font-bold px-5 py-2.5 rounded-xl border border-dashed border-white/25 text-white/60 hover:border-viol hover:text-violL transition-all"
        >
          + Add FAQ
        </button>
      </section>
    </div>
  );
}

/* ================= BLOG TAB ================= */

function BlogTab({
  draft,
  setDraft,
  notify,
}: {
  draft: typeof import("@/lib/content").DEFAULT_CONTENT;
  setDraft: (d: typeof import("@/lib/content").DEFAULT_CONTENT) => void;
  notify: (m: string, k?: "info" | "success" | "error") => void;
}) {
  const [editing, setEditing] = useState<BlogPost | null>(null);

  const setB = (fn: (b: typeof draft.blog) => void) => {
    const next = structuredClone(draft.blog);
    fn(next);
    setDraft({ ...draft, blog: next });
  };

  const newPost = (): BlogPost => ({
    id: "post-" + Date.now(),
    title: "",
    slug: "",
    excerpt: "",
    cover: "",
    date: new Date().toISOString().slice(0, 10),
    author: "Altraware Team",
    tags: [],
    body: [""],
    published: false,
  });

  const savePost = () => {
    if (!editing) return;
    if (!editing.title.trim() || !editing.slug.trim()) {
      notify("Title and slug are required", "error");
      return;
    }
    setB((b) => {
      const idx = b.posts.findIndex((p) => p.id === editing.id);
      if (idx >= 0) b.posts[idx] = editing;
      else b.posts.unshift(editing);
    });
    notify(`Post "${editing.title}" saved ✓ — press "Save changes" to publish`, "success");
    setEditing(null);
  };

  if (editing) {
    return (
      <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="text-[11px] font-grotesk font-bold tracking-[0.25em] text-white/40">
            {draft.blog.posts.some((p) => p.id === editing.id) ? "EDIT POST" : "NEW POST"}
          </div>
          <button onClick={() => setEditing(null)} className="text-white/50 hover:text-white text-sm">
            ← Cancel
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Title">
            <TextInput value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} placeholder="Why offline-first matters" />
          </Field>
          <Field label="Slug (URL)">
            <TextInput value={editing.slug} onChange={(v) => setEditing({ ...editing, slug: v.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} placeholder="why-offline-first-matters" />
          </Field>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <Field label="Author">
            <TextInput value={editing.author} onChange={(v) => setEditing({ ...editing, author: v })} />
          </Field>
          <Field label="Date">
            <input
              type="date"
              className={inputCls}
              value={editing.date}
              onChange={(e) => setEditing({ ...editing, date: e.target.value })}
            />
          </Field>
          <Field label="Tags (comma separated)">
            <TextInput
              value={editing.tags.join(", ")}
              onChange={(v) => setEditing({ ...editing, tags: v.split(",").map((t) => t.trim()).filter(Boolean) })}
              placeholder="engineering, product"
            />
          </Field>
        </div>
        <div className="mt-4 space-y-2">
          <Field label="Cover image — 📄 /blog cards + post page (Cloudinary Upload / URL)">
            <div className="flex flex-col sm:flex-row gap-2.5 items-start sm:items-center">
              <TextInput value={editing.cover} onChange={(v) => setEditing({ ...editing, cover: v })} placeholder="https://res.cloudinary.com/... or choose a file from your PC" className="flex-1" />
              <CloudinaryUploader value={editing.cover} onChange={(url) => setEditing({ ...editing, cover: url })} compact />
            </div>
          </Field>
          {editing.cover && (
            <div className="w-28 h-16 rounded-xl overflow-hidden border border-white/15 mt-2 bg-black/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={editing.cover} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
        <div className="mt-4">
          <Field label="Excerpt">
            <AreaInput value={editing.excerpt} onChange={(v) => setEditing({ ...editing, excerpt: v })} />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Body (blank line = new paragraph)">
            <AreaInput
              rows={10}
              value={editing.body.join("\n\n")}
              onChange={(v) => setEditing({ ...editing, body: v.split("\n\n").filter((p) => p.trim()) })}
            />
          </Field>
        </div>
        <div className="flex items-center gap-4 mt-6">
          <WarmTooltipGroup delay={350} warmWindow={300}>
            <WarmTooltip content="Save to draft — then press Save changes up top" size="sm">
              <button onClick={savePost} className="bg-viol hover:bg-violD transition-colors text-white font-bold px-6 py-3 rounded-xl text-sm">
                Save post
              </button>
            </WarmTooltip>
          </WarmTooltipGroup>
          <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
            <input
              type="checkbox"
              className="accent-[#7C3AED] w-4 h-4"
              checked={editing.published}
              onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
            />
            Published
            <WarmTooltip content="Only published posts appear on /blog" size="sm">
              <span className="text-white/30 hover:text-violL transition-colors cursor-help">
                <i className="fa-solid fa-circle-question text-xs" />
              </span>
            </WarmTooltip>
          </label>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="text-[11px] font-grotesk font-bold tracking-[0.25em] text-white/40">
          POSTS ({draft.blog.posts.length})
        </div>
        <button onClick={() => setEditing(newPost())} className="bg-viol hover:bg-violD transition-colors text-white font-bold px-4 py-2 rounded-xl text-xs">
          + New post
        </button>
      </div>
      <WarmTooltipGroup delay={350} warmWindow={300}>
      <div className="space-y-3">
        {draft.blog.posts.map((post, i) => (
          <div key={post.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex items-center gap-4">
            {post.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.cover} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-image text-white/20" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white text-sm truncate">{post.title || "(untitled)"}</div>
              <div className="text-xs text-white/40 font-mono truncate">
                /blog/{post.slug} · {post.date} · {post.author}
              </div>
            </div>
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                post.published ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/40"
              }`}
            >
              {post.published ? "LIVE" : "DRAFT"}
            </span>
            <WarmTooltip content="Edit this post" size="sm">
              <button onClick={() => setEditing(post)} className="text-white/50 hover:text-white transition-colors" aria-label="Edit">
                <i className="fa-solid fa-pen" />
              </button>
            </WarmTooltip>
            <WarmTooltip content="Delete this post forever" size="sm">
              <button
                onClick={() => {
                  if (!canManageNow()) {
                    notify("No permission — admin session expired. Please sign in again.", "error");
                    return;
                  }
                  if (confirm(`Delete "${post.title}"?`)) {
                    setB((b) => void b.posts.splice(i, 1));
                    notify("Post deleted", "info");
                  }
                }}
                className="text-white/40 hover:text-red-400 transition-colors"
                aria-label="Delete"
              >
                <i className="fa-solid fa-trash" />
              </button>
            </WarmTooltip>
          </div>
        ))}
      </div>
      </WarmTooltipGroup>
    </section>
  );
}

/* ================= INVOICES TAB ================= */

function InvoicesTab({ notify, content }: { notify: (m: string, k?: "info" | "success" | "error") => void; content: SiteContent }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => setInvoices(loadInvoices()), []);

  const persist = (list: Invoice[]) => {
    setInvoices(list);
    saveInvoices(list);
  };

  const blank = (): Invoice => ({
    id: "inv-" + Date.now(),
    number: makeInvoiceNumber(invoices.length + 1),
    date: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10),
    clientName: "",
    clientOrg: "",
    clientPhone: "",
    clientEmail: "",
    items: [{ desc: "", qty: 1, unitPrice: 0 }],
    vatPercent: content.pricing.estimator.vatPercent,
    discount: 0,
    depositPercent: 0,
    notes: "",
    status: "draft",
  });

  const setItem = (i: number, patch: Partial<InvoiceItem>) => {
    if (!editing) return;
    const items = editing.items.map((it, k) => (k === i ? { ...it, ...patch } : it));
    setEditing({ ...editing, items });
  };

  const saveInvoice = () => {
    if (!editing) return;
    if (!editing.clientName.trim() || editing.items.some((i) => !i.desc.trim())) {
      notify("Client name and all item descriptions are required", "error");
      return;
    }
    const list = [...invoices];
    const idx = list.findIndex((x) => x.id === editing.id);
    if (idx >= 0) list[idx] = editing;
    else list.unshift(editing);
    persist(list);
    notify(`Invoice ${editing.number} saved ✓`, "success");
    setEditing(null);
  };

  const download = async (inv: Invoice) => {
    setBusy(true);
    try {
      await downloadInvoicePdf(inv, content);
      notify(`${inv.number} PDF downloaded ✓`, "success");
    } catch {
      notify("Could not generate the PDF — check the console", "error");
    } finally {
      setBusy(false);
    }
  };

  const t = editing ? invoiceTotals(editing) : null;

  if (editing) {
    return (
      <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="text-[11px] font-grotesk font-bold tracking-[0.25em] text-white/40">
            {invoices.some((x) => x.id === editing.id) ? `EDIT ${editing.number}` : "NEW INVOICE"}
          </div>
          <button onClick={() => setEditing(null)} className="text-white/50 hover:text-white text-sm">
            ← Cancel
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <Field label="Invoice number">
            <TextInput value={editing.number} onChange={(v) => setEditing({ ...editing, number: v })} />
          </Field>
          <Field label="Date">
            <input type="date" className={inputCls} value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} />
          </Field>
          <Field label="Due date">
            <input type="date" className={inputCls} value={editing.dueDate} onChange={(e) => setEditing({ ...editing, dueDate: e.target.value })} />
          </Field>
          <Field label="Status">
            <select
              className={inputCls}
              value={editing.status}
              onChange={(e) => setEditing({ ...editing, status: e.target.value as Invoice["status"] })}
            >
              {["draft", "sent", "paid", "overdue"].map((s) => (
                <option key={s} value={s} className="bg-deep">
                  {s.toUpperCase()}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mt-4">
          <Field label="Client name *">
            <TextInput value={editing.clientName} onChange={(v) => setEditing({ ...editing, clientName: v })} placeholder="Neema Mwakalinga" />
          </Field>
          <Field label="Organisation">
            <TextInput value={editing.clientOrg ?? ""} onChange={(v) => setEditing({ ...editing, clientOrg: v })} placeholder="Duka la Neema" />
          </Field>
          <Field label="Phone">
            <TextInput value={editing.clientPhone ?? ""} onChange={(v) => setEditing({ ...editing, clientPhone: v })} placeholder="+255 ..." />
          </Field>
          <Field label="Email">
            <TextInput value={editing.clientEmail ?? ""} onChange={(v) => setEditing({ ...editing, clientEmail: v })} />
          </Field>
        </div>

        {/* items */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] font-grotesk font-bold tracking-[0.25em] text-white/40">ITEMS</div>
            <button
              onClick={() => setEditing({ ...editing, items: [...editing.items, { desc: "", qty: 1, unitPrice: 0 }] })}
              className="text-xs font-bold px-3.5 py-2 rounded-lg border border-dashed border-white/25 text-white/60 hover:border-viol hover:text-violL transition-all"
            >
              + Add line
            </button>
          </div>
          <div className="space-y-2">
            {editing.items.map((it, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  className={inputCls + " flex-1"}
                  placeholder="Description — e.g. Business website, deposit"
                  value={it.desc}
                  onChange={(e) => setItem(i, { desc: e.target.value })}
                />
                <input
                  type="number"
                  className={inputCls + " w-20"}
                  value={it.qty}
                  onChange={(e) => setItem(i, { qty: Number(e.target.value) })}
                  aria-label="Quantity"
                />
                <input
                  type="number"
                  className={inputCls + " w-36"}
                  value={it.unitPrice}
                  onChange={(e) => setItem(i, { unitPrice: Number(e.target.value) })}
                  aria-label="Unit price TSh"
                />
                <span className="text-xs font-mono text-white/50 w-28 text-right shrink-0">
                  {formatTsh(it.qty * it.unitPrice)}
                </span>
                <button
                  onClick={() => setEditing({ ...editing, items: editing.items.filter((_, k) => k !== i) })}
                  className="text-white/40 hover:text-red-400 transition-colors"
                  aria-label="Remove item"
                >
                  <i className="fa-solid fa-trash" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <Field label="VAT %">
            <NumInput value={editing.vatPercent} onChange={(n) => setEditing({ ...editing, vatPercent: n })} suffix="%" />
          </Field>
          <Field label="Discount (TSh)">
            <NumInput value={editing.discount} onChange={(n) => setEditing({ ...editing, discount: n })} suffix="TSh" />
          </Field>
          <Field label="Deposit % (0 = full invoice)">
            <NumInput value={editing.depositPercent} onChange={(n) => setEditing({ ...editing, depositPercent: n })} suffix="%" />
          </Field>
        </div>

        {/* live totals */}
        {t && (
          <div className="mt-6 bg-deep rounded-2xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { l: "Subtotal", v: formatTsh(t.sub) },
              { l: `VAT (${editing.vatPercent}%)`, v: formatTsh(t.vat) },
              { l: "Total", v: formatTsh(t.total) },
              { l: editing.depositPercent > 0 ? `Deposit (${editing.depositPercent}%)` : "Due", v: formatTsh(editing.depositPercent > 0 ? t.deposit : t.total) },
            ].map((x) => (
              <div key={x.l}>
                <div className="text-[10px] tracking-widest font-grotesk text-white/40 font-bold">{x.l.toUpperCase()}</div>
                <div className="font-grotesk font-bold text-lg text-violL mt-1">{x.v}</div>
              </div>
            ))}
          </div>
        )}

        <Field label="Notes (appears on the PDF)">
          <div className="mt-1.5">
            <AreaInput value={editing.notes ?? ""} onChange={(v) => setEditing({ ...editing, notes: v })} />
          </div>
        </Field>

        <div className="flex items-center gap-3 mt-6">
          <button onClick={saveInvoice} className="bg-viol hover:bg-violD transition-colors text-white font-bold px-6 py-3 rounded-xl text-sm">
            Save invoice
          </button>
          <button
            onClick={() => download(editing)}
            disabled={busy}
            className="bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all disabled:opacity-50"
          >
            <i className="fa-solid fa-file-arrow-down mr-2" /> Download PDF
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="text-[11px] font-grotesk font-bold tracking-[0.25em] text-white/40">
          INVOICES ({invoices.length})
        </div>
        <button onClick={() => setEditing(blank())} className="bg-viol hover:bg-violD transition-colors text-white font-bold px-4 py-2 rounded-xl text-xs">
          + New invoice
        </button>
      </div>
      <p className="text-xs text-white/40 mb-6">
        Branded PDF invoices &amp; receipts with your logo, VAT and deposit logic — generated in the browser, ready to
        send to clients.
      </p>
      {invoices.length === 0 && (
        <div className="text-center text-white/30 py-12 text-sm border border-dashed border-white/15 rounded-2xl">
          No invoices yet — create your first one. 🧾
        </div>
      )}
      <div className="space-y-3">
        {invoices.map((inv) => {
          const tt = invoiceTotals(inv);
          return (
            <div key={inv.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-40">
                <div className="font-bold text-white text-sm">
                  {inv.number} <span className="text-white/40 font-normal">· {inv.clientName}</span>
                </div>
                <div className="text-xs text-white/40 font-mono">
                  {inv.date} → due {inv.dueDate} · {inv.items.length} items
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  inv.status === "paid"
                    ? "bg-green-500/20 text-green-400"
                    : inv.status === "overdue"
                      ? "bg-red-500/20 text-red-400"
                      : inv.status === "sent"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-white/10 text-white/40"
                }`}
              >
                {inv.status.toUpperCase()}
              </span>
              <span className="font-grotesk font-bold text-violL text-sm">{formatTsh(tt.total)}</span>
              <div className="flex items-center gap-2">
                {(["draft", "sent", "paid"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => persist(invoices.map((x) => (x.id === inv.id ? { ...x, status: s } : x)))}
                    className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-all ${
                      inv.status === s ? "bg-viol border-viol text-white" : "border-white/15 text-white/40 hover:border-white/40"
                    }`}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
                <button
                  onClick={() => download(inv)}
                  disabled={busy}
                  className="text-white/60 hover:text-violL transition-colors"
                  aria-label="Download PDF"
                >
                  <i className="fa-solid fa-file-arrow-down" />
                </button>
                <button onClick={() => setEditing(inv)} className="text-white/50 hover:text-white transition-colors" aria-label="Edit">
                  <i className="fa-solid fa-pen" />
                </button>
                <button
                  onClick={() => {
                if (!canManageNow()) {
                    notify("No permission — admin session expired. Please sign in again.", "error");
                    return;
                  }
                  if (confirm(`Delete ${inv.number}?`)) {
                      persist(invoices.filter((x) => x.id !== inv.id));
                      notify("Invoice deleted", "info");
                    }
                  }}
                  className="text-white/40 hover:text-red-400 transition-colors"
                  aria-label="Delete"
                >
                  <i className="fa-solid fa-trash" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function VideoUploaderField({
  value,
  onChange,
  notify,
}: {
  value: string;
  onChange: (url: string) => void;
  notify: (m: string, k?: "info" | "success" | "error") => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      notify("Please choose a video file (MP4, WebM, QuickTime)", "error");
      return;
    }
    setUploading(true);
    notify("Uploading video to Cloudinary... please wait", "info");
    try {
      const url = await uploadFileToCloudinary(file);
      onChange(url);
      notify("Video uploaded ✓ — remember to press Save changes", "success");
    } catch (err: any) {
      notify(err instanceof Error ? err.message : "Video upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <TextInput
          value={value}
          onChange={onChange}
          placeholder="https://... or upload a video from your PC below"
          className="flex-1"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold transition-colors"
            title="Remove video"
          >
            <i className="fa-solid fa-trash" />
          </button>
        )}
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
          dragOver
            ? "border-viol bg-viol/10"
            : "border-white/15 bg-white/[0.02] hover:border-viol/50 hover:bg-white/[0.04]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/ogg,video/quicktime"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />

        {uploading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <i className="fa-solid fa-circle-notch fa-spin text-2xl text-viol mb-2" />
            <span className="text-xs font-grotesk font-bold text-white">Uploading to Cloudinary...</span>
            <span className="text-[11px] text-white/40 mt-1">Please wait while the video uploads and saves.</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-2">
            <div className="w-10 h-10 rounded-xl bg-viol/15 text-viol flex items-center justify-center mb-2.5">
              <i className="fa-solid fa-cloud-arrow-up text-lg" />
            </div>
            <p className="text-xs font-bold text-white">
              Click here or drag a video from PC / phone
            </p>
            <p className="text-[11px] text-white/40 mt-1">
              MP4, WebM, MOV · Direct Cloudinary storage
            </p>
          </div>
        )}
      </div>

      {/* Live Video Preview */}
      {value && (
        <div className="mt-3 bg-black/60 border border-white/10 rounded-2xl p-3 overflow-hidden">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-mono text-white/50 flex items-center gap-1.5">
              <i className="fa-solid fa-play text-[10px] text-viol" /> Live Video Preview
            </span>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-violL hover:underline font-mono"
            >
              Open link ↗
            </a>
          </div>
          <video
            src={value}
            controls
            playsInline
            preload="metadata"
            className="w-full max-h-56 rounded-xl object-contain bg-black"
          />
        </div>
      )}
    </div>
  );
}

/* ================= CONTENT TAB ================= */

function ContentTab({
  draft,
  setDraft,
  notify,
}: {
  draft: typeof import("@/lib/content").DEFAULT_CONTENT;
  setDraft: (d: typeof import("@/lib/content").DEFAULT_CONTENT) => void;
  notify: (m: string, k?: "info" | "success" | "error") => void;
}) {
  return (
    <div className="space-y-6">
      <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6">
        <div className="text-[11px] font-grotesk font-bold tracking-[0.25em] text-white/40 mb-5">HERO COPY &amp; MEDIA</div>
        <Spot>🏠 Homepage → Hero (mobile background + desktop card) plus the caption below it.</Spot>
        <div className="space-y-4 mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Badge text">
              <TextInput value={draft.hero.badge} onChange={(v) => setDraft({ ...draft, hero: { ...draft.hero, badge: v } })} />
            </Field>
            <Field label="Eyebrow / Sub-tagline">
              <TextInput value={draft.hero.eyebrow} onChange={(v) => setDraft({ ...draft, hero: { ...draft.hero, eyebrow: v } })} />
            </Field>
          </div>
          <Field label="Subtitle">
            <AreaInput value={draft.hero.subtitle} onChange={(v) => setDraft({ ...draft, hero: { ...draft.hero, subtitle: v } })} />
          </Field>

          {/* HERO IMAGE (PC / MOBILE CLOUDINARY UPLOADER) */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-grotesk font-bold text-white">HERO BACKGROUND &amp; CARD PHOTO (Dar es Salaam, Tanzania)</span>
              {draft.hero.image && (
                <span className="text-[10px] text-green-400 font-mono flex items-center gap-1">
                  <i className="fa-solid fa-check" /> Active
                </span>
              )}
            </div>
            <div className="grid md:grid-cols-[140px_1fr] gap-4 items-center">
              <div className="relative w-full h-24 rounded-xl overflow-hidden border border-white/10 bg-black/40 flex items-center justify-center">
                {draft.hero.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={draft.hero.image} alt="Hero" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-white/30">No photo</span>
                )}
              </div>
              <div className="space-y-2">
                <CloudinaryUploader
                  label="Upload Hero photo from PC / phone (Cloudinary)"
                  value={draft.hero.image}
                  onChange={(url: string) => {
                    setDraft({ ...draft, hero: { ...draft.hero, image: url } });
                    notify("Hero photo updated ✓", "success");
                  }}
                />
                <TextInput
                  value={draft.hero.imageCaption || ""}
                  placeholder="Photo caption (e.g. Dar es Salaam or Kariakoo Workshop)"
                  onChange={(v) => setDraft({ ...draft, hero: { ...draft.hero, imageCaption: v } })}
                />
              </div>
            </div>
          </div>

          <Field label="Hero video — not used anywhere yet">
            <VideoUploaderField
              value={draft.hero.heroVideo}
              onChange={(v) => setDraft({ ...draft, hero: { ...draft.hero, heroVideo: v } })}
              notify={notify}
            />
          </Field>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Primary CTA label">
              <TextInput value={draft.hero.primaryCta} onChange={(v) => setDraft({ ...draft, hero: { ...draft.hero, primaryCta: v } })} />
            </Field>
            <Field label="Secondary CTA label">
              <TextInput value={draft.hero.secondaryCta} onChange={(v) => setDraft({ ...draft, hero: { ...draft.hero, secondaryCta: v } })} />
            </Field>
          </div>
        </div>
      </section>

      <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6">
        <div className="text-[11px] font-grotesk font-bold tracking-[0.25em] text-white/40 mb-5">ABOUT / STORY &amp; FOUNDERS MEDIA</div>
        <div className="space-y-5">
          <Field label="Short description (~50 words)">
            <AreaInput value={draft.about.shortDescription} onChange={(v) => setDraft({ ...draft, about: { ...draft.about, shortDescription: v } })} />
          </Field>
          <Field label="Long intro">
            <AreaInput rows={4} value={draft.about.longIntro} onChange={(v) => setDraft({ ...draft, about: { ...draft.about, longIntro: v } })} />
          </Field>
          <Field label="Who we serve">
            <AreaInput value={draft.about.whoWeServe} onChange={(v) => setDraft({ ...draft, about: { ...draft.about, whoWeServe: v } })} />
          </Field>

          {/* FOUNDERS PHOTOS & PROFILES */}
          <div className="pt-2">
            <div className="text-[10px] font-grotesk font-bold tracking-[0.2em] text-white/40 uppercase mb-3">
              Founders Photos (real upload from PC/phone)
            </div>
            <Spot>📄 /about → Founders section (round photos of David and Clemence).</Spot>
            <div className="grid md:grid-cols-2 gap-4 mt-3">
              {draft.about.founders.map((f, fi) => (
                <div key={fi} className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden border border-white/15 bg-black/50 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.photo} alt={f.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-white truncate">{f.name}</div>
                      <div className="text-[11px] text-white/50 truncate">{f.role}</div>
                    </div>
                  </div>
                  <CloudinaryUploader
                    label={`Upload ${f.name.split(" ")[0]}'s photo (PC)`}
                    value={f.photo}
                    onChange={(url: string) => {
                      const nextFounders = structuredClone(draft.about.founders);
                      nextFounders[fi].photo = url;
                      setDraft({ ...draft, about: { ...draft.about, founders: nextFounders } });
                      notify(`${f.name}'s photo updated ✓`, "success");
                    }}
                  />
                  <TextInput
                    value={f.name}
                    placeholder="Full name"
                    onChange={(v) => {
                      const next = structuredClone(draft.about.founders);
                      next[fi].name = v;
                      setDraft({ ...draft, about: { ...draft.about, founders: next } });
                    }}
                  />
                  <TextInput
                    value={f.role}
                    placeholder="Role / Title"
                    onChange={(v) => {
                      const next = structuredClone(draft.about.founders);
                      next[fi].role = v;
                      setDraft({ ...draft, about: { ...draft.about, founders: next } });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT & SECTORS MEDIA */}
      <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6">
        <div className="text-[11px] font-grotesk font-bold tracking-[0.25em] text-white/40 mb-2">SECTORS &amp; IMPACT MEDIA</div>
        <p className="text-xs text-white/40 mb-4">
          Photos on the sector cards (Schools, Retail, NGOs) — 🏠 Homepage → Impact grid · 📄 /impact → Sectors.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {draft.impact.sectors.map((sec, si) => (
            <div key={si} className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3">
              <div className="h-28 rounded-xl overflow-hidden border border-white/10 bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sec.image} alt={sec.label} className="w-full h-full object-cover" />
              </div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">{sec.label}</div>
              <CloudinaryUploader
                label={`Change ${sec.label} photo (PC)`}
                value={sec.image}
                onChange={(url: string) => {
                  const nextSectors = structuredClone(draft.impact.sectors);
                  nextSectors[si].image = url;
                  setDraft({ ...draft, impact: { ...draft.impact, sectors: nextSectors } });
                      notify(`${sec.label} photo updated ✓`, "success");
                }}
              />
            </div>
          ))}
        </div>
      </section>

      <ProjectsEditor draft={draft} setDraft={setDraft} notify={notify} />

      <ServicesEditor draft={draft} setDraft={setDraft} notify={notify} />

      <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6">
        <div className="text-[11px] font-grotesk font-bold tracking-[0.25em] text-white/40 mb-5">CONTACT</div>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Phone (primary)">
            <TextInput value={draft.contact.phone} onChange={(v) => setDraft({ ...draft, contact: { ...draft.contact, phone: v } })} />
          </Field>
          <Field label="Phone (secondary)">
            <TextInput value={draft.contact.phoneAlt} onChange={(v) => setDraft({ ...draft, contact: { ...draft.contact, phoneAlt: v } })} />
          </Field>
          <Field label="WhatsApp number">
            <TextInput value={draft.contact.whatsapp} onChange={(v) => setDraft({ ...draft, contact: { ...draft.contact, whatsapp: v } })} />
          </Field>
          <Field label="Email">
            <TextInput value={draft.contact.email} onChange={(v) => setDraft({ ...draft, contact: { ...draft.contact, email: v } })} />
          </Field>
          <Field label="Address">
            <TextInput value={draft.contact.address} onChange={(v) => setDraft({ ...draft, contact: { ...draft.contact, address: v } })} />
          </Field>
          <Field label="Hours">
            <TextInput value={draft.contact.hours} onChange={(v) => setDraft({ ...draft, contact: { ...draft.contact, hours: v } })} />
          </Field>
        </div>
      </section>
    </div>
  );
}

/* ================= PROJECTS EDITOR (in Content tab) ================= */

function ProjectsEditor({
  draft,
  setDraft,
  notify,
}: {
  draft: typeof import("@/lib/content").DEFAULT_CONTENT;
  setDraft: (d: typeof import("@/lib/content").DEFAULT_CONTENT) => void;
  notify: (m: string, k?: "info" | "success" | "error") => void;
}) {
  const setP = (fn: (p: SiteContent["projects"]) => void) => {
    const next = structuredClone(draft.projects);
    fn(next);
    setDraft({ ...draft, projects: next });
  };

  const setMedia = (pi: number, fn: (m: SiteContent["projects"][number]["media"]) => void) => {
    setP((p) => {
      const media = structuredClone(p[pi].media ?? []);
      fn(media);
      p[pi].media = media;
    });
  };

  return (
    <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="text-[11px] font-grotesk font-bold tracking-[0.25em] text-white/40">
          PORTFOLIO PROJECTS ({draft.projects.length})
        </div>
        <button
          onClick={() =>
            setP((p) =>
              void p.unshift({
                id: "prj-" + Date.now(),
                title: "New project",
                client: "",
                url: "",
                category: "Web Platform",
                year: String(new Date().getFullYear()),
                description: "",
                tags: [],
                media: [],
              })
            )
          }
          className="bg-viol hover:bg-violD transition-colors text-white font-bold px-4 py-2 rounded-xl text-xs"
        >
          + Add project
        </button>
      </div>
      <p className="text-xs text-white/40 mb-4">
        Live links power the public showcase. Media items (images &amp; playable videos) show on the project cards —
        replace any URL, or paste Cloudinary links when connected.
      </p>
      <Spot>
        🏠 Homepage → Work grid (6 featured) · 📄 /impact → Portfolio · 🪟 Modal (click a card) · 📄 /about motion (Faida media). The [Image 1] number is the cover shown on cards.
      </Spot>
      <div className="space-y-4">
        {draft.projects.map((pr, i) => (
          <div key={pr.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <div className="grid md:grid-cols-4 gap-4">
              <Field label="Title">
                <TextInput value={pr.title} onChange={(v) => setP((x) => void (x[i].title = v))} />
              </Field>
              <Field label="Client">
                <TextInput value={pr.client} onChange={(v) => setP((x) => void (x[i].client = v))} />
              </Field>
              <Field label="Live URL">
                <TextInput value={pr.url} onChange={(v) => setP((x) => void (x[i].url = v))} />
              </Field>
              <Field label="Category">
                <TextInput value={pr.category} onChange={(v) => setP((x) => void (x[i].category = v))} />
              </Field>
            </div>
            <div className="grid md:grid-cols-[1fr_120px_140px] gap-4 mt-4">
              <Field label="Description">
                <AreaInput value={pr.description} onChange={(v) => setP((x) => void (x[i].description = v))} />
              </Field>
              <Field label="Year">
                <TextInput value={pr.year} onChange={(v) => setP((x) => void (x[i].year = v))} />
              </Field>
              <Field label="Tags (comma)">
                <TextInput
                  value={pr.tags.join(", ")}
                  onChange={(v) => setP((x) => void (x[i].tags = v.split(",").map((s) => s.trim()).filter(Boolean)))}
                />
              </Field>
            </div>

            {/* media editor */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] font-grotesk font-bold tracking-[0.2em] text-white/35">MEDIA — PICS &amp; VIDEOS</div>
                <div className="flex flex-wrap gap-2">
                  <label className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-viol/40 bg-viol/20 text-violL hover:bg-viol hover:text-white transition-all cursor-pointer flex items-center gap-1">
                    <i className="fa-solid fa-cloud-arrow-up text-[9px]" />
                    <span>+ Photo (PC)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        notify("Uploading project photo from PC to Cloudinary...", "info");
                        try {
                          const url = await uploadFileToCloudinary(file);
                          setMedia(i, (m) => void m.push({ type: "image", url, caption: file.name }));
                          notify("Project photo uploaded ✓ — remember to press Save changes", "success");
                        } catch {
                          notify("Photo upload failed", "error");
                        }
                      }}
                    />
                  </label>
                  <label className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-teal-500/40 bg-teal-500/20 text-teal-300 hover:bg-teal-500 hover:text-white transition-all cursor-pointer flex items-center gap-1">
                    <i className="fa-solid fa-video text-[9px]" />
                    <span>+ Video (PC)</span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        notify("Uploading project video from PC to Cloudinary...", "info");
                        try {
                          const url = await uploadFileToCloudinary(file);
                          setMedia(i, (m) => void m.push({ type: "video", url, caption: file.name }));
                          notify("Project video uploaded ✓ — remember to press Save changes", "success");
                        } catch {
                          notify("Video upload failed", "error");
                        }
                      }}
                    />
                  </label>
                  <button
                    onClick={() => setMedia(i, (m) => void m.push({ type: "image", url: "", caption: "" }))}
                    className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-white/15 text-white/50 hover:border-viol hover:text-violL transition-all"
                  >
                    + Image URL
                  </button>
                  <button
                    onClick={() => setMedia(i, (m) => void m.push({ type: "video", url: "", caption: "" }))}
                    className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-white/15 text-white/50 hover:border-viol hover:text-violL transition-all"
                  >
                    + Video URL
                  </button>
                </div>
              </div>
              <div className="space-y-2.5">
                {(pr.media ?? []).map((m, mi) => (
                  <div key={mi} className="flex flex-col sm:flex-row gap-2.5 items-center bg-white/[0.02] border border-white/10 rounded-xl p-2.5">
                    {/* Media thumbnail / badge */}
                    <div className="w-16 h-12 rounded-lg overflow-hidden border border-white/15 bg-black/50 shrink-0 flex items-center justify-center relative">
                      {m.url ? (
                        m.type === "video" ? (
                          <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
                            <i className="fa-solid fa-play text-violL text-sm" />
                          </div>
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={m.url} alt="media" className="w-full h-full object-cover" onError={(e) => ((e.target as HTMLImageElement).style.opacity = "0.3")} />
                        )
                      ) : (
                        <span className="text-[10px] text-white/30">Empty</span>
                      )}
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md shrink-0 whitespace-nowrap ${m.type === "video" ? "bg-teal-500/20 text-teal-300" : "bg-viol/20 text-violL"}`}>
                      {m.type === "video" ? `[Video ${mi + 1}]` : `[Image ${mi + 1}]`}
                    </span>
                    <input
                      className={inputCls + " flex-1"}
                      placeholder={m.type === "video" ? "https://... .mp4 or Cloudinary video URL" : "https://... image URL"}
                      value={m.url}
                      onChange={(e) => setMedia(i, (mm) => void (mm[mi].url = e.target.value))}
                    />
                    <input
                      className={inputCls + " sm:w-44"}
                      placeholder="Caption"
                      value={m.caption}
                      onChange={(e) => setMedia(i, (mm) => void (mm[mi].caption = e.target.value))}
                    />
                    {m.type === "image" && (
                      <button
                        type="button"
                  title="Fill with a temporary Picsum photo"
                        onClick={() => {
                          setMedia(i, (mm) => void (mm[mi].url = picsumUrl(`${pr.id}-${mi + 1}`)));
                          notify(`Slot ${mi + 1} filled with Picsum — remember "Save changes"`, "info");
                        }}
                        className="text-white/40 hover:text-violL transition-colors shrink-0 p-1.5"
                        aria-label="Fill Picsum"
                      >
                        🎲
                      </button>
                    )}
                    <button
                      onClick={() =>
                        setMedia(i, (mm) => {
                          if (mi === 0) return;
                          const [it] = mm.splice(mi, 1);
                          mm.splice(mi - 1, 0, it);
                        })
                      }
                      disabled={mi === 0}
                      className="text-white/40 hover:text-white transition-colors shrink-0 p-1.5 disabled:opacity-20"
                      aria-label="Move up"
                      title="Move up"
                    >
                      <i className="fa-solid fa-chevron-up text-xs" />
                    </button>
                    <button
                      onClick={() =>
                        setMedia(i, (mm) => {
                          if (mi >= mm.length - 1) return;
                          const [it] = mm.splice(mi, 1);
                          mm.splice(mi + 1, 0, it);
                        })
                      }
                      disabled={mi >= (pr.media ?? []).length - 1}
                      className="text-white/40 hover:text-white transition-colors shrink-0 p-1.5 disabled:opacity-20"
                      aria-label="Move down"
                      title="Move down"
                    >
                      <i className="fa-solid fa-chevron-down text-xs" />
                    </button>
                    <button
                      onClick={() => setMedia(i, (mm) => void mm.splice(mi, 1))}
                      className="text-white/40 hover:text-red-400 transition-colors shrink-0 p-1.5"
                      aria-label="Remove media"
                    >
                      <i className="fa-solid fa-trash" />
                    </button>
                  </div>
                ))}
                {(pr.media ?? []).length === 0 && (
                  <div className="text-[11px] text-white/25 py-2">No media yet — add images or a playable video.</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => setP((x) => void (x[i].featured = !pr.featured))}
                className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all ${
                  pr.featured ? "bg-viol border-viol text-white" : "border-white/15 text-white/50"
                }`}
              >
                ★ Featured
              </button>
              <button
                onClick={() => {
                  if (!canManageNow()) {
                    notify("No permission — admin session expired. Please sign in again.", "error");
                    return;
                  }
                  setP((x) => void x.splice(i, 1));
                  notify("Project removed", "info");
                }}
                className="text-xs text-red-400/70 hover:text-red-400 underline"
              >
                Delete project
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= IMAGES TAB (CLOUDINARY) ================= */

function ImagesTab({
  draft,
  setDraft,
  notify,
}: {
  draft: typeof import("@/lib/content").DEFAULT_CONTENT;
  setDraft: (d: typeof import("@/lib/content").DEFAULT_CONTENT) => void;
  notify: (msg: string, type: "success" | "error" | "info") => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const handleFileUpload = async (key: string, file: File | undefined) => {
    if (!file) return;
    setUploadingKey(key);
    notify(`Uploading ${file.name} to Cloudinary...`, "info");
    try {
      const url = await uploadFileToCloudinary(file);
      setDraft({ ...draft, images: { ...draft.images, [key]: url } });
      notify(`Photo (${key}) uploaded from PC ✓ — remember to press Save changes`, "success");
    } catch {
      notify("Cloudinary photo upload failed", "error");
    } finally {
      setUploadingKey(null);
    }
  };

  return (
    <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-grotesk font-bold tracking-[0.25em] text-white/40 mb-1">
            IMAGE REGISTRY — CLOUDINARY MEDIA
          </div>
          <h2 className="text-xl font-bold font-grotesk text-white">Photo &amp; Asset Collection</h2>
          <p className="text-xs text-white/50 mt-1">
            Choose a file from your PC (desktop/laptop) to upload straight to Cloudinary, or paste a URL — or press 🎲 for a temporary Picsum fill.
          </p>
          <p className="text-[11px] font-mono text-amber-300/90 mt-2">
            ⚠️ The Homepage marquee strip (scrolling photos) does NOT read from here — edit Content → Services → Media. Every key below is labeled with where it appears.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-viol/15 border border-viol/30 px-3.5 py-1.5 rounded-full text-xs font-mono text-violL">
          <i className="fa-solid fa-cloud" />
          <span>Cloud: <b>{process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "—"}</b> · Preset: <b>{process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "—"}</b></span>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(draft.images).map(([key, url]) => (
          <div
            key={key}
            className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all"
          >
            {/* PREVIEW THUMBNAIL */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={key}
              className="w-24 h-16 rounded-xl object-cover shrink-0 cursor-pointer border border-white/10 bg-black/40 hover:scale-105 transition-transform"
              onClick={() => setPreview(url)}
              onError={(e) => ((e.target as HTMLImageElement).style.opacity = "0.3")}
                title="Click to enlarge"
            />

            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-violL font-bold">{key}</span>
                {uploadingKey === key && (
                  <span className="text-xs text-amber-300 font-mono flex items-center gap-1.5 animate-pulse">
                    <i className="fa-solid fa-spinner fa-spin" /> Uploading from PC...
                  </span>
                )}
              </div>
              <div className="text-[10px] font-mono text-white/45">
                {IMAGE_LOCATIONS[key] ?? "📍 —"}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  className={inputCls + " flex-1"}
                  value={url}
                  placeholder="https://... or press the button on the right to upload from PC"
                  onChange={(e) => setDraft({ ...draft, images: { ...draft.images, [key]: e.target.value } })}
                />

                {/* PICUM FILL + PC FILE INPUT */}
                <button
                  type="button"
                  title="Fill with a temporary Picsum photo"
                  onClick={() => {
                    setDraft({ ...draft, images: { ...draft.images, [key]: picsumUrl(key, 900, 600) } });
                    notify(`(${key}) filled with Picsum — remember "Save changes"`, "info");
                  }}
                  disabled={uploadingKey === key}
                  className="px-3 py-2.5 rounded-xl border border-white/15 text-white/60 hover:border-viol hover:text-violL transition-all text-sm shrink-0"
                >
                  🎲
                </button>
                <label className="cursor-pointer bg-viol hover:bg-violD text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shrink-0 transition-all shadow-md shadow-viol/20">
                  <i className="fa-solid fa-cloud-arrow-up" />
                  <span>Choose File (PC)</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingKey === key}
                    onChange={(e) => handleFileUpload(key, e.target.files?.[0])}
                  />
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-[160] flex items-center justify-center p-8 bg-deep3/85 backdrop-blur-md"
          onClick={() => setPreview(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="preview" className="max-w-full max-h-full rounded-2xl shadow-2xl border border-white/20" />
        </div>
      )}
    </section>
  );
}