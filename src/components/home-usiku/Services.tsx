"use client";

import { useState } from "react";
import { Rise } from "@/components/usiku";
import { TransitionLink } from "@/components/Navbar";
import type { SiteContent } from "@/lib/content";

/* ============================================================
   SERVICES — numbered hairline rows, not cards.

   Each row expands in place. No rounded card, no drop shadow, no
   three-column icon grid: those are the stock tells.
   ============================================================ */

export default function Services({ content }: { content: SiteContent }) {
  const [open, setOpen] = useState<string | null>(content.services[0]?.id ?? null);

  return (
    <section id="services" className="u-section relative">
      <div className="u-wrap">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <span className="u-label">03 — Services</span>
            <h2 className="u-display mt-4">
              Tunachojenga.
              <br />
              <span className="u-outline-dim">What we build.</span>
            </h2>
            <p className="u-lead mt-6 max-w-[42ch]">
              Three things, done properly. Every engagement starts with a written
              scope and an honest price — no discovery theatre.
            </p>
            <TransitionLink href="/services" className="u-btn u-btn-ghost mt-8">
              Full service detail
              <span aria-hidden="true">→</span>
            </TransitionLink>
          </div>

          <div className="border-t border-wire">
            {content.services.map((s, i) => {
              const isOpen = open === s.id;
              return (
                <Rise key={s.id} delay={i * 0.05}>
                  <div className="border-b border-wire">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : s.id)}
                      aria-expanded={isOpen}
                      className="w-full flex items-baseline gap-5 md:gap-8 py-7 md:py-9 text-left group"
                    >
                      <span className="u-label shrink-0 w-8">{String(i + 1).padStart(2, "0")}</span>
                      <span
                        className={`flex-1 font-display text-2xl md:text-4xl font-bold uppercase tracking-tight transition-colors duration-300 ${
                          isOpen ? "text-bone" : "text-bone/55 group-hover:text-bone"
                        }`}
                      >
                        {s.title}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`shrink-0 text-xl text-bone/40 transition-transform duration-500 ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      >
                        +
                      </span>
                    </button>

                    <div
                      className="grid transition-[grid-template-rows,opacity] duration-500 ease-out"
                      style={{
                        gridTemplateRows: isOpen ? "1fr" : "0fr",
                        opacity: isOpen ? 1 : 0,
                      }}
                    >
                      <div className="overflow-hidden">
                        <div className="pl-13 md:pl-16 pb-8 pr-2">
                          <p className="text-bone/70 text-[15px] leading-relaxed max-w-[54ch]">
                            {s.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-5">
                            {s.tags.map((t) => (
                              <span
                                key={t}
                                className="u-label border border-wire rounded-full px-3 py-1.5 text-bone/60"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                          {s.startingPrice ? (
                            <p className="mt-5 font-display text-lg font-bold">
                              From TSh {s.startingPrice.toLocaleString("en-US")}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </Rise>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
