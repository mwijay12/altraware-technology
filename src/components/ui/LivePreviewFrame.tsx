"use client";

import { useEffect, useRef, useState } from "react";

type DemoItem = {
  id: string;
  name: string;
  badge: string;
  url: string;
  subtitle: string;
  posterImage: string;
};

const DEMOS: DemoItem[] = [
  {
    id: "faida",
    name: "Faida POS (FaidaHQ)",
    badge: "Retail OS · Web & Flutter",
    url: "https://faida-hq.vercel.app/",
    subtitle: "Enterprise retail operating system — POS terminal, multi-branch inventory, profit analytics, and M-Pesa integration.",
    posterImage: "https://res.cloudinary.com/oc8018um/image/upload/v1791497492/faidahq.png",
  },
];

type Props = {
  liveUrl?: string;
  posterImage?: string;
  posterVideo?: string;
  title?: string;
  status?: "Live" | "In progress" | "Production";
};

export default function LivePreviewFrame({
  liveUrl: initialUrl = "https://faida-hq.vercel.app/",
  title = "Faida POS (FaidaHQ) Web Demo",
  status = "Live",
}: Props) {
  const [selectedDemo] = useState<DemoItem>(DEMOS[0]);
  const [mode, setMode] = useState<"poster" | "live">("poster");
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showBlockedHint, setShowBlockedHint] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeUrl = selectedDemo ? selectedDemo.url : initialUrl;

  useEffect(() => {
    if (mode !== "live") return;
    setIframeLoaded(false);
    setShowBlockedHint(false);
    timeoutRef.current = setTimeout(() => setShowBlockedHint(true), 6000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [mode, activeUrl]);

  const goLive = () => setMode("live");
  const goPoster = () => setMode("poster");

  return (
    <div
      data-no-cursor="true"
      className="no-custom-cursor overflow-hidden rounded-2xl md:rounded-3xl border-2 border-deep/15 bg-[#0a1735] shadow-2xl transition-all"
    >
      {/* Top Browser Header */}
      <div className="border-b border-white/10 bg-[#071126] px-3.5 md:px-5 py-2.5 md:py-3 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Window Controls & URL Bar */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex gap-1.5 shrink-0">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            </span>
            <div className="flex items-center gap-1.5 truncate rounded-full bg-white/10 px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-mono text-white/80 border border-white/10">
              <i className="fa-solid fa-lock text-[9px] text-emerald-400" />
              <span className="truncate">{activeUrl.replace("https://", "")}</span>
            </div>
          </div>

          {/* Status Badge & Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              INTERACTIVE DEMO (LIVE)
            </span>
            {mode === "live" ? (
              <button
                type="button"
                onClick={goPoster}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white transition hover:bg-white/20"
              >
                ✕ Exit Demo
              </button>
            ) : (
              <a
                href={activeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-viol/40 bg-viol/20 hover:bg-viol px-3 py-1 text-[11px] font-semibold text-white transition shadow-sm"
              >
                Open in Tab <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" />
              </a>
            )}
          </div>
        </div>
      </div>

      {mode === "poster" ? (
        <div className="group relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-[#0c1b3a] via-[#10265c] to-[#071120]">
          {/* Background Screenshot */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedDemo.posterImage}
            alt={selectedDemo.name}
            className="absolute inset-0 h-full w-full object-cover opacity-35 mix-blend-luminosity scale-100 group-hover:scale-105 transition-transform duration-700"
          />

          {/* Vignette Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050B14]/95 via-[#050B14]/50 to-[#050B14]/20" />

          {/* Center Call to Action Card */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
            <div className="rounded-2xl border border-white/15 bg-deep/90 backdrop-blur-xl p-5 md:p-7 shadow-2xl max-w-lg w-full">
              <div className="inline-flex items-center gap-2 rounded-full border border-viol/40 bg-viol/20 px-3.5 py-1 text-[11px] font-bold text-violL mb-3">
                <i className="fa-solid fa-play text-[9px]" /> LIVE SYSTEM DEMO
              </div>

              <h3 className="text-white font-grotesk font-bold text-lg md:text-2xl">
                Experience {selectedDemo.name}
              </h3>
              <p className="text-white/70 text-xs md:text-sm mt-2 mb-5 leading-relaxed">
                {selectedDemo.subtitle} Test real POS checkout, products catalog, and transactions right inside this sandbox without leaving the page.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={goLive}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-viol hover:bg-violD text-white px-5 py-3 text-xs md:text-sm font-bold shadow-lg shadow-viol/40 transition-all hover:scale-105"
                >
                  <i className="fa-solid fa-desktop text-xs" />
                  <span>Launch Interactive Sandbox</span>
                </button>

                <a
                  href={activeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white px-4 py-3 text-xs md:text-sm font-semibold transition-all"
                >
                  <span>Open Full Screen</span>
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Live Interactive Iframe Mode — clean native mouse interaction */
        <div data-no-cursor="true" className="no-custom-cursor relative aspect-[4/3] sm:aspect-[16/10] w-full bg-[#050B14]">
          {!iframeLoaded && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#050B14]">
              <span className="h-9 w-9 animate-spin rounded-full border-2 border-white/20 border-t-violL" />
              <p className="text-xs text-white/60 font-grotesk tracking-wide">
                Loading live environment for {selectedDemo.name}…
              </p>
            </div>
          )}

          <iframe
            src={activeUrl}
            title={`${selectedDemo.name} live interactive demo`}
            className="h-full w-full border-0 no-custom-cursor"
            loading="lazy"
            onLoad={() => setIframeLoaded(true)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            referrerPolicy="no-referrer"
          />

          {showBlockedHint && (
            <div className="absolute bottom-3 left-1/2 z-20 w-[94%] -translate-x-1/2 rounded-xl border border-white/10 bg-[#050B14]/95 px-4 py-2.5 text-center text-xs text-white/80 backdrop-blur shadow-xl">
              If your browser restricts embedded frames —{" "}
              <a
                href={activeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-violL underline"
              >
                Click here to open directly
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
