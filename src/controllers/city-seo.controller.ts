import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { ZodError } from "zod";
import connectToDatabase from "@/lib/mongodb";
import { City, ICityDocument } from "@/models/city.model";
import { Hostel, IHostelDocument } from "@/models/hostel.model";
import { Locality, ILocalityDocument } from "@/models/locality.model";
import { Institute, IInstituteDocument } from "@/models/institute.model";
import { Occupancy } from "@/models/occupancy.model";
import "@/models/amenity.model";
import "@/models/room.model";
import "@/models/service.model";
import "@/models/rent-frequency.model";
import {
  apiSuccess,
  apiError,
  formatZodErrors,
  AppError,
  isNextBailoutError,
} from "@/lib/api-response";
import {
  citySlugParamSchema,
  cityHostelsQuerySchema,
  cityListQuerySchema,
} from "@/validations/city-seo.validation";
import { PublicCity } from "@/types/city.types";
import { SafeHostel } from "@/types/hostel.types";
import {
  CitySeoLocalityItem,
  CitySeoInstituteItem,
  CitySeoCityDetails,
  CitySeoPaginatedHostels,
} from "@/types/city-seo.types";
import { createLogger } from "@/lib/logger";
import { getMediaUrl } from "@/lib/media";

const logger = createLogger("CitySeoController");

/**
 * Standardized error handling matching Aurus controllers.
 */
function handleError(error: unknown, operation = "general"): NextResponse {
  if (isNextBailoutError(error)) {
    throw error;
  }

  if (error instanceof AppError) {
    if (error.statusCode >= 500) {
      logger.error(error.message, error, { operation, statusCode: error.statusCode });
    } else {
      logger.warn(error.message, { operation, statusCode: error.statusCode, errors: error.errors });
    }
    return apiError(error.message, error.statusCode, error.errors);
  }

  if (error instanceof ZodError) {
    const formattedErrors = formatZodErrors(error);
    logger.warn("Validation failed", { operation, statusCode: 400, errors: formattedErrors });
    return apiError("Validation failed", 400, formattedErrors);
  }

  logger.error(`Unhandled error during ${operation}`, error as Error, { operation });
  return apiError("An internal server error occurred.", 500);
}

/**
 * Normalizes a raw Mongoose City doc into PublicCity format (matches [citySlug]/page.tsx).
 */
