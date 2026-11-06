import type { Metadata } from "next";
import { ChooseResidence } from "@/components/home/ChooseResidence";
import Story from "@/components/home/Story";
import { Locations } from "@/components/shared/Locations";
import { RealLife } from "@/components/shared/RealLife";
import { Culture } from "@/components/shared/Culture";
import { Testimonial } from "@/components/shared/Testimonial";
import Faq from "@/components/home/Faq";
import { Journey } from "@/components/shared/Journey";
import YearRythm from "@/components/home/YearRythm";
import AurusPlaylist from "@/components/home/AurusPlaylist";

export const metadata: Metadata = {
  title: "AURUS | Luxury Managed Residences & Purpose-Built Student Living",
  description:
    "Experience India's premier luxury managed residences. Thoughtfully designed student living with fully furnished rooms, gourmet dining, 24/7 concierge, high-speed fibre Wi-Fi, and vibrant community spaces.",
  keywords: [
    "Aurus",
    "luxury student residences",
    "managed student accommodation",
    "premium co-living India",
    "student housing",
    "student hostel",
    "luxury PG",
    "college residences India",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AURUS | Luxury Managed Residences & Purpose-Built Student Living",
    description:
      "Thoughtfully designed student living with fully furnished rooms, gourmet dining, 24/7 concierge, and vibrant community spaces across India.",
    url: "/",
    siteName: "AURUS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AURUS | Luxury Managed Residences & Purpose-Built Student Living",
    description:
      "India's premier luxury managed student residences. Fully furnished rooms, chef-crafted meals, and inspiring community living.",
  },
};

export default function Home() {
  return (
    <main>
      <ChooseResidence />
      <Story />
      <Locations />
      <RealLife />
      <Culture />
      <YearRythm />
      <AurusPlaylist />
      <Testimonial />
      <Faq />
      <Journey />
    </main>
  );
}
