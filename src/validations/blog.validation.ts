import { z } from "zod";
import { objectIdSchema } from "./admin.validation";
import { cityImageSchema as imageSchema, cityMetadataSchema } from "./city.validation";

export { objectIdSchema };

const normalizeTags = (tags: string[] | undefined): string[] => {
  if (!tags) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const tag of tags) {
    const trimmed = tag.trim();
    const lower = trimmed.toLowerCase();
    if (trimmed.length > 0 && !seen.has(lower)) {
      seen.add(lower);
      result.push(trimmed);
    }
  }
  return result;
};

export const createBlogSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, { message: "Blog title is required." })
      .max(200, { message: "Title cannot exceed 200 characters." }),
    subtitle: z.string().trim().max(300, { message: "Subtitle cannot exceed 300 characters." }).optional(),
    image: imageSchema,
    tags: z
      .array(z.string())
      .optional()
      .default([])
      .transform(normalizeTags),
    description: z
      .string()
      .trim()
      .min(1, { message: "Description content is required." }),
    metadata: cityMetadataSchema.optional(),
  })
  .strict();

export const updateBlogSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    subtitle: z.string().trim().max(300).optional(),
    image: imageSchema.optional(),
    tags: z
      .array(z.string())
      .optional()
      .transform(normalizeTags),
    description: z.string().trim().min(1).optional(),
    metadata: cityMetadataSchema.optional(),
  })
  .strict()
  .refine(
    (data) => Object.values(data).some((val) => val !== undefined),
    { message: "At least one field must be provided for update." }
  );

export const blogQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().int().min(1, "Page must be greater than or equal to 1.")),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .pipe(
      z
        .number()
        .int()
        .min(1, "Limit must be at least 1.")
        .max(100, "Limit cannot exceed 100 items per page.")
    ),
  search: z.string().trim().optional(),
  tag: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "title"]).optional(),
  sortOrderDir: z.enum(["asc", "desc"]).optional(),
});
