import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import connectToDatabase from "@/lib/mongodb";
import { Room, IRoomDocument } from "@/models/room.model";
import { authenticateAdmin } from "@/middleware/admin-auth";
import {
  apiSuccess,
  apiError,
  formatZodErrors,
  AppError,
  isNextBailoutError,
} from "@/lib/api-response";
import {
  createRoomSchema,
  updateRoomSchema,
  roomQuerySchema,
  objectIdSchema,
} from "@/validations/room.validation";
import { SafeRoom, PaginatedRoomsResult } from "@/types/room.types";
import { createLogger } from "@/lib/logger";
import { safeDeleteS3File, uploadS3File, parseRequestBody } from "@/lib/s3";
import { getMediaUrl } from "@/lib/media";

const logger = createLogger("RoomController");

function formatSafeRoom(doc: IRoomDocument): SafeRoom {
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
    throw new AppError("Invalid Room ID format.", 400);
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
    logger.warn("Room name conflict", { operation, statusCode: 409 });
    return apiError("A room with this name already exists.", 409);
  }

  logger.error("Unhandled server error", error, { operation, statusCode: 500 });
  return apiError("Internal server error", 500);
}

/**
 * GET /api/admin/rooms
 * Retrieves a paginated list of rooms with optional search & active status filter
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

    const validatedQuery = roomQuerySchema.parse(rawQuery);
    const { page, limit, search, isActive, sortBy, sortOrderDir } = validatedQuery;

    logger.info("Listing rooms started", {
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

    const [total, rooms] = await Promise.all([
      Room.countDocuments(filter),
      Room.find(filter)
        .collation({ locale: "en", strength: 2 })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    const result: PaginatedRoomsResult = {
      items: rooms.map(formatSafeRoom),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    logger.info("Rooms retrieved successfully", { operation, count: rooms.length, total });
    return apiSuccess(result, "Rooms retrieved successfully.");
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * POST /api/admin/rooms
 * Creates a new Room record
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
      body.image = await uploadS3File(body.image, "rooms");
    }

    const validated = createRoomSchema.parse(body);

    logger.info("Creating room started", { operation, name: validated.name });

    await connectToDatabase();

    const normalizedName = validated.name.trim();

    // Check duplicate name
    const existing = await Room.findOne({
      name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
    });

    if (existing) {
      throw new AppError("A room with this name already exists.", 409);
    }

    const newRoom = new Room({
      name: normalizedName,
      image: validated.image,
      isActive: validated.isActive ?? true,
    });

    await newRoom.save();

    logger.info("Room created successfully", { operation, id: newRoom._id.toString() });
    return apiSuccess(
      { room: formatSafeRoom(newRoom) },
      "Room created successfully.",
      201
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * GET /api/admin/rooms/[id]
 */
export async function getById(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "getById";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Fetching room by ID started", { operation, id: targetId });

    await connectToDatabase();
    const room = await Room.findById(targetId);
    if (!room) {
      throw new AppError("Room not found.", 404);
    }

    logger.info("Room retrieved successfully", { operation, id: targetId });
    return apiSuccess(
      { room: formatSafeRoom(room) },
      "Room retrieved successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * PATCH /api/admin/rooms/[id]
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
      body.image = await uploadS3File(body.image, "rooms");
    }

    const validated = updateRoomSchema.parse(body);

    logger.info("Updating room started", { operation, id: targetId });

    await connectToDatabase();
    const room = await Room.findById(targetId);
    if (!room) {
      throw new AppError("Room not found.", 404);
    }

    if (validated.name !== undefined) {
      const normalizedName = validated.name.trim();
      if (normalizedName.toLowerCase() !== room.name.toLowerCase()) {
        const existing = await Room.findOne({
          _id: { $ne: targetId },
          name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
        });

        if (existing) {
          throw new AppError("A room with this name already exists.", 409);
        }
      }
      room.name = normalizedName;
    }

    const oldImageKey = room.image?.publickey;

    if (validated.image === null) {
      room.image = undefined;
    } else if (validated.image !== undefined) {
      room.image = validated.image;
    }

    if (validated.isActive !== undefined) {
      room.isActive = validated.isActive;
    }

    await room.save();

    // Clean up replaced S3 image
    if (validated.image !== undefined && oldImageKey && oldImageKey !== validated.image?.publickey) {
      safeDeleteS3File(oldImageKey, targetId).catch((err) => {
        logger.warn("Failed to delete replaced room image from S3", { error: String(err) });
      });
    }

    logger.info("Room updated successfully", { operation, id: targetId });
    return apiSuccess(
      { room: formatSafeRoom(room) },
      "Room updated successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

/**
 * DELETE /api/admin/rooms/[id]
 */
export async function deleteRoom(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
): Promise<NextResponse> {
  const operation = "delete";
  try {
    await authenticateAdmin(request);
    const targetId = await resolveIdParam(context.params);

    logger.info("Deleting room started", { operation, id: targetId });

    await connectToDatabase();
    const room = await Room.findById(targetId);
    if (!room) {
      throw new AppError("Room not found.", 404);
    }

    const imageKey = room.image?.publickey;
    await Room.findByIdAndDelete(targetId);

    // Clean up S3 image if present
    if (imageKey) {
      safeDeleteS3File(imageKey, targetId).catch((err) => {
        logger.warn("Failed to delete room image from S3", { error: String(err) });
      });
    }

    logger.info("Room deleted successfully", { operation, id: targetId });
    return apiSuccess(
      { message: "Room deleted successfully.", id: targetId },
      "Room deleted successfully."
    );
  } catch (error) {
    return handleError(error, operation);
  }
}

