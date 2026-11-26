"use client";

import { useState } from "react";
import { TransitionLink } from "@/components/Navbar";
import { Reveal } from "@/components/motion";
import { useContent } from "@/components/providers";
import { ServicesAccordion } from "@/components/marketing";
import { type Project } from "@/lib/content";
import { useVisitorCurrency } from "@/lib/geo-pricing";
import ProjectModal from "@/components/ui/ProjectModal";

/* ============================================================
   HOME — six movements, each a different shape on purpose.
   Design law: DESIGN.md (v3 "Karatasi"). No gradients, no glass,
   no glow, no fake telemetry, one accent, one signature motion.
   ============================================================ */

const MOVEMENTS = [
  { n: "01", label: "Work", href: "#work" },
  { n: "02", label: "How we build", href: "#method" },
  { n: "03", label: "Services", href: "#services" },
  { n: "04", label: "Studio", href: "#studio" },
  { n: "05", label: "Start", href: "#start" },
];

/* Which projects are worth leading with — real, shipped, with a
   screenshot. Order is editorial, not alphabetical. */
const LEAD = ["faida-hq", "uaut-connect", "caretrack", "niketz", "volta-rentals", "aymi-africa"];

export default function Home() {
  const { content } = useContent();
  const geo = useVisitorCurrency();
  const [modalProject, setModalProject] = useState<Project | null>(null);

  const projects = content.projects;
  const shipped = projects.filter((p) => p.url?.startsWith("http"));
  const lead = LEAD.map((id) => projects.find((p) => p.id === id)).filter(Boolean) as Project[];
  const rest = shipped.filter((p) => !LEAD.includes(p.id)).slice(0, 3);
  const founders = content.about.founders;
  const phases = content.processPhases;
  const contact = content.contact;
  const wa = `https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Habari Altraware — I'd like to talk about a project."
  )}`;

  // Cheapest published package, in the visitor's currency.
  const floor = content.pricing.packages.reduce((min, p) => {
    if (typeof p.price !== "number") return min;
    return min === null || p.price < min ? p.price : min;
  }, null as number | null);

  return (
    <>
      <div id="hero">
        {/* ============================================================
            01 · STATEMENT
            ============================================================ */}
        <section className="relative pt-[104px] md:pt-[132px] pb-10 md:pb-16">
          <div className="mx-auto max-w-[1240px] px-[var(--pad)]">
            <div className="grid lg:grid-cols-[1fr_420px] gap-10 lg:gap-12 items-end">
              <div>
                <div className="label flex items-center gap-3 mb-7">
                  <span className="w-6 h-px bg-ink-3 inline-block" aria-hidden />
                  Software studio · Dar es Salaam · Est. 2025
                </div>

                <h1 className="display text-[40px] sm:text-[50px] lg:text-[58px] leading-[1.02] tracking-[-0.02em]">
                  <span className="block">Mizizi ya nyumbani.</span>
                  <em className="block text-clay">Ufundi wa kidunia.</em>
                </h1>

                <p className="mt-7 text-[17px] md:text-[19px] text-ink-2 leading-[1.6] max-w-[46ch]">
                  We build websites, apps and business systems in Dar es Salaam — in Kiswahili and
                  English, with M-Pesa inside and an offline mode that actually works.{" "}
                  <span className="text-ink">Rooted here. Built to the same standard anywhere.</span>
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                  <TransitionLink
                    href="/contact"
                    className="inline-flex items-center gap-3 bg-ink text-paper text-[14px] font-medium px-5 py-3.5 rounded-[3px] hover:bg-clay transition-colors"
                  >
                    Start a project <span aria-hidden>→</span>
                  </TransitionLink>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[14px] font-medium text-ink link-underline"
                  >
                    WhatsApp us
                  </a>
                  <span className="num text-[11px] text-ink-3 hidden sm:inline">
                    Replies within one working day
                  </span>
                </div>

                <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-rule pt-6 max-w-[520px]">
                  <div>
                    <dt className="label mb-1">In production</dt>
                    <dd className="num text-[26px] leading-none">{shipped.length}</dd>
                  </div>
                  <div>
                    <dt className="label mb-1">Since</dt>
                    <dd className="num text-[26px] leading-none">2025</dd>
                  </div>
                  <div>
                    <dt className="label mb-1">Payment</dt>
                    <dd className="num text-[26px] leading-none">M-Pesa</dd>
                  </div>
                </dl>
              </div>

              {/* Signature visual: the ink field parts and the product resolves.
                  Pure CSS on mount — no JS, no hydration cost, and it is
                  skipped entirely under prefers-reduced-motion. */}
              <div className="relative">
                <figure>
                  <div className="hero-frame relative overflow-hidden rounded-[4px] bg-ink aspect-[4/3]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={content.images.liveDemoPoster}
                      alt="Faida POS terminal — the retail system Altraware runs in Dar es Salaam"
                      className="hero-resolve w-full h-full object-cover"
                      fetchPriority="high"
                      decoding="async"
                    />
                    <div aria-hidden className="hero-ink absolute inset-0 bg-ink origin-bottom" />
                    <div className="absolute left-0 bottom-0 right-0 flex items-end justify-between gap-4 p-4">
                      <span className="num text-[10px] uppercase tracking-[0.12em] text-paper/90 bg-ink/55 px-2 py-1 rounded-[2px]">
                        Faida POS · live
                      </span>
                      <span className="num text-[10px] uppercase tracking-[0.12em] text-paper/90 bg-ink/55 px-2 py-1 rounded-[2px]">
                        Works offline
                      </span>
                    </div>
                  </div>
                  <figcaption className="flex items-baseline justify-between gap-4 mt-3">
                    <span className="text-[13px] text-ink-3">
                      Retail terminal, stock and receipts — built in-house, used in shops today.
                    </span>
                    <span className="num text-[11px] text-ink-3 shrink-0">faida-hq.vercel.app</span>
                  </figcaption>
                </figure>
              </div>
            </div>

            {/* Movement index — the page's table of contents */}
            <nav aria-label="On this page" className="mt-14 md:mt-20 border-t border-rule">
              <ul className="flex flex-wrap gap-x-8 gap-y-2 py-4">
                {MOVEMENTS.map((m) => (
                  <li key={m.n}>
                    <a href={m.href} className="group inline-flex items-baseline gap-2 text-[13px] text-ink-3 hover:text-ink transition-colors">
                      <span className="num text-[10px]">{m.n}</span>
                      <span className="link-underline">{m.label}</span>
                    </a>
                  </li>
                ))}
                <li className="ml-auto hidden md:block">
                  <span className="num text-[11px] text-ink-3">↓ scroll</span>
                </li>
              </ul>
            </nav>
          </div>
        </section>

        {/* ============================================================
            02 · WORK — the proof section, and the loudest thing here
            ============================================================ */}
        <section id="work" className="border-t border-rule bg-paper">
          <div className="mx-auto max-w-[1240px] px-[var(--pad)] py-14 md:py-24">
            <Reveal>
              <div className="label mb-4">01 — Work</div>
              <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-6 md:gap-16 items-end mb-10 md:mb-14">
                <h2 className="display text-[34px] sm:text-[44px] md:text-[54px] leading-[1.02] max-w-[22ch]">
                  Everything below is live. Open any of them.
                </h2>
                <p className="text-ink-2 text-[15px] max-w-[40ch] md:justify-self-end">
                  Retail terminals, university admissions, clinic records, sneaker commerce. Built
                  end-to-end by a two-person studio — the same two people you will talk to.
                </p>
              </div>
            </Reveal>

            {/* Lead: editorial rows, screenshot left, facts right */}
            <div className="border-t border-rule">
              {lead.slice(0, 3).map((p, i) => (
                <Reveal key={p.id} delay={i * 0.05}>
                  <article className="group border-b border-rule grid md:grid-cols-[0.9fr_1.1fr] gap-5 md:gap-10 py-7 md:py-9">
                    <button
                      onClick={() => setModalProject(p)}
                      className="relative block text-left overflow-hidden rounded-[4px] bg-paper-2 aspect-[16/10] md:aspect-[16/11]"
                      aria-label={`Open case study: ${p.title}`}
                    >
                      {p.media?.[0] && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={p.media[0].url}
                          alt={`${p.title} — ${p.media[0].caption}`}
                          loading={i === 0 ? "eager" : "lazy"}
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        />
                      )}
                      <span className="absolute top-3 left-3 num text-[10px] uppercase tracking-[0.1em] bg-paper/92 text-ink px-2 py-1 rounded-[2px]">
                        {p.category}
                      </span>
                    </button>

                    <div className="flex flex-col justify-between gap-5">
                      <div>
                        <div className="flex items-baseline gap-3">
                          <span className="num text-[11px] text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                          <h3 className="display text-[26px] md:text-[32px] leading-tight">{p.title}</h3>
                        </div>
                        <p className="text-[15px] text-ink-2 mt-3 max-w-[52ch] leading-[1.6]">
                          {p.description.split(/\.\s/)[0]}.
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {p.tags.slice(0, 4).map((t) => (
                            <span key={t} className="num text-[10px] uppercase tracking-[0.06em] text-ink-3 border border-rule px-2 py-1 rounded-[2px]">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[13px] font-medium text-ink link-underline"
                        >
                          Visit live site <span aria-hidden>↗</span>
                        </a>
                        <button
                          onClick={() => setModalProject(p)}
                          className="text-[13px] text-ink-3 hover:text-ink transition-colors"
                        >
                          Case study
                        </button>
                        <span className="num text-[11px] text-ink-3 md:ml-auto">
                          {p.client.split(/[(—]/)[0].trim()} · {p.year}
                        </span>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            {/* Rest: a compact three-up, the only 3-col grid on the page */}
            <Reveal className="mt-9">
              <div className="grid sm:grid-cols-3 gap-x-6 gap-y-8">
                {[...lead.slice(3), ...rest].slice(0, 3).map((p) => (
                  <button key={p.id} onClick={() => setModalProject(p)} className="group text-left">
                    <div className="aspect-[16/10] overflow-hidden rounded-[4px] bg-paper-2">
                      {p.media?.[0] && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={p.media[0].url}
                          alt={`${p.title} — ${p.media[0].caption}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      )}
                    </div>
                    <div className="mt-3 flex items-baseline justify-between gap-3">
                      <h3 className="text-[15px] font-medium group-hover:text-clay transition-colors">{p.title}</h3>
                      <span className="num text-[10px] text-ink-3 uppercase tracking-[0.06em]">{p.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <TransitionLink href="/impact" className="inline-flex items-center gap-2 text-[14px] font-medium text-ink link-underline">
                The full list — {shipped.length} deployments <span aria-hidden>→</span>
              </TransitionLink>
              <span className="num text-[11px] text-ink-3">
                {geo.currency === "USD" ? "Serving clients outside Tanzania too" : "Zote ziko hewani · all hosted"}
              </span>
            </Reveal>
          </div>
        </section>

        {/* ============================================================
            03 · METHOD — numbered typographic list, no cards
            ============================================================ */}
        <section id="method" className="bg-forest text-paper">
          <div className="mx-auto max-w-[1240px] px-[var(--pad)] py-14 md:py-24">
            <Reveal>
              <div className="label mb-4 !text-paper/50">02 — How we build</div>
              <div className="grid md:grid-cols-[1fr_1fr] gap-6 md:gap-16 items-end mb-10">
                <h2 className="display text-[34px] sm:text-[44px] md:text-[54px] leading-[1.02] max-w-[20ch]">
                  Fixed scope. Written price. Before any code.
                </h2>
                <p className="text-paper/70 text-[15px] max-w-[42ch] md:justify-self-end">
                  Five phases, each with something you can hold us to. You approve a phase before
                  the next one is billed — and you own the source code when we finish.
                </p>
              </div>
            </Reveal>

            <ol className="border-t border-paper/15">
              {phases.map((ph, i) => (
                <Reveal key={ph.num} delay={i * 0.04}>
                  <li className="grid grid-cols-[2.2rem_1fr] md:grid-cols-[3rem_16rem_1fr_auto] gap-x-4 md:gap-x-8 gap-y-1 items-baseline border-b border-paper/15 py-5 md:py-6">
                    <span className="num text-[11px] text-paper/40">{ph.num}</span>
                    <h3 className="display text-[22px] md:text-[26px] leading-tight">{ph.title}</h3>
                    <p className="text-[14px] text-paper/65 col-start-2 md:col-start-3 max-w-[48ch] leading-relaxed">
                      {ph.body}
                    </p>
                    <span className="num text-[10px] uppercase tracking-[0.1em] text-paper/40 col-start-2 md:col-start-4 md:text-right">
                      {ph.weeks}
                    </span>
                  </li>
                </Reveal>
              ))}
            </ol>

            <Reveal className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
              <TransitionLink
                href="/process"
                className="inline-flex items-center gap-2 text-[14px] font-medium text-paper link-underline"
              >
                The full process <span aria-hidden>→</span>
              </TransitionLink>
              <span className="text-[13px] text-paper/50">
                Written agreement · 30-day hypercare · maintenance from TSh 99K/mo
              </span>
            </Reveal>
          </div>
        </section>

        {/* ============================================================
            04 · SERVICES — accordion, editorial rows
            ============================================================ */}
        <ServicesAccordion preview />

        {/* ============================================================
            05 · STUDIO — the two people, one client quote, real places
            ============================================================ */}
        <section id="studio" className="border-t border-rule">
          <div className="mx-auto max-w-[1240px] px-[var(--pad)] py-14 md:py-24">
            <Reveal>
              <div className="label mb-4">04 — The studio</div>
              <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-6 md:gap-16 items-end mb-10 md:mb-14">
                <h2 className="display text-[34px] sm:text-[44px] md:text-[54px] leading-[1.02] max-w-[24ch]">
                  Two founders. No account managers between you and the build.
                </h2>
                <p className="text-ink-2 text-[15px] max-w-[40ch] md:justify-self-end">
                  We work with shops, schools, clinics and NGOs across Tanzania — and with
                  companies further afield who want the same thing: software that ships and keeps
                  running.
                </p>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-[1.15fr_0.85fr] gap-10 md:gap-16">
              {/* Founders */}
              <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
                {founders.map((f, i) => (
                  <Reveal key={f.name} delay={i * 0.06}>
                    <figure>
                      <div className="aspect-[4/5] overflow-hidden rounded-[4px] bg-paper-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={f.photo}
                          alt={`${f.name} — ${f.role}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover grayscale-[15%]"
                        />
                      </div>
                      <figcaption className="mt-3">
                        <div className="font-medium text-[15px]">{f.name}</div>
                        <div className="num text-[10px] uppercase tracking-[0.08em] text-ink-3 mt-1">{f.role}</div>
                        <p className="text-[13px] text-ink-2 mt-2 leading-relaxed max-w-[34ch]">{f.bio}</p>
                      </figcaption>
                    </figure>
                  </Reveal>
                ))}
              </div>

              {/* Values + one quote, no carousel */}
              <div className="flex flex-col gap-8">
                <Reveal>
                  <ul className="border-t border-rule">
                    {content.about.whyAltraware.map((v) => (
                      <li key={v.title} className="border-b border-rule py-4 grid grid-cols-[1fr] gap-1">
                        <span className="text-[14px] font-medium">{v.title}</span>
                        <span className="text-[13px] text-ink-3 leading-relaxed">{v.body}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
                <Reveal delay={0.08}>
                  <blockquote className="border-l-2 border-clay pl-5">
                    <p className="display text-[20px] md:text-[23px] leading-snug tracking-normal">
                      &ldquo;{content.impact.testimonials[0]?.quote}&rdquo;
                    </p>
                    <footer className="mt-3 text-[13px] text-ink-2">
                      <span className="font-medium">{content.impact.testimonials[0]?.name}</span>
                      <span className="text-ink-3"> · {content.impact.testimonials[0]?.role}</span>
                    </footer>
                  </blockquote>
                </Reveal>
                <Reveal delay={0.12}>
                  <TransitionLink href="/about" className="inline-flex items-center gap-2 text-[14px] font-medium text-ink link-underline">
                    More about the studio <span aria-hidden>→</span>
                  </TransitionLink>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            06 · START — one paragraph, the real price floor
            ============================================================ */}
        <section id="start" className="border-t border-rule bg-paper-2/50">
          <div className="mx-auto max-w-[1240px] px-[var(--pad)] py-14 md:py-24">
            <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-10 md:gap-16">
              <Reveal>
                <div className="label mb-4">05 — Start</div>
                <h2 className="display text-[36px] sm:text-[46px] md:text-[58px] leading-[1.0] max-w-[18ch]">
                  Tell us what you need. You&apos;ll get a written plan and a real price.
                </h2>
                <p className="mt-6 text-[16px] text-ink-2 max-w-[46ch] leading-[1.65]">
                  {floor
                    ? `Websites start at ${geo.fmtTag(floor)}. Business systems are scoped per project. `
                    : ""}
                  One conversation, no pressure, and a quote you can read before you commit to
                  anything.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                  <TransitionLink
                    href="/contact"
                    className="inline-flex items-center gap-3 bg-ink text-paper text-[14px] font-medium px-5 py-3.5 rounded-[3px] hover:bg-clay transition-colors"
                  >
                    Start a project <span aria-hidden>→</span>
                  </TransitionLink>
                  <TransitionLink href="/pricing" className="inline-flex items-center gap-2 text-[14px] font-medium text-ink link-underline">
                    See published packages
                  </TransitionLink>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <dl className="border-t border-rule">
                  <div className="border-b border-rule py-4 flex items-baseline justify-between gap-6">
                    <dt className="text-[13px] text-ink-3">Email</dt>
                    <dd className="text-[14px]"><a href={`mailto:${contact.email}`} className="link-underline break-all">{contact.email}</a></dd>
                  </div>
                  <div className="border-b border-rule py-4 flex items-baseline justify-between gap-6">
                    <dt className="text-[13px] text-ink-3">Phone</dt>
                    <dd className="num text-[14px]"><a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a></dd>
                  </div>
                  <div className="border-b border-rule py-4 flex items-baseline justify-between gap-6">
                    <dt className="text-[13px] text-ink-3">WhatsApp</dt>
                    <dd className="text-[14px]"><a href={wa} target="_blank" rel="noopener noreferrer" className="link-underline">Message us</a></dd>
                  </div>
                  <div className="border-b border-rule py-4 flex items-baseline justify-between gap-6">
                    <dt className="text-[13px] text-ink-3">Studio</dt>
                    <dd className="text-[14px]">{contact.address}</dd>
                  </div>
                  <div className="py-4 flex items-baseline justify-between gap-6">
                    <dt className="text-[13px] text-ink-3">Hours</dt>
                    <dd className="num text-[13px]">{contact.hours}</dd>
                  </div>
                </dl>
              </Reveal>
            </div>
          </div>
        </section>
      </div>

      <ProjectModal project={modalProject} onClose={() => setModalProject(null)} />
    </>
  );
}
