import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import connectToDatabase from "@/lib/mongodb";
import { Amenity, IAmenityDocument } from "@/models/amenity.model";
import { Hostel } from "@/models/hostel.model";
import { authenticateAdmin } from "@/middleware/admin-auth";
import {
  apiSuccess,
  apiError,
  formatZodErrors,
  AppError,
  isNextBailoutError,
} from "@/lib/api-response";
import {
  createAmenitySchema,
  updateAmenitySchema,
  amenityQuerySchema,
  objectIdSchema,
} from "@/validations/amenity.validation";
import { SafeAmenity, PaginatedAmenitiesResult } from "@/types/amenity.types";
import { createLogger } from "@/lib/logger";
import { safeDeleteS3File, uploadS3File, parseRequestBody } from "@/lib/s3";

const logger = createLogger("AmenityController");

function formatSafeAmenity(doc: IAmenityDocument): SafeAmenity {
  return {
    id: doc._id.toString(),
    name: doc.name,
    image: doc.image
      ? {
          id: doc.image.id,
          publickey: doc.image.publickey,
        }
      : undefined,
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
    throw new AppError("Invalid Amenity ID format.", 400);
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
    logger.warn("Amenity name conflict", { operation, statusCode: 409 });
    return apiError("An amenity with this name already exists.", 409);
  }

  logger.error("Unhandled server error", error, { operation, statusCode: 500 });
  return apiError("Internal server error", 500);
}

/**
 * GET /api/admin/amenities
 * Retrieves a paginated list of amenities with optional search & active status filter
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

    const validatedQuery = amenityQuerySchema.parse(rawQuery);
    const { page, limit, search, isActive, sortBy, sortOrderDir } = validatedQuery;

    logger.info("Listing amenities started", {
      operation,
      page,
      limit,
      search,
      isActive,
      sortBy,
      sortOrderDir,
    });

    await connectToDatabase();

    const filter: Record<string, unknown> = {};

    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    if (search) {
      filter.name = { $regex: new RegExp(search, "i") };
    }

    const sortOptions: Record<string, 1 | -1> = {};
    const sortField = sortBy || "createdAt";
    sortOptions[sortField] = sortOrderDir === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    const [total, amenities] = await Promise.all([
      Amenity.countDocuments(filter),
      Amenity.find(filter)
        .collation({ locale: "en", strength: 2 })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    const result: PaginatedAmenitiesResult = {
      items: amenities.map(formatSafeAmenity),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    logger.info("Amenities retrieved successfully", { operation, count: amenities.length, total });
    return apiSuccess(result, "Amenities retrieved successfully.");
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * POST /api/admin/amenities
 * Creates a new Amenity record
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
      body.image = await uploadS3File(body.image, "amenities");
    }

    const validated = createAmenitySchema.parse(body);

    logger.info("Creating amenity started", { operation, name: validated.name });

    await connectToDatabase();

    const normalizedName = validated.name.trim();

    // Check duplicate name
    const existing = await Amenity.findOne({
      name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
    });

    if (existing) {
      throw new AppError("An amenity with this name already exists.", 409);
    }

    const newAmenity = new Amenity({
      name: normalizedName,
      image: validated.image,
      isActive: validated.isActive ?? true,
    });

    await newAmenity.save();

    logger.info("Amenity created successfully", { operation, id: newAmenity._id.toString() });
    return apiSuccess(
      { amenity: formatSafeAmenity(newAmenity) },
      "Amenity created successfully.",
      201
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * GET /api/admin/amenities/[id]
 */
export async function getById(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "getById";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Fetching amenity by ID started", { operation, id: targetId });

    await connectToDatabase();
    const amenity = await Amenity.findById(targetId);
    if (!amenity) {
      throw new AppError("Amenity not found.", 404);
    }

    logger.info("Amenity retrieved successfully", { operation, id: targetId });
    return apiSuccess(
      { amenity: formatSafeAmenity(amenity) },
      "Amenity retrieved successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * PATCH /api/admin/amenities/[id]
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
      body.image = await uploadS3File(body.image, "amenities");
    }

    const validated = updateAmenitySchema.parse(body);

    logger.info("Updating amenity started", { operation, id: targetId });

    await connectToDatabase();
    const amenity = await Amenity.findById(targetId);
    if (!amenity) {
      throw new AppError("Amenity not found.", 404);
    }

    if (validated.name !== undefined) {
      const normalizedName = validated.name.trim();
      if (normalizedName.toLowerCase() !== amenity.name.toLowerCase()) {
        const existing = await Amenity.findOne({
          _id: { $ne: targetId },
          name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
        });

        if (existing) {
          throw new AppError("An amenity with this name already exists.", 409);
        }
      }
      amenity.name = normalizedName;
    }

    const oldImageKey = amenity.image?.publickey;

    if (validated.image === null) {
      amenity.image = undefined;
    } else if (validated.image !== undefined) {
      amenity.image = validated.image;
    }

    if (validated.isActive !== undefined) {
      amenity.isActive = validated.isActive;
    }

    await amenity.save();

    // Clean up replaced S3 image
    if (validated.image !== undefined && oldImageKey && oldImageKey !== validated.image?.publickey) {
      safeDeleteS3File(oldImageKey, targetId).catch((err) => {
        logger.warn("Failed to delete replaced amenity image from S3", { error: String(err) });
      });
    }

    logger.info("Amenity updated successfully", { operation, id: targetId });
    return apiSuccess(
      { amenity: formatSafeAmenity(amenity) },
      "Amenity updated successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * DELETE /api/admin/amenities/[id]
 * Checks if any hostels reference this amenity before deleting
 */
export async function deleteAmenity(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "delete";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Deleting amenity started", { operation, id: targetId });

    await connectToDatabase();
    const amenity = await Amenity.findById(targetId);
    if (!amenity) {
      throw new AppError("Amenity not found.", 404);
    }

    // Check if any hostel references this amenity
    const hasHostels = await Hostel.exists({ amenities: targetId });
    if (hasHostels) {
      throw new AppError(
        "Cannot delete amenity: One or more hostels are associated with this amenity. Remove or reassign them first.",
        409
      );
    }

    const imageKey = amenity.image?.publickey;
    await Amenity.findByIdAndDelete(targetId);

    // Clean up S3 image if unreferenced
    if (imageKey) {
      safeDeleteS3File(imageKey, targetId).catch((err) => {
        logger.warn("Failed to delete amenity image from S3", { error: String(err) });
      });
    }

    logger.info("Amenity deleted successfully", { operation, id: targetId });
    return apiSuccess(
      { message: "Amenity deleted successfully.", id: targetId },
      "Amenity deleted successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}
