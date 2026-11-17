import { notFound, permanentRedirect } from "next/navigation";
import { legacyRedirectForSubSlug } from "@/lib/city-listing-helpers";

interface PageProps {
  params: Promise<{
    citySlug: string;
    slug: string;
  }>;
}

/**
 * This URL shape is not the public one. Locality and college listing pages live
 * on the URLs the previous website used (/hostel-listings/{locality}/{city}, /hostel_listings/{college}/{city}),
 * so anything arriving here is sent there with a permanent redirect.
 */
export default async function HostelListingSubRedirect({ params }: PageProps) {
  const { citySlug, slug } = await params;
  const target = await legacyRedirectForSubSlug("hostel", citySlug, slug);
  if (!target) {
    notFound();
  }
  permanentRedirect(target);
}
