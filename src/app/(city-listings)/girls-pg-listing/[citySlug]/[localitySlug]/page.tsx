import { Metadata } from "next";
import { CityListingView } from "@/components/city/CityListingView";
import {
  generateCityLocalityStaticParams,
  generateListingMetadata,
} from "@/lib/city-listing-helpers";

export const dynamicParams = true;

interface PageProps {
  params: Promise<{
    citySlug: string;
    localitySlug: string;
  }>;
}

export async function generateStaticParams() {
  return generateCityLocalityStaticParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { citySlug, localitySlug } = await params;
  return generateListingMetadata({
    routePrefix: "/girls-pg-listing",
    categoryLabel: "Girls PG",
    citySlug,
    localitySlug,
  });
}

export default async function GirlsPgListingLocalityPage({ params }: PageProps) {
  const { citySlug, localitySlug } = await params;
  return (
    <CityListingView
      citySlug={citySlug}
      localitySlug={localitySlug}
      gender="girls"
    />
  );
}

