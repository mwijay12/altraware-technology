import type { Metadata } from "next";
import { ContentDisplay } from "@/components/LegalDisplay";
import { DEFAULT_CONTENT } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms that govern engagements with Altraware Technologies — quotes, payment, IP handover, warranties and Tanzanian law.",
};

export default function TermsPage() {
  const doc = DEFAULT_CONTENT.legal.terms;
  const cd = DEFAULT_CONTENT.legal.companyDetails;

  return (
    <ContentDisplay
      eyebrow="Masharti — Clear & written"
      titleA="Honest terms,"
      titleAccent="no traps."
      doc={doc}
      cd={cd}
    />
  );
}