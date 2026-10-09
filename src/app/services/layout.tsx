import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "What We Build — Websites, Apps & Systems",
  description: "Fast mobile-first websites in Kiswahili & English, web and mobile apps, and business systems: Faida POS, CareTrack, ShuleDirect Pro. Built in Tanzania.",
  openGraph: { title: "What we build — Tunachojenga", description: "Three crafts, one standard: excellent." },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
