import type { Metadata } from "next";
import FaqSection from "@/components/faq/FaqSection";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | AURUS Student Residences",
  description:
    "Find answers to common questions about living at Aurus — booking procedures, all-inclusive rent, security protocols, food and dining options, maintenance, and move-in checklists.",
  keywords: [
    "Aurus FAQ",
    "student hostel rules",
    "hostel security questions",
    "all-inclusive rent FAQ",
    "student accommodation questions",
    "Aurus move-in guide",
    "student housing dining FAQ",
  ],
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions | AURUS Student Residences",
    description:
      "Everything students and parents ask about booking, rent, security, meals, and living at Aurus.",
    url: "/faq",
    siteName: "AURUS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions | AURUS Student Residences",
    description:
      "Clear answers on booking, all-inclusive rent, security, meals, and move-in at Aurus.",
  },
};

export default function FaqPage() {
  return (
    <main>
      <FaqSection />
    </main>
  );
}
