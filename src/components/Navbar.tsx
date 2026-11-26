"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useVisitorCurrency } from "@/lib/geo-pricing";

/* ============================================================
   TransitionLink — 180ms ink wipe. One motion, no logo, no
   word, no curtain columns. Navigation should feel like a
   page turn, not a title sequence.
   ============================================================ */

export function TransitionLink({
  href,
  children,
  className,
  onClick,
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
} & Omit<React.ComponentProps<"a">, "href" | "onClick">) {
  const router = useRouter();
  const pathname = usePathname();
  const busy = useRef(false);

  const go = useCallback(
    (e: React.MouseEvent) => {
      if (href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel")) return;
      if (href.includes("#")) return;
      e.preventDefault();
      if (busy.current || href === pathname) return;
      busy.current = true;
      const overlay = document.getElementById("page-transition");
      overlay?.classList.add("active");
      const veil = document.getElementById("inkVeil");
      if (veil) {
        veil.style.transition = "transform .18s cubic-bezier(.65,0,.35,1)";
        veil.style.transformOrigin = "bottom";
        veil.style.transform = "scaleY(1)";
      }
      window.setTimeout(() => {
        router.push(href);
        window.setTimeout(() => {
          window.scrollTo({ top: 0 });
          if (veil) {
            veil.style.transformOrigin = "top";
            veil.style.transform = "scaleY(0)";
          }
          overlay?.classList.remove("active");
          busy.current = false;
        }, 120);
      }, 190);
    },
    [href, pathname, router]
  );

  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) go(e);
      }}
      className={className}
      {...(rest as object)}
    >
      {children}
    </Link>
  );
}

