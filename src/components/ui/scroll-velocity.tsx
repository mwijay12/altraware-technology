"use client";

import * as React from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
  wrap,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollVelocityProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  velocity: number;
  movable?: boolean;
  clamp?: boolean;
  repeat?: number;
}

const ScrollVelocity = React.forwardRef<HTMLDivElement, ScrollVelocityProps>(
  (
    {
      children,
      velocity = 5,
      movable = true,
      clamp = false,
      repeat = 4,
      className,
      ...props
    },
    ref
  ) => {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
      damping: 50,
      stiffness: 100,
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 10000], [0, 5], {
      clamp,
    });

    const x = useTransform(baseX, (v) => `${wrap(0, -50, v)}%`);

    // ONE-DIRECTION lock: direction comes ONLY from the `velocity` prop.
    // Positive velocity -> moves right, negative velocity -> moves left.
    // Vertical page scroll NEVER reverses direction — it only adds a subtle speed boost.
    const lockedDirection = React.useRef<number>(velocity >= 0 ? 1 : -1);
    React.useEffect(() => {
      lockedDirection.current = velocity >= 0 ? 1 : -1;
    }, [velocity]);
    const isPaused = React.useRef<boolean>(false);
    const scrollThreshold = React.useRef<number>(5);
    const [isMobile, setIsMobile] = React.useState<boolean>(false);
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const inView = React.useRef<boolean>(true);

    React.useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // MOBILE PERF: pause the 60fps animation loop when the marquee is
    // off-screen (was always running, even below the fold).
    React.useEffect(() => {
      const el = containerRef.current;
      if (!el || typeof IntersectionObserver === "undefined") return;
      const obs = new IntersectionObserver(
        (entries) => {
          inView.current = entries[0].isIntersecting;
        },
        { threshold: 0 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    }, []);

    useAnimationFrame((t, delta) => {
      if (isPaused.current || !inView.current) return;
      // Respect users who asked for less motion — static row, no JS work.
      if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      // Always move — one fixed direction. No scroll-direction flip, no bounce.
      if (movable) {
        move(delta);
      } else if (Math.abs(scrollVelocity.get()) >= scrollThreshold.current) {
        // movable=false: still locked to one direction, only moves while page scrolls
        move(delta);
      }
    });

    function move(delta: number) {
      // Visible but calm: desktop ~0.6, mobile ~0.4 (was 0.38/0.22 — so slow
      // the row read as frozen). Base speed uses |velocity| so sign only
      // controls direction (locked above).
      const speedMultiplier = isMobile ? 0.4 : 0.6;
      const baseSpeed = Math.abs(velocity) * speedMultiplier;
      // Subtle speed-up when user scrolls fast — magnitude only, never reverses.
      const boost = Math.min(1.5, Math.abs(velocityFactor.get())) * 0.25;
      const moveBy =
        lockedDirection.current * baseSpeed * (1 + boost) * (delta / 1000);
      baseX.set(baseX.get() + moveBy);
    }

    // Render duplicates to guarantee a smooth, continuous seamless infinite loop
    // MOBILE PERF: cap duplicates at 2 (was 4) — halves DOM nodes + images.
    const renderContent = () => {
      const effectiveRepeat = isMobile ? Math.min(repeat, 2) : repeat;
      if (typeof children === "string") {
        return Array.from({ length: effectiveRepeat * 2 }).map((_, idx) => (
          <span key={idx} className="inline-block mr-6 md:mr-8">
            {children}
          </span>
        ));
      }
      return Array.from({ length: effectiveRepeat }).map((_, repeatIdx) => (
        <React.Fragment key={repeatIdx}>{children}</React.Fragment>
      ));
    };

    // Merge outer ref (from forwardRef) with our in-view observer ref.
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref]
    );

    return (
      <div
        ref={setRefs}
        onPointerEnter={(e) => {
          // Pause on hover only for mouse — never pause on touch scroll (mobile bounce fix)
          if (e.pointerType === "mouse") isPaused.current = true;
        }}
        onPointerLeave={() => {
          isPaused.current = false;
        }}
        className={cn(
          "relative m-0 flex flex-nowrap overflow-hidden whitespace-nowrap py-1.5 md:py-2 select-none",
          className
        )}
        {...props}
      >
        <motion.div
          className="flex flex-row flex-nowrap whitespace-nowrap items-center will-change-transform"
          style={{ x }}
        >
          {renderContent()}
        </motion.div>
      </div>
    );
  }
);
ScrollVelocity.displayName = "ScrollVelocity";

export { ScrollVelocity, type ScrollVelocityProps };
