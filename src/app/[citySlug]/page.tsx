import { Metadata } from "next";
import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import { City } from "@/models/city.model";
import { Hostel } from "@/models/hostel.model";
import CityHero from "@/components/city/CityHero";
import CityResidenceContent from "@/components/city/CityResidenceContent";
import CityIntroduction from "@/components/city/CityIntroduction";
import { PublicCity } from "@/types/city.types";
import { SafeHostel } from "@/types/hostel.types";

export const dynamicParams = true;

interface PageProps {
  params: Promise<{
    citySlug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    await connectToDatabase();
    const cities = await City.find({ isActive: true }).select("slug").lean();
    return (cities as Array<{ slug?: string }>)
      .filter((c): c is { slug: string } => typeof c.slug === "string" && Boolean(c.slug.trim()))
      .map((c) => ({ citySlug: c.slug.toLowerCase().trim() }));
  } catch (error) {
    console.warn("[generateStaticParams] Could not pre-generate city slugs:", error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { citySlug } = await params;
  const normalizedSlug = (citySlug || "").toLowerCase().trim();

  try {
    await connectToDatabase();
    const cityDoc = await City.findOne({
      slug: normalizedSlug,
      isActive: true,
    }).lean();

    if (!cityDoc) {
      return {
        title: "City Not Found | Aurus",
      };
    }

    const cityName = cityDoc.city;
    const title =
      cityDoc.metadata?.title ||
      `Student Residences in ${cityName} | Aurus`;

    const description =
      cityDoc.metadata?.description ||
      `Discover premier student accommodation across ${cityName} with Aurus. Gourmet dining, high-speed fibre Wi-Fi, and 24/7 security.`;

    const keywords =
      Array.isArray(cityDoc.metadata?.keywords) && cityDoc.metadata.keywords.length > 0
        ? cityDoc.metadata.keywords
        : [
            `residences in ${cityName}`,
            `student hostel ${cityName}`,
            `student accommodation ${cityName}`,
            `luxury hostel ${cityName}`,
            "Aurus",
          ];

    const imageUrl = cityDoc.image?.url;

    return {
      title,
      description,
      keywords,
      alternates: {
        canonical: `/${cityDoc.slug}`,
      },
      openGraph: {
        title,
        description,
        url: `/${cityDoc.slug}`,
        type: "website",
        images: imageUrl ? [{ url: imageUrl }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: imageUrl ? [imageUrl] : undefined,
      },
    };
  } catch (error) {
    console.error("[generateMetadata] Error fetching city metadata:", error);
    return {
      title: "Student Residences | Aurus",
    };
  }
}

export default async function DynamicCityPage({ params }: PageProps) {
  const { citySlug } = await params;
  const normalizedSlug = (citySlug || "").toLowerCase().trim();

  await connectToDatabase();

  const cityDoc = await City.findOne({
    slug: normalizedSlug,
    isActive: true,
  }).lean();

  if (!cityDoc) {
    notFound();
  }

  // Fetch only active, published residences belonging to this city
  const rawResidences = await Hostel.find({
    "location.city": cityDoc._id,
    isActive: true,
  })
    .populate("location.city", "city state country slug")
    .populate("location.locality", "name slug")
    .populate("amenities", "name image")
    .populate("occupancy", "name image")
    .populate("room", "name image")
    .populate("services", "name image")
    .populate("institute", "name slug")
    .populate("rent.frequency", "name")
    .sort({ createdAt: -1 })
    .lean();

  const city: PublicCity = {
    id: cityDoc._id.toString(),
    _id: cityDoc._id.toString(),
    country: cityDoc.country,
    state: cityDoc.state,
    city: cityDoc.city,
    name: cityDoc.city,
    slug: cityDoc.slug,
    image: cityDoc.image,
    sortOrder: cityDoc.sortOrder ?? 0,
    isActive: cityDoc.isActive ?? true,
    activeHostelsCount: rawResidences.length,
    count: rawResidences.length,
    metadata: cityDoc.metadata
      ? {
          title: cityDoc.metadata.title,
          description: cityDoc.metadata.description,
          keywords: cityDoc.metadata.keywords,
        }
      : undefined,
    createdAt: cityDoc.createdAt
      ? new Date(cityDoc.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: cityDoc.updatedAt
      ? new Date(cityDoc.updatedAt).toISOString()
      : new Date().toISOString(),
  };

  const safeResidences: SafeHostel[] = rawResidences.map((h: any) => ({
    ...h,
    id: h._id?.toString() || h.id || "",
    _id: h._id?.toString() || h.id || "",
    createdAt: h.createdAt
      ? new Date(h.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: h.updatedAt
      ? new Date(h.updatedAt).toISOString()
      : new Date().toISOString(),
  }));

  return (
    <main>
      {/* Dynamic City Hero */}
      <CityHero city={city} />

      {/* Dynamic Filter Bar & Residences Grid */}
      <CityResidenceContent city={city} residences={safeResidences} />

      {/* Dynamic City Introduction */}
      <CityIntroduction city={city} />
    </main>
  );
}