/* ============================================================
   Navbar — a masthead on paper: wordmark left, section index
   centre, one action right. Hairline appears on scroll.
   ============================================================ */

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/platforms", label: "Platforms" },
  { href: "/process", label: "Process" },
  { href: "/pricing", label: "Pricing" },
  { href: "/impact", label: "Work" },
  { href: "/about", label: "Studio" },
  { href: "/blog", label: "Notes" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const geo = useVisitorCurrency();

  // The masthead only changes at one threshold. Flip the attribute in the
  // scroll listener (an external system) instead of holding React state,
  // and let CSS do the styling — no cascading renders on scroll.
  useEffect(() => {
    const header = document.getElementById("site-header");
    if (!header) return;
    let frame = 0;
    const sync = () => {
      header.dataset.scrolled = window.scrollY > 24 ? "true" : "false";
      frame = 0;
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(sync);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    sync();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Close the menu whenever the route changes — done in the click
  // handler (see mobile nav links) instead of an effect, so React
  // never has to cascade a render just to hide a sheet.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      {/* Scroll progress: a 1px clay thread, not a gradient bar */}
      <div
        id="scrollProgress"
        className="fixed top-0 left-0 h-px bg-clay z-[140] w-0"
        aria-hidden
      />

      {/* data-scrolled is written by the scroll listener, never by render,
          so a re-render (menu, currency) cannot reset the masthead. */}
      <header id="site-header" className="site-header fixed top-0 left-0 right-0 z-[100]">
        <div className="mx-auto max-w-[1240px] px-[var(--pad)]">
          <div className="h-[68px] md:h-[76px] flex items-center justify-between gap-6">
            {/* Wordmark */}
            <TransitionLink href="/" className="flex items-center gap-2.5 group shrink-0" aria-label="Altraware Technology — home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt=""
                width={26}
                height={26}
                decoding="async"
                className="w-[26px] h-[26px] object-contain"
              />
              <span className="font-grotesk font-medium tracking-[-0.01em] text-[17px] leading-none">
                Altraware
              </span>
              <span className="hidden xl:inline label !text-[10px] !tracking-[0.14em] text-ink-3 border-l border-rule pl-2.5 ml-1">
                Dar es Salaam
              </span>
            </TransitionLink>

            {/* Section index */}
            <nav className="hidden lg:flex items-center gap-6 text-[14px] text-ink-2" aria-label="Sections">
              {NAV_LINKS.map((l) => (
                <TransitionLink
                  key={l.href}
                  href={l.href}
                  className={`link-underline transition-colors hover:text-ink ${
                    pathname === l.href ? "text-ink" : ""
                  }`}
                >
                  {l.label}
                </TransitionLink>
              ))}
            </nav>

            <div className="flex items-center gap-3 md:gap-5">
              {/* Currency: plain text toggle, mono, no pill chrome */}
              <div className="hidden sm:flex items-center gap-1.5 num text-[11px] uppercase tracking-[0.06em]">
                <button
                  type="button"
                  onClick={() => geo.setCurrency("TZS")}
                  className={`px-1 py-1 transition-colors ${
                    geo.currency === "TZS" ? "text-ink" : "text-ink-3 hover:text-ink"
                  }`}
                  aria-pressed={geo.currency === "TZS"}
                  title="Prices in Tanzanian Shillings"
                >
                  TSh
                </button>
                <span className="text-rule">/</span>
                <button
                  type="button"
                  onClick={() => geo.setCurrency("USD")}
                  className={`px-1 py-1 transition-colors ${
                    geo.currency === "USD" ? "text-ink" : "text-ink-3 hover:text-ink"
                  }`}
                  aria-pressed={geo.currency === "USD"}
                  title="Prices in US Dollars"
                >
                  USD
                </button>
              </div>

              <TransitionLink
                href="/contact"
                className="hidden sm:inline-flex items-center gap-2 bg-ink text-paper text-[13px] font-medium px-4 py-2.5 rounded-[3px] hover:bg-clay transition-colors"
              >
                Start a project
                <span aria-hidden className="text-[11px]">→</span>
              </TransitionLink>

              <button
                className="lg:hidden w-9 h-9 -mr-1 flex flex-col items-center justify-center gap-[5px]"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
              >
                <span className="block w-5 h-px bg-ink" />
                <span className="block w-5 h-px bg-ink" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu: full paper sheet, indexed like a table of contents */}
      <div
        id="mobileMenu"
        className={`fixed inset-0 z-[95] bg-paper text-ink flex flex-col ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="h-[68px] shrink-0" />
        <div className="px-[var(--pad)] flex-1 overflow-y-auto pb-10">
          <div className="label border-b border-rule pb-3 mb-2">Index</div>
          {[{ href: "/", label: "Home" }, ...NAV_LINKS, { href: "/portal", label: "Client portal" }, { href: "/contact", label: "Start a project" }].map(
            (l, i) => (
              <TransitionLink
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-baseline gap-4 py-3.5 border-b border-rule group"
              >
                <span className="num text-[11px] text-ink-3 w-6">{String(i + 1).padStart(2, "0")}</span>
                <span className="display text-[28px] leading-none group-hover:text-clay transition-colors">
                  {l.label}
                </span>
              </TransitionLink>
            )
          )}

          <div className="mt-8 flex items-center justify-between">
            <span className="label">Currency</span>
            <div className="flex items-center gap-2 num text-[12px]">
              <button
                type="button"
                onClick={() => geo.setCurrency("TZS")}
                className={`px-2 py-1 border rounded-[2px] ${
                  geo.currency === "TZS" ? "border-ink bg-ink text-paper" : "border-rule text-ink-3"
                }`}
              >
                TSh
              </button>
              <button
                type="button"
                onClick={() => geo.setCurrency("USD")}
                className={`px-2 py-1 border rounded-[2px] ${
                  geo.currency === "USD" ? "border-ink bg-ink text-paper" : "border-rule text-ink-3"
                }`}
              >
                USD
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-[var(--pad)] w-9 h-9 flex items-center justify-center text-2xl leading-none"
          aria-label="Close menu"
        >
          ×
        </button>
      </div>
    </>
  );
}
