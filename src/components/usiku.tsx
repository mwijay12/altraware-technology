"use client";

import { useEffect, useRef } from "react";

/* ============================================================
   USIKU motion primitives.

   Design rules enforced here:
   - Motion never changes layout: only transform / opacity / clip-path
     / CSS custom properties.
   - Everything is progressive. With JS off, or with
     prefers-reduced-motion, the page is complete and readable.
   - One CSS variable drives parallax (--py), so nothing fights over
     the transform property.
   ============================================================ */

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Scroll-scrubbed parallax. `speed` > 0 moves the layer up as you
 * scroll down (background), < 0 moves it down (foreground).
 */
export function useParallax<T extends HTMLElement>(speed = 0.15) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;

    let raf = 0;
    let visible = false;

    const onScroll = () => {
      if (!visible) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        // Distance of the element's centre from the viewport centre.
        const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
        el.style.setProperty("--py", `${(-offset * speed).toFixed(2)}px`);
      });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) onScroll();
      },
      { rootMargin: "120px" }
    );
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [speed]);

  return ref;
}

/**
 * Clip-path reveal when the element scrolls into view.
 */
export function useClipReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced()) {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}

/**
 * Character-by-character mask reveal for display headlines.
 *
 * Splits text into per-character spans once, then animates them from
 * below a mask. Words are wrapped so text can still wrap naturally
 * between words (never mid-word on narrow screens).
 */
export function MaskLine({
  text,
  className = "",
  delay = 0,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "span" | "h1" | "h2" | "h3";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = el.querySelectorAll<HTMLElement>("[data-ch]");

    // Reduced motion (or no observer support) gets the final state, chars
    // included. Setting only the wrapper opacity would leave every glyph
    // invisible, which is exactly the bug this guards against.
    if (prefersReduced() || typeof IntersectionObserver === "undefined") {
      chars.forEach((c) => {
        c.style.transform = "none";
        c.style.opacity = "1";
      });
      el.style.opacity = "1";
      return;
    }

    // Safety net: if the observer never fires (browser quirk, element already
    // past the viewport at mount), reveal anyway so the copy is never lost.
    const failsafe = window.setTimeout(() => {
      chars.forEach((c) => {
        if (c.style.opacity === "0" || !c.style.opacity) {
          c.style.transform = "none";
          c.style.opacity = "1";
        }
      });
    }, 2600);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        chars.forEach((c, i) => {
          c.style.transitionDelay = `${delay + i * 0.022}s`;
          c.style.transform = "translateY(0)";
          c.style.opacity = "1";
        });
        io.disconnect();
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(failsafe);
    };
  }, [delay]);

  const words = text.split(" ");

  // Reduced motion gets the final state immediately. The `data-mask` hooks
  // let a <noscript> stylesheet in globals.css force visibility when JS never
  // runs, so a blocked bundle can never leave the headline invisible.
  return (
    <Tag ref={ref as React.Ref<never>} className={className} style={{ opacity: 1 }}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {Array.from(word).map((ch, ci) => (
            <span
              key={ci}
              data-ch="true"
              className="u-mask-ch inline-block will-change-transform"
              style={{
                transform: "translateY(0.9em)",
                opacity: 0,
                transition:
                  "transform .95s cubic-bezier(.16,1,.3,1), opacity .7s cubic-bezier(.16,1,.3,1)",
              }}
            >
              {ch}
            </span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}

/**
 * Reveal-on-scroll wrapper: fades and lifts its children once.
 */
export function Rise({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced()) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }
    const reveal = () => {
      el.style.transitionDelay = `${delay}s`;
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    };
    const failsafe = window.setTimeout(reveal, 2600);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        reveal();
        io.disconnect();
        clearTimeout(failsafe);
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(failsafe);
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`u-rise ${className}`}
      style={{
        opacity: 0,
        transform: "translateY(26px)",
        transition:
          "opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1)",
      }}
    >
      {children}
    </div>
  );
}

/**
 * Horizontal ticker. Duplicates content once so the loop is seamless;
 * animation lives in CSS (see .u-marquee-track) and is disabled under
 * prefers-reduced-motion.
 */
export function Ticker({
  children,
  reverse = false,
  className = "",
}: {
  children: React.ReactNode;
  reverse?: boolean;
  className?: string;
}) {
  const row = (
    <div className={`u-marquee-track ${reverse ? "reverse" : ""}`} aria-hidden="true">
      {children}
      {children}
    </div>
  );
  return (
    <div className={`u-marquee ${className}`} role="presentation">
      {row}
    </div>
  );
}

/* ============================================================
   MOTION, PART TWO — the moves that make it feel alive.
   ============================================================ */

/**
 * Headline settle: starts wide and skewed, lands tight and upright.
 * Reads as type being placed rather than fading in.
 */
export function useSettle<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced() || typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    // If it is already on screen at mount the observer fires immediately;
    // this is the fallback for a missed callback.
    const t = window.setTimeout(() => el.classList.add("is-in"), 2600);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);
  return ref;
}

/** Image overscan reveal — starts past its frame, settles flush. */
export function useOverscan<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced() || typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    const t = window.setTimeout(() => el.classList.add("is-in"), 2000);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);
  return ref;
}

/** A rule that draws itself. */
export function useDraw<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced() || typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/**
 * Magnetic pointer attraction for CTAs. Writes --mx/--my only, so the
 * transform stays in CSS and never fights a transition.
 */
export function useMagnet<T extends HTMLElement>(strength = 0.28) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    // Coarse pointers (touch) have no hover — skip the work entirely.
    if (window.matchMedia("(hover: none)").matches) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.setProperty("--mx", `${(dx * strength).toFixed(1)}px`);
      el.style.setProperty("--my", `${(dy * strength).toFixed(1)}px`);
    };
    const reset = () => {
      el.style.setProperty("--mx", "0px");
      el.style.setProperty("--my", "0px");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
    };
  }, [strength]);
  return ref;
}

/**
 * Cursor-aware decor drift for the hero bloom.
 */
export function useDrift<T extends HTMLElement>(strength = 22) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * strength;
        const y = (e.clientY / window.innerHeight - 0.5) * strength;
        el.style.setProperty("--dx", `${x.toFixed(1)}px`);
        el.style.setProperty("--dy", `${y.toFixed(1)}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [strength]);
  return ref;
}

/**
 * Combined hero-frame behaviour: clip-path reveal + overscan settle on the
 * same element. React 19 forbids writing to a ref returned by another hook,
 * so the two behaviours are composed here instead of being stitched at the
 * call site.
 */
export function useHeroFrame<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reveal = () => {
      el.classList.add("is-in");
    };
    if (prefersReduced() || typeof IntersectionObserver === "undefined") {
      reveal();
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          reveal();
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    const t = window.setTimeout(reveal, 1800);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);
  return ref;
}
