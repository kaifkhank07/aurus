import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import connectToDatabase from "@/lib/mongodb";
import { Blog, IBlogDocument } from "@/models/blog.model";
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
  createBlogSchema,
  updateBlogSchema,
  blogQuerySchema,
  objectIdSchema,
} from "@/validations/blog.validation";
import { SafeBlog, PaginatedBlogsResult } from "@/types/blog.types";
import { createLogger } from "@/lib/logger";
import { safeDeleteS3File, uploadS3File, parseRequestBody } from "@/lib/s3";
import { getMediaUrl } from "@/lib/media";

const logger = createLogger("BlogController");

function formatSafeBlog(doc: IBlogDocument): SafeBlog {
  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    subtitle: doc.subtitle,
    image: {
      url: doc.image?.url || getMediaUrl(doc.image?.publickey) || "",
      publickey: doc.image?.publickey || "",
    },
    tags: doc.tags ?? [],
    description: doc.description,
    metadata: doc.metadata
      ? {
          title: doc.metadata.title,
          description: doc.metadata.description,
          keywords: doc.metadata.keywords,
        }
      : undefined,
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
    throw new AppError("Invalid Blog ID format.", 400);
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
    logger.warn("Blog slug or title conflict", { operation, statusCode: 409 });
    return apiError("A blog post with this slug or title already exists.", 409);
  }

  logger.error("Unhandled server error", error, { operation, statusCode: 500 });
  return apiError("Internal server error", 500);
}

/**
 * GET /api/admin/blogs
 * Retrieves a paginated list of blogs with search, tag filter, and sorting
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

    const validatedQuery = blogQuerySchema.parse(rawQuery);
    const { page, limit, search, tag, sortBy, sortOrderDir } = validatedQuery;

    logger.info("Listing blogs started", {
      operation,
      page,
      limit,
      search,
      tag,
      sortBy,
      sortOrderDir,
    });

    await connectToDatabase();

    const filter: Record<string, unknown> = {};

    if (tag) {
      filter.tags = { $regex: new RegExp(`^${tag}$`, "i") };
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { title: searchRegex },
        { subtitle: searchRegex },
        { slug: searchRegex },
        { tags: searchRegex },
      ];
    }

    const sortOptions: Record<string, 1 | -1> = {};
    const sortField = sortBy || "createdAt";
    sortOptions[sortField] = sortOrderDir === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    const [total, blogDocs] = await Promise.all([
      Blog.countDocuments(filter),
      Blog.find(filter)
        .collation({ locale: "en", strength: 2 })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    const result: PaginatedBlogsResult = {
      items: blogDocs.map(formatSafeBlog),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    logger.info("Blogs retrieved successfully", { operation, count: blogDocs.length, total });
    return apiSuccess(result, "Blogs retrieved successfully.");
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * POST /api/admin/blogs
 * Creates a new Blog with backend-generated slug
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
      body.image = await uploadS3File(body.image, "blogs");
    }

    const validated = createBlogSchema.parse(body);

    logger.info("Creating blog started", { operation, title: validated.title });

    await connectToDatabase();

    // Backend-managed slug generation
    const slug = await generateUniqueSlug(Blog, validated.title.trim());

    const newBlog = new Blog({
      title: validated.title.trim(),
      slug,
      subtitle: validated.subtitle?.trim(),
      image: validated.image,
      tags: validated.tags ?? [],
      description: validated.description.trim(),
      metadata: validated.metadata ?? {},
    });

    await newBlog.save();

    logger.info("Blog created successfully", { operation, id: newBlog._id.toString(), slug });
    return apiSuccess(
      { blog: formatSafeBlog(newBlog) },
      "Blog created successfully.",
      201
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * GET /api/admin/blogs/[id]
 */
export async function getById(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "getById";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Fetching blog by ID started", { operation, id: targetId });

    await connectToDatabase();
    const blog = await Blog.findById(targetId);
    if (!blog) {
      throw new AppError("Blog not found.", 404);
    }

    logger.info("Blog retrieved successfully", { operation, id: targetId });
    return apiSuccess(
      { blog: formatSafeBlog(blog) },
      "Blog retrieved successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * PATCH /api/admin/blogs/[id]
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
      body.image = await uploadS3File(body.image, "blogs");
    }

    const validated = updateBlogSchema.parse(body);

    logger.info("Updating blog started", { operation, id: targetId });

    await connectToDatabase();
    const blog = await Blog.findById(targetId);
    if (!blog) {
      throw new AppError("Blog not found.", 404);
    }

    // Handle Title & Slug update
    if (validated.title !== undefined) {
      const nextTitle = validated.title.trim();
      if (nextTitle.toLowerCase() !== blog.title.toLowerCase()) {
        blog.slug = await generateUniqueSlug(Blog, nextTitle, targetId);
      }
      blog.title = nextTitle;
    }

    const oldImageKey = blog.image?.publickey;

    if (validated.subtitle !== undefined) {
      blog.subtitle = validated.subtitle.trim();
    }

    if (validated.image !== undefined) {
      blog.image = validated.image;
    }

    if (validated.tags !== undefined) {
      blog.tags = validated.tags;
    }

    if (validated.description !== undefined) {
      blog.description = validated.description.trim();
    }

    if (validated.metadata !== undefined) {
      blog.metadata = validated.metadata;
    }

    await blog.save();

    // Clean up replaced S3 image
    if (validated.image !== undefined && oldImageKey && oldImageKey !== validated.image.publickey) {
      safeDeleteS3File(oldImageKey, targetId).catch((err) => {
        logger.warn("Failed to delete replaced blog image from S3", { error: String(err) });
      });
    }

    logger.info("Blog updated successfully", { operation, id: targetId, slug: blog.slug });
    return apiSuccess(
      { blog: formatSafeBlog(blog) },
      "Blog updated successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * DELETE /api/admin/blogs/[id]
 */
export async function deleteBlog(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "delete";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Deleting blog started", { operation, id: targetId });

    await connectToDatabase();
    const blog = await Blog.findById(targetId);
    if (!blog) {
      throw new AppError("Blog not found.", 404);
    }

    const imageKey = blog.image?.publickey;
    await Blog.findByIdAndDelete(targetId);

    // Clean up S3 image if unreferenced
    if (imageKey) {
      safeDeleteS3File(imageKey, targetId).catch((err) => {
        logger.warn("Failed to delete blog image from S3", { error: String(err) });
      });
    }

    logger.info("Blog deleted successfully", { operation, id: targetId });
    return apiSuccess(
      { message: "Blog deleted successfully.", id: targetId },
      "Blog deleted successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}
