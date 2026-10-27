import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import connectToDatabase from "@/lib/mongodb";
import { Enquiry, IEnquiryDocument } from "@/models/enquiry.model";
import { authenticateAdmin } from "@/middleware/admin-auth";
import {
  apiSuccess,
  apiError,
  formatZodErrors,
  AppError,
  isNextBailoutError,
} from "@/lib/api-response";
import {
  createEnquirySchema,
  updateEnquirySchema,
  enquiryQuerySchema,
  objectIdSchema,
} from "@/validations/enquiry.validation";
import {
  SafeEnquiry,
  PaginatedEnquiriesResult,
} from "@/types/enquiry.types";
import { createLogger } from "@/lib/logger";

const logger = createLogger("EnquiryController");

function formatSafeEnquiry(doc: IEnquiryDocument): SafeEnquiry {
  return {
    id: doc._id.toString(),
    type: doc.type,
    name: doc.name,
    number: doc.number,
    location: doc.location ?? null,
    iam: doc.iam ?? null,
    message: doc.message ?? null,
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
    throw new AppError("Invalid Enquiry ID format.", 400);
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
 * GET /api/admin/enquiries
 * Retrieves a paginated list of enquiries with search, type filter, and sorting
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

    const validatedQuery = enquiryQuerySchema.parse(rawQuery);
    const { page, limit, type, search, sortOrderDir } = validatedQuery;

    logger.info("Listing enquiries started", {
      operation,
      page,
      limit,
      type,
      search,
      sortOrderDir,
    });

    await connectToDatabase();

    const filter: Record<string, unknown> = {};

    if (type) {
      filter.type = type;
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { name: searchRegex },
        { number: searchRegex },
        { location: searchRegex },
        { message: searchRegex },
      ];
    }

    const sortOptions: Record<string, 1 | -1> = {
      createdAt: sortOrderDir === "asc" ? 1 : -1,
    };

    const skip = (page - 1) * limit;

    const [total, enquiryDocs] = await Promise.all([
      Enquiry.countDocuments(filter),
      Enquiry.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    const result: PaginatedEnquiriesResult = {
      items: enquiryDocs.map(formatSafeEnquiry),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    logger.info("Enquiries retrieved successfully", { operation, count: enquiryDocs.length, total });
    return apiSuccess(result, "Enquiries retrieved successfully.");
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * Shared helper to create an enquiry document
 */
async function createEnquiryDoc(body: unknown): Promise<SafeEnquiry> {
  const validated = createEnquirySchema.parse(body);

  await connectToDatabase();

  const newDoc = new Enquiry({
    type: validated.type,
    name: validated.name.trim(),
    number: validated.number.trim(),
    location: validated.location ? validated.location.trim() : null,
    iam: validated.iam ? validated.iam.trim() : null,
    message: validated.message ? validated.message.trim() : null,
  });

  await newDoc.save();
  return formatSafeEnquiry(newDoc);
}

/**
 * POST /api/admin/enquiries
 * Protected endpoint for administrators to create an enquiry
 */
export async function create(request: NextRequest): Promise<NextResponse> {
  const operation = "create";
  try {
    await authenticateAdmin(request);

    const body = await request.json().catch(() => null);
    if (!body) {
      throw new AppError("Request body is required.", 400);
    }

    logger.info("Admin creating enquiry started", { operation });

    const enquiry = await createEnquiryDoc(body);

    logger.info("Enquiry created successfully by admin", { operation, id: enquiry.id });
    return apiSuccess(
      { enquiry },
      "Enquiry created successfully.",
      201
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * POST /api/enquiries
 * Public website endpoint for visitors to submit enquiries or requests
 */
export async function createPublic(request: NextRequest): Promise<NextResponse> {
  const operation = "createPublic";
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      throw new AppError("Request body is required.", 400);
    }

    logger.info("Public enquiry submission received", { operation });

    const enquiry = await createEnquiryDoc(body);

    logger.info("Public enquiry submitted successfully", { operation, id: enquiry.id });
    return apiSuccess(
      { enquiry },
      "Your enquiry has been submitted successfully.",
      201
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * GET /api/admin/enquiries/[id]
 */
export async function getById(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "getById";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Fetching enquiry by ID started", { operation, id: targetId });

    await connectToDatabase();
    const doc = await Enquiry.findById(targetId);
    if (!doc) {
      throw new AppError("Enquiry not found.", 404);
    }

    logger.info("Enquiry retrieved successfully", { operation, id: targetId });
    return apiSuccess(
      { enquiry: formatSafeEnquiry(doc) },
      "Enquiry retrieved successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * PATCH /api/admin/enquiries/[id]
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

    const validated = updateEnquirySchema.parse(body);

    logger.info("Updating enquiry started", { operation, id: targetId });

    await connectToDatabase();
    const doc = await Enquiry.findById(targetId);
    if (!doc) {
      throw new AppError("Enquiry not found.", 404);
    }

    // Crucial: Validate final merged state for conditional rules
    const finalType = validated.type !== undefined ? validated.type : doc.type;
    const finalLocation =
      validated.location !== undefined ? validated.location : doc.location;
    const finalIam = validated.iam !== undefined ? validated.iam : doc.iam;
    const finalMessage =
      validated.message !== undefined ? validated.message : doc.message;

    if (finalType === "query") {
      const errors: { field: string; message: string }[] = [];
      if (!finalLocation || finalLocation.trim().length === 0) {
        errors.push({ field: "location", message: "Location is required for query enquiries." });
      }
      if (!finalIam || finalIam.trim().length === 0) {
        errors.push({ field: "iam", message: "I am selection is required for query enquiries." });
      }
      if (!finalMessage || finalMessage.trim().length === 0) {
        errors.push({ field: "message", message: "Message is required for query enquiries." });
      }

      if (errors.length > 0) {
        throw new AppError("Validation failed for query enquiry.", 400, errors);
      }
    }

    if (validated.type !== undefined) {
      doc.type = validated.type;
    }
    if (validated.name !== undefined) {
      doc.name = validated.name.trim();
    }
    if (validated.number !== undefined) {
      doc.number = validated.number.trim();
    }
    if (validated.location !== undefined) {
      doc.location = validated.location ? validated.location.trim() : null;
    }
    if (validated.iam !== undefined) {
      doc.iam = validated.iam ? validated.iam.trim() : null;
    }
    if (validated.message !== undefined) {
      doc.message = validated.message ? validated.message.trim() : null;
    }

    await doc.save();

    logger.info("Enquiry updated successfully", { operation, id: targetId });
    return apiSuccess(
      { enquiry: formatSafeEnquiry(doc) },
      "Enquiry updated successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * DELETE /api/admin/enquiries/[id]
 */
export async function deleteEnquiry(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "delete";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Deleting enquiry started", { operation, id: targetId });

    await connectToDatabase();
    const doc = await Enquiry.findById(targetId);
    if (!doc) {
      throw new AppError("Enquiry not found.", 404);
    }

    await Enquiry.findByIdAndDelete(targetId);

    logger.info("Enquiry deleted successfully", { operation, id: targetId });
    return apiSuccess(
      { message: "Enquiry deleted successfully.", id: targetId },
      "Enquiry deleted successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}
