import type { Metadata } from "next";
import { Hero } from "@/components/managed-hostels/Hero";
import { Intro } from "@/components/managed-hostels/Intro";
import { PropertyOverview } from "@/components/managed-hostels/PropertyOverview";
import { Residences } from "@/components/managed-hostels/Residences";
import { Amenities } from "@/components/managed-hostels/Amenities";
import { PricingAddons } from "@/components/managed-hostels/PricingAddons";
import { LocationMatrix } from "@/components/managed-hostels/LocationMatrix";
import { HowItWorks } from "@/components/managed-hostels/HowItWorks";
import { ManagedFaq } from "@/components/managed-hostels/ManagedFaq";
import { CallbackSection } from "@/components/managed-hostels/CallbackSection";
import ManagedNavbar from "@/components/layout/ManagedNavbar";

export const metadata: Metadata = {
  title: "Aurus GIFT City | Luxury Managed Residences & Serviced Living",
  description:
    "Experience premium turnkey managed living in GIFT City, Gandhinagar by Aurus. Thoughtfully designed fully-serviced Studio and 1 BHK residences for finance, fintech, and global professionals.",
  keywords: [
    "managed hostels",
    "GIFT City residences",
    "GIFT City serviced apartments",
    "luxury managed hostel Gandhinagar",
    "Aurus GIFT City",
    "turnkey professional living",
    "co-living GIFT City",
  ],
  alternates: {
    canonical: "/managed-hostels",
  },
  openGraph: {
    title: "Aurus GIFT City | Luxury Managed Residences & Serviced Living",
    description:
      "Turnkey managed residences with world-class hospitality, housekeeping, high-speed Wi-Fi, and 24/7 security in GIFT City.",
    url: "/managed-hostels",
    siteName: "AURUS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurus GIFT City | Luxury Managed Residences",
    description:
      "Fully serviced Studio and 1 BHK residences for young professionals building India's international finance hub.",
  },
};

export default function ManagedHostelsPage() {
  return (
    <main>
      <Hero />
      <Intro />
      <PropertyOverview />
      <Residences />
      <Amenities />
      <PricingAddons />
      <LocationMatrix />
      <HowItWorks />
      <ManagedFaq />
      <CallbackSection />
    </main>
  );
}
