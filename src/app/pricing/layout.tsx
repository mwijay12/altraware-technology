import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Pricing & Instant Estimator",
  description: "Fixed packages from TSh 850k, instant estimator with bundle discounts and VAT preview, support plans from TSh 99k/month. Honest, written quotes.",
  openGraph: { title: "Honest pricing — Bei Sahihi", description: "Tell us your dream. We'll cost it honestly." },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
