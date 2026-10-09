"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface HoverHighlightTextProps extends React.HTMLAttributes<HTMLHeadingElement> {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  enableGlow?: boolean;
}

export function HoverHighlightText({
  text,
  as: Component = "h1",
  enableGlow = true,
  className,
  ...props
}: HoverHighlightTextProps) {
  const containerRef = React.useRef<HTMLElement>(null);
  const [coords, setCoords] = React.useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
  };

  return (
    <Component
      ref={containerRef as any}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(
        "relative inline-block cursor-default select-none font-bold tracking-tight text-white/30 transition-colors",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{text}</span>

      {/* Hover reveal overlay */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 text-white transition-opacity duration-300"
        style={{
          opacity: isHovered || coords ? 1 : 0,
          clipPath: coords
            ? `circle(120px at ${coords.x}px ${coords.y}px)`
            : "circle(0px at 50% 50%)",
          WebkitClipPath: coords
            ? `circle(120px at ${coords.x}px ${coords.y}px)`
            : "circle(0px at 50% 50%)",
        }}
      >
        {text}
      </span>

      {/* Optional ambient glow */}
      {enableGlow && coords && isHovered && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute z-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-viol/30 blur-2xl transition-opacity"
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`,
            width: "220px",
            height: "220px",
          }}
        />
      )}
    </Component>
  );
}

export default HoverHighlightText;
