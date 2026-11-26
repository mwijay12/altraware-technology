"use client";

import { TransitionLink } from "@/components/Navbar";
import MediaImage from "@/components/MediaImage";
import {
  MaskLine,
  useParallax,
  useDrift,
  useMagnet,
  useHeroFrame,
  useScrub,
  useFitText,
} from "@/components/usiku";
import type { SiteContent } from "@/lib/content";

/* ============================================================
   HERO — full viewport, oversized Syne display, one violet bloom.

   JEWEL BUDGET: this section spends use #1 (the bloom behind the
   headline). Nothing else in the hero is coloured.
   ============================================================ */

export default function Hero({ content }: { content: SiteContent }) {
  const imgParallax = useParallax<HTMLDivElement>(0.06);
  const bloomParallax = useParallax<HTMLDivElement>(-0.12);
  const frameRef = useHeroFrame<HTMLDivElement>();
  const headlineRef = useScrub<HTMLHeadingElement>();
  const l1Ref = useFitText<HTMLSpanElement>();
  const l2Ref = useFitText<HTMLSpanElement>();
  const bloomDrift = useDrift<HTMLDivElement>(26);
  const ctaMagnet = useMagnet<HTMLAnchorElement>(0.22);

  const line1 = content.hero.titleLine1.map((t) => t.text).join("");
  const line2 = content.hero.titleLine2.map((t) => t.text).join("");

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden pt-28 pb-16"
    >
      {/* JEWEL #1 of 8 — one soft bloom, not five glows. */}
      <div
        ref={bloomParallax}
        className="u-parallax pointer-events-none absolute -top-[18%] left-1/2 -translate-x-1/2 w-[min(1100px,120vw)] h-[620px] rounded-full opacity-[0.22] blur-[120px]"
        style={{ background: "radial-gradient(circle, #8B5CF6 0%, #4C1D95 45%, transparent 72%)" }}
        aria-hidden="true"
      >
        <span ref={bloomDrift} className="u-drift block w-full h-full" />
      </div>

      <div className="u-wrap relative">
        {/* coordinate rail — structure instead of a badge */}
        <div className="flex items-center justify-between gap-6 mb-10 md:mb-14">
          <span className="u-label">Dar es Salaam · 6.7924° S</span>
          <span className="u-label hidden sm:block">Est. 2025 — {content.hero.badge}</span>
        </div>

        <h1 ref={headlineRef} className="u-mega u-scrub">
          <span ref={l1Ref} className="block">
            <MaskLine text={line1} as="span" className="block" />
          </span>
          <span ref={l2Ref} className="block">
            <MaskLine text={line2} as="span" className="block u-outline" delay={0.18} />
          </span>
        </h1>

        <div className="mt-10 md:mt-14 grid lg:grid-cols-[1fr_auto] gap-8 items-end">
          <p className="u-lead max-w-[52ch]">{content.hero.subtitle}</p>

          <div className="flex flex-wrap gap-3">
            <span ref={ctaMagnet} className="u-magnet inline-block">
              <TransitionLink href="/contact" className="u-btn u-btn-primary">
                {content.hero.primaryCta}
                <span aria-hidden="true">→</span>
              </TransitionLink>
            </span>
            <TransitionLink href="/platforms" className="u-btn u-btn-ghost">
              {content.hero.secondaryCta}
            </TransitionLink>
          </div>
        </div>
      </div>

      {/* Full-bleed image moment, revealed with clip-path. */}
      <div ref={imgParallax} className="u-parallax mt-14 md:mt-20">
        <div className="u-wrap">
          <div
            className="u-clip u-frame u-overscan band-hold relative h-[46vh] min-h-[280px] md:h-[54vh] rounded-sm"
            ref={frameRef}
          >
            <MediaImage
              src={content.hero.image}
              alt={`${content.hero.imageCaption || "Dar es Salaam"} — Altraware Technology`}
              label={content.hero.imageCaption || "Dar es Salaam"}
              className="w-full h-full"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-noir via-noir/60 to-transparent" />
            <div className="absolute bottom-4 md:bottom-6 left-5 md:left-8 right-5 flex items-end justify-between gap-4">
              <span className="u-label text-bone/80">{content.hero.imageCaption}</span>
              <span className="u-label text-bone/60 hidden sm:block">Offline-first · 2G ready</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
