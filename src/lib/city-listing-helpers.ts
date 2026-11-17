import { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import { City } from "@/models/city.model";
import { Locality } from "@/models/locality.model";
import { Institute } from "@/models/institute.model";
import type { FooterLinkColumn } from "@/data/city/cityFooterLinks";
import {
  LEGACY_OG_IMAGE,
  SITE_URL,
  buildCityFooterColumns,
  buildListingPath,
  findLegacyByNewSlug,
  findLegacyByPath,
  findLegacyCityPage,
  listingPath,
  type LegacySeoPage,
  type ListingKind,
  type ListingPrefix,
} from "@/lib/legacy-seo";

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
  /** SEO copy carried over from the previous website for this exact URL */
  legacy?: LegacySeoPage;
  /** Public URL path of the page (old URL structure). Overrides the computed one. */
  canonicalPath?: string;
  /** Locality / college name when it has no database record */
  placeName?: string;
}

/**
 * Generates SEO metadata for any city, locality, or institute listing route.
 * Title, description and keywords come from the previous website when it had
 * them for this URL; otherwise they are generated from the place names.
 */
export async function generateListingMetadata({
  routePrefix,
  categoryLabel,
  citySlug,
  localitySlug,
  instituteSlug,
  legacy,
  canonicalPath: canonicalOverride,
  placeName: placeNameOverride,
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
    let placeName = placeNameOverride || "";
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

    const generatedTitle = placeName
      ? `${categoryLabel} near ${placeName}, ${cityName} | Aurus`
      : `${categoryLabel} in ${cityName} | Aurus`;

    const generatedDescription = placeName
      ? `Explore top-rated verified ${categoryLabel.toLowerCase()} accommodations near ${placeName} in ${cityName}. All-inclusive luxury amenities with Aurus.`
      : `Explore premier ${categoryLabel.toLowerCase()} accommodations across ${cityName}. Fully furnished student residences with 24/7 security and high-speed Wi-Fi.`;

    const title = legacy?.title || generatedTitle;
    const description = legacy?.description || generatedDescription;
    const keywords = legacy?.keywords || undefined;

    // Always the live domain + the old URL structure, exactly as it was indexed
    const canonicalUrl = `${SITE_URL}${canonicalOverride || legacy?.path || canonicalPath}`;

    return {
      // `absolute` keeps the old title as-is, with no site-wide suffix added
      title: { absolute: title },
      description,
      keywords,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: "website",
        images: [{ url: LEGACY_OG_IMAGE }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [LEGACY_OG_IMAGE],
      },
    };
  } catch (error) {
    console.error("[generateListingMetadata] Error:", error);
    return {
      title: `${categoryLabel} | Aurus`,
    };
  }
}

/* ------------------------------------------------------------------ */
/* Old-URL listing pages                                               */
/* ------------------------------------------------------------------ */

export interface ResolvedListing {
  found: boolean;
  /** Set when the request should be permanently redirected to this path */
  redirectTo?: string;
  cityName: string;
  citySlug: string;
  /** Slug to filter hostels by in the current database (undefined = whole city) */
  localitySlug?: string;
  instituteSlug?: string;
  placeName?: string;
  legacy?: LegacySeoPage;
  /** Public URL path of this page */
  path: string;
}

const NOT_FOUND: ResolvedListing = { found: false, cityName: "", citySlug: "", path: "" };

/** Resolves a city-level listing page: /{prefix}-listing/{city} */
export async function resolveCityListing(
  prefix: ListingPrefix,
  rawCitySlug: string
): Promise<ResolvedListing> {
  const citySlug = decodeURIComponent(rawCitySlug || "").toLowerCase().trim();
  await connectToDatabase();
  const cityDoc = await City.findOne({ slug: citySlug, isActive: true }).lean();
  if (!cityDoc) return NOT_FOUND;

  const legacy = findLegacyCityPage(prefix, citySlug);
  return {
    found: true,
    cityName: cityDoc.city,
    citySlug,
    legacy,
    path: legacy?.path || buildListingPath(prefix, "city", citySlug),
  };
}

