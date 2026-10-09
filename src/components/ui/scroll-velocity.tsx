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

    const directionFactor = React.useRef<number>(1);
    const scrollThreshold = React.useRef<number>(5);
    const isPaused = React.useRef<boolean>(false);
    const [isMobile, setIsMobile] = React.useState<boolean>(false);

    React.useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useAnimationFrame((t, delta) => {
      if (isPaused.current) return;

      if (movable) {
        move(delta);
      } else {
        if (Math.abs(scrollVelocity.get()) >= scrollThreshold.current) {
          move(delta);
        }
      }
    });

    function move(delta: number) {
      // Calibrated calm, elegant speed for both desktop and mobile
      const speedMultiplier = isMobile ? 0.22 : 0.38;
      let moveBy = directionFactor.current * (velocity * speedMultiplier) * (delta / 1000);

      if (velocityFactor.get() < 0) {
        directionFactor.current = -1;
      } else if (velocityFactor.get() > 0) {
        directionFactor.current = 1;
      }
      // Gentle, subtle velocity response without whipping or rushing
      const boost = Math.min(1.5, Math.abs(velocityFactor.get())) * 0.25;
      moveBy += directionFactor.current * moveBy * boost;
      baseX.set(baseX.get() + moveBy);
    }

    // Render duplicates to guarantee a smooth, continuous seamless infinite loop
    const renderContent = () => {
      if (typeof children === "string") {
        return Array.from({ length: repeat * 2 }).map((_, idx) => (
          <span key={idx} className="inline-block mr-6 md:mr-8">
            {children}
          </span>
        ));
      }
      return Array.from({ length: repeat }).map((_, repeatIdx) => (
        <React.Fragment key={repeatIdx}>{children}</React.Fragment>
      ));
    };

    return (
      <div
        ref={ref}
        onPointerEnter={() => {
          isPaused.current = true;
        }}
        onPointerLeave={() => {
          isPaused.current = false;
        }}
        onTouchStart={() => {
          isPaused.current = true;
        }}
        onTouchEnd={() => {
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
