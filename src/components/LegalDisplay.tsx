import { Reveal } from "@/components/motion";

/* Shared layout for Privacy & Terms pages.
   Server-rendered from defaults (SEO-friendly); the legal copy
   lives in lib/content.ts so it can be edited in admin later. */

export function ContentDisplay({
  eyebrow,
  titleA,
  titleAccent,
  doc,
  cd,
}: {
  eyebrow: string;
  titleA: string;
  titleAccent: string;
  doc: { updated: string; intro: string; sections: { title: string; body: string }[] };
  cd: { legalName: string; email: string; phonePrimary: string; phoneSecondary: string; address: string; registration: string };
}) {
  return (
    <div className="pt-[120px]">
      {/* HERO */}
      <section className="relative overflow-hidden grid-bg">
        <div className="absolute -top-32 -right-32 w-[560px] h-[560px] rounded-full bg-viol/10 blur-[120px] pointer-events-none" />
        <div className="max-w-[840px] mx-auto px-5 md:px-8 py-16 md:py-24">
          <Reveal>
            <div className="eyebrow text-viol mb-4 flex items-center gap-3">
              <span className="w-10 h-[2px] bg-viol inline-block" /> {eyebrow}
            </div>
            <h1 className="display text-4xl md:text-6xl font-medium">
              {titleA} <i className="text-viol">{titleAccent}</i>
            </h1>
            <div className="mt-6 inline-flex items-center gap-2 bg-white border border-deep/10 rounded-full px-4 py-2 text-xs font-grotesk font-bold text-deep/60">
              <i className="fa-solid fa-calendar-check text-viol" /> Last updated: {doc.updated}
            </div>
            <p className="text-deep/70 text-base md:text-lg leading-relaxed mt-6">{doc.intro}</p>
          </Reveal>
        </div>
      </section>

      {/* SECTIONS */}
      <section className="bg-cream py-16 md:py-24 border-t border-line">
        <div className="max-w-[840px] mx-auto px-5 md:px-8 space-y-6">
          {doc.sections.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.03}>
              <article className="bg-white border border-deep/10 rounded-2xl p-6 md:p-8">
                <h2 className="font-grotesk font-bold text-lg text-deep flex items-start gap-3">
                  <span className="w-8 h-8 rounded-lg bg-viol/10 text-viol flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.title.replace(/^\d+\.\s*/, "")}
                </h2>
                <p className="text-deep/70 text-[15px] leading-relaxed mt-4">{s.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* COMPANY BLOCK */}
      <section className="bg-deep text-white relative overflow-hidden">
        <div className="noise-blue absolute inset-0" />
        <div className="max-w-[840px] mx-auto px-5 md:px-8 py-16 relative">
          <Reveal>
            <div className="glass rounded-2xl p-6 md:p-8">
              <div className="text-[11px] font-grotesk font-bold tracking-[0.25em] text-white/40 mb-4">COMPANY DETAILS — KAMPUNI</div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex gap-3"><i className="fa-solid fa-building text-violL mt-0.5" /><span>{cd.legalName}</span></div>
                  <div className="flex gap-3"><i className="fa-solid fa-location-dot text-violL mt-0.5" /><span>{cd.address}</span></div>
                  <div className="flex gap-3"><i className="fa-solid fa-certificate text-violL mt-0.5" /><span>{cd.registration}</span></div>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-3"><i className="fa-solid fa-envelope text-violL mt-0.5" /><span>{cd.email}</span></div>
                  <div className="flex gap-3"><i className="fa-solid fa-phone text-violL mt-0.5" /><span>{cd.phonePrimary} · {cd.phoneSecondary}</span></div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}