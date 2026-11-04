import type { Metadata } from "next";
import { ExploreResidences } from "@/components/residences/ExploreResidences";
import { UpcomingChapters } from "@/components/residences/UpcomingChapters";
import { LifeAtAurus } from "@/components/residences/LifeAtAurus";

export const metadata: Metadata = {
  title: "Explore Residences | Luxury Student Housing Across India | AURUS",
  description:
    "Browse Aurus luxury student residences across top academic hubs in India. View room categories, all-inclusive pricing, curated amenities, virtual tours, and schedule an on-site visit today.",
  keywords: [
    "explore residences",
    "Aurus student hostels",
    "hostels near university",
    "luxury student PG",
    "book a student room",
    "boys and girls hostel India",
    "student accommodation chapters",
  ],
  alternates: {
    canonical: "/residences",
  },
  openGraph: {
    title: "Explore Residences | Luxury Student Housing Across India | AURUS",
    description:
      "Find your perfect student residence across India's top university hubs. Fully furnished, secure, and all-inclusive.",
    url: "/residences",
    siteName: "AURUS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Residences | Luxury Student Housing Across India | AURUS",
    description:
      "Explore premier student residences across India. Exceptional rooms, dining, and vibrant community living.",
  },
};

export default function ResidencesPage() {
  return (
    <main>
      <ExploreResidences />
      <UpcomingChapters />
      <LifeAtAurus />
    </main>
  );
}
