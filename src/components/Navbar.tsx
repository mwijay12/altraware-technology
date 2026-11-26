"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

/* --- scroll store: the listener owns the value, React only reads it --- */
let scrollListeners: Array<() => void> = [];
function emitScroll() {
  for (const l of scrollListeners) l();
}
function subscribeScroll(cb: () => void) {
  scrollListeners = [...scrollListeners, cb];
  return () => {
    scrollListeners = scrollListeners.filter((l) => l !== cb);
  };
}
function getScrolled() {
  return typeof document !== "undefined" && document.documentElement.dataset.scrolled === "1";
}
import { useVisitorCurrency } from "@/lib/geo-pricing";
import ThemeToggle from "@/components/ThemeToggle";

/* ============================================================
   TransitionLink — plays the violet curtain page transition
   before navigating, so dedicated pages still feel premium.
   ============================================================ */

const TRANS_WORDS: Record<string, string> = {
  "/": "Welcome",
  "/about": "Roots",
  "/services": "Craft",
  "/platforms": "Platforms",
  "/process": "Process",
  "/impact": "Impact",
  "/pricing": "Pricing",
  "/blog": "Journal",
  "/contact": "Let's Build",
};

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
      if (href.includes("#")) return; // let anchor links behave natively
      e.preventDefault();
      if (busy.current || href === pathname) return;
      busy.current = true;
      const overlay = document.getElementById("page-transition");
      const word = document.getElementById("transitionWord");
      if (word) word.textContent = TRANS_WORDS[href] ?? "Let's Go";
      overlay?.classList.add("active");
      import("gsap").then(({ gsap }) => {
        const tl = gsap.timeline();
        tl.set(".curtain-col-viol, .curtain-col-deep", { transformOrigin: "bottom" })
          .to(".curtain-col-viol", {
            scaleY: 1,
            duration: 0.45,
            stagger: 0.045,
            ease: "power3.inOut",
          })
          .to(
            ".curtain-col-deep",
            {
              scaleY: 1,
              duration: 0.5,
              stagger: 0.045,
              ease: "power3.inOut",
            },
            "-=0.38"
          )
          .to("#transitionCenter", { opacity: 1, duration: 0.25, ease: "power2.out" }, "-=0.2")
          .add(() => {
            router.push(href);
            window.setTimeout(() => {
              window.scrollTo({ top: 0 });
            }, 60);
          })
          .to("#transitionCenter", { opacity: 0, duration: 0.2, ease: "power2.in" }, "+=0.15")
          .set(".curtain-col-viol, .curtain-col-deep", { transformOrigin: "top" })
          .to(".curtain-col-deep", {
            scaleY: 0,
            duration: 0.5,
            stagger: 0.045,
            ease: "power3.inOut",
          })
          .to(
            ".curtain-col-viol",
            {
              scaleY: 0,
              duration: 0.45,
              stagger: 0.045,
              ease: "power3.inOut",
            },
            "-=0.38"
          )
          .add(() => {
            overlay?.classList.remove("active");
            busy.current = false;
          });
      });
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
   Navbar — transparent floating pill, sits below the top edge;
   turns into a frosted glass bar once you scroll past the hero.
   ============================================================ */

/* Six links, not eight. A bar carrying the whole site map at 13px is a
   wall of text; Process and Portal live one level down. */
const NAV_LINKS = [
  { href: "/about", label: "Roots" },
  { href: "/services", label: "What we build" },
  { href: "/platforms", label: "Platforms" },
  { href: "/pricing", label: "Pricing" },
  { href: "/impact", label: "Impact" },
  { href: "/blog", label: "Blog" },
];

/* The full map still exists — for the mobile sheet and the footer. */
const NAV_ALL = [
  { href: "/", num: "01", en: "Home", sw: "Nyumbani" },
  { href: "/about", num: "02", en: "Roots", sw: "Mizizi" },
  { href: "/services", num: "03", en: "What we build", sw: "Tunachojenga" },
  { href: "/platforms", num: "04", en: "Platforms", sw: "Mifumo" },
  { href: "/process", num: "05", en: "Process", sw: "Mchakato" },
  { href: "/pricing", num: "06", en: "Pricing", sw: "Bei" },
  { href: "/impact", num: "07", en: "Impact", sw: "Athari" },
  { href: "/blog", num: "08", en: "Blog", sw: "Makala" },
  { href: "/portal", num: "09", en: "Portal", sw: "Mradi Wako" },
  { href: "/contact", num: "10", en: "Start a project", sw: "Wasiliana" },
];

