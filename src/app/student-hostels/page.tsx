import type { Metadata } from "next";
import { Hero } from "@/components/student-residences/Hero";
import { Intro } from "@/components/student-residences/Intro";
import { ChapterBlock } from "@/components/student-residences/ChapterBlock";
import { Residences } from "@/components/student-residences/Residences";
import { Locations } from "@/components/shared/Locations";
import { Amenities } from "@/components/student-residences/Amenities";
import { RealLife } from "@/components/shared/RealLife";
import { Culture } from "@/components/shared/Culture";
import { Testimonial } from "@/components/shared/Testimonial";
import { Journey } from "@/components/shared/Journey";

export const metadata: Metadata = {
  title: "Purpose-Built Student Hostels | AURUS",
  description:
    "Explore purpose-built student hostels engineered for focus, connection, and wellbeing. Enjoy luxury ensuite rooms, chef-prepared nutrition, high-speed fibre Wi-Fi, and 24/7 security near your campus.",
  keywords: [
    "purpose-built student accommodation",
    "PBSA India",
    "student hostels",
    "luxury hostel for college students",
    "safe student housing",
    "campus accommodation India",
    "student co-living spaces",
  ],
  alternates: {
    canonical: "/student-hostels",
  },
  openGraph: {
    title: "Purpose-Built Student Hostels | AURUS",
    description:
      "Purpose-built student hostels designed for academic focus, safety, and vibrant community connections.",
    url: "/student-hostels",
    siteName: "AURUS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Purpose-Built Student Hostels | AURUS",
    description:
      "Luxury ensuite rooms, chef-prepared nutrition, and inspiring community living near top university campuses.",
  },
};

export default function StudentHostelsPage() {
  return (
    <main>
      <Hero />
      <Intro />
      <ChapterBlock />
      <Residences />
      <Locations showHeading={true} />
      <Amenities />
      <RealLife havingTopSpace={true} />
      {/* <Culture /> */}
      <Testimonial />
      <Journey />
    </main>
  );
}

