import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import { Admin, IAdminDocument } from "@/models/admin.model";
import { authenticateAdmin } from "@/middleware/admin-auth";
import { setAdminAuthCookie, clearAdminAuthCookie } from "@/lib/cookies";
import { signAdminToken } from "@/lib/jwt";
import {
  apiSuccess,
  apiError,
  formatZodErrors,
  AppError,
  isNextBailoutError,
} from "@/lib/api-response";
import {
  loginSchema,
  createAdminSchema,
  updateAdminSchema,
  adminQuerySchema,
  objectIdSchema,
} from "@/validations/admin.validation";
import { SafeAdmin, PaginatedAdminsResult } from "@/types/admin.types";
import { createLogger } from "@/lib/logger";

const logger = createLogger("AdminController");

function formatSafeAdmin(doc: IAdminDocument): SafeAdmin {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    status: doc.status,
    lastLoginAt: doc.lastLoginAt ? doc.lastLoginAt.toISOString() : null,
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
    throw new AppError("Invalid administrator ID format.", 400);
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
    logger.warn("An administrator with this email address already exists.", { operation, statusCode: 409 });
    return apiError(
      "An administrator with this email address already exists.",
      409
    );
  }

  logger.error("Unhandled server error", error, { operation, statusCode: 500 });
  return apiError("Internal server error", 500);
}

/**
 * POST /api/admin/auth/login
 */
export async function login(request: NextRequest): Promise<NextResponse> {
  const operation = "login";
  try {
    logger.info("Admin login attempt started", { operation });

    const body = await request.json().catch(() => null);
    if (!body) {
      throw new AppError("Request body is required.", 400);
    }

    const validated = loginSchema.parse(body);

    await connectToDatabase();

    const normalizedEmail = validated.email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: normalizedEmail }).select("+password");

    // Generic error to prevent email enumeration
    if (!admin || !admin.password) {
      logger.warn("Admin login failed: Invalid email or account not found", { operation, email: normalizedEmail });
      throw new AppError("Invalid email or password.", 401);
    }

    if (admin.status !== "active") {
      logger.warn("Admin login rejected: Account inactive", { operation, email: normalizedEmail });
      throw new AppError("Account is inactive. Please contact your system administrator.", 401);
    }

    const isMatch = await bcrypt.compare(validated.password, admin.password);
    if (!isMatch) {
      logger.warn("Admin login failed: Password mismatch", { operation, email: normalizedEmail });
      throw new AppError("Invalid email or password.", 401);
    }

    // Update lastLoginAt
    admin.lastLoginAt = new Date();
    await admin.save();

    const safeAdmin = formatSafeAdmin(admin);
    const token = signAdminToken({
      id: safeAdmin.id,
      email: safeAdmin.email,
    });

    const response = apiSuccess({ admin: safeAdmin }, "Login successful.", 200);

    // Set JWT in HTTP-only cookie
    setAdminAuthCookie(response, token);

    logger.info("Admin login successful", { operation, adminId: safeAdmin.id, email: safeAdmin.email });
    return response;
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * POST /api/admin/auth/logout
 */
