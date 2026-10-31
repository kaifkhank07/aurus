import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import { Hostel, IHostelDocument } from "@/models/hostel.model";
import { City, ICityDocument } from "@/models/city.model";
import { Locality, ILocalityDocument } from "@/models/locality.model";
import { Amenity, IAmenityDocument } from "@/models/amenity.model";
import { Occupancy, IOccupancyDocument } from "@/models/occupancy.model";
import { Room, IRoomDocument } from "@/models/room.model";
import { Service, IServiceDocument } from "@/models/service.model";
import { Institute, IInstituteDocument } from "@/models/institute.model";
import { RentFrequency, IRentFrequencyDocument } from "@/models/rent-frequency.model";
import { authenticateAdmin } from "@/middleware/admin-auth";
import { generateUniqueSlug } from "@/lib/slug";
import {
  apiSuccess,
  apiError,
  formatZodErrors,
  AppError,
  isNextBailoutError,
} from "@/lib/api-response";
import {
  createHostelSchema,
  updateHostelSchema,
  hostelQuerySchema,
  objectIdSchema,
} from "@/validations/hostel.validation";
import { SafeHostel, PaginatedHostelsResult, SafeHostelLocation, SafeHostelRent } from "@/types/hostel.types";
import { SafeCity } from "@/types/city.types";
import { SafeLocality } from "@/types/locality.types";
import { SafeAmenity } from "@/types/amenity.types";
import { SafeOccupancy } from "@/types/occupancy.types";
import { SafeRoom } from "@/types/room.types";
import { SafeService } from "@/types/service.types";
import { SafeInstitute } from "@/types/institute.types";
import { SafeRentFrequency } from "@/types/rent-frequency.types";
import { createLogger } from "@/lib/logger";
import { safeDeleteS3File, uploadS3File, uploadMultipleS3Files, parseRequestBody } from "@/lib/s3";
import { getMediaUrl } from "@/lib/media";

const logger = createLogger("HostelController");

