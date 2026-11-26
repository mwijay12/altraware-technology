"use client";

import { useEffect, useRef, useState } from "react";
import { cld, isPlaceholderVideo } from "@/lib/media";

/* ============================================================
   Reveal — GSAP scroll-triggered fade/slide-in.
   Usage: <Reveal delay={0.1}>...</Reveal>
   ============================================================ */

export function Reveal({
  children,
  delay = 0,
  className = "",
  y = 44,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // MOBILE PERF: GSAP + ScrollTrigger per Reveal instance = dozens of
    // scroll listeners + dynamic imports on phones. Use a single cheap
    // IntersectionObserver + CSS transition instead (no JS animation lib).
    const isMobile =
      window.innerWidth < 768 ||
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isMobile) {
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            window.setTimeout(() => el.classList.add("revealed"), delay * 1000);
            obs.disconnect();
          }
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
      );
      // CSS handles the fade (see .scroll-reveal.revealed + transition)
      el.style.transition = `opacity .6s ease ${delay}s, transform .6s ease ${delay}s`;
      obs.observe(el);
      return () => obs.disconnect();
    }
    let killed = false;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (killed || !ref.current) return;
      gsap.registerPlugin(ScrollTrigger);
      gsap.fromTo(
        ref.current,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 88%" },
        }
      );
    })();
    return () => {
      killed = true;
    };
  }, [delay, y]);

  return (
    // @ts-expect-error dynamic tag ref
    <Tag ref={ref} className={`scroll-reveal ${className}`}>
      {children}
    </Tag>
  );
}

/* ============================================================
   TiltCard — 3D perspective tilt on hover (the "3D element").
   Desktop only; disabled on touch.
   ============================================================ */

export function TiltCard({
  children,
  className = "",
  intensity = 12,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(hover: none)").matches) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) translateY(-4px)`;
    };
    const onLeave = () => {
      el.style.transform = "perspective(800px) rotateY(0) rotateX(0)";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [intensity]);

  return (
    <div ref={ref} className={`tilt-card ${className}`}>
      {children}
    </div>
  );
}

/* ============================================================
   Counter — animates number when scrolled into view
   ============================================================ */

export function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  // Start at the real value, not 0. A stat that reads "0+" and then counts
  // up is the same mistake as a price that tweens: the first painted frame
  // (and every screenshot, crawler, or no-JS render) shows a number the
  // business never claimed.
  const [val, setVal] = useState(target);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") return;

    let raf = 0;
    let started = false;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          const start = performance.now();
          // Count up from a small offset that reads as motion, but never
          // from a number that contradicts the final claim.
          const floor = target > 10 ? Math.floor(target * 0.9) : target;
          const tick = (now: number) => {
            const p = Math.min((now - start) / 900, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(floor + (target - floor) * eased));
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/* ============================================================
   ImgReveal — image with curtain wipe on scroll into view
   ============================================================ */

export function ImgReveal({
  src,
  alt,
  className = "",
  imgClassName = "",
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.classList.add("in-view");
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const [failed, setFailed] = useState(false);

  if (failed) {
    // Never leave a bare box: name what should be there.
    return (
      <div
        ref={ref}
        className={`img-reveal bg-gradient-to-br from-[#0A1735] to-[#1E1B4B] flex items-center justify-center p-5 text-center ${className}`}
        data-media-fallback="1"
      >
        <span className="text-white/70 font-grotesk text-[10px] tracking-[0.2em] uppercase leading-relaxed">
          {alt}
        </span>
      </div>
    );
  }

  const srcSet = src.includes("res.cloudinary.com")
    ? [400, 640, 840, 1200].map((w) => `${cld(src, w)} ${w}w`).join(", ")
    : undefined;

  return (
    <div ref={ref} className={`img-reveal ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={srcSet ? cld(src, 840) : src}
        srcSet={srcSet}
        sizes={srcSet ? "(max-width: 767px) 100vw, 50vw" : undefined}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={imgClassName}
      />
    </div>
  );
}

/* ============================================================
   Marquee
   ============================================================ */

export function Marquee({
  children,
  reverse = false,
  className = "",
}: {
  children: React.ReactNode;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={`marquee ${className}`}>
      <div className={`marquee-track ${reverse ? "reverse" : ""}`}>
        <span className="px-6">{children}</span>
        <span className="px-6">{children}</span>
      </div>
    </div>
  );
}

/* One media cell that cannot fail silently: if the URL never loads it names
   itself instead of collapsing to an empty rectangle. */
function MediaBlockImage({ url, caption }: { url: string; caption: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="w-full h-48 bg-gradient-to-br from-[#0A1735] to-[#1E1B4B] flex items-center justify-center p-4 text-center">
        <span className="text-white/70 font-grotesk text-[10px] tracking-[0.2em] uppercase leading-relaxed">
          {caption}
        </span>
      </div>
    );
  }
  const srcSet = url.includes("res.cloudinary.com")
    ? [400, 640, 840].map((w) => `${cld(url, w)} ${w}w`).join(", ")
    : undefined;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={srcSet ? cld(url, 840) : url}
      srcSet={srcSet}
      sizes={srcSet ? "(max-width: 640px) 100vw, 33vw" : undefined}
      alt={caption}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="w-full h-48 object-cover object-top group-hover:scale-105 transition-transform duration-700"
    />
  );
}

/* ============================================================
   MediaBlock — images + playable video, fully admin-editable.
   Renders a responsive strip of media items; each video has
   native controls and a poster. Use on every page so no page
   is text-only. Items come from content, so admin can replace
   any image or video URL.
   ============================================================ */

export function MediaBlock({
  items,
  className = "",
  dark = false,
}: {
  items: { type: "image" | "video"; url: string; caption: string }[];
  className?: string;
  dark?: boolean;
}) {
  if (!items || items.length === 0) return null;
  return (
    <div className={`grid gap-4 ${items.length >= 3 ? "sm:grid-cols-3" : items.length === 2 ? "sm:grid-cols-2" : ""} ${className}`}>
      {items.map((m, i) => (
        <figure key={i} className={`rounded-2xl overflow-hidden group relative ${dark ? "bg-white/5" : "bg-deep/5"}`}>
          {m.type === "video" && !isPlaceholderVideo(m.url) ? (
            <video
              src={m.url}
              controls
              preload="metadata"
              playsInline
              muted
              loop
              className="w-full h-48 object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          ) : (
            // A placeholder film (Big Buck Bunny et al) must never render as a
            // product demo — fall through to an image panel instead.
            <MediaBlockImage url={m.url} caption={m.caption} />
          )}
          {m.caption && (
            <figcaption className={`px-3 py-2 text-[11px] font-medium ${dark ? "text-white/50" : "text-deep/50"}`}>
              {m.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

/* ============================================================
   useLockBodyScroll — locks background page scroll while a modal
   is open, so the wheel only moves the dialog (top stays reachable).
   ============================================================ */

export function useLockBodyScroll(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [active]);
}

/* NOTE: FloatingAI is intentionally NOT re-exported here.
   Importing it via motion.tsx would bundle the chat widget into
   every page that only needs Reveal/TiltCard. Import it directly
   via next/dynamic in layout instead. */