export async function logout(): Promise<NextResponse> {
  const operation = "logout";
  try {
    const response = apiSuccess(null, "Logged out successfully.", 200);
    clearAdminAuthCookie(response);
    logger.info("Admin logged out successfully", { operation });
    return response;
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * GET /api/admin/auth/me
 */
export async function getMe(request: NextRequest): Promise<NextResponse> {
  const operation = "getMe";
  try {
    const { admin } = await authenticateAdmin(request);

    await connectToDatabase();
    const freshDoc = await Admin.findById(admin.id);
    if (!freshDoc) {
      throw new AppError("Admin account not found.", 404);
    }
    if (freshDoc.status !== "active") {
      throw new AppError("Admin account is inactive.", 401);
    }

    logger.info("Admin profile retrieved successfully", { operation, adminId: admin.id });
    return apiSuccess({ admin: formatSafeAdmin(freshDoc) }, "Profile retrieved successfully.");
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * GET /api/admin
 */
export async function list(request: NextRequest): Promise<NextResponse> {
  const operation = "list";
  try {
    await authenticateAdmin(request);

    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const queryParams = adminQuerySchema.parse(searchParams);

    logger.info("Listing administrators started", {
      operation,
      page: queryParams.page,
      limit: queryParams.limit,
      search: queryParams.search,
      status: queryParams.status,
    });

    await connectToDatabase();

    const filter: Record<string, unknown> = {};

    if (queryParams.search) {
      const escaped = queryParams.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");
      filter.$or = [{ name: regex }, { email: regex }];
    }

    if (queryParams.status) {
      filter.status = queryParams.status;
    }

    const page = queryParams.page || 1;
    const limit = queryParams.limit || 10;
    const skip = (page - 1) * limit;

    const [total, adminDocs] = await Promise.all([
      Admin.countDocuments(filter),
      Admin.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    const result: PaginatedAdminsResult = {
      items: adminDocs.map(formatSafeAdmin),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    logger.info("Administrators retrieved successfully", { operation, count: adminDocs.length, total });
    return apiSuccess(result, "Administrators retrieved successfully.");
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * POST /api/admin
 */
export async function create(request: NextRequest): Promise<NextResponse> {
  const operation = "create";
  try {
    await authenticateAdmin(request);

    const body = await request.json().catch(() => null);
    if (!body) {
      throw new AppError("Request body is required.", 400);
    }

    const validated = createAdminSchema.parse(body);

    logger.info("Creating administrator started", { operation, email: validated.email });

    await connectToDatabase();

    const normalizedEmail = validated.email.toLowerCase().trim();
    const existing = await Admin.findOne({ email: normalizedEmail });
    if (existing) {
      throw new AppError("An administrator with this email address already exists.", 409);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validated.password, salt);

    const newAdmin = new Admin({
      name: validated.name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      status: validated.status || "active",
    });

    await newAdmin.save();

    logger.info("Administrator created successfully", { operation, adminId: newAdmin._id.toString() });
    return apiSuccess(
      { admin: formatSafeAdmin(newAdmin) },
      "Administrator created successfully.",
      201
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * GET /api/admin/[id]
 */
export async function getById(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "getById";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Fetching administrator by ID started", { operation, id: targetId });

    await connectToDatabase();
    const target = await Admin.findById(targetId);
    if (!target) {
      throw new AppError("Administrator not found.", 404);
    }

    logger.info("Administrator retrieved successfully", { operation, id: targetId });
    return apiSuccess(
      { admin: formatSafeAdmin(target) },
      "Administrator retrieved successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * PATCH /api/admin/[id]
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

    const validated = updateAdminSchema.parse(body);

    logger.info("Updating administrator started", { operation, id: targetId });

    await connectToDatabase();
    const target = await Admin.findById(targetId);
    if (!target) {
      throw new AppError("Administrator not found.", 404);
    }

    // Check email uniqueness if changing email
    if (validated.email) {
      const normalizedEmail = validated.email.toLowerCase().trim();
      if (normalizedEmail !== target.email) {
        const emailConflict = await Admin.findOne({ email: normalizedEmail });
        if (emailConflict && emailConflict._id.toString() !== targetId) {
          throw new AppError("An administrator with this email address already exists.", 409);
        }
        target.email = normalizedEmail;
      }
    }

    if (validated.name !== undefined) {
      target.name = validated.name.trim();
    }

    if (validated.status !== undefined) {
      target.status = validated.status;
    }

    if (validated.password !== undefined && validated.password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      target.password = await bcrypt.hash(validated.password, salt);
    }

    await target.save();

    logger.info("Administrator updated successfully", { operation, id: targetId });
    return apiSuccess(
      { admin: formatSafeAdmin(target) },
      "Administrator updated successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * DELETE /api/admin/[id]
 */
export async function deleteAdmin(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "delete";
  try {
    const { admin } = await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Deleting administrator started", { operation, id: targetId });

    // Prevent self-deletion
    if (admin.id === targetId) {
      throw new AppError("Operation rejected: You cannot delete your own administrator account.", 400);
    }

    await connectToDatabase();
    const target = await Admin.findById(targetId);
    if (!target) {
      throw new AppError("Administrator not found.", 404);
    }

    await Admin.findByIdAndDelete(targetId);

    logger.info("Administrator deleted successfully", { operation, id: targetId });
    return apiSuccess(
      { message: "Administrator deleted successfully.", id: targetId },
      "Administrator deleted successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}
