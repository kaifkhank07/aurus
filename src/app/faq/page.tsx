import { Metadata } from "next";
import FaqSection from "@/components/faq/FaqSection";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | AURUS",
  description:
    "Everything students and parents usually ask before moving in. Clear answers on booking, all-inclusive rent, security, meals, and move-in at Aurus.",
};

export default function FaqPage() {
  return (
    <main>
      <FaqSection />
    </main>
  );
}
