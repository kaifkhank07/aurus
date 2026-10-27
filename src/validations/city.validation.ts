import { z } from "zod";
export { objectIdSchema } from "./admin.validation";

export const cityImageSchema = z.object({
  id: z.string().trim().min(1, { message: "Image ID is required." }),
  publickey: z.string().trim().min(1, { message: "Image publickey is required." }),
  url: z.string().trim().optional(),
});
export const fileOptionSchema = cityImageSchema;

export const cityMetadataSchema = z.object({
  title: z.string().trim().max(200, "Title cannot exceed 200 characters").optional(),
  description: z.string().trim().max(500, "Description cannot exceed 500 characters").optional(),
  keywords: z.array(z.string().trim().min(1)).optional(),
});

export const createCitySchema = z
  .object({
    country: z
      .string()
      .trim()
      .min(1, { message: "Country is required." })
      .max(100, { message: "Country cannot exceed 100 characters." }),
    state: z
      .string()
      .trim()
      .min(1, { message: "State is required." })
      .max(100, { message: "State cannot exceed 100 characters." }),
    city: z
      .string()
      .trim()
      .min(1, { message: "City is required." })
      .max(100, { message: "City cannot exceed 100 characters." }),
    image: cityImageSchema.optional(),
    sortOrder: z.number().int().optional().default(0),
    isActive: z.boolean().optional().default(true),
    metadata: cityMetadataSchema.optional(),
  })
  .strict();

export const updateCitySchema = z
  .object({
    country: z.string().trim().min(1, "Country cannot be empty.").max(100).optional(),
    state: z.string().trim().min(1, "State cannot be empty.").max(100).optional(),
    city: z.string().trim().min(1, "City cannot be empty.").max(100).optional(),
    image: cityImageSchema.optional().nullable(),
    sortOrder: z.number().int().optional(),
    isActive: z.boolean().optional(),
    metadata: cityMetadataSchema.optional(),
  })
  .strict()
  .refine(
    (data) => Object.values(data).some((val) => val !== undefined),
    { message: "At least one field must be provided for update." }
  );

export const cityQuerySchema = z.object({
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
  country: z.string().trim().optional(),
  state: z.string().trim().optional(),
  isActive: z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined || val === "") return undefined;
      if (val === "true") return true;
      if (val === "false") return false;
      return undefined;
    }),
  sortBy: z.enum(["sortOrder", "city", "createdAt"]).optional(),
  sortOrderDir: z.enum(["asc", "desc"]).optional(),
});