/**
 * Resolves a locality / college listing page requested on the old URL
 * structure: /{prefix}-listings/{locality}/{city} or /{prefix}_listings/{college}/{city}
 */
export async function resolveLegacySubListing(
  prefix: ListingPrefix,
  kind: Exclude<ListingKind, "city">,
  rawSlug: string,
  rawCitySlug: string
): Promise<ResolvedListing> {
  const citySlug = decodeURIComponent(rawCitySlug || "").toLowerCase().trim();
  const slug = decodeURIComponent(rawSlug || "").toLowerCase().trim();

  await connectToDatabase();
  const cityDoc = await City.findOne({ slug: citySlug, isActive: true }).lean();
  if (!cityDoc) return NOT_FOUND;

  const Model = kind === "locality" ? Locality : Institute;
  const legacy = findLegacyByPath(buildListingPath(prefix, kind, citySlug, slug));

  // The slug in the URL is the old one; the database may know the place by another slug
  const dbSlug = legacy ? legacy.newSlug : slug;
  const placeDoc = dbSlug
    ? await Model.findOne({ slug: dbSlug.toLowerCase(), city: cityDoc._id, isActive: true }).lean()
    : null;

  if (!legacy) {
    if (!placeDoc) return NOT_FOUND;
    // Requested with the current slug while the old site used a different one
    const known = findLegacyByNewSlug(prefix, kind, citySlug, slug);
    if (known) {
      return { ...NOT_FOUND, redirectTo: known.path };
    }
  }

  const base: ResolvedListing = {
    found: true,
    cityName: cityDoc.city,
    citySlug,
    placeName: placeDoc?.name || legacy?.name,
    legacy,
    path: legacy?.path || buildListingPath(prefix, kind, citySlug, slug),
  };
  if (placeDoc) {
    if (kind === "locality") base.localitySlug = placeDoc.slug;
    else base.instituteSlug = placeDoc.slug;
  }
  return base;
}

/**
 * Where a request on the newer URL shape (/{prefix}-listing/{city}/{slug})
 * should be permanently redirected, so each page has exactly one URL.
 */
export async function legacyRedirectForSubSlug(
  prefix: ListingPrefix,
  citySlug: string,
  slug: string,
  only?: "locality"
): Promise<string | null> {
  const resolution = await resolveSubSlugType(citySlug, slug);
  if (resolution.type === "not_found") return null;
  if (only === "locality" && resolution.type !== "locality") return null;
  const dbSlug = resolution.localitySlug || resolution.instituteSlug || slug;
  return listingPath(prefix, resolution.type, resolution.city.slug, dbSlug);
}

/** Server-side data for the SEO footer link columns of a city. */
export async function getCityFooterColumns(
  rawCitySlug: string
): Promise<{ cityName: string; columns: FooterLinkColumn[] } | null> {
  try {
    const citySlug = decodeURIComponent(rawCitySlug || "").toLowerCase().trim();
    await connectToDatabase();
    const cityDoc = await City.findOne({ slug: citySlug, isActive: true }).lean();
    if (!cityDoc) return null;

    const [localities, institutes] = await Promise.all([
      Locality.find({ city: cityDoc._id, isActive: true }).select("name slug").sort({ name: 1 }).lean(),
      Institute.find({ city: cityDoc._id, isActive: true }).select("name slug").sort({ name: 1 }).lean(),
    ]);

    return {
      cityName: cityDoc.city,
      columns: buildCityFooterColumns(
        cityDoc.city,
        citySlug,
        localities.map((l) => ({ name: l.name, slug: l.slug })),
        institutes.map((i) => ({ name: i.name, slug: i.slug }))
      ),
    };
  } catch (error) {
    console.warn("[getCityFooterColumns] Error:", error);
    return null;
  }
}
