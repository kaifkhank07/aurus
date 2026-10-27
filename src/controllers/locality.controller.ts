import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import { Locality, ILocalityDocument } from "@/models/locality.model";
import { City, ICityDocument } from "@/models/city.model";
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
  createLocalitySchema,
  updateLocalitySchema,
  localityQuerySchema,
  objectIdSchema,
} from "@/validations/locality.validation";
import { SafeLocality, PaginatedLocalitiesResult } from "@/types/locality.types";
import { createLogger } from "@/lib/logger";

const logger = createLogger("LocalityController");

function formatSafeLocality(doc: ILocalityDocument): SafeLocality {
  let cityField: SafeLocality["city"];
  const rawCity = doc.city as unknown;

  if (rawCity && typeof rawCity === "object" && "_id" in rawCity) {
    const populatedCity = rawCity as unknown as ICityDocument;
    cityField = {
      id: populatedCity._id.toString(),
      country: populatedCity.country,
      state: populatedCity.state,
      city: populatedCity.city,
      slug: populatedCity.slug,
      image: populatedCity.image
        ? { id: populatedCity.image.id, publickey: populatedCity.image.publickey }
        : undefined,
      sortOrder: populatedCity.sortOrder ?? 0,
      isActive: populatedCity.isActive ?? true,
      metadata: populatedCity.metadata
        ? {
            title: populatedCity.metadata.title,
            description: populatedCity.metadata.description,
            keywords: populatedCity.metadata.keywords,
          }
        : undefined,
      createdAt: populatedCity.createdAt ? populatedCity.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: populatedCity.updatedAt ? populatedCity.updatedAt.toISOString() : new Date().toISOString(),
    };
  } else {
    cityField = rawCity ? String(rawCity) : "";
  }

  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    city: cityField,
    isActive: doc.isActive ?? true,
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
    throw new AppError("Invalid Locality ID format.", 400);
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
      logger.warn("Locality slug conflict", { operation, statusCode: 409 });
      return apiError("A locality with this slug already exists.", 409);
    }
    logger.warn("Locality unique constraint conflict", { operation, statusCode: 409 });
    return apiError(
      "A locality with this name already exists in the selected city.",
      409
    );
  }

  logger.error("Unhandled server error", error, { operation, statusCode: 500 });
  return apiError("Internal server error", 500);
}

/**
 * GET /api/admin/localities
 * Retrieves a paginated list of localities with filtering and search
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

    const queryParams = localityQuerySchema.parse(rawQuery);

    logger.info("Listing localities started", {
      operation,
      page: queryParams.page,
      limit: queryParams.limit,
      search: queryParams.search,
      city: queryParams.city,
      isActive: queryParams.isActive,
    });

    await connectToDatabase();

    const filter: Record<string, unknown> = {};

    if (queryParams.search) {
      const escaped = queryParams.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.name = { $regex: new RegExp(escaped, "i") };
    }

    if (queryParams.city) {
      filter.city = new mongoose.Types.ObjectId(queryParams.city);
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

    const [total, localityDocs] = await Promise.all([
      Locality.countDocuments(filter),
      Locality.find(filter)
        .populate("city")
        .collation({ locale: "en", strength: 2 })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    const result: PaginatedLocalitiesResult = {
      items: localityDocs.map(formatSafeLocality),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    logger.info("Localities retrieved successfully", { operation, count: localityDocs.length, total });
    return apiSuccess(result, "Localities retrieved successfully.");
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * POST /api/admin/localities
 * Creates a new Locality with backend-generated slug and city validation
 */
