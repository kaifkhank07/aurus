import { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import { City } from "@/models/city.model";
import CityHero from "@/components/city/CityHero";
import CityResidenceContent from "@/components/city/CityResidenceContent";
import CityIntroduction from "@/components/city/CityIntroduction";
import CityFaq from "@/components/city/CityFaq";
import CityFooterLinks from "@/components/city/CityFooterLinks";

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
        canonical: `/hostels/${cityDoc.slug}`,
      },
      openGraph: {
        title,
        description,
        url: `/hostels/${cityDoc.slug}`,
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

  return (
    <main>
      {/* Dynamic City Hero */}
      <CityHero citySlug={citySlug} />

      {/* Dynamic Filter Bar & Residences Grid */}
      <CityResidenceContent citySlug={citySlug} />

      {/* Dynamic City Introduction */}
      <CityIntroduction citySlug={citySlug} />

      {/* Dynamic City FAQ */}
      <CityFaq citySlug={citySlug} />

      {/* Dynamic City Footer Links */}
      <CityFooterLinks citySlug={citySlug} />
    </main>
  );
}

