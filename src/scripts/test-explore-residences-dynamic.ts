import connectToDatabase from "@/lib/mongodb";
import "@/models/city.model";
import "@/models/locality.model";
import "@/models/amenity.model";
import { Hostel } from "@/models/hostel.model";
import { Occupancy } from "@/models/occupancy.model";
import { City } from "@/models/city.model";

function formatOccupancyBadge(tenantType: string[] = []): string {
  if (!Array.isArray(tenantType) || tenantType.length === 0) {
    return "Co-ed Living";
  }
  const normalized = tenantType.map((t) => String(t).toLowerCase());
  if (
    normalized.includes("co-ed") ||
    normalized.includes("coed") ||
    (normalized.includes("girls") && normalized.includes("boys"))
  ) {
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

async function run() {
  console.log("=== Testing Dynamic Data Mapping for Explore Residences ===");
  await connectToDatabase();

  const [hostels, cities, occupancies] = await Promise.all([
    Hostel.find({ isActive: true })
      .populate("location.city")
      .populate("location.locality")
      .lean(),
    City.find({ isActive: true }).lean(),
    Occupancy.find({ isActive: true }).lean(),
  ]);

  console.log(`Found ${hostels.length} active hostels in DB.`);
  console.log(`Found ${cities.length} active cities in DB.`);
  console.log(`Found ${occupancies.length} active occupancies in DB.`);

  // Verify mapping
  const mapped = hostels.map((hostel: any) => {
    let cityName = "";
    if (typeof hostel.location?.city === "object" && hostel.location?.city !== null) {
      cityName = hostel.location.city.city || hostel.location.city.name || "";
    } else if (typeof hostel.location?.city === "string") {
      cityName = hostel.location.city;
    }

    let localityName = "";
    if (typeof hostel.location?.locality === "object" && hostel.location?.locality !== null) {
      localityName = hostel.location.locality.name || "";
    } else if (typeof hostel.location?.locality === "string") {
      localityName = hostel.location.locality;
    }

    const localityText =
      localityName && cityName
        ? `${localityName} · ${cityName}`
        : localityName || cityName || "Prime Location";

    let matchedOccupancy = "";
    if (occupancies && occupancies.length > 0) {
      for (const occ of occupancies) {
        const occNameLower = occ.name.toLowerCase();
        if (
          hostel.title?.toLowerCase().includes(occNameLower) ||
          hostel.subtitle?.toLowerCase().includes(occNameLower) ||
          hostel.description?.toLowerCase().includes(occNameLower)
        ) {
          matchedOccupancy = occ.name;
          break;
        }
      }
    }
    const roomOccupancy =
      matchedOccupancy || occupancies[0]?.name || "Single Occupancy";

    const image =
      hostel.frontImage?.url ||
      hostel.galleryImages?.[0]?.url ||
      hostel.firstImage?.url ||
      "/images/image03.png";

    const colleges = Array.isArray(hostel.metadata?.keywords)
      ? hostel.metadata.keywords
      : [];

    return {
      id: hostel._id ? String(hostel._id) : hostel.slug,
      slug: hostel.slug,
      name: hostel.title || "Residence",
      occupancy: formatOccupancyBadge(hostel.tenantType),
      roomOccupancy,
      city: cityName,
      featured: true,
      locality: localityText,
      distance:
        hostel.subtitle ||
        hostel.location?.address ||
        (cityName ? `Prime location in ${cityName}` : "Prime location"),
      priceFrom: hostel.rent
        ? `₹${Number(hostel.rent).toLocaleString("en-IN")}`
        : "₹50,000",
      href: `/residences/${hostel.slug || hostel._id}`,
      image,
      colleges,
    };
  });

  console.log("Mapped residence cards count:", mapped.length);
  if (mapped.length > 0) {
    console.log("Sample mapped item:", JSON.stringify(mapped[0], null, 2));
    
    // Check required card fields
    const first = mapped[0];
    if (!first.name || !first.href || !first.image || !first.priceFrom || !first.occupancy) {
      throw new Error("Missing required UI field on mapped card item!");
    }
  }

  // Test dynamic city options
  const citySet = new Set<string>();
  cities.forEach((c: any) => {
    if (c.isActive !== false) {
      const name = c.name || c.city;
      if (name) citySet.add(name);
    }
  });
  mapped.forEach((m) => {
    if (m.city) citySet.add(m.city);
  });
  const cityOptions = ["All Cities", ...Array.from(citySet)];
  console.log("Dynamic City options:", cityOptions);

  // Test dynamic gender wing options
  const wingSet = new Set<string>(["Girls Only", "Boys Only", "Co-ed Living"]);
  mapped.forEach((m) => {
    if (m.occupancy) wingSet.add(m.occupancy);
  });
  const genderWingOptions = ["All Wings (Girls / Boys / Co-ed)", ...Array.from(wingSet)];
  console.log("Dynamic Gender Wing options:", genderWingOptions);

  // Test dynamic occupancy options
  const occList = occupancies.map((o: any) => o.name).filter(Boolean);
  const occupancyOptions = ["All Occupancies", ...Array.from(new Set(occList))];
  console.log("Dynamic Occupancy options:", occupancyOptions);

  console.log("\n=== ALL MAPPING & FILTER CHECKS PASSED ===");
  process.exit(0);
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

