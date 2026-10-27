import mongoose from "mongoose";

/**
 * Converts a text string into a clean URL-friendly slug.
 * - Converts to lowercase
 * - Trims leading/trailing whitespace
 * - Replaces unsupported characters and spaces with hyphens
 * - Collapses consecutive hyphens
 * - Removes leading and trailing hyphens
 */
export function createBaseSlug(text: string): string {
  if (!text || typeof text !== "string") {
    return "item";
  }

  const slug = text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return slug || "item";
}

/**
 * Generates a unique slug against a given Mongoose model.
 * If the base slug already exists, appends `-2`, `-3`, etc.
 * Supports excluding an existing document ID during updates.
 */
export async function generateUniqueSlug<T>(
  model: mongoose.Model<T>,
  sourceText: string,
  excludeId?: string | mongoose.Types.ObjectId
): Promise<string> {
  const baseSlug = createBaseSlug(sourceText);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query: Record<string, unknown> = {
      slug,
    };

    if (excludeId) {
      (query as Record<string, unknown>)._id = { $ne: excludeId };
    }

    const existing = await model.exists(query);
    if (!existing) {
      return slug;
    }

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
}
