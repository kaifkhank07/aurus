import { z } from "zod";
import { objectIdSchema } from "./admin.validation";
import { phoneSchema, optionalEmailSchema } from "./booked-visit.validation";
import { ENQUIRY_STATUSES, ENQUIRY_GENDERS } from "@/types/enquiry.types";

export { objectIdSchema, phoneSchema, optionalEmailSchema };

export const enquiryStatusSchema = z.enum(ENQUIRY_STATUSES);
export const enquiryGenderSchema = z.enum(ENQUIRY_GENDERS);

export const createEnquirySchema = z
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
    gender: enquiryGenderSchema,
    message: z
      .string()
      .trim()
      .max(2000, { message: "Message cannot exceed 2000 characters." })
      .optional()
      .or(z.literal("")),
    status: enquiryStatusSchema.optional().default("new"),
  })
  .strict();

export const updateEnquirySchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    number: phoneSchema.optional(),
    email: optionalEmailSchema,
    hostelCity: z.string().trim().min(1).max(100).optional(),
    gender: enquiryGenderSchema.optional(),
    message: z.string().trim().max(2000).optional().or(z.literal("")),
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
  gender: z.enum(["boys", "girls", "all"]).optional(),
  search: z.string().trim().optional(),
  hostelCity: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "name", "status", "hostelCity"]).optional(),
  sortOrderDir: z.enum(["asc", "desc"]).optional(),
});