export default function Navbar() {
  const pathname = usePathname();
  const scrolled = useSyncExternalStore(subscribeScroll, getScrolled, () => false);
  const [menuOpen, setMenuOpen] = useState(false);
  const geo = useVisitorCurrency();

  useEffect(() => {
    // Scroll state is written to the DOM by the listener itself and read back
    // with useSyncExternalStore. Calling setState synchronously inside an
    // effect is rejected by this Next version's lint rules (and causes
    // cascading renders), so the subscription owns the value.
    const root = document.documentElement;
    const sync = () => {
      const y = window.scrollY;
      root.dataset.scrolled = y > 24 ? "1" : "0";
      const bar = document.getElementById("scrollProgress");
      if (bar) {
        const h = root.scrollHeight - window.innerHeight;
        bar.style.width = h > 0 ? `${(y / h) * 100}%` : "0%";
      }
      emitScroll();
    };
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    };
    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Lock the page behind the mobile sheet.
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  if (pathname?.startsWith("/admin")) return null;

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* scroll progress — a hairline, not a gradient ribbon */}
      <div className="fixed top-0 left-0 right-0 h-px z-[140] bg-transparent">
        <div
          id="scrollProgress"
          className="h-full w-0 bg-jewel transition-[width] duration-150 ease-out"
        />
      </div>

      <header className="fixed top-0 left-0 right-0 z-[100]">
        <div className="u-wrap">
          <div
            className={`mt-3 md:mt-4 flex items-center justify-between gap-4 rounded-full border px-3 md:px-4 py-2 transition-all duration-500 ${
              scrolled
                ? "border-wire bg-noir/85 backdrop-blur-xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.8)]"
                : "border-transparent bg-transparent"
            }`}
          >
            <TransitionLink
              href="/"
              className="flex items-center gap-2.5 shrink-0"
              aria-label="Altraware — home"
            >
              <span className="w-9 h-9 rounded-full overflow-hidden border border-wire bg-noir2 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt=""
                  width={36}
                  height={36}
                  decoding="async"
                  className="w-full h-full object-contain p-1"
                />
              </span>
              <span className="leading-none select-none">
                <span className="block font-display font-extrabold text-[13px] tracking-[-0.02em] text-bone">
                  ALTRAWARE
                </span>
                <span className="block u-label text-[8px] mt-1 text-ash">
                  TECHNOLOGY · DSM
                </span>
              </span>
            </TransitionLink>

            <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
              {NAV_LINKS.map((l) => {
                const active = isActive(l.href);
                return (
                  <TransitionLink
                    key={l.href}
                    href={l.href}
                    data-active={active || undefined}
                    className={`u-nav-link relative px-3.5 py-2 rounded-full transition-colors ${
                      active ? "text-bone" : "hover:text-bone"
                    }`}
                  >
                    {l.label}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute left-3.5 right-3.5 -bottom-0.5 h-px bg-jewel"
                      />
                    )}
                  </TransitionLink>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              <div
                className="hidden md:inline-flex items-center rounded-full border border-wire bg-noir2/70 p-0.5 text-[10px] font-medium"
                aria-label="Currency"
              >
                {(["TZS", "USD"] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => geo.setCurrency(c)}
                    aria-pressed={geo.currency === c}
                    className={`px-2.5 py-1 rounded-full transition-colors ${
                      geo.currency === c ? "bg-bone text-noir" : "text-ash hover:text-bone"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <ThemeToggle className="hidden md:inline-flex" />

              <TransitionLink
                href="/contact"
                className="hidden sm:inline-flex items-center gap-2 rounded-full bg-bone text-noir px-4 py-2 text-[12px] font-medium tracking-tight transition-colors hover:bg-jewel hover:text-white"
              >
                Start a project
                <span aria-hidden="true" className="text-[10px]">→</span>
              </TransitionLink>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                className="lg:hidden w-9 h-9 rounded-full border border-wire text-bone flex items-center justify-center hover:border-bone/40 transition-colors"
              >
                <span aria-hidden="true" className="flex flex-col gap-[3px]">
                  <span className="block w-3.5 h-px bg-current" />
                  <span className="block w-3.5 h-px bg-current" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        id="mobileMenu"
        className={`fixed inset-0 z-[95] bg-noir flex flex-col justify-center transition-all duration-500 ${
          menuOpen ? "open opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="u-wrap">
          <div className="flex items-center justify-between mb-10">
            <span className="u-label">Navigation — Menyu</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="w-10 h-10 rounded-full border border-wire flex items-center justify-center text-bone"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          <nav className="space-y-1" aria-label="All pages">
            {NAV_ALL.map((l) => (
              <TransitionLink
                key={l.href + l.num}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-baseline gap-4 py-2.5 border-b border-wire/60 transition-colors ${
                  isActive(l.href) ? "text-bone" : "text-bone/70 hover:text-bone"
                }`}
              >
                <span className="u-label w-6 shrink-0">{l.num}</span>
                <span className="font-display font-bold uppercase tracking-tight text-xl">
                  {l.en}
                </span>
                <span className="u-label ml-auto text-ash">{l.sw}</span>
              </TransitionLink>
            ))}
          </nav>

          <div className="pt-7 mt-6 border-t border-wire flex items-center justify-between gap-4">
            <span className="u-label">Currency / Sarafu</span>
            <div className="inline-flex items-center rounded-full border border-wire bg-noir2 p-0.5 text-xs">
              {(["TZS", "USD"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => geo.setCurrency(c)}
                  aria-pressed={geo.currency === c}
                  className={`px-3 py-1.5 rounded-full transition-colors ${
                    geo.currency === c ? "bg-bone text-noir" : "text-ash"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Theme was desktop-only; on a phone it is the only way to reach
              light mode, so it belongs in the sheet. */}
          <div className="pt-5 flex items-center justify-between md:hidden">
            <span className="u-label">Theme / Mwonekano</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}
