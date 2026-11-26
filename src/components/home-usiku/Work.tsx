"use client";

import MediaImage from "@/components/MediaImage";
import { Rise, useParallax, useHeadline } from "@/components/usiku";
import { TransitionLink } from "@/components/Navbar";
import type { Project, SiteContent } from "@/lib/content";

/* ============================================================
   WORK — asymmetric, staggered, no equal card grid.

   The "3 rounded cards in a row" is the single loudest AI-slop tell.
   Here the grid is deliberately uneven: alternating column spans,
   different parallax speeds per tile, and giant index numerals that
   use mix-blend-mode instead of colour.
   ============================================================ */

const FEATURED = ["faida-hq", "uaut-connect", "niketz", "mwijay-portfolio", "aymi-africa", "volta-rentals"];

function Tile({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (p: Project) => void;
}) {
  // Alternate depth so the grid breathes instead of marching in lockstep.
  const speed = index % 2 === 0 ? 0.045 : 0.015;
  const ref = useParallax<HTMLDivElement>(speed);
  const tall = index % 3 === 0;

  return (
    <div ref={ref} className="u-parallax">
      <Rise delay={(index % 3) * 0.06}>
        <button
          type="button"
          onClick={() => onOpen(project)}
          className="group block w-full text-left"
        >
          <div
            className={`u-frame w-full ${tall ? "h-[420px] md:h-[560px]" : "h-[300px] md:h-[400px]"}`}
          >
            {project.media[0] && (
              <MediaImage
                src={project.media[0].url}
                alt={project.title}
                label={project.title}
                focus="top"
                className="w-full h-full"
                sizes="(max-width: 767px) 100vw, 50vw"
              />
            )}
            {/* index numeral — blend mode, not colour */}
            <span className="absolute top-4 left-4 md:top-6 md:left-6 font-display text-5xl md:text-7xl font-extrabold text-white/90 mix-blend-difference leading-none">
              {String(index + 1).padStart(3, "0")}
            </span>
          </div>

          <div className="flex items-start justify-between gap-4 mt-4">
            <div>
              <h3 className="font-display text-lg md:text-2xl font-bold uppercase tracking-tight">
                {project.title}
              </h3>
              <p className="u-label mt-1.5">
                {project.category} · {project.year}
              </p>
            </div>
            <span
              aria-hidden="true"
              className="shrink-0 mt-1 text-bone/50 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
            >
              ↗
            </span>
          </div>
        </button>
      </Rise>
    </div>
  );
}

export default function Work({
  content,
  onOpen,
}: {
  content: SiteContent;
  onOpen: (p: Project) => void;
}) {
  const titleRef = useHeadline<HTMLHeadingElement>();
  const projects = FEATURED.map((id) => content.projects.find((p) => p.id === id))
    .filter(Boolean) as Project[];

  return (
    <section id="work" className="u-section relative">
      <div className="u-wrap">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <span className="u-label">02 — Work</span>
            <h2 ref={titleRef} className="u-display u-settle u-scrub mt-4">
              Kazi zetu.
              <br />
              <span className="u-outline-dim">All live.</span>
            </h2>
          </div>
          <p className="u-lead max-w-[38ch] md:text-right">
            Retail OS, campus portals, sneaker stores, rental registries and
            community platforms. Every link below is in production today.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-x-6 gap-y-14 md:gap-y-20">
          {projects.map((p, i) => (
            <div key={p.id} className={i % 3 === 0 ? "md:col-span-2" : ""}>
              <Tile project={p} index={i} onOpen={onOpen} />
            </div>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <TransitionLink href="/impact" className="u-btn u-btn-ghost">
            All platforms
            <span aria-hidden="true">→</span>
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
