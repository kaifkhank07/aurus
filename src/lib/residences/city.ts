import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import { City, ICityDocument } from "@/models/city.model";
import { Hostel, IHostelDocument } from "@/models/hostel.model";
// Ensure related models are registered
import "@/models/locality.model";
import "@/models/amenity.model";
import { ExploreResidenceItem } from "@/data/residences";

export interface CitySummary {
  _id: string;
  name: string;
  slug: string;
  state: string;
  country: string;
  count: number;
  image?: {
    url: string;
    publickey: string;
  };
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

/**
 * Retrieve all cities from City Master that have at least one eligible (active) residence.
 */
export async function getCitiesWithResidences(): Promise<CitySummary[]> {
  await connectToDatabase();

  const activeCityIds = await Hostel.distinct("location.city", { isActive: true });
  if (!activeCityIds || activeCityIds.length === 0) {
    return [];
  }

  const cities = await City.find({
    _id: { $in: activeCityIds },
    isActive: true,
  })
    .sort({ sortOrder: 1, city: 1 })
    .lean<ICityDocument[]>();

  const counts = await Hostel.aggregate([
    {
      $match: {
        isActive: true,
        "location.city": { $in: activeCityIds },
      },
    },
    {
      $group: {
        _id: "$location.city",
        count: { $sum: 1 },
      },
    },
  ]);

  const countMap = new Map<string, number>();
  counts.forEach((item: { _id: { toString(): string }; count: number }) => {
    countMap.set(item._id.toString(), item.count);
  });

  return cities.map((c) => ({
    _id: c._id.toString(),
    name: c.city,
    slug: c.slug,
    state: c.state,
    country: c.country,
    count: countMap.get(c._id.toString()) || 0,
    image: c.image?.url ? { url: c.image.url, publickey: c.image.publickey } : undefined,
    metadata: c.metadata
      ? {
          title: c.metadata.title,
          description: c.metadata.description,
          keywords: c.metadata.keywords,
        }
      : undefined,
  }));
}

/**
 * Retrieve city details by slug from City Master.
 * Automatically verifies that the city has eligible (active) residences.
 * Returns null if the city does not exist or has 0 eligible residences.
 */
export async function getCityBySlug(slug: string): Promise<CitySummary | null> {
  if (!slug) return null;
  await connectToDatabase();

  const normalizedSlug = slug.toLowerCase().trim();
  const city = await City.findOne({ slug: normalizedSlug, isActive: true }).lean<ICityDocument>();
  if (!city) {
    return null;
  }

  const count = await Hostel.countDocuments({
    "location.city": city._id,
    isActive: true,
  });

  if (count === 0) {
    return null;
  }

  return {
    _id: city._id.toString(),
    name: city.city,
    slug: city.slug,
    state: city.state,
    country: city.country,
    count,
    image: city.image?.url ? { url: city.image.url, publickey: city.image.publickey } : undefined,
    metadata: city.metadata
      ? {
          title: city.metadata.title,
          description: city.metadata.description,
          keywords: city.metadata.keywords,
        }
      : undefined,
  };
}

/**
 * Retrieve all active residences (hostels) for a given city ID.
 */
export async function getResidencesByCityId(cityId: string) {
  await connectToDatabase();

  const objectId = mongoose.Types.ObjectId.isValid(cityId)
    ? new mongoose.Types.ObjectId(cityId)
    : null;

  if (!objectId) return [];

  const hostels = await Hostel.find({
    "location.city": objectId,
    isActive: true,
  })
    .populate("location.city", "city state country slug")
    .populate("location.locality", "name slug")
    .populate("amenities", "name image")
    .sort({ createdAt: -1 })
    .lean<IHostelDocument[]>();

  return hostels;
}

/**
 * Formats tenantType array into user-facing occupancy badge.
 */
function formatOccupancyBadge(tenantType: string[] = []): "Girls Only" | "Boys Only" | "Co-ed Living" {
  const normalized = tenantType.map((t) => t.toLowerCase());
  if (normalized.includes("co-ed") || (normalized.includes("girls") && normalized.includes("boys"))) {
    return "Co-ed Living";
  }
  if (normalized.includes("girls")) {
    return "Girls Only";
  }
  if (normalized.includes("boys")) {
    return "Boys Only";
  }
  return "Co-ed Living";
}

/**
 * Maps MongoDB Hostel documents to ExploreResidenceItem format for rendering in Aurus residence cards.
 */
export function mapHostelsToExploreItems(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hostels: any[],
  cityName?: string
): ExploreResidenceItem[] {
  return hostels.map((hostel) => {
    const city =
      cityName ||
      (typeof hostel.location?.city === "object"
        ? hostel.location.city?.city || hostel.location.city?.name
        : hostel.location?.city) ||
      "";

    const localityName =
      hostel.location?.locality?.name ||
      (typeof hostel.location?.locality === "string" ? hostel.location?.locality : "");
    const localityText =
      localityName && city ? `${localityName} · ${city}` : localityName || city || "Prime Location";

    return {
      id: hostel._id ? String(hostel._id) : hostel.slug,
      _id: hostel._id ? String(hostel._id) : hostel.slug,
      slug: hostel.slug,
      name: hostel.title,
      occupancy: formatOccupancyBadge(hostel.tenantType),
      roomOccupancy: "Single Occupancy",
      city,
      featured: true,
      locality: localityText,
      distance:
        hostel.subtitle ||
        hostel.location?.address ||
        (city ? `Prime location in ${city}` : "Prime location"),
      priceFrom: `₹${Number(hostel.rent || 0).toLocaleString("en-IN")}`,
      href: `/residences/${hostel.slug}`,
      image: hostel.frontImage?.url || "/images/image03.png",
      colleges: Array.isArray(hostel.metadata?.keywords) ? hostel.metadata.keywords : [],
    };
  });
}

