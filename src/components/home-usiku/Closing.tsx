"use client";

import { Rise, useFitHeadline, StatFigure } from "@/components/usiku";
import { TransitionLink } from "@/components/Navbar";
import MediaImage from "@/components/MediaImage";
import type { SiteContent } from "@/lib/content";

/* ============================================================
   PROOF + CLOSING.

   One real quote with a face, then the biggest type on the page.
   JEWEL use #2 of 8 lives in the hero CTA; this section spends only
   the final one on the closing button.
   ============================================================ */

export default function Closing({ content }: { content: SiteContent }) {
  const titleRef = useFitHeadline<HTMLHeadingElement>();
  const quote = content.impact.testimonials?.[0];
  const wa = `https://wa.me/255792867427?text=${encodeURIComponent(
    "Habari Altraware — I'd like to talk about a project."
  )}`;

  return (
    <>
      <section className="u-section bg-noir2 relative">
        <div className="u-wrap">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-center">
            <Rise>
              <div className="relative">
                <div className="u-frame h-[300px] md:h-[360px] rounded-sm">
                  <MediaImage
                    src={content.images.community}
                    alt="Tanzanian business owners using systems built by Altraware"
                    label="Kariakoo, Dar es Salaam"
                    className="w-full h-full"
                    sizes="(max-width: 1023px) 100vw, 40vw"
                  />
                </div>
                {quote?.name && (
                  <div className="absolute -bottom-6 left-5 right-5 md:left-8 md:right-8 bg-noir border border-wire rounded-sm p-4 flex items-center gap-3">
                    <MediaImage
                      src={content.images.clientAvatar}
                      alt={quote.name}
                      label={quote.name}
                      className="w-11 h-11 rounded-full shrink-0"
                      sizes="44px"
                    />
                    <div className="min-w-0">
                      <p className="font-display font-bold text-sm truncate">{quote.name}</p>
                      <p className="u-label truncate">{quote.role}</p>
                    </div>
                  </div>
                )}
              </div>
            </Rise>

            <Rise delay={0.1}>
              <span className="u-label">05 — Athari · Impact</span>
              <blockquote className="mt-6">
                <p className="font-display text-2xl md:text-4xl font-bold leading-[1.15] tracking-tight">
                  “{quote?.quote}”
                </p>
              </blockquote>
              <div className="grid grid-cols-3 gap-6 mt-10">
                {(content.impact.stats ?? []).slice(0, 3).map((s) => (
                  <div key={s.label}>
                    <StatFigure
                      value={s.value}
                      suffix={s.suffix}
                      className="font-display text-3xl md:text-4xl font-extrabold"
                    />
                    <div className="u-label mt-1.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </Rise>
          </div>
        </div>
      </section>

      {/* Closing — the biggest type on the page. */}
      <section id="start" className="relative overflow-hidden pt-24 md:pt-36 pb-24 md:pb-32">
        <div className="u-wrap text-center">
          <Rise>
            <span className="u-label">06 — Start</span>
          </Rise>
          <Rise delay={0.06}>
            <h2 ref={titleRef} className="u-mega u-settle mt-6">
              Tu<span className="u-outline">tengeneze</span>.
            </h2>
          </Rise>
          <Rise delay={0.12}>
            <p className="u-lead mx-auto mt-7 max-w-[46ch]">
              One conversation. Zero pressure. A written plan and an honest
              price within days — in Kiswahili or English.
            </p>
          </Rise>
          <Rise delay={0.18}>
            <div className="flex flex-wrap justify-center gap-3 mt-9">
              {/* JEWEL #2 of 8 — final CTA. */}
              <TransitionLink href="/contact" className="u-btn u-btn-primary">
                Start a project <span aria-hidden="true">→</span>
              </TransitionLink>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="u-btn u-btn-ghost"
              >
                WhatsApp us
              </a>
            </div>
          </Rise>
          <Rise delay={0.24}>
            <p className="u-label mt-10">Replies within one working day</p>
          </Rise>
        </div>
      </section>
    </>
  );
}
