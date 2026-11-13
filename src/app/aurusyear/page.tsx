import type { Metadata } from "next";
import { AurusHero } from "@/components/aurusyear/AurusHero";
import { AurusEventList } from "@/components/aurusyear/AurusEventList";
import { AurusRunClubCard } from "@/components/aurusyear/AurusRunClubCard";
import { AurusVoyages } from "@/components/aurusyear/AurusVoyages";
import { Journey } from "@/components/shared/Journey";

export const metadata: Metadata = {
  title: "The Aurus Year | Curated Experiences, Programmes & Voyages | AURUS",
  description:
    "Explore the Aurus Year: Twelve curated experiences, flagship athletic leagues, masterclasses, and coastal voyages designed to elevate student living.",
  keywords: [
    "The Aurus Year",
    "Aurus events",
    "student experiences India",
    "Aurus Cricket League",
    "Aurus Padel Cup",
    "student masterclasses",
    "Goa Voyage",
    "luxury student community",
  ],
  alternates: {
    canonical: "/aurusyear",
  },
  openGraph: {
    title: "The Aurus Year | Curated Experiences, Programmes & Voyages | AURUS",
    description:
      "Twelve curated experiences. Two trips earned, not given. One year designed to mean something.",
    url: "/aurusyear",
    siteName: "AURUS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Aurus Year | Curated Experiences, Programmes & Voyages | AURUS",
    description:
      "Twelve curated experiences. Two trips earned, not given. One year designed to mean something.",
  },
};

export default function AurusYearPage() {
  return (
    <main>
      <AurusHero />
      <AurusEventList />
      <AurusRunClubCard />
      <AurusVoyages />
      <Journey />
    </main>
  );
}
