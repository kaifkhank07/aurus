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
    localitySlug: string;
    citySlug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { localitySlug, citySlug } = await params;
  const listing = await resolveLegacySubListing("boys-hostel", "locality", localitySlug, citySlug);
  if (!listing.found) {
    return { title: "Page Not Found | Aurus" };
  }
  return generateListingMetadata({
    routePrefix: "/boys-hostel-listings",
    categoryLabel: "Boys Hostel",
    citySlug: listing.citySlug,
    legacy: listing.legacy,
    canonicalPath: listing.path,
    placeName: listing.placeName,
  });
}

export default async function BoysHostelListingsLocalityPage({ params }: PageProps) {
  const { localitySlug, citySlug } = await params;
  const listing = await resolveLegacySubListing("boys-hostel", "locality", localitySlug, citySlug);
  if (listing.redirectTo) {
    permanentRedirect(listing.redirectTo);
  }
  if (!listing.found) {
    notFound();
  }
  return (
    <CityListingView
      citySlug={listing.citySlug}
      cityName={listing.cityName} gender="boys"
      localitySlug={listing.localitySlug}
      instituteSlug={listing.instituteSlug}
      legacy={listing.legacy}
    />
  );
}
