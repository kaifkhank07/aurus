/**
 * Aurus AWS S3 File Service
 *
 * Reusable, robust, and secure AWS S3 file upload, retrieval, and deletion service.
 * Supports:
 * - Direct server-side multipart uploads
 * - Presigned upload URLs (browser-to-S3 direct upload)
 * - Presigned download URLs and public URLs
 * - Magic-byte binary verification for images (JPEG, PNG, WebP, GIF, SVG) and PDFs
 * - Automatic filename collision prevention and folder partitioning
 * - CloudFront ready (commented hooks for seamless CDN domain transition)
 * - Safe unreferenced file deletion (preserves shared assets)
 */

import crypto from "crypto";
import { NextRequest } from "next/server";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AppError } from "@/lib/api-response";
import { createLogger } from "@/lib/logger";
import { IFileOption } from "@/types/general.types";
import { getMediaUrl } from "@/lib/media";
import connectToDatabase from "@/lib/mongodb";
import { City } from "@/models/city.model";
import { Amenity } from "@/models/amenity.model";
import { Occupancy } from "@/models/occupancy.model";
import { Hostel } from "@/models/hostel.model";
import { Blog } from "@/models/blog.model";
import { Story } from "@/models/story.model";

const logger = createLogger("S3Service");

// Configurable file size limits (defaults: 10MB images, 25MB PDFs)
export const MAX_IMAGE_SIZE = parseInt(
  process.env.MAX_IMAGE_SIZE_BYTES || String(10 * 1024 * 1024),
  10
);
export const MAX_PDF_SIZE = parseInt(
  process.env.MAX_PDF_SIZE_BYTES || String(25 * 1024 * 1024),
  10
);

export type AllowedFolder =
  | "hostels"
  | "cities"
  | "blogs"
  | "stories"
  | "amenities"
  | "occupancies"
  | "general";

interface S3Config {
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  cloudFrontDomain?: string;
}

let cachedS3Client: S3Client | null = null;

function getS3Config(): S3Config {
  const region = process.env.AWS_REGION;
  const bucket = process.env.AWS_S3_BUCKET_NAME;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const cloudFrontDomain = process.env.AWS_CLOUDFRONT_DOMAIN;

  if (!region || !bucket || !accessKeyId || !secretAccessKey) {
    logger.error("AWS S3 credentials or configuration missing in environment variables", {
      operation: "getS3Config",
      hasRegion: Boolean(region),
      hasBucket: Boolean(bucket),
      hasAccessKey: Boolean(accessKeyId),
      hasSecretKey: Boolean(secretAccessKey),
    });
    throw new AppError(
      "AWS S3 service is not properly configured on the server. Please check environment variables.",
      500
    );
  }

  return {
    region,
    bucket,
    accessKeyId,
    secretAccessKey,
    cloudFrontDomain,
  };
}

export function getS3Client(): S3Client {
  if (cachedS3Client) {
    return cachedS3Client;
  }

  const config = getS3Config();
  cachedS3Client = new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  return cachedS3Client;
}

/**
 * Supported MIME types mapping to file extensions
 */
export const ALLOWED_MIME_TYPES: Record<string, { ext: string; category: "image" | "pdf" }> = {
  "image/jpeg": { ext: "jpg", category: "image" },
  "image/png": { ext: "png", category: "image" },
  "image/webp": { ext: "webp", category: "image" },
  "image/gif": { ext: "gif", category: "image" },
  "image/svg+xml": { ext: "svg", category: "image" },
  "application/pdf": { ext: "pdf", category: "pdf" },
};

/**
 * Validates buffer binary signatures (magic bytes) to prevent client MIME spoofing
 */
