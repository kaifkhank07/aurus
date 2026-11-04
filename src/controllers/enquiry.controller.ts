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
import { sendEnquiryToTeleCRM } from "@/services/telecrm.service";

const logger = createLogger("EnquiryController");

function formatSafeEnquiry(doc: IEnquiryDocument): SafeEnquiry {
  return {
    id: doc._id.toString(),
    name: doc.name,
    number: doc.number,
    location: doc.location ?? null,
    iam: doc.iam ?? null,
    message: doc.message ?? null,
    status: doc.status || "new",
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
 * Retrieves a paginated list of enquiries with search, status filter, and sorting
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
    const { page, limit, status, search, location, sortBy, sortOrderDir } = validatedQuery;

    logger.info("Listing enquiries started", {
      operation,
      page,
      limit,
      status,
      search,
      location,
      sortBy,
      sortOrderDir,
    });

    await connectToDatabase();

    const filter: Record<string, unknown> = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (location) {
      filter.location = { $regex: new RegExp(`^${location}$`, "i") };
    }

    if (search) {
      const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [
        { name: searchRegex },
        { number: searchRegex },
        { location: searchRegex },
        { iam: searchRegex },
        { message: searchRegex },
      ];
    }

    const sortOptions: Record<string, 1 | -1> = {};
    const sortField = sortBy || "createdAt";
    sortOptions[sortField] = sortOrderDir === "asc" ? 1 : -1;

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
    name: validated.name.trim(),
    number: validated.number.trim(),
    location: validated.location.trim(),
    iam: validated.iam.trim(),
    message: validated.message.trim(),
    status: validated.status || "new",
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

    // Always enforce status: "new" when created from public site
    const publicPayload = {
      ...(typeof body === "object" && body !== null ? body : {}),
      status: "new",
    };

    const enquiry = await createEnquiryDoc(publicPayload);

    logger.info("Public enquiry submitted successfully", { operation, id: enquiry.id });

    // Forward enquiry lead to TeleCRM asynchronously (failures are logged and do not block success)
    try {
      await sendEnquiryToTeleCRM({
        name: enquiry.name,
        number: enquiry.number,
        location: enquiry.location,
        iam: enquiry.iam,
        message: enquiry.message,
        status: enquiry.status,
        source: "Website Enquiry",
      });
    } catch (crmError) {
      logger.error("Non-fatal error forwarding enquiry to TeleCRM", crmError, {
        operation,
        enquiryId: enquiry.id,
      });
    }

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
    if (validated.message !== undefined) {
      doc.message = validated.message.trim();
    }
    if (validated.status !== undefined) {
      doc.status = validated.status;
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
