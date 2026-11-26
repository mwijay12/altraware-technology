"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/lib/content";
import Link from "next/link";

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  // Remount the gallery per project (key on the media array) instead of
  // resetting an index inside an effect.
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

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
      className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-5 md:p-8 bg-ink/60"
      onClick={onClose}
    >
      {/* Light Mode Dialog Container */}
      <div
        key={project.id}
        className="relative w-full max-w-4xl max-h-[90vh] bg-paper text-ink rounded-[6px] shadow-[0_40px_100px_-30px_rgba(22,19,13,.5)] border border-rule flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Sticky Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-rule bg-paper px-5 sm:px-7 py-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <span className="num text-[10px] uppercase tracking-[0.08em] text-ink-2 border border-rule px-2 py-1 rounded-[2px]">
              {project.category}
            </span>
            <span className="num text-[11px] text-ink-3">{project.year}</span>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-[3px] border border-rule hover:border-ink flex items-center justify-center text-ink-2 hover:text-ink transition-colors"
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
              <div className="relative rounded-[4px] overflow-hidden border border-rule bg-ink aspect-video max-h-[380px] flex items-center justify-center">
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
                  <div className="absolute bottom-3 left-3 right-3 bg-ink/80 text-[11px] text-paper/90 px-3 py-1.5 rounded-[2px] truncate">
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
                      className={`relative w-20 h-14 rounded-[3px] overflow-hidden border shrink-0 transition-all cursor-pointer ${
                        activeMediaIndex === idx
                          ? "border-ink"
                          : "border-rule opacity-60 hover:opacity-100"
                      }`}
                    >
                      {m.type === "video" ? (
                        <div className="w-full h-full bg-ink flex items-center justify-center">
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
            <h2 className="display text-[28px] sm:text-[34px] leading-tight">
              {project.title}
            </h2>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mt-2 text-[12px] text-ink-3">
              <span>Client: <span className="text-ink-2">{project.client}</span></span>
              <span aria-hidden>·</span>
              <span className="num text-[10px] uppercase tracking-[0.08em] text-ink-2">Live in production</span>
            </div>
          </div>

          {/* Full Un-truncated Description in Clean Light Mode */}
          <div className="border-t border-rule pt-5">
            <div className="label mb-2.5">Overview</div>
            <p className="text-[15px] text-ink-2 leading-[1.65] whitespace-pre-line max-w-[68ch]">
              {project.description}
            </p>
          </div>

          {/* Key Technologies & Engineering Tags */}
          {project.tags && project.tags.length > 0 && (
            <div>
              <div className="label mb-2.5">Stack</div>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="num text-[10px] uppercase tracking-[0.06em] text-ink-2 border border-rule px-2 py-1 rounded-[2px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Specialized Action Box for Apps / Systems */}
          {isAppOrPOS && (
            <div className="border border-rule rounded-[4px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[3px] border border-rule flex items-center justify-center text-ink text-base shrink-0">
                  <i className="fa-solid fa-mobile-screen" />
                </div>
                <div>
                  <div className="text-[14px] font-medium text-ink">Runs on more than one device</div>
                  <div className="text-[13px] text-ink-3 mt-0.5">
                    Responsive web app, desktop cashier terminal, and Android build.
                  </div>
                </div>
              </div>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-ink hover:bg-clay text-paper text-[13px] font-medium px-4 py-2.5 rounded-[3px] transition-colors shrink-0 text-center flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-arrow-up-right-from-square text-xs" />
                <span>Test Live Web Demo</span>
              </a>
            </div>
          )}
        </div>

        {/* Modal Sticky Footer Actions */}
        <div className="sticky bottom-0 z-20 border-t border-rule bg-paper-2/70 px-5 sm:px-7 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link
            href={`/contact?estimate=Project:${encodeURIComponent(project.title)}`}
            onClick={onClose}
            className="w-full sm:w-auto text-[13px] text-ink-2 hover:text-ink flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Need something like this? Ask for an estimate <span aria-hidden>→</span></span>
          </Link>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-[3px] border border-rule text-ink-2 hover:border-ink hover:text-ink text-[13px] transition-colors cursor-pointer"
            >
              Close
            </button>

            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <span className="inline-flex items-center gap-2 bg-ink text-paper text-[13px] font-medium h-10 px-5 rounded-[3px] hover:bg-clay transition-colors">
                Visit live site <span aria-hidden className="text-[11px]">↗</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
