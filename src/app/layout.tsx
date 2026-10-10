import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ContentProvider, NotifyProvider, Preloader, SmoothScroll, PageTransition } from "@/components/providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingAILazy from "@/components/FloatingAILazy";
import { DEFAULT_CONTENT } from "@/lib/content";

// Homepage is a Client Component, so the mobile hero <img> (the LCP
// element on phones) is invisible to the server HTML — the browser only
// discovers it after JS hydrates. Preload the default hero URL so the
// image is already in flight during hydration (LCP 6.7s → down).
const HERO_LCP_URL = DEFAULT_CONTENT.hero.image;

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

const SITE_URL = "https://www.altraware.co.tz";

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
  ],
  openGraph: {
    type: "website",
    locale: "en_TZ",
    alternateLocale: ["sw_TZ"],
    url: SITE_URL,
    siteName: "Altraware Technology",
    title: "Altraware Technology — Rooted at Home. Engineered for the World.",
    description:
      "Websites, apps & business systems built in Tanzania for how Tanzania works. Kiswahili-first, M-Pesa native, offline-ready.",
    images: [{ url: "/logo.jpg", width: 1254, height: 1254, alt: "Altraware Technology logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Altraware Technology",
    description: "Tanzanian software studio — websites, apps & business systems.",
    images: ["/logo.jpg"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Altraware Technology",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: [`${SITE_URL}/logo.jpg`, `${SITE_URL}/faidahq.png`],
    description:
      "Tanzanian software company in Dar es Salaam. Websites, web & mobile apps, POS systems (Faida POS), clinic systems (CareTrack) — Kiswahili & English, M-Pesa native, offline-first.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dar es Salaam",
      addressCountry: "TZ",
    },
    areaServed: ["Tanzania", "Kenya", "Uganda", "Worldwide"],
    sameAs: ["https://github.com/mwijay12"],
  };
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${grotesk.variable}`}>
      <head>
        {/* FontAwesome is ~100KB+ render-blocking CSS. Defer it: load async
            via print-media swap so it never delays FCP/LCP on mobile.
            Icons render with a fallback until it arrives. */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/fontawesome.min.css"
          media="print"
          // @ts-expect-error onLoad media swap is a standard non-blocking CSS pattern
          onLoad="this.media='all'"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/solid.min.css"
          media="print"
          // @ts-expect-error onLoad media swap is a standard non-blocking CSS pattern
          onLoad="this.media='all'"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/brands.min.css"
          media="print"
          // @ts-expect-error onLoad media swap is a standard non-blocking CSS pattern
          onLoad="this.media='all'"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css"
          />
        </noscript>
        {/* Early connections for LCP image + media hosts (mobile TTFB win) */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        {/* LCP preload: mobile hero image (see HERO_LCP_URL note above) */}
        <link rel="preload" as="image" href={HERO_LCP_URL} fetchPriority="high" />
      </head>
      <body className="antialiased font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <ContentProvider>
          <NotifyProvider>
            <SmoothScroll>
              <div className="grain" />
              <div className="grain-cine" />
              <Preloader />
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