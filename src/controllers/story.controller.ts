import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import connectToDatabase from "@/lib/mongodb";
import { Story, IStoryDocument } from "@/models/story.model";
import { authenticateAdmin } from "@/middleware/admin-auth";
import {
  apiSuccess,
  apiError,
  formatZodErrors,
  AppError,
  isNextBailoutError,
} from "@/lib/api-response";
import {
  createStorySchema,
  updateStorySchema,
  storyQuerySchema,
  objectIdSchema,
} from "@/validations/story.validation";
import { SafeStory, PaginatedStoriesResult } from "@/types/story.types";
import { createLogger } from "@/lib/logger";
import { safeDeleteS3File, uploadS3File, parseRequestBody } from "@/lib/s3";
import { getMediaUrl } from "@/lib/media";

const logger = createLogger("StoryController");

function formatSafeStory(doc: IStoryDocument): SafeStory {
  return {
    id: doc._id.toString(),
    name: doc.name,
    profession: doc.profession,
    rating: doc.rating,
    location: doc.location,
    description: doc.description,
    isActive: doc.isActive ?? true,
    isFeatured: doc.isFeatured ?? false,
    image: doc.image && doc.image.publickey
      ? {
          url: doc.image.url || getMediaUrl(doc.image.publickey) || "",
          publickey: doc.image.publickey,
        }
      : null,
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
    throw new AppError("Invalid Story ID format.", 400);
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
 * GET /api/admin/stories
 * Retrieves a paginated list of stories with search and filters
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

    const validatedQuery = storyQuerySchema.parse(rawQuery);
    const { page, limit, search, isActive, isFeatured, sortBy, sortOrderDir } = validatedQuery;

    logger.info("Listing stories started", {
      operation,
      page,
      limit,
      search,
      isActive,
      isFeatured,
      sortBy,
      sortOrderDir,
    });

    await connectToDatabase();

    const filter: Record<string, unknown> = {};

    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured;
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { name: searchRegex },
        { profession: searchRegex },
        { location: searchRegex },
        { description: searchRegex },
      ];
    }

    const sortOptions: Record<string, 1 | -1> = {};
    const sortField = sortBy || "createdAt";
    sortOptions[sortField] = sortOrderDir === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    const [total, storyDocs] = await Promise.all([
      Story.countDocuments(filter),
      Story.find(filter)
        .collation({ locale: "en", strength: 2 })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    const result: PaginatedStoriesResult = {
      items: storyDocs.map(formatSafeStory),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    logger.info("Stories retrieved successfully", { operation, count: storyDocs.length, total });
    return apiSuccess(result, "Stories retrieved successfully.");
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * POST /api/admin/stories
 * Creates a new Story
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
      body.image = await uploadS3File(body.image, "stories");
    }

    const validated = createStorySchema.parse(body);

    logger.info("Creating story started", { operation, name: validated.name, isFeatured: validated.isFeatured });

    await connectToDatabase();

    const newStory = new Story({
      name: validated.name.trim(),
      profession: validated.profession.trim(),
      rating: validated.rating,
      location: validated.location.trim(),
      description: validated.description.trim(),
      isActive: validated.isActive ?? true,
      isFeatured: validated.isFeatured ?? false,
      image: validated.image ?? null,
    });

    await newStory.save();

    logger.info("Story created successfully", { operation, id: newStory._id.toString() });
    return apiSuccess(
      { story: formatSafeStory(newStory) },
      "Story created successfully.",
      201
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * GET /api/admin/stories/[id]
 */
export async function getById(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "getById";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Fetching story by ID started", { operation, id: targetId });

    await connectToDatabase();
    const story = await Story.findById(targetId);
    if (!story) {
      throw new AppError("Story not found.", 404);
    }

    logger.info("Story retrieved successfully", { operation, id: targetId });
    return apiSuccess(
      { story: formatSafeStory(story) },
      "Story retrieved successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * PATCH /api/admin/stories/[id]
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
      body.image = await uploadS3File(body.image, "stories");
    }

    const validated = updateStorySchema.parse(body);

    logger.info("Updating story started", { operation, id: targetId });

    await connectToDatabase();
    const story = await Story.findById(targetId);
    if (!story) {
      throw new AppError("Story not found.", 404);
    }

    // Crucial: Validate final merged document state for featured story image requirement
    const finalIsFeatured =
      validated.isFeatured !== undefined ? validated.isFeatured : story.isFeatured;
    const finalImage =
      validated.image !== undefined ? validated.image : story.image;

    if (finalIsFeatured && (!finalImage || !finalImage.publickey)) {
      throw new AppError("An image is required for featured stories.", 400, [
        { field: "image", message: "An image is required for featured stories." },
      ]);
    }

    if (validated.name !== undefined) {
      story.name = validated.name.trim();
    }
    if (validated.profession !== undefined) {
      story.profession = validated.profession.trim();
    }
    if (validated.rating !== undefined) {
      story.rating = validated.rating;
    }
    if (validated.location !== undefined) {
      story.location = validated.location.trim();
    }
    if (validated.description !== undefined) {
      story.description = validated.description.trim();
    }
    const oldImageKey = story.image?.publickey;

    if (validated.isActive !== undefined) {
      story.isActive = validated.isActive;
    }
    if (validated.isFeatured !== undefined) {
      story.isFeatured = validated.isFeatured;
    }
    if (validated.image === null) {
      story.image = null;
    } else if (validated.image !== undefined) {
      story.image = validated.image;
    }

    await story.save();

    // Clean up replaced S3 image
    if (validated.image !== undefined && oldImageKey && oldImageKey !== validated.image?.publickey) {
      safeDeleteS3File(oldImageKey, targetId).catch((err) => {
        logger.warn("Failed to delete replaced story image from S3", { error: String(err) });
      });
    }

    logger.info("Story updated successfully", { operation, id: targetId });
    return apiSuccess(
      { story: formatSafeStory(story) },
      "Story updated successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * DELETE /api/admin/stories/[id]
 */
export async function deleteStory(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "delete";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Deleting story started", { operation, id: targetId });

    await connectToDatabase();
    const story = await Story.findById(targetId);
    if (!story) {
      throw new AppError("Story not found.", 404);
    }

    const imageKey = story.image?.publickey;
    await Story.findByIdAndDelete(targetId);

    // Clean up S3 image if unreferenced
    if (imageKey) {
      safeDeleteS3File(imageKey, targetId).catch((err) => {
        logger.warn("Failed to delete story image from S3", { error: String(err) });
      });
    }

    logger.info("Story deleted successfully", { operation, id: targetId });
    return apiSuccess(
      { message: "Story deleted successfully.", id: targetId },
      "Story deleted successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}
