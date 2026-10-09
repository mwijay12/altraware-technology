"use client";

import { useState } from "react";
import { TransitionLink } from "@/components/Navbar";
import { Reveal, TiltCard, Counter } from "@/components/motion";
import { useContent } from "@/components/providers";
import { TestimonialCarousel } from "@/app/page";
import { TextEffect } from "@/components/ui/text-effect";
import ProjectModal from "@/components/ui/ProjectModal";
import type { Project } from "@/lib/content";

/* Impact page — stats, testimonials, full live portfolio, support plans */

export default function ImpactPage() {
  const { content } = useContent();
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const imp = content.impact;

  return (
    <div className="pt-[120px]">
      {/* HERO */}
      <section className="bg-deep text-white relative overflow-hidden">
        <div className="noise-blue absolute inset-0" />
        <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-viol/25 blur-[140px] rounded-full" />
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-16 md:py-24 relative">
          <Reveal>
            <div className="eyebrow text-violL flex items-center gap-3 mb-4">
              <span className="w-10 h-[2px] bg-violL inline-block" /> Act III — Lasting Impact · Athari
            </div>
            <h1 className="display text-5xl md:text-7xl font-medium">
              <span className="block">
                <TextEffect as="span" per="word" preset="fade">
                  Software that stays,
                </TextEffect>
              </span>
              <span className="block mt-1">
                <i className="text-violL">
                  <TextEffect as="span" per="word" preset="slide" delay={0.2}>
                    like a good
                  </TextEffect>
                </i>{" "}
                <i>
                  <TextEffect as="span" per="char" preset="blur" delay={0.35}>
                    jirani.
                  </TextEffect>
                </i>
              </span>
            </h1>
            <p className="text-white/60 mt-6 max-w-xl text-[15px] md:text-base">
              Launch day is the middle of the story, not the end. We measure ourselves by systems still running years
              later — and clients who call us family.
            </p>
          </Reveal>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-cream py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imp.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <TiltCard intensity={8} className="bg-white border border-deep/10 rounded-3xl p-7 text-center h-full">
                  <div className="font-grotesk font-bold text-4xl md:text-5xl text-viol">
                    <Counter target={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-xs text-deep/55 mt-2">{s.label}</div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FULL LIVE PORTFOLIO ============ */}
      <section className="bg-white py-20 md:py-28 border-y border-line">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <Reveal>
              <div className="eyebrow text-viol mb-4 flex items-center gap-3">
                <span className="w-10 h-[2px] bg-viol inline-block" /> The portfolio — All Live Deployments
              </div>
              <h2 className="display text-4xl md:text-6xl font-medium">
                Everything here is <i className="text-viol">live.</i>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-deep/60 max-w-sm text-[15px]">
                Websites, apps, and enterprise systems — in production, serving real users across Tanzania and beyond. Click any card to inspect full specifications.
              </p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {content.projects.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.07}>
                <div
                  onClick={() => setModalProject(p)}
                  className="block h-full group cursor-pointer text-left"
                >
                  <TiltCard intensity={7} className="bg-cream border border-deep/10 rounded-3xl overflow-hidden h-full hover:border-viol transition-colors shadow-sm hover:shadow-lg">
                    {p.media[0] && (
                      <div className="relative h-48 overflow-hidden bg-deep/5">
                        {p.media[0].type === "video" ? (
                          <video
                            src={p.media[0].url}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                            onMouseLeave={(e) => e.currentTarget.pause()}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.media[0].url}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.parentElement?.classList.add("bg-gradient-to-br", "from-[#0A1735]", "to-[#1E1B4B]", "flex", "items-center", "justify-center");
                            }}
                          />
                        )}
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="absolute top-3 right-3 bg-deep/90 hover:bg-viol text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md transition-colors"
                          title="Open live website in new tab"
                        >
                          <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" /> LIVE ↗
                        </a>
                        {p.featured && (
                          <span className="absolute top-3 left-3 bg-viol text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                            ★ FEATURED
                          </span>
                        )}
                      </div>
                    )}
                    <div className="p-5 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-center gap-2 text-[10px] font-grotesk font-bold tracking-widest text-deep/40">
                          {p.category.toUpperCase()} · {p.year}
                        </div>
                        <div className="font-grotesk font-bold text-lg mt-1.5 group-hover:text-viol transition-colors">{p.title}</div>
                        <div className="text-xs text-deep/45 mt-0.5">{p.client}</div>
                        <p className="text-sm text-deep/60 mt-2 line-clamp-3 leading-relaxed">{p.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {p.tags.slice(0, 4).map((t) => (
                            <span key={t} className="bg-deep/5 border border-deep/10 text-deep/55 text-[10px] font-bold px-2 py-0.5 rounded-full">{t}</span>
                          ))}
                        </div>
                        {p.media.length > 1 && (
                          <div className="mt-3 flex gap-1.5">
                            {p.media.slice(1).map((m, mi) => (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                key={mi}
                                src={m.type === "image" ? m.url : undefined}
                                alt=""
                                className="w-12 h-9 rounded-lg object-cover border border-deep/10"
                                loading="lazy"
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-deep/5 flex items-center justify-between text-xs font-semibold text-viol group-hover:underline">
                        <span>View full details →</span>
                        <span className="text-[11px] text-deep/40 group-hover:text-deep/70">Click for overview</span>
                      </div>
                    </div>
                  </TiltCard>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS + SECTORS */}
      <section className="bg-white py-20 md:py-28 border-y border-line">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-10 items-start">
          <Reveal>
            <TestimonialCarousel />
          </Reveal>
          <div className="space-y-4">
            <Reveal delay={0.1}>
              <h2 className="display text-3xl md:text-4xl font-medium">
                Sectors we <i className="text-viol">serve.</i>
              </h2>
            </Reveal>
            <div className="grid grid-cols-3 gap-3">
              {imp.sectors.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.08}>
                  <div className="rounded-2xl overflow-hidden h-32 relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={s.label} loading="lazy" />
                    <div className="absolute inset-0 bg-deep/50 flex items-end p-3 text-white text-[11px] font-bold">{s.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2}>
              <div className="bg-deep text-white rounded-2xl p-6">
                <div className="text-[11px] font-grotesk font-bold tracking-[0.25em] text-white/40 mb-3">WHO WE SERVE — TUNAWAHUDUMIA</div>
                <p className="text-sm text-white/70 leading-relaxed">{content.about.whoWeServe}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SUPPORT PLANS */}
      <section className="bg-deep text-white relative overflow-hidden">
        <div className="noise-blue absolute inset-0" />
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-20 md:py-28 relative">
          <Reveal className="text-center text-[11px] font-grotesk font-bold tracking-[0.3em] text-white/40 mb-10">
            MAINTENANCE & SUPPORT PLANS — AFTER LAUNCH
          </Reveal>
          <div className="grid md:grid-cols-3 gap-4">
            {content.pricing.supportPlans.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <div
                  className={`rounded-3xl p-7 h-full relative overflow-hidden transition-colors ${
                    p.popular ? "bg-viol shadow-2xl shadow-viol/30" : "bg-white/[0.06] border border-white/10 hover:border-violL/50"
                  }`}
                >
                  {p.popular && (
                    <div className="absolute top-4 right-4 text-[10px] font-bold bg-white text-viol px-3 py-1 rounded-full tracking-widest">
                      POPULAR
                    </div>
                  )}
                  <div className={`text-xs font-grotesk font-bold tracking-widest ${p.popular ? "text-white/70" : "text-white/50"}`}>
                    {p.name.toUpperCase()}
                  </div>
                  <div className="font-grotesk font-bold text-3xl mt-2">
                    {p.price === "custom" ? "Custom" : `TSh ${Math.round(p.price / 1000)}k`}
                    {p.price !== "custom" && <span className={`text-sm font-sans font-normal ${p.popular ? "text-white/70" : "text-white/50"}`}>{p.unit}</span>}
                  </div>
                  <ul className={`text-sm mt-4 space-y-2.5 ${p.popular ? "text-white/85" : "text-white/65"}`}>
                    {p.features.map((f) => (
                      <li key={f}>
                        <i className={`fa-solid fa-check mr-2 ${p.popular ? "text-white" : "text-green-400"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="text-center mt-10">
            <TransitionLink href="/pricing" className="inline-flex items-center gap-2 text-sm font-bold text-violL hover:text-white transition-colors">
              Compare with build pricing <i className="fa-solid fa-arrow-right" />
            </TransitionLink>
          </Reveal>
        </div>
      </section>

      <ProjectModal project={modalProject} onClose={() => setModalProject(null)} />
    </div>
  );
}