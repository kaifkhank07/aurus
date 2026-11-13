import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityListingView } from "@/components/city/CityListingView";
import {
  generateCitySubSlugStaticParams,
  generateListingMetadata,
  resolveSubSlugType,
} from "@/lib/city-listing-helpers";

export const dynamicParams = true;

interface PageProps {
  params: Promise<{
    citySlug: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return generateCitySubSlugStaticParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { citySlug, slug } = await params;
  const resolution = await resolveSubSlugType(citySlug, slug);

  if (resolution.type === "not_found") {
    return {
      title: "Page Not Found | Aurus",
    };
  }

  return generateListingMetadata({
    routePrefix: "/pg-listing",
    categoryLabel: "PG",
    citySlug,
    localitySlug: resolution.localitySlug,
    instituteSlug: resolution.instituteSlug,
  });
}

export default async function PgListingSubSlugPage({ params }: PageProps) {
  const { citySlug, slug } = await params;
  const resolution = await resolveSubSlugType(citySlug, slug);

  if (resolution.type === "not_found") {
    notFound();
  }

  return (
    <CityListingView
      citySlug={citySlug}
      localitySlug={resolution.localitySlug}
      instituteSlug={resolution.instituteSlug}
    />
  );
}

