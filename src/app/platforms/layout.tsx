import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Platforms — Faida POS & CareTrack",
  description: "Interactive live demos: Faida POS retail checkout with M-Pesa simulation, and CareTrack care-centre attendance dashboard. Kiswahili-first, offline-ready.",
  openGraph: { title: "Touch the software — Mifumo Halisi", description: "Don't take our word. Touch the software." },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
