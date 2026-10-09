import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Our Process — A Clear Njia",
  description: "Five written phases: Discovery, Design, Build, Launch & Train, then Care. Phase-based billing, written agreements, no surprises.",
  openGraph: { title: "The Altraware process — Njia", description: "No surprises. Just a clear njia." },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
