import { z } from "zod";
import { objectIdSchema } from "./admin.validation";
import { phoneSchema } from "./booked-visit.validation";

export { objectIdSchema, phoneSchema };

export const createEnquirySchema = z
  .object({
    type: z.enum(["query", "request"], {
      message: "Type must be either 'query' or 'request'.",
    }),
    name: z
      .string()
      .trim()
      .min(1, { message: "Name is required." })
      .max(100, { message: "Name cannot exceed 100 characters." }),
    number: phoneSchema,
    location: z.string().trim().max(100, "Location cannot exceed 100 characters.").optional(),
    iam: z.string().trim().max(100, "I am selection cannot exceed 100 characters.").optional(),
    message: z.string().trim().max(2000, "Message cannot exceed 2000 characters.").optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.type === "query") {
      if (!data.location || data.location.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Location is required for query enquiries.",
          path: ["location"],
        });
      }
      if (!data.iam || data.iam.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "I am selection is required for query enquiries.",
          path: ["iam"],
        });
      }
      if (!data.message || data.message.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Message is required for query enquiries.",
          path: ["message"],
        });
      }
    }
  });

export const updateEnquirySchema = z
  .object({
    type: z.enum(["query", "request"]).optional(),
    name: z.string().trim().min(1).max(100).optional(),
    number: phoneSchema.optional(),
    location: z.string().trim().max(100).nullable().optional(),
    iam: z.string().trim().max(100).nullable().optional(),
    message: z.string().trim().max(2000).nullable().optional(),
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
  type: z.enum(["query", "request"]).optional(),
  search: z.string().trim().optional(),
  sortBy: z.enum(["createdAt"]).optional(),
  sortOrderDir: z.enum(["asc", "desc"]).optional(),
});
