import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import connectToDatabase from "@/lib/mongodb";
import { Occupancy, IOccupancyDocument } from "@/models/occupancy.model";
import { authenticateAdmin } from "@/middleware/admin-auth";
import {
  apiSuccess,
  apiError,
  formatZodErrors,
  AppError,
  isNextBailoutError,
} from "@/lib/api-response";
import {
  createOccupancySchema,
  updateOccupancySchema,
  occupancyQuerySchema,
  objectIdSchema,
} from "@/validations/occupancy.validation";
import { SafeOccupancy, PaginatedOccupanciesResult } from "@/types/occupancy.types";
import { createLogger } from "@/lib/logger";
import { safeDeleteS3File, uploadS3File, parseRequestBody } from "@/lib/s3";
import { getMediaUrl } from "@/lib/media";

const logger = createLogger("OccupancyController");

function formatSafeOccupancy(doc: IOccupancyDocument): SafeOccupancy {
  return {
    id: doc._id.toString(),
    name: doc.name,
    image: doc.image && doc.image.publickey
      ? {
          url: doc.image.url || getMediaUrl(doc.image.publickey) || "",
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
    throw new AppError("Invalid Occupancy ID format.", 400);
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
    logger.warn("Occupancy name conflict", { operation, statusCode: 409 });
    return apiError("An occupancy with this name already exists.", 409);
  }

  logger.error("Unhandled server error", error, { operation, statusCode: 500 });
  return apiError("Internal server error", 500);
}

/**
 * GET /api/admin/occupancies
 * Retrieves a paginated list of occupancies with optional search & active status filter
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

    const validatedQuery = occupancyQuerySchema.parse(rawQuery);
    const { page, limit, search, isActive, sortBy, sortOrderDir } = validatedQuery;

    logger.info("Listing occupancies started", {
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

    const [total, occupancies] = await Promise.all([
      Occupancy.countDocuments(filter),
      Occupancy.find(filter)
        .collation({ locale: "en", strength: 2 })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    const result: PaginatedOccupanciesResult = {
      items: occupancies.map(formatSafeOccupancy),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    logger.info("Occupancies retrieved successfully", { operation, count: occupancies.length, total });
    return apiSuccess(result, "Occupancies retrieved successfully.");
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * POST /api/admin/occupancies
 * Creates a new Occupancy record
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
      body.image = await uploadS3File(body.image, "occupancies");
    }

    const validated = createOccupancySchema.parse(body);

    logger.info("Creating occupancy started", { operation, name: validated.name });

    await connectToDatabase();

    const normalizedName = validated.name.trim();

    // Check duplicate name
    const existing = await Occupancy.findOne({
      name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
    });

    if (existing) {
      throw new AppError("An occupancy with this name already exists.", 409);
    }

    const newOccupancy = new Occupancy({
      name: normalizedName,
      image: validated.image,
      isActive: validated.isActive ?? true,
    });

    await newOccupancy.save();

    logger.info("Occupancy created successfully", { operation, id: newOccupancy._id.toString() });
    return apiSuccess(
      { occupancy: formatSafeOccupancy(newOccupancy) },
      "Occupancy created successfully.",
      201
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * GET /api/admin/occupancies/[id]
 */
export async function getById(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "getById";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Fetching occupancy by ID started", { operation, id: targetId });

    await connectToDatabase();
    const occupancy = await Occupancy.findById(targetId);
    if (!occupancy) {
      throw new AppError("Occupancy not found.", 404);
    }

    logger.info("Occupancy retrieved successfully", { operation, id: targetId });
    return apiSuccess(
      { occupancy: formatSafeOccupancy(occupancy) },
      "Occupancy retrieved successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * PATCH /api/admin/occupancies/[id]
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
      body.image = await uploadS3File(body.image, "occupancies");
    }

    const validated = updateOccupancySchema.parse(body);

    logger.info("Updating occupancy started", { operation, id: targetId });

    await connectToDatabase();
    const occupancy = await Occupancy.findById(targetId);
    if (!occupancy) {
      throw new AppError("Occupancy not found.", 404);
    }

    if (validated.name !== undefined) {
      const normalizedName = validated.name.trim();
      if (normalizedName.toLowerCase() !== occupancy.name.toLowerCase()) {
        const existing = await Occupancy.findOne({
          _id: { $ne: targetId },
          name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
        });

        if (existing) {
          throw new AppError("An occupancy with this name already exists.", 409);
        }
      }
      occupancy.name = normalizedName;
    }

    const oldImageKey = occupancy.image?.publickey;

    if (validated.image === null) {
      occupancy.image = undefined;
    } else if (validated.image !== undefined) {
      occupancy.image = validated.image;
    }

    if (validated.isActive !== undefined) {
      occupancy.isActive = validated.isActive;
    }

    await occupancy.save();

    // Clean up replaced S3 image
    if (validated.image !== undefined && oldImageKey && oldImageKey !== validated.image?.publickey) {
      safeDeleteS3File(oldImageKey, targetId).catch((err) => {
        logger.warn("Failed to delete replaced occupancy image from S3", { error: String(err) });
      });
    }

    logger.info("Occupancy updated successfully", { operation, id: targetId });
    return apiSuccess(
      { occupancy: formatSafeOccupancy(occupancy) },
      "Occupancy updated successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * DELETE /api/admin/occupancies/[id]
 */
export async function deleteOccupancy(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "delete";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Deleting occupancy started", { operation, id: targetId });

    await connectToDatabase();
    const occupancy = await Occupancy.findById(targetId);
    if (!occupancy) {
      throw new AppError("Occupancy not found.", 404);
    }

    const imageKey = occupancy.image?.publickey;
    await Occupancy.findByIdAndDelete(targetId);

    // Clean up S3 image if unreferenced
    if (imageKey) {
      safeDeleteS3File(imageKey, targetId).catch((err) => {
        logger.warn("Failed to delete occupancy image from S3", { error: String(err) });
      });
    }

    logger.info("Occupancy deleted successfully", { operation, id: targetId });
    return apiSuccess(
      { message: "Occupancy deleted successfully.", id: targetId },
      "Occupancy deleted successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}
