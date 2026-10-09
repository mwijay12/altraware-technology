"use client";

import { useEffect, useMemo, useState } from "react";
import { TransitionLink } from "@/components/Navbar";
import { Reveal, TiltCard } from "@/components/motion";
import { useContent, useNotify } from "@/components/providers";
import { TextEffect } from "@/components/ui/text-effect";

/* ============================================================
   PLATFORMS page — Faida POS live demo + CareTrack live demo
   ============================================================ */

interface PosProduct {
  id: number;
  sw: string;
  en: string;
  price: number;
  icon: string;
  c: string;
}

const POS_PRODUCTS: PosProduct[] = [
  { id: 1, sw: "Chai ya Maziwa", en: "Milk Tea", price: 1500, icon: "fa-mug-hot", c: "bg-amber-100 text-amber-700" },
  { id: 2, sw: "Mandazi (3)", en: "Mandazi", price: 1000, icon: "fa-cookie", c: "bg-orange-100 text-orange-700" },
  { id: 3, sw: "Chapati Maharage", en: "Chapati & Beans", price: 3000, icon: "fa-bowl-food", c: "bg-yellow-100 text-yellow-700" },
  { id: 4, sw: "Pilau Nyama", en: "Beef Pilau", price: 5000, icon: "fa-plate-wheat", c: "bg-red-100 text-red-700" },
  { id: 5, sw: "Soda Baridi", en: "Cold Soda", price: 2000, icon: "fa-bottle-water", c: "bg-sky-100 text-sky-700" },
  { id: 6, sw: "Maji Dawa", en: "Water 500ml", price: 1000, icon: "fa-glass-water", c: "bg-cyan-100 text-cyan-700" },
];

const KIDS = [
  { n: "Amina Juma", a: "4 yrs", g: "Mama Zuhura", img: "https://i.pravatar.cc/80?img=32" },
  { n: "Baraka Moyo", a: "5 yrs", g: "Baba Elisha", img: "https://i.pravatar.cc/80?img=12" },
  { n: "Zawadi Kimaro", a: "3 yrs", g: "Mama Neema", img: "https://i.pravatar.cc/80?img=45" },
  { n: "Juma Hassan", a: "6 yrs", g: "Baba Hassan", img: "https://i.pravatar.cc/80?img=59" },
  { n: "Rehema Said", a: "4 yrs", g: "Mama Asha", img: "https://i.pravatar.cc/80?img=47" },
  { n: "David Mushi", a: "5 yrs", g: "Baba Paulo", img: "https://i.pravatar.cc/80?img=53" },
  { n: "Neema Lyimo", a: "3 yrs", g: "Mama Joyce", img: "https://i.pravatar.cc/80?img=26" },
  { n: "Elisha Temba", a: "6 yrs", g: "Baba Temba", img: "https://i.pravatar.cc/80?img=68" },
];

const fmt = (n: number) => "TSh " + n.toLocaleString("en-US");

