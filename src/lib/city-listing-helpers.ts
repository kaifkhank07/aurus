import { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import { City } from "@/models/city.model";
import { Locality } from "@/models/locality.model";
import { Institute } from "@/models/institute.model";

/**
 * Pre-generates citySlug params for city-level listing pages.
 */
export async function generateCityStaticParams(): Promise<Array<{ citySlug: string }>> {
  try {
    await connectToDatabase();
    const cities = await City.find({ isActive: true }).select("slug").lean();
    return (cities as Array<{ slug?: string }>)
      .filter((c): c is { slug: string } => typeof c.slug === "string" && Boolean(c.slug.trim()))
      .map((c) => ({ citySlug: c.slug.toLowerCase().trim() }));
  } catch (error) {
    console.warn("[generateCityStaticParams] Error:", error);
    return [];
  }
}

/**
 * Pre-generates { citySlug, localitySlug } params for locality-level listing pages.
 */
export async function generateCityLocalityStaticParams(): Promise<
  Array<{ citySlug: string; localitySlug: string }>
> {
  try {
    await connectToDatabase();
    const cities = await City.find({ isActive: true }).select("_id slug").lean();
    const paramsList: Array<{ citySlug: string; localitySlug: string }> = [];

    for (const city of cities) {
      if (!city.slug) continue;
      const citySlug = city.slug.toLowerCase().trim();

      const localities = await Locality.find({ city: city._id, isActive: true })
        .select("slug")
        .lean();

      for (const loc of localities) {
        if (loc.slug) {
          paramsList.push({
            citySlug,
            localitySlug: loc.slug.toLowerCase().trim(),
          });
        }
      }
    }

    return paramsList;
  } catch (error) {
    console.warn("[generateCityLocalityStaticParams] Error:", error);
    return [];
  }
}

/**
 * Pre-generates { citySlug, slug } params for routes that accept either locality or institute.
 */
export async function generateCitySubSlugStaticParams(): Promise<
  Array<{ citySlug: string; slug: string }>
> {
  try {
    await connectToDatabase();
    const cities = await City.find({ isActive: true }).select("_id slug").lean();
    const paramsList: Array<{ citySlug: string; slug: string }> = [];

    for (const city of cities) {
      if (!city.slug) continue;
      const citySlug = city.slug.toLowerCase().trim();

      // Localities
      const localities = await Locality.find({ city: city._id, isActive: true })
        .select("slug")
        .lean();
      for (const loc of localities) {
        if (loc.slug) {
          paramsList.push({
            citySlug,
            slug: loc.slug.toLowerCase().trim(),
          });
        }
      }

      // Institutes
      const institutes = await Institute.find({ city: city._id, isActive: true })
        .select("slug")
        .lean();
      for (const inst of institutes) {
        if (inst.slug) {
          paramsList.push({
            citySlug,
            slug: inst.slug.toLowerCase().trim(),
          });
        }
      }
    }

    return paramsList;
  } catch (error) {
    console.warn("[generateCitySubSlugStaticParams] Error:", error);
    return [];
  }
}

/**
 * Resolves whether a given slug in a city is a locality or an institute.
 */
export async function resolveSubSlugType(
  citySlug: string,
  slug: string
): Promise<{
  city: any;
  type: "locality" | "institute" | "not_found";
  localitySlug?: string;
  instituteSlug?: string;
  placeName?: string;
}> {
  await connectToDatabase();
  const cityDoc = await City.findOne({
    slug: (citySlug || "").toLowerCase().trim(),
    isActive: true,
  }).lean();

  if (!cityDoc) {
    return { city: null, type: "not_found" };
  }

  const normSlug = (slug || "").toLowerCase().trim();

  // 1. Check Locality
  const locDoc = await Locality.findOne({
    slug: normSlug,
    city: cityDoc._id,
    isActive: true,
  }).lean();

  if (locDoc) {
    return {
      city: cityDoc,
      type: "locality",
      localitySlug: locDoc.slug,
      placeName: locDoc.name,
    };
  }

  // 2. Check Institute
  const instDoc = await Institute.findOne({
    slug: normSlug,
    city: cityDoc._id,
    isActive: true,
  }).lean();

  if (instDoc) {
    return {
      city: cityDoc,
      type: "institute",
      instituteSlug: instDoc.slug,
      placeName: instDoc.name,
    };
  }

  return { city: cityDoc, type: "not_found" };
}

interface MetadataOptions {
  routePrefix: string;
  categoryLabel: string; // e.g. "PG", "Girls PG", "Boys Hostels", "Hostel"
  citySlug: string;
  localitySlug?: string;
  instituteSlug?: string;
}

/**
 * Generates SEO metadata for any city, locality, or institute listing route.
 */
export async function generateListingMetadata({
  routePrefix,
  categoryLabel,
  citySlug,
  localitySlug,
  instituteSlug,
}: MetadataOptions): Promise<Metadata> {
  const normCitySlug = (citySlug || "").toLowerCase().trim();

  try {
    await connectToDatabase();
    const cityDoc = await City.findOne({
      slug: normCitySlug,
      isActive: true,
    }).lean();

    if (!cityDoc) {
      return {
        title: "City Not Found | Aurus",
      };
    }

    const cityName = cityDoc.city;
    let placeName = "";
    let canonicalPath = `${routePrefix}/${cityDoc.slug}`;

    if (localitySlug) {
      const locDoc = await Locality.findOne({
        slug: localitySlug.toLowerCase().trim(),
        city: cityDoc._id,
        isActive: true,
      }).lean();
      if (locDoc) {
        placeName = locDoc.name;
        canonicalPath = `${routePrefix}/${cityDoc.slug}/${locDoc.slug}`;
      }
    } else if (instituteSlug) {
      const instDoc = await Institute.findOne({
        slug: instituteSlug.toLowerCase().trim(),
        city: cityDoc._id,
        isActive: true,
      }).lean();
      if (instDoc) {
        placeName = instDoc.name;
        canonicalPath = `${routePrefix}/${cityDoc.slug}/${instDoc.slug}`;
      }
    }

    const title = placeName
      ? `${categoryLabel} near ${placeName}, ${cityName} | Aurus`
      : `${categoryLabel} in ${cityName} | Aurus`;

    const description = placeName
      ? `Explore top-rated verified ${categoryLabel.toLowerCase()} accommodations near ${placeName} in ${cityName}. All-inclusive luxury amenities with Aurus.`
      : `Explore premier ${categoryLabel.toLowerCase()} accommodations across ${cityName}. Fully furnished student residences with 24/7 security and high-speed Wi-Fi.`;

    const imageUrl = cityDoc.image?.url;

    return {
      title,
      description,
      alternates: {
        canonical: canonicalPath,
      },
      openGraph: {
        title,
        description,
        url: canonicalPath,
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
    console.error("[generateListingMetadata] Error:", error);
    return {
      title: `${categoryLabel} | Aurus`,
    };
  }
}
