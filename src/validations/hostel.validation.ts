import { z } from "zod";
import { objectIdSchema } from "./admin.validation";
import { cityImageSchema as imageSchema, cityMetadataSchema } from "./city.validation";
import { TENANT_TYPES, RENT_FREQUENCIES } from "@/types/hostel.types";

export { objectIdSchema };

const locationSchema = z
  .object({
    city: objectIdSchema,
    locality: objectIdSchema,
    address: z
      .string()
      .trim()
      .min(1, { message: "Address is required." })
      .max(500, { message: "Address cannot exceed 500 characters." }),
    mapUrl: z.string().trim().url({ message: "Invalid Map URL format." }).optional().or(z.literal("")),
    longitude: z
      .number()
      .min(-180, { message: "Longitude must be >= -180." })
      .max(180, { message: "Longitude must be <= 180." })
      .optional(),
    latitude: z
      .number()
      .min(-90, { message: "Latitude must be >= -90." })
      .max(90, { message: "Latitude must be <= 90." })
      .optional(),
  })
  .refine(
    (data) => {
      const hasLng = data.longitude !== undefined;
      const hasLat = data.latitude !== undefined;
      return (hasLng && hasLat) || (!hasLng && !hasLat);
    },
    { message: "Coordinates must include both longitude and latitude, or omit both." }
  );

const updateLocationSchema = z
  .object({
    city: objectIdSchema.optional(),
    locality: objectIdSchema.optional(),
    address: z.string().trim().min(1).max(500).optional(),
    mapUrl: z.string().trim().url().optional().or(z.literal("")),
    longitude: z.number().min(-180).max(180).optional(),
    latitude: z.number().min(-90).max(90).optional(),
  })
  .refine(
    (data) => {
      const hasLng = data.longitude !== undefined;
      const hasLat = data.latitude !== undefined;
      if (hasLng || hasLat) {
        return hasLng && hasLat;
      }
      return true;
    },
    { message: "Coordinates must include both longitude and latitude, or omit both." }
  );

export const createHostelSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, { message: "Hostel title is required." })
      .max(200, { message: "Title cannot exceed 200 characters." }),
    subtitle: z.string().trim().max(300, { message: "Subtitle cannot exceed 300 characters." }).optional(),
    tenantType: z
      .array(z.enum(TENANT_TYPES, { message: "Invalid tenant type." }))
      .min(1, { message: "At least one tenant type is required." })
      .transform((val) => Array.from(new Set(val))),
    isActive: z.boolean().optional().default(true),
    frontImage: imageSchema,
    galleryImages: z.array(imageSchema).optional().default([]),
    firstImage: imageSchema.optional(),
    secondImage: imageSchema.optional(),
    rent: z.number().min(0, { message: "Rent must be a non-negative number." }),
    rentFrequency: z.enum(RENT_FREQUENCIES, {
      message: "Rent frequency must be 'monthly' or 'yearly'.",
    }),
    amenities: z
      .array(objectIdSchema)
      .optional()
      .default([])
      .transform((val) => Array.from(new Set(val))),
    description: z
      .string()
      .trim()
      .min(1, { message: "Description is required." }),
    location: locationSchema,
    brochure: imageSchema.optional(),
    metadata: cityMetadataSchema.optional(),
  })
  .strict();

export const updateHostelSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    subtitle: z.string().trim().max(300).optional(),
    tenantType: z
      .array(z.enum(TENANT_TYPES))
      .min(1)
      .transform((val) => Array.from(new Set(val)))
      .optional(),
    isActive: z.boolean().optional(),
    frontImage: imageSchema.optional(),
    galleryImages: z.array(imageSchema).optional(),
    firstImage: imageSchema.optional().nullable(),
    secondImage: imageSchema.optional().nullable(),
    rent: z.number().min(0).optional(),
    rentFrequency: z.enum(RENT_FREQUENCIES).optional(),
    amenities: z
      .array(objectIdSchema)
      .transform((val) => Array.from(new Set(val)))
      .optional(),
    description: z.string().trim().min(1).optional(),
    location: updateLocationSchema.optional(),
    brochure: imageSchema.optional().nullable(),
    metadata: cityMetadataSchema.optional(),
  })
  .strict()
  .refine(
    (data) => Object.values(data).some((val) => val !== undefined),
    { message: "At least one field must be provided for update." }
  );

export const hostelQuerySchema = z.object({
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
  city: z.string().trim().optional(),
  locality: z.string().trim().optional(),
  tenantType: z.enum(TENANT_TYPES).optional(),
  amenity: z.string().trim().optional(),
  rentFrequency: z.enum(RENT_FREQUENCIES).optional(),
  minRent: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .pipe(z.number().min(0).optional()),
  maxRent: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .pipe(z.number().min(0).optional()),
  isActive: z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined || val === "") return undefined;
      if (val === "true") return true;
      if (val === "false") return false;
      return undefined;
    }),
  sortBy: z.enum(["rent", "title", "createdAt"]).optional(),
  sortOrderDir: z.enum(["asc", "desc"]).optional(),
});
