import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import Values from "@/components/about/Values";
import EveryDetail from "@/components/about/EveryDetail";
import CommunitySpaces from "@/components/about/CommunitySpaces";
import CherishExperience from "@/components/about/CherishExperience";
import { Journey } from "@/components/shared/Journey";

export const metadata: Metadata = {
  title: "About Us | AURUS - Luxury Managed Residences",
  description:
    "Learn about AURUS — India's premier luxury managed residences. Discover our story, core values, architectural philosophy, and our vision to redefine student living through community, comfort, and purposeful spaces.",
  keywords: [
    "About Aurus",
    "Aurus story",
    "luxury student living philosophy",
    "student residence mission",
    "co-living vision India",
    "Aurus hospitality",
    "purpose-built student accommodation",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | AURUS - Luxury Managed Residences",
    description:
      "Discover the story, values, and architectural philosophy behind India's premier luxury student residences.",
    url: "/about",
    siteName: "AURUS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | AURUS - Luxury Managed Residences",
    description:
      "Learn about AURUS and our vision to redefine student living through community, comfort, and purposeful spaces.",
  },
};

export default function About() {
  return (
    <main>
      <AboutHero />
      <Values />
      <EveryDetail />
      <CommunitySpaces />
      <CherishExperience />
      <Journey />
    </main>
  );
}
