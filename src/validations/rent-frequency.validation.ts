import { z } from "zod";
import { objectIdSchema } from "./admin.validation";

export { objectIdSchema };

export const createRentFrequencySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Rent frequency name is required." })
      .max(100, { message: "Rent frequency name cannot exceed 100 characters." }),
    isActive: z.boolean().optional().default(true),
  })
  .strict();

export const updateRentFrequencySchema = z
  .object({
    name: z.string().trim().min(1, "Rent frequency name cannot be empty.").max(100).optional(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine(
    (data) => Object.values(data).some((val) => val !== undefined),
    { message: "At least one field must be provided for update." }
  );

export const rentFrequencyQuerySchema = z.object({
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
      if (val === undefined || val === "") return undefined;
      if (val === "true") return true;
      if (val === "false") return false;
      return undefined;
    }),
  sortBy: z.enum(["name", "createdAt"]).optional(),
  sortOrderDir: z.enum(["asc", "desc"]).optional(),
});
