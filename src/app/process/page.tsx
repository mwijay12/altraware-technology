"use client";

import { useEffect, useRef } from "react";
import { TransitionLink } from "@/components/Navbar";
import { Reveal, MediaBlock } from "@/components/motion";
import { useContent } from "@/components/providers";
import { TextEffect } from "@/components/ui/text-effect";

/* Process page — animated timeline with scroll-linked progress line */

export default function ProcessPage() {
  const { content } = useContent();
  const wrapRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let killed = false;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (killed) return;
      gsap.registerPlugin(ScrollTrigger);

      const items = document.querySelectorAll(".phase-item");
      items.forEach((it) => {
        ScrollTrigger.create({
          trigger: it,
          start: "top 70%",
          end: "bottom 40%",
          onEnter: () => it.classList.add("active"),
          onLeaveBack: () => it.classList.remove("active"),
        });
      });
      if (wrapRef.current && progressRef.current) {
        ScrollTrigger.create({
          trigger: wrapRef.current,
          start: "top 65%",
          end: "bottom 55%",
          scrub: true,
          onUpdate: (s) => {
            if (progressRef.current) progressRef.current.style.height = s.progress * 100 + "%";
          },
        });
      }
    })();
    return () => {
      killed = true;
    };
  }, []);

  return (
    <div className="pt-[120px]">
      {/* HERO */}
      <section className="relative overflow-hidden grid-bg">
        <div className="absolute -top-32 -right-32 w-[560px] h-[560px] rounded-full bg-viol/10 blur-[120px] pointer-events-none" />
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-16 md:py-24">
          <Reveal>
            <div className="eyebrow text-viol mb-4 flex items-center gap-3">
              <span className="w-10 h-[2px] bg-viol inline-block" /> How we work
            </div>
            <h1 className="display text-5xl md:text-7xl font-medium">
              <span className="block">
                <TextEffect as="span" per="word" preset="fade">
                  No surprises.
                </TextEffect>
              </span>
              <span className="block mt-1">
                <i className="font-light text-deep/40">
                  <TextEffect as="span" per="word" preset="slide" delay={0.2}>
                    Just a clear
                  </TextEffect>
                </i>{" "}
                <i className="text-viol">
                  <TextEffect as="span" per="char" preset="blur" delay={0.35}>
                    path.
                  </TextEffect>
                </i>
              </span>
            </h1>
            <p className="text-deep/60 mt-6 max-w-xl text-[15px] md:text-base leading-relaxed">
              Every project follows five written phases. You approve each step before we bill the next. Scroll to walk
              the path.
            </p>
          </Reveal>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="bg-white py-20 md:py-28 border-y border-line">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <div className="relative pl-2" ref={wrapRef}>
            <div className="phase-line" />
            <div className="phase-progress" ref={progressRef} />
            <div className="space-y-6">
              {content.processPhases.map((ph) => (
                <div key={ph.num} className="phase-item flex gap-5 md:gap-7">
                  <div className="phase-dot">{ph.num}</div>
                  <div className="phase-card flex-1 bg-cream border-2 border-transparent rounded-2xl p-6 transition-all">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-grotesk font-bold text-lg">{ph.title}</span>
                      <span className="text-[10px] font-bold bg-viol/10 text-viol px-2.5 py-1 rounded-full tracking-widest">
                        {ph.weeks}
                      </span>
                    </div>
                    <p className="text-sm text-deep/60 mt-2">{ph.body}</p>
                    <div className="flex gap-2 mt-3 text-[11px] font-mono text-deep/50">
                      {ph.deliverables.map((d) => (
                        <span key={d} className="bg-white border border-deep/10 px-2.5 py-1 rounded-lg">{d}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MEDIA — how we work, in motion */}
      <section className="bg-cream py-14 border-t border-line">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8">
          <Reveal className="mb-6">
            <div className="eyebrow text-viol flex items-center gap-3">
              <span className="w-10 h-[2px] bg-viol inline-block" /> Delivery, seen live — replace these in admin
            </div>
          </Reveal>
          <MediaBlock items={content.services[2].media ?? []} />
        </div>
      </section>

      {/* WRITTEN AGREEMENTS PANEL */}
      <section className="bg-deep text-white relative overflow-hidden">
        <div className="noise-blue absolute inset-0" />
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-20 md:py-28 relative">
          <div className="grid md:grid-cols-3 gap-4">            {[
              { icon: "fa-file-signature", t: "Written agreements", d: "Scope, price and timeline in writing — in Kiswahili or English — before any work starts." },
              { icon: "fa-hand-holding-dollar", t: "Phase-based billing", d: "You approve each phase before the next is billed. No surprise invoices, ever." },
              { icon: "fa-shield-halved", t: "Your data is yours", d: "Full handover of code, credentials and exports at launch. No lock-in." },
            ].map((x, i) => (
              <Reveal key={x.t} delay={i * 0.08}>
                <div className="glass rounded-3xl p-7 h-full">
                  <div className="w-14 h-14 rounded-2xl bg-viol text-white flex items-center justify-center text-2xl">
                    <i className={`fa-solid ${x.icon}`} />
                  </div>
                  <div className="font-grotesk font-bold text-lg mt-5">{x.t}</div>
                  <p className="text-sm text-white/60 mt-2 leading-relaxed">{x.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream py-20 md:py-28">
        <div className="max-w-[900px] mx-auto px-5 text-center">
          <Reveal>
            <h2 className="display text-4xl md:text-6xl font-medium">
              Ready to walk the <i className="text-viol">path</i> with us?
            </h2>
            <p className="text-deep/60 mt-4 max-w-md mx-auto">
              Phase one costs you a conversation. Everything after that is written down.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="mt-8">
            <TransitionLink href="/contact" className="btn-magnetic inline-flex items-center gap-2 bg-deep text-white px-8 py-4 rounded-full font-bold text-sm">
              Begin phase 01 — Discovery <i className="fa-solid fa-arrow-right text-xs" />
            </TransitionLink>
          </Reveal>
        </div>
      </section>
    </div>
  );
}