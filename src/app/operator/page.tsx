import type { Metadata } from "next";
import OperatorHero from "@/components/operator/OperatorHero";
import OperationalExcellence from "@/components/operator/OperationalExcellence";
import CoreOperations from "@/components/operator/CoreOperations";
import CommunityIntention from "@/components/operator/CommunityIntention";
import TalkToOperationsForm from "@/components/operator/TalkToOperationsForm";

export const metadata: Metadata = {
  title: "Operated With Intention | Purpose-Built Student Living Operations | AURUS",
  description:
    "Every Aurus property is run on safety, community, and elevated living — creating a real home for residents and a reliable, high-performing asset for owners.",
  keywords: [
    "student housing operator",
    "student living operations",
    "PBSA operations India",
    "Aurus operations",
    "property management",
    "student co-living management",
    "institutional property operations",
  ],
  openGraph: {
    title: "Operated With Intention | AURUS",
    description:
      "Every Aurus property is run on three commitments: safety, community, and elevated living.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Operated With Intention | AURUS",
    description:
      "Every Aurus property is run on three commitments: safety, community, and elevated living.",
  },
};

export default function OperatorPage() {
  return (
    <main>
      <OperatorHero />
      <OperationalExcellence />
      <CoreOperations />
      <CommunityIntention />
      <TalkToOperationsForm />
    </main>
  );
}
