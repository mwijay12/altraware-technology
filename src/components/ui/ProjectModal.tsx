"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/lib/content";
import Link from "next/link";
import { MetalButton } from "@/components/ui/liquid-glass-button";

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  useEffect(() => {
    setActiveMediaIndex(0);
  }, [project]);

  // Lock background body scroll whenever modal is open
  useEffect(() => {
    if (!project) return;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    // Prevent scrollbar shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const currentMedia = project.media?.[activeMediaIndex] || project.media?.[0];
  const isAppOrPOS =
    project.id === "faida-hq" ||
    project.category.toLowerCase().includes("business system") ||
    project.category.toLowerCase().includes("app");

  return (
    <div
      className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-5 md:p-8 bg-deep/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      {/* Light Mode Dialog Container */}
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white text-deep rounded-3xl shadow-2xl border border-deep/15 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Sticky Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-deep/10 bg-white/95 backdrop-blur-md px-5 sm:px-7 py-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="bg-viol/10 border border-viol/20 text-viol text-[11px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {project.category}
            </span>
            <span className="text-deep/45 text-xs font-mono">· {project.year}</span>
            {project.featured && (
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                ★ FEATURED
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-deep/5 hover:bg-deep/10 border border-deep/10 flex items-center justify-center text-deep/60 hover:text-deep transition-all cursor-pointer"
            aria-label="Close dialog"
          >
            <i className="fa-solid fa-xmark text-sm" />
          </button>
        </div>

        {/* Modal Scrollable Body — dedicated smooth scroll */}
        <div className="p-5 sm:p-7 space-y-6 overflow-y-auto overscroll-contain flex-1">
          {/* Main Media Showcase (Image or Video) */}
          {currentMedia && (
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-deep/10 bg-[#071126] aspect-video max-h-[380px] flex items-center justify-center shadow-inner">
                {currentMedia.type === "video" ? (
                  <video
                    src={currentMedia.url}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentMedia.url}
                    alt={currentMedia.caption || project.title}
                    className="w-full h-full object-cover sm:object-contain"
                  />
                )}
                {currentMedia.caption && (
                  <div className="absolute bottom-3 left-3 right-3 bg-deep/80 backdrop-blur-md text-[11px] text-white/90 px-3.5 py-1.5 rounded-xl border border-white/10 truncate">
                    {currentMedia.caption}
                  </div>
                )}
              </div>

              {/* Thumbnails Gallery Selector if multiple media items exist */}
              {project.media && project.media.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {project.media.map((m, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveMediaIndex(idx)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        activeMediaIndex === idx
                          ? "border-viol scale-105 shadow-md shadow-viol/30"
                          : "border-deep/15 opacity-60 hover:opacity-100"
                      }`}
                    >
                      {m.type === "video" ? (
                        <div className="w-full h-full bg-[#0a1735] flex items-center justify-center">
                          <i className="fa-solid fa-play text-white text-xs" />
                        </div>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.url} alt="" className="w-full h-full object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Title & Metadata */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-grotesk font-bold text-deep tracking-tight">
              {project.title}
            </h2>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-deep/60 font-mono">
              <span>Client: <b className="text-deep font-sans font-semibold">{project.client}</b></span>
              <span>·</span>
              <span className="text-emerald-700 flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live in Production
              </span>
            </div>
          </div>

          {/* Full Un-truncated Description in Clean Light Mode */}
          <div className="bg-[#FAF8F5] border border-deep/10 rounded-2xl p-5 sm:p-6 space-y-2.5">
            <div className="text-[10px] font-grotesk font-bold tracking-[0.2em] text-deep/50 uppercase">
              Project Overview &amp; Specifications
            </div>
            <p className="text-sm sm:text-[15px] text-deep/85 leading-relaxed whitespace-pre-line font-normal">
              {project.description}
            </p>
          </div>

          {/* Key Technologies & Engineering Tags */}
          {project.tags && project.tags.length > 0 && (
            <div>
              <div className="text-[10px] font-grotesk font-bold tracking-[0.2em] text-deep/50 uppercase mb-2.5">
                Technology Stack &amp; Architecture
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-white border border-deep/15 text-deep/80 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs"
                  >
                    <i className="fa-solid fa-check text-[10px] text-viol" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Specialized Action Box for Apps / Systems */}
          {isAppOrPOS && (
            <div className="bg-gradient-to-r from-viol/10 via-emerald-50 to-transparent border border-viol/25 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-viol/15 border border-viol/30 flex items-center justify-center text-viol text-xl shrink-0">
                  <i className="fa-solid fa-mobile-screen" />
                </div>
                <div>
                  <div className="text-sm font-bold text-deep">Multi-Platform Production System</div>
                  <div className="text-xs text-deep/65 mt-0.5">
                    Available as a responsive web app, desktop cashier terminal, and Android APK.
                  </div>
                </div>
              </div>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shrink-0 text-center flex items-center justify-center gap-2 shadow-sm"
              >
                <i className="fa-solid fa-arrow-up-right-from-square text-xs" />
                <span>Test Live Web Demo</span>
              </a>
            </div>
          )}
        </div>

        {/* Modal Sticky Footer Actions */}
        <div className="sticky bottom-0 z-20 border-t border-deep/10 bg-[#FAF8F5] px-5 sm:px-7 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link
            href={`/contact?estimate=Project:${encodeURIComponent(project.title)}`}
            onClick={onClose}
            className="w-full sm:w-auto text-xs font-medium text-deep/70 hover:text-viol flex items-center justify-center gap-1.5 transition-colors"
          >
            <i className="fa-solid fa-comments text-viol" />
            <span>Need a system like this? Request project estimate →</span>
          </Link>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-deep/20 text-deep/70 hover:text-deep hover:bg-deep/5 text-xs font-semibold transition-all cursor-pointer"
            >
              Close
            </button>

            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <MetalButton variant="primary" className="text-xs h-10 px-5 gap-2">
                <span>Visit Live Website</span>
                <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
              </MetalButton>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
