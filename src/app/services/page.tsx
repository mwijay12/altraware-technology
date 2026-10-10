"use client";

import { useState } from "react";
import { TransitionLink } from "@/components/Navbar";
import { Reveal, TiltCard, ImgReveal, MediaBlock } from "@/components/motion";
import { useContent } from "@/components/providers";
import { ServicesAccordion } from "@/app/page";
import { useVisitorCurrency } from "@/lib/geo-pricing";
import { TextEffect } from "@/components/ui/text-effect";

/* CRAFT / STACK section (shared with reference) */
const STACK = [
  { icon: "fa-brands fa-react", color: "text-sky-500", name: "Next.js 16", desc: "React Server Components, streaming & edge rendering for instant loads.", tag: "app router · ISR · edge" },
  { icon: "Ts", color: "text-[#3178C6]", name: "TypeScript", desc: "Type-safe code that catches bugs before your customers ever see them.", tag: "strict mode · zero any" },
  { icon: "fa-solid fa-wind", color: "text-sky-500", name: "Tailwind CSS", desc: "Design systems that stay consistent from landing page to dashboard.", tag: "design tokens · a11y" },
  { icon: "fa-solid fa-bolt", color: "text-amber-500", name: "GSAP Motion", desc: "Cinematic scroll stories and micro-interactions — like this very page.", tag: "scrolltrigger · 60fps" },
  { icon: "fa-solid fa-database", color: "text-indigo-500", name: "PostgreSQL + Prisma", desc: "Reliable data with encrypted backups. Your records, safe and yours.", tag: "encrypted · audited" },
  { icon: "fa-solid fa-mobile-screen", color: "text-green-600", name: "M-Pesa API + SMS", desc: "Daraja STK push, C2B callbacks and SMS fallbacks when data drops.", tag: "daraja · vodacom · tigo" },
];

