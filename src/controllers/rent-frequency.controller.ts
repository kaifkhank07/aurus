import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import connectToDatabase from "@/lib/mongodb";
import { RentFrequency, IRentFrequencyDocument } from "@/models/rent-frequency.model";
import { authenticateAdmin } from "@/middleware/admin-auth";
import {
  apiSuccess,
  apiError,
  formatZodErrors,
  AppError,
  isNextBailoutError,
} from "@/lib/api-response";
import {
  createRentFrequencySchema,
  updateRentFrequencySchema,
  rentFrequencyQuerySchema,
  objectIdSchema,
} from "@/validations/rent-frequency.validation";
import { SafeRentFrequency, PaginatedRentFrequenciesResult } from "@/types/rent-frequency.types";
import { createLogger } from "@/lib/logger";
import { parseRequestBody } from "@/lib/s3";

const logger = createLogger("RentFrequencyController");

function formatSafeRentFrequency(doc: IRentFrequencyDocument): SafeRentFrequency {
  return {
    id: doc._id.toString(),
    name: doc.name,
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
    throw new AppError("Invalid Rent Frequency ID format.", 400);
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
    logger.warn("Rent Frequency name conflict", { operation, statusCode: 409 });
    return apiError("A rent frequency with this name already exists.", 409);
  }

  logger.error("Unhandled server error", error, { operation, statusCode: 500 });
  return apiError("Internal server error", 500);
}

/**
 * GET /api/admin/rent-frequencies
 * Retrieves a paginated list of rent frequencies with optional search & active status filter
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

    const validatedQuery = rentFrequencyQuerySchema.parse(rawQuery);
    const { page, limit, search, isActive, sortBy, sortOrderDir } = validatedQuery;

    logger.info("Listing rent frequencies started", {
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

    const [total, frequencies] = await Promise.all([
      RentFrequency.countDocuments(filter),
      RentFrequency.find(filter)
        .collation({ locale: "en", strength: 2 })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    const result: PaginatedRentFrequenciesResult = {
      items: frequencies.map(formatSafeRentFrequency),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    logger.info("Rent frequencies retrieved successfully", {
      operation,
      count: frequencies.length,
      total,
    });
    return apiSuccess(result, "Rent frequencies retrieved successfully.");
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * POST /api/admin/rent-frequencies
 * Creates a new Rent Frequency record (no image)
 */
export async function create(request: NextRequest): Promise<NextResponse> {
  const operation = "create";
  try {
    await authenticateAdmin(request);

    const body = await parseRequestBody(request);
    if (!body || Object.keys(body).length === 0) {
      throw new AppError("Request body is required.", 400);
    }

    const validated = createRentFrequencySchema.parse(body);

    logger.info("Creating rent frequency started", { operation, name: validated.name });

    await connectToDatabase();

    const normalizedName = validated.name.trim();

    // Check duplicate name
    const existing = await RentFrequency.findOne({
      name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
    });

    if (existing) {
      throw new AppError("A rent frequency with this name already exists.", 409);
    }

    const newFrequency = new RentFrequency({
      name: normalizedName,
      isActive: validated.isActive ?? true,
    });

    await newFrequency.save();

    logger.info("Rent frequency created successfully", {
      operation,
      id: newFrequency._id.toString(),
    });
    return apiSuccess(
      { rentFrequency: formatSafeRentFrequency(newFrequency) },
      "Rent frequency created successfully.",
      201
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * GET /api/admin/rent-frequencies/[id]
 */
export async function getById(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "getById";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Fetching rent frequency by ID started", { operation, id: targetId });

    await connectToDatabase();
    const frequency = await RentFrequency.findById(targetId);
    if (!frequency) {
      throw new AppError("Rent frequency not found.", 404);
    }

    logger.info("Rent frequency retrieved successfully", { operation, id: targetId });
    return apiSuccess(
      { rentFrequency: formatSafeRentFrequency(frequency) },
      "Rent frequency retrieved successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * PATCH /api/admin/rent-frequencies/[id]
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

    const validated = updateRentFrequencySchema.parse(body);

    logger.info("Updating rent frequency started", { operation, id: targetId });

    await connectToDatabase();
    const frequency = await RentFrequency.findById(targetId);
    if (!frequency) {
      throw new AppError("Rent frequency not found.", 404);
    }

    if (validated.name !== undefined) {
      const normalizedName = validated.name.trim();
      if (normalizedName.toLowerCase() !== frequency.name.toLowerCase()) {
        const existing = await RentFrequency.findOne({
          _id: { $ne: targetId },
          name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
        });

        if (existing) {
          throw new AppError("A rent frequency with this name already exists.", 409);
        }
      }
      frequency.name = normalizedName;
    }

    if (validated.isActive !== undefined) {
      frequency.isActive = validated.isActive;
    }

    await frequency.save();

    logger.info("Rent frequency updated successfully", { operation, id: targetId });
    return apiSuccess(
      { rentFrequency: formatSafeRentFrequency(frequency) },
      "Rent frequency updated successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * DELETE /api/admin/rent-frequencies/[id]
 */
export async function deleteRentFrequency(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "delete";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Deleting rent frequency started", { operation, id: targetId });

    await connectToDatabase();
    const frequency = await RentFrequency.findById(targetId);
    if (!frequency) {
      throw new AppError("Rent frequency not found.", 404);
    }

    await RentFrequency.findByIdAndDelete(targetId);

    logger.info("Rent frequency deleted successfully", { operation, id: targetId });
    return apiSuccess(
      { message: "Rent frequency deleted successfully.", id: targetId },
      "Rent frequency deleted successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

