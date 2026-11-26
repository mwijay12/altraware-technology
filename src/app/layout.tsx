import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ContentProvider, NotifyProvider, SmoothScroll, PageTransition } from "@/components/providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingAILazy from "@/components/FloatingAILazy";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  // Trimmed: display font only needs 2 weights on mobile (was 5).
  weight: ["400", "600"],
  variable: "--font-fraunces",
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});
const inter = Inter({
  subsets: ["latin"],
  // Body font: 3 essential weights (was 5).
  weight: ["400", "500", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://altra.tanzaniareach.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0A1735",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Altraware Technology — Rooted at Home. Engineered for the World.",
    template: "%s · Altraware Technology",
  },
  description:
    "Tanzanian software company in Dar es Salaam. Websites, web & mobile apps, and business systems — Faida POS & CareTrack. Kiswahili & English, M-Pesa native, offline-first.",
  keywords: [
    "software company Tanzania",
    "web development Dar es Salaam",
    "POS system Tanzania",
    "Faida POS",
    "CareTrack",
    "M-Pesa integration",
    "Kiswahili website",
    "app development Tanzania",
    "school management system Tanzania",
    "Altraware",
    "software developers Kariakoo",
    "tanzania tech company",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_TZ",
    alternateLocale: ["sw_TZ"],
    url: SITE_URL,
    siteName: "Altraware Technology",
    title: "Altraware Technology — Rooted at Home. Engineered for the World.",
    description:
      "Websites, apps & business systems built in Tanzania for how Tanzania works. Kiswahili-first, M-Pesa native, offline-ready.",
    images: [
      {
        url: "/logo.jpg",
        width: 1254,
        height: 1254,
        alt: "Altraware Technology — Software Company in Tanzania",
      },
      {
        url: "/faidahq.png",
        width: 1200,
        height: 630,
        alt: "Faida POS & Altraware Business Platforms",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Altraware Technology — Software Company in Tanzania",
    description: "Tanzanian software studio — websites, apps & business systems.",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Altraware Technology",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo.png`,
          width: 512,
          height: 512,
          caption: "Altraware Technology Logo",
        },
        image: [
          `${SITE_URL}/logo.jpg`,
          `${SITE_URL}/logo.png`,
          `${SITE_URL}/faidahq.png`,
        ],
        description:
          "Tanzanian software company in Dar es Salaam. Websites, web & mobile apps, POS systems (Faida POS), clinic systems (CareTrack) — Kiswahili & English, M-Pesa native, offline-first.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Dar es Salaam",
          addressCountry: "TZ",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -6.7924,
          longitude: 39.2083,
        },
        hasMap: "https://www.google.com/maps/place/Altraware+Technology/@-6.3457672,29.6864765,6z/data=!4m6!3m5!1s0xb655bb5a1860615:0x815b0f25ed425796!8m2!3d-6.3457672!4d29.6864765!16s%2Fg%2F11w_m7w_q?entry=ttu",
        telephone: "+255792867427",
        email: "altrawaretechnology@gmail.com",
        areaServed: ["Tanzania", "Kenya", "Uganda", "Worldwide"],
        sameAs: [
          "https://github.com/mwijay12",
          "https://www.google.com/maps/place/Altraware+Technology/@-6.3457672,29.6864765,6z/data=!4m6!3m5!1s0xb655bb5a1860615:0x815b0f25ed425796!8m2!3d-6.3457672!4d29.6864765!16s%2Fg%2F11w_m7w_q?entry=ttu",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Altraware Technology",
        description: "Rooted at Home. Engineered for the World.",
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
      },
    ],
  };
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${grotesk.variable}`}>
      <head>
        {/* FontAwesome is ~100KB+ render-blocking CSS. Defer it: load async
            via print-media swap so it never delays FCP/LCP on mobile.
            Icons render with a fallback until it arrives. */}
        {/* FontAwesome 7 self-hosted (public/fa, copied from the installed
            v7.3.1 package so class names always match). FA7 splits icons
            across fontawesome.min.css (solid+regular glyphs), solid/regular
            .min.css (@font-face shims) and brands.min.css — all four are
            needed. Injected after first paint via idle/load callback so the
            ~90KB never blocks FCP/LCP. (A prior CDN + media="print" attempt
            failed because React cannot bind an onLoad *string* on <link>,
            so the swap never ran and every icon rendered blank.) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){function add(){["/fa/fontawesome.min.css","/fa/solid.min.css","/fa/regular.min.css","/fa/brands.min.css"].forEach(function(h){if(document.querySelector('link[data-fa="'+h+'"]'))return;var l=document.createElement("link");l.rel="stylesheet";l.href=h;l.setAttribute("data-fa",h);document.head.appendChild(l);});}if("requestIdleCallback" in window){requestIdleCallback(add,{timeout:1200});}else{window.addEventListener("load",add);}setTimeout(add,3000);})();`,
          }}
        />
        <noscript>
          <link rel="stylesheet" href="/fa/fontawesome.min.css" />
          <link rel="stylesheet" href="/fa/solid.min.css" />
          <link rel="stylesheet" href="/fa/regular.min.css" />
          <link rel="stylesheet" href="/fa/brands.min.css" />
        </noscript>
        {/* Early connection for Cloudinary media host */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className="antialiased font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
        />
        <ContentProvider>
          <NotifyProvider>
            <SmoothScroll>
              <div className="grain" />
              <div className="grain-cine" />
              <PageTransition />
              <Navbar />
              <main>{children}</main>
              <Footer />
              <FloatingAILazy />
            </SmoothScroll>
          </NotifyProvider>
        </ContentProvider>
      </body>
    </html>
  );
}