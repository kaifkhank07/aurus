import { z } from "zod";
import { objectIdSchema } from "./admin.validation";
import { cityImageSchema as imageSchema } from "./city.validation";

export { objectIdSchema };

export const createStorySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Name is required." })
      .max(100, { message: "Name cannot exceed 100 characters." }),
    profession: z
      .string()
      .trim()
      .min(1, { message: "Profession is required." })
      .max(100, { message: "Profession cannot exceed 100 characters." }),
    rating: z
      .number({ message: "Rating is required and must be a number." })
      .min(1, { message: "Rating must be at least 1." })
      .max(5, { message: "Rating cannot exceed 5." }),
    location: z
      .string()
      .trim()
      .min(1, { message: "Location is required." })
      .max(100, { message: "Location cannot exceed 100 characters." }),
    description: z
      .string()
      .trim()
      .min(1, { message: "Description is required." })
      .max(2000, { message: "Description cannot exceed 2000 characters." }),
    isActive: z.boolean().optional().default(true),
    isFeatured: z.boolean().optional().default(false),
    image: imageSchema.nullable().optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.isFeatured && (!data.image || !data.image.publickey)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "An image is required for featured stories.",
        path: ["image"],
      });
    }
  });

export const updateStorySchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    profession: z.string().trim().min(1).max(100).optional(),
    rating: z.number().min(1).max(5).optional(),
    location: z.string().trim().min(1).max(100).optional(),
    description: z.string().trim().min(1).max(2000).optional(),
    isActive: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    image: imageSchema.nullable().optional(),
  })
  .strict()
  .refine(
    (data) => Object.values(data).some((val) => val !== undefined),
    { message: "At least one field must be provided for update." }
  );

export const storyQuerySchema = z.object({
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
  isActive: z
    .string()
    .optional()
    .transform((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return undefined;
    }),
  isFeatured: z
    .string()
    .optional()
    .transform((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return undefined;
    }),
  sortBy: z.enum(["createdAt", "updatedAt", "rating", "name"]).optional(),
  sortOrderDir: z.enum(["asc", "desc"]).optional(),
});