export default function ServicesPage() {
  const { content } = useContent();
  const geo = useVisitorCurrency();

  return (
    <div className="pt-[120px]">
      {/* HERO */}
      <section className="relative overflow-hidden grid-bg">
        <div className="absolute -top-32 -right-32 w-[560px] h-[560px] rounded-full bg-viol/10 blur-[120px] pointer-events-none" />
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-16 md:py-24">
          <Reveal>
            <div className="eyebrow text-viol mb-4 flex items-center gap-3">
              <span className="w-10 h-[2px] bg-viol inline-block" /> What we build
            </div>
            <h1 className="display text-5xl md:text-7xl font-medium">
              <span className="block">
                <TextEffect as="span" per="word" preset="fade">
                  Three crafts.
                </TextEffect>
              </span>
              <span className="block mt-1">
                <i className="font-light text-deep/50">
                  <TextEffect as="span" per="word" preset="slide" delay={0.2}>
                    One standard:
                  </TextEffect>
                </i>{" "}
                <i className="text-viol">
                  <TextEffect as="span" per="char" preset="blur" delay={0.4}>
                    excellent.
                  </TextEffect>
                </i>
              </span>
            </h1>
          </Reveal>
        </div>
      </section>

      {/* ACCORDION (full version, no preview link) */}
      <ServicesAccordion />

      {/* DETAILED CARDS PER SERVICE */}
      <section className="bg-cream py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 space-y-16">
          {content.services.map((s) => (
            <div key={s.id} id={s.id}>
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <Reveal>
                  <div className="font-serif italic text-viol/60 text-xl">{s.num}</div>
                  <h2 className="display text-4xl md:text-5xl font-medium mt-2">{s.title}</h2>
                  <p className="text-deep/65 mt-4 leading-relaxed">{s.description}</p>
                  <div className="flex flex-wrap gap-2 mt-5">
                    {s.tags.map((t) => (
                      <span key={t} className="bg-deep/5 border border-deep/10 px-3.5 py-1.5 rounded-full text-[11px] font-grotesk font-bold">{t}</span>
                    ))}
                  </div>
                  {s.startingPrice && (
                    <div className="mt-6 inline-flex items-center gap-3 bg-deep text-white rounded-2xl px-5 py-4">
                      <span className="text-white/60 text-sm">Starting from</span>
                      <span className="font-grotesk font-bold text-lg">{geo.fmt(s.startingPrice)}</span>
                    </div>
                  )}
                </Reveal>
                <Reveal delay={0.1}>
                  <div className="grid gap-3">
                    {s.highlights.map((h) => (
                      <TiltCard key={h.title} intensity={6} className="bg-white border border-deep/10 rounded-2xl p-5">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-viol/10 text-viol flex items-center justify-center text-xs shrink-0">
                            <i className={`fa-solid ${h.icon || "fa-check"}`} />
                          </span>
                          <div className="font-grotesk font-bold text-sm">{h.title}</div>
                        </div>
                        <div className="text-sm text-deep/60 mt-2">{h.body}</div>
                        {h.proof && <div className="mt-2.5 text-[11px] font-mono text-green-700">{h.proof}</div>}
                      </TiltCard>
                    ))}
                  </div>
                </Reveal>
              </div>
              {s.media && s.media.length > 0 && (
                <div className="mt-8">
                  <MediaBlock items={s.media} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CRAFT / STACK */}
      <section className="bg-white py-20 md:py-28 relative overflow-hidden border-y border-line">
        <div className="absolute top-10 left-0 font-serif italic text-[16vw] leading-none text-deep/[0.035] select-none pointer-events-none whitespace-nowrap">
          Craft — Engineering
        </div>
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 relative">
          <div className="grid lg:grid-cols-[380px_1fr] gap-12">
            <Reveal>
              <div className="eyebrow text-viol flex items-center gap-3 mb-4">
                <span className="w-10 h-[2px] bg-viol inline-block" /> Modern Engineering
              </div>
              <h2 className="display text-4xl md:text-5xl font-medium">
                Global stack.<br /><i className="text-viol">Local sense.</i>
              </h2>
              <p className="text-deep/60 mt-5 text-[15px] leading-relaxed">
                We build on Next.js 16 + TypeScript — the same foundation used by world-class teams — then tune every
                byte for Tanzanian networks, devices and wallets.
              </p>
              <div className="mt-7 bg-deep text-white rounded-2xl p-5 font-mono text-xs leading-relaxed">
                <div className="flex items-center gap-2 text-white/40 mb-3 text-[10px] tracking-widest font-sans font-bold">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> PRODUCTION · ALTRAWARE CLOUD
                </div>
                <div><span className="text-violL">▲</span> next build <span className="text-white/40">— Next.js 16.3</span></div>
                <div className="text-green-400">✓ Compiled in 4.2s</div>
                <div className="text-white/60">✓ 42 routes · 0 errors</div>
                <div className="text-white/60">✓ Lighthouse <span className="text-amber-300">98 / 100 / 100 / 100</span></div>
                <div className="text-violL">✓ Deployed → Dar es Salaam edge</div>
              </div>
            </Reveal>
            <div className="grid sm:grid-cols-2 gap-4">
              {STACK.map((t, i) => (
                <Reveal key={t.name} delay={i * 0.06}>
                  <div className="stack-card bg-cream border border-deep/10 rounded-2xl p-6 h-full">
                    <div className="stack-icon w-12 h-12 rounded-xl bg-deep/5 border border-deep/10 flex items-center justify-center text-xl transition-all">
                      {t.icon.startsWith("Ts") ? <span className="font-bold text-[#3178C6]">Ts</span> : <i className={`${t.icon} ${t.color}`} />}
                    </div>
                    <div className="font-grotesk font-bold mt-4">{t.name}</div>
                    <p className="text-sm text-deep/55 mt-1.5">{t.desc}</p>
                    <div className="mt-3 text-[11px] font-mono text-viol font-bold">{t.tag}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WEBSITE PREVIEW IMAGE (from reference) */}
      <section className="bg-cream py-16">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 grid md:grid-cols-3 gap-4">
          <ImgReveal src={content.images.webPreview} alt="Website preview" className="rounded-2xl h-56" imgClassName="w-full h-full object-cover" />
          <ImgReveal src={content.images.sectorRetail} alt="Retail" className="rounded-2xl h-56 mt-8" imgClassName="w-full h-full object-cover" />
          <ImgReveal src={content.images.sectorSchool} alt="School" className="rounded-2xl h-56 mt-16" imgClassName="w-full h-full object-cover" />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-deep text-white relative overflow-hidden">
        <div className="noise-blue absolute inset-0" />
        <div className="max-w-[900px] mx-auto px-5 py-24 text-center relative">
          <Reveal>
            <h2 className="display text-4xl md:text-6xl font-medium">
              Not sure which craft <i className="text-violL">fits?</i>
            </h2>
            <p className="text-white/55 mt-4 max-w-md mx-auto">Tell us the problem — we&apos;ll recommend the honest solution, even if it&apos;s smaller than you expected.</p>
          </Reveal>
          <Reveal delay={0.15} className="flex flex-wrap justify-center gap-3 mt-8">
            <TransitionLink href="/contact" className="bg-white text-deep px-8 py-4 rounded-full font-bold text-sm hover:bg-viol hover:text-white transition-all">
              Get a quote
            </TransitionLink>
            <TransitionLink href="/pricing" className="px-8 py-4 rounded-full font-bold text-sm border border-white/20 hover:border-violL transition-all">
              See pricing
            </TransitionLink>
          </Reveal>
        </div>
      </section>
    </div>
  );
}