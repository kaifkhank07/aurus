import { z } from "zod";

export const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

export const citySlugParamSchema = z.object({
  citySlug: z
    .string()
    .trim()
    .min(1, "City slug is required")
    .max(100, "City slug cannot exceed 100 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid city slug format"),
});

export const cityHostelsQuerySchema = z.object({
  tenantType: z.enum(["girls", "boys", "co-ed"]).optional(),
  occupancy: z.string().trim().optional(),
  occupancyId: objectIdSchema.optional(),
  localitySlug: z.string().trim().optional(),
  localityId: objectIdSchema.optional(),
  instituteSlug: z.string().trim().optional(),
  instituteId: objectIdSchema.optional(),
  search: z.string().trim().max(100).optional(),
  minRent: z.coerce.number().min(0).optional(),
  maxRent: z.coerce.number().min(0).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(["rent", "createdAt", "title", "rating"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const cityListQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  hasHostels: z.preprocess((val) => {
    if (typeof val === "string") return val.toLowerCase() === "true";
    return Boolean(val);
  }, z.boolean().optional()),
  includeHostels: z.preprocess((val) => {
    if (typeof val === "string") return val.toLowerCase() === "true";
    return Boolean(val);
  }, z.boolean().optional()),
});

export type CitySlugParam = z.infer<typeof citySlugParamSchema>;
export type CityHostelsQuery = z.infer<typeof cityHostelsQuerySchema>;
export type CityListQuery = z.infer<typeof cityListQuerySchema>;

