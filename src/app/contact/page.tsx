"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/motion";
import { useContent, useNotify } from "@/components/providers";
import { createInquiry } from "@/lib/leads";
import Link from "next/link";

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="pt-[160px]" />}>
      <ContactInner />
    </Suspense>
  );
}

const SERVICES_OPTIONS = [
  "Business Website",
  "Faida POS & Retail OS",
  "CareTrack System",
  "Mobile App (Flutter)",
  "Custom Web Platform",
  "School / Education Portal",
  "M-Pesa Integration",
];

const BUDGET_OPTIONS = [
  "TSh 350k – 600k",
  "TSh 600k – 1.5M",
  "TSh 1.5M – 3.5M",
  "TSh 3.5M+",
  "Not sure yet",
];

const TIMELINE_OPTIONS = [
  "ASAP (1–2 weeks)",
  "Within 1 month",
  "2–3 months",
  "Flexible",
];

const STEPS = [
  { n: 1, label: "About you", sw: "Contact info" },
  { n: 2, label: "The project", sw: "What you need" },
  { n: 3, label: "Budget & time", sw: "Investment range" },
  { n: 4, label: "Review & send", sw: "Confirm & submit" },
];

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
};

function ContactInner() {
  const { content } = useContent();
  const { notify } = useNotify();
  const params = useSearchParams();
  const c = content.contact;

  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [done, setDone] = useState(false);
  const [refCode, setRefCode] = useState("");
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>(["Business Website"]);
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState(BUDGET_OPTIONS[0]);
  const [timeline, setTimeline] = useState(TIMELINE_OPTIONS[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill message when arriving from estimator or query
  useEffect(() => {
    const est = params.get("estimate");
    if (est) {
      setMessage(`Hi Altraware! I'm interested in a project: ${est}`);
      if (est.toLowerCase().includes("website")) {
        setSelectedServices(["Business Website"]);
      }
    }
  }, [params]);

  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
  };

  const toggleService = (s: string) => {
    setSelectedServices((prev) =>
      prev.includes(s) ? (prev.length > 1 ? prev.filter((item) => item !== s) : prev) : [...prev, s]
    );
  };

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!name.trim()) e.name = "Name is required";
      if (!phone.trim()) e.phone = "Phone / WhatsApp number is required";
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Valid email address is required";
    }
    if (step === 2) {
      if (selectedServices.length === 0) e.services = "Please select at least one service";
      if (!message.trim() || message.trim().length < 8) e.message = "Please describe your project (8+ characters)";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep()) go(step + 1);
  };
  const back = () => go(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const generatedRef = "#ALT-" + Math.floor(1000 + Math.random() * 9000);
    setRefCode(generatedRef);

    try {
      await createInquiry({
        name,
        org: company || undefined,
        phone,
        email,
        type: selectedServices.join(", "),
        message: `${message}\n\n[Budget: ${budget} | Timeline: ${timeline}]`,
        budget,
        timeline,
        refCode: generatedRef,
      });

      // Send branded emails via Nodemailer
      try {
        const mailRes = await fetch("/api/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            org: company || undefined,
            phone,
            email,
            type: selectedServices.join(", "),
            message,
            budget,
            timeline,
            refCode: generatedRef,
          }),
        });
        if (mailRes.ok) {
          const mailData = await mailRes.json();
          if (mailData.emailSent) {
            setEmailSent(true);
          }
        }
      } catch (mailErr) {
        console.warn("Email API notification error:", mailErr);
      }

      setSending(false);
      setDone(true);
      notify("Brief received — we'll be in touch within one business day ✓", "success");
    } catch {
      setSending(false);
      setDone(true);
      notify("Brief saved — we'll be in touch soon ✓", "success");
    }
  };

  return (
    <div className="pt-[120px]">
      <section className="bg-cream py-12 md:py-20 relative overflow-hidden min-h-[85vh]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8">
          {/* HEADER */}
          <Reveal className="text-center max-w-2xl mx-auto mb-10">
            <div className="eyebrow text-viol mb-3 flex items-center justify-center gap-2">
              <span className="w-8 h-[2px] bg-viol inline-block" /> Start a project
            </div>
            <h1 className="display text-4xl sm:text-5xl md:text-6xl font-medium">
              Tell us your vision.<br /><i className="text-viol">We&apos;ll cost it honestly.</i>
            </h1>
            <p className="text-deep/60 mt-3 text-sm md:text-base">
              Send your brief in four simple steps. We reply within one business day — in English or Swahili.
            </p>
          </Reveal>

          <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start max-w-6xl mx-auto">
            {/* LEFT CONTACT INFO */}
            <Reveal className="space-y-4">
              <div className="bg-deep text-white rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-xl">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-viol/30 blur-[80px] rounded-full" />
                <div className="relative space-y-4">
                  <div className="font-grotesk font-bold text-lg text-white">Get in touch</div>
                  {[
                    { icon: "fa-location-dot", label: "Address", value: c.address },
                    { icon: "fa-phone", label: "Phone", value: c.phone },
                    { icon: "fa-envelope", label: "Email", value: c.email },
                    { icon: "fa-clock", label: "Working Hours", value: c.hours },
                  ].map((x) => (
                    <div key={x.label} className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-violL shrink-0 text-sm">
                        <i className={`fa-solid ${x.icon}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-grotesk font-bold tracking-widest text-white/40">{x.label.toUpperCase()}</div>
                        <div className="text-xs sm:text-sm font-medium mt-0.5 truncate text-white/90">{x.value}</div>
                      </div>
                    </div>
                  ))}

                  <div className="pt-2">
                    <a
                      href={`https://wa.me/${c.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-3 rounded-full font-bold text-xs sm:text-sm transition-transform hover:scale-[1.02] shadow-lg"
                    >
                      <i className="fa-brands fa-whatsapp text-lg" />
                      Chat on WhatsApp now
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-deep/10 rounded-3xl p-5 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <i className="fa-solid fa-shield-halved text-viol text-lg" />
                  <div className="font-bold text-sm text-deep">Privacy &amp; Data Promise</div>
                </div>
                <p className="text-deep/60 text-xs mt-2 leading-relaxed">
                  Your data is 100% yours. Encrypted storage, role-based access, written data agreements (PDPA 2022 compliant).
                  We never share client data — hatutashiriki taarifa zako.
                </p>
              </div>

              {/* GOOGLE BUSINESS PROFILE MAP EMBED */}
              <div className="bg-white border border-deep/10 rounded-3xl p-5 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-map-location-dot text-viol text-base" />
                    <span className="font-bold text-sm text-deep">Google Business Profile</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Verified
                  </span>
                </div>
                <p className="text-deep/60 text-xs mb-3">
                  Altraware Technology on Google Maps · Dar es Salaam, Tanzania
                </p>
                <div className="rounded-2xl overflow-hidden border border-deep/10 shadow-inner aspect-[4/3] w-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8121083.165202397!2d29.686476509624033!3d-6.345767185778589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xb655bb5a1860615%3A0x815b0f25ed425796!2sAltraware%20Technology!5e0!3m2!1sen!2stz!4v1791875517058!5m2!1sen!2stz"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    title="Altraware Technology Google Maps"
                    className="w-full h-full"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-deep/50">Dar es Salaam, Tanzania</span>
                  <a
                    href="https://maps.google.com/maps/place/Altraware+Technology/@-6.3457672,29.6864765,6z/data=!4m6!3m5!1s0xb655bb5a1860615:0x815b0f25ed425796!8m2!3d-6.3457672!4d29.6864765!16s%2Fg%2F11w_m7w_q?entry=ttu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-viol font-bold hover:underline inline-flex items-center gap-1"
                  >
                    Open in Google Maps <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" />
                  </a>
                </div>
              </div>
            </Reveal>

            {/* RIGHT MULTI-STEP FLOW / REVIEW & SEND */}
            <div className="bg-deep text-white rounded-3xl p-6 sm:p-9 shadow-2xl relative overflow-hidden border border-white/10">
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-viol/25 blur-[90px] rounded-full pointer-events-none" />

              {done ? (
                /* CELEBRATION / DONE STATE */
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="relative z-10 text-center py-8 space-y-5"
                >
                  <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-viol to-green-500 text-white flex items-center justify-center text-3xl shadow-2xl shadow-green-500/20">
                    <i className="fa-solid fa-check" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-green-400 bg-green-500/15 border border-green-500/30 px-3 py-1 rounded-full uppercase">
                      Request Received {refCode}
                    </span>
                    <h2 className="display text-3xl sm:text-4xl font-medium mt-3 text-white">
                      You&apos;re in! Thanks, {name.split(" ")[0]}.
                    </h2>
                    <p className="text-white/70 text-sm mt-2 max-w-md mx-auto">
                      We&apos;ve received your brief. David and the Altraware team will review it and get back to you at{" "}
                      <b className="text-violL">{email}</b> or <b className="text-white">{phone}</b> within one business day.
                    </p>
                    <div className="mt-3">
                      {emailSent ? (
                        <span className="inline-flex items-center gap-2 text-xs text-green-300 bg-green-500/15 border border-green-500/30 px-3.5 py-1.5 rounded-full">
                          <i className="fa-solid fa-envelope-circle-check text-green-400" /> Branded receipt sent to {email}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-xs text-white/70 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
                          <i className="fa-solid fa-envelope text-violL" /> Notification queued for {email}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/${c.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Hi Altraware! I just submitted a project brief (${refCode}). My name is ${name}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#25D366] text-white px-6 py-3 rounded-full text-xs font-bold hover:scale-105 transition-all inline-flex items-center gap-2"
                    >
                      <i className="fa-brands fa-whatsapp text-base" /> Also send on WhatsApp
                    </a>
                    <button
                      onClick={() => {
                        setDone(false);
                        setStep(1);
                        setName("");
                        setEmail("");
                        setPhone("");
                        setMessage("");
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full text-xs font-semibold transition-colors"
                    >
                      Submit another brief
                    </button>
                    <Link
                      href="/"
                      className="text-xs text-white/50 hover:text-white underline px-3 py-2"
                    >
                      Back to home
                    </Link>
                  </div>
                </motion.div>
              ) : (
                /* MULTI-STEP FORM */
                <div className="relative z-10">
                  {/* Step indicators */}
                  <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-5">
                    {STEPS.map((s, idx) => (
                      <div key={s.n} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => s.n < step && go(s.n)}
                          className={`w-8 h-8 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                            s.n === step
                              ? "bg-viol text-white shadow-lg shadow-viol/40 scale-110"
                              : s.n < step
                              ? "bg-white/20 text-white hover:bg-viol cursor-pointer"
                              : "bg-white/5 text-white/30 cursor-default"
                          }`}
                        >
                          {s.n < step ? "✓" : s.n}
                        </button>
                        <div className="hidden md:block text-left">
                          <div className={`text-[11px] font-bold leading-tight ${s.n === step ? "text-white" : "text-white/40"}`}>
                            {s.label}
                          </div>
                          <div className="text-[9px] text-white/30">{s.sw}</div>
                        </div>
                        {idx < STEPS.length - 1 && (
                          <div className="hidden sm:block w-6 md:w-8 h-px bg-white/10 mx-1" />
                        )}
                      </div>
                    ))}
                  </div>

                  <AnimatePresence mode="wait" custom={dir}>
                    <motion.div
                      key={step}
                      custom={dir}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {/* ───── STEP 1: ABOUT YOU */}
                      {step === 1 && (
                        <div className="space-y-4">
                          <div>
                            <h2 className="text-xl font-bold font-grotesk text-white">About you</h2>
                            <p className="text-xs text-white/50 mt-0.5">Enter your contact information so we can get back to you.</p>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block mb-1">
                                Your Name · Jina lako *
                              </label>
                              <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="David Mwijage"
                                className={`w-full bg-white/[0.06] border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors ${
                                  errors.name ? "border-red-400 focus:border-red-500" : "border-white/15 focus:border-viol"
                                }`}
                              />
                              {errors.name && <span className="text-[11px] text-red-400 mt-1 block">{errors.name}</span>}
                            </div>

                            <div>
                              <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block mb-1">
                                Phone (WhatsApp) · Namba ya Simu *
                              </label>
                              <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+255 754 000 000"
                                className={`w-full bg-white/[0.06] border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors ${
                                  errors.phone ? "border-red-400 focus:border-red-500" : "border-white/15 focus:border-viol"
                                }`}
                              />
                              {errors.phone && <span className="text-[11px] text-red-400 mt-1 block">{errors.phone}</span>}
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block mb-1">
                                Email · Barua pepe *
                              </label>
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="hello@company.co.tz"
                                className={`w-full bg-white/[0.06] border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors ${
                                  errors.email ? "border-red-400 focus:border-red-500" : "border-white/15 focus:border-viol"
                                }`}
                              />
                              {errors.email && <span className="text-[11px] text-red-400 mt-1 block">{errors.email}</span>}
                            </div>

                            <div>
                              <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block mb-1">
                                Company / Org · Kampuni au Taasisi
                              </label>
                              <input
                                type="text"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                placeholder="Kariakoo Wholesale Ltd"
                                className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-viol transition-colors"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ───── STEP 2: THE PROJECT */}
                      {step === 2 && (
                        <div className="space-y-4">
                          <div>
                            <h2 className="text-xl font-bold font-grotesk text-white">The project</h2>
                            <p className="text-xs text-white/50 mt-0.5">Select the type of system you need and describe your main goal.</p>
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block mb-2">
                              What do you need? · Unahitaji nini? *
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {SERVICES_OPTIONS.map((s) => {
                                const active = selectedServices.includes(s);
                                return (
                                  <button
                                    key={s}
                                    type="button"
                                    onClick={() => toggleService(s)}
                                    className={`text-xs font-semibold px-3.5 py-2 rounded-full border transition-all ${
                                      active
                                        ? "bg-viol border-viol text-white shadow-md shadow-viol/30"
                                        : "bg-white/[0.05] border-white/15 text-white/70 hover:border-white/30"
                                    }`}
                                  >
                                    {active ? "✓ " : "+ "}
                                    {s}
                                  </button>
                                );
                              })}
                            </div>
                            {errors.services && <span className="text-[11px] text-red-400 mt-1 block">{errors.services}</span>}
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block mb-1">
                              Tell us about the project · Eleza maelezo ya mradi *
                            </label>
                            <textarea
                              rows={4}
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="Eleza kile mradi unachotaka kufanya, ni nani watakaoutumia, na kama kuna mifumo mingine unayotaka iunganishwe (mf. M-Pesa, SMS)..."
                              className={`w-full bg-white/[0.06] border rounded-xl p-3.5 text-sm text-white focus:outline-none transition-colors ${
                                errors.message ? "border-red-400 focus:border-red-500" : "border-white/15 focus:border-viol"
                              }`}
                            />
                            {errors.message && <span className="text-[11px] text-red-400 mt-1 block">{errors.message}</span>}
                          </div>
                        </div>
                      )}

                      {/* ───── STEP 3: BUDGET & TIMELINE */}
                      {step === 3 && (
                        <div className="space-y-5">
                          <div>
                            <h2 className="text-xl font-bold font-grotesk text-white">Budget &amp; Timeline</h2>
                            <p className="text-xs text-white/50 mt-0.5">This helps us plan the right technology and scope for your investment level.</p>
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block mb-2">
                              Approximate Budget
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {BUDGET_OPTIONS.map((b) => (
                                <button
                                  key={b}
                                  type="button"
                                  onClick={() => setBudget(b)}
                                  className={`text-xs font-semibold px-4 py-2.5 rounded-full border transition-all ${
                                    budget === b
                                      ? "bg-viol border-viol text-white shadow-md shadow-viol/30"
                                      : "bg-white/[0.05] border-white/15 text-white/70 hover:border-white/30"
                                  }`}
                                >
                                  {b}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block mb-2">
                              Ideal Timeline
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {TIMELINE_OPTIONS.map((t) => (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => setTimeline(t)}
                                  className={`text-xs font-semibold px-4 py-2.5 rounded-full border transition-all ${
                                    timeline === t
                                      ? "bg-viol border-viol text-white shadow-md shadow-viol/30"
                                      : "bg-white/[0.05] border-white/15 text-white/70 hover:border-white/30"
                                  }`}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white/60 flex items-start gap-3">
                            <span className="text-base">💡</span>
                            <span>
                              Not sure about budget or timeline? No problem — choose &ldquo;Not sure yet&rdquo; and we&apos;ll figure it out together in your free first consultation.
                            </span>
                          </div>
                        </div>
                      )}

                      {/* ───── STEP 4: REVIEW & SEND */}
                      {step === 4 && (
                        <div className="space-y-4">
                          <div>
                            <h2 className="text-xl font-bold font-grotesk text-white">Review &amp; send</h2>
                            <p className="text-xs text-white/50 mt-0.5">Please confirm the details below are correct before submitting.</p>
                          </div>

                          <div className="divide-y divide-white/10 rounded-2xl border border-white/15 bg-white/[0.03] overflow-hidden text-xs">
                            {[
                              { label: "Name", val: name },
                              { label: "Email", val: email },
                              { label: "Phone", val: phone },
                              { label: "Company", val: company || "—" },
                              { label: "Services", val: selectedServices.join(", ") },
                              { label: "Budget", val: budget },
                              { label: "Timeline", val: timeline },
                              { label: "Message", val: message },
                            ].map(({ label, val }) => (
                              <div key={label} className="grid grid-cols-[100px_1fr] p-3 gap-2">
                                <span className="font-mono text-white/40 uppercase tracking-wider text-[10px] pt-0.5">
                                  {label}
                                </span>
                                <span className="text-white/90 break-words font-sans">{val}</span>
                              </div>
                            ))}
                          </div>

                          <p className="text-[11px] text-white/50 leading-relaxed pt-1">
                            By submitting, you agree to our{" "}
                            <Link href="/terms" className="text-violL underline hover:text-white">
                              Terms
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-violL underline hover:text-white">
                              Privacy Policy
                            </Link>
                            . Your data is stored securely and never shared.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* BOTTOM NAVIGATION BUTTONS */}
                  <div className="mt-8 flex items-center justify-between gap-4 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={back}
                      className={`text-xs font-semibold px-5 py-2.5 rounded-full border border-white/20 text-white/70 hover:border-white/40 hover:text-white transition-all ${
                        step === 1 ? "invisible" : ""
                      }`}
                    >
                      ← Back
                    </button>

                    {step < 4 ? (
                      <button
                        type="button"
                        onClick={next}
                        className="bg-viol hover:bg-violD text-white text-xs font-bold px-7 py-3 rounded-full transition-all shadow-lg shadow-viol/30 flex items-center gap-2"
                      >
                        <span>Continue</span>
                        <i className="fa-solid fa-arrow-right text-[10px]" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={sending}
                        className="bg-gradient-to-r from-viol to-green-500 hover:opacity-95 text-white text-xs font-bold px-8 py-3.5 rounded-full transition-all shadow-xl shadow-viol/40 flex items-center gap-2 disabled:opacity-50"
                      >
                        {sending ? (
                          <>
                            <i className="fa-solid fa-spinner fa-spin text-sm" />
                            <span>Sending brief...</span>
                          </>
                        ) : (
                          <>
                            <span>Send brief</span>
                            <i className="fa-solid fa-paper-plane text-xs" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}