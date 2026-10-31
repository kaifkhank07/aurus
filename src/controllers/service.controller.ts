import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import connectToDatabase from "@/lib/mongodb";
import { Service, IServiceDocument } from "@/models/service.model";
import { authenticateAdmin } from "@/middleware/admin-auth";
import {
  apiSuccess,
  apiError,
  formatZodErrors,
  AppError,
  isNextBailoutError,
} from "@/lib/api-response";
import {
  createServiceSchema,
  updateServiceSchema,
  serviceQuerySchema,
  objectIdSchema,
} from "@/validations/service.validation";
import { SafeService, PaginatedServicesResult } from "@/types/service.types";
import { createLogger } from "@/lib/logger";
import { safeDeleteS3File, uploadS3File, parseRequestBody } from "@/lib/s3";
import { getMediaUrl } from "@/lib/media";

const logger = createLogger("ServiceController");

function formatSafeService(doc: IServiceDocument): SafeService {
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
    throw new AppError("Invalid Service ID format.", 400);
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
    logger.warn("Service name conflict", { operation, statusCode: 409 });
    return apiError("A service with this name already exists.", 409);
  }

  logger.error("Unhandled server error", error, { operation, statusCode: 500 });
  return apiError("Internal server error", 500);
}

/**
 * GET /api/admin/services
 * Retrieves a paginated list of services with optional search & active status filter
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

    const validatedQuery = serviceQuerySchema.parse(rawQuery);
    const { page, limit, search, isActive, sortBy, sortOrderDir } = validatedQuery;

    logger.info("Listing services started", {
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

    const [total, services] = await Promise.all([
      Service.countDocuments(filter),
      Service.find(filter)
        .collation({ locale: "en", strength: 2 })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    const result: PaginatedServicesResult = {
      items: services.map(formatSafeService),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    logger.info("Services retrieved successfully", { operation, count: services.length, total });
    return apiSuccess(result, "Services retrieved successfully.");
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * POST /api/admin/services
 * Creates a new Service record
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
      body.image = await uploadS3File(body.image, "services");
    }

    const validated = createServiceSchema.parse(body);

    logger.info("Creating service started", { operation, name: validated.name });

    await connectToDatabase();

    const normalizedName = validated.name.trim();

    // Check duplicate name
    const existing = await Service.findOne({
      name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
    });

    if (existing) {
      throw new AppError("A service with this name already exists.", 409);
    }

    const newService = new Service({
      name: normalizedName,
      image: validated.image,
      isActive: validated.isActive ?? true,
    });

    await newService.save();

    logger.info("Service created successfully", { operation, id: newService._id.toString() });
    return apiSuccess(
      { service: formatSafeService(newService) },
      "Service created successfully.",
      201
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * GET /api/admin/services/[id]
 */
export async function getById(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "getById";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Fetching service by ID started", { operation, id: targetId });

    await connectToDatabase();
    const service = await Service.findById(targetId);
    if (!service) {
      throw new AppError("Service not found.", 404);
    }

    logger.info("Service retrieved successfully", { operation, id: targetId });
    return apiSuccess(
      { service: formatSafeService(service) },
      "Service retrieved successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * PATCH /api/admin/services/[id]
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
      body.image = await uploadS3File(body.image, "services");
    }

    const validated = updateServiceSchema.parse(body);

    logger.info("Updating service started", { operation, id: targetId });

    await connectToDatabase();
    const service = await Service.findById(targetId);
    if (!service) {
      throw new AppError("Service not found.", 404);
    }

    if (validated.name !== undefined) {
      const normalizedName = validated.name.trim();
      if (normalizedName.toLowerCase() !== service.name.toLowerCase()) {
        const existing = await Service.findOne({
          _id: { $ne: targetId },
          name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
        });

        if (existing) {
          throw new AppError("A service with this name already exists.", 409);
        }
      }
      service.name = normalizedName;
    }

    const oldImageKey = service.image?.publickey;

    if (validated.image === null) {
      service.image = undefined;
    } else if (validated.image !== undefined) {
      service.image = validated.image;
    }

    if (validated.isActive !== undefined) {
      service.isActive = validated.isActive;
    }

    await service.save();

    // Clean up replaced S3 image
    if (validated.image !== undefined && oldImageKey && oldImageKey !== validated.image?.publickey) {
      safeDeleteS3File(oldImageKey, targetId).catch((err) => {
        logger.warn("Failed to delete replaced service image from S3", { error: String(err) });
      });
    }

    logger.info("Service updated successfully", { operation, id: targetId });
    return apiSuccess(
      { service: formatSafeService(service) },
      "Service updated successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * DELETE /api/admin/services/[id]
 */
export async function deleteService(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "delete";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Deleting service started", { operation, id: targetId });

    await connectToDatabase();
    const service = await Service.findById(targetId);
    if (!service) {
      throw new AppError("Service not found.", 404);
    }

    const imageKey = service.image?.publickey;
    await Service.findByIdAndDelete(targetId);

    // Clean up S3 image if present
    if (imageKey) {
      safeDeleteS3File(imageKey, targetId).catch((err) => {
        logger.warn("Failed to delete service image from S3", { error: String(err) });
      });
    }

    logger.info("Service deleted successfully", { operation, id: targetId });
    return apiSuccess(
      { message: "Service deleted successfully.", id: targetId },
      "Service deleted successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

