"use client";

import { useEffect, useRef, useState } from "react";

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
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let started = false;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / 1600, 1);
            setVal(Math.floor(target * (1 - Math.pow(1 - p, 3))));
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

  return (
    <div ref={ref} className={`img-reveal ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" decoding="async" className={imgClassName} />
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
          {m.type === "video" ? (
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
            // eslint-disable-next-line @next/next/no-img-element
            <img src={m.url} alt={m.caption} loading="lazy" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700" />
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