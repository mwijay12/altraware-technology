"use client";

import React, { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";

interface TimelineContentProps {
  as?: any;
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLElement | null>;
  customVariants?: Variants;
  className?: string;
  children: React.ReactNode;
}

export function TimelineContent({
  as = "div",
  animationNum = 0,
  timelineRef,
  customVariants,
  className,
  children,
  ...props
}: TimelineContentProps & React.HTMLAttributes<HTMLElement>) {
  const localRef = useRef<HTMLDivElement>(null);
  const targetRef = timelineRef || localRef;
  const isInView = useInView(targetRef as React.RefObject<HTMLElement>, {
    once: true,
    margin: "-5% 0px",
  });

  const defaultVariants: Variants = {
    hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.12,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const variants = customVariants || defaultVariants;
  const Component = motion.create(as);

  return (
    <Component
      ref={localRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={animationNum}
      variants={variants}
      className={className}
      {...(props as any)}
    >
      {children}
    </Component>
  );
}
