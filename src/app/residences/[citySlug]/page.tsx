import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResidenceDetail } from "@/components/residences/ResidenceDetail";
import RelatedResidences from "@/components/residences/RelatedResidences";
import {
  getCityBySlug,
  getResidencesByCityId,
  mapHostelsToExploreItems,
} from "@/lib/residences/city";
import { getHostelBySlug, getRelatedHostels } from "@/lib/residences/detail";
import { CityResidenceContent } from "@/components/residences/city/CityResidenceContent";

export const instant = false;

interface PageProps {
  params: Promise<{
    citySlug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { citySlug } = await params;
  const normalizedSlug = (citySlug || "").toLowerCase().trim();

  // 1. Dynamic city page metadata
  const city = await getCityBySlug(normalizedSlug);

  if (city) {
    const title = city.metadata?.title || `Student Residences in ${city.name} | Aurus`;
    const description =
      city.metadata?.description ||
      `Explore premium student residences and accommodation options in ${city.name} with Aurus. Gourmet dining, high-speed fibre Wi-Fi, and 24/7 security.`;

    return {
      title,
      description,
      keywords: city.metadata?.keywords || [
        `residences in ${city.name}`,
        `student hostel ${city.name}`,
        `student accommodation ${city.name}`,
        `luxury hostel ${city.name}`,
      ],
      alternates: {
        canonical: `/residences/${city.slug}`,
      },
      openGraph: {
        title,
        description,
        url: `/residences/${city.slug}`,
        type: "website",
        images: city.image?.url ? [{ url: city.image.url }] : undefined,
      },
    };
  }

  // 2. Dynamic single residence detail metadata
  const hostelData = await getHostelBySlug(normalizedSlug);

  if (hostelData) {
    const raw = hostelData.raw;
    const detail = hostelData.residenceDetail;

    const title =
      raw.metadata?.title ||
      `${detail.title}${detail.subtitle ? " " + detail.subtitle : ""} | Aurus Student Residences`;
    const description =
      raw.metadata?.description ||
      raw.subtitle ||
      detail.description?.slice(0, 160) ||
      `Experience luxury student living at ${detail.title} with Aurus.`;
    const keywords =
      raw.metadata?.keywords && raw.metadata.keywords.length > 0
        ? raw.metadata.keywords
        : [
            detail.title,
            "student residences",
            "luxury hostel",
            "student accommodation",
            detail.locationBadge,
          ];
    const imageUrl = detail.mainImage || "/images/image03.png";

    return {
      title,
      description,
      keywords,
      alternates: {
        canonical: `/residences/${raw.slug || normalizedSlug}`,
      },
      openGraph: {
        title,
        description,
        url: `/residences/${raw.slug || normalizedSlug}`,
        type: "website",
        images: [{ url: imageUrl }],
      },
    };
  }

  return {
    title: "Residence Not Found | Aurus",
  };
}

export default async function ResidenceSlugPage({ params }: PageProps) {
  const { citySlug } = await params;
  const normalizedSlug = (citySlug || "").toLowerCase().trim();

  // 1. Check if slug matches an active city with published residences
  const city = await getCityBySlug(normalizedSlug);

  if (city) {
    const residences = await getResidencesByCityId(city._id);

    // If city has no eligible residences, return 404
    if (!residences || residences.length === 0) {
      notFound();
    }

    const exploreItems = mapHostelsToExploreItems(residences, city.name);

    return <CityResidenceContent city={city} initialItems={exploreItems} />;
  }

  // 2. Check if slug matches an active individual residence in MongoDB
  const hostelData = await getHostelBySlug(normalizedSlug);

  if (hostelData) {
    const relatedItems = await getRelatedHostels(
      hostelData.raw._id?.toString() || hostelData.raw.slug,
      hostelData.raw.location?.city?._id || hostelData.raw.location?.city
    );

    return (
      <main>
        <ResidenceDetail data={hostelData.residenceDetail} />
        <RelatedResidences items={relatedItems} />
      </main>
    );
  }

  // 3. Neither valid city with residences nor valid individual residence -> 404
  notFound();
}
