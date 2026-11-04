import type { Metadata } from "next";
import LifeHero from "@/components/lifeataurus/LifeHero";
import LivingHereMeans from "@/components/lifeataurus/LivingHereMeans";
import DayAtAurus from "@/components/lifeataurus/DayAtAurus";
import TheDetails from "@/components/lifeataurus/TheDetails";
import LifeMoments from "@/components/lifeataurus/LifeMoments";
import CafeAndApp from "@/components/lifeataurus/CafeAndApp";
import { Journey } from "@/components/shared/Journey";

export const metadata: Metadata = {
  title: "Life at Aurus | Experiences, Culture & Community Spaces",
  description:
    "Discover everyday life at Aurus. From energizing morning workouts and curated chef-crafted meals to late-night study sessions and weekend community socials, see what makes our chapters unforgettable.",
  keywords: [
    "life at Aurus",
    "student community living",
    "hostel events India",
    "student wellness",
    "luxury hostel amenities",
    "coliving experience",
    "student lifestyle Aurus",
  ],
  alternates: {
    canonical: "/life-at-aurus",
  },
  openGraph: {
    title: "Life at Aurus | Experiences, Culture & Community Spaces",
    description:
      "Explore everyday life at Aurus — chef-prepared dining, community lounges, student wellness, and curated social events.",
    url: "/life-at-aurus",
    siteName: "AURUS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Life at Aurus | Experiences, Culture & Community Spaces",
    description:
      "Curated chef-crafted meals, inspiring study hubs, and vibrant community living at Aurus.",
  },
};

export default function LifeAtAurus() {
  return (
    <main>
      <LifeHero />
      <LivingHereMeans />
      <DayAtAurus />
      <TheDetails />
      <LifeMoments />
      <CafeAndApp />
      <Journey />
    </main>
  );
}
