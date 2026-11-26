"use client";

import { useEffect, useRef, useState } from "react";

/* ============================================================
   PRICE FLOW — a price that counts itself up, once
   ============================================================
   The previous implementation wrapped `@number-flow/react`, which is a
   web component: during SSR it emits a 0–9 digit strip and only rolls to
   the real value after hydration. Server-rendered and no-JS pages showed

       $012345678901234567890123456789

   That is a pricing page advertising "the price" as a keyboard mash.

   Design rule for this component: A PRICE NEVER SHOWS A NUMBER THAT IS
   NOT THE PRICE. No pre-tween frame, no "0 → value" flourish on the
   server, no intermediate state that a crawler, a screenshot, or a slow
   connection can catch. The number is correct from the first painted
   frame; the animation is confined to a subtle opacity/offset lift that
   cannot misrepresent the value.

   The earlier version of this file tweened from `value * 0.55`. That is
   a digital the honest-traders rule does not allow on a pricing page —
   if anything at all goes wrong mid-tween the card is left advertising a
   price the business never quoted.
   ============================================================ */

export default function PriceFlow({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(false);

  // Guard the type at the boundary, not at the call site: a stored admin
  // override can arrive as a string or as `"custom"`.
  const safe =
    typeof value === "number" && Number.isFinite(value) && value >= 0
      ? Math.round(value)
      : null;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    const t = window.setTimeout(() => setShown(true), 2500);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  if (safe === null) {
    // A price we cannot read is not a price. Say so rather than print NaN.
    return (
      <span ref={ref} className={className}>
        On request
      </span>
    );
  }

  return (
    <span
      ref={ref}
      className={`${className} inline-block transition-[opacity,transform] duration-700 ease-out ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
      } motion-reduce:opacity-100 motion-reduce:translate-y-0`}
    >
      {safe.toLocaleString("en-US")}
    </span>
  );
}
