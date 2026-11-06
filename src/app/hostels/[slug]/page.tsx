import { Metadata } from "next";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import { Hostel } from "@/models/hostel.model";
import { City } from "@/models/city.model";
import ResidenceDetail from "@/components/residences/ResidenceDetail";
import RelatedResidences from "@/components/residences/RelatedResidences";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    await connectToDatabase();
    const hostels = await Hostel.find({ isActive: true }).select("slug").lean();
    return (hostels as Array<{ slug?: string }>)
      .filter((h): h is { slug: string } => typeof h.slug === "string" && Boolean(h.slug.trim()))
      .map((h) => ({ slug: h.slug.toLowerCase().trim() }));
  } catch (error) {
    console.warn("[generateStaticParams] Could not pre-generate hostel slugs:", error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = (slug || "").toLowerCase().trim();

  try {
    await connectToDatabase();
    const hostel = await Hostel.findOne({
      slug: normalizedSlug,
      isActive: true,
    })
      .select("title subtitle frontImage galleryImages metadata slug")
      .lean();

    if (!hostel) {
      // Check if slug matches an active city
      const city = await City.findOne({ slug: normalizedSlug, isActive: true })
        .select("slug")
        .lean();
      if (city) {
        redirect(`/${city.slug}`);
      }

      return {
        title: "Hostel Not Found | Aurus",
      };
    }

    // Use metadata directly from backend hostel document
    const title =
      hostel.metadata?.title ||
      `${hostel.title}${hostel.subtitle ? ` - ${hostel.subtitle}` : ""} | Aurus Student Hostels`;

    const description =
      hostel.metadata?.description ||
      hostel.subtitle ||
      `Experience luxury student living at ${hostel.title} with Aurus. Gourmet dining, high-speed Wi-Fi, and 24/7 security.`;

    const keywords =
      Array.isArray(hostel.metadata?.keywords) && hostel.metadata.keywords.length > 0
        ? hostel.metadata.keywords
        : [
            hostel.title,
            "student hostels",
            "luxury hostel",
            "student accommodation",
            "Aurus",
          ];

    const imageUrl =
      hostel.frontImage?.url ||
      hostel.galleryImages?.[0]?.url ||
      "/images/image03.png";

    return {
      title,
      description,
      keywords,
      alternates: {
        canonical: `/hostels/${hostel.slug || normalizedSlug}`,
      },
      openGraph: {
        title,
        description,
        url: `/hostels/${hostel.slug || normalizedSlug}`,
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
    console.error("[generateMetadata] Error fetching hostel metadata:", error);
    return {
      title: "Student Hostels | Aurus",
    };
  }
}

export default async function HostelSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const normalizedSlug = (slug || "").toLowerCase().trim();

  // If slug matches an active city, seamlessly route to the dynamic city page
  await connectToDatabase();
  const city = await City.findOne({ slug: normalizedSlug, isActive: true })
    .select("slug")
    .lean();
  if (city) {
    redirect(`/${city.slug}`);
  }

  return (
    <main>
      <ResidenceDetail slug={slug} />
      <RelatedResidences currentSlug={slug} />
    </main>
  );
}

