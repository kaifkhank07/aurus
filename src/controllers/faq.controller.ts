import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import { Faq, IFaqDocument } from "@/models/faq.model";
import { authenticateAdmin } from "@/middleware/admin-auth";
import {
  apiSuccess,
  apiError,
  formatZodErrors,
  AppError,
  isNextBailoutError,
} from "@/lib/api-response";
import {
  createFaqSchema,
  createCategoryFaqsSchema,
  updateFaqSchema,
  bulkUpdateFaqsSchema,
  bulkDeleteFaqsSchema,
  faqQuerySchema,
  faqCategorySchema,
  objectIdSchema,
} from "@/validations/faq.validation";
import {
  SafeFaq,
  PaginatedFaqsResult,
  GroupedFaqCategory,
  FAQ_CATEGORIES,
  FAQ_CATEGORY_LABELS,
} from "@/types/faq.types";
import { createLogger } from "@/lib/logger";

const logger = createLogger("FaqController");

/**
 * Transforms an IFaqDocument into a clean SafeFaq object.
 */
function formatSafeFaq(doc: IFaqDocument): SafeFaq {
  return {
    id: doc._id.toString(),
    question: doc.question,
    answer: doc.answer,
    category: doc.category,
    sortOrder: doc.sortOrder ?? 0,
    isActive: doc.isActive ?? true,
    createdAt: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : new Date().toISOString(),
  };
}

/**
 * Validates and extracts a 24-character hexadecimal ObjectId parameter.
 */
async function resolveIdParam(
  paramsPromise: Promise<{ id: string }> | { id: string }
): Promise<string> {
  const resolved = await paramsPromise;
  const validated = objectIdSchema.safeParse(resolved.id);
  if (!validated.success) {
    throw new AppError("Invalid FAQ ID format.", 400);
  }
  return validated.data;
}

/**
 * Helper to parse JSON or form body.
 */
async function parseJsonBody(request: NextRequest): Promise<unknown> {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return request.json().catch(() => null);
  }
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const dataEntry = formData.get("data") || formData.get("payload");
    if (dataEntry && typeof dataEntry === "string") {
      try {
        return JSON.parse(dataEntry);
      } catch {
        // Continue
      }
    }
    const body: Record<string, unknown> = {};
    formData.forEach((val, key) => {
      body[key] = val;
    });
    return body;
  }
  return request.json().catch(() => null);
}