function formatSafeHostel(doc: IHostelDocument): SafeHostel {
  // Format city in location
  let formattedCity: string | SafeCity;
  const rawCity = doc.location?.city as unknown;
  if (rawCity && typeof rawCity === "object" && "_id" in rawCity) {
    const cityDoc = rawCity as unknown as ICityDocument;
    formattedCity = {
      id: cityDoc._id.toString(),
      country: cityDoc.country,
      state: cityDoc.state,
      city: cityDoc.city,
      slug: cityDoc.slug,
      image: cityDoc.image && cityDoc.image.publickey
        ? {
            url: cityDoc.image.url || getMediaUrl(cityDoc.image.publickey) || "",
            publickey: cityDoc.image.publickey,
          }
        : undefined,
      sortOrder: cityDoc.sortOrder ?? 0,
      isActive: cityDoc.isActive ?? true,
      metadata: cityDoc.metadata
        ? {
            title: cityDoc.metadata.title,
            description: cityDoc.metadata.description,
            keywords: cityDoc.metadata.keywords,
          }
        : undefined,
      createdAt: cityDoc.createdAt ? cityDoc.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: cityDoc.updatedAt ? cityDoc.updatedAt.toISOString() : new Date().toISOString(),
    };
  } else {
    formattedCity = rawCity ? String(rawCity) : "";
  }

  // Format locality in location
  let formattedLocality: string | SafeLocality;
  const rawLocality = doc.location?.locality as unknown;
  if (rawLocality && typeof rawLocality === "object" && "_id" in rawLocality) {
    const locDoc = rawLocality as unknown as ILocalityDocument;
    formattedLocality = {
      id: locDoc._id.toString(),
      name: locDoc.name,
      slug: locDoc.slug,
      isActive: locDoc.isActive ?? true,
      city: locDoc.city ? String(locDoc.city) : "",
      createdAt: locDoc.createdAt ? locDoc.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: locDoc.updatedAt ? locDoc.updatedAt.toISOString() : new Date().toISOString(),
    };
  } else {
    formattedLocality = rawLocality ? String(rawLocality) : "";
  }

  const safeLocation: SafeHostelLocation = {
    city: formattedCity,
    locality: formattedLocality,
    address: doc.location?.address ?? "",
    mapUrl: doc.location?.mapUrl,
    longitude: doc.location?.longitude,
    latitude: doc.location?.latitude,
  };

  // Format amenities
  const formattedAmenities: (string | SafeAmenity)[] = (doc.amenities || []).map((amenity) => {
    const rawAmenity = amenity as unknown;
    if (rawAmenity && typeof rawAmenity === "object" && "_id" in rawAmenity) {
      const amenDoc = rawAmenity as unknown as IAmenityDocument;
      return {
        id: amenDoc._id.toString(),
        name: amenDoc.name,
        image: amenDoc.image && amenDoc.image.publickey
          ? {
              url: amenDoc.image.url || getMediaUrl(amenDoc.image.publickey) || "",
              publickey: amenDoc.image.publickey,
            }
          : undefined,
        isActive: amenDoc.isActive ?? true,
        createdAt: amenDoc.createdAt ? amenDoc.createdAt.toISOString() : new Date().toISOString(),
        updatedAt: amenDoc.updatedAt ? amenDoc.updatedAt.toISOString() : new Date().toISOString(),
      };
    }
    return String(rawAmenity);
  });

  // Format occupancy
  const formattedOccupancy: (string | SafeOccupancy)[] = (doc.occupancy || []).map((item) => {
    const raw = item as unknown;
    if (raw && typeof raw === "object" && "_id" in raw) {
      const occDoc = raw as unknown as IOccupancyDocument;
      return {
        id: occDoc._id.toString(),
        name: occDoc.name,
        image: occDoc.image && occDoc.image.publickey
          ? {
              url: occDoc.image.url || getMediaUrl(occDoc.image.publickey) || "",
              publickey: occDoc.image.publickey,
            }
          : undefined,
        isActive: occDoc.isActive ?? true,
        createdAt: occDoc.createdAt ? occDoc.createdAt.toISOString() : new Date().toISOString(),
        updatedAt: occDoc.updatedAt ? occDoc.updatedAt.toISOString() : new Date().toISOString(),
      };
    }
    return String(raw);
  });

  // Format room
  const formattedRoom: (string | SafeRoom)[] = (doc.room || []).map((item) => {
    const raw = item as unknown;
    if (raw && typeof raw === "object" && "_id" in raw) {
      const roomDoc = raw as unknown as IRoomDocument;
      return {
        id: roomDoc._id.toString(),
        name: roomDoc.name,
        image: roomDoc.image && roomDoc.image.publickey
          ? {
              url: roomDoc.image.url || getMediaUrl(roomDoc.image.publickey) || "",
              publickey: roomDoc.image.publickey,
            }
          : undefined,
        isActive: roomDoc.isActive ?? true,
        createdAt: roomDoc.createdAt ? roomDoc.createdAt.toISOString() : new Date().toISOString(),
        updatedAt: roomDoc.updatedAt ? roomDoc.updatedAt.toISOString() : new Date().toISOString(),
      };
    }
    return String(raw);
  });

  // Format services
  const formattedServices: (string | SafeService)[] = (doc.services || []).map((item) => {
    const raw = item as unknown;
    if (raw && typeof raw === "object" && "_id" in raw) {
      const servDoc = raw as unknown as IServiceDocument;
      return {
        id: servDoc._id.toString(),
        name: servDoc.name,
        image: servDoc.image && servDoc.image.publickey
          ? {
              url: servDoc.image.url || getMediaUrl(servDoc.image.publickey) || "",
              publickey: servDoc.image.publickey,
            }
          : undefined,
        isActive: servDoc.isActive ?? true,
        createdAt: servDoc.createdAt ? servDoc.createdAt.toISOString() : new Date().toISOString(),
        updatedAt: servDoc.updatedAt ? servDoc.updatedAt.toISOString() : new Date().toISOString(),
      };
    }
    return String(raw);
  });

  // Format institute
  const formattedInstitute: (string | SafeInstitute)[] = (doc.institute || []).map((item) => {
    const raw = item as unknown;
    if (raw && typeof raw === "object" && "_id" in raw) {
      const instDoc = raw as unknown as IInstituteDocument;
      return {
        id: instDoc._id.toString(),
        name: instDoc.name,
        slug: instDoc.slug,
        isActive: instDoc.isActive ?? true,
        city: instDoc.city ? String(instDoc.city) : "",
        createdAt: instDoc.createdAt ? instDoc.createdAt.toISOString() : new Date().toISOString(),
        updatedAt: instDoc.updatedAt ? instDoc.updatedAt.toISOString() : new Date().toISOString(),
      };
    }
    return String(raw);
  });

  // Format rent & rent frequency
  let formattedFrequency: string | SafeRentFrequency;
  const rawFreq = doc.rent?.frequency as unknown;
  if (rawFreq && typeof rawFreq === "object" && "_id" in rawFreq) {
    const freqDoc = rawFreq as unknown as IRentFrequencyDocument;
    formattedFrequency = {
      id: freqDoc._id.toString(),
      name: freqDoc.name,
      isActive: freqDoc.isActive ?? true,
      createdAt: freqDoc.createdAt ? freqDoc.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: freqDoc.updatedAt ? freqDoc.updatedAt.toISOString() : new Date().toISOString(),
    };
  } else {
    formattedFrequency = rawFreq ? String(rawFreq) : "";
  }

  const safeRent: SafeHostelRent = {
    amount:
      typeof doc.rent?.amount === "number"
        ? doc.rent.amount
        : typeof (doc as unknown as { rent?: number }).rent === "number"
        ? ((doc as unknown as { rent?: number }).rent as number)
        : 0,
    frequency: formattedFrequency,
  };

  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    subtitle: doc.subtitle,
    tenantType: doc.tenantType,
    isActive: doc.isActive ?? true,
    frontImage: {
      url: doc.frontImage?.url || getMediaUrl(doc.frontImage?.publickey) || "",
      publickey: doc.frontImage?.publickey || "",
    },
    galleryImages: (doc.galleryImages || []).map((img) => ({
      url: img.url || getMediaUrl(img.publickey) || "",
      publickey: img.publickey,
    })),
    rent: safeRent,
    amenities: formattedAmenities,
    occupancy: formattedOccupancy,
    room: formattedRoom,
    services: formattedServices,
    institute: formattedInstitute,
    rating: {
      star: doc.rating?.star ?? 0,
      userCount: doc.rating?.userCount ?? 0,
    },
    description: doc.description,
    location: safeLocation,
    brochure: doc.brochure && doc.brochure.publickey
      ? { url: doc.brochure.url || getMediaUrl(doc.brochure.publickey) || "", publickey: doc.brochure.publickey }
      : undefined,
    metadata: doc.metadata
      ? {
          title: doc.metadata.title,
          description: doc.metadata.description,
          keywords: doc.metadata.keywords,
        }
      : undefined,
    createdAt: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : new Date().toISOString(),
  };
}

