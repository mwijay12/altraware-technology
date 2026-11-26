"use client";

import { useState } from "react";
import { TransitionLink } from "@/components/Navbar";
import { Reveal } from "@/components/motion";
import { useContent } from "@/components/providers";

/* ============================================================
   Shared marketing sections that live outside the home page:
   /services imports the accordion, /impact imports the
   carousel. Kept here (not in page.tsx) so neither page drags
   the home bundle in.
   ============================================================ */

export function ServicesAccordion({ preview = false }: { preview?: boolean }) {
  const { content } = useContent();
  const [open, setOpen] = useState<string>("websites");

  return (
    <section id="services" className="border-t border-rule">
      <div className="mx-auto max-w-[1240px] px-[var(--pad)] py-14 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
          <Reveal>
            <div className="label mb-4">Services</div>
            <h2 className="display text-[34px] sm:text-[44px] md:text-[54px] leading-[1.02] max-w-[18ch]">
              Three kinds of work, one standard.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-ink-2 max-w-[38ch] text-[15px] md:text-right">
              Sites that get you found. Apps that replace the notebook. Systems that run the
              whole operation.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <div>
            {content.services.map((s) => (
              <div
                key={s.id}
                className={`service-row ${open === s.id ? "open" : ""}`}
                onMouseEnter={() => {
                  if (typeof window !== "undefined" && window.innerWidth >= 768) setOpen(s.id);
                }}
              >
                <button
                  className="w-full flex items-baseline gap-4 md:gap-8 py-6 md:py-7 text-left"
                  onClick={() => setOpen(open === s.id ? "" : s.id)}
                  aria-expanded={open === s.id}
                >
                  <span className="num text-[11px] text-ink-3 w-6 shrink-0">{s.num}</span>
                  <span className="flex-1">
                    <span className="display text-[26px] md:text-[34px] block leading-tight">{s.title}</span>
                    <span className="text-ink-3 text-[14px] mt-1 block">{s.subtitle}</span>
                  </span>
                  {s.startingPrice && (
                    <span className="num text-[12px] text-ink-2 hidden sm:block shrink-0 mr-2">
                      from TSh {s.startingPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="plus w-9 h-9 rounded-[3px] border border-rule flex items-center justify-center shrink-0 text-[13px]">
                    +
                  </span>
                </button>

                <div className="service-body">
                  <div className="service-inner">
                    <div className="pb-8 pl-10 md:pl-[72px] pr-1 grid md:grid-cols-[1.1fr_1fr] gap-8">
                      <div>
                        <p className="text-ink-2 leading-relaxed text-[15px] max-w-[52ch]">{s.description}</p>
                        <ul className="mt-5 space-y-2.5">
                          {s.highlights.slice(0, 3).map((h) => (
                            <li key={h.title} className="flex gap-3 text-[14px]">
                              <span aria-hidden className="text-clay shrink-0 mt-[2px]">·</span>
                              <span>
                                <span className="font-medium text-ink">{h.title}.</span>{" "}
                                <span className="text-ink-3">{h.body}</span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-col justify-between gap-5">
                        <div className="flex flex-wrap gap-1.5">
                          {s.tags.map((t) => (
                            <span
                              key={t}
                              className="num text-[10px] uppercase tracking-[0.06em] text-ink-3 border border-rule px-2 py-1 rounded-[2px]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        <TransitionLink
                          href="/services"
                          className="inline-flex items-center gap-2 text-[14px] font-medium text-ink link-underline w-fit"
                        >
                          How we build {s.title.toLowerCase()} <span aria-hidden>→</span>
                        </TransitionLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {preview && (
          <Reveal className="mt-8">
            <TransitionLink href="/services" className="inline-flex items-center gap-2 text-[14px] font-medium text-ink link-underline">
              All services in detail <span aria-hidden>→</span>
            </TransitionLink>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   Testimonial carousel — kept for /impact. Flat paper card,
   clay rule, no glass, no gradient.
   ============================================================ */

export function TestimonialCarousel() {
  const { content } = useContent();
  const [idx, setIdx] = useState(0);
  const slides = content.impact.testimonials;

  return (
    <div className="bg-paper-2/60 border border-rule rounded-[6px] p-6 md:p-8 relative overflow-hidden min-h-[340px] flex flex-col">
      <div className="label mb-6">Client voices</div>
      <div className="relative flex-1 min-h-[190px]">
        {slides.map((s, i) => (
          <div key={s.name} className={`testi-slide ${i === idx ? "active" : ""}`}>
            <p className="display text-[22px] md:text-[26px] leading-snug normal-case tracking-normal">
              &ldquo;{s.quote}&rdquo;
            </p>
            <div className="mt-5">
              <div className="text-[14px] font-medium">{s.name}</div>
              <div className="text-[13px] text-ink-3">{s.role}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-6 pt-5 border-t border-rule">
        <button
          onClick={() => setIdx((idx - 1 + slides.length) % slides.length)}
          className="w-9 h-9 rounded-full border border-rule flex items-center justify-center hover:border-ink transition-colors text-[13px]"
          aria-label="Previous testimonial"
        >
          ←
        </button>
        <button
          onClick={() => setIdx((idx + 1) % slides.length)}
          className="w-9 h-9 rounded-full border border-rule flex items-center justify-center hover:border-ink transition-colors text-[13px]"
          aria-label="Next testimonial"
        >
          →
        </button>
        <div className="flex gap-1.5 ml-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-px transition-all ${i === idx ? "w-6 bg-ink" : "w-3 bg-rule"}`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
        <div className="ml-auto num text-[11px] text-ink-3">
          {String(idx + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}
