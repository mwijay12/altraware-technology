"use client";

import { useEffect, useRef, useState } from "react";

/* ============================================================
   PRICE FLOW — a price that counts itself up, once
   ============================================================
   The previous implementation wrapped `@number-flow/react`, which is a
   web component: during SSR it emits a 0–9 digit strip and only rolls to
   the real value after hydration. Server-rendered and no-JS pages showed

       $012345678901234567890123456789

   That is a pricing page advertising "the price" as a keyboard mash. It
   also cannot be fixed from the call site — v0.6.2 exposes no
   initial-value prop.

   This does the same job with no dependency: the server renders the real
   final price, and the browser animates *from* a smaller number on first
   view. If JS never runs, or the reader prefers reduced motion, the price
   is already correct and stays put.

   The animation is a plain rAF tween over 900ms on an ease-out curve —
   cheap enough to run for six cards at once and impossible to jank.
   ============================================================ */

export default function PriceFlow({
  value,
  className = "",
  duration = 900,
}: {
  value: number;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") return;

    const run = () => {
      if (started.current) return;
      started.current = true;

      const from = Math.round(value * 0.55);
      const to = value;
      const t0 = performance.now();

      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        // easeOutCubic — fast start, soft landing
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(from + (to - from) * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      setDisplay(from);
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    // Failsafe: never leave a card showing the pre-animation number if the
    // observer callback is missed (some in-app browsers do not fire it).
    const t = window.setTimeout(run, 2500);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, [value, duration]);

  // Keep in sync when the currency flips.
  useEffect(() => {
    if (started.current) setDisplay(value);
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString("en-US")}
    </span>
  );
}
