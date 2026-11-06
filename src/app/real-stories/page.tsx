import type { Metadata } from "next";
import RealStories from "@/components/stories/RealStories";
import LifeMoments from "@/components/stories/LifeMoments";
import AurusJournal from "@/components/stories/AurusJournal";

export const metadata: Metadata = {
  title: "Real Stories, Genuine Experiences | AURUS",
  description:
    "What residents and parents say about living at Aurus — in their own words. Explore authentic testimonials, reviews, and insights from the Aurus community.",
  keywords: [
    "Aurus stories",
    "resident testimonials",
    "student experiences",
    "parent reviews Aurus",
    "student housing reviews",
    "Aurus community stories",
    "hostel life reviews",
  ],
  alternates: {
    canonical: "/real-stories",
  },
  openGraph: {
    title: "Real Stories, Genuine Experiences | AURUS",
    description:
      "Hear directly from residents and parents about life, community, and peace of mind at Aurus.",
    url: "/real-stories",
    siteName: "AURUS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Real Stories, Genuine Experiences | AURUS",
    description:
      "Authentic resident stories and parent testimonials from Aurus luxury residences.",
  },
};

export default function RealStoriesPage() {
  return (
    <main>
      <RealStories />
      <LifeMoments />
      <AurusJournal />
    </main>
  );
}

