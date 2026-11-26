"use client";

import MediaImage from "@/components/MediaImage";
import { Rise, useParallax, useHeadline, StatFigure } from "@/components/usiku";
import { TransitionLink } from "@/components/Navbar";
import type { SiteContent } from "@/lib/content";

/* ============================================================
   STATEMENT — large type over a parallax image, generous space.

   This is where the reference sites breathe: one idea, huge, with
   an image that moves slower than the page.
   ============================================================ */

export default function Statement({ content }: { content: SiteContent }) {
  const titleRef = useHeadline<HTMLDivElement>();
  const ref = useParallax<HTMLDivElement>(0.08);

  return (
    <section className="u-section relative overflow-hidden">
      <div className="u-wrap">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-20 items-center">
          <div>
            <span className="u-label">01 — Mizizi · Roots</span>
            <div ref={titleRef} className="u-settle u-scrub">
              <h2 className="u-display mt-5">
                Built in Tanzania,
                <br />
                for <span className="u-outline">how Tanzania</span>
                <br />
                actually works.
              </h2>
            </div>
            <Rise delay={0.1}>
              <p className="u-lead mt-7 max-w-[56ch]">{content.about.shortDescription}</p>
            </Rise>

            <Rise delay={0.16}>
              <div className="grid grid-cols-3 gap-x-5 gap-y-8 mt-10 max-w-md">
                {[
                  { n: 11, l: "In production" },
                  { n: 2, l: "Languages" },
                  { n: "2G", l: "Offline-ready" },
                ].map((s) => (
                  <div key={s.l}>
                    <StatFigure
                      value={s.n}
                      className="font-display text-3xl md:text-4xl font-extrabold"
                    />
                    <div className="u-label mt-1.5">{s.l}</div>
                  </div>
                ))}
              </div>
            </Rise>

            <Rise delay={0.22}>
              <TransitionLink href="/about" className="u-link mt-10 inline-block text-sm text-bone/80">
                Read our full story →
              </TransitionLink>
            </Rise>
          </div>

          <div ref={ref} className="u-parallax">
            <div className="u-frame h-[420px] md:h-[560px]">
              <MediaImage
                src={content.images.streetTz}
                alt="Dar es Salaam street — the businesses Altraware builds for"
                label="Dar es Salaam"
                className="w-full h-full"
                sizes="(max-width: 1023px) 100vw, 45vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
