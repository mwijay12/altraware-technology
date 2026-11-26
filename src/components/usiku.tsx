"use client";

import { useEffect, useRef, useState } from "react";

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

/**
 * useFitText — scale a display line to the width it actually has.
 *
 * `clamp()` cannot do this. The size that fits depends on how many glyphs
 * the string has, and `.u-mega` is shared between "MIZIZI." (5.2em wide at
 * weight 800) and "TUTENGENEZE." (12.9em). Any single clamp value is either
 * too large for the long line — which is what clipped the closing headline
 * on the home page — or too small to be a display headline on the short one.
 *
 * The CSS cap is now set so the longest string fits unaided (the no-JS
 * baseline). This hook then measures and, for shorter strings, scales *up*
 * towards the same optical width. Both lines end up filling the column, so
 * the type looks deliberate at every length instead of small-then-clipped.
 *
 * Re-runs on resize and once webfonts settle — Syne changes metrics
 * substantially against the fallback, so measuring before it loads is
 * measuring the wrong face.
 */
export function useFitText<T extends HTMLElement>(min = 28, max = 320) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;

    const fit = () => {
      // Measure against the element's own box: a block headline is as wide
      // as its column, and a `max-w-[…]` cap is a deliberate constraint the
      // line must respect rather than escape.
      const avail = el.clientWidth;
      if (!avail) return;

      // reset so we measure the stylesheet's intent, not the last result
      el.style.fontSize = "";
      let size = parseFloat(getComputedStyle(el).fontSize);
      if (!size) return;

      // grow first (short strings should fill the column) …
      let guard = 0;
      while (size < max && guard < 40) {
        el.style.fontSize = `${size * 1.05}px`;
        if (el.scrollWidth > avail) {
          el.style.fontSize = `${size}px`;
          break;
        }
        size *= 1.05;
        guard += 1;
      }

      // … then shrink if the starting size already overflowed
      guard = 0;
      while (el.scrollWidth > avail && size > min && guard < 40) {
        size *= 0.96;
        el.style.fontSize = `${size}px`;
        guard += 1;
      }
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(fit);
    };

    schedule();
    window.addEventListener("resize", schedule, { passive: true });
    document.fonts?.ready?.then(schedule).catch(() => {});
    return () => {
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, [min, max]);

  return ref;
}

export function StatFigure({
  value,
  suffix = "",
  className = "",
}: {
  value: number | string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const text = `${value}${suffix}`;

  // THE RULE, after four broken attempts at tweening a figure on this site:
  // the digits in the DOM are the digits the business claims, at every
  // instant, in every frame, for every crawler and every screenshot.
  //
  // Every earlier version rewrote the number itself and each one shipped a
  // wrong state at some point — a digit strip ($012345…), a mid-tween frame
  // (15+ → -13+), a duplicate sr-only copy (111), a state reset (0+ where
  // the server said 15+).
  //
  // So the motion moved off the value and onto the glyphs: each character is
  // its own span, and on scroll they rise into place in sequence. The number
  // never changes; only where its letters sit for the first 700ms. That is
  // what "counting up" actually feels like, with no way to misquote a figure.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced() || typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        el.classList.toggle("is-in", e.isIntersecting);
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`u-figure ${className} tabular-nums`}
      aria-label={text}
    >
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="u-figure-ch"
          style={{ ["--i" as string]: String(i) }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </div>
  );
}

/**
 * useScrub — drive a CSS variable from scroll progress through the element.
 *
 * This is the difference between "animated in" and "moved by you". An
 * entrance fires once and is over; a scrub is still running while the
 * element crosses the viewport, so the page answers the scroll wheel
 * directly. Both references the brief names are built this way.
 *
 * Writes `--scrub` on the element: 0 when it enters from the bottom, 1 when
 * it leaves through the top. CSS decides what that means — scale, blur,
 * letter-spacing — so nothing here hard-codes a look.
 *
 * rAF-throttled, and reads a single getBoundingClientRect per frame.
 */