export default function PlatformsPage() {
  const { content } = useContent();
  const { notify } = useNotify();
  const [tab, setTab] = useState<"faida" | "care">("faida");

  return (
    <div className="pt-[120px]">
      {/* HERO */}
      <section className="bg-deep text-white relative overflow-hidden">
        <div className="noise-blue absolute inset-0" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-viol/20 blur-[140px] rounded-full" />
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-16 md:py-24 relative text-center">
          <Reveal>
            <div className="eyebrow text-violL mb-4">Interactive Platforms</div>
            <h1 className="display text-5xl md:text-7xl font-medium">
              <span className="block">
                <TextEffect as="span" per="word" preset="fade">
                  Don&apos;t take our word.
                </TextEffect>
              </span>
              <i className="text-violL block mt-1">
                <TextEffect as="span" per="word" preset="blur" delay={0.25}>
                  Touch the software.
                </TextEffect>
              </i>
            </h1>
            <p className="text-white/60 mt-5 max-w-xl mx-auto text-[15px]">
              Two live, clickable demos — a retail checkout and a care-centre dashboard. Built the Altraware way:
              Kiswahili-first, offline-ready, M-Pesa native.
            </p>
            <div className="flex flex-col items-center gap-4 mt-8">
              <div className="inline-flex gap-2 bg-white/5 border border-white/10 rounded-full p-1.5">
                <button
                  className={`tab-btn px-6 py-2.5 rounded-full text-sm font-bold border border-transparent ${tab === "faida" ? "active" : ""}`}
                  onClick={() => setTab("faida")}
                >
                  <i className="fa-solid fa-cash-register mr-2" />Faida POS
                </button>
                <button
                  className={`tab-btn px-6 py-2.5 rounded-full text-sm font-bold border border-transparent ${tab === "care" ? "active" : ""}`}
                  onClick={() => setTab("care")}
                >
                  <i className="fa-solid fa-heart-pulse mr-2" />CareTrack
                </button>
              </div>

              {/* Live production shortcuts */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
                {tab === "faida" ? (
                  <>
                    <a
                      href="https://faida-hq.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full border border-white/15 transition-all font-semibold"
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-violL" />
                      Faida Web App (faida-hq.vercel.app)
                    </a>
                    <a
                      href="https://github.com/mwijay12/faida-pos-releases/releases/download/Faida/faida.pos.apk"
                      className="inline-flex items-center gap-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-300 px-4 py-2 rounded-full border border-green-500/30 transition-all font-semibold"
                    >
                      <i className="fa-brands fa-android text-[12px]" />
                      Download Faida Flutter APK
                    </a>
                  </>
                ) : (
                  <a
                    href="https://caretrack-six.vercel.app/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full border border-white/15 transition-all font-semibold"
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-violL" />
                    Fungua CareTrack Live System
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* DEMO AREA */}
      <section className="bg-deep text-white relative overflow-hidden pb-24">
        <div className="noise-blue absolute inset-0" />
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 relative">
          {tab === "faida" ? <FaidaDemo notify={notify} /> : <CareDemo notify={notify} />}
        </div>
      </section>

      {/* PLATFORM DETAIL CARDS */}
      <section className="bg-cream py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 space-y-8">
          {content.platforms.map((p, i) => (
            <Reveal key={p.id}>
              <div id={p.id} className={`grid lg:grid-cols-2 gap-8 items-center ${i % 2 ? "lg:[direction:rtl]" : ""}`}>
                <div className="[direction:ltr]">
                  <div className="text-[11px] tracking-widest font-grotesk text-viol font-bold">{p.audience}</div>
                  <h2 className="display text-4xl md:text-5xl font-medium mt-2">{p.name}</h2>
                  <p className="text-deep/65 mt-4 leading-relaxed">{p.description}</p>
                  <ul className="mt-6 space-y-2.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm text-deep/75">
                        <span className="w-6 h-6 rounded-lg bg-viol/10 text-viol flex items-center justify-center text-[10px]">
                          <i className="fa-solid fa-check" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Direct System Links */}
                  <div className="flex flex-wrap items-center gap-3 mt-8">
                    {p.webUrl && (
                      <a
                        href={p.webUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-deep text-white px-5 py-3 rounded-full text-xs font-bold hover:bg-viol transition-all shadow-sm"
                      >
                        <i className="fa-solid fa-arrow-up-right-from-square text-[11px]" />
                        Open Live Web App
                      </a>
                    )}
                    {p.apkUrl && (
                      <a
                        href={p.apkUrl}
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-full text-xs font-bold hover:bg-green-700 transition-all shadow-sm"
                      >
                        <i className="fa-brands fa-android text-sm" />
                        Download Android APK (Flutter)
                      </a>
                    )}
                    {p.repoUrl && (
                      <a
                        href={p.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-zinc-900 text-white px-5 py-3 rounded-full text-xs font-bold hover:bg-black transition-all shadow-sm"
                      >
                        <i className="fa-brands fa-github text-sm" />
                        GitHub Repository & Releases
                      </a>
                    )}
                    <TransitionLink
                      href="/contact"
                      className="inline-flex items-center gap-2 border border-deep/20 text-deep px-5 py-3 rounded-full text-xs font-bold hover:border-viol hover:text-viol transition-all"
                    >
                      Talk to us about {p.name}
                    </TransitionLink>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 [direction:ltr]">
                  {p.stats.map((s) => (
                    <TiltCard key={s.label} intensity={8} className="bg-white border border-deep/10 rounded-2xl p-6 text-center">
                      <div className="font-grotesk font-bold text-3xl text-viol">{s.value}</div>
                      <div className="text-xs text-deep/55 mt-1">{s.label}</div>
                    </TiltCard>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20 border-t border-line">
        <div className="max-w-[900px] mx-auto px-5 text-center">
          <Reveal>
            <h2 className="display text-4xl md:text-6xl font-medium">
              Want this running in <i className="text-viol">your business</i> or centre?
            </h2>
            <p className="text-deep/60 mt-4 max-w-md mx-auto">
              Faida POS and CareTrack are deployed, tailored and supported — from TSh 8M, installed in weeks.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="mt-8">
            <TransitionLink href="/contact" className="btn-magnetic inline-flex items-center gap-2 bg-deep text-white px-8 py-4 rounded-full font-bold text-sm">
              Book a demo at your premises <i className="fa-solid fa-arrow-right text-xs" />
            </TransitionLink>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   Faida POS demo
   ============================================================ */

function FaidaDemo({ notify }: { notify: (m: string, k?: "info" | "success" | "error") => void }) {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [payMethod, setPayMethod] = useState("M-PESA");
  const [sw, setSw] = useState(true);
  const [modal, setModal] = useState<null | "processing" | "success">(null);
  const [receiptNo, setReceiptNo] = useState(8241);
  const [receiptTime, setReceiptTime] = useState("");
  const [finalAmt, setFinalAmt] = useState("");
  const [finalMethod, setFinalMethod] = useState("M-PESA");

  useEffect(() => {
    setReceiptTime(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
  }, []);

  const sub = useMemo(() => Object.entries(cart).reduce((s, [id, q]) => s + (POS_PRODUCTS.find((p) => p.id === +id)?.price ?? 0) * q, 0), [cart]);
  const vat = Math.round(sub * 0.18);
  const total = sub + vat;

  const add = (id: number) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const dec = (id: number) =>
    setCart((c) => {
      const next = { ...c };
      next[id]--;
      if (next[id] <= 0) delete next[id];
      return next;
    });

  const checkout = () => {
    if (total === 0) {
      notify("Cart is empty — add items first", "error");
      return;
    }
    setFinalAmt(fmt(total));
    setFinalMethod(payMethod);
    setModal("processing");
    window.setTimeout(() => {
      setModal("success");
      notify("Payment successful ✓ · SMS receipt sent", "success");
    }, 3200);
  };

  const done = () => {
    setModal(null);
    setCart({});
    setReceiptNo(Math.floor(8000 + Math.random() * 1999));
    notify("Sale complete ✓ · New sale started");
  };

  return (
    <>
      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        {/* POS grid */}
        <div className="bg-white text-deep rounded-3xl p-5 md:p-7 shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-deep text-white flex items-center justify-center font-bold">F</div>
              <div>
                <div className="font-grotesk font-bold">Faida POS</div>
                <div className="text-[11px] text-deep/50 font-mono">
                  Duka la Neema · Kariakoo · <span className="text-green-600 font-bold">● Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                className="bg-deep/5 border border-deep/10 px-3 py-1.5 rounded-full font-bold hover:border-viol transition-colors"
                onClick={() => {
                  setSw(!sw);
                  notify(sw ? "Faida: English ✓" : "Faida: Kiswahili ✓");
                }}
              >
                SW / EN
              </button>
              <span className="hidden sm:inline bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full font-bold">
                <i className="fa-solid fa-wifi mr-1" />Offline-ready
              </span>
            </div>
          </div>
          <div className="text-[11px] font-grotesk font-bold tracking-widest text-deep/40 mb-3">
            TAP ITEMS TO ADD — GUSA BIDHAA KUWEKA
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {POS_PRODUCTS.map((p) => {
              const qty = cart[p.id] ?? 0;
              return (
                <button
                  key={p.id}
                  className="pos-item bg-[#F7F6F2] border-2 border-transparent rounded-2xl p-4 relative text-left"
                  onClick={() => add(p.id)}
                >
                  {qty > 0 && (
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-viol text-white text-xs font-bold flex items-center justify-center shadow">
                      ×{qty}
                    </span>
                  )}
                  <div className={`w-11 h-11 rounded-xl ${p.c} flex items-center justify-center text-lg`}>
                    <i className={`fa-solid ${p.icon}`} />
                  </div>
                  <div className="font-bold text-sm mt-2.5">{sw ? p.sw : p.en}</div>
                  <div className="font-mono text-[13px] text-viol font-bold mt-0.5">{fmt(p.price)}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Receipt panel */}
        <div className="bg-[#0D1E45] border border-white/10 rounded-3xl p-6 flex flex-col shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="font-grotesk font-bold text-lg">
              <i className="fa-solid fa-receipt mr-2 text-violL" />
              Receipt
            </div>
            <button className="text-xs text-white/40 hover:text-red-400 transition-colors underline" onClick={() => setCart({})}>
              clear
            </button>
          </div>
          <div className="text-[11px] font-mono text-white/40 mt-1">#FD-{receiptNo} · {receiptTime} · Cashier: Neema</div>
          <div className="flex-1 mt-4 space-y-2.5 min-h-[180px] max-h-[260px] overflow-y-auto pr-1">
            {Object.keys(cart).length === 0 && (
              <div className="text-center text-white/30 py-10 text-sm">
                <i className="fa-solid fa-basket-shopping text-3xl mb-3 block opacity-40" />
                Cart is empty — tap items to start a sale
              </div>
            )}
            {Object.entries(cart).map(([id, q]) => {
              const p = POS_PRODUCTS.find((x) => x.id === +id)!;
              return (
                <div key={id} className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold truncate">{sw ? p.sw : p.en}</div>
                    <div className="text-[11px] text-white/40 font-mono">{fmt(p.price)} each</div>
                  </div>
                  <button className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold" onClick={() => dec(p.id)}>−</button>
                  <span className="font-bold text-sm w-5 text-center">{q}</span>
                  <button className="w-7 h-7 rounded-lg bg-viol text-xs font-bold" onClick={() => add(p.id)}>+</button>
                </div>
              );
            })}
          </div>
          <div className="border-t border-dashed border-white/15 mt-4 pt-4 space-y-1.5 text-sm">
            <div className="flex justify-between text-white/60"><span>Subtotal</span><span className="font-mono">{fmt(sub)}</span></div>
            <div className="flex justify-between text-white/60"><span>VAT (18%)</span><span className="font-mono">{fmt(vat)}</span></div>
            <div className="flex justify-between font-grotesk font-bold text-xl pt-1">
              <span>Total</span><span className="text-violL">{fmt(total)}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {["M-PESA", "TIGO PESA", "CASH"].map((m) => (
              <button
                key={m}
                className={`pay-btn border border-white/15 rounded-xl py-2.5 text-xs font-bold transition-all ${payMethod === m ? "active" : ""}`}
                onClick={() => setPayMethod(m)}
              >
                {m === "TIGO PESA" ? "TIGO" : m}
              </button>
            ))}
          </div>
          <button
            className="mt-3 w-full bg-viol hover:bg-violD transition-colors rounded-xl py-4 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-viol/30"
            onClick={checkout}
          >
            <i className="fa-solid fa-lock" /> CHARGE {fmt(total)}
          </button>
          <div className="mt-3 text-center text-[11px] text-white/40">STK push simulation · No real charge</div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid sm:grid-cols-4 gap-3 mt-6 text-center">
        {[
          { v: "0.8s", l: "avg. sale checkout" },
          { v: "100%", l: "works offline" },
          { v: "3×", l: "faster stock-take" },
          { v: "SMS", l: "daily report to owner" },
        ].map((s) => (
          <div key={s.l} className="glass rounded-2xl p-4">
            <div className="font-grotesk font-bold text-2xl text-violL">{s.v}</div>
            <div className="text-xs text-white/55">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Payment modal */}
      {modal && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-deep3/80 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative bg-white text-deep rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            {modal === "processing" ? (
              <div>
                <div className="w-16 h-16 rounded-full bg-viol/10 mx-auto flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full border-4 border-viol/20 border-t-viol animate-spin" />
                </div>
                <div className="font-grotesk font-bold text-xl mt-4">Sending STK push...</div>
                <p className="text-sm text-deep/55 mt-2">
                  Check <span className="font-mono font-bold">+255 7** *** 210</span> and enter your {finalMethod} PIN to pay{" "}
                  <span className="font-bold">{finalAmt}</span>
                </p>
                <div className="flex justify-center gap-2 mt-4">
                  {[0, 0.15, 0.3].map((d) => (
                    <span key={d} className="w-3 h-3 rounded-full bg-viol animate-bounce" style={{ animationDelay: `${d}s` }} />
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="w-20 h-20 rounded-full bg-green-500 text-white flex items-center justify-center text-3xl mx-auto shadow-lg shadow-green-500/40">
                  <i className="fa-solid fa-check" />
                </div>
                <div className="font-grotesk font-bold text-2xl mt-4">Payment successful! ✓</div>
                <p className="text-sm text-deep/55 mt-2">Receipt #FD-{receiptNo} · SMS sent to customer</p>
                <button className="mt-4 w-full bg-deep text-white font-bold py-3.5 rounded-xl hover:bg-viol transition-colors" onClick={done}>
                  New sale
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================
   CareTrack demo
   ============================================================ */

function CareDemo({ notify }: { notify: (m: string, k?: "info" | "success" | "error") => void }) {
  const [present, setPresent] = useState<Set<number>>(new Set([0, 2, 4]));
  const [search, setSearch] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [chart, setChart] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setChart(true), 400);
    return () => clearTimeout(t);
  }, []);

  const toggle = (i: number, name: string, guardian: string, wasPresent: boolean) => {
    setPresent((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
    if (!wasPresent) notify(`SMS → ${guardian}: ${name} amefika ✓`, "success");
  };

  const filtered = KIDS.filter((k) => k.n.toLowerCase().includes(search.toLowerCase()));
  const vals = [72, 88, 64, 95, 82, 45];

  return (
    <>
      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        {/* Sidebar */}
        <div className="bg-white text-deep rounded-3xl p-5 shadow-2xl hidden lg:block">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-viol text-white flex items-center justify-center">
              <i className="fa-solid fa-heart-pulse" />
            </div>
            <div>
              <div className="font-grotesk font-bold text-sm">CareTrack</div>
              <div className="text-[10px] text-deep/50">Tumaini Centre · Mbagala</div>
            </div>
          </div>
          <div className="space-y-1 text-sm font-medium">
            <div className="bg-deep text-white rounded-xl px-4 py-2.5 flex items-center gap-2.5"><i className="fa-solid fa-grid-2 text-xs" /> Dashboard</div>
            <div className="px-4 py-2.5 text-deep/55 flex items-center gap-2.5 hover:bg-deep/5 rounded-xl cursor-pointer transition-colors">
              <i className="fa-solid fa-children text-xs" /> Children
              <span className="ml-auto text-[10px] bg-viol/10 text-viol font-bold px-2 py-0.5 rounded-full">48</span>
            </div>
            <div className="px-4 py-2.5 text-deep/55 flex items-center gap-2.5 hover:bg-deep/5 rounded-xl cursor-pointer transition-colors"><i className="fa-solid fa-calendar-check text-xs" /> Attendance</div>
            <div className="px-4 py-2.5 text-deep/55 flex items-center gap-2.5 hover:bg-deep/5 rounded-xl cursor-pointer transition-colors"><i className="fa-solid fa-notes-medical text-xs" /> Health notes</div>
            <div className="px-4 py-2.5 text-deep/55 flex items-center gap-2.5 hover:bg-deep/5 rounded-xl cursor-pointer transition-colors"><i className="fa-solid fa-file-invoice text-xs" /> Fees</div>
          </div>
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-3 text-xs">
            <div className="font-bold text-green-800 flex items-center gap-1.5"><i className="fa-solid fa-shield-halved" /> Privacy by design</div>
            <div className="text-green-700/70 mt-1">Role-based access · Audit log · Encrypted</div>
          </div>
        </div>

        {/* Main dashboard */}
        <div className="bg-white text-deep rounded-3xl p-5 md:p-7 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <div className="font-grotesk font-bold text-lg">
                Today <span className="text-deep/40 font-sans font-normal text-sm">
                  {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })}
                </span>
              </div>
              <div className="text-xs text-deep/50">Click a child to toggle attendance — data syncs when online</div>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-deep/30 text-xs" />
                <input
                  placeholder="Search child..."
                  className="border border-deep/15 rounded-full pl-9 pr-4 py-2 text-sm w-44 transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                className="bg-deep text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 hover:bg-viol transition-colors"
                onClick={() => {
                  setSyncing(true);
                  window.setTimeout(() => {
                    setSyncing(false);
                    notify("CareTrack synced ✓ · 8 records backed up", "success");
                  }, 1400);
                }}
              >
                <i className={`fa-solid fa-rotate ${syncing ? "animate-spin" : ""}`} /> {syncing ? "Syncing..." : "Synced"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-deep text-white rounded-2xl p-4">
              <div className="text-[10px] tracking-widest opacity-60 font-grotesk">PRESENT</div>
              <div className="font-grotesk font-bold text-3xl">{present.size}<span className="text-sm opacity-50">/8</span></div>
              <div className="h-1.5 bg-white/15 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-green-400 rounded-full transition-all duration-700" style={{ width: `${(present.size / 8) * 100}%` }} />
              </div>
            </div>
            <div className="bg-paper border border-deep/10 rounded-2xl p-4">
              <div className="text-[10px] tracking-widest text-deep/40 font-grotesk">MEALS LOGGED</div>
              <div className="font-grotesk font-bold text-3xl">3<span className="text-sm text-deep/40">/3</span></div>
              <div className="text-[11px] text-deep/50 mt-1">✓ breakfast · lunch · snack</div>
            </div>
            <div className="bg-viol/10 border border-viol/20 rounded-2xl p-4">
              <div className="text-[10px] tracking-widest text-viol/70 font-grotesk">GUARDIAN SMS</div>
              <div className="font-grotesk font-bold text-3xl text-viol">{present.size}</div>
              <div className="text-[11px] text-deep/50 mt-1">pickup alerts queued</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-2.5">
            {filtered.map((k) => {
              const i = KIDS.indexOf(k);
              const on = present.has(i);
              return (
                <button
                  key={k.n}
                  className={`flex items-center gap-3 border-2 rounded-2xl p-3 cursor-pointer transition-all hover:shadow-md text-left ${
                    on ? "border-green-400 bg-green-50/60" : "border-deep/10 bg-white hover:border-viol"
                  }`}
                  onClick={() => toggle(i, k.n, k.g, on)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={k.img} className={`w-11 h-11 rounded-full object-cover border-2 ${on ? "border-green-400" : "border-deep/10"}`} alt={k.n} loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold truncate">{k.n}</div>
                    <div className="text-[11px] text-deep/45">{k.a} · {k.g}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1.5 rounded-full ${on ? "bg-green-500 text-white" : "bg-deep/5 text-deep/40"}`}>
                    {on ? "✓ IN" : "ABSENT"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 bg-paper border border-deep/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-grotesk font-bold tracking-widest text-deep/50">WEEKLY ATTENDANCE</div>
              <div className="text-[11px] text-green-700 font-bold bg-green-100 px-2.5 py-1 rounded-full">▲ +12% vs last week</div>
            </div>
            <div className="flex items-end gap-2 h-24">
              {vals.map((v, i) => (
                <div key={i} className={`flex-1 rounded-t-lg ${i === 3 ? "bg-viol" : "bg-deep/15"}`} style={{ height: chart ? `${v}%` : "4%", transitionDelay: `${i * 120}ms` }} title={v + "%"} />
              ))}
            </div>
            <div className="flex gap-2 mt-2 text-[10px] font-grotesk text-deep/40">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <span key={d} className="flex-1 text-center">{d}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}