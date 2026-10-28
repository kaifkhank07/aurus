import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import connectToDatabase from "@/lib/mongodb";
import { City, ICityDocument } from "@/models/city.model";
import { Locality } from "@/models/locality.model";
import { Institute } from "@/models/institute.model";
import { Hostel } from "@/models/hostel.model";
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
  createCitySchema,
  updateCitySchema,
  cityQuerySchema,
  objectIdSchema,
} from "@/validations/city.validation";
import { SafeCity, PaginatedCitiesResult } from "@/types/city.types";
import { createLogger } from "@/lib/logger";
import { safeDeleteS3File, uploadS3File, parseRequestBody } from "@/lib/s3";
import { getMediaUrl } from "@/lib/media";

const logger = createLogger("CityController");

function formatSafeCity(doc: ICityDocument): SafeCity {
  return {
    id: doc._id.toString(),
    country: doc.country,
    state: doc.state,
    city: doc.city,
    slug: doc.slug,
    image: doc.image && doc.image.publickey
      ? {
          url: doc.image.url || getMediaUrl(doc.image.publickey) || "",
          publickey: doc.image.publickey,
        }
      : undefined,
    sortOrder: doc.sortOrder ?? 0,
    isActive: doc.isActive ?? true,
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
    throw new AppError("Invalid City ID format.", 400);
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
    const keyPattern = (error as { keyPattern?: Record<string, number> }).keyPattern;
    if (keyPattern?.slug) {
      logger.warn("City slug conflict", { operation, statusCode: 409 });
      return apiError("A city with this slug already exists.", 409);
    }
    logger.warn("City unique constraint conflict", { operation, statusCode: 409 });
    return apiError(
      "A city with the same country, state, and name already exists.",
      409
    );
  }

  logger.error("Unhandled server error", error, { operation, statusCode: 500 });
  return apiError("Internal server error", 500);
}

/**
 * GET /api/admin/cities
 * Retrieves a paginated list of cities with optional filters & search
 */
