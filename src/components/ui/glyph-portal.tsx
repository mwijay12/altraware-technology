"use client";

/**
 * Glyph Portal © 2026 Christian Katzmann. MIT.
 * Adapted for Altraware Technology: rock-solid scroll camera through live typography.
 */
import React, { useId, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";

export type GlyphPortalStyle = CSSProperties & {
  "--gp-paper"?: string;
  "--gp-ink"?: string;
  "--gp-field"?: string;
  "--gp-foreground"?: string;
};

export type GlyphPortalProps = {
  word?: string;
  focusChar?: string;
  interactive?: boolean;
  background?: ReactNode;
  front?: ReactNode;
  children?: ReactNode;
  scrollLength?: number;
  fontFamily?: string;
  fontWeight?: number;
  annotations?: boolean;
  enterLabel?: string;
  className?: string;
  style?: GlyphPortalStyle;
  onProgress?: (progress: number) => void;
};

const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const smooth = (a: number, b: number, n: number) => {
  const t = clamp((n - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const DEFAULT_FONT = '"Arial Black", "Arial", sans-serif';
type Ink = { x: number; y: number; radius: number; index: number };
type Letter = { index: number; x: number; y: number; width: number; height: number };

function interior(context: CanvasRenderingContext2D, char: string, font: string): Omit<Ink, "index"> | null {
  const canvas = context.canvas;
  context.font = font;
  const m = context.measureText(char);
  const pad = 12;
  const left = Math.ceil(m.actualBoundingBoxLeft || 4);
  const ascent = Math.ceil(m.actualBoundingBoxAscent || 20);
  canvas.width = Math.max(1, Math.ceil(m.actualBoundingBoxLeft + m.actualBoundingBoxRight) + pad * 2);
  canvas.height = Math.max(1, Math.ceil(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) + pad * 2);
  context.font = font;
  context.fontKerning = "none";
  context.fillText(char, pad + left, pad + ascent);
  const { width, height } = canvas;
  const pixels = context.getImageData(0, 0, width, height).data;
  const rows = new Uint16Array(width + 1);
  let size = 0, bx = 0, by = 0;
  for (let y = 0; y < height; y++) {
    let diagonal = 0;
    for (let x = 0; x < width; x++) {
      const above = rows[x + 1];
      rows[x + 1] = pixels[(y * width + x) * 4 + 3] > 240
        ? Math.min(above, rows[x], diagonal) + 1 : 0;
      diagonal = above;
      if (rows[x + 1] > size) { size = rows[x + 1]; bx = x; by = y; }
    }
  }
  if (size < 3) return null;
  return {
    x: (bx + 1 - size / 2 - pad - left) / 3,
    y: (by + 1 - size / 2 - pad - ascent) / 3,
    radius: (size / 2 - 1) / 3
  };
}

function scrollParent(element: HTMLElement): HTMLElement | null {
  for (let p = element.parentElement; p; p = p.parentElement) {
    if (p === document.body || p === document.documentElement) return null;
    const style = getComputedStyle(p);
    if (/(auto|scroll)/.test(style.overflowY) && p.scrollHeight > p.clientHeight) {
      return p;
    }
  }
  return null;
}

export default function GlyphPortal({
  word = "ALTRAWARE",
  focusChar,
  interactive = true,
  background,
  front,
  children,
  scrollLength = 3,
  fontFamily = DEFAULT_FONT,
  fontWeight = 900,
  annotations = false,
  enterLabel = "Step inside",
  className,
  style,
  onProgress,
}: GlyphPortalProps) {
  const uid = `gp-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const clipId = `${uid}-clip`;
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(onProgress);
  useLayoutEffect(() => { progressRef.current = onProgress; }, [onProgress]);

  const text = word.trim().normalize("NFC") || "ALTRAWARE";
  let characterOffset = 0;
  const characters = Array.from(text, (char) => {
    const index = characterOffset; characterOffset += char.length;
    return { char, index };
  });
  const length = Number.isFinite(scrollLength) ? clamp(scrollLength, 1.5, 8) : 3;
  const weight = Number.isFinite(fontWeight) ? clamp(fontWeight, 1, 1000) : 900;
  const hasFront = front != null;
  const q = `:where(#${uid})`;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const pin = section.querySelector<HTMLElement>("[data-gp-pin]")!;
    const field = section.querySelector<HTMLElement>("[data-gp-field]")!;
    const art = section.querySelector<SVGSVGElement>("[data-gp-art]")!;
    const clipGroup = section.querySelector<SVGGElement>("[data-gp-clip-group]")!;
    const visGroup = section.querySelector<SVGGElement>("[data-gp-vis-group]")!;
    const glyph = section.querySelector<SVGTextElement>("[data-gp-glyph]")!;
    const visGlyph = section.querySelector<SVGTextElement>("[data-gp-vis-glyph]")!;
    const marks = section.querySelector<SVGGElement>("[data-gp-marks]")!;
    const choices = section.querySelector<HTMLElement>("[data-gp-choices]")!;
    const buttons = Array.from(choices.querySelectorAll<HTMLButtonElement>("button"));
    const picker = section.querySelector<HTMLSelectElement>("[data-gp-select]")!;
    const root = scrollParent(section);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    let disposed = false, raf = 0, dirty = true, active = true, ready = false;
    let W = 1, H = 1, travel = 1, startScale = 1, endScale = 1;
    let center = { x: 0, y: 0 }, target: Ink | null = null;
    let lastProgress = -1;
    let candidates: Ink[] = [], letters: Letter[] = [];
    let choosing = false;
    let bounds = { x: 0, y: 0, width: 1, height: 1 };
    let fontDirty = true;

    const activeFont = fontFamily || DEFAULT_FONT;
    glyph.style.fontFamily = activeFont;
    if (visGlyph) visGlyph.style.fontFamily = activeFont;

    const readInk = () => {
      if (!context) return false;
      const font = getComputedStyle(glyph);
      const usedFont = `${font.fontWeight || weight} 100px ${font.fontFamily || DEFAULT_FONT}`;
      const scanFont = `${font.fontWeight || weight} 300px ${font.fontFamily || DEFAULT_FONT}`;
      context.font = usedFont;
      context.fontKerning = "none";
      const metrics = context.measureText(text);
      const advances = Array.from({ length: text.length }, (_, i) => context.measureText(text.slice(0, i)).width);

      bounds = {
        x: -metrics.actualBoundingBoxLeft,
        y: -metrics.actualBoundingBoxAscent,
        width: metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight || metrics.width,
        height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent || 100,
      };
      if (!bounds.width || !bounds.height) return false;
      center = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };

      const requested = focusChar ? text.indexOf(focusChar.normalize("NFC")) : -1;
      let offset = 0;
      candidates = [];
      letters = [];

      for (const char of Array.from(text)) {
        context.font = usedFont;
        const m = context.measureText(char);
        const lWidth = m.actualBoundingBoxLeft + m.actualBoundingBoxRight || m.width || 60;
        const lHeight = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent || 80;
        letters.push({
          index: offset,
          x: advances[offset] - (m.actualBoundingBoxLeft || 0),
          y: -(m.actualBoundingBoxAscent || 70),
          width: lWidth,
          height: lHeight,
        });

        const found = interior(context, char, scanFont);
        if (found) {
          candidates.push({ ...found, x: found.x + advances[offset], index: offset });
        }
        offset += char.length;
      }

      if (candidates.length === 0 && letters.length > 0) {
        letters.forEach((l) => {
          candidates.push({
            x: l.x + l.width / 2,
            y: l.y + l.height / 2,
            radius: Math.max(15, Math.min(l.width, l.height) / 3),
            index: l.index,
          });
        });
      }

      target =
        candidates.find((candidate) => candidate.index === requested) ??
        [...candidates].sort(
          (a, b) => b.radius - a.radius || Math.abs(a.x - center.x) - Math.abs(b.x - center.x)
        )[0] ??
        null;

      if (!target && letters.length > 0) {
        const first = letters[0];
        target = {
          x: first.x + first.width / 2,
          y: first.y + first.height / 2,
          radius: Math.max(15, Math.min(first.width, first.height) / 3),
          index: first.index,
        };
      }

      if (!target) {
        target = {
          x: bounds.x + bounds.width * 0.5,
          y: bounds.y + bounds.height * 0.5,
          radius: Math.max(15, (bounds.height || 100) / 3),
          index: 0,
        };
      }

      return true;
    };

    const select = (next: Ink | null) => {
      target = next;
      endScale = target
        ? Math.max(startScale * 12, Math.hypot(W, H) / (Math.max(8, target.radius) * 1.1))
        : startScale * 12;
      section.dataset.gpFocus = target ? Array.from(text.slice(target.index))[0] : "";
      section.dataset.gpFocusIndex = String(target?.index ?? -1);

      for (const button of buttons) {
        const bIndex = Number(button.dataset.gpLetter);
        const selected = bIndex === target?.index;
        button.disabled = !candidates.some((candidate) => candidate.index === bIndex);
        button.setAttribute("aria-checked", String(selected));
        button.tabIndex = selected ? 0 : -1;
      }

      if (picker && picker.value !== "") picker.value = String(target?.index ?? -1);
      if (picker) {
        for (const option of Array.from(picker.options)) {
          option.disabled =
            option.value === "" ||
            !candidates.some((candidate) => candidate.index === Number(option.value));
        }
      }

      const u = 1 / Math.max(0.001, startScale);
      const y = bounds.y + bounds.height + 25 * u;
      const x = bounds.x;
      const right = x + bounds.width;
      const cross = target
        ? `M${target.x - 9 * u} ${target.y}h${18 * u}M${target.x} ${target.y - 9 * u}v${18 * u}`
        : "";
      const annotationPath = marks?.querySelector("path");
      if (annotationPath) {
        annotationPath.setAttribute(
          "d",
          `M${x} ${y}H${right}M${x} ${y - 5 * u}v${10 * u}M${right} ${y - 5 * u}v${10 * u}${cross}`
        );
        annotationPath.setAttribute("stroke-width", String(u));
      }
    };

    const position = () => {
      const origin = root ? root.getBoundingClientRect().top + root.clientTop : 0;
      const currentTop = section.getBoundingClientRect().top;
      // Travel is the pinning distance: (length - 1) * H
      return clamp((origin - currentTop) / Math.max(1, travel));
    };

    const paint = (progress: number) => {
      const isStatic = motion.matches || !target;
      const p = isStatic ? 0 : progress;
      const t = clamp(p / 0.72);
      const eased = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
      const scale = Math.exp(Math.log(startScale) + Math.log(endScale / startScale) * eased);
      const blend =
        endScale === startScale ? 0 : (1 / scale - 1 / startScale) / (1 / endScale - 1 / startScale);
      const cx = center.x + ((target?.x ?? center.x) - center.x) * blend;
      const cy = center.y + ((target?.y ?? center.y) - center.y) * blend;
      const roll = -3 * smooth(0.06, 0.5, t) * (1 - smooth(0.62, 0.92, t));

      // Standard SVG transform on <g> elements supported across ALL browsers
      const svgTransform = `translate(${W / 2} ${H * 0.46 + H * 0.04 * eased}) scale(${scale}) rotate(${roll}) translate(${-cx} ${-cy})`;

      if (clipGroup) clipGroup.setAttribute("transform", svgTransform);
      if (visGroup) {
        visGroup.setAttribute("transform", svgTransform);
        // Fade visible text as camera enters ink
        visGroup.style.opacity = String(1 - smooth(0.02, 0.45, p));
      }
      if (marks) {
        marks.setAttribute("transform", svgTransform);
        marks.style.opacity = String(1 - smooth(0.015, 0.17, p));
      }

      choosing = interactive && !isStatic && p < 0.05;
      choices.inert = !choosing;
      section.dataset.gpChoosing = String(choosing);

      // Open to full field once camera is deep inside
      field.style.clipPath = t >= 0.95 ? "none" : `url(#${clipId})`;
      section.style.setProperty("--gp-caption", String(1 - smooth(0.01, 0.15, p)));
      section.style.setProperty("--gp-reveal", String(isStatic ? 1 : smooth(0.25, 0.68, p)));
      section.style.setProperty("--gp-field-scale", String(1 + 0.18 * smooth(0, 0.85, p)));
      section.style.setProperty("--gp-caption-hit", p < 0.06 ? "auto" : "none");
      section.dataset.gpEntered = String(p >= 0.65);
      section.dataset.gpProgress = p.toFixed(5);

      if (p !== lastProgress) {
        lastProgress = p;
        progressRef.current?.(p);
      }
    };

    const layout = () => {
      if (!section.clientWidth) return;
      W = pin.clientWidth || section.clientWidth;
      const smallViewport =
        section.querySelector<HTMLElement>("[data-gp-viewport]")?.offsetHeight || window.innerHeight;
      const viewportHeight = Math.max(1, Math.min(root?.clientHeight ?? smallViewport, smallViewport));
      H = motion.matches ? Math.min(viewportHeight * 0.75, 480) : viewportHeight;
      section.style.setProperty("--gp-height", `${H}px`);

      const isMobile = window.innerWidth < 768;
      const currentLength = isMobile ? Math.min(1.35, length) : length;
      section.style.setProperty("--gp-length", String(currentLength));

      // Critical: travel matches the exact sticky duration: (currentLength - 1) * H
      travel = H * Math.max(0.35, currentLength - 1);
      art.setAttribute("viewBox", `0 0 ${W} ${H}`);

      if (fontDirty) {
        ready = readInk();
        fontDirty = false;
      }
      if (!ready) return;

      const wordHeight = hasFront && H < 480 ? Math.min(H * 0.38, Math.max(24, H - 264)) : H * 0.38;
      startScale = Math.min((W * 0.86) / bounds.width, wordHeight / bounds.height);
      select(target);

      for (const button of buttons) {
        const letter = letters.find((item) => item.index === Number(button.dataset.gpLetter));
        if (letter) {
          Object.assign(button.style, {
            left: `${W / 2 + (letter.x - center.x) * startScale}px`,
            top: `${
              H * 0.46 +
              (letter.y - center.y) * startScale -
              Math.max(0, 44 - letter.height * startScale) / 2
            }px`,
            width: `${Math.max(1, letter.width * startScale)}px`,
            height: `${Math.max(44, letter.height * startScale)}px`,
          });
        }
      }

      section.style.setProperty("--gp-word-top", `${H * 0.46 - (bounds.height * startScale) / 2}px`);
      section.style.setProperty("--gp-word-bottom", `${H * 0.46 + (bounds.height * startScale) / 2}px`);
      section.dataset.gpReady = "true";
      section.dataset.gpMotion = !motion.matches && target ? "on" : "off";
    };

    // Continuous 60/120fps requestAnimationFrame loop while visible in viewport
    const tick = () => {
      if (disposed) return;
      if (active) {
        if (dirty) {
          dirty = false;
          layout();
        }
        if (ready) {
          paint(position());
        }
        raf = requestAnimationFrame(tick);
      }
    };

    const triggerResize = () => {
      dirty = true;
      fontDirty = true;
      if (active && !raf) raf = requestAnimationFrame(tick);
    };

    const choose = (event: Event) => {
      if (!choosing || position() >= 0.05) return;
      const button = (event.target as Element).closest<HTMLButtonElement>("[data-gp-letter]");
      const next = candidates.find((candidate) => candidate.index === Number(button?.dataset.gpLetter));
      if (!next || next === target) return;
      select(next);
      paint(position());
    };

    const navigate = (event: KeyboardEvent) => {
      if (!choosing || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key))
        return;
      event.preventDefault();
      const current = candidates.indexOf(target!);
      const index =
        event.key === "Home"
          ? 0
          : event.key === "End"
          ? candidates.length - 1
          : (current +
              (event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1) +
              candidates.length) %
            candidates.length;
      buttons
        .find((button) => Number(button.dataset.gpLetter) === candidates[index].index)
        ?.focus({ preventScroll: true });
    };

    const pick = () => {
      if (!choosing || position() >= 0.05) return;
      const next = candidates.find((candidate) => candidate.index === Number(picker.value));
      if (next) {
        select(next);
        paint(position());
      }
    };

    choices.addEventListener("pointerover", choose);
    choices.addEventListener("click", choose);
    choices.addEventListener("focusin", choose);
    choices.addEventListener("keydown", navigate);
    if (picker) picker.addEventListener("change", pick);

    const observer = new ResizeObserver(triggerResize);
    observer.observe(section);
    if (root) observer.observe(root);

    const visibility = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active) {
          dirty = true;
          if (!raf) raf = requestAnimationFrame(tick);
        } else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { root, rootMargin: "100% 0px" }
    );
    visibility.observe(section);

    const onScroll = () => {
      if (ready && active) {
        paint(position());
      }
    };

    (root ?? window).addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", triggerResize);
    window.visualViewport?.addEventListener("resize", triggerResize);
    motion.addEventListener("change", triggerResize);
    document.fonts?.ready?.then(() => {
      triggerResize();
    });

    layout();
    paint(position());

    layout();
    if (ready) paint(position());
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      visibility.disconnect();
      (root ?? window).removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", triggerResize);
      window.visualViewport?.removeEventListener("resize", triggerResize);
      motion.removeEventListener("change", triggerResize);
      choices.removeEventListener("pointerover", choose);
      choices.removeEventListener("click", choose);
      choices.removeEventListener("focusin", choose);
      choices.removeEventListener("keydown", navigate);
      if (picker) picker.removeEventListener("change", pick);
    };
  }, [text, focusChar, interactive, fontFamily, weight, length, clipId, hasFront]);

  const handleStepInsideClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const contentEl = document.getElementById(`${uid}-content`);
    if (contentEl) {
      contentEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      id={uid}
      className={className}
      aria-label={text}
      style={{
        "--gp-length": length,
        "--gp-characters": Array.from(text).length,
        ...style,
      } as CSSProperties}
    >
      <style>{`
        ${q}{--gp-paper:#faf7f2;--gp-ink:#0a1735;--gp-field:#070e20;--gp-foreground:#ffffff;position:relative;isolation:isolate;background:var(--gp-paper);color:var(--gp-ink);font-family:Arial,sans-serif;}
        ${q}>[data-gp-viewport]{position:absolute;inset:0 auto auto 0;height:100vh;height:100svh;width:0;pointer-events:none;visibility:hidden;}
        ${q} [data-gp-pin]{position:relative;height:var(--gp-height,100svh);overflow:clip;isolation:isolate;container-type:size;z-index:10;}
        ${q} [data-gp-field]{position:absolute;inset:0;background:var(--gp-field);opacity:0;pointer-events:none;}
        ${q}[data-gp-ready] [data-gp-field]{opacity:1;}
        ${q} [data-gp-art]{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:5;}
        ${q} [data-gp-marks]{fill:none;stroke:var(--gp-ink);opacity:.6;}
        ${q} [data-gp-choices]{position:absolute;inset:0;visibility:hidden;pointer-events:none;z-index:20;}
        ${q}[data-gp-choosing=true] [data-gp-choices]{visibility:visible;}
        ${q} [data-gp-letter]{box-sizing:border-box;position:absolute;border:0;padding:0;margin:0;background:transparent;cursor:pointer;pointer-events:auto;touch-action:pan-y;border-radius:8px;}
        ${q} [data-gp-letter]:hover{background:rgba(124,58,237,0.12);}
        ${q} [data-gp-letter]:disabled{pointer-events:none;}
        ${q} [data-gp-letter]:focus-visible{outline:2px solid var(--gp-field);outline-offset:5px;}
        ${q} [data-gp-touch-picker]{display:none;position:absolute;top:calc(var(--gp-word-bottom,50%) + 42px);left:50%;transform:translateX(-50%);font:12px/1.4 Arial,sans-serif;align-items:center;gap:12px;visibility:hidden;z-index:25;}
        ${q}[data-gp-choosing=true] [data-gp-touch-picker]{visibility:visible;}
        ${q} [data-gp-select]{min-height:44px;min-width:90px;border:1px solid #d8deda;border-radius:4px;background:var(--gp-paper);color:var(--gp-ink);padding:0 10px;font:inherit;}
        ${q} [data-gp-select]:focus-visible{outline:2px solid var(--gp-field);outline-offset:4px;}
        @media(any-pointer:coarse){${q} [data-gp-touch-picker]{display:flex;}}
        ${q} [data-gp-fallback]{position:absolute;inset:0;display:none;place-items:center;font-size:min(calc(100cqw / var(--gp-characters)),38cqh);line-height:1;color:var(--gp-field);}
        ${q}[data-gp-ready] [data-gp-fallback]{visibility:hidden;}
        ${q} [data-gp-caption]{position:absolute;inset:auto 8% 8%;display:flex;align-items:center;justify-content:space-between;gap:1rem;font:13px/1.4 Arial,sans-serif;opacity:var(--gp-caption,1);pointer-events:var(--gp-caption-hit,auto);z-index:20;}
        ${q} [data-gp-caption]{font-family:inherit;}
        ${q} [data-gp-front]{position:absolute;inset:0;opacity:var(--gp-caption,1);pointer-events:none;z-index:15;}
        ${q} [data-gp-front] a,${q} [data-gp-front] button{pointer-events:var(--gp-caption-hit,auto);}
        ${q} [data-gp-front]:focus-within{opacity:1;}
        ${q} [data-gp-hint]{max-width:32ch;color:var(--gp-ink);font-weight:600;}
        ${q} [data-gp-enter]{display:inline-flex;align-items:center;gap:10px;padding:10px 22px;border-radius:9999px;background:white;color:var(--gp-ink);box-shadow:0 4px 14px rgba(0,0,0,0.08);border:1px solid rgba(10,23,53,0.12);font-weight:700;font-size:13px;text-decoration:none;transition:all 0.2s ease;}
        ${q} [data-gp-enter]:hover{background:var(--gp-ink);color:white;}
        ${q} [data-gp-enter]:focus-visible{outline:2px solid currentColor;outline-offset:4px;}
        ${q} [data-gp-caption]:focus-within{opacity:1;pointer-events:auto;}
        ${q} [data-gp-content]{box-sizing:border-box;position:relative;min-height:var(--gp-height,100svh);padding:clamp(32px,7%,100px);display:grid;align-content:center;color:var(--gp-foreground);background:var(--gp-field);overflow-wrap:anywhere;z-index:30;}
        ${q}[data-gp-motion=on] [data-gp-pin]{position:sticky;top:0;}
        ${q}[data-gp-motion=off] [data-gp-hint]{display:none;}
        ${q}[data-gp-motion=on] [data-gp-content]{margin-top:calc((var(--gp-length) - 1) * var(--gp-height));background:transparent;opacity:var(--gp-reveal,0);pointer-events:none;}
        ${q}[data-gp-motion=on][data-gp-entered=true] [data-gp-content]{pointer-events:auto;}
        ${q}[data-gp-motion=on]:has([data-gp-content]:focus-within) [data-gp-field]{clip-path:none!important;}
        ${q}[data-gp-motion=on] [data-gp-content]:focus-within{opacity:1;pointer-events:auto;}
        ${q}:has([data-gp-content]:focus-within) [data-gp-caption],${q}:has([data-gp-content]:focus-within) [data-gp-marks]{opacity:0;}
        @media(prefers-reduced-motion:reduce){${q} [data-gp-pin]{position:relative!important;} ${q} [data-gp-content]{margin-top:0!important;opacity:1!important;background:var(--gp-field)!important;min-height:0;padding-block:64px;} ${q} [data-gp-caption]{opacity:1!important;}}
        @media(prefers-reduced-motion:reduce){${q} [data-gp-hint]{display:none;}}
      `}</style>

      <noscript>
        <style>{`${q} [data-gp-fallback]{display:grid}${q} [data-gp-hint]{display:none}`}</style>
      </noscript>
      <div data-gp-viewport aria-hidden="true" />
      <div data-gp-pin>
        <div data-gp-field aria-hidden="true" inert>
          {background ?? (
            <div
              data-gp-default-field
              style={{
                position: "absolute",
                inset: 0,
                transform: "scale(var(--gp-field-scale,1))",
                background:
                  "radial-gradient(circle at 20% 20%, rgba(124,58,237,.75), transparent 40%), linear-gradient(145deg,#0a1735 0%,#10265c 50%,#070e20 100%)",
              }}
            />
          )}
        </div>
        <svg data-gp-art aria-hidden="true" focusable="false">
          <defs>
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <g data-gp-clip-group>
                <text
                  data-gp-glyph
                  x="0"
                  y="0"
                  style={{
                    fontFamily,
                    fontWeight: weight,
                    fontSize: 100,
                    fontKerning: "none",
                    fontVariantLigatures: "none",
                    letterSpacing: 0,
                  }}
                >
                  {text}
                </text>
              </g>
            </clipPath>
          </defs>
          <g data-gp-vis-group>
            <text
              data-gp-vis-glyph
              x="0"
              y="0"
              style={{
                fontFamily,
                fontWeight: weight,
                fontSize: 100,
                fontKerning: "none",
                fontVariantLigatures: "none",
                letterSpacing: 0,
                fill: "var(--gp-ink)",
              }}
            >
              {text}
            </text>
          </g>
          <g data-gp-marks style={{ visibility: annotations ? "visible" : "hidden" }}>
            <path />
          </g>
        </svg>
        <div
          data-gp-choices
          role="radiogroup"
          aria-label="Choose the letter to enter through"
          inert
        >
          {characters.map(({ char, index }, i) => (
            <button
              type="button"
              role="radio"
              aria-checked="false"
              tabIndex={-1}
              data-gp-letter={index}
              key={index}
              aria-label={`${char}, letter ${i + 1} of ${characters.length}`}
            />
          ))}
        </div>
        <label data-gp-touch-picker>
          <span
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
              clipPath: "inset(50%)",
            }}
          >
            Entry letter
          </span>
          <select data-gp-select defaultValue="">
            <option value="" disabled>
              Choose a letter
            </option>
            {characters.map(({ char, index }, i) => (
              <option key={index} value={index}>
                {i + 1} · {char}
              </option>
            ))}
          </select>
        </label>
        {front && <div data-gp-front>{front}</div>}
        <span
          data-gp-fallback
          aria-hidden="true"
          style={{ fontFamily, fontWeight: weight }}
        >
          {text}
        </span>
        <div data-gp-caption>
          <span data-gp-hint aria-hidden="true">
            {interactive
              ? "Scroll down to zoom inside the brand"
              : annotations
              ? "A passage through type"
              : ""}
          </span>
          <a data-gp-enter href={`#${uid}-content`} onClick={handleStepInsideClick}>
            {enterLabel}
            <span aria-hidden="true">↘</span>
          </a>
        </div>
      </div>
      <div data-gp-content id={`${uid}-content`} tabIndex={-1}>
        {children ?? (
          <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
            <h2
              style={{
                color: "inherit",
                fontSize: "clamp(32px, 5vw, 64px)",
                lineHeight: 1.1,
                margin: "0 0 20px",
              }}
            >
              A letter becomes a place.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 18, margin: 0 }}>
              The shape opens onto whatever comes next.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
