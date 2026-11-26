"use client";

import { useContent } from "@/components/providers";
import { TransitionLink } from "@/components/Navbar";
import { usePathname } from "next/navigation";

/* ============================================================
   Colophon — not a "footer". Studio address block, index of
   work, and one honest status line. Hairlines, no chrome.
   ============================================================ */

export default function Footer() {
  const pathname = usePathname();
  const { content } = useContent();
  const c = content.contact;
  const year = new Date().getFullYear();
  const wa = `https://wa.me/${c.whatsapp.replace(/[^0-9]/g, "")}`;
  const projects = content.projects.length;
  const shipped = content.projects.filter((p) => p.url?.startsWith("http")).length;

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/portal") || pathname?.startsWith("/client-portal")) {
    return null;
  }

  return (
    <footer className="bg-paper border-t border-rule">
      <div className="mx-auto max-w-[1240px] px-[var(--pad)] pt-14 md:pt-20 pb-8">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-10 md:gap-8">
          {/* Studio block */}
          <div>
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" width={26} height={26} className="w-[26px] h-[26px] object-contain" />
              <span className="font-grotesk font-medium text-[17px] leading-none">Altraware</span>
            </div>
            <p className="text-[15px] text-ink-2 mt-4 leading-relaxed max-w-[34ch]">
              A software studio in Dar es Salaam. We build websites, apps and business systems that
              keep working when the network doesn&apos;t.
            </p>
            <p className="num text-[11px] text-ink-3 mt-5">6.7924° S · 39.2083° E</p>
          </div>

          {/* Index */}
          <nav aria-label="Studio">
            <div className="label mb-4 text-ink-3">Studio</div>
            <ul className="space-y-2.5 text-[14px] text-ink-2">
              <li><TransitionLink href="/about" className="hover:text-ink transition-colors">About</TransitionLink></li>
              <li><TransitionLink href="/process" className="hover:text-ink transition-colors">Process</TransitionLink></li>
              <li><TransitionLink href="/pricing" className="hover:text-ink transition-colors">Pricing</TransitionLink></li>
              <li><TransitionLink href="/impact" className="hover:text-ink transition-colors">Work</TransitionLink></li>
              <li><TransitionLink href="/blog" className="hover:text-ink transition-colors">Notes</TransitionLink></li>
              <li><TransitionLink href="/portal" className="hover:text-ink transition-colors">Client portal</TransitionLink></li>
            </ul>
          </nav>

          {/* Build */}
          <nav aria-label="What we build">
            <div className="label mb-4 text-ink-3">Build</div>
            <ul className="space-y-2.5 text-[14px] text-ink-2">
              <li><TransitionLink href="/services" className="hover:text-ink transition-colors">Websites</TransitionLink></li>
              <li><TransitionLink href="/services" className="hover:text-ink transition-colors">Apps</TransitionLink></li>
              <li><TransitionLink href="/services" className="hover:text-ink transition-colors">Business systems</TransitionLink></li>
              <li><TransitionLink href="/platforms" className="hover:text-ink transition-colors">Faida POS</TransitionLink></li>
              <li><TransitionLink href="/platforms" className="hover:text-ink transition-colors">CareTrack</TransitionLink></li>
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <div className="label mb-4 text-ink-3">Talk to us</div>
            <ul className="space-y-3 text-[14px] text-ink-2">
              <li>
                <a href={`mailto:${c.email}`} className="link-underline hover:text-ink transition-colors break-all">
                  {c.email}
                </a>
              </li>
              <li><a href={`tel:${c.phone.replace(/\s/g, "")}`} className="num hover:text-ink transition-colors">{c.phone}</a></li>
              <li><a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">WhatsApp</a></li>
              <li className="text-ink-3">{c.address}</li>
              <li className="num text-[12px] text-ink-3">{c.hours}</li>
            </ul>
          </div>
        </div>

        {/* Status line — real counts, not a fake SLA */}
        <div className="border-t border-rule mt-12 md:mt-16 pt-5 flex flex-col md:flex-row md:items-baseline justify-between gap-3">
          <p className="num text-[11px] text-ink-3">
            © {year} Altraware Technology · BRELA registered · {shipped} of {projects} systems in production
          </p>
          <div className="flex items-center gap-5 num text-[11px] text-ink-3">
            <TransitionLink href="/privacy" className="hover:text-ink transition-colors">Privacy</TransitionLink>
            <TransitionLink href="/terms" className="hover:text-ink transition-colors">Terms</TransitionLink>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">
              Dar es Salaam
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
