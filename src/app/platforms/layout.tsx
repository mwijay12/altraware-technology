import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Platforms — Faida POS & CareTrack",
  description: "Interactive live demos: Faida POS retail checkout with M-Pesa simulation, and CareTrack care-centre attendance dashboard. Kiswahili-first, offline-ready.",
  openGraph: {
    title: "Touch the software — Mifumo Halisi",
    description: "Don't take our word. Touch the software.",
    images: [{ url: "/faidahq.png", width: 1200, height: 630, alt: "Faida POS Retail & Enterprise Dashboard" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Platforms — Faida POS & CareTrack",
    description: "Don't take our word. Touch the software.",
    images: ["/faidahq.png"],
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
