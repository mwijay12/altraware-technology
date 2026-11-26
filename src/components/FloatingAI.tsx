"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useContent } from "@/components/providers";

/* ============================================================
   Floating AI assistant — "Altra"
   Integrated with live Inception Labs (Mercury-2.5) & Agnes AI
   (DeepSeek-V3), clean bold rendering without raw asterisks,
   data-lenis-prevent and wheel isolation to stop page scrolling.
   ============================================================ */

interface Msg {
  from: "user" | "ai";
  text: string;
  quick?: string[];
  provider?: string;
}

// Formats message text into clean React nodes with elegant bold tags and without raw markdown symbols
function FormattedMessage({ text }: { text: string }) {
  // Split into lines first
  const lines = text.split("\n");

  return (
    <div className="space-y-1.5 leading-relaxed">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={lineIdx} className="h-1" />;

        // Clean any leading markdown headers (### or ##)
        const cleanLine = trimmed.replace(/^#{1,4}\s*/, "");

        // Split by markdown bold markers (**text** or *text*)
        const parts = cleanLine.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);

        return (
          <p key={lineIdx} className="m-0">
            {parts.map((part, partIdx) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                const boldContent = part.slice(2, -2);
                return (
                  <strong key={partIdx} className="font-bold text-deep font-sans">
                    {boldContent}
                  </strong>
                );
              }
              if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
                const emContent = part.slice(1, -1);
                return (
                  <strong key={partIdx} className="font-semibold text-deep">
                    {emContent}
                  </strong>
                );
              }
              return <span key={partIdx}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}

export default function FloatingAI() {
  const pathname = usePathname();
  const { content } = useContent();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  // MOBILE PERF: defer the floating button until the browser is idle so it
  // never competes with LCP/FCP. Content is SSR'd underneath meanwhile.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const show = () => setMounted(true);
    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(show, { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(show, 1800);
    return () => window.clearTimeout(t);
  }, []);

  // greeting on first open
  useEffect(() => {
    if (open && !started.current) {
      started.current = true;
      setMsgs([
        {
          from: "ai",
          text: "Habari! Mimi ni Altra — msaidizi wa AI wa Altraware Technology. 💜\nNipo tayari kukujibu chochote kuhusu bei za tovuti (kuanzia TSh 350k), mifumo yetu (Faida POS & CareTrack), miradi tuliyotengeneza, au kukuunganisha moja kwa moja na David au Clemence kupitia WhatsApp!",
          quick: ["Bei za Tovuti & Mifumo?", "Nieleze kuhusu Faida POS", "CareTrack inafanyaje kazi?", "Wasiliana WhatsApp"],
        },
      ]);
    }
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  // Early returns AFTER all hooks (rules-of-hooks + deferred mount).
  if (pathname?.startsWith("/admin")) {
    return null;
  }
  if (!mounted) return null;

  const send = async (text: string) => {
    const q = text.trim();
    if (!q) return;

    // Special quick action for WhatsApp
    if (q === "Wasiliana WhatsApp" || q === "Talk to human") {
      setMsgs((m) => [...m, { from: "user", text: q }]);
      window.open(
        "https://wa.me/255792867427?text=" +
          encodeURIComponent("Habari Altraware, nina swali kuhusu mifumo au tovuti zenu."),
        "_blank"
      );
      setMsgs((m) => [
        ...m,
        {
          from: "ai",
          text: "Nimefungua WhatsApp yako kukuunganisha na waasisi (David & Clemence)! Unaweza pia kuendelea kuuliza maswali hapa.",
          quick: ["Bei za Tovuti & Mifumo?", "Nieleze kuhusu Faida POS"],
        },
      ]);
      return;
    }

    const newMsgs: Msg[] = [...msgs, { from: "user", text: q }];
    setMsgs(newMsgs);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: q,
          history: newMsgs.slice(-6),
        }),
      });

      if (!res.ok) throw new Error("Chat request failed");

      const data = await res.json();
      setMsgs((m) => [
        ...m,
        {
          from: "ai",
          text: data.reply,
          provider: data.provider,
          quick: ["Wasiliana WhatsApp", "Bei za Tovuti & Mifumo?", "Nieleze kuhusu Faida POS"],
        },
      ]);
    } catch (err) {
      console.warn("AI endpoint error, using smart local fallback", err);
      // Fallback
      setMsgs((m) => [
        ...m,
        {
          from: "ai",
          text: "Altraware inajenga tovuti kuanzia TSh 350,000 (Web Starter), 550,000 (Growth), na 750,000 (Pro CMS). Mifumo kama Faida POS na CareTrack inaanzia 1.85M na inafanya kazi hata bila intaneti. Bofya kitufe cha kijani cha WhatsApp hapa chini kuwasiliana nasi sasa hivi!",
          quick: ["Wasiliana WhatsApp", "Bei za Tovuti & Mifumo?"],
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      {/* Floating launcher button (z-[120] to be above navbar) */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed z-[120] w-14 h-14 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center text-white ${
          open
            ? "bg-deep rotate-90"
            : "bg-gradient-to-br from-viol to-violD shadow-viol/40 hover:scale-110 active:scale-95"
        }`}
        style={{ bottom: "24px", right: "24px" }}
        aria-label="Open AI assistant"
      >
        <i className={`fa-solid ${open ? "fa-xmark text-xl" : "fa-wand-magic-sparkles text-xl"}`} />
        {!open && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white" />
          </span>
        )}
      </button>

      {/* Chat modal panel (z-[125] securely on top of everything) */}
      {open && (
        <div
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          className="fixed z-[125] bottom-[92px] right-4 md:right-6 w-[calc(100vw-32px)] max-w-[390px] bg-white rounded-3xl shadow-2xl border border-deep/15 overflow-hidden flex flex-col transition-all max-h-[82vh] overscroll-contain"
          style={{ animation: "chatIn .3s cubic-bezier(.2,.8,.2,1)" }}
        >
          {/* Header */}
          <div className="bg-deep text-white px-5 py-4 flex items-center gap-3 relative overflow-hidden shrink-0">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-viol/40 blur-2xl rounded-full pointer-events-none" />
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-viol to-violL flex items-center justify-center shrink-0 relative shadow-inner">
              <i className="fa-solid fa-wand-magic-sparkles text-sm" />
            </div>
            <div className="relative">
              <div className="font-grotesk font-bold text-sm">Altra — Live AI Assistant</div>
              <div className="text-[11px] text-white/70 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Mercury-2.5 & DeepSeek · Online
              </div>
            </div>

            {/* WhatsApp Direct Header Link */}
            <a
              href="https://wa.me/255792867427?text=Habari%20Altraware%2C%20nina%20swali%20kuhusu%20huduma%20zenu."
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto mr-1.5 w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center text-sm shadow transition-transform hover:scale-110"
              title="Chat WhatsApp na Waasisi"
            >
              <i className="fa-brands fa-whatsapp" />
            </a>

            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Close chat"
            >
              <i className="fa-solid fa-xmark text-sm" />
            </button>
          </div>

          {/* Chat Messages Body - Scroll isolated with data-lenis-prevent */}
          <div
            ref={bodyRef}
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-cream/70 text-deep text-[13px] leading-relaxed max-h-[380px] min-h-[260px] overscroll-contain select-text"
          >
            {msgs.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.from === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[88%] px-4 py-3 rounded-2xl shadow-sm ${
                    m.from === "user"
                      ? "bg-deep text-white rounded-br-sm"
                      : "bg-white border border-deep/10 text-deep rounded-bl-sm"
                  }`}
                >
                  <FormattedMessage text={m.text} />
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="bg-white border border-deep/10 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-2 shadow-sm">
                  <span className="text-[11px] text-deep/50 font-medium">Altra is typing</span>
                  <div className="flex gap-1">
                    {[0, 0.15, 0.3].map((d) => (
                      <span
                        key={d}
                        className="w-1.5 h-1.5 rounded-full bg-viol animate-bounce"
                        style={{ animationDelay: `${d}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick reply tags */}
          {msgs.length > 0 && msgs[msgs.length - 1].quick && !typing && (
            <div className="px-3.5 py-2 flex flex-wrap gap-1.5 bg-cream/90 border-t border-deep/5 shrink-0">
              {msgs[msgs.length - 1].quick!.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm ${
                    q.includes("WhatsApp")
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "text-viol bg-white border border-viol/20 hover:bg-viol hover:text-white"
                  }`}
                >
                  {q.includes("WhatsApp") && <i className="fa-brands fa-whatsapp text-xs" />}
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* WhatsApp Direct Action Bar */}
          <div className="px-4 py-2 bg-emerald-50 border-t border-emerald-100 flex items-center justify-between shrink-0">
            <span className="text-[11px] font-semibold text-emerald-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Unahitaji jibu la haraka?
            </span>
            <a
              href="https://wa.me/255792867427?text=Habari%20Altraware%2C%20ninaongea%20na%20AI%20yenu%20na%20ningependa%20kuwasiliana%20nanyi."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded-full shadow-sm transition-all"
            >
              <i className="fa-brands fa-whatsapp" />
              Chat WhatsApp
            </a>
          </div>

          {/* Input Form */}
          <form
            className="p-3 border-t border-deep/10 bg-white flex gap-2 shrink-0 items-center"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Uliza chochote kwa Kiswahili au English..."
              className="flex-1 bg-cream border border-deep/15 rounded-full px-4 py-2.5 text-[13px] focus:border-viol focus:bg-white outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="w-10 h-10 rounded-full bg-viol text-white flex items-center justify-center hover:bg-violD disabled:opacity-40 disabled:hover:bg-viol transition-colors shrink-0 shadow-md"
              aria-label="Send"
            >
              <i className="fa-solid fa-paper-plane text-xs" />
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes chatIn {
          from { opacity: 0; transform: translateY(16px) scale(.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}