import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Blog — Notes from the Workshop",
  description: "Practical thinking about building software that works in Tanzania: connectivity, mobile money, Kiswahili-first design and honest pricing.",
  openGraph: { title: "Makala — Notes from the workshop", description: "Thinking, written down." },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
