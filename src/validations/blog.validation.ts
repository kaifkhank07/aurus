import { z } from "zod";
import { objectIdSchema } from "./admin.validation";
import { cityImageSchema as imageSchema, cityMetadataSchema } from "./city.validation";
import { BLOG_CATEGORIES, BlogCategory, normalizeBlogCategory } from "@/types/blog.types";

export { objectIdSchema };

export const blogCategorySchema = z
  .string()
  .trim()
  .min(1, { message: "Blog category is required." })
  .superRefine((val, ctx) => {
    const normalized = normalizeBlogCategory(val);
    if (!normalized) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid category: "${val}". Allowed categories are: ${BLOG_CATEGORIES.join(", ")}.`,
      });
    }
  })
  .transform((val) => normalizeBlogCategory(val) as BlogCategory);

export const createBlogSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, { message: "Blog title is required." })
      .max(200, { message: "Title cannot exceed 200 characters." }),
    subtitle: z.string().trim().max(300, { message: "Subtitle cannot exceed 300 characters." }).optional(),
    image: imageSchema,
    category: blogCategorySchema,
    readDuration: z.coerce
      .number()
      .int("Read duration must be a whole number of minutes.")
      .min(1, "Read duration must be at least 1 minute.")
      .max(180, "Read duration cannot exceed 180 minutes.")
      .default(5),
    isActive: z
      .union([z.boolean(), z.string()])
      .optional()
      .transform((val) => {
        if (typeof val === "string") return val === "true";
        return val ?? true;
      }),
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
    category: blogCategorySchema.optional(),
    readDuration: z.coerce
      .number()
      .int()
      .min(1)
      .max(180)
      .optional(),
    isActive: z
      .union([z.boolean(), z.string()])
      .optional()
      .transform((val) => {
        if (typeof val === "string") return val === "true";
        return val;
      }),
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
  category: z.string().trim().optional(),
  isActive: z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined || val === "") return undefined;
      return val === "true";
    }),
  sortBy: z.enum(["createdAt", "updatedAt", "title", "readDuration", "category"]).optional(),
  sortOrderDir: z.enum(["asc", "desc"]).optional(),
});