export function useScrub<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;

    let raf = 0;
    let visible = false;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 = just below the fold, 1 = fully past the top
      const p = (vh - rect.top) / (vh + rect.height);
      el.style.setProperty("--scrub", Math.min(1, Math.max(0, p)).toFixed(4));
    };

    const onScroll = () => {
      if (!visible) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) onScroll();
      },
      { rootMargin: "80px" }
    );
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}

/**
 * useHeadline — settle on entry, then keep scrubbing while on screen.
 *
 * The two behaviours must live on the same element, and React 19 forbids
 * writing a ref returned by another hook, so they are composed here rather
 * than stitched at the call site.
 *
 * Order matters for feel: the clip aperture opens on arrival (one-shot),
 * and the scrub variable keeps updating the whole time the line is
 * visible, so the type is still responding to the wheel after the reveal
 * has finished. That is the "more on scroll" the brief asked for.
 */
export function useHeadline<T extends HTMLElement>(scrub = true) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let settleTimer: number | undefined;
    let settleIO: IntersectionObserver | undefined;

    // --- settle (one-shot) ---
    const reveal = () => el.classList.add("is-in");
    if (prefersReduced() || typeof IntersectionObserver === "undefined") {
      reveal();
    } else {
      settleIO = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            reveal();
            settleIO?.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      settleIO.observe(el);
      // failsafe: never leave a headline clipped because a callback was missed
      settleTimer = window.setTimeout(reveal, 2600);
    }

    // --- scrub (continuous) ---
    if (!scrub || prefersReduced()) {
      return () => {
        settleIO?.disconnect();
        if (settleTimer) clearTimeout(settleTimer);
      };
    }

    let raf = 0;
    let visible = false;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh - rect.top) / (vh + rect.height);
      el.style.setProperty("--scrub", Math.min(1, Math.max(0, p)).toFixed(4));
    };

    const onScroll = () => {
      if (!visible) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    const sio = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) onScroll();
      },
      { rootMargin: "80px" }
    );
    sio.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      sio.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      settleIO?.disconnect();
      if (settleTimer) clearTimeout(settleTimer);
    };
  }, [scrub]);

  return ref;
}

/**
 * useFitHeadline — size-to-width and reveal, on the same element.
 *
 * /closing needs both: the line must be scaled to its column (otherwise it
 * clips, which is the bug this pass started from) *and* it must open with
 * the aperture like every other section headline.
 *
 * React 19 forbids holding two refs to the same node from separate hooks,
 * and it also forbids writing to a ref another hook returned. So this is a
 * single hook that owns one ref and runs both behaviours against it — not a
 * composition of the two above.
 */
export function useFitHeadline<T extends HTMLElement>(min = 24, max = 320) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let settleTimer: number | undefined;
    let settleIO: IntersectionObserver | undefined;

    /* ---- settle: open the aperture once ---- */
    const reveal = () => el.classList.add("is-in");
    if (prefersReduced() || typeof IntersectionObserver === "undefined") {
      reveal();
    } else {
      settleIO = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            reveal();
            settleIO?.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      settleIO.observe(el);
      settleTimer = window.setTimeout(reveal, 2600);
    }

    /* ---- fit: scale to the column ---- */
    const fit = () => {
      const avail = el.clientWidth;
      if (!avail) return;
      el.style.fontSize = "";
      let size = parseFloat(getComputedStyle(el).fontSize);
      if (!size) return;

      let guard = 0;
      while (size < max && guard < 40) {
        el.style.fontSize = `${size * 1.05}px`;
        if (el.scrollWidth > avail) {
          el.style.fontSize = `${size}px`;
          break;
        }
        size *= 1.05;
        guard += 1;
      }
      guard = 0;
      while (el.scrollWidth > avail && size > min && guard < 40) {
        size *= 0.96;
        el.style.fontSize = `${size}px`;
        guard += 1;
      }
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(fit);
    };
    schedule();
    window.addEventListener("resize", schedule, { passive: true });
    document.fonts?.ready?.then(schedule).catch(() => {});

    return () => {
      settleIO?.disconnect();
      if (settleTimer) clearTimeout(settleTimer);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, [min, max]);

  return ref;
}
