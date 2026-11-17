import { notFound, permanentRedirect } from "next/navigation";
import { legacyRedirectForSubSlug } from "@/lib/city-listing-helpers";

interface PageProps {
  params: Promise<{
    citySlug: string;
    localitySlug: string;
  }>;
}

/**
 * This URL shape is not the public one. Locality and college listing pages live
 * on the URLs the previous website used (/boys-pg-listings/{locality}/{city}),
 * so anything arriving here is sent there with a permanent redirect.
 */
export default async function BoysPgListingSubRedirect({ params }: PageProps) {
  const { citySlug, localitySlug } = await params;
  const target = await legacyRedirectForSubSlug("boys-pg", citySlug, localitySlug, "locality");
  if (!target) {
    notFound();
  }
  permanentRedirect(target);
}
