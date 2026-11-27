"use client";

import { useEffect, useState } from "react";
import { useContent, useNotify } from "@/components/providers";
import type { Project } from "@/lib/content";
import ProjectModal from "@/components/ui/ProjectModal";
import Hero from "@/components/home-usiku/Hero";
import Statement from "@/components/home-usiku/Statement";
import Work from "@/components/home-usiku/Work";
import Services from "@/components/home-usiku/Services";
import Process from "@/components/home-usiku/Process";
import Closing from "@/components/home-usiku/Closing";
import { Ticker } from "@/components/usiku";
// --- imports still required by the shared components kept below
//     (ServicesAccordion is used by /services, TestimonialCarousel by /impact)
import { Reveal } from "@/components/motion";
import { TransitionLink } from "@/components/Navbar";
import { TextEffect } from "@/components/ui/text-effect";

/* ============================================================
   HOME — "Usiku" (night) v4.

   Section order is a rhythm, not a list:
     hero → ticker → statement → work → services → method → proof → close

   The ticker between hero and content is the one piece of continuous
   motion on the page; everything else is scroll-triggered and stops.
   ============================================================ */

const TICKER_ITEMS = [
  "TOVUTI ZA BIASHARA",
  "FAIDA POS · OFFLINE",
  "CARETRACK CLINIC",
  "M-PESA NATIVE",
  "KISWAHILI-FIRST",
  "DAR ES SALAAM",
];

export default function Home() {
  const { content } = useContent();
  const { notify } = useNotify();
  const [modalProject, setModalProject] = useState<Project | null>(null);

  useEffect(() => {
    const welcome = window.setTimeout(
      () => notify("Karibu Altraware ✓ — explore what we build"),
      6000
    );
    return () => clearTimeout(welcome);
  }, [notify]);

  return (
    <div className="u-grain">
      <Hero content={content} />

      <div className="border-y border-wire py-4 md:py-5">
        <Ticker>
          {TICKER_ITEMS.map((t) => (
            <span key={t} className="u-label text-bone/45 whitespace-nowrap">
              {t}
              <span className="ml-10 text-bone/20" aria-hidden="true">✦</span>
            </span>
          ))}
        </Ticker>
      </div>

      <Statement content={content} />
      <Work content={content} onOpen={setModalProject} />
      <Services content={content} />
      <Process content={content} />
      <Closing content={content} />

      <ProjectModal project={modalProject} onClose={() => setModalProject(null)} />
    </div>
  );
}

