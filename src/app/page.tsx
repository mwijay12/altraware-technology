"use client";

import { useEffect, useState } from "react";
import { TransitionLink } from "@/components/Navbar";
import { Reveal, TiltCard, Counter, ImgReveal, Marquee, MediaBlock } from "@/components/motion";
import { useContent, useNotify } from "@/components/providers";
import { TextEffect } from "@/components/ui/text-effect";
import { ScrollVelocity } from "@/components/ui/scroll-velocity";
import LivePreviewFrame from "@/components/ui/LivePreviewFrame";
import { Typewriter } from "@/components/ui/typewriter-text";
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll";
import { formatPriceTag, type Project } from "@/lib/content";
import ProjectModal from "@/components/ui/ProjectModal";

/* ============================================================
   HOME — the full reference experience, linking to dedicated pages
   ============================================================ */

export default function Home() {
  const { content } = useContent();
  const { notify } = useNotify();
  const [heroReady, setHeroReady] = useState(false);
  const [modalProject, setModalProject] = useState<Project | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setHeroReady(true), 300);
    const welcome = window.setTimeout(() => notify("Karibu Altraware ✓ — explore what we build"), 5000);
    return () => {
      clearTimeout(t);
      clearTimeout(welcome);
    };
  }, [notify]);

  return (
    <>
      {/* ============ HERO ============ */}
      <section id="hero" className="relative min-h-screen pt-[120px] pb-14 overflow-hidden grid-bg flex flex-col justify-center">
        {/* Mobile Rich Hero Background Layer — image sits beneath text with high-contrast scrim */}
        <div
          className="lg:hidden absolute inset-0 bg-cover bg-center pointer-events-none transition-all duration-700"
          style={{ backgroundImage: `url(${content.hero.image})` }}
        />
        {/* Mobile readability scrim: soft gradient preserving light theme text clarity */}
        <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-[#faf8f5]/90 via-[#faf8f5]/85 to-[#faf8f5] pointer-events-none backdrop-blur-[2px]" />

        {/* Desktop ambient subtle background */}
        <div
          className="hidden lg:block absolute inset-0 bg-cover bg-center pointer-events-none opacity-[0.035] transition-all duration-700"
          style={{ backgroundImage: `url(${content.hero.image})` }}
        />
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-b from-[#faf8f5]/80 via-transparent to-[#faf8f5] pointer-events-none" />

        <div className="absolute top-0 right-0 w-[55%] h-full bg-gradient-to-l from-viol/[0.06] to-transparent pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-[560px] h-[560px] rounded-full bg-viol/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -left-40 w-[420px] h-[420px] rounded-full bg-deep/10 blur-[120px] pointer-events-none" />

        <div className="max-w-[1320px] mx-auto px-5 md:px-8 grid lg:grid-cols-[1.15fr_.85fr] gap-10 md:gap-12 items-center relative">
          <div>
            <div
              className={`hero-el transition-all duration-700 inline-flex items-center gap-3 bg-white/90 backdrop-blur-md border border-deep/10 rounded-full pl-2 pr-4 py-1.5 shadow-sm mb-7 ${
                heroReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <span className="flex items-center gap-1.5 bg-deep text-white text-[10px] font-grotesk font-bold px-2.5 py-1 rounded-full tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" /> DSM · LIVE
              </span>
              <span className="text-[12px] font-medium text-deep/70">
                <Typewriter
                  text={[
                    "Tanzanian software studio",
                    "Websites starting from TSh 350,000",
                    "Web & mobile apps from TSh 800,000",
                    "Business systems from TSh 1,200,000",
                    "M-Pesa native & offline-first systems",
                  ]}
                  speed={70}
                  deleteSpeed={35}
                  delay={2400}
                  loop={true}
                  cursor="|"
                  className="font-semibold text-deep"
                />
              </span>
            </div>

            <div className={`hero-el eyebrow text-viol mb-4 flex items-center gap-3 transition-all duration-700 delay-100 ${heroReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <span className="w-10 h-[2px] bg-viol inline-block" />
              <span>{content.hero.eyebrow || "Rooted in Tanzania · Global Craft"}</span>
            </div>

            <h1 className={`hero-el display text-4xl sm:text-6xl md:text-6xl lg:text-[4.2rem] xl:text-[4.8rem] font-medium leading-[1.08] tracking-tight transition-all duration-700 delay-150 ${heroReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <span className="block whitespace-nowrap">
                Rooted at{" "}
                <span className="text-viol font-normal inline-block">
                  home.
                </span>
              </span>
              <span className="block mt-1 whitespace-nowrap">
                Built for the{" "}
                <span className="inline-block bg-gradient-to-r from-deep via-viol to-violL bg-clip-text text-transparent font-semibold">
                  world.
                </span>
              </span>
            </h1>

            <div className={`mt-6 max-w-xl transition-all duration-700 delay-200 ${heroReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <p className="text-deep/75 text-base md:text-lg leading-relaxed font-normal">
                {content.hero.subtitle}
              </p>
            </div>

            <div className={`hero-el flex flex-wrap gap-3 mt-8 transition-all duration-700 delay-300 ${heroReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <TransitionLink
                href="/contact"
                className="btn-magnetic bg-deep text-white px-7 py-4 rounded-full font-semibold text-sm flex items-center gap-3 shadow-xl shadow-deep/20"
              >
                {content.hero.primaryCta}
                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                  <i className="fa-solid fa-arrow-right text-xs" />
                </span>
              </TransitionLink>
              <TransitionLink
                href="/platforms"
                className="group bg-white/90 backdrop-blur border border-deep/15 px-7 py-4 rounded-full font-semibold text-sm flex items-center gap-3 hover:border-viol transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-viol/10 text-viol flex items-center justify-center group-hover:bg-viol group-hover:text-white transition-all">
                  <i className="fa-solid fa-play text-[10px] ml-0.5" />
                </span>
                {content.hero.secondaryCta}
              </TransitionLink>
            </div>

            <div className={`hero-el flex flex-wrap items-center gap-x-6 gap-y-3 mt-9 text-[12px] font-grotesk font-medium text-deep/60 transition-all duration-700 delay-500 ${heroReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <span className="flex items-center gap-2"><i className="fa-brands fa-react text-viol" /> Next.js 16</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#3178C6]" /> TypeScript</span>
              <span className="flex items-center gap-2"><i className="fa-solid fa-wind text-sky-500" /> Tailwind CSS</span>
              <span className="flex items-center gap-2"><i className="fa-solid fa-bolt text-amber-500" /> GSAP Motion</span>
              <span className="flex items-center gap-2"><i className="fa-solid fa-mobile-screen text-green-600" /> M-Pesa Ready</span>
            </div>

            {/* Mobile Location Badge (replaces the card on small screens) */}
            <div className="lg:hidden mt-6 flex items-center gap-3 text-[11px] font-mono text-deep/60 bg-white/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-deep/10 w-fit">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>{content.hero.imageCaption || "Dar es Salaam, Tanzania"} · Offline-first &amp; 2G ready</span>
            </div>
          </div>

          {/* HERO VISUAL — visible on PC (lg+), hidden on mobile to keep clean background layout */}
          <div className={`hero-el relative hidden lg:block transition-all duration-700 delay-200 ${heroReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <TiltCard intensity={10} className="relative rounded-[28px] overflow-hidden shadow-2xl shadow-deep/20 border-8 border-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={content.hero.image} alt={content.hero.imageCaption || "Dar es Salaam"} className="w-full h-[520px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/85 via-deep/15 to-transparent z-[3]" />
              <div className="absolute bottom-5 left-5 right-5 z-[4] flex items-end justify-between">
                <div className="text-white">
                  <div className="text-[10px] tracking-[0.3em] font-grotesk font-bold text-white/70">6.7924° S, 39.2083° E</div>
                  <div className="font-serif italic text-2xl">{content.hero.imageCaption}</div>
                </div>
                <div className="glass rounded-xl px-3 py-2 text-white text-xs font-grotesk flex items-center gap-2">
                  <i className="fa-solid fa-signal text-green-400" /> Offline-first · 2G ready
                </div>
              </div>
            </TiltCard>

            {/* floating Altraware Core branded card */}
            <div className="float-anim hidden sm:block absolute -left-6 md:-left-12 top-6 md:top-8 glass-white rounded-2xl p-3 sm:p-4 shadow-xl w-[210px] sm:w-[235px] z-10 border border-deep/10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#0a1735] p-2 flex items-center justify-center shadow-md shadow-viol/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo.png" alt="Altraware" className="w-full h-full object-contain brightness-125" />
                </div>
                <div>
                  <div className="text-[13px] font-extrabold text-deep font-grotesk">Altraware Core</div>
                  <div className="text-[10px] text-deep/55 font-mono">Production Node · DSM</div>
                </div>
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <div className="font-grotesk font-extrabold text-lg text-deep">
                  99.98% <span className="text-[11px] font-medium text-deep/55">uptime</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                </span>
              </div>
              <div className="mt-2 h-1.5 bg-deep/10 rounded-full overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-viol to-emerald-400 rounded-full" />
              </div>
              <div className="mt-2 flex items-center justify-between text-[9.5px] font-mono text-deep/50">
                <span>M-Pesa · Offline · Sync</span>
                <span className="text-viol font-semibold">24ms</span>
              </div>
            </div>

            {/* floating code card */}
            <div className="float-anim2 hidden sm:block absolute -right-3 md:-right-6 bottom-10 md:bottom-16 bg-deep text-white rounded-2xl p-3 sm:p-4 shadow-2xl w-[210px] sm:w-[240px] z-10 border border-white/10">
              <div className="flex gap-1.5 mb-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="ml-auto text-[9px] font-mono text-white/40">faida-pos.tsx</span>
              </div>
              <pre className="font-mono text-[10.5px] leading-relaxed text-white/80">
                <code>
                  <span className="text-violL">const</span> sale = <span className="text-violL">await</span> faida.checkout(&#123;
                  {"\n"}  items, <span className="text-green-400">pay:</span> <span className="text-amber-300">&quot;M-PESA&quot;</span>,
                  {"\n"}  lang: <span className="text-amber-300">&quot;sw&quot;</span> <span className="caret" />
                  {"\n"}&#125;)
                </code>
              </pre>
            </div>

            {/* rotating badge */}
            <div className="absolute -top-8 -right-4 w-28 h-28 z-10">
              <div className="spin-slow absolute inset-0">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <path id="circ" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                  </defs>
                  <text className="fill-deep" style={{ fontSize: "10.5px", letterSpacing: "2.5px", fontFamily: "var(--font-space-grotesk)", fontWeight: 700 }}>
                    <textPath href="#circ">KISWAHILI FIRST • GLOBAL CRAFT • </textPath>
                  </text>
                </svg>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-11 h-11 rounded-full bg-viol text-white flex items-center justify-center shadow-lg shadow-viol/40">
                  <i className="fa-solid fa-arrow-down" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1320px] mx-auto px-5 md:px-8 mt-12 flex items-center gap-4">
          <div className="flex items-center gap-3 text-[11px] font-grotesk tracking-[0.25em] text-deep/40 font-bold">
            <span className="w-12 h-[1px] bg-deep/20" /> SCROLL TO BEGIN THE STORY
            <i className="fa-solid fa-chevron-down animate-bounce text-viol" />
          </div>
          <div className="hidden md:flex ml-auto items-center gap-2 text-[12px] text-deep/50">
            <i className="fa-solid fa-quote-left text-viol/40" />
            <span className="italic font-serif">“Technology that speaks our language.”</span>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-deep text-white py-5 marquee border-y border-white/10 relative z-10 -rotate-[0.6deg] scale-[1.01]">
        <Marquee>
          <span className="text-base md:text-xl font-grotesk font-bold tracking-wider inline-flex items-center">
            TOVUTI ZA BIASHARA <span className="text-violL px-6">✦</span> FAIDA POS OFFLINE <span className="text-violL px-6">✦</span> CARETRACK CLINIC{" "}
            <span className="text-violL px-6">✦</span> M-PESA · TIGO PESA · AIRTEL MONEY <span className="text-violL px-6">✦</span> KISWAHILI-FIRST ARCHITECTURE <span className="text-violL px-6">✦</span> TSH 350K / 550K / 750K <span className="text-violL px-6">✦</span> DAR ES SALAAM <span className="text-violL px-6">✦</span>
          </span>
        </Marquee>
      </div>

      {/* ============ ACT I : ROOTS (DEEP BLUE) ============ */}
      <section id="roots" className="relative bg-deep text-white overflow-hidden">
        <div className="noise-blue absolute inset-0" />
        <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-viol/25 blur-[140px] rounded-full" />
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-12 md:py-28 relative">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <Reveal>
              <div className="eyebrow text-violL flex items-center gap-3 mb-5">
                <span className="w-10 h-[2px] bg-violL inline-block" />
                <span>Act I — Local Roots</span>
              </div>
              <h2 className="display text-4xl md:text-6xl font-medium leading-[1.02]">
                <TextEffect as="span" per="word" preset="slide" viewport={{ once: true }}>
                  Built in Tanzania, for how Tanzania really works.
                </TextEffect>
              </h2>
              <div className="mt-6 text-white/80 leading-relaxed text-[15px] md:text-lg font-medium">
                <TextGradientScroll text={content.about.shortDescription} type="word" textOpacity="soft" />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-10">
                <div className="border-l-2 border-viol pl-4">
                  <div className="font-grotesk font-bold text-3xl md:text-4xl"><Counter target={98} />%</div>
                  <div className="text-[11px] tracking-widest text-white/50 font-grotesk mt-1">MOBILE-FIRST<br />TRAFFIC</div>
                </div>
                <div className="border-l-2 border-viol pl-4">
                  <div className="font-grotesk font-bold text-3xl md:text-4xl"><Counter target={2} /></div>
                  <div className="text-[11px] tracking-widest text-white/50 font-grotesk mt-1">LANGUAGES<br />SW · EN</div>
                </div>
                <div className="border-l-2 border-viol pl-4">
                  <div className="font-grotesk font-bold text-3xl md:text-4xl"><Counter target={24} />/7</div>
                  <div className="text-[11px] tracking-widest text-white/50 font-grotesk mt-1">SUPPORT<br />WHATSAPP</div>
                </div>
              </div>
              <div className="mt-10 flex flex-wrap gap-3">
                <div className="glass rounded-full px-4 py-2 text-xs flex items-center gap-2"><i className="fa-solid fa-mobile-screen-button text-green-400" /> M-Pesa · Tigo Pesa · HaloPesa</div>
                <div className="glass rounded-full px-4 py-2 text-xs flex items-center gap-2"><i className="fa-solid fa-wifi text-violL" /> Works on 2G / offline</div>
                <div className="glass rounded-full px-4 py-2 text-xs flex items-center gap-2"><i className="fa-solid fa-language text-amber-300" /> Kiswahili kwanza</div>
              </div>
              <div className="mt-10">
                <TransitionLink href="/about" className="inline-flex items-center gap-2 text-sm font-bold text-violL hover:text-white transition-colors">
                  Read our full story <i className="fa-solid fa-arrow-right" />
                </TransitionLink>
              </div>
            </Reveal>
            <div className="space-y-5">
              <Reveal className="grid grid-cols-2 gap-5">
                <ImgReveal src={content.images.streetTz} alt="Tanzania street" className="rounded-2xl h-64" imgClassName="w-full h-full object-cover" />
                <ImgReveal src={content.images.community} alt="Community" className="rounded-2xl h-64 mt-10" imgClassName="w-full h-full object-cover" />
              </Reveal>
              <Reveal delay={0.1}>
                <TiltCard className="glass rounded-2xl p-6 relative overflow-hidden" intensity={6}>
                  <i className="fa-solid fa-quote-left text-3xl text-violL/40 absolute top-4 right-5" />
                  <p className="font-serif italic text-lg leading-relaxed">
                    “Our duka used to close the books at midnight. Now Faida does it before we lock the door — and sends the report to my phone.”
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={content.images.clientAvatar} className="w-10 h-10 rounded-full object-cover border-2 border-violL" alt="client" />
                    <div>
                      <div className="text-sm font-bold">Neema Mwakalinga</div>
                      <div className="text-xs text-white/50">Duka Owner · Kariakoo, Dar es Salaam</div>
                    </div>
                    <div className="ml-auto flex gap-1 text-amber-400 text-xs">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <i key={i} className="fa-solid fa-star" />
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
              <Reveal delay={0.15} className="grid grid-cols-2 gap-5">
                <TiltCard className="bg-white text-deep rounded-2xl p-5" intensity={10}>
                  <div className="text-2xl mb-2">🏪</div>
                  <div className="font-bold text-sm">Small businesses</div>
                  <div className="text-xs text-deep/60 mt-1">Shops, salons, restaurants & services</div>
                </TiltCard>
                <TiltCard className="bg-viol text-white rounded-2xl p-5" intensity={10}>
                  <div className="text-2xl mb-2">🏫</div>
                  <div className="font-bold text-sm">Schools & NGOs</div>
                  <div className="text-xs text-white/70 mt-1">Fees, records & donor reports</div>
                </TiltCard>
              </Reveal>
            </div>
          </div>
        </div>
        <div className="h-20 bg-cream rounded-t-[36px] relative z-10" />
      </section>

      {/* ============ SERVICES MEDIA STRIP & MARQUEE VELOCITY ============ */}
      <section className="bg-cream pt-2 pb-10 md:pb-20 overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 mb-6 md:mb-8">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-4 mb-6 md:mb-8">
            <div>
              <div className="eyebrow text-viol flex items-center gap-3">
                <span className="w-10 h-[2px] bg-viol inline-block" /> See it moving — video & pics
              </div>
              <h2 className="display text-2xl sm:text-3xl md:text-5xl font-medium mt-2">
                <TextEffect as="span" per="word" preset="fade" viewport={{ once: true }}>
                  Uzoefu wa Moja kwa Moja · Interactive Live Preview
                </TextEffect>
              </h2>
            </div>
            <p className="text-deep/60 text-xs md:text-sm max-w-md">
              Kila mfumo na tovuti yetu inajaribiwa na kutumika hewani. Unaweza kuijaribu moja kwa moja hapa chini bila kuondoka kwenye tovuti!
            </p>
          </Reveal>

          {/* Interactive Live Preview Frame (Faida POS web demo) */}
          <div className="mb-6 md:mb-12">
            <LivePreviewFrame
              title="Faida POS (FaidaHQ) Web Demo"
              liveUrl="https://faida-hq.vercel.app/"
              posterImage="https://images.unsplash.com/photo-1556742049-0a67e557224f?q=80&w=1200&auto=format&fit=crop"
              status="Live"
            />
          </div>
        </div>

        {/* Continuous Dynamic Marquee / ScrollVelocity Effect */}
        <div className="space-y-3 md:space-y-6 pt-1 md:pt-2">
          {/* Track 1: Media Showcase Cards */}
          <ScrollVelocity velocity={0.9} repeat={4}>
            {content.services
              .flatMap((s) => s.media ?? [])
              .map((m, idx) => (
                <div
                  key={idx}
                  className="relative h-40 w-64 md:h-56 md:w-96 rounded-xl md:rounded-2xl overflow-hidden border-2 border-deep/10 shadow-md shrink-0 bg-deep/5 group mr-4 md:mr-6"
                >
                  {m.type === "video" ? (
                    <video
                      src={m.url}
                      muted
                      loop
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.url}
                      alt={m.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.parentElement?.classList.add("bg-gradient-to-br", "from-slate-900", "to-indigo-950");
                      }}
                    />
                  )}
                  <span className="absolute bottom-2 left-2 right-2 md:bottom-3 md:left-3 md:right-3 bg-deep/90 backdrop-blur-md text-white text-[11px] md:text-sm font-semibold px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl truncate border border-white/10 shadow-sm">
                    {m.caption}
                  </span>
                </div>
              ))}
          </ScrollVelocity>

          {/* Track 2: High Legibility Product & Pricing Pills */}
          <ScrollVelocity velocity={-0.75} repeat={4}>
            {[
              { tag: "RETAIL POS", title: "FAIDA POS", highlight: "From TSh 1.2M · 100% Offline & Receipts", dot: "bg-viol" },
              { tag: "WEB STARTER", title: "WEB STARTER", highlight: "TSh 350,000 · 1–2 Weeks Turnaround", dot: "bg-emerald-500" },
              { tag: "CUSTOM APPS", title: "CUSTOM APP", highlight: "From TSh 800,000 · Web & Mobile", dot: "bg-amber-500" },
              { tag: "CLINIC & CARE", title: "CARETRACK", highlight: "Institutional EHR & Attendance", dot: "bg-sky-500" },
              { tag: "GROWTH", title: "BUSINESS SITE", highlight: "TSh 550,000 · Catalog & WhatsApp", dot: "bg-viol" },
              { tag: "PORTAL & CMS", title: "PRO PORTAL", highlight: "TSh 750,000 · Dashboards & DB", dot: "bg-purple-500" },
              { tag: "DAR ES SALAAM", title: "ALTRAWARE", highlight: "Rooted at Home. Global Standard.", dot: "bg-viol" },
            ].map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-2 md:gap-3.5 px-3.5 py-2 md:px-6 md:py-3.5 rounded-full border-2 border-deep/15 bg-white text-deep font-grotesk shadow-md mr-3 md:mr-6 hover:border-viol transition-colors"
              >
                <span className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${item.dot} animate-pulse`} />
                <span className="text-[10px] md:text-[11px] font-bold tracking-widest uppercase bg-deep/8 px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-deep/75">
                  {item.tag}
                </span>
                <span className="text-xs sm:text-sm md:text-lg font-extrabold text-deep tracking-tight">
                  {item.title}
                </span>
                <span className="text-[11px] sm:text-xs md:text-base font-bold text-viol">
                  · {item.highlight}
                </span>
              </span>
            ))}
          </ScrollVelocity>
        </div>
      </section>

      {/* ============ SERVICES (accordion, links to /services) ============ */}
      <ServicesAccordion preview />

      {/* ============ PROJECTS SHOWCASE ============ */}
      <section className="bg-white py-10 md:py-24 border-y border-line">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <Reveal>
              <div className="eyebrow text-viol mb-4 flex items-center gap-3">
                <span className="w-10 h-[2px] bg-viol inline-block" /> Our work — Kazi Zetu
              </div>
              <h2 className="display text-4xl md:text-6xl font-medium">
                10+ platforms.<br /><i className="font-light text-deep/50">All live.</i> <i className="text-viol">All ours.</i>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-deep/60 max-w-sm text-[15px]">
                From retail OS with a Flutter app to car-rental registries and Pan-African youth hubs — every link
                below is in production.
              </p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {["faida-hq", "uaut-connect", "niketz", "mwijay-portfolio", "aymi-africa", "volta-rentals"]
              .map((id) => content.projects.find((p) => p.id === id)!)
              .filter(Boolean)
              .map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <div
                  onClick={() => setModalProject(p)}
                  className="block h-full group cursor-pointer text-left"
                >
                  <TiltCard intensity={7} className="bg-cream border border-deep/10 rounded-3xl overflow-hidden h-full hover:border-viol transition-all hover:shadow-xl hover:shadow-viol/10 flex flex-col justify-between">
                    <div>
                      {p.media[0] && (
                        <div className="relative h-48 overflow-hidden bg-deep/10">
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

                          {/* Quick Live Link Button (Open direct site) */}
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="absolute top-3 right-3 bg-deep/85 hover:bg-viol text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md transition-colors z-10"
                            title="Open direct live website"
                          >
                            <i className="fa-solid fa-arrow-up-right-from-square text-[8px]" /> LIVE
                          </a>

                          {p.featured && (
                            <span className="absolute top-3 left-3 bg-viol text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-full z-10">
                              ★ FEATURED
                            </span>
                          )}
                        </div>
                      )}

                      <div className="p-5">
                        <div className="flex items-center gap-2 text-[10px] font-grotesk font-bold tracking-widest text-deep/40">
                          {p.category.toUpperCase()} · {p.year}
                        </div>
                        <div className="font-grotesk font-bold text-lg mt-1 group-hover:text-viol transition-colors">{p.title}</div>
                        <div className="text-[11px] text-deep/45 mt-0.5">{p.client}</div>
                        <p className="text-sm text-deep/65 mt-2.5 line-clamp-2 leading-relaxed">{p.description}</p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-1 border-t border-deep/5 flex items-center justify-between gap-2 mt-auto">
                      <div className="flex flex-wrap gap-1">
                        {p.tags.slice(0, 2).map((t) => (
                          <span key={t} className="bg-deep/5 border border-deep/10 text-deep/55 text-[10px] font-bold px-2 py-0.5 rounded-full">{t}</span>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-viol group-hover:translate-x-0.5 transition-transform flex items-center gap-1 shrink-0">
                        <span>View details</span>
                        <i className="fa-solid fa-arrow-right text-[10px]" />
                      </span>
                    </div>
                  </TiltCard>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="text-center mt-10">
            <TransitionLink href="/impact" className="inline-flex items-center gap-2 text-sm font-bold text-viol hover:text-deep transition-colors">
              Explore all live deployments (Full Portfolio) <i className="fa-solid fa-arrow-right" />
            </TransitionLink>
          </Reveal>
        </div>
      </section>

      {/* ============ PLATFORMS TEASER ============ */}
      <section className="bg-deep text-white relative overflow-hidden">
        <div className="noise-blue absolute inset-0" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-viol/20 blur-[140px] rounded-full" />
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-12 md:py-28 relative">
          <Reveal className="text-center max-w-2xl mx-auto">
            <div className="eyebrow text-violL mb-4">Interactive Platforms</div>
            <h2 className="display text-4xl md:text-6xl font-medium">
              <span className="block">
                <TextEffect as="span" per="word" preset="fade" viewport={{ once: true }}>
                  Don&apos;t take our word.
                </TextEffect>
              </span>
              <i className="text-violL block mt-1">
                <TextEffect as="span" per="word" preset="blur" delay={0.25} viewport={{ once: true }}>
                  Touch the software.
                </TextEffect>
              </i>
            </h2>
            <p className="text-white/60 mt-4 text-[15px]">
              Two live, clickable platforms — a retail checkout and a care-centre dashboard. Built the Altraware way:
              Kiswahili-first, offline-ready, M-Pesa native.
            </p>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-4 mt-12">
            {content.platforms.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.1}>
                <TransitionLink
                  href={`/platforms#${p.id}`}
                  className={`group relative block rounded-3xl p-8 overflow-hidden ${
                    p.color === "deep" ? "bg-deep2 border border-white/10" : "bg-white text-deep"
                  }`}
                >
                  <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-viol/30 blur-2xl rounded-full group-hover:scale-150 transition-transform duration-700" />
                  <div className={`text-[11px] tracking-widest font-grotesk ${p.color === "deep" ? "text-violL" : "text-viol"}`}>
                    {p.audience}
                  </div>
                  <div className="display text-3xl mt-2">{p.name}</div>
                  <p className={`text-sm mt-2 ${p.color === "deep" ? "text-white/60" : "text-deep/60"}`}>{p.tagline}</p>
                  <div className="mt-4 text-sm font-bold flex items-center gap-2">
                    Try the live demo <i className="fa-solid fa-arrow-right group-hover:translate-x-2 transition-transform" />
                  </div>
                </TransitionLink>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROCESS TEASER ============ */}
      <section className="bg-white py-10 md:py-24 border-y border-line">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <Reveal className="text-center mb-14">
            <div className="eyebrow text-viol mb-4">Clear Phases — Written Agreements</div>
            <h2 className="display text-4xl md:text-6xl font-medium">
              <span className="block">
                <TextEffect as="span" per="word" preset="fade" viewport={{ once: true }}>
                  No surprises.
                </TextEffect>
              </span>
              <span className="block mt-1">
                <i className="font-light text-deep/40">
                  <TextEffect as="span" per="word" preset="slide" delay={0.2} viewport={{ once: true }}>
                    Just a clear
                  </TextEffect>
                </i>{" "}
                <i className="text-viol">
                  <TextEffect as="span" per="char" preset="blur" delay={0.35} viewport={{ once: true }}>
                    njia.
                  </TextEffect>
                </i>
              </span>
            </h2>
            <p className="text-deep/60 mt-4 max-w-xl mx-auto text-[15px]">
              Every project follows five written phases. You approve each step before we bill the next.
            </p>
          </Reveal>
          <div className="grid md:grid-cols-5 gap-3">
            {content.processPhases.map((ph, i) => (
              <Reveal key={ph.num} delay={i * 0.08}>
                <div className="bg-cream border-2 border-transparent rounded-2xl p-5 h-full hover:border-viol transition-colors">
                  <div className="w-11 h-11 rounded-full bg-deep text-white flex items-center justify-center font-grotesk font-bold text-sm">
                    {ph.num}
                  </div>
                  <div className="font-grotesk font-bold text-sm mt-4">{ph.title}</div>
                  <div className="text-[10px] font-bold bg-viol/10 text-viol px-2 py-0.5 rounded-full tracking-widest inline-block mt-2">
                    {ph.weeks}
                  </div>
                  <p className="text-xs text-deep/55 mt-2 leading-relaxed">{ph.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="text-center mt-10">
            <TransitionLink href="/process" className="inline-flex items-center gap-2 text-sm font-bold text-viol hover:text-deep transition-colors">
              Walk the full path <i className="fa-solid fa-arrow-right" />
            </TransitionLink>
          </Reveal>
        </div>
      </section>

      {/* ============ IMPACT TEASER ============ */}
      <section className="bg-deep text-white relative overflow-hidden">
        <div className="noise-blue absolute inset-0" />
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-12 md:py-28 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <Reveal>
              <div className="eyebrow text-violL flex items-center gap-3 mb-4">
                <span className="w-10 h-[2px] bg-violL inline-block" /> Act III — Lasting Impact · Athari
              </div>
              <h2 className="display text-4xl md:text-6xl font-medium">
                <span className="block">
                  <TextEffect as="span" per="word" preset="fade" viewport={{ once: true }}>
                    Software that stays,
                  </TextEffect>
                </span>
                <span className="block mt-1">
                  <i className="text-violL">
                    <TextEffect as="span" per="word" preset="slide" delay={0.2} viewport={{ once: true }}>
                      like a good
                    </TextEffect>
                  </i>{" "}
                  <i>
                    <TextEffect as="span" per="char" preset="blur" delay={0.35} viewport={{ once: true }}>
                      jirani.
                    </TextEffect>
                  </i>
                </span>
              </h2>
              <p className="text-white/60 mt-5 text-[15px]">
                Launch day is the middle of the story, not the end. We measure ourselves by systems still running
                years later — and clients who call us family.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                {content.impact.stats.map((s) => (
                  <div key={s.label} className="glass rounded-2xl p-5">
                    <div className="font-grotesk font-bold text-4xl">
                      <Counter target={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-xs text-white/55 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal>
              <TestimonialCarousel />
              <div className="grid grid-cols-3 gap-3 mt-4">
                {content.impact.sectors.map((s) => (
                  <div key={s.label} className="rounded-2xl overflow-hidden h-28 relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={s.label} loading="lazy" />
                    <div className="absolute inset-0 bg-deep/50 flex items-end p-3 text-white text-[11px] font-bold">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ PRICING TEASER ============ */}
      <section className="bg-cream py-10 md:py-24">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-12">
            <div className="eyebrow text-viol mb-4">Honest Pricing — Bei Sahihi</div>
            <h2 className="display text-4xl md:text-6xl font-medium">
              <span className="block">
                <TextEffect as="span" per="word" preset="fade" viewport={{ once: true }}>
                  Fixed packages.
                </TextEffect>
              </span>
              <i className="text-viol block mt-1">
                <TextEffect as="span" per="word" preset="slide" delay={0.2} viewport={{ once: true }}>
                  Written quotes.
                </TextEffect>
              </i>
            </h2>
            <p className="text-deep/60 mt-4 text-[15px]">{content.pricing.intro}</p>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {content.pricing.packages
              .filter((p) => p.id !== "faida-pos" && p.id !== "care-track")
              .slice(0, 4)
              .map((p, i) => (
              <Reveal key={p.id} delay={i * 0.07}>
                <TiltCard
                  intensity={7}
                  className={`h-full rounded-3xl p-5 flex flex-col justify-between ${
                    p.featured ? "bg-viol text-white shadow-2xl shadow-viol/30" : "bg-white border border-deep/10"
                  }`}
                >
                  <div>
                    {p.featured && (
                      <div className="text-[10px] font-bold bg-white text-viol px-2.5 py-0.5 rounded-full tracking-widest inline-block mb-2">
                        POPULAR
                      </div>
                    )}
                    <div className={`text-xs font-grotesk font-bold tracking-widest ${p.featured ? "text-white/70" : "text-deep/45"}`}>
                      {p.name}
                    </div>
                    <div className="font-grotesk font-bold text-2xl mt-1.5">
                      {formatPriceTag(p.price)}
                    </div>
                    <div className={`text-[11px] mt-1 line-clamp-1 ${p.featured ? "text-white/70" : "text-deep/55"}`}>{p.tagline}</div>
                    <ul className={`text-[12px] mt-3 space-y-1.5 ${p.featured ? "text-white/85" : "text-deep/65"}`}>
                      {p.features.slice(0, 2).map((f) => (
                        <li key={f} className="flex gap-2 items-start">
                          <i className={`fa-solid fa-check text-[10px] mt-1 shrink-0 ${p.featured ? "text-white" : "text-viol"}`} />
                          <span className="line-clamp-1 text-[11.5px]">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-3 mt-3 border-t border-current/10">
                    <TransitionLink
                      href={`/contact?estimate=Package:%20${encodeURIComponent(p.name)}`}
                      className={`text-xs font-bold block text-center py-2 rounded-xl transition-all ${
                        p.featured ? "bg-white text-viol hover:bg-white/90" : "bg-deep/5 text-deep hover:bg-viol hover:text-white"
                      }`}
                    >
                      Choose package →
                    </TransitionLink>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
          <Reveal className="text-center mt-10">
            <TransitionLink href="/pricing" className="btn-magnetic inline-flex items-center gap-2 bg-deep text-white px-7 py-3.5 rounded-full font-semibold text-sm">
              Full pricing & instant estimator <i className="fa-solid fa-arrow-right text-xs" />
            </TransitionLink>
          </Reveal>
        </div>
      </section>



      {/* ============ FINAL CTA ============ */}
      <section className="bg-deep text-white relative overflow-hidden">
        <div className="noise-blue absolute inset-0" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-viol/25 blur-[120px] rounded-full" />
        <div className="max-w-[900px] mx-auto px-5 py-12 md:py-24 text-center relative">
          <Reveal className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-xs font-grotesk tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> NOW BOOKING — Q3 PROJECTS
          </Reveal>
          <Reveal>
            <h2 className="display text-5xl md:text-7xl font-medium leading-[1.02]">
              Welcome <i className="text-violL">home.</i><br />Let&apos;s build.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-white/55 mt-5 max-w-lg mx-auto text-[15px]">
              One conversation. Zero pressure. A written plan and honest price within days.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="flex flex-wrap justify-center gap-3 mt-8">
            <TransitionLink href="/contact" className="bg-white text-deep px-8 py-4 rounded-full font-bold text-sm hover:bg-viol hover:text-white transition-all flex items-center gap-2">
              Start a project <i className="fa-solid fa-arrow-right" />
            </TransitionLink>
            <a
              href={`https://wa.me/255792867427?text=${encodeURIComponent("Hi Altraware, I'd like to learn more about your platforms and services.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full font-bold text-sm border border-white/20 hover:border-green-400 hover:text-green-300 transition-all flex items-center gap-2"
            >
              <i className="fa-brands fa-whatsapp text-lg text-green-400" /> WhatsApp us
            </a>
          </Reveal>
        </div>
      </section>

      <ProjectModal project={modalProject} onClose={() => setModalProject(null)} />
    </>
  );
}

/* ============================================================
   Services accordion (shared between home preview & full page)
   ============================================================ */

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
                  <TextEffect as="span" per="char" preset="blur" delay={0.4} viewport={{ once: true }}>
                    excellent.
                  </TextEffect>
                </i>
              </span>
            </h2>
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
                  <span className="font-serif italic text-viol/60 text-xl hidden sm:block">{s.num}</span>
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
                        <TransitionLink
                          href="/services"
                          className="text-center bg-viol hover:bg-violD transition-colors text-white text-xs font-bold py-2.5 rounded-xl mt-1"
                        >
                          Explore {s.title} details →
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
        <div className="ml-auto text-xs font-grotesk font-bold text-deep/40">
          0{idx + 1} / 0{slides.length}
        </div>
      </div>
    </div>
  );
}