function formatPublicCity(cityDoc: any, activeHostelsCount = 0): PublicCity {
  const cityId = cityDoc._id ? cityDoc._id.toString() : cityDoc.id || "";
  return {
    id: cityId,
    _id: cityId,
    country: cityDoc.country,
    state: cityDoc.state,
    city: cityDoc.city,
    name: cityDoc.city,
    slug: cityDoc.slug,
    image: cityDoc.image && cityDoc.image.publickey
      ? {
          url: cityDoc.image.url || getMediaUrl(cityDoc.image.publickey) || "",
          publickey: cityDoc.image.publickey,
        }
      : cityDoc.image,
    sortOrder: cityDoc.sortOrder ?? 0,
    isActive: cityDoc.isActive ?? true,
    activeHostelsCount,
    count: activeHostelsCount,
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
}

/**
 * Normalizes a raw Mongoose Hostel doc into SafeHostel format.
 */
function formatSafeHostel(doc: any): SafeHostel {
  const hostelId = doc._id ? doc._id.toString() : doc.id || "";
  return {
    ...doc,
    id: hostelId,
    _id: hostelId,
    createdAt: doc.createdAt
      ? new Date(doc.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: doc.updatedAt
      ? new Date(doc.updatedAt).toISOString()
      : new Date().toISOString(),
  };
}

/**
 * Resolves and validates city slug parameter.
 */
async function resolveCitySlug(
  paramsPromise: Promise<{ citySlug: string }> | { citySlug: string }
): Promise<string> {
  const resolved = await paramsPromise;
  const validated = citySlugParamSchema.safeParse(resolved);
  if (!validated.success) {
    throw new AppError("Invalid city slug format.", 400, formatZodErrors(validated.error));
  }
  return validated.data.citySlug.toLowerCase().trim();
}

/**
 * Finds an active city by slug or ObjectId.
 */
async function findActiveCity(citySlug: string): Promise<ICityDocument> {
  await connectToDatabase();

  const query: Record<string, unknown> = { isActive: true };
  if (mongoose.Types.ObjectId.isValid(citySlug)) {
    query._id = new mongoose.Types.ObjectId(citySlug);
  } else {
    query.slug = citySlug;
  }

  const city = await City.findOne(query).lean<ICityDocument>();
  if (!city) {
    throw new AppError(`City '${citySlug}' not found or inactive.`, 404);
  }

  return city;
}

/**
 * 1. GET /api/city-seo/cities
 * Public city listing with active hostels count, and optionally full active hostel listings.
 */
export async function listCitiesWithHostels(request: NextRequest): Promise<NextResponse> {
  const operation = "listCitiesWithHostels";
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = cityListQuerySchema.parse(Object.fromEntries(searchParams.entries()));

    await connectToDatabase();

    const cityFilter: Record<string, unknown> = { isActive: true };
    if (queryParams.search) {
      const escaped = queryParams.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      cityFilter.$or = [
        { city: { $regex: escaped, $options: "i" } },
        { state: { $regex: escaped, $options: "i" } },
        { country: { $regex: escaped, $options: "i" } },
      ];
    }

    const [cities, counts] = await Promise.all([
      City.find(cityFilter).sort({ sortOrder: 1, city: 1 }).lean<ICityDocument[]>(),
      Hostel.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: "$location.city", count: { $sum: 1 } } },
      ]),
    ]);

    const countMap = new Map<string, number>();
    counts.forEach((item: { _id: unknown; count: number }) => {
      if (item._id) {
        countMap.set(String(item._id), item.count);
      }
    });

    let items = cities.map((c) => {
      const count = countMap.get(c._id.toString()) || 0;
      return formatPublicCity(c, count);
    });

    if (queryParams.hasHostels) {
      items = items.filter((c) => c.activeHostelsCount > 0);
    }

    // Optionally include active hostels for each city
    if (queryParams.includeHostels) {
      const cityIds = items.map((c) => new mongoose.Types.ObjectId(c.id));
      const allHostels = await Hostel.find({
        "location.city": { $in: cityIds },
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

      const hostelMap = new Map<string, SafeHostel[]>();
      allHostels.forEach((h: any) => {
        const cId = h.location?.city?._id?.toString() || h.location?.city?.toString();
        if (cId) {
          const list = hostelMap.get(cId) || [];
          list.push(formatSafeHostel(h));
          hostelMap.set(cId, list);
        }
      });

      const itemsWithHostels = items.map((city) => ({
        ...city,
        hostels: hostelMap.get(city.id) || [],
      }));

      return apiSuccess(
        { items: itemsWithHostels, total: itemsWithHostels.length },
        "Cities and active hostels retrieved successfully."
      );
    }

    return apiSuccess(
      { items, total: items.length },
      "Public cities retrieved successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * 1 (Detail). GET /api/city-seo/cities/[citySlug]
 * Returns public city details with active hostels (matching [citySlug]/page.tsx).
 */
export async function getCityWithHostels(
  request: NextRequest,
  context: { params: Promise<{ citySlug: string }> | { citySlug: string } }
): Promise<NextResponse> {
  const operation = "getCityWithHostels";
  try {
    const citySlug = await resolveCitySlug(context.params);
    const cityDoc = await findActiveCity(citySlug);

    // Fetch active hostels in this city (same population as [citySlug]/page.tsx)
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

    const city: PublicCity = formatPublicCity(cityDoc, rawResidences.length);
    const hostels: SafeHostel[] = rawResidences.map(formatSafeHostel);

    const result: CitySeoCityDetails = {
      city,
      hostels,
      totalHostels: hostels.length,
    };

    return apiSuccess(result, `City '${city.city}' and its active hostels retrieved successfully.`);
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * 2. GET /api/city-seo/cities/[citySlug]/hostels
 * Public hostels for a particular city with filters (tenantType, occupancy, locality, institute, search, rent, pagination).
 */
export async function getHostelsForCity(
  request: NextRequest,
  context: { params: Promise<{ citySlug: string }> | { citySlug: string } }
): Promise<NextResponse> {
  const operation = "getHostelsForCity";
  try {
    const citySlug = await resolveCitySlug(context.params);
    const cityDoc = await findActiveCity(citySlug);

    const { searchParams } = new URL(request.url);
    const query = cityHostelsQuerySchema.parse(Object.fromEntries(searchParams.entries()));

    const filter: Record<string, unknown> = {
      "location.city": cityDoc._id,
      isActive: true,
    };

    // Filter: tenantType
    if (query.tenantType) {
      filter.tenantType = query.tenantType;
    }

    // Filter: occupancy
    if (query.occupancyId) {
      filter.occupancy = new mongoose.Types.ObjectId(query.occupancyId);
    } else if (query.occupancy) {
      if (mongoose.Types.ObjectId.isValid(query.occupancy)) {
        filter.occupancy = new mongoose.Types.ObjectId(query.occupancy);
      } else {
        const escapedOcc = query.occupancy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const occDoc = await Occupancy.findOne({
          name: { $regex: new RegExp(`^${escapedOcc}$`, "i") },
          isActive: true,
        })
          .select("_id")
          .lean();

        if (!occDoc) {
          const emptyResult: CitySeoPaginatedHostels = {
            city: formatPublicCity(cityDoc, 0),
            items: [],
            total: 0,
            page: query.page,
            limit: query.limit,
            totalPages: 0,
            pagination: {
              total: 0,
              page: query.page,
              limit: query.limit,
              totalPages: 0,
              hasNextPage: false,
              hasPrevPage: false,
            },
          };
          return apiSuccess(emptyResult, "No hostels found matching the specified occupancy.");
        }
        filter.occupancy = occDoc._id;
      }
    }

    // Filter: locality (scoped strictly to this city)
    if (query.localityId) {
      filter["location.locality"] = new mongoose.Types.ObjectId(query.localityId);
    } else if (query.localitySlug) {
      const locDoc = await Locality.findOne({
        slug: query.localitySlug.toLowerCase().trim(),
        city: cityDoc._id,
        isActive: true,
      })
        .select("_id")
        .lean();

      if (!locDoc) {
        const emptyResult: CitySeoPaginatedHostels = {
          city: formatPublicCity(cityDoc, 0),
          items: [],
          total: 0,
          page: query.page,
          limit: query.limit,
          totalPages: 0,
          pagination: {
            total: 0,
            page: query.page,
            limit: query.limit,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        };
        return apiSuccess(emptyResult, "No hostels found for this locality in the specified city.");
      }
      filter["location.locality"] = locDoc._id;
    }

    // Filter: institute / college (scoped strictly to this city)
    if (query.instituteId) {
      filter.institute = new mongoose.Types.ObjectId(query.instituteId);
    } else if (query.instituteSlug) {
      const instDoc = await Institute.findOne({
        slug: query.instituteSlug.toLowerCase().trim(),
        city: cityDoc._id,
        isActive: true,
      })
        .select("_id")
        .lean();

      if (!instDoc) {
        const emptyResult: CitySeoPaginatedHostels = {
          city: formatPublicCity(cityDoc, 0),
          items: [],
          total: 0,
          page: query.page,
          limit: query.limit,
          totalPages: 0,
          pagination: {
            total: 0,
            page: query.page,
            limit: query.limit,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        };
        return apiSuccess(emptyResult, "No hostels found near this institute in the specified city.");
      }
      filter.institute = instDoc._id;
    }

    // Filter: text search (matches title, subtitle, address, locality, and institute/college)
    if (query.search) {
      const escaped = query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(escaped, "i");

      // Find matching localities and institutes in this city
      const [matchingLocs, matchingInsts] = await Promise.all([
        Locality.find({
          name: { $regex: searchRegex },
          city: cityDoc._id,
          isActive: true,
        }).select("_id").lean(),
        Institute.find({
          name: { $regex: searchRegex },
          city: cityDoc._id,
          isActive: true,
        }).select("_id").lean(),
      ]);

      const searchOrConditions: Array<Record<string, unknown>> = [
        { title: { $regex: escaped, $options: "i" } },
        { subtitle: { $regex: escaped, $options: "i" } },
        { "location.address": { $regex: escaped, $options: "i" } },
      ];

      if (matchingLocs.length > 0) {
        searchOrConditions.push({
          "location.locality": { $in: matchingLocs.map((l) => l._id) },
        });
      }

      if (matchingInsts.length > 0) {
        searchOrConditions.push({
          institute: { $in: matchingInsts.map((i) => i._id) },
        });
      }

      filter.$or = searchOrConditions;
    }

    // Filter: rent range
    if (query.minRent !== undefined || query.maxRent !== undefined) {
      const rentFilter: Record<string, number> = {};
      if (query.minRent !== undefined) rentFilter.$gte = query.minRent;
      if (query.maxRent !== undefined) rentFilter.$lte = query.maxRent;
      filter["rent.amount"] = rentFilter;
    }

    // Sorting
    const sortDirection = query.sortOrder === "asc" ? 1 : -1;
    let sortField = "createdAt";
    if (query.sortBy === "rent") sortField = "rent.amount";
    else if (query.sortBy === "title") sortField = "title";
    else if (query.sortBy === "rating") sortField = "rating.star";

    const sortObject: Record<string, 1 | -1> = { [sortField]: sortDirection };
    if (sortField !== "createdAt") {
      sortObject.createdAt = -1;
    }

    const skip = (query.page - 1) * query.limit;

    const [docs, total] = await Promise.all([
      Hostel.find(filter)
        .populate("location.city", "city state country slug")
        .populate("location.locality", "name slug")
        .populate("amenities", "name image")
        .populate("occupancy", "name image")
        .populate("room", "name image")
        .populate("services", "name image")
        .populate("institute", "name slug")
        .populate("rent.frequency", "name")
        .sort(sortObject)
        .skip(skip)
        .limit(query.limit)
        .lean(),
      Hostel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / query.limit) || 1;
    const items: SafeHostel[] = docs.map(formatSafeHostel);

    const result: CitySeoPaginatedHostels = {
      city: formatPublicCity(cityDoc, total),
      items,
      total,
      page: query.page,
      limit: query.limit,
      totalPages,
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPrevPage: query.page > 1,
      },
    };

    return apiSuccess(result, `Hostels for ${cityDoc.city} retrieved successfully.`);
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * 3. GET /api/city-seo/cities/[citySlug]/localities
 * List of localities for that city with active hostel counts.
 */
export async function getLocalitiesForCity(
  request: NextRequest,
  context: { params: Promise<{ citySlug: string }> | { citySlug: string } }
): Promise<NextResponse> {
  const operation = "getLocalitiesForCity";
  try {
    const citySlug = await resolveCitySlug(context.params);
    const cityDoc = await findActiveCity(citySlug);

    const [localities, counts] = await Promise.all([
      Locality.find({
        city: cityDoc._id,
        isActive: true,
      })
        .sort({ name: 1 })
        .lean<ILocalityDocument[]>(),
      Hostel.aggregate([
        {
          $match: {
            "location.city": cityDoc._id,
            isActive: true,
          },
        },
        {
          $group: {
            _id: "$location.locality",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const countMap = new Map<string, number>();
    counts.forEach((item: { _id: unknown; count: number }) => {
      if (item._id) {
        countMap.set(String(item._id), item.count);
      }
    });

    const items: CitySeoLocalityItem[] = localities.map((loc) => ({
      id: loc._id.toString(),
      _id: loc._id.toString(),
      name: loc.name,
      slug: loc.slug,
      city: cityDoc._id.toString(),
      cityName: cityDoc.city,
      citySlug: cityDoc.slug,
      hostelCount: countMap.get(loc._id.toString()) || 0,
      isActive: loc.isActive,
      createdAt: loc.createdAt ? new Date(loc.createdAt).toISOString() : undefined,
      updatedAt: loc.updatedAt ? new Date(loc.updatedAt).toISOString() : undefined,
    }));

    return apiSuccess(
      {
        city: formatPublicCity(cityDoc),
        localities: items,
        total: items.length,
      },
      `Localities for ${cityDoc.city} retrieved successfully.`
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * 4. GET /api/city-seo/cities/[citySlug]/institutes
 * List of colleges or institutes for that city with active hostel counts.
 */
export async function getInstitutesForCity(
  request: NextRequest,
  context: { params: Promise<{ citySlug: string }> | { citySlug: string } }
): Promise<NextResponse> {
  const operation = "getInstitutesForCity";
  try {
    const citySlug = await resolveCitySlug(context.params);
    const cityDoc = await findActiveCity(citySlug);

    const [institutes, counts] = await Promise.all([
      Institute.find({
        city: cityDoc._id,
        isActive: true,
      })
        .sort({ name: 1 })
        .lean<IInstituteDocument[]>(),
      Hostel.aggregate([
        {
          $match: {
            "location.city": cityDoc._id,
            isActive: true,
          },
        },
        { $unwind: "$institute" },
        {
          $group: {
            _id: "$institute",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const countMap = new Map<string, number>();
    counts.forEach((item: { _id: unknown; count: number }) => {
      if (item._id) {
        countMap.set(String(item._id), item.count);
      }
    });

    const items: CitySeoInstituteItem[] = institutes.map((inst) => ({
      id: inst._id.toString(),
      _id: inst._id.toString(),
      name: inst.name,
      slug: inst.slug,
      city: cityDoc._id.toString(),
      cityName: cityDoc.city,
      citySlug: cityDoc.slug,
      hostelCount: countMap.get(inst._id.toString()) || 0,
      isActive: inst.isActive,
      createdAt: inst.createdAt ? new Date(inst.createdAt).toISOString() : undefined,
      updatedAt: inst.updatedAt ? new Date(inst.updatedAt).toISOString() : undefined,
    }));

    return apiSuccess(
      {
        city: formatPublicCity(cityDoc),
        institutes: items,
        total: items.length,
      },
      `Institutes for ${cityDoc.city} retrieved successfully.`
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

