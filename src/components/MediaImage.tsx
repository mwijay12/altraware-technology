"use client";

import { useState } from "react";
import { cld, cldSrcSet } from "@/lib/media";

/* ============================================================
   MediaImage — one image component for every remote or local
   picture on the site. It exists because the old markup assumed
   every image would load, so a 404, a rate limit or a cold CDN
   left an empty grey rectangle that read as a bug.

   What it guarantees:
   1. A visible, on-brand fallback if the source never loads.
   2. Retina-sharp sources: Cloudinary URLs are rewritten to a
      dpr-aware srcSet instead of shipping a single w_600 file
      into a card that needs ~840px.
   3. Correct cropping for product screenshots, whose headline
      lives in the top third — `focus="top"` keeps it.
   4. A skeleton shimmer while loading, so nothing pops.
   ============================================================ */

type Focus = "top" | "center" | "bottom";

const FOCUS: Record<Focus, string> = {
  top: "object-top",
  center: "object-center",
  bottom: "object-bottom",
};

export default function MediaImage({
  src,
  alt,
  label,
  className = "",
  imgClassName = "",
  focus = "center",
  widths,
  sizes = "(max-width: 767px) 100vw, 50vw",
  priority = false,
  children,
}: {
  src: string;
  alt: string;
  /** Shown in the fallback panel when the image fails — usually the project title. */
  label?: string;
  /** Classes for the wrapper (the box that must never collapse). */
  className?: string;
  /** Classes for the <img> itself. */
  imgClassName?: string;
  focus?: Focus;
  /** Width candidates for the retina srcSet. Defaults are sensible for cards. */
  widths?: number[];
  sizes?: string;
  priority?: boolean;
  children?: React.ReactNode;
}) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  const isCloudinary = src.includes("res.cloudinary.com");
  const srcSet = isCloudinary ? cldSrcSet(src, widths ?? [400, 640, 840, 1200]) : undefined;

  if (state === "error") {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-[#0A1735] to-[#1E1B4B] flex items-center justify-center p-6 text-center ${className}`}
        data-media-fallback="1"
      >
        <span className="text-white/70 font-grotesk text-[11px] sm:text-xs tracking-[0.22em] uppercase leading-relaxed">
          {label || alt}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-deep/10 ${className}`}>
      {state === "loading" && (
        <div className="absolute inset-0 animate-pulse bg-deep/[0.08]" aria-hidden="true" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={srcSet ? cld(src, 840) : src}
        srcSet={srcSet}
        sizes={srcSet ? sizes : undefined}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(priority ? ({ fetchPriority: "high" } as any) : {})}
        onLoad={() => setState("ready")}
        onError={() => setState("error")}
        className={`w-full h-full object-cover ${FOCUS[focus]} transition-opacity duration-500 ${
          state === "ready" ? "opacity-100" : "opacity-0"
        } ${imgClassName}`}
      />
      {children}
    </div>
  );
}