export function verifyMagicBytes(buffer: Buffer, declaredMime: string): boolean {
  if (buffer.length < 4) return false;

  // JPEG: FF D8 FF
  if (declaredMime === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  // PNG: 89 50 4E 47 (\x89PNG)
  if (declaredMime === "image/png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    );
  }

  // GIF: GIF87a or GIF89a
  if (declaredMime === "image/gif") {
    const header = buffer.subarray(0, 6).toString("ascii");
    return header === "GIF87a" || header === "GIF89a";
  }

  // WebP: RIFF....WEBP
  if (declaredMime === "image/webp") {
    if (buffer.length < 12) return false;
    const riff = buffer.subarray(0, 4).toString("ascii");
    const webp = buffer.subarray(8, 12).toString("ascii");
    return riff === "RIFF" && webp === "WEBP";
  }

  // PDF: %PDF-
  if (declaredMime === "application/pdf") {
    const header = buffer.subarray(0, 4).toString("ascii");
    return header === "%PDF";
  }

  // SVG: <?xml or <svg
  if (declaredMime === "image/svg+xml") {
    const snippet = buffer.subarray(0, 200).toString("utf8").trim().toLowerCase();
    return snippet.includes("<svg") || snippet.includes("<?xml");
  }

  return false;
}

/**
 * Validates file buffer, declared MIME type, and size constraints
 */
export function validateFileContent(
  buffer: Buffer,
  mimeType: string,
  fileName: string
): { ext: string; category: "image" | "pdf" } {
  const mimeConfig = ALLOWED_MIME_TYPES[mimeType.toLowerCase()];
  if (!mimeConfig) {
    throw new AppError(
      `Unsupported file type "${mimeType}". Allowed formats are JPEG, PNG, WebP, GIF, SVG, and PDF.`,
      400
    );
  }

  // Validate size limit based on category
  const maxSize = mimeConfig.category === "image" ? MAX_IMAGE_SIZE : MAX_PDF_SIZE;
  if (buffer.length > maxSize) {
    const maxMb = Math.round(maxSize / (1024 * 1024));
    throw new AppError(
      `File "${fileName}" exceeds maximum allowed size of ${maxMb}MB for ${mimeConfig.category}s.`,
      400
    );
  }

  // Magic byte verification
  const isValidSignature = verifyMagicBytes(buffer, mimeType.toLowerCase());
  if (!isValidSignature) {
    throw new AppError(
      `File "${fileName}" does not match declared type "${mimeType}". File contents appear corrupted or invalid.`,
      400
    );
  }

  return mimeConfig;
}

/**
 * Generates a clean, collision-proof S3 key partitioned by category and folder
 */
export function generateS3Key(
  category: "image" | "pdf",
  folder: string,
  extension: string
): string {
  const sanitizedFolder = folder.toLowerCase().replace(/[^a-z0-9_-]/g, "");
  const prefix = category === "image" ? "images" : "pdfs";
  const uniqueId = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;
  const cleanExt = extension.replace(/^\.+/, "");

  return `${prefix}/${sanitizedFolder}/${uniqueId}.${cleanExt}`;
}

/**
 * Generates the access URL for an S3 object.
 * CloudFront Ready: If AWS_CLOUDFRONT_DOMAIN is set, returns the CloudFront URL.
 * Otherwise, generates either a presigned download URL or standard S3 object URL.
 */
export async function getFileUrl(
  key: string,
  options?: { expiresInSeconds?: number; forcePresigned?: boolean }
): Promise<string> {
  const config = getS3Config();

  // =========================================================================
  // Future CloudFront integration:
  // When CloudFront is configured in production, simply set AWS_CLOUDFRONT_DOMAIN
  // e.g. "d1234567890.cloudfront.net" or "cdn.aurushostels.com"
  // =========================================================================
  if (config.cloudFrontDomain) {
    const domain = config.cloudFrontDomain.replace(/^https?:\/\//, "").replace(/\/+$/, "");
    return `https://${domain}/${key}`;
  }

  // S3 Presigned URL approach (Default for private S3 buckets)
  if (options?.forcePresigned || !options?.forcePresigned) {
    try {
      const client = getS3Client();
      const command = new GetObjectCommand({
        Bucket: config.bucket,
        Key: key,
      });

      const expiresIn = options?.expiresInSeconds || 3600; // 1 hour default
      return await getSignedUrl(client, command, { expiresIn });
    } catch {
      // Fallback to standard S3 URL if presigner fails
      return `https://${config.bucket}.s3.${config.region}.amazonaws.com/${key}`;
    }
  }

  return `https://${config.bucket}.s3.${config.region}.amazonaws.com/${key}`;
}

/**
 * Generates a permanent public S3 URL (without presigning)
 */
export function getDirectS3Url(key: string): string {
  const config = getS3Config();
  if (config.cloudFrontDomain) {
    const domain = config.cloudFrontDomain.replace(/^https?:\/\//, "").replace(/\/+$/, "");
    return `https://${domain}/${key}`;
  }
  return `https://${config.bucket}.s3.${config.region}.amazonaws.com/${key}`;
}

/**
 * Uploads a file buffer directly to S3 with full validation and metadata
 */
export async function uploadFileToS3(params: {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  folder?: string;
}): Promise<{
  file: IFileOption;
  url: string;
  size: number;
  mimeType: string;
  originalName: string;
}> {
  const { buffer, originalName, mimeType, folder = "general" } = params;

  // Validate content and extract extension
  const { ext, category } = validateFileContent(buffer, mimeType, originalName);
  const key = generateS3Key(category, folder, ext);
  const config = getS3Config();
  const client = getS3Client();

  logger.info("Uploading file to S3 started", {
    operation: "uploadFileToS3",
    key,
    size: buffer.length,
    mimeType,
    category,
  });

  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
    Metadata: {
      originalName: encodeURIComponent(originalName),
      uploadedAt: new Date().toISOString(),
    },
  });

  await client.send(command);

  const url = getMediaUrl(key) || `https://${config.bucket}.s3.${config.region}.amazonaws.com/${key}`;
  const file: IFileOption = {
    url,
    publickey: key,
  };

  logger.info("File uploaded to S3 successfully", {
    operation: "uploadFileToS3",
    key,
    url,
  });

  return {
    file,
    url,
    size: buffer.length,
    mimeType,
    originalName,
  };
}


/**
 * Deletes a single object from S3 by its key
 */
export async function deleteFileFromS3(key: string): Promise<boolean> {
  if (!key || typeof key !== "string" || key.trim() === "") {
    return false;
  }

  try {
    const config = getS3Config();
    const client = getS3Client();

    logger.info("Deleting file from S3 started", {
      operation: "deleteFileFromS3",
      key,
    });

    const command = new DeleteObjectCommand({
      Bucket: config.bucket,
      Key: key,
    });

    await client.send(command);

    logger.info("File deleted from S3 successfully", {
      operation: "deleteFileFromS3",
      key,
    });

    return true;
  } catch (error) {
    logger.warn("Failed to delete file from S3", {
      operation: "deleteFileFromS3",
      key,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

/**
 * Deletes multiple objects from S3 in a batch
 */
export async function deleteFilesFromS3(keys: string[]): Promise<number> {
  const validKeys = keys.filter((k) => typeof k === "string" && k.trim().length > 0);
  if (validKeys.length === 0) return 0;

  try {
    const config = getS3Config();
    const client = getS3Client();

    logger.info("Batch deleting files from S3 started", {
      operation: "deleteFilesFromS3",
      count: validKeys.length,
    });

    const command = new DeleteObjectsCommand({
      Bucket: config.bucket,
      Delete: {
        Objects: validKeys.map((Key) => ({ Key })),
        Quiet: true,
      },
    });

    await client.send(command);

    logger.info("Batch files deleted from S3 successfully", {
      operation: "deleteFilesFromS3",
      count: validKeys.length,
    });

    return validKeys.length;
  } catch (error) {
    logger.warn("Batch S3 deletion encountered an error", {
      operation: "deleteFilesFromS3",
      error: error instanceof Error ? error.message : String(error),
    });
    return 0;
  }
}

/**
 * Checks if an S3 object exists
 */
export async function doesS3ObjectExist(key: string): Promise<boolean> {
  try {
    const config = getS3Config();
    const client = getS3Client();
    const command = new HeadObjectCommand({
      Bucket: config.bucket,
      Key: key,
    });
    await client.send(command);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks whether an S3 key is still referenced by any document in the database,
 * preventing accidental deletion of shared assets.
 */
export async function isS3KeyReferencedInDb(
  key: string,
  excludeDocId?: string
): Promise<boolean> {
  if (!key) return false;

  await connectToDatabase();

  const filter = (field: string) => {
    return excludeDocId
      ? { [field]: key, _id: { $ne: excludeDocId } }
      : { [field]: key };
  };

  const [cityMatch, amenityMatch, occupancyMatch, blogMatch, storyMatch, hostelMatch] =
    await Promise.all([
      City.exists(filter("image.publickey")),
      Amenity.exists(filter("image.publickey")),
      Occupancy.exists(filter("image.publickey")),
      Blog.exists(filter("image.publickey")),
      Story.exists(filter("image.publickey")),
      Hostel.exists({
        $or: [
          filter("frontImage.publickey"),
          filter("galleryImages.publickey"),
          filter("firstImage.publickey"),
          filter("secondImage.publickey"),
          filter("brochure.publickey"),
        ],
      }),
    ]);

  return Boolean(
    cityMatch ||
      amenityMatch ||
      occupancyMatch ||
      blogMatch ||
      storyMatch ||
      hostelMatch
  );
}

/**
 * Safely deletes an S3 file ONLY if no other document references it
 */
export async function safeDeleteS3File(
  key: string,
  excludeDocId?: string
): Promise<boolean> {
  if (!key) return false;

  const isReferenced = await isS3KeyReferencedInDb(key, excludeDocId);
  if (isReferenced) {
    logger.info("Skipping S3 deletion: Object is referenced by other database records", {
      operation: "safeDeleteS3File",
      key,
    });
    return false;
  }

  return deleteFileFromS3(key);
}

/**
 * Helper to safely extract S3 key from IFileOption or string
 */
export function extractS3Key(file: IFileOption | string | null | undefined): string | null {
  if (!file) return null;
  if (typeof file === "string") return file;
  if (typeof file === "object" && "publickey" in file && typeof file.publickey === "string") {
    return file.publickey;
  }
  return null;
}

/**
 * Resolves or uploads a file input to S3 and returns a standardized IFileOption.
 * Accepts:
 * - Existing IFileOption ({ url, publickey }) -> returned unchanged
 * - File / Blob object (from multipart/form-data) -> uploaded to S3
 * - Base64 Data URL string (e.g., "data:image/png;base64,...") -> uploaded to S3
 * - S3 key string -> wrapped into IFileOption
 * - Buffer object ({ buffer: Buffer, originalName?: string, mimeType?: string }) -> uploaded to S3
 */
export async function uploadS3File(
  input: unknown,
  folder = "general"
): Promise<IFileOption | undefined> {
  if (!input) return undefined;

  // 1. If it's already an IFileOption object (or has publickey)
  if (
    typeof input === "object" &&
    input !== null &&
    "publickey" in input &&
    typeof (input as { publickey: unknown }).publickey === "string"
  ) {
    const raw = input as { publickey: string; url?: string };
    return {
      url: raw.url || getMediaUrl(raw.publickey) || "",
      publickey: raw.publickey,
    };
  }

  // 2. If it's a File or Blob instance
  if (
    input instanceof Blob ||
    (typeof input === "object" && input !== null && "arrayBuffer" in input)
  ) {
    const file = input as Blob & { name?: string };
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const originalName = typeof file.name === "string" && file.name.length > 0 ? file.name : "upload";
    const mimeType = file.type || "application/octet-stream";

    const result = await uploadFileToS3({
      buffer,
      originalName,
      mimeType,
      folder,
    });
    return result.file;
  }

  // 3. If it's a Base64 data URL string
  if (typeof input === "string" && input.startsWith("data:")) {
    const matches = input.match(/^data:([^;]+);base64,(.+)$/);
    if (matches) {
      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");
      const result = await uploadFileToS3({
        buffer,
        originalName: "upload",
        mimeType,
        folder,
      });
      return result.file;
    }
  }

  // 4. If it's an existing S3 key string
  if (typeof input === "string" && input.trim().length > 0) {
    const key = input.trim();
    return { url: getMediaUrl(key) || "", publickey: key };
  }

  // 5. If it's an object with a Buffer
  if (
    typeof input === "object" &&
    input !== null &&
    "buffer" in input &&
    Buffer.isBuffer((input as { buffer: unknown }).buffer)
  ) {
    const raw = input as { buffer: Buffer; originalName?: string; mimeType?: string };
    const result = await uploadFileToS3({
      buffer: raw.buffer,
      originalName: raw.originalName || "upload",
      mimeType: raw.mimeType || "application/octet-stream",
      folder,
    });
    return result.file;
  }

  return undefined;
}

/**
 * Uploads an array of file inputs to S3 and returns an array of standardized IFileOption objects.
 */
export async function uploadMultipleS3Files(
  inputs: unknown,
  folder = "general"
): Promise<IFileOption[]> {
  if (!inputs) return [];
  const list = Array.isArray(inputs) ? inputs : [inputs];
  const results: IFileOption[] = [];
  for (const item of list) {
    const uploaded = await uploadS3File(item, folder);
    if (uploaded) {
      results.push(uploaded);
    }
  }
  return results;
}

/**
 * Helper to parse request body supporting both multipart/form-data and application/json.
 * For multipart requests, normalizes numbers, booleans, stringified JSON fields, and file objects.
 */
export async function parseRequestBody(request: NextRequest): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const body: Record<string, unknown> = {};

    // Check for JSON payload in 'data', 'payload', or 'json'
    const jsonEnvelope = formData.get("data") || formData.get("payload") || formData.get("json");
    if (jsonEnvelope && typeof jsonEnvelope === "string") {
      try {
        const parsed = JSON.parse(jsonEnvelope);
        if (typeof parsed === "object" && parsed !== null) {
          Object.assign(body, parsed);
        }
      } catch {
        // Continue with normal form entries
      }
    }

    const uniqueKeys = Array.from(new Set(formData.keys()));
    for (const rawKey of uniqueKeys) {
      if (rawKey === "data" || rawKey === "payload" || rawKey === "json") continue;

      const cleanKey = rawKey.endsWith("[]") ? rawKey.slice(0, -2) : rawKey;
      const values = formData.getAll(rawKey);

      // Filter out empty file inputs (size === 0)
      const nonNullValues = values.filter((val) => {
        if (typeof val === "object" && val !== null && "size" in val && typeof (val as { size: unknown }).size === "number") {
          return (val as { size: number }).size > 0;
        }
        return true;
      });

      if (nonNullValues.length === 0) continue;

      const parseSingleValue = (val: unknown): unknown => {
        if (typeof val === "string") {
          const trimmed = val.trim();
          if (trimmed === "true") return true;
          if (trimmed === "false") return false;
          if (trimmed === "null") return null;
          if (trimmed === "undefined") return undefined;

          if (
            (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
            (trimmed.startsWith("[") && trimmed.endsWith("]"))
          ) {
            try {
              return JSON.parse(trimmed);
            } catch {
              return trimmed;
            }
          }

          const numericFields = ["rent", "sortOrder", "rating", "latitude", "longitude", "minRent", "maxRent"];
          if (numericFields.includes(cleanKey) && trimmed !== "" && !isNaN(Number(trimmed))) {
            return Number(trimmed);
          }

          return trimmed;
        }
        return val;
      };

      if (rawKey.endsWith("[]") || cleanKey === "galleryImages") {
        body[cleanKey] = nonNullValues.map(parseSingleValue);
      } else if (nonNullValues.length > 1) {
        body[cleanKey] = nonNullValues.map(parseSingleValue);
      } else {
        body[cleanKey] = parseSingleValue(nonNullValues[0]);
      }
    }

    return body;
  }

  // Fallback to standard JSON parsing
  return (await request.json().catch(() => ({}))) as Record<string, unknown>;
}

