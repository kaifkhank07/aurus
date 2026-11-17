import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { CityListingView } from "@/components/city/CityListingView";
import {
  generateListingMetadata,
  resolveLegacySubListing,
} from "@/lib/city-listing-helpers";

export const dynamicParams = true;

interface PageProps {
  params: Promise<{
    instituteSlug: string;
    citySlug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { instituteSlug, citySlug } = await params;
  const listing = await resolveLegacySubListing("pg", "institute", instituteSlug, citySlug);
  if (!listing.found) {
    return { title: "Page Not Found | Aurus" };
  }
  return generateListingMetadata({
    routePrefix: "/pg_listings",
    categoryLabel: "PG",
    citySlug: listing.citySlug,
    legacy: listing.legacy,
    canonicalPath: listing.path,
    placeName: listing.placeName,
  });
}

export default async function PgListingsInstitutePage({ params }: PageProps) {
  const { instituteSlug, citySlug } = await params;
  const listing = await resolveLegacySubListing("pg", "institute", instituteSlug, citySlug);
  if (listing.redirectTo) {
    permanentRedirect(listing.redirectTo);
  }
  if (!listing.found) {
    notFound();
  }
  return (
    <CityListingView
      citySlug={listing.citySlug}
      cityName={listing.cityName}
      localitySlug={listing.localitySlug}
      instituteSlug={listing.instituteSlug}
      legacy={listing.legacy}
    />
  );
}
