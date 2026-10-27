import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import connectToDatabase from "@/lib/mongodb";
import { BookedVisit, IBookedVisitDocument } from "@/models/booked-visit.model";
import { authenticateAdmin } from "@/middleware/admin-auth";
import {
  apiSuccess,
  apiError,
  formatZodErrors,
  AppError,
  isNextBailoutError,
} from "@/lib/api-response";
import {
  createBookedVisitSchema,
  updateBookedVisitSchema,
  bookedVisitQuerySchema,
  objectIdSchema,
} from "@/validations/booked-visit.validation";
import {
  SafeBookedVisit,
  PaginatedBookedVisitsResult,
} from "@/types/booked-visit.types";
import { createLogger } from "@/lib/logger";

const logger = createLogger("BookedVisitController");

function formatSafeBookedVisit(doc: IBookedVisitDocument): SafeBookedVisit {
  return {
    id: doc._id.toString(),
    name: doc.name,
    number: doc.number,
    location: doc.location,
    iam: doc.iam,
    preferredDate: doc.preferredDate
      ? doc.preferredDate.toISOString()
      : new Date().toISOString(),
    preferredTime: doc.preferredTime,
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
    throw new AppError("Invalid Booked Visit ID format.", 400);
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

  logger.error("Unhandled server error", error, { operation, statusCode: 500 });
  return apiError("Internal server error", 500);
}

/**
 * GET /api/admin/booked-visits
 * Retrieves a paginated list of booked visits with search and filters
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

    const validatedQuery = bookedVisitQuerySchema.parse(rawQuery);
    const { page, limit, search, location, preferredDate, sortBy, sortOrderDir } = validatedQuery;

    logger.info("Listing booked visits started", {
      operation,
      page,
      limit,
      search,
      location,
      preferredDate,
      sortBy,
      sortOrderDir,
    });

    await connectToDatabase();

    const filter: Record<string, unknown> = {};

    if (location) {
      filter.location = { $regex: new RegExp(`^${location}$`, "i") };
    }

    if (preferredDate) {
      const parsed = new Date(preferredDate);
      if (!isNaN(parsed.getTime())) {
        const start = new Date(parsed);
        start.setUTCHours(0, 0, 0, 0);
        const end = new Date(parsed);
        end.setUTCHours(23, 59, 59, 999);
        filter.preferredDate = { $gte: start, $lte: end };
      }
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [{ name: searchRegex }, { number: searchRegex }];
    }

    const sortOptions: Record<string, 1 | -1> = {};
    const sortField = sortBy || "createdAt";
    sortOptions[sortField] = sortOrderDir === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    const [total, visitDocs] = await Promise.all([
      BookedVisit.countDocuments(filter),
      BookedVisit.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    const result: PaginatedBookedVisitsResult = {
      items: visitDocs.map(formatSafeBookedVisit),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    logger.info("Booked visits retrieved successfully", { operation, count: visitDocs.length, total });
    return apiSuccess(result, "Booked visits retrieved successfully.");
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * Shared helper to create a booked visit document
 */
async function createBookedVisitDoc(body: unknown): Promise<SafeBookedVisit> {
  const validated = createBookedVisitSchema.parse(body);

  await connectToDatabase();

  const newDoc = new BookedVisit({
    name: validated.name.trim(),
    number: validated.number.trim(),
    location: validated.location.trim(),
    iam: validated.iam.trim(),
    preferredDate: new Date(validated.preferredDate),
    preferredTime: validated.preferredTime.trim(),
  });

  await newDoc.save();
  return formatSafeBookedVisit(newDoc);
}

/**
 * POST /api/admin/booked-visits
 * Protected endpoint for administrators to create a booked visit
 */
export async function create(request: NextRequest): Promise<NextResponse> {
  const operation = "create";
  try {
    await authenticateAdmin(request);

    const body = await request.json().catch(() => null);
    if (!body) {
      throw new AppError("Request body is required.", 400);
    }

    logger.info("Admin creating booked visit started", { operation });

    const bookedVisit = await createBookedVisitDoc(body);

    logger.info("Booked visit created successfully by admin", { operation, id: bookedVisit.id });
    return apiSuccess(
      { bookedVisit },
      "Booked visit created successfully.",
      201
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * POST /api/booked-visits
 * Public website endpoint for visitors to submit a booked visit
 */
export async function createPublic(request: NextRequest): Promise<NextResponse> {
  const operation = "createPublic";
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      throw new AppError("Request body is required.", 400);
    }

    logger.info("Public visit booking submission received", { operation });

    const bookedVisit = await createBookedVisitDoc(body);

    logger.info("Public visit booking submitted successfully", { operation, id: bookedVisit.id });
    return apiSuccess(
      { bookedVisit },
      "Your visit has been booked successfully.",
      201
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * GET /api/admin/booked-visits/[id]
 */
export async function getById(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "getById";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Fetching booked visit by ID started", { operation, id: targetId });

    await connectToDatabase();
    const doc = await BookedVisit.findById(targetId);
    if (!doc) {
      throw new AppError("Booked visit not found.", 404);
    }

    logger.info("Booked visit retrieved successfully", { operation, id: targetId });
    return apiSuccess(
      { bookedVisit: formatSafeBookedVisit(doc) },
      "Booked visit retrieved successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * PATCH /api/admin/booked-visits/[id]
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

    const validated = updateBookedVisitSchema.parse(body);

    logger.info("Updating booked visit started", { operation, id: targetId });

    await connectToDatabase();
    const doc = await BookedVisit.findById(targetId);
    if (!doc) {
      throw new AppError("Booked visit not found.", 404);
    }

    if (validated.name !== undefined) {
      doc.name = validated.name.trim();
    }
    if (validated.number !== undefined) {
      doc.number = validated.number.trim();
    }
    if (validated.location !== undefined) {
      doc.location = validated.location.trim();
    }
    if (validated.iam !== undefined) {
      doc.iam = validated.iam.trim();
    }
    if (validated.preferredDate !== undefined) {
      doc.preferredDate = new Date(validated.preferredDate);
    }
    if (validated.preferredTime !== undefined) {
      doc.preferredTime = validated.preferredTime.trim();
    }

    await doc.save();

    logger.info("Booked visit updated successfully", { operation, id: targetId });
    return apiSuccess(
      { bookedVisit: formatSafeBookedVisit(doc) },
      "Booked visit updated successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * DELETE /api/admin/booked-visits/[id]
 */
export async function deleteBookedVisit(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "delete";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Deleting booked visit started", { operation, id: targetId });

    await connectToDatabase();
    const doc = await BookedVisit.findById(targetId);
    if (!doc) {
      throw new AppError("Booked visit not found.", 404);
    }

    await BookedVisit.findByIdAndDelete(targetId);

    logger.info("Booked visit deleted successfully", { operation, id: targetId });
    return apiSuccess(
      { message: "Booked visit deleted successfully.", id: targetId },
      "Booked visit deleted successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}
