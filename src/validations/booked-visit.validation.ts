import { z } from "zod";
import { objectIdSchema } from "./admin.validation";
import { BOOKED_VISIT_STATUSES } from "@/types/booked-visit.types";

export { objectIdSchema };

export const phoneSchema = z
  .string()
  .trim()
  .min(7, { message: "Phone number must be at least 7 characters." })
  .max(20, { message: "Phone number cannot exceed 20 characters." })
  .regex(/^\+?[0-9\s\-()]{7,20}$/, {
    message: "Phone number contains invalid characters.",
  });

export const optionalEmailSchema = z
  .string()
  .trim()
  .max(255, { message: "Email cannot exceed 255 characters." })
  .email({ message: "Please provide a valid email address." })
  .toLowerCase()
  .optional()
  .or(z.literal(""));

export const bookedVisitStatusSchema = z.enum(BOOKED_VISIT_STATUSES);

export const visitDateSchema = z
  .string()
  .trim()
  .min(1, { message: "Visit date is required." })
  .refine(
    (val) => {
      const timestamp = Date.parse(val);
      return !isNaN(timestamp);
    },
    { message: "Visit date must be a valid date string (e.g., 'YYYY-MM-DD')." }
  );

export const createBookedVisitSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Name is required." })
      .max(100, { message: "Name cannot exceed 100 characters." }),
    number: phoneSchema,
    email: optionalEmailSchema,
    hostelCity: z
      .string()
      .trim()
      .min(1, { message: "Hostel city is required." })
      .max(100, { message: "Hostel city cannot exceed 100 characters." }),
    collegeName: z
      .string()
      .trim()
      .min(1, { message: "College name is required." })
      .max(200, { message: "College name cannot exceed 200 characters." }),
    wantToVisit: visitDateSchema,
    status: bookedVisitStatusSchema.optional().default("new"),
  })
  .strict();

export const updateBookedVisitSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    number: phoneSchema.optional(),
    email: optionalEmailSchema,
    hostelCity: z.string().trim().min(1).max(100).optional(),
    collegeName: z
      .string()
      .trim()
      .min(1, { message: "College name cannot be empty." })
      .max(200, { message: "College name cannot exceed 200 characters." })
      .optional(),
    wantToVisit: visitDateSchema.optional(),
    status: bookedVisitStatusSchema.optional(),
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
  hostelCity: z.string().trim().optional(),
  status: z.enum(["new", "read", "complete", "all"]).optional(),
  wantToVisit: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "wantToVisit", "name", "status", "hostelCity"]).optional(),
  sortOrderDir: z.enum(["asc", "desc"]).optional(),
});
