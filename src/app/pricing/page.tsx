"use client";

import { useMemo, useState } from "react";
import { TransitionLink } from "@/components/Navbar";
import { Reveal, TiltCard } from "@/components/motion";
import { useContent, useNotify } from "@/components/providers";
import { computeEstimate } from "@/lib/content";
import { CurrencyToggle, useVisitorCurrency } from "@/lib/geo-pricing";
import { TextEffect } from "@/components/ui/text-effect";

import PricingSection from "@/components/ui/pricing-section";

/* ============================================================
   PRICING — packages, smarter estimator, support plans, FAQ
   Estimator logic: complexity score → contingency & timeline,
   bundle discount for 3+ features, optional VAT & support.
   ============================================================ */

export default function PricingPage() {
  const { content } = useContent();
  const { notify } = useNotify();
  const pricing = content.pricing;

  const [typeId, setTypeId] = useState(pricing.estimator.types[0].id);
  const [featureIds, setFeatureIds] = useState<string[]>([]);
  const [includeVat, setIncludeVat] = useState(false);
  const [includeSupport, setIncludeSupport] = useState(false);
  const [supportPlanId, setSupportPlanId] = useState(pricing.supportPlans[0].id);
  const geo = useVisitorCurrency();

  const estimate = useMemo(
    () =>
      computeEstimate(
        { typeId, featureIds, includeSupport, supportPlanId, includeVat },
        content
      ),
    [typeId, featureIds, includeSupport, supportPlanId, includeVat, content]
  );

  const toggleFeature = (id: string) =>
    setFeatureIds((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const faqOpen = useState<string>("")[0]; // keep accordion state local below

  return (
    <div className="pt-[120px]">
      {/* HERO */}
      <section className="relative overflow-hidden grid-bg">
        <div className="absolute -top-32 -right-32 w-[560px] h-[560px] rounded-full bg-viol/10 blur-[120px] pointer-events-none" />
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-16 md:py-24">
          <Reveal>
            <div className="eyebrow text-viol mb-4 flex items-center gap-3">
              <span className="w-10 h-[2px] bg-viol inline-block" /> Transparent Pricing
            </div>
            <h1 className="display text-5xl md:text-7xl font-medium">
              <span className="block">
                <TextEffect as="span" per="word" preset="fade">
                  Tell us your vision.
                </TextEffect>
              </span>
              <i className="text-viol block mt-1">
                <TextEffect as="span" per="word" preset="slide" delay={0.25}>
                  We&apos;ll cost it honestly.
                </TextEffect>
              </i>
            </h1>
            <p className="text-deep/60 mt-6 max-w-xl text-[15px] md:text-base">{pricing.intro}</p>
          </Reveal>
        </div>
      </section>

      {/* INTERACTIVE PRICING SECTION (Websites & Systems) */}
      <PricingSection />

      {/* ============ SMART ESTIMATOR ============ */}
      <section className="bg-white pt-10 pb-20 md:pb-28 border-y border-line">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 mb-8 flex justify-center">
          <CurrencyToggle pricing={geo} />
        </div>
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 grid lg:grid-cols-[1fr_1fr] gap-6 items-start">
          {/* ESTIMATOR */}
          <Reveal className="bg-white border border-deep/10 rounded-3xl p-6 md:p-8 shadow-xl shadow-deep/5">
            <div className="flex items-center justify-between mb-6">
              <div className="font-grotesk font-bold text-lg flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-viol text-white flex items-center justify-center text-sm">
                  <i className="fa-solid fa-calculator" />
                </span>{" "}
                Instant Estimator
              </div>
              <span className="text-[10px] font-bold bg-green-100 text-green-700 px-3 py-1.5 rounded-full tracking-widest">
                LIVE · {geo.currency === "USD" ? "USD" : "TSH"}
              </span>
            </div>

            {/* 1 - TYPE */}
            <div className="text-xs font-grotesk font-bold tracking-widest text-deep/45 mb-3">
              1 · WHAT DO YOU NEED?
            </div>
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              {pricing.estimator.types.map((t) => (
                <button
                  key={t.id}
                  className={`est-option border-2 border-deep/10 rounded-2xl p-3.5 text-center ${typeId === t.id ? "selected" : ""}`}
                  onClick={() => setTypeId(t.id)}
                >
                  <div className="est-check w-5 h-5 rounded-full border-2 border-deep/20 mx-auto mb-2 flex items-center justify-center text-[9px]">
                    <i className="fa-solid fa-check" />
                  </div>
                  <i className={`fa-solid ${t.icon} text-xl text-viol`} />
                  <div className="text-xs font-bold mt-1.5">{t.label}</div>
                  <div className="text-[10px] text-deep/45 font-mono mt-0.5">from {geo.symbol} {geo.fmtK(t.base)}</div>
                </button>
              ))}
            </div>

            {/* 2 - FEATURES */}
            <div className="text-xs font-grotesk font-bold tracking-widest text-deep/45 mb-3">
              2 · SELECT FEATURES {featureIds.length >= 3 && (
                <span className="text-green-600 ml-2">✓ bundle discount −10% applied</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {pricing.estimator.features.map((f) => (
                <button
                  key={f.id}
                  className={`est-option border-2 border-deep/10 rounded-xl px-3.5 py-3 flex items-center gap-2.5 ${
                    featureIds.includes(f.id) ? "selected" : ""
                  }`}
                  onClick={() => toggleFeature(f.id)}
                >
                  <div className="est-check w-5 h-5 rounded-full border-2 border-deep/20 flex items-center justify-center text-[9px] shrink-0">
                    <i className="fa-solid fa-check" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">{f.label}</div>
                    <div className="text-[10px] text-deep/45">+ {geo.symbol} {geo.fmtK(f.cost)}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* 3 - OPTIONS */}
            <div className="text-xs font-grotesk font-bold tracking-widest text-deep/45 mt-6 mb-3">
              3 · PROJECT OPTIONS
            </div>
            <div className="space-y-2.5">
              <label className="flex items-center gap-3 bg-cream border border-deep/10 rounded-xl px-4 py-3 cursor-pointer">
                <input type="checkbox" className="accent-[#7C3AED] w-4 h-4" checked={includeVat} onChange={(e) => setIncludeVat(e.target.checked)} />
                <span className="text-sm">Include VAT ({pricing.estimator.vatPercent}%)</span>
                <span className="ml-auto text-xs font-mono text-deep/45">added on top</span>
              </label>
              <label className="flex items-center gap-3 bg-cream border border-deep/10 rounded-xl px-4 py-3 cursor-pointer">
                <input type="checkbox" className="accent-[#7C3AED] w-4 h-4" checked={includeSupport} onChange={(e) => setIncludeSupport(e.target.checked)} />
                <span className="text-sm">Include monthly support plan</span>
              </label>
              {includeSupport && (
                <div className="grid grid-cols-3 gap-2">
                  {pricing.supportPlans.map((p) => (
                    <button
                      key={p.id}
                      className={`pay-btn border border-deep/15 rounded-xl py-2 text-[11px] font-bold transition-all ${
                        supportPlanId === p.id ? "active" : ""
                      }`}
                      onClick={() => setSupportPlanId(p.id)}
                    >
                      {p.price === "custom" ? p.name.split(" ")[0] : `${geo.fmtTag(p.price)}/mo`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          {/* RESULT PANEL */}
          <Reveal delay={0.1}>
            <div className="bg-deep text-white rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-viol/30 blur-[80px] rounded-full" />
              <div className="relative">
                <div className="text-[11px] tracking-widest font-grotesk text-white/50">ESTIMATED INVESTMENT RANGE</div>
                <div className="font-grotesk font-bold text-4xl mt-2">
                  {geo.fmtTag(estimate.subtotal)} <span className="text-white/40">–</span> {geo.fmtTag(estimate.highEnd)}
                </div>
                <div className="text-[13px] text-white/55 mt-2">
                  ⏱ ~{estimate.weeks[0]}–{estimate.weeks[1]} weeks · includes design + training
                </div>

                {/* breakdown */}
                <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-5 text-sm space-y-2">
                  <div className="flex justify-between text-white/60">
                    <span>Base ({pricing.estimator.types.find((t) => t.id === typeId)?.label})</span>
                    <span className="font-mono">{geo.fmt(estimate.base)}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Features ({estimate.selectedFeatures.length}){featureIds.length >= 3 ? " −10% bundle" : ""}</span>
                    <span className="font-mono">{geo.fmt(estimate.featuresCost)}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal</span>
                    <span className="font-mono">{geo.fmt(estimate.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Contingency ({Math.round((estimate.highEnd - estimate.subtotal) / estimate.subtotal * 100)}% by complexity {estimate.complexity}/10)</span>
                    <span className="font-mono">{geo.fmt(estimate.contingency)}</span>
                  </div>
                  {includeVat && (
                    <div className="flex justify-between text-white/60">
                      <span>VAT ({pricing.estimator.vatPercent}%)</span>
                      <span className="font-mono">{geo.fmt(estimate.vat)}</span>
                    </div>
                  )}
                  {includeSupport && (
                    <div className="flex justify-between text-white/60">
                      <span>Support plan / month</span>
                      <span className="font-mono">
                        {estimate.supportMonthly === "custom" ? "Custom" : geo.fmt(estimate.supportMonthly)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-3 flex justify-between font-grotesk font-bold text-xl">
                    <span>{includeVat ? "Total (incl. VAT)" : "Total"}</span>
                    <span className="text-violL">{geo.fmt(estimate.totalWithVat)}</span>
                  </div>
                </div>

                {/* complexity meter */}
                <div className="mt-5">
                  <div className="flex justify-between text-[11px] font-grotesk font-bold tracking-widest text-white/40 mb-2">
                    <span>PROJECT COMPLEXITY</span>
                    <span>{estimate.complexity}/10</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violL to-viol rounded-full transition-all duration-500"
                      style={{ width: `${estimate.complexity * 10}%` }}
                    />
                  </div>
                </div>

                <TransitionLink
                  href={`/contact?estimate=${encodeURIComponent(
                    `I'm interested in a ${typeId} project (${geo.fmtTag(estimate.subtotal)} – ${geo.fmtTag(estimate.highEnd)}). Features: ${estimate.selectedFeatures.join(", ") || "standard"}.`
                  )}`}
                  className="mt-6 block text-center bg-viol hover:bg-violD transition-colors text-white text-sm font-bold py-4 rounded-xl shadow-lg shadow-viol/30"
                  onClick={() => notify("Estimate attached to your brief ✓")}
                >
                  Use this estimate in your brief ↓
                </TransitionLink>
                <div className="mt-3 text-center text-[11px] text-white/40">
                  Estimates are indicative — every real quote is fixed & written.
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SUPPORT PLANS */}
      <section className="bg-deep text-white relative overflow-hidden">
        <div className="noise-blue absolute inset-0" />
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-20 md:py-28 relative">
          <Reveal className="text-center text-[11px] font-grotesk font-bold tracking-[0.3em] text-white/40 mb-10">
            MAINTENANCE & SUPPORT PLANS — AFTER LAUNCH
          </Reveal>
          <div className="grid md:grid-cols-3 gap-4">
            {pricing.supportPlans.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <div
                  className={`rounded-3xl p-7 h-full relative overflow-hidden ${
                    p.popular ? "bg-viol shadow-2xl shadow-viol/30" : "bg-white/[0.06] border border-white/10 hover:border-violL/50 transition-colors"
                  }`}
                >
                  {p.popular && (
                    <div className="absolute top-4 right-4 text-[10px] font-bold bg-white text-viol px-3 py-1 rounded-full tracking-widest">
                      POPULAR
                    </div>
                  )}
                  <div className={`text-xs font-grotesk font-bold tracking-widest ${p.popular ? "text-white/70" : "text-white/50"}`}>
                    {p.name.toUpperCase()}
                  </div>
                  <div className="font-grotesk font-bold text-3xl mt-2">
                    {p.price === "custom" ? "Custom" : geo.fmtTag(p.price)}
                    {p.price !== "custom" && <span className={`text-sm font-sans font-normal ${p.popular ? "text-white/70" : "text-white/50"}`}>{p.unit}</span>}
                  </div>
                  <ul className={`text-sm mt-4 space-y-2.5 ${p.popular ? "text-white/85" : "text-white/65"}`}>
                    {p.features.map((f) => (
                      <li key={f}>
                        <i className={`fa-solid fa-check mr-2 ${p.popular ? "text-white" : "text-green-400"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cream py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 grid lg:grid-cols-[320px_1fr] gap-8">
          <Reveal>
            <div className="eyebrow text-viol mb-3">FAQ</div>
            <h3 className="display text-3xl font-medium">
              Honest answers,<br /><i className="text-viol">no jargon.</i>
            </h3>
            <div className="mt-5 bg-white border border-deep/10 rounded-2xl p-4 text-sm">
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-shield-halved text-viol text-xl" />
                <div className="font-bold">Privacy promise</div>
              </div>
              <p className="text-deep/60 text-[13px] mt-2">
                Your data is yours. Encrypted storage, role-based access, written data agreements. We never sell or
                share client data.
              </p>
            </div>
          </Reveal>
          <FaqList faqs={pricing.faqs} />
        </div>
      </section>
    </div>
  );
}

/* FAQ accordion */
function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <Reveal key={f.q} delay={i * 0.05}>
          <div className={`faq-item bg-white border border-deep/10 rounded-2xl overflow-hidden ${open === i ? "open" : ""}`}>
            <button
              className="w-full flex items-center justify-between gap-4 p-5 text-left font-bold text-[15px]"
              onClick={() => setOpen(open === i ? null : i)}
            >
              {f.q}
              <span className="faq-icon w-8 h-8 rounded-full bg-deep/5 flex items-center justify-center shrink-0 transition-all">
                <i className="fa-solid fa-plus text-xs" />
              </span>
            </button>
            <div className="faq-a">
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm text-deep/60">{f.a}</p>
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}