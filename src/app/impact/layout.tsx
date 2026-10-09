import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Impact & Live Portfolio",
  description: "10+ live platforms — FaidaHQ retail OS, Tanzania Reach, UAUT Connect, Volta Rentals, Audenic, Bongo Foodie, ShuleDirect Pro, CareTrack and more.",
  openGraph: { title: "Our work — Kazi Zetu", description: "Everything here is live. Touch it." },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