async function resolveIdParam(
  paramsPromise: Promise<{ id: string }> | { id: string }
): Promise<string> {
  const resolved = await paramsPromise;
  const validated = objectIdSchema.safeParse(resolved.id);
  if (!validated.success) {
    throw new AppError("Invalid Hostel ID format.", 400);
  }
  return validated.data;
}

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

  // Mongoose duplicate key error
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: number }).code === 11000
  ) {
    logger.warn("Hostel slug or title conflict", { operation, statusCode: 409 });
    return apiError("A hostel with this slug or title already exists.", 409);
  }

  logger.error("Unhandled server error", error, { operation, statusCode: 500 });
  return apiError("Internal server error", 500);
}

/**
 * GET /api/admin/hostels
 * Retrieves a paginated list of hostels with comprehensive filtering and populated relations
 */
export async function list(request: NextRequest): Promise<NextResponse> {
  const operation = "list";
  try {
    await authenticateAdmin(request);

    const { searchParams } = new URL(request.url);
    const rawQuery: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      rawQuery[key] = val;
    });

    const validatedQuery = hostelQuerySchema.parse(rawQuery);
    const {
      page,
      limit,
      search,
      isActive,
      city,
      locality,
      tenantType,
      amenity,
      occupancy,
      room,
      service,
      institute,
      rentFrequency,
      minRent,
      maxRent,
      sortBy,
      sortOrderDir,
    } = validatedQuery;

    logger.info("Listing hostels started", {
      operation,
      page,
      limit,
      search,
      city,
      locality,
      tenantType,
      isActive,
    });

    await connectToDatabase();

    const filter: Record<string, unknown> = {};

    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    if (city) {
      if (!mongoose.Types.ObjectId.isValid(city)) {
        throw new AppError("Invalid City ID in filter.", 400);
      }
      filter["location.city"] = new mongoose.Types.ObjectId(city);
    }

    if (locality) {
      if (!mongoose.Types.ObjectId.isValid(locality)) {
        throw new AppError("Invalid Locality ID in filter.", 400);
      }
      filter["location.locality"] = new mongoose.Types.ObjectId(locality);
    }

    if (tenantType) {
      filter.tenantType = tenantType;
    }

    if (amenity) {
      if (!mongoose.Types.ObjectId.isValid(amenity)) {
        throw new AppError("Invalid Amenity ID in filter.", 400);
      }
      filter.amenities = new mongoose.Types.ObjectId(amenity);
    }

    if (occupancy) {
      if (!mongoose.Types.ObjectId.isValid(occupancy)) {
        throw new AppError("Invalid Occupancy ID in filter.", 400);
      }
      filter.occupancy = new mongoose.Types.ObjectId(occupancy);
    }

    if (room) {
      if (!mongoose.Types.ObjectId.isValid(room)) {
        throw new AppError("Invalid Room ID in filter.", 400);
      }
      filter.room = new mongoose.Types.ObjectId(room);
    }

    if (service) {
      if (!mongoose.Types.ObjectId.isValid(service)) {
        throw new AppError("Invalid Service ID in filter.", 400);
      }
      filter.services = new mongoose.Types.ObjectId(service);
    }

    if (institute) {
      if (!mongoose.Types.ObjectId.isValid(institute)) {
        throw new AppError("Invalid Institute ID in filter.", 400);
      }
      filter.institute = new mongoose.Types.ObjectId(institute);
    }

    if (rentFrequency) {
      if (!mongoose.Types.ObjectId.isValid(rentFrequency)) {
        throw new AppError("Invalid Rent Frequency ID in filter.", 400);
      }
      filter["rent.frequency"] = new mongoose.Types.ObjectId(rentFrequency);
    }

    if (minRent !== undefined || maxRent !== undefined) {
      const rentFilter: Record<string, number> = {};
      if (minRent !== undefined) rentFilter.$gte = minRent;
      if (maxRent !== undefined) rentFilter.$lte = maxRent;
      filter["rent.amount"] = rentFilter;
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { title: searchRegex },
        { subtitle: searchRegex },
        { slug: searchRegex },
      ];
    }

    const sortOptions: Record<string, 1 | -1> = {};
    const dir = sortOrderDir === "desc" ? -1 : 1;

    if (sortBy === "rent") {
      sortOptions["rent.amount"] = dir;
    } else if (sortBy === "star") {
      sortOptions["rating.star"] = dir;
    } else if (sortBy === "title") {
      sortOptions.title = dir;
    } else {
      sortOptions.createdAt = dir;
    }

    const skip = (page - 1) * limit;

    const [total, hostelDocs] = await Promise.all([
      Hostel.countDocuments(filter),
      Hostel.find(filter)
        .populate("location.city")
        .populate("location.locality")
        .populate("amenities")
        .populate("occupancy")
        .populate("room")
        .populate("services")
        .populate("institute")
        .populate("rent.frequency")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    const result: PaginatedHostelsResult = {
      items: hostelDocs.map(formatSafeHostel),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    logger.info("Hostels retrieved successfully", { operation, count: hostelDocs.length, total });
    return apiSuccess(result, "Hostels retrieved successfully.");
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * Helper to safely parse JSON or object fields from parsed FormData or JSON
 */
function normalizeObjectField<T>(field: unknown): T | undefined {
  if (field === undefined || field === null) return undefined;
  if (typeof field === "string") {
    try {
      return JSON.parse(field) as T;
    } catch {
      return undefined;
    }
  }
  return field as T;
}

/**
 * POST /api/admin/hostels
 * Creates a new Hostel with backend-managed slug and relationship verification
 */
export async function create(request: NextRequest): Promise<NextResponse> {
  const operation = "create";
  try {
    await authenticateAdmin(request);

    const body = await parseRequestBody(request);
    if (!body || Object.keys(body).length === 0) {
      throw new AppError("Request body is required.", 400);
    }

    // Parse stringified JSON fields from FormData
    if (typeof body.rent === "string") body.rent = normalizeObjectField(body.rent);
    if (typeof body.rating === "string") body.rating = normalizeObjectField(body.rating);
    if (typeof body.amenities === "string") body.amenities = normalizeObjectField(body.amenities);
    if (typeof body.occupancy === "string") body.occupancy = normalizeObjectField(body.occupancy);
    if (typeof body.room === "string") body.room = normalizeObjectField(body.room);
    if (typeof body.services === "string") body.services = normalizeObjectField(body.services);
    if (typeof body.institute === "string") body.institute = normalizeObjectField(body.institute);
    if (typeof body.location === "string") body.location = normalizeObjectField(body.location);
    if (typeof body.metadata === "string") body.metadata = normalizeObjectField(body.metadata);

    // Support rentAmount and rentFrequency flat parameters if passed
    if (!body.rent && (body.rentAmount !== undefined || body.rentFrequency !== undefined)) {
      body.rent = {
        amount: Number(body.rentAmount || 0),
        frequency: String(body.rentFrequency || ""),
      };
    }

    // Upload media files to S3
    if (body.frontImage) {
      body.frontImage = await uploadS3File(body.frontImage, "hostels");
    }
    if (body.brochure) {
      body.brochure = await uploadS3File(body.brochure, "hostels");
    }
    if (body.galleryImages) {
      body.galleryImages = await uploadMultipleS3Files(body.galleryImages, "hostels");
    }

    const validated = createHostelSchema.parse(body);

    logger.info("Creating hostel started", { operation, title: validated.title });

    await connectToDatabase();

    // Verify City exists
    const cityDoc = await City.findById(validated.location.city);
    if (!cityDoc) {
      throw new AppError("Referenced city does not exist.", 404);
    }

    // Verify Locality exists
    const localityDoc = await Locality.findById(validated.location.locality);
    if (!localityDoc) {
      throw new AppError("Referenced locality does not exist.", 404);
    }

    // Verify Locality belongs to City
    if (localityDoc.city.toString() !== validated.location.city) {
      throw new AppError(
        "Selected locality does not belong to the selected city.",
        400
      );
    }

    // Verify Rent Frequency exists
    const rentFreqDoc = await RentFrequency.findById(validated.rent.frequency);
    if (!rentFreqDoc) {
      throw new AppError("Referenced rent frequency does not exist.", 404);
    }

    // Verify Amenities exist
    if (validated.amenities && validated.amenities.length > 0) {
      const existingAmenityCount = await Amenity.countDocuments({
        _id: { $in: validated.amenities },
      });
      if (existingAmenityCount !== validated.amenities.length) {
        throw new AppError("One or more referenced amenities do not exist.", 404);
      }
    }

    // Verify Occupancies exist
    if (validated.occupancy && validated.occupancy.length > 0) {
      const count = await Occupancy.countDocuments({
        _id: { $in: validated.occupancy },
      });
      if (count !== validated.occupancy.length) {
        throw new AppError("One or more referenced occupancies do not exist.", 404);
      }
    }

    // Verify Rooms exist
    if (validated.room && validated.room.length > 0) {
      const count = await Room.countDocuments({
        _id: { $in: validated.room },
      });
      if (count !== validated.room.length) {
        throw new AppError("One or more referenced rooms do not exist.", 404);
      }
    }

    // Verify Services exist
    if (validated.services && validated.services.length > 0) {
      const count = await Service.countDocuments({
        _id: { $in: validated.services },
      });
      if (count !== validated.services.length) {
        throw new AppError("One or more referenced services do not exist.", 404);
      }
    }

    // Verify Institutes exist
    if (validated.institute && validated.institute.length > 0) {
      const count = await Institute.countDocuments({
        _id: { $in: validated.institute },
      });
      if (count !== validated.institute.length) {
        throw new AppError("One or more referenced institutes do not exist.", 404);
      }
    }

    // Backend-managed slug generation
    const slug = await generateUniqueSlug(Hostel, validated.title.trim());

    const newHostel = new Hostel({
      title: validated.title.trim(),
      slug,
      subtitle: validated.subtitle?.trim(),
      tenantType: validated.tenantType,
      isActive: validated.isActive ?? true,
      frontImage: validated.frontImage,
      galleryImages: validated.galleryImages ?? [],
      rent: {
        amount: validated.rent.amount,
        frequency: new mongoose.Types.ObjectId(validated.rent.frequency),
      },
      amenities: (validated.amenities || []).map((id) => new mongoose.Types.ObjectId(id)),
      occupancy: (validated.occupancy || []).map((id) => new mongoose.Types.ObjectId(id)),
      room: (validated.room || []).map((id) => new mongoose.Types.ObjectId(id)),
      services: (validated.services || []).map((id) => new mongoose.Types.ObjectId(id)),
      institute: (validated.institute || []).map((id) => new mongoose.Types.ObjectId(id)),
      rating: validated.rating ?? { star: 0, userCount: 0 },
      description: validated.description.trim(),
      location: {
        city: new mongoose.Types.ObjectId(validated.location.city),
        locality: new mongoose.Types.ObjectId(validated.location.locality),
        address: validated.location.address.trim(),
        mapUrl: validated.location.mapUrl || undefined,
        longitude: validated.location.longitude,
        latitude: validated.location.latitude,
      },
      brochure: validated.brochure,
      metadata: validated.metadata ?? {},
    });

    await newHostel.save();
    await newHostel.populate([
      "location.city",
      "location.locality",
      "amenities",
      "occupancy",
      "room",
      "services",
      "institute",
      "rent.frequency",
    ]);

    logger.info("Hostel created successfully", { operation, id: newHostel._id.toString(), slug });
    return apiSuccess(
      { hostel: formatSafeHostel(newHostel) },
      "Hostel created successfully.",
      201
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * GET /api/admin/hostels/[id]
 */
export async function getById(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "getById";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Fetching hostel by ID started", { operation, id: targetId });

    await connectToDatabase();
    const hostel = await Hostel.findById(targetId)
      .populate("location.city")
      .populate("location.locality")
      .populate("amenities")
      .populate("occupancy")
      .populate("room")
      .populate("services")
      .populate("institute")
      .populate("rent.frequency");

    if (!hostel) {
      throw new AppError("Hostel not found.", 404);
    }

    logger.info("Hostel retrieved successfully", { operation, id: targetId });
    return apiSuccess(
      { hostel: formatSafeHostel(hostel) },
      "Hostel retrieved successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * PATCH /api/admin/hostels/[id]
 */
export async function update(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "update";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    const body = await parseRequestBody(request);
    if (!body || Object.keys(body).length === 0) {
      throw new AppError("Request body is required.", 400);
    }

    // Parse stringified JSON fields from FormData
    if (typeof body.rent === "string") body.rent = normalizeObjectField(body.rent);
    if (typeof body.rating === "string") body.rating = normalizeObjectField(body.rating);
    if (typeof body.amenities === "string") body.amenities = normalizeObjectField(body.amenities);
    if (typeof body.occupancy === "string") body.occupancy = normalizeObjectField(body.occupancy);
    if (typeof body.room === "string") body.room = normalizeObjectField(body.room);
    if (typeof body.services === "string") body.services = normalizeObjectField(body.services);
    if (typeof body.institute === "string") body.institute = normalizeObjectField(body.institute);
    if (typeof body.location === "string") body.location = normalizeObjectField(body.location);
    if (typeof body.metadata === "string") body.metadata = normalizeObjectField(body.metadata);

    // Support flat rent parameters if passed
    if (!body.rent && (body.rentAmount !== undefined || body.rentFrequency !== undefined)) {
      body.rent = {
        amount: body.rentAmount !== undefined ? Number(body.rentAmount) : undefined,
        frequency: body.rentFrequency !== undefined ? String(body.rentFrequency) : undefined,
      };
    }

    if (body.frontImage) {
      body.frontImage = await uploadS3File(body.frontImage, "hostels");
    }
    if (body.brochure) {
      body.brochure = await uploadS3File(body.brochure, "hostels");
    }
    if (body.galleryImages) {
      body.galleryImages = await uploadMultipleS3Files(body.galleryImages, "hostels");
    }

    const validated = updateHostelSchema.parse(body);

    logger.info("Updating hostel started", { operation, id: targetId });

    await connectToDatabase();
    const hostel = await Hostel.findById(targetId);
    if (!hostel) {
      throw new AppError("Hostel not found.", 404);
    }

    // Handle Title & Slug update
    if (validated.title !== undefined) {
      const nextTitle = validated.title.trim();
      if (nextTitle.toLowerCase() !== hostel.title.toLowerCase()) {
        hostel.slug = await generateUniqueSlug(Hostel, nextTitle, targetId);
      }
      hostel.title = nextTitle;
    }

    if (validated.subtitle !== undefined) {
      hostel.subtitle = validated.subtitle.trim();
    }

    if (validated.tenantType !== undefined) {
      hostel.tenantType = validated.tenantType;
    }

    if (validated.isActive !== undefined) {
      hostel.isActive = validated.isActive;
    }

    const oldFrontImageKey = hostel.frontImage?.publickey;
    const oldBrochureKey = hostel.brochure?.publickey;
    const oldGalleryKeys = (hostel.galleryImages || []).map((img) => img.publickey);

    if (validated.frontImage !== undefined) {
      hostel.frontImage = validated.frontImage;
    }

    if (validated.galleryImages !== undefined) {
      hostel.galleryImages = validated.galleryImages;
    }

    // Update Rent details
    if (validated.rent !== undefined) {
      if (validated.rent.frequency !== undefined) {
        const freqDoc = await RentFrequency.findById(validated.rent.frequency);
        if (!freqDoc) {
          throw new AppError("Referenced rent frequency does not exist.", 404);
        }
        hostel.rent.frequency = new mongoose.Types.ObjectId(validated.rent.frequency);
      }
      if (validated.rent.amount !== undefined) {
        hostel.rent.amount = validated.rent.amount;
      }
    }

    // Update Rating
    if (validated.rating !== undefined) {
      hostel.rating = {
        star: validated.rating.star !== undefined ? validated.rating.star : hostel.rating?.star ?? 0,
        userCount: validated.rating.userCount !== undefined ? validated.rating.userCount : hostel.rating?.userCount ?? 0,
      };
    }

    if (validated.description !== undefined) {
      hostel.description = validated.description.trim();
    }

    if (validated.brochure === null) {
      hostel.brochure = undefined;
    } else if (validated.brochure !== undefined) {
      hostel.brochure = validated.brochure;
    }

    if (validated.metadata !== undefined) {
      hostel.metadata = validated.metadata;
    }

    // Handle Amenities update
    if (validated.amenities !== undefined) {
      if (validated.amenities.length > 0) {
        const existingAmenityCount = await Amenity.countDocuments({
          _id: { $in: validated.amenities },
        });
        if (existingAmenityCount !== validated.amenities.length) {
          throw new AppError("One or more referenced amenities do not exist.", 404);
        }
      }
      hostel.amenities = validated.amenities.map((id) => new mongoose.Types.ObjectId(id));
    }

    // Handle Occupancies update
    if (validated.occupancy !== undefined) {
      if (validated.occupancy.length > 0) {
        const count = await Occupancy.countDocuments({
          _id: { $in: validated.occupancy },
        });
        if (count !== validated.occupancy.length) {
          throw new AppError("One or more referenced occupancies do not exist.", 404);
        }
      }
      hostel.occupancy = validated.occupancy.map((id) => new mongoose.Types.ObjectId(id));
    }

    // Handle Rooms update
    if (validated.room !== undefined) {
      if (validated.room.length > 0) {
        const count = await Room.countDocuments({
          _id: { $in: validated.room },
        });
        if (count !== validated.room.length) {
          throw new AppError("One or more referenced rooms do not exist.", 404);
        }
      }
      hostel.room = validated.room.map((id) => new mongoose.Types.ObjectId(id));
    }

    // Handle Services update
    if (validated.services !== undefined) {
      if (validated.services.length > 0) {
        const count = await Service.countDocuments({
          _id: { $in: validated.services },
        });
        if (count !== validated.services.length) {
          throw new AppError("One or more referenced services do not exist.", 404);
        }
      }
      hostel.services = validated.services.map((id) => new mongoose.Types.ObjectId(id));
    }

    // Handle Institutes update
    if (validated.institute !== undefined) {
      if (validated.institute.length > 0) {
        const count = await Institute.countDocuments({
          _id: { $in: validated.institute },
        });
        if (count !== validated.institute.length) {
          throw new AppError("One or more referenced institutes do not exist.", 404);
        }
      }
      hostel.institute = validated.institute.map((id) => new mongoose.Types.ObjectId(id));
    }

    // Handle Location update
    if (validated.location !== undefined) {
      const nextCityId = validated.location.city || hostel.location.city.toString();
      const nextLocalityId = validated.location.locality || hostel.location.locality.toString();

      if (validated.location.city !== undefined || validated.location.locality !== undefined) {
        const [cityDoc, localityDoc] = await Promise.all([
          City.findById(nextCityId),
          Locality.findById(nextLocalityId),
        ]);

        if (!cityDoc) {
          throw new AppError("Referenced city does not exist.", 404);
        }
        if (!localityDoc) {
          throw new AppError("Referenced locality does not exist.", 404);
        }

        if (localityDoc.city.toString() !== nextCityId) {
          throw new AppError(
            "Selected locality does not belong to the selected city.",
            400
          );
        }

        hostel.location.city = new mongoose.Types.ObjectId(nextCityId);
        hostel.location.locality = new mongoose.Types.ObjectId(nextLocalityId);
      }

      if (validated.location.address !== undefined) {
        hostel.location.address = validated.location.address.trim();
      }

      if (validated.location.mapUrl !== undefined) {
        hostel.location.mapUrl = validated.location.mapUrl || undefined;
      }

      if (validated.location.longitude !== undefined) {
        hostel.location.longitude = validated.location.longitude;
      }

      if (validated.location.latitude !== undefined) {
        hostel.location.latitude = validated.location.latitude;
      }
    }

    await hostel.save();
    await hostel.populate([
      "location.city",
      "location.locality",
      "amenities",
      "occupancy",
      "room",
      "services",
      "institute",
      "rent.frequency",
    ]);

    // Clean up replaced S3 files
    const keysToDelete: string[] = [];
    if (validated.frontImage !== undefined && oldFrontImageKey && oldFrontImageKey !== validated.frontImage.publickey) {
      keysToDelete.push(oldFrontImageKey);
    }
    if (validated.brochure !== undefined && oldBrochureKey && oldBrochureKey !== validated.brochure?.publickey) {
      keysToDelete.push(oldBrochureKey);
    }
    if (validated.galleryImages !== undefined) {
      const newGalleryKeys = new Set(validated.galleryImages.map((img) => img.publickey));
      for (const k of oldGalleryKeys) {
        if (!newGalleryKeys.has(k)) {
          keysToDelete.push(k);
        }
      }
    }

    for (const k of keysToDelete) {
      safeDeleteS3File(k, targetId).catch((err) => {
        logger.warn("Failed to delete replaced hostel file from S3", { key: k, error: String(err) });
      });
    }

    logger.info("Hostel updated successfully", { operation, id: targetId, slug: hostel.slug });
    return apiSuccess(
      { hostel: formatSafeHostel(hostel) },
      "Hostel updated successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * DELETE /api/admin/hostels/[id]
 */
export async function deleteHostel(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "delete";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Deleting hostel started", { operation, id: targetId });

    await connectToDatabase();
    const hostel = await Hostel.findById(targetId);
    if (!hostel) {
      throw new AppError("Hostel not found.", 404);
    }

    // Collect all S3 keys attached to this hostel
    const hostelFiles: string[] = [];
    if (hostel.frontImage?.publickey) hostelFiles.push(hostel.frontImage.publickey);
    if (hostel.brochure?.publickey) hostelFiles.push(hostel.brochure.publickey);
    if (hostel.galleryImages?.length) {
      for (const img of hostel.galleryImages) {
        if (img.publickey) hostelFiles.push(img.publickey);
      }
    }

    await Hostel.findByIdAndDelete(targetId);

    // Clean up all unreferenced S3 files for this hostel
    for (const key of hostelFiles) {
      safeDeleteS3File(key, targetId).catch((err) => {
        logger.warn("Failed to delete hostel file from S3", { key, error: String(err) });
      });
    }

    logger.info("Hostel deleted successfully", { operation, id: targetId });
    return apiSuccess(
      { message: "Hostel deleted successfully.", id: targetId },
      "Hostel deleted successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * GET /api/residences
 * Public API to retrieve active residences with optional filtering:
 * - ?citySlug=... or ?cityId=... (filter by city)
 * - ?tenantType=... (girls, boys, co-ed)
 * - ?occupancy=... (filter by occupancy ObjectId or name)
 * - ?search=... (filter by title, subtitle, or address)
 * - ?page=... & ?limit=... (pagination)
 */
export async function listPublic(request: NextRequest): Promise<NextResponse> {
  const operation = "listPublic";
  try {
    const { searchParams } = new URL(request.url);
    const citySlug = searchParams.get("citySlug")?.trim().toLowerCase();
    const cityId = searchParams.get("cityId")?.trim();
    const tenantType = searchParams.get("tenantType")?.trim();
    const occupancy = searchParams.get("occupancy")?.trim() || searchParams.get("occupancyId")?.trim();
    const search = searchParams.get("search")?.trim();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10) || 20));

    logger.info("Listing public residences/hostels started", {
      operation,
      citySlug,
      cityId,
      tenantType,
      occupancy,
      search,
      page,
      limit,
    });

    await connectToDatabase();

    // Base filter: only active/published residences
    const filter: Record<string, unknown> = { isActive: true };

    // City filtering
    if (citySlug) {
      const cityDoc = await City.findOne({ slug: citySlug, isActive: true }).select("_id").lean();
      if (!cityDoc) {
        return apiSuccess(
          { items: [], total: 0, page, limit, totalPages: 0 },
          "No residences found"
        );
      }
      filter["location.city"] = cityDoc._id;
    } else if (cityId && mongoose.Types.ObjectId.isValid(cityId)) {
      filter["location.city"] = new mongoose.Types.ObjectId(cityId);
    }

    // Tenant type filtering
    if (tenantType) {
      filter.tenantType = tenantType;
    }

    // Occupancy filtering
    if (occupancy) {
      if (mongoose.Types.ObjectId.isValid(occupancy)) {
        filter.occupancy = new mongoose.Types.ObjectId(occupancy);
      } else {
        const escapedOcc = occupancy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const occDoc = await Occupancy.findOne({
          name: { $regex: new RegExp(`^${escapedOcc}$`, "i") },
          isActive: true,
        })
          .select("_id")
          .lean();

        if (!occDoc) {
          return apiSuccess(
            { items: [], total: 0, page, limit, totalPages: 0 },
            "No residences found"
          );
        }
        filter.occupancy = occDoc._id;
      }
    }

    // Text search filtering
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { title: { $regex: escaped, $options: "i" } },
        { subtitle: { $regex: escaped, $options: "i" } },
        { "location.address": { $regex: escaped, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

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
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Hostel.countDocuments(filter),
    ]);

    const items = docs.map((doc: any) => ({
      ...doc,
      id: doc._id?.toString() || doc.id || "",
      _id: doc._id?.toString() || doc.id || "",
    }));

    const totalPages = Math.ceil(total / limit) || 1;

    return apiSuccess(
      {
        items,
        total,
        page,
        limit,
        totalPages,
      },
      "Residences retrieved successfully"
    );
  } catch (error) {
    return handleError(error, operation);
  }
}
