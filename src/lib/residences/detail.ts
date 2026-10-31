import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import { Hostel, IHostelDocument } from "@/models/hostel.model";
import { Occupancy } from "@/models/occupancy.model";
// Ensure models are registered for Mongoose population
import "@/models/city.model";
import "@/models/locality.model";
import "@/models/amenity.model";
import {
  ResidenceDetail,
  KeySpec,
  RoomOption,
  ExploreResidenceItem,
} from "@/data/residences";
import { mapHostelsToExploreItems } from "./city";

/**
 * Maps a MongoDB Hostel document into the full ResidenceDetail data structure
 * required by the Aurus ResidenceDetail component.
 */
export function mapHostelToResidenceDetail(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hostel: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  occupancies: any[] = []
): ResidenceDetail {
  // 1. Title & Subtitle formatting
  let title = hostel.title || "Residence";
  let subtitle = hostel.subtitle || "";
  if (!subtitle && title.includes("(") && title.includes(")")) {
    const match = title.match(/^(.*?)\s*(\(.*?\))\s*$/);
    if (match) {
      title = match[1].trim();
      subtitle = match[2].trim();
    }
  }

  // 2. Gender badge and wing text
  const tenantTypes = Array.isArray(hostel.tenantType)
    ? hostel.tenantType.map((t: string) => String(t).toLowerCase())
    : [];
  let genderBadge = "CO-ED LIVING";
  let wingText = "Co-ed Living";
  if (
    tenantTypes.includes("co-ed") ||
    tenantTypes.includes("coed") ||
    (tenantTypes.includes("girls") && tenantTypes.includes("boys"))
  ) {
    genderBadge = "CO-ED LIVING";
    wingText = "Co-ed Living";
  } else if (tenantTypes.includes("girls")) {
    genderBadge = "GIRLS ONLY";
    wingText = "Girls Only";
  } else if (tenantTypes.includes("boys")) {
    genderBadge = "BOYS ONLY";
    wingText = "Boys Only";
  }

  // 3. Location info & badge
  const localityName =
    (typeof hostel.location?.locality === "object"
      ? hostel.location.locality?.name
      : hostel.location?.locality) || "";
  const cityName =
    (typeof hostel.location?.city === "object"
      ? hostel.location.city?.city || hostel.location.city?.name
      : hostel.location?.city) || "";
  const locationBadge =
    localityName && cityName
      ? `${localityName}, ${cityName}`.toUpperCase()
      : (localityName || cityName || "MUMBAI").toUpperCase();

  const address =
    hostel.location?.address ||
    (localityName && cityName ? `${localityName}, ${cityName}` : cityName || "Prime Location");

  const mapUrl =
    hostel.location?.mapUrl ||
    (hostel.location?.latitude && hostel.location?.longitude
      ? `https://maps.google.com/?q=${hostel.location.latitude},${hostel.location.longitude}`
      : `https://maps.google.com/?q=${encodeURIComponent(address)}`);

  // 4. Hero and Gallery Images
  const galleryUrls: string[] = [];
  if (hostel.frontImage?.url) galleryUrls.push(hostel.frontImage.url);
  if (Array.isArray(hostel.galleryImages)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hostel.galleryImages.forEach((img: any) => {
      if (img?.url && !galleryUrls.includes(img.url)) {
        galleryUrls.push(img.url);
      }
    });
  }
  if (hostel.firstImage?.url && !galleryUrls.includes(hostel.firstImage.url)) {
    galleryUrls.push(hostel.firstImage.url);
  }
  if (hostel.secondImage?.url && !galleryUrls.includes(hostel.secondImage.url)) {
    galleryUrls.push(hostel.secondImage.url);
  }

  const mainImage = galleryUrls[0] || "/images/image03.png";
  const galleryImages =
    galleryUrls.length > 1
      ? galleryUrls.slice(1)
      : [mainImage, mainImage];

  // 5. Rooms & Occupancies Specs
  const roomNames = occupancies.map((o) => o.name).filter(Boolean);
  const roomsSpecValue =
    roomNames.length > 0 ? roomNames.join(", ") : "Single, Double, Triple";

  // 6. Billing Period Spec
  const billingText =
    hostel.rentFrequency === "yearly"
      ? "Yearly"
      : hostel.rentFrequency
      ? hostel.rentFrequency.charAt(0).toUpperCase() + hostel.rentFrequency.slice(1)
      : "Monthly";

  const keySpecs: KeySpec[] = [
    { label: "WING", value: wingText },
    { label: "ROOMS", value: roomsSpecValue },
    { label: "RATING", value: "★ 4.9 (48 reviews)" },
    { label: "BILLING", value: billingText },
  ];

  // 7. Amenities -> includedInStay
  const amenityNames: string[] = Array.isArray(hostel.amenities)
    ? hostel.amenities
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((a: any) => (typeof a === "object" ? a?.name : ""))
        .filter(Boolean)
    : [];

  const defaultInclusions = [
    "24/7 Biometric access",
    "Professional security staff",
    "Daily housekeeping",
    "High-speed 1 Gbps Wi-Fi",
    "Furnished room & fresh linen",
    "Study lounge & quiet areas",
    "Chef-prepared four fresh meals",
    "Laundry & ironing service",
  ];

  const includedInStay =
    amenityNames.length >= 4
      ? amenityNames
      : Array.from(new Set([...amenityNames, ...defaultInclusions])).slice(0, 8);

  const chapterIncludes = [
    "FOUR MEALS A DAY",
    "DAILY HOUSEKEEPING",
    "LAUNDRY",
    "HIGH-SPEED WI-FI",
    "RESIDENT APP",
    "FURNISHED ROOM + LINEN",
    "EVENTS CALENDAR",
    "NO HIDDEN CHARGES",
  ];

  // 8. Near campus
  const distance =
    hostel.subtitle ||
    (localityName && cityName
      ? `Located in ${localityName}, ${cityName}.`
      : `Prime central location in ${cityName || "the city"}.`);

  const colleges: string[] =
    Array.isArray(hostel.metadata?.keywords) && hostel.metadata.keywords.length > 0
      ? hostel.metadata.keywords
      : ["NMIMS", "MITHIBAI COLLEGE", "DJ SANGHVI", "NM COLLEGE"];

  // 9. Pricing & Room options
  const startsFrom = hostel.rent
    ? `₹${Number(hostel.rent).toLocaleString("en-IN")}`
    : "₹60,000";

  const period = hostel.rentFrequency === "yearly" ? "/year" : "/month";

  const roomOptions: RoomOption[] =
    roomNames.length > 0
      ? roomNames.map((name) => ({
          type:
            name.toLowerCase().includes("sharing") || name.toLowerCase().includes("occupancy")
              ? name
              : `${name} Sharing`,
          status: "Available",
        }))
      : [
          { type: "Triple Sharing", status: "Available" },
          { type: "Double Sharing", status: "Available" },
          { type: "Single Occupancy", status: "Available" },
        ];

  roomOptions.push({
    type: "Meals, Wi-Fi, Housekeeping",
    status: "Included",
    isIncluded: true,
  });

  return {
    slug: hostel.slug,
    title,
    subtitle,
    genderBadge,
    locationBadge,
    mainImage,
    galleryImages,
    description:
      hostel.description ||
      "A premium student residence crafted for comfort, safety, and an enriching community experience. Featuring elegantly designed interiors, dedicated study zones, and chef-curated dining.",
    keySpecs,
    includedInStay,
    chapterIncludes,
    nearCampus: {
      distance,
      colleges,
    },
    location: {
      label: "ADDRESS",
      address,
      mapUrl,
    },
    pricing: {
      startsFrom,
      period,
      roomOptions,
      scheduleVisitText: "SCHEDULE A VISIT",
      whatsappText: "WHATSAPP US",
      whatsappNumber: "919876543210",
      callText: "CALL 1800-872-0768",
      callNumber: "18008720768",
      disclaimer:
        "Prices are indicative and vary by room type and floor. Final pricing is confirmed during your visit.",
    },
  };
}

