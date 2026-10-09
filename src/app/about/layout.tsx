import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "About — Our Roots",
  description: "Altraware Technologies is a Dar es Salaam software company founded by David Mwijage and Clemence Ng'unda. Websites, apps and business systems — local insight, global craft.",
  openGraph: { title: "About Altraware — Mizizi Yetu", description: "From Dar es Salaam to the world. Our story, founders and values." },
};
export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
