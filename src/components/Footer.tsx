"use client";

import { useContent } from "@/components/providers";
import { TransitionLink } from "@/components/Navbar";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const { content } = useContent();
  const c = content.contact;

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/portal") || pathname?.startsWith("/client-portal")) {
    return null;
  }

  return (
    <footer className="bg-deep3 text-white pt-16 pb-8 border-t border-white/10">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-[1.3fr_1fr_1fr_1fr] gap-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden border border-white/15 p-1 bg-white/[0.04]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Altraware logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="font-grotesk font-bold">ALTRAWARE TECHNOLOGY</div>
                <div className="text-[10px] tracking-[0.3em] text-white/40 font-grotesk">DAR ES SALAAM · TANZANIA</div>
              </div>
            </div>
            <p className="text-sm text-white/50 mt-4 leading-relaxed">
              Websites, apps &amp; business systems — built in Dar es Salaam for Africa and beyond. Data privacy, written agreements,
              long-term support.
            </p>
            <div className="flex gap-2.5 mt-5">
              {[
                { ic: "instagram", url: "https://www.instagram.com/altrawaretechnology/?hl=en" },
                { ic: "x-twitter", url: "#" },
                { ic: "linkedin-in", url: "#" },
                { ic: "whatsapp", url: `https://wa.me/${c.whatsapp.replace(/[^0-9]/g, "")}` },
              ].map(({ ic, url }) => (
                <a
                  key={ic}
                  href={url}
                  target={url.startsWith("http") ? "_blank" : undefined}
                  rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
                  onClick={url === "#" ? (e) => e.preventDefault() : undefined}
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:bg-viol hover:border-viol transition-all"
                  aria-label={ic}
                >
                  <i className={`fa-brands fa-${ic} text-sm`} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-grotesk font-bold tracking-[0.25em] text-white/40 mb-4">BUILD</div>
            <ul className="space-y-2.5 text-sm text-white/65">
              <li><TransitionLink href="/services" className="hover:text-white transition-colors">Business websites</TransitionLink></li>
              <li><TransitionLink href="/services" className="hover:text-white transition-colors">Web & mobile apps</TransitionLink></li>
              <li><TransitionLink href="/platforms" className="hover:text-white transition-colors">Faida POS for retail</TransitionLink></li>
              <li><TransitionLink href="/platforms" className="hover:text-white transition-colors">CareTrack for centres</TransitionLink></li>
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-grotesk font-bold tracking-[0.25em] text-white/40 mb-4">
              COMPANY
            </div>
            <ul className="space-y-2.5 text-sm text-white/65">
              <li><TransitionLink href="/about" className="hover:text-white transition-colors">Our roots</TransitionLink></li>
              <li><TransitionLink href="/pricing" className="hover:text-white transition-colors">Process & pricing</TransitionLink></li>
              <li><TransitionLink href="/impact" className="hover:text-white transition-colors">Impact & support</TransitionLink></li>
              <li><TransitionLink href="/blog" className="hover:text-white transition-colors">Blog · Makala</TransitionLink></li>
              <li><TransitionLink href="/contact" className="hover:text-white transition-colors">Contact</TransitionLink></li>
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-grotesk font-bold tracking-[0.25em] text-white/40 mb-4">
              CONTACT
            </div>
            <ul className="space-y-2.5 text-sm text-white/65">
              <li className="flex gap-2.5"><i className="fa-solid fa-location-dot text-violL mt-0.5" /> {c.address}</li>
              <li className="flex gap-2.5"><i className="fa-solid fa-phone text-violL mt-0.5" /> {c.phone}</li>
              <li className="flex gap-2.5"><i className="fa-solid fa-envelope text-violL mt-0.5" /> {c.email}</li>
              <li className="flex gap-2.5"><i className="fa-solid fa-clock text-violL mt-0.5" /> {c.hours}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] text-white/35">
          <div>© {new Date().getFullYear()} Altraware Technology Ltd · Dar es Salaam, Tanzania · All rights reserved.</div>
          <div className="flex items-center gap-5">
            <TransitionLink href="/privacy" className="hover:text-white transition-colors">Privacy</TransitionLink>
            <TransitionLink href="/terms" className="hover:text-white transition-colors">Terms</TransitionLink>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}