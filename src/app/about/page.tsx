"use client";

import { TransitionLink } from "@/components/Navbar";
import { Reveal, TiltCard, ImgReveal, Counter, MediaBlock } from "@/components/motion";
import { useContent } from "@/components/providers";
import { TextEffect } from "@/components/ui/text-effect";
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll";

export default function AboutPage() {
  const { content } = useContent();
  const a = content.about;

  return (
    <div className="pt-[120px]">
      {/* HERO */}
      <section className="relative overflow-hidden grid-bg">
        <div className="absolute -top-32 -right-32 w-[560px] h-[560px] rounded-full bg-viol/10 blur-[120px] pointer-events-none" />
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-16 md:py-24">
          <Reveal>
            <div className="eyebrow text-viol mb-4 flex items-center gap-3">
              <span className="w-10 h-[2px] bg-viol inline-block" /> Our Story
            </div>
            <h1 className="display text-5xl md:text-7xl font-medium leading-[1.05]">
              <span className="block">
                <TextEffect per="word" preset="fade" delay={0.1}>
                  From Dar es Salaam,
                </TextEffect>
              </span>
              <span className="block mt-1">
                <i className="text-viol inline-block">
                  <TextEffect per="word" preset="slide" delay={0.4}>
                    to the world.
                  </TextEffect>
                </i>
              </span>
            </h1>
            <div className="mt-8 max-w-2xl text-deep/80 text-base md:text-xl font-medium leading-relaxed">
              <TextGradientScroll text={a.longIntro} type="word" textOpacity="soft" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* THREE AREAS */}
      <section className="bg-deep text-white relative overflow-hidden">
        <div className="noise-blue absolute inset-0" />
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-20 md:py-28 relative">
          <Reveal className="mb-12">
            <div className="eyebrow text-violL mb-4">What we do</div>
            <h2 className="display text-4xl md:text-6xl font-medium">
              Three areas.<br /><i className="text-violL">One standard.</i>
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {a.areas.map((ar, i) => (
              <Reveal key={ar.title} delay={i * 0.1}>
                <TiltCard intensity={8} className="glass rounded-3xl p-7 h-full">
                  <div className="w-14 h-14 rounded-2xl bg-viol text-white flex items-center justify-center text-2xl">
                    <i className={`fa-solid ${ar.icon}`} />
                  </div>
                  <div className="display text-2xl mt-5">{ar.title}</div>
                  <p className="text-sm text-white/60 mt-3 leading-relaxed">{ar.description}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDERS */}
      <section className="bg-cream py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8">
          <Reveal className="mb-12 text-center">
            <div className="eyebrow text-viol mb-4">The people</div>
            <h2 className="display text-4xl md:text-6xl font-medium">
              Founded by <i className="text-viol">two builders.</i>
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {a.founders.map((f, i) => (
              <Reveal key={f.name} delay={i * 0.1}>
                <TiltCard intensity={8} className="bg-white border border-deep/10 rounded-3xl p-8 text-center h-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.photo} alt={f.name} className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-viol/20" />
                  <div className="font-grotesk font-bold text-xl mt-5">{f.name}</div>
                  <div className="text-xs font-grotesk font-bold tracking-widest text-viol mt-1">{f.role.toUpperCase()}</div>
                  <p className="text-sm text-deep/60 mt-3">{f.bio}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-white py-20 md:py-28 border-y border-line">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-[380px_1fr] gap-12">
            <Reveal>
              <div className="eyebrow text-viol flex items-center gap-3 mb-4">
                <span className="w-10 h-[2px] bg-viol inline-block" /> Why Altraware
              </div>
              <h2 className="display text-4xl md:text-5xl font-medium">
                Local insight.<br /><i className="text-viol">Global craft.</i>
              </h2>
              <p className="text-deep/60 mt-5 text-[15px] leading-relaxed">{a.whoWeServe}</p>
              <div className="mt-8 bg-deep text-white rounded-2xl p-5">
                <div className="font-grotesk font-bold text-3xl"><Counter target={15} />+</div>
                <div className="text-xs text-white/55 mt-1">projects delivered across TZ & beyond</div>
              </div>
            </Reveal>
            <div className="grid sm:grid-cols-2 gap-4">
              {a.values.map((v, i) => (
                <Reveal key={v.title} delay={i * 0.08}>
                  <div className="stack-card bg-cream border border-deep/10 rounded-2xl p-6 h-full">
                    <div className="stack-icon w-12 h-12 rounded-xl bg-deep/5 border border-deep/10 flex items-center justify-center text-xl text-viol transition-all">
                      <i className={`fa-solid ${v.icon}`} />
                    </div>
                    <div className="font-grotesk font-bold mt-4">{v.title}</div>
                    <p className="text-sm text-deep/55 mt-1.5">{v.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* IMAGES STRIP */}
      <section className="bg-cream py-16">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ImgReveal src={content.images.streetTz} alt="Tanzania" className="rounded-2xl h-48" imgClassName="w-full h-full object-cover" />
            <ImgReveal src={content.images.community} alt="Community" className="rounded-2xl h-48 mt-6" imgClassName="w-full h-full object-cover" />
            <ImgReveal src={content.images.sectorSchool} alt="School" className="rounded-2xl h-48" imgClassName="w-full h-full object-cover" />
            <ImgReveal src={content.images.webPreview} alt="Work" className="rounded-2xl h-48 mt-6" imgClassName="w-full h-full object-cover" />
          </div>
          <Reveal>
            <div className="eyebrow text-viol mb-4 flex items-center gap-3">
              <span className="w-10 h-[2px] bg-viol inline-block" /> The studio in motion
            </div>
            <MediaBlock
              items={[
                ...(content.services[2].media ?? []).slice(0, 1),
                ...(content.projects[0].media ?? []),
              ]}
            />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-deep text-white relative overflow-hidden">
        <div className="noise-blue absolute inset-0" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-viol/25 blur-[120px] rounded-full" />
        <div className="max-w-[900px] mx-auto px-5 py-24 text-center relative">
          <Reveal>
            <h2 className="display text-4xl md:text-6xl font-medium">
              Let&apos;s write your <i className="text-violL">story</i> next.
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="flex flex-wrap justify-center gap-3 mt-8">
            <TransitionLink href="/contact" className="bg-white text-deep px-8 py-4 rounded-full font-bold text-sm hover:bg-viol hover:text-white transition-all">
              Start a project
            </TransitionLink>
            <TransitionLink href="/platforms" className="px-8 py-4 rounded-full font-bold text-sm border border-white/20 hover:border-violL transition-all">
              See our platforms
            </TransitionLink>
          </Reveal>
        </div>
      </section>
    </div>
  );
}