/**
 * Centralized error handler adhering to Aurus API standards.
 */
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
 * GET /api/admin/faqs
 * Retrieves a paginated list of FAQs with search, category filtering, isActive filtering, and sorting.
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

    const validatedQuery = faqQuerySchema.parse(rawQuery);
    const { page, limit, search, category, isActive, sortBy, sortOrderDir } = validatedQuery;

    logger.info("Listing FAQs started", {
      operation,
      page,
      limit,
      search,
      category,
      isActive,
      sortBy,
      sortOrderDir,
    });

    await connectToDatabase();

    const filter: Record<string, unknown> = {};

    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      const sanitized = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(sanitized, "i");
      filter.$or = [
        { question: { $regex: searchRegex } },
        { answer: { $regex: searchRegex } },
      ];
    }

    const sortOptions: Record<string, 1 | -1> = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrderDir === "desc" ? -1 : 1;
    } else {
      // Default sort: order ascending, then newest first
      sortOptions.sortOrder = 1;
      sortOptions.createdAt = -1;
    }

    const skip = (page - 1) * limit;

    const [total, faqs] = await Promise.all([
      Faq.countDocuments(filter),
      Faq.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    const result: PaginatedFaqsResult = {
      items: faqs.map(formatSafeFaq),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    logger.info("Listing FAQs completed", { operation, count: faqs.length, total });
    return apiSuccess(result, "FAQs retrieved successfully.");
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * GET /api/admin/faqs/[id]
 * Retrieves a single FAQ by its ID.
 */
export async function getById(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "getById";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Fetching FAQ by ID started", { operation, id: targetId });

    await connectToDatabase();
    const faq = await Faq.findById(targetId);
    if (!faq) {
      throw new AppError("FAQ not found.", 404);
    }

    logger.info("FAQ retrieved successfully", { operation, id: targetId });
    return apiSuccess({ faq: formatSafeFaq(faq) }, "FAQ retrieved successfully.");
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * POST /api/admin/faqs
 * Handles creation of FAQs:
 * 1. Multiple FAQs for the same category at the same time:
 *    { category: "booking", faqs: [{ question: "...", answer: "..." }, ...] }
 * 2. Array of FAQs:
 *    [{ category: "...", question: "...", answer: "..." }, ...]
 * 3. Single FAQ:
 *    { category: "...", question: "...", answer: "..." }
 */
export async function create(request: NextRequest): Promise<NextResponse> {
  const operation = "create";
  try {
    await authenticateAdmin(request);

    const body = await parseJsonBody(request);
    if (!body || (typeof body === "object" && Object.keys(body).length === 0)) {
      throw new AppError("Request body is required.", 400);
    }

    await connectToDatabase();

    // Mode 1: Creating multiple FAQs for the same category at the same time
    if (
      typeof body === "object" &&
      body !== null &&
      "category" in body &&
      "faqs" in body &&
      Array.isArray((body as { faqs: unknown }).faqs)
    ) {
      const validated = createCategoryFaqsSchema.parse(body);
      logger.info("Creating multiple FAQs for same category", {
        operation,
        category: validated.category,
        count: validated.faqs.length,
      });

      const docsToInsert = validated.faqs.map((item, index) => ({
        question: item.question,
        answer: item.answer,
        category: validated.category,
        sortOrder: item.sortOrder ?? index,
        isActive: item.isActive ?? true,
      }));

      const createdFaqs = await Faq.insertMany(docsToInsert);

      logger.info("Multiple FAQs created successfully", {
        operation,
        category: validated.category,
        count: createdFaqs.length,
      });

      return apiSuccess(
        {
          faqs: createdFaqs.map(formatSafeFaq),
          count: createdFaqs.length,
          category: validated.category,
        },
        `Successfully created ${createdFaqs.length} FAQs for category "${validated.category}".`,
        201
      );
    }

    // Mode 2: Array of FAQs
    if (Array.isArray(body)) {
      if (body.length === 0) {
        throw new AppError("FAQ array cannot be empty.", 400);
      }

      const validatedList = body.map((item, index) => {
        try {
          return createFaqSchema.parse(item);
        } catch (err) {
          if (err instanceof ZodError) {
            throw new AppError(
              `Item at index ${index} failed validation: ${err.issues.map((i) => i.message).join(", ")}`,
              400,
              err.issues
            );
          }
          throw err;
        }
      });

      logger.info("Batch creating FAQs started", { operation, count: validatedList.length });

      const docsToInsert = validatedList.map((item, index) => ({
        question: item.question,
        answer: item.answer,
        category: item.category,
        sortOrder: item.sortOrder ?? index,
        isActive: item.isActive ?? true,
      }));

      const createdFaqs = await Faq.insertMany(docsToInsert);

      logger.info("Batch FAQs created successfully", {
        operation,
        count: createdFaqs.length,
      });

      return apiSuccess(
        {
          faqs: createdFaqs.map(formatSafeFaq),
          count: createdFaqs.length,
        },
        `Successfully created ${createdFaqs.length} FAQs.`,
        201
      );
    }

    // Mode 3: Single FAQ creation
    const validated = createFaqSchema.parse(body);
    logger.info("Creating single FAQ started", {
      operation,
      category: validated.category,
      question: validated.question,
    });

    const newFaq = new Faq({
      question: validated.question,
      answer: validated.answer,
      category: validated.category,
      sortOrder: validated.sortOrder ?? 0,
      isActive: validated.isActive ?? true,
    });

    await newFaq.save();

    logger.info("Single FAQ created successfully", {
      operation,
      id: newFaq._id.toString(),
    });

    return apiSuccess(
      { faq: formatSafeFaq(newFaq) },
      "FAQ created successfully.",
      201
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * PATCH / PUT /api/admin/faqs/[id]
 * Updates a single FAQ by ID.
 */
export async function update(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "update";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    const body = await parseJsonBody(request);
    if (!body || (typeof body === "object" && Object.keys(body).length === 0)) {
      throw new AppError("Request body is required.", 400);
    }

    const validated = updateFaqSchema.parse(body);
    logger.info("Updating FAQ started", { operation, id: targetId });

    await connectToDatabase();
    const faq = await Faq.findById(targetId);
    if (!faq) {
      throw new AppError("FAQ not found.", 404);
    }

    if (validated.question !== undefined) faq.question = validated.question;
    if (validated.answer !== undefined) faq.answer = validated.answer;
    if (validated.category !== undefined) faq.category = validated.category;
    if (validated.sortOrder !== undefined) faq.sortOrder = validated.sortOrder;
    if (validated.isActive !== undefined) faq.isActive = validated.isActive;

    await faq.save();

    logger.info("FAQ updated successfully", { operation, id: targetId });
    return apiSuccess({ faq: formatSafeFaq(faq) }, "FAQ updated successfully.");
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * PATCH / PUT /api/admin/faqs/bulk
 * Multiple update logic: updates multiple FAQs simultaneously.
 * Accepts:
 * {
 *   faqs: [
 *     { id: "...", question?: "...", answer?: "...", category?: "...", sortOrder?: 1, isActive?: true },
 *     ...
 *   ]
 * }
 * or direct array of update objects.
 */
export async function bulkUpdate(request: NextRequest): Promise<NextResponse> {
  const operation = "bulkUpdate";
  try {
    await authenticateAdmin(request);

    const body = await parseJsonBody(request);
    if (!body || (typeof body === "object" && Object.keys(body).length === 0)) {
      throw new AppError("Request body with FAQs to update is required.", 400);
    }

    const validatedItems = bulkUpdateFaqsSchema.parse(body);
    logger.info("Bulk updating FAQs started", { operation, count: validatedItems.length });

    await connectToDatabase();

    const bulkOps = validatedItems.map((item) => {
      const updateData: Record<string, unknown> = {};
      if (item.question !== undefined) updateData.question = item.question;
      if (item.answer !== undefined) updateData.answer = item.answer;
      if (item.category !== undefined) updateData.category = item.category;
      if (item.sortOrder !== undefined) updateData.sortOrder = item.sortOrder;
      if (item.isActive !== undefined) updateData.isActive = item.isActive;

      return {
        updateOne: {
          filter: { _id: new mongoose.Types.ObjectId(item.id) },
          update: { $set: updateData },
        },
      };
    });

    const bulkResult = await Faq.bulkWrite(bulkOps);

    // Fetch the updated documents to return current state
    const ids = validatedItems.map((i) => new mongoose.Types.ObjectId(i.id));
    const updatedDocs = await Faq.find({ _id: { $in: ids } }).sort({ sortOrder: 1, createdAt: -1 });

    logger.info("Bulk FAQs updated successfully", {
      operation,
      matchedCount: bulkResult.matchedCount,
      modifiedCount: bulkResult.modifiedCount,
    });

    return apiSuccess(
      {
        faqs: updatedDocs.map(formatSafeFaq),
        matchedCount: bulkResult.matchedCount,
        modifiedCount: bulkResult.modifiedCount,
      },
      `Successfully updated ${bulkResult.modifiedCount} FAQ(s).`
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * DELETE /api/admin/faqs/[id]
 * Deletes a single FAQ by ID.
 */
export async function deleteFaq(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "deleteFaq";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Deleting FAQ started", { operation, id: targetId });

    await connectToDatabase();
    const deleted = await Faq.findByIdAndDelete(targetId);
    if (!deleted) {
      throw new AppError("FAQ not found.", 404);
    }

    logger.info("FAQ deleted successfully", { operation, id: targetId });
    return apiSuccess({ id: targetId }, "FAQ deleted successfully.");
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * DELETE /api/admin/faqs/bulk
 * Multiple delete logic: deletes multiple FAQs by IDs.
 * Accepts: { ids: ["...", "..."] } or ["...", "..."]
 */
export async function bulkDelete(request: NextRequest): Promise<NextResponse> {
  const operation = "bulkDelete";
  try {
    await authenticateAdmin(request);

    const body = await parseJsonBody(request);
    if (!body || (typeof body === "object" && Object.keys(body).length === 0)) {
      throw new AppError("Request body with IDs is required.", 400);
    }

    const validatedIds = bulkDeleteFaqsSchema.parse(body);
    logger.info("Bulk deleting FAQs started", { operation, count: validatedIds.length });

    await connectToDatabase();
    const objectIds = validatedIds.map((id) => new mongoose.Types.ObjectId(id));
    const deleteResult = await Faq.deleteMany({ _id: { $in: objectIds } });

    logger.info("Bulk FAQs deleted successfully", {
      operation,
      deletedCount: deleteResult.deletedCount,
    });

    return apiSuccess(
      {
        deletedCount: deleteResult.deletedCount,
        ids: validatedIds,
      },
      `Successfully deleted ${deleteResult.deletedCount} FAQ(s).`
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * GET /api/faqs
 * Public API to retrieve active FAQs.
 * Supports:
 * - ?category=booking (filters by category)
 * - ?grouped=true (returns FAQs grouped by the canonical categories with readable labels)
 */
export async function listPublic(request: NextRequest): Promise<NextResponse> {
  const operation = "listPublic";
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get("category");
    const groupedParam = searchParams.get("grouped") === "true";

    await connectToDatabase();

    const filter: Record<string, unknown> = { isActive: true };

    if (categoryParam) {
      const parsedCategory = faqCategorySchema.safeParse(categoryParam);
      if (parsedCategory.success) {
        filter.category = parsedCategory.data;
      }
    }

    const faqs = await Faq.find(filter)
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();

    const safeItems = faqs.map(formatSafeFaq);

    if (groupedParam) {
      const grouped: GroupedFaqCategory[] = FAQ_CATEGORIES.map((cat) => ({
        category: cat,
        categoryLabel: FAQ_CATEGORY_LABELS[cat] || cat,
        items: safeItems.filter((f) => f.category === cat),
      })).filter((group) => group.items.length > 0 || !categoryParam);

      return apiSuccess({ categories: grouped, total: safeItems.length }, "FAQs retrieved successfully.");
    }

    return apiSuccess({ faqs: safeItems, total: safeItems.length }, "FAQs retrieved successfully.");
  } catch (error) {
    return handleError(error, operation);
  }
}
