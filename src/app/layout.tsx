import type { Metadata } from "next";
import { Fraunces, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ContentProvider, NotifyProvider, Preloader, SmoothScroll, PageTransition } from "@/components/providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CustomCursor, FloatingAI } from "@/components/motion";
import Logo from "@/components/Logo";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fraunces",
});
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-inter" });
const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-space-grotesk" });

const SITE_URL = "https://www.altraware.co.tz";

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
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${grotesk.variable}`}>
      <body className="antialiased font-sans">
        <ContentProvider>
          <NotifyProvider>
            <SmoothScroll>
              <div className="grain" />
              <div className="grain-cine" />
              <Preloader />
              <CustomCursor />
              <PageTransition />
              <Navbar />
              <main>{children}</main>
              <Footer />
              <FloatingAI />
            </SmoothScroll>
          </NotifyProvider>
        </ContentProvider>
      </body>
    </html>
  );
}