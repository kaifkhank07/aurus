import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import { Institute, IInstituteDocument } from "@/models/institute.model";
import { City, ICityDocument } from "@/models/city.model";
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
  createInstituteSchema,
  updateInstituteSchema,
  instituteQuerySchema,
  objectIdSchema,
} from "@/validations/institute.validation";
import { SafeInstitute, PaginatedInstitutesResult } from "@/types/institute.types";
import { createLogger } from "@/lib/logger";
import { getMediaUrl } from "@/lib/media";

const logger = createLogger("InstituteController");

function formatSafeInstitute(doc: IInstituteDocument): SafeInstitute {
  let cityField: SafeInstitute["city"];
  const rawCity = doc.city as unknown;

  if (rawCity && typeof rawCity === "object" && "_id" in rawCity) {
    const populatedCity = rawCity as unknown as ICityDocument;
    cityField = {
      id: populatedCity._id.toString(),
      country: populatedCity.country,
      state: populatedCity.state,
      city: populatedCity.city,
      slug: populatedCity.slug,
      image: populatedCity.image && populatedCity.image.publickey
        ? { url: populatedCity.image.url || getMediaUrl(populatedCity.image.publickey) || "", publickey: populatedCity.image.publickey }
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
    throw new AppError("Invalid Institute ID format.", 400);
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
      logger.warn("Institute slug conflict", { operation, statusCode: 409 });
      return apiError("An institute with this slug already exists.", 409);
    }
    logger.warn("Institute unique constraint conflict", { operation, statusCode: 409 });
    return apiError(
      "An institute with this name already exists in the selected city.",
      409
    );
  }

  logger.error("Unhandled server error", error, { operation, statusCode: 500 });
  return apiError("Internal server error", 500);
}

/**
 * GET /api/admin/institutes
 * Retrieves a paginated list of institutes with filtering, search, and populated city
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

    const queryParams = instituteQuerySchema.parse(rawQuery);

    logger.info("Listing institutes started", {
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

    const [total, instituteDocs] = await Promise.all([
      Institute.countDocuments(filter),
      Institute.find(filter)
        .populate("city")
        .collation({ locale: "en", strength: 2 })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    const result: PaginatedInstitutesResult = {
      items: instituteDocs.map(formatSafeInstitute),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    logger.info("Institutes retrieved successfully", { operation, count: instituteDocs.length, total });
    return apiSuccess(result, "Institutes retrieved successfully.");
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * POST /api/admin/institutes
 * Creates a new Institute with backend-generated slug and city validation
 */
export async function create(request: NextRequest): Promise<NextResponse> {
  const operation = "create";
  try {
    await authenticateAdmin(request);

    const body = await request.json().catch(() => null);
    if (!body) {
      throw new AppError("Request body is required.", 400);
    }

    const validated = createInstituteSchema.parse(body);

    logger.info("Creating institute started", { operation, name: validated.name, city: validated.city });

    await connectToDatabase();

    // Verify referenced City exists
    const cityDoc = await City.findById(validated.city);
    if (!cityDoc) {
      throw new AppError("Referenced city does not exist.", 404);
    }

    const normalizedName = validated.name.trim();

    // Prevent duplicate Institute names within the same City
    const existing = await Institute.findOne({
      city: validated.city,
      name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
    });

    if (existing) {
      throw new AppError(
        "An institute with this name already exists in the selected city.",
        409
      );
    }

    // Backend-managed slug generation
    const slug = await generateUniqueSlug(Institute, normalizedName);

    const newInstitute = new Institute({
      name: normalizedName,
      slug,
      city: new mongoose.Types.ObjectId(validated.city),
      isActive: validated.isActive ?? true,
    });

    await newInstitute.save();
    await newInstitute.populate("city");

    logger.info("Institute created successfully", { operation, id: newInstitute._id.toString(), slug });
    return apiSuccess(
      { institute: formatSafeInstitute(newInstitute) },
      "Institute created successfully.",
      201
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * GET /api/admin/institutes/[id]
 */
export async function getById(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "getById";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Fetching institute by ID started", { operation, id: targetId });

    await connectToDatabase();
    const institute = await Institute.findById(targetId).populate("city");
    if (!institute) {
      throw new AppError("Institute not found.", 404);
    }

    logger.info("Institute retrieved successfully", { operation, id: targetId });
    return apiSuccess(
      { institute: formatSafeInstitute(institute) },
      "Institute retrieved successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * PATCH /api/admin/institutes/[id]
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

    const validated = updateInstituteSchema.parse(body);

    logger.info("Updating institute started", { operation, id: targetId });

    await connectToDatabase();
    const institute = await Institute.findById(targetId);
    if (!institute) {
      throw new AppError("Institute not found.", 404);
    }

    const nextCityId = validated.city || institute.city.toString();

    // If city changed, validate city exists
    if (validated.city !== undefined) {
      const cityDoc = await City.findById(nextCityId);
      if (!cityDoc) {
        throw new AppError("Referenced city does not exist.", 404);
      }
      institute.city = new mongoose.Types.ObjectId(nextCityId);
    }

    const nextName = validated.name !== undefined ? validated.name.trim() : institute.name;

    // Check duplicate name within the same city
    if (validated.name !== undefined || validated.city !== undefined) {
      const existing = await Institute.findOne({
        _id: { $ne: targetId },
        city: nextCityId,
        name: { $regex: new RegExp(`^${nextName}$`, "i") },
      });

      if (existing) {
        throw new AppError(
          "An institute with this name already exists in the selected city.",
          409
        );
      }
    }

    // Regenerate slug if name changed
    if (validated.name !== undefined && validated.name.trim().toLowerCase() !== institute.name.toLowerCase()) {
      institute.slug = await generateUniqueSlug(Institute, nextName, targetId);
      institute.name = nextName;
    }

    if (validated.isActive !== undefined) {
      institute.isActive = validated.isActive;
    }

    await institute.save();
    await institute.populate("city");

    logger.info("Institute updated successfully", { operation, id: targetId, slug: institute.slug });
    return apiSuccess(
      { institute: formatSafeInstitute(institute) },
      "Institute updated successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * DELETE /api/admin/institutes/[id]
 */
export async function deleteInstitute(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "delete";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Deleting institute started", { operation, id: targetId });

    await connectToDatabase();
    const institute = await Institute.findById(targetId);
    if (!institute) {
      throw new AppError("Institute not found.", 404);
    }

    await Institute.findByIdAndDelete(targetId);

    logger.info("Institute deleted successfully", { operation, id: targetId });
    return apiSuccess(
      { message: "Institute deleted successfully.", id: targetId },
      "Institute deleted successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}
