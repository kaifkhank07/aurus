import { z } from "zod";
import { objectIdSchema } from "./admin.validation";

export { objectIdSchema };

export const phoneSchema = z
  .string()
  .trim()
  .min(7, { message: "Phone number must be at least 7 characters." })
  .max(20, { message: "Phone number cannot exceed 20 characters." })
  .regex(/^\+?[0-9\s\-()]{7,20}$/, {
    message: "Phone number contains invalid characters.",
  });

const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s*(AM|PM|am|pm)$|^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const visitTimeSchema = z
  .string()
  .trim()
  .min(1, { message: "Preferred time is required." })
  .max(30, { message: "Preferred time cannot exceed 30 characters." })
  .regex(timeRegex, {
    message: "Preferred time must be in a valid format (e.g., '10:30 AM' or '14:30').",
  });

export const visitDateSchema = z
  .string()
  .trim()
  .min(1, { message: "Preferred date is required." })
  .refine(
    (val) => {
      const timestamp = Date.parse(val);
      return !isNaN(timestamp);
    },
    { message: "Preferred date must be a valid date string (e.g., 'YYYY-MM-DD')." }
  );

export const createBookedVisitSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Name is required." })
      .max(100, { message: "Name cannot exceed 100 characters." }),
    number: phoneSchema,
    location: z
      .string()
      .trim()
      .min(1, { message: "Location is required." })
      .max(100, { message: "Location cannot exceed 100 characters." }),
    iam: z
      .string()
      .trim()
      .min(1, { message: "I am selection is required." })
      .max(100, { message: "I am selection cannot exceed 100 characters." }),
    preferredDate: visitDateSchema,
    preferredTime: visitTimeSchema,
  })
  .strict();

export const updateBookedVisitSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    number: phoneSchema.optional(),
    location: z.string().trim().min(1).max(100).optional(),
    iam: z.string().trim().min(1).max(100).optional(),
    preferredDate: visitDateSchema.optional(),
    preferredTime: visitTimeSchema.optional(),
  })
  .strict()
  .refine(
    (data) => Object.values(data).some((val) => val !== undefined),
    { message: "At least one field must be provided for update." }
  );

export const bookedVisitQuerySchema = z.object({
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
  location: z.string().trim().optional(),
  preferredDate: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "preferredDate"]).optional(),
  sortOrderDir: z.enum(["asc", "desc"]).optional(),
});
