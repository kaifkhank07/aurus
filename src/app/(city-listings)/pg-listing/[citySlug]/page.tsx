import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityListingView } from "@/components/city/CityListingView";
import {
  generateCityStaticParams,
  generateListingMetadata,
  resolveCityListing,
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
  const listing = await resolveCityListing("pg", citySlug);
  if (!listing.found) {
    return { title: "City Not Found | Aurus" };
  }
  return generateListingMetadata({
    routePrefix: "/pg-listing",
    categoryLabel: "PG",
    citySlug: listing.citySlug,
    legacy: listing.legacy,
    canonicalPath: listing.path,
  });
}

export default async function PgListingCityPage({ params }: PageProps) {
  const { citySlug } = await params;
  const listing = await resolveCityListing("pg", citySlug);
  if (!listing.found) {
    notFound();
  }
  return (
    <CityListingView
      citySlug={listing.citySlug}
      cityName={listing.cityName}
      legacy={listing.legacy}
    />
  );
}