export async function list(request: NextRequest): Promise<NextResponse> {
  const operation = "list";
  try {
    await authenticateAdmin(request);

    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const queryParams = cityQuerySchema.parse(searchParams);

    logger.info("Listing cities started", {
      operation,
      page: queryParams.page,
      limit: queryParams.limit,
      search: queryParams.search,
      country: queryParams.country,
      state: queryParams.state,
      isActive: queryParams.isActive,
    });

    await connectToDatabase();

    const filter: Record<string, unknown> = {};

    if (queryParams.search) {
      const escaped = queryParams.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");
      filter.$or = [{ city: regex }, { state: regex }, { country: regex }];
    }

    if (queryParams.country) {
      filter.country = { $regex: new RegExp(`^${queryParams.country.trim()}$`, "i") };
    }

    if (queryParams.state) {
      filter.state = { $regex: new RegExp(`^${queryParams.state.trim()}$`, "i") };
    }

    if (queryParams.isActive !== undefined) {
      filter.isActive = queryParams.isActive;
    }

    const page = queryParams.page || 1;
    const limit = queryParams.limit || 10;
    const skip = (page - 1) * limit;

    const sortField = queryParams.sortBy || "createdAt";
    const sortOrderDir = queryParams.sortOrderDir === "asc" ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortField]: sortOrderDir };

    const [total, cityDocs] = await Promise.all([
      City.countDocuments(filter),
      City.find(filter)
        .collation({ locale: "en", strength: 2 })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    const result: PaginatedCitiesResult = {
      items: cityDocs.map(formatSafeCity),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    logger.info("Cities retrieved successfully", { operation, count: cityDocs.length, total });
    return apiSuccess(result, "Cities retrieved successfully.");
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * POST /api/admin/cities
 * Creates a new City with backend-generated slug
 */
export async function create(request: NextRequest): Promise<NextResponse> {
  const operation = "create";
  try {
    await authenticateAdmin(request);

    const body = await parseRequestBody(request);
    if (!body || Object.keys(body).length === 0) {
      throw new AppError("Request body is required.", 400);
    }

    if (body.image) {
      body.image = await uploadS3File(body.image, "cities");
    }

    const validated = createCitySchema.parse(body);

    logger.info("Creating city started", {
      operation,
      city: validated.city,
      state: validated.state,
      country: validated.country,
    });

    await connectToDatabase();

    const normalizedCountry = validated.country.trim();
    const normalizedState = validated.state.trim();
    const normalizedCity = validated.city.trim();

    // Check duplicate country + state + city
    const existing = await City.findOne({
      country: { $regex: new RegExp(`^${normalizedCountry}$`, "i") },
      state: { $regex: new RegExp(`^${normalizedState}$`, "i") },
      city: { $regex: new RegExp(`^${normalizedCity}$`, "i") },
    });

    if (existing) {
      throw new AppError(
        "A city with the same country, state, and name already exists.",
        409
      );
    }

    // Backend-managed slug generation
    const slug = await generateUniqueSlug(City, normalizedCity);

    const newCity = new City({
      country: normalizedCountry,
      state: normalizedState,
      city: normalizedCity,
      slug,
      image: validated.image,
      sortOrder: validated.sortOrder ?? 0,
      isActive: validated.isActive ?? true,
      metadata: validated.metadata ?? {},
    });

    await newCity.save();

    logger.info("City created successfully", { operation, id: newCity._id.toString(), slug });
    return apiSuccess(
      { city: formatSafeCity(newCity) },
      "City created successfully.",
      201
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * GET /api/admin/cities/[id]
 */
export async function getById(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "getById";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Fetching city by ID started", { operation, id: targetId });

    await connectToDatabase();
    const city = await City.findById(targetId);
    if (!city) {
      throw new AppError("City not found.", 404);
    }

    logger.info("City retrieved successfully", { operation, id: targetId });
    return apiSuccess(
      { city: formatSafeCity(city) },
      "City retrieved successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * PATCH /api/admin/cities/[id]
 * Updates City and regenerates slug only if city name changed
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

    if (body.image) {
      body.image = await uploadS3File(body.image, "cities");
    }

    const validated = updateCitySchema.parse(body);

    logger.info("Updating city started", { operation, id: targetId });

    await connectToDatabase();
    const city = await City.findById(targetId);
    if (!city) {
      throw new AppError("City not found.", 404);
    }

    const nextCountry = validated.country !== undefined ? validated.country.trim() : city.country;
    const nextState = validated.state !== undefined ? validated.state.trim() : city.state;
    const nextCityName = validated.city !== undefined ? validated.city.trim() : city.city;

    // Check duplicate country + state + city across other records
    if (
      validated.country !== undefined ||
      validated.state !== undefined ||
      validated.city !== undefined
    ) {
      const existing = await City.findOne({
        _id: { $ne: targetId },
        country: { $regex: new RegExp(`^${nextCountry}$`, "i") },
        state: { $regex: new RegExp(`^${nextState}$`, "i") },
        city: { $regex: new RegExp(`^${nextCityName}$`, "i") },
      });

      if (existing) {
        throw new AppError(
          "A city with the same country, state, and name already exists.",
          409
        );
      }
    }

    // Regenerate slug if city name changed
    if (validated.city !== undefined && validated.city.trim().toLowerCase() !== city.city.toLowerCase()) {
      city.slug = await generateUniqueSlug(City, nextCityName, targetId);
    }

    const oldImageKey = city.image?.publickey;

    if (validated.country !== undefined) city.country = nextCountry;
    if (validated.state !== undefined) city.state = nextState;
    if (validated.city !== undefined) city.city = nextCityName;
    if (validated.image === null) {
      city.image = undefined;
    } else if (validated.image !== undefined) {
      city.image = validated.image;
    }
    if (validated.sortOrder !== undefined) city.sortOrder = validated.sortOrder;
    if (validated.isActive !== undefined) city.isActive = validated.isActive;
    if (validated.metadata !== undefined) city.metadata = validated.metadata;

    await city.save();

    // Clean up replaced S3 image
    if (validated.image !== undefined && oldImageKey && oldImageKey !== validated.image?.publickey) {
      safeDeleteS3File(oldImageKey, targetId).catch((err) => {
        logger.warn("Failed to delete replaced city image from S3", { error: String(err) });
      });
    }

    logger.info("City updated successfully", { operation, id: targetId, slug: city.slug });
    return apiSuccess(
      { city: formatSafeCity(city) },
      "City updated successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * DELETE /api/admin/cities/[id]
 * Enforces relationship integrity: Rejects deletion if Localities or Institutes exist
 */
export async function deleteCity(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "delete";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Deleting city started", { operation, id: targetId });

    await connectToDatabase();
    const city = await City.findById(targetId);
    if (!city) {
      throw new AppError("City not found.", 404);
    }

    // Check if any locality references this city
    const hasLocalities = await Locality.exists({ city: targetId });
    if (hasLocalities) {
      throw new AppError(
        "Cannot delete city: One or more localities are associated with this city. Remove or reassign them first.",
        409
      );
    }

    // Check if any institute references this city
    const hasInstitutes = await Institute.exists({ city: targetId });
    if (hasInstitutes) {
      throw new AppError(
        "Cannot delete city: One or more institutes are associated with this city. Remove or reassign them first.",
        409
      );
    }

    // Check if any hostel references this city
    const hasHostels = await Hostel.exists({ "location.city": targetId });
    if (hasHostels) {
      throw new AppError(
        "Cannot delete city: One or more hostels are associated with this city. Remove or reassign them first.",
        409
      );
    }

    const imageKey = city.image?.publickey;
    await City.findByIdAndDelete(targetId);

    // Clean up S3 image if unreferenced
    if (imageKey) {
      safeDeleteS3File(imageKey, targetId).catch((err) => {
        logger.warn("Failed to delete city image from S3", { error: String(err) });
      });
    }

    logger.info("City deleted successfully", { operation, id: targetId });
    return apiSuccess(
      { message: "City deleted successfully.", id: targetId },
      "City deleted successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}