/**
 * Retrieves a hostel by its slug or ID, fully populated with city, locality, and amenities.
 * Returns the mapped ResidenceDetail and raw document, or null if not found.
 */
export async function getHostelBySlug(slug: string): Promise<{
  residenceDetail: ResidenceDetail;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  raw: any;
} | null> {
  if (!slug) return null;
  await connectToDatabase();

  const normalizedSlug = slug.toLowerCase().trim();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = { isActive: true };
  if (mongoose.Types.ObjectId.isValid(slug)) {
    filter.$or = [{ slug: normalizedSlug }, { _id: new mongoose.Types.ObjectId(slug) }];
  } else {
    filter.slug = normalizedSlug;
  }

  const [hostel, occupancies] = await Promise.all([
    Hostel.findOne(filter)
      .populate("location.city", "city state country slug")
      .populate("location.locality", "name slug")
      .populate("amenities", "name image")
      .lean(),
    Occupancy.find({ isActive: true }).sort({ createdAt: 1 }).lean(),
  ]);

  if (!hostel) {
    return null;
  }

  const residenceDetail = mapHostelToResidenceDetail(hostel, occupancies);
  return {
    residenceDetail,
    raw: hostel,
  };
}

/**
 * Retrieves up to 3 related active residences (hostels) for the current residence.
 * Prioritizes hostels in the same city.
 */
export async function getRelatedHostels(
  currentHostelId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cityId?: any
): Promise<ExploreResidenceItem[]> {
  await connectToDatabase();

  const currentObjectId = mongoose.Types.ObjectId.isValid(currentHostelId)
    ? new mongoose.Types.ObjectId(currentHostelId)
    : null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = { isActive: true };
  if (currentObjectId) {
    filter._id = { $ne: currentObjectId };
  }

  const hostels = await Hostel.find(filter)
    .populate("location.city", "city state country slug")
    .populate("location.locality", "name slug")
    .populate("amenities", "name image")
    .sort({ createdAt: -1 })
    .limit(6)
    .lean<IHostelDocument[]>();

  if (!hostels || hostels.length === 0) {
    return [];
  }

  // Sort to prioritize same city if cityId was provided
  const sorted = [...hostels].sort((a, b) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const aCityId = (a.location?.city as any)?._id?.toString() || String(a.location?.city || "");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bCityId = (b.location?.city as any)?._id?.toString() || String(b.location?.city || "");
    const targetCityStr = cityId ? cityId.toString() : "";
    if (aCityId === targetCityStr && bCityId !== targetCityStr) return -1;
    if (bCityId === targetCityStr && aCityId !== targetCityStr) return 1;
    return 0;
  });

  const top3 = sorted.slice(0, 3);
  return mapHostelsToExploreItems(top3, "");
}

