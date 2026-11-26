"use client";

import { Rise } from "@/components/usiku";
import type { SiteContent } from "@/lib/content";

/* ============================================================
   METHOD — a horizontal phase rail, not stacked cards.

   The phase dots sit on one continuous hairline so the section reads
   as a process (a line you travel) rather than four unrelated boxes.
   ============================================================ */

export default function Process({ content }: { content: SiteContent }) {
  const phases = content.processPhases ?? [];

  return (
    <section id="method" className="u-section relative bg-noir2">
      <div className="u-wrap">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <span className="u-label">04 — How we build</span>
            <h2 className="u-display mt-4">
              Mchakato.
              <br />
              <span className="u-outline-dim">No guesswork.</span>
            </h2>
          </div>
          <p className="u-lead max-w-[40ch] md:text-right">
            Written scope, fixed price, working software at every phase.
          </p>
        </div>

        <div className="relative">
          {/* the rail */}
          <div className="hidden md:block absolute left-0 right-0 top-[7px] h-px bg-wire" />
          <div className="grid md:grid-cols-4 gap-10 md:gap-6">
            {phases.map((p, i) => (
              <Rise key={p.title ?? i} delay={i * 0.07}>
                <div className="relative">
                  <div className="flex items-center gap-3 md:block">
                    <span className="relative z-10 block w-[15px] h-[15px] rounded-full border-2 border-bone/70 bg-noir2" />
                    <span className="u-label md:hidden">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="mt-4 md:mt-6">
                    <span className="u-label hidden md:block">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="font-display text-xl md:text-2xl font-bold uppercase tracking-tight mt-2">
                      {p.title}
                    </h3>
                    <p className="text-bone/60 text-sm leading-relaxed mt-3 max-w-[34ch]">
                      {p.body}
                    </p>
                  </div>
                </div>
              </Rise>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
