"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

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

const NAV_LINKS = [
  { href: "/about", label: "Roots", sw: "Mizizi" },
  { href: "/services", label: "What we build", sw: "Tunachojenga" },
  { href: "/platforms", label: "Platforms", sw: "Mifumo" },
  { href: "/process", label: "Process", sw: "Mchakato" },
  { href: "/pricing", label: "Pricing", sw: "Bei" },
  { href: "/impact", label: "Impact", sw: "Athari" },
  { href: "/blog", label: "Blog", sw: "Makala" },
  { href: "/portal", label: "Portal", sw: "Mradi Wako" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  // Scroll progress bar
  useEffect(() => {
    const bar = document.getElementById("scrollProgress");
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.width = (window.scrollY / h) * 100 + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* Scroll progress */}
      <div
        id="scrollProgress"
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-viol via-violL to-deep z-[140] w-0 transition-[width] duration-150"
      />

      <header className="fixed top-0 left-0 right-0 z-[100]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8">
          <div
            className={`mt-4 rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between transition-all duration-500 border ${
              scrolled
                ? "bg-white/85 backdrop-blur-xl border-deep/10 shadow-lg shadow-deep/5"
                : "bg-transparent border-transparent"
            }`}
          >
            <TransitionLink href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl relative overflow-hidden border border-deep/10 p-1 bg-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Altraware logo" width={40} height={40} decoding="async" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="leading-none">
                <div className="font-grotesk font-bold tracking-tight text-[15px]">ALTRAWARE</div>
                <div className="text-[9px] tracking-[0.32em] font-grotesk text-deep/60 font-medium">
                  TECHNOLOGY · DSM
                </div>
              </div>
            </TransitionLink>

            <nav className="hidden lg:flex items-center gap-6 text-[13px] font-medium">
              {NAV_LINKS.map((l) => (
                <TransitionLink
                  key={l.href}
                  href={l.href}
                  className={`link-underline transition-colors hover:text-viol ${
                    pathname === l.href ? "text-viol font-semibold" : ""
                  }`}
                >
                  {l.label}
                </TransitionLink>
              ))}
            </nav>

            <div className="flex items-center gap-2.5">
              <TransitionLink
                href="/contact"
                className="btn-magnetic hidden sm:inline-flex items-center gap-2 bg-deep text-white text-[13px] font-semibold px-5 py-2.5 rounded-full"
              >
                Start a project <i className="fa-solid fa-arrow-right text-[11px]" />
              </TransitionLink>
              <button
                className="lg:hidden w-10 h-10 rounded-full bg-deep text-white flex items-center justify-center"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
              >
                <i className="fa-solid fa-bars" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu — clip-path circle reveal */}
      <div
        id="mobileMenu"
        className={`fixed inset-0 z-[95] bg-deep text-white flex flex-col justify-center px-8 ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="noise-blue absolute inset-0" />
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-7 right-7 w-11 h-11 rounded-full border border-white/20 flex items-center justify-center"
          aria-label="Close menu"
        >
          <i className="fa-solid fa-xmark" />
        </button>
        <div className="relative space-y-2">
          <div className="eyebrow text-violL mb-6">Navigation — Menyu</div>
          {[
            { href: "/", num: "01", en: "Home", sw: "Nyumbani" },
            ...NAV_LINKS.map((l, i) => ({ href: l.href, num: `0${i + 2}`, en: l.label, sw: l.sw })),
            { href: "/contact", num: "10", en: "Start a project", sw: "Wasiliana" },
          ].map((l) => (
            <TransitionLink
              key={l.href + l.num}
              href={l.href}
              className="block display text-3xl sm:text-4xl py-2 hover:text-violL transition-colors"
            >
              {l.num} · {l.en} <span className="text-base font-sans opacity-40">({l.sw})</span>
            </TransitionLink>
          ))}
        </div>
      </div>
    </>
  );
}