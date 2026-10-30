import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResidenceDetail } from "@/components/residences/ResidenceDetail";
import { staticResidenceDetail, exploreResidences } from "@/data/residences";
import RelatedResidences from "@/components/residences/RelatedResidences";
import {
  getCityBySlug,
  getResidencesByCityId,
  mapHostelsToExploreItems,
} from "@/lib/residences/city";
import { CityResidenceContent } from "@/components/residences/city/CityResidenceContent";
import connectToDatabase from "@/lib/mongodb";
import { Hostel } from "@/models/hostel.model";

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

  // 2. Fallback check for single residence detail
  const staticResidence = exploreResidences.items.find(
    (item) => item.href.replace("/residences/", "").toLowerCase() === normalizedSlug
  );

  if (staticResidence) {
    return {
      title: `${staticResidence.name} | Aurus Student Residences`,
      description: `Discover ${staticResidence.name} located in ${staticResidence.locality}.`,
      alternates: {
        canonical: `/residences/${normalizedSlug}`,
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

  // 1. Check if citySlug matches an active city with published residences
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

  // 2. Check if slug matches a static single residence
  const staticResidence = exploreResidences.items.find(
    (item) => item.href.replace("/residences/", "").toLowerCase() === normalizedSlug
  );

  if (staticResidence) {
    return (
      <main>
        <ResidenceDetail data={staticResidenceDetail} />
        <RelatedResidences />
      </main>
    );
  }

  // 3. Check if slug matches an individual hostel in MongoDB
  await connectToDatabase();
  const hostel = await Hostel.findOne({ slug: normalizedSlug, isActive: true }).lean();

  if (hostel) {
    return (
      <main>
        <ResidenceDetail data={staticResidenceDetail} />
        <RelatedResidences />
      </main>
    );
  }

  // 4. Neither valid city with residences nor valid individual residence -> 404
  notFound();
}
