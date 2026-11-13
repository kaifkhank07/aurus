import { Metadata } from "next";
import { CityListingView } from "@/components/city/CityListingView";
import {
  generateCityStaticParams,
  generateListingMetadata,
} from "@/lib/city-listing-helpers";

export const dynamicParams = true;

interface PageProps {
  params: Promise<{
    citySlug: string;
  }>;
}

export async function generateStaticParams() {
  return generateCityStaticParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { citySlug } = await params;
  return generateListingMetadata({
    routePrefix: "/girls-hostel-listing",
    categoryLabel: "Girls Hostels",
    citySlug,
  });
}

export default async function GirlsHostelListingCityPage({ params }: PageProps) {
  const { citySlug } = await params;
  return <CityListingView citySlug={citySlug} gender="girls" />;
}