export async function create(request: NextRequest): Promise<NextResponse> {
  const operation = "create";
  try {
    await authenticateAdmin(request);

    const body = await request.json().catch(() => null);
    if (!body) {
      throw new AppError("Request body is required.", 400);
    }

    const validated = createLocalitySchema.parse(body);

    logger.info("Creating locality started", { operation, name: validated.name, city: validated.city });

    await connectToDatabase();

    // Verify City exists
    const cityDoc = await City.findById(validated.city);
    if (!cityDoc) {
      throw new AppError("Referenced city does not exist.", 404);
    }

    const normalizedName = validated.name.trim();

    // Prevent duplicate locality names within the same city
    const existing = await Locality.findOne({
      city: validated.city,
      name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
    });

    if (existing) {
      throw new AppError(
        "A locality with this name already exists in the selected city.",
        409
      );
    }

    // Backend-managed slug generation
    const slug = await generateUniqueSlug(Locality, normalizedName);

    const newLocality = new Locality({
      name: normalizedName,
      slug,
      city: new mongoose.Types.ObjectId(validated.city),
      isActive: validated.isActive ?? true,
    });

    await newLocality.save();
    await newLocality.populate("city");

    logger.info("Locality created successfully", { operation, id: newLocality._id.toString(), slug });
    return apiSuccess(
      { locality: formatSafeLocality(newLocality) },
      "Locality created successfully.",
      201
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * GET /api/admin/localities/[id]
 */
export async function getById(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "getById";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Fetching locality by ID started", { operation, id: targetId });

    await connectToDatabase();
    const locality = await Locality.findById(targetId).populate("city");
    if (!locality) {
      throw new AppError("Locality not found.", 404);
    }

    logger.info("Locality retrieved successfully", { operation, id: targetId });
    return apiSuccess(
      { locality: formatSafeLocality(locality) },
      "Locality retrieved successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * PATCH /api/admin/localities/[id]
 */
export async function update(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "update";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    const body = await request.json().catch(() => null);
    if (!body) {
      throw new AppError("Request body is required.", 400);
    }

    const validated = updateLocalitySchema.parse(body);

    logger.info("Updating locality started", { operation, id: targetId });

    await connectToDatabase();
    const locality = await Locality.findById(targetId);
    if (!locality) {
      throw new AppError("Locality not found.", 404);
    }

    let nextCityId = locality.city.toString();
    if (validated.city && validated.city !== nextCityId) {
      const cityDoc = await City.findById(validated.city);
      if (!cityDoc) {
        throw new AppError("Referenced city does not exist.", 404);
      }

      // Check if hostels reference this locality before moving it to another city
      const hasHostels = await Hostel.exists({ "location.locality": targetId });
      if (hasHostels) {
        throw new AppError(
          "Cannot reassign locality to a different city: One or more hostels are associated with this locality.",
          409
        );
      }

      nextCityId = validated.city;
      locality.city = new mongoose.Types.ObjectId(validated.city);
    }

    const nextName = validated.name !== undefined ? validated.name.trim() : locality.name;

    // Check duplicate name in the same city
    if (validated.name !== undefined || validated.city !== undefined) {
      const existing = await Locality.findOne({
        _id: { $ne: targetId },
        city: nextCityId,
        name: { $regex: new RegExp(`^${nextName}$`, "i") },
      });

      if (existing) {
        throw new AppError(
          "A locality with this name already exists in the selected city.",
          409
        );
      }
    }

    // Regenerate slug if name changed
    if (validated.name !== undefined && validated.name.trim().toLowerCase() !== locality.name.toLowerCase()) {
      locality.slug = await generateUniqueSlug(Locality, nextName, targetId);
      locality.name = nextName;
    }

    if (validated.isActive !== undefined) {
      locality.isActive = validated.isActive;
    }

    await locality.save();
    await locality.populate("city");

    logger.info("Locality updated successfully", { operation, id: targetId, slug: locality.slug });
    return apiSuccess(
      { locality: formatSafeLocality(locality) },
      "Locality updated successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * DELETE /api/admin/localities/[id]
 */
export async function deleteLocality(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "delete";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Deleting locality started", { operation, id: targetId });

    await connectToDatabase();
    const locality = await Locality.findById(targetId);
    if (!locality) {
      throw new AppError("Locality not found.", 404);
    }

    // Check if any hostel references this locality
    const hasHostels = await Hostel.exists({ "location.locality": targetId });
    if (hasHostels) {
      throw new AppError(
        "Cannot delete locality: One or more hostels are associated with this locality. Remove or reassign them first.",
        409
      );
    }

    await Locality.findByIdAndDelete(targetId);

    logger.info("Locality deleted successfully", { operation, id: targetId });
    return apiSuccess(
      { message: "Locality deleted successfully.", id: targetId },
      "Locality deleted successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}
