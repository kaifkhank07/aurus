import { z } from "zod";
import { objectIdSchema } from "./admin.validation";
import { phoneSchema } from "./booked-visit.validation";
import { ENQUIRY_STATUSES } from "@/types/enquiry.types";

export { objectIdSchema, phoneSchema };

export const enquiryStatusSchema = z.enum(ENQUIRY_STATUSES);

export const createEnquirySchema = z
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
      .min(1, { message: "Profile / I am selection is required." })
      .max(100, { message: "I am selection cannot exceed 100 characters." }),
    message: z
      .string()
      .trim()
      .min(1, { message: "Message is required." })
      .max(2000, { message: "Message cannot exceed 2000 characters." }),
    status: enquiryStatusSchema.optional().default("new"),
  })
  .strict();

export const updateEnquirySchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    number: phoneSchema.optional(),
    location: z.string().trim().min(1).max(100).optional(),
    iam: z.string().trim().min(1).max(100).optional(),
    message: z.string().trim().min(1).max(2000).optional(),
    status: enquiryStatusSchema.optional(),
  })
  .strict()
  .refine(
    (data) => Object.values(data).some((val) => val !== undefined),
    { message: "At least one field must be provided for update." }
  );

export const enquiryQuerySchema = z.object({
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
  status: z.enum(["new", "read", "complete", "all"]).optional(),
  search: z.string().trim().optional(),
  location: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "name", "status"]).optional(),
  sortOrderDir: z.enum(["asc", "desc"]).optional(),
});
