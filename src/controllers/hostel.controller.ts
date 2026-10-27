import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import { Hostel, IHostelDocument } from "@/models/hostel.model";
import { City, ICityDocument } from "@/models/city.model";
import { Locality, ILocalityDocument } from "@/models/locality.model";
import { Amenity, IAmenityDocument } from "@/models/amenity.model";
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
import { SafeHostel, PaginatedHostelsResult, SafeHostelLocation } from "@/types/hostel.types";
import { SafeCity } from "@/types/city.types";
import { SafeLocality } from "@/types/locality.types";
import { SafeAmenity } from "@/types/amenity.types";
import { createLogger } from "@/lib/logger";
import { safeDeleteS3File, uploadS3File, uploadMultipleS3Files, parseRequestBody } from "@/lib/s3";

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
      image: cityDoc.image
        ? { id: cityDoc.image.id, publickey: cityDoc.image.publickey }
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
        image: amenDoc.image
          ? { id: amenDoc.image.id, publickey: amenDoc.image.publickey }
          : undefined,
        isActive: amenDoc.isActive ?? true,
        createdAt: amenDoc.createdAt ? amenDoc.createdAt.toISOString() : new Date().toISOString(),
        updatedAt: amenDoc.updatedAt ? amenDoc.updatedAt.toISOString() : new Date().toISOString(),
      };
    }
    return String(rawAmenity);
  });

  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    subtitle: doc.subtitle,
    tenantType: doc.tenantType,
    isActive: doc.isActive ?? true,
    frontImage: {
      id: doc.frontImage?.id,
      publickey: doc.frontImage?.publickey,
    },
    galleryImages: (doc.galleryImages || []).map((img) => ({
      id: img.id,
      publickey: img.publickey,
    })),
    firstImage: doc.firstImage
      ? { id: doc.firstImage.id, publickey: doc.firstImage.publickey }
      : undefined,
    secondImage: doc.secondImage
      ? { id: doc.secondImage.id, publickey: doc.secondImage.publickey }
      : undefined,
    rent: doc.rent,
    rentFrequency: doc.rentFrequency,
    amenities: formattedAmenities,
    description: doc.description,
    location: safeLocation,
    brochure: doc.brochure
      ? { id: doc.brochure.id, publickey: doc.brochure.publickey }
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

    if (rentFrequency) {
      filter.rentFrequency = rentFrequency;
    }

    if (minRent !== undefined || maxRent !== undefined) {
      const rentFilter: Record<string, number> = {};
      if (minRent !== undefined) rentFilter.$gte = minRent;
      if (maxRent !== undefined) rentFilter.$lte = maxRent;
      filter.rent = rentFilter;
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
      sortOptions.rent = dir;
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

    if (body.frontImage) {
      body.frontImage = await uploadS3File(body.frontImage, "hostels");
    }
    if (body.firstImage) {
      body.firstImage = await uploadS3File(body.firstImage, "hostels");
    }
    if (body.secondImage) {
      body.secondImage = await uploadS3File(body.secondImage, "hostels");
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

    // Verify all Amenities exist if provided
    if (validated.amenities && validated.amenities.length > 0) {
      const existingAmenityCount = await Amenity.countDocuments({
        _id: { $in: validated.amenities },
      });
      if (existingAmenityCount !== validated.amenities.length) {
        throw new AppError("One or more referenced amenities do not exist.", 404);
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
      firstImage: validated.firstImage,
      secondImage: validated.secondImage,
      rent: validated.rent,
      rentFrequency: validated.rentFrequency,
      amenities: (validated.amenities || []).map((id) => new mongoose.Types.ObjectId(id)),
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
    await newHostel.populate(["location.city", "location.locality", "amenities"]);

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
      .populate("amenities");

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

    if (body.frontImage) {
      body.frontImage = await uploadS3File(body.frontImage, "hostels");
    }
    if (body.firstImage) {
      body.firstImage = await uploadS3File(body.firstImage, "hostels");
    }
    if (body.secondImage) {
      body.secondImage = await uploadS3File(body.secondImage, "hostels");
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
    const oldFirstImageKey = hostel.firstImage?.publickey;
    const oldSecondImageKey = hostel.secondImage?.publickey;
    const oldBrochureKey = hostel.brochure?.publickey;
    const oldGalleryKeys = (hostel.galleryImages || []).map((img) => img.publickey);

    if (validated.frontImage !== undefined) {
      hostel.frontImage = validated.frontImage;
    }

    if (validated.galleryImages !== undefined) {
      hostel.galleryImages = validated.galleryImages;
    }

    if (validated.firstImage === null) {
      hostel.firstImage = undefined;
    } else if (validated.firstImage !== undefined) {
      hostel.firstImage = validated.firstImage;
    }

    if (validated.secondImage === null) {
      hostel.secondImage = undefined;
    } else if (validated.secondImage !== undefined) {
      hostel.secondImage = validated.secondImage;
    }

    if (validated.rent !== undefined) {
      hostel.rent = validated.rent;
    }

    if (validated.rentFrequency !== undefined) {
      hostel.rentFrequency = validated.rentFrequency;
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
    await hostel.populate(["location.city", "location.locality", "amenities"]);

    // Clean up replaced S3 files
    const keysToDelete: string[] = [];
    if (validated.frontImage !== undefined && oldFrontImageKey && oldFrontImageKey !== validated.frontImage.publickey) {
      keysToDelete.push(oldFrontImageKey);
    }
    if (validated.firstImage !== undefined && oldFirstImageKey && oldFirstImageKey !== validated.firstImage?.publickey) {
      keysToDelete.push(oldFirstImageKey);
    }
    if (validated.secondImage !== undefined && oldSecondImageKey && oldSecondImageKey !== validated.secondImage?.publickey) {
      keysToDelete.push(oldSecondImageKey);
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
    if (hostel.firstImage?.publickey) hostelFiles.push(hostel.firstImage.publickey);
    if (hostel.secondImage?.publickey) hostelFiles.push(hostel.secondImage.publickey);
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
