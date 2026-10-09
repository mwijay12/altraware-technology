import type { Metadata } from "next";
import { ContentDisplay } from "@/components/LegalDisplay";
import { DEFAULT_CONTENT } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Altraware Technologies collects, uses and protects your personal data — in line with Tanzania's Personal Data Protection Act (PDPA) 2022.",
};

export default function PrivacyPage() {
  const doc = DEFAULT_CONTENT.legal.privacy;
  const cd = DEFAULT_CONTENT.legal.companyDetails;

  return (
    <ContentDisplay
      eyebrow="Usiri — Your data, yours"
      titleA="Privacy, by"
      titleAccent="design."
      doc={doc}
      cd={cd}
    />
  );
}