export function ServicesAccordion({ preview = false }: { preview?: boolean }) {
  const { content } = useContent();
  const [open, setOpen] = useState<string>("websites");

  return (
    <section id="services" className="bg-cream py-10 md:py-24 relative">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <Reveal>
            <div className="eyebrow text-viol flex items-center gap-3 mb-4">
              <span className="w-10 h-[2px] bg-viol inline-block" />
              <span>Act II — What We Build · Three Crafts</span>
            </div>
            {/* In preview mode (the home page) the accordion carries the
                headline. On /services the page hero already says exactly
                this sentence — printing it twice on one scroll was the
                loudest remaining duplication on the site. */}
            {preview ? (
              <h2 className="display text-4xl md:text-6xl font-medium">
                <span className="block">
                  <TextEffect as="span" per="word" preset="fade" viewport={{ once: true }}>
                    Three crafts.
                  </TextEffect>
                </span>
                <span className="block mt-1">
                  <i className="font-light text-deep/50">
                    <TextEffect as="span" per="word" preset="slide" delay={0.2} viewport={{ once: true }}>
                      One standard:
                    </TextEffect>
                  </i>{" "}
                  <i className="text-viol">
                    <TextEffect as="span" per="word" preset="blur" delay={0.4} viewport={{ once: true }}>
                      excellent.
                    </TextEffect>
                  </i>
                </span>
              </h2>
            ) : (
              <h2 className="display text-3xl md:text-5xl font-medium">
                Pick a craft — <i className="text-viol">see the detail.</i>
              </h2>
            )}
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-deep/60 max-w-sm text-[15px]">
              From high-impact business sites to platforms that run your entire operation. Hover or tap each craft to preview.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <div>
            {content.services.map((s) => (
              <div
                key={s.id}
                className={`service-row transition-all ${open === s.id ? "open" : ""} ${s.num === "01" ? "rounded-t-2xl" : ""} ${s.num === "03" ? "rounded-b-2xl" : ""}`}
                onMouseEnter={() => {
                  if (typeof window !== "undefined" && window.innerWidth >= 768) {
                    setOpen(s.id);
                  }
                }}
              >
                <button
                  className="w-full flex items-center gap-5 md:gap-8 py-6 px-4 md:px-8 text-left cursor-pointer"
                  onClick={() => setOpen(open === s.id ? "" : s.id)}
                >
                  <span className="font-serif italic text-viol text-xl hidden sm:block">{s.num}</span>
                  <span className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-lg shrink-0 ${s.accent ?? "bg-deep text-white"}`}>
                    <i className={`fa-solid ${s.icon}`} />
                  </span>
                  <span className="flex-1">
                    <span className="display text-2xl md:text-3xl font-medium block">{s.title}</span>
                    <span className="text-deep/55 text-sm line-clamp-1">{s.subtitle}</span>
                  </span>
                  <span className="hidden md:flex gap-2 text-[11px] font-grotesk font-bold">
                    {s.tags.map((t) => (
                      <span key={t} className="bg-deep/5 border border-deep/10 px-3 py-1.5 rounded-full">{t}</span>
                    ))}
                  </span>
                  <span className="plus w-11 h-11 rounded-full border border-deep/20 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-plus" />
                  </span>
                </button>
                <div className="service-body">
                  <div className="service-inner">
                    <div className="px-4 md:px-8 pb-6 grid md:grid-cols-2 gap-4 items-center">
                      <div>
                        <p className="text-deep/70 leading-relaxed text-sm">{s.description}</p>
                        {s.startingPrice && (
                          <div className="inline-flex items-center gap-2.5 mt-4 bg-deep text-white rounded-xl px-4 py-2 text-xs shadow-sm">
                            <span className="text-white/60">Starting from</span>
                            <span className="font-grotesk font-bold text-sm text-violL">TSh {s.startingPrice.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                      <div className="grid gap-2">
                        {s.highlights.slice(0, 3).map((h) => (
                          <div key={h.title} className="bg-white border border-deep/10 rounded-xl p-3 flex items-start gap-3">
                            <span className="w-8 h-8 rounded-lg bg-viol/10 text-viol flex items-center justify-center text-xs shrink-0 mt-0.5">
                              <i className={`fa-solid ${h.icon || "fa-check"}`} />
                            </span>
                            <div className="flex-1">
                              <div className="font-grotesk font-bold text-xs">{h.title}</div>
                              <div className="text-[11px] text-deep/60 mt-0.5 leading-snug">{h.body}</div>
                            </div>
                          </div>
                        ))}
                        {/* On /services the detail block is further down the
                            same page, so navigating to "/services" was a
                            dead end that reloaded the page you were on. */}
                        <a
                          href={preview ? "/services" : `#${s.id}`}
                          className="text-center bg-viol hover:bg-violD transition-colors text-white text-xs font-bold py-2.5 rounded-xl mt-1"
                        >
                          {preview ? `Explore ${s.title} details →` : `Jump to ${s.title} ↓`}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        {preview && (
          <Reveal className="text-center mt-8">
            <TransitionLink href="/services" className="inline-flex items-center gap-2 text-sm font-bold text-viol hover:text-deep transition-colors">
              See all services in detail <i className="fa-solid fa-arrow-right" />
            </TransitionLink>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   Testimonial carousel (auto-rotating)
   ============================================================ */

export function TestimonialCarousel() {
  const { content } = useContent();
  const [idx, setIdx] = useState(0);
  const slides = content.impact.testimonials;

  useEffect(() => {
    const int = window.setInterval(() => setIdx((i) => (i + 1) % slides.length), 7000);
    return () => clearInterval(int);
  }, [slides.length]);

  return (
    <div className="bg-white text-deep rounded-3xl p-7 md:p-9 relative overflow-hidden min-h-[380px]">
      <div className="text-[11px] font-grotesk font-bold tracking-[0.25em] text-viol mb-5">SAUTI ZA WATEJA · CLIENT VOICES</div>
      <div className="relative h-[240px] md:h-[210px]">
        {slides.map((s, i) => (
          <div key={s.name} className={`testi-slide ${i === idx ? "active" : ""}`}>
            <p className="font-serif italic text-xl md:text-2xl leading-snug">“{s.quote}”</p>
            <div className="flex items-center gap-3 mt-5">
              <div className={`w-11 h-11 rounded-full ${s.color} text-white flex items-center justify-center font-bold`}>
                {s.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-sm">{s.name}</div>
                <div className="text-xs text-deep/50">{s.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={() => setIdx((idx - 1 + slides.length) % slides.length)}
          className="w-11 h-11 rounded-full border border-deep/15 flex items-center justify-center hover:bg-deep hover:text-white transition-all"
          aria-label="Previous testimonial"
        >
          <i className="fa-solid fa-arrow-left text-sm" />
        </button>
        <button
          onClick={() => setIdx((idx + 1) % slides.length)}
          className="w-11 h-11 rounded-full border border-deep/15 flex items-center justify-center hover:bg-deep hover:text-white transition-all"
          aria-label="Next testimonial"
        >
          <i className="fa-solid fa-arrow-right text-sm" />
        </button>
        <div className="flex gap-2 ml-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-2 rounded-full transition-all ${i === idx ? "w-8 bg-viol" : "w-2 bg-deep/15"}`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
        <div className="ml-auto text-xs font-grotesk font-bold text-deep/55">
          0{idx + 1} / 0{slides.length}
        </div>
      </div>
    </div>
  );
}