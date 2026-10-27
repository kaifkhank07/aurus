import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const objectIdSchema = z
  .string()
  .trim()
  .regex(objectIdRegex, { message: "Invalid ID format: must be a 24-character hexadecimal ObjectId." });

export const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email({ message: "Please provide a valid email address." }),
    password: z
      .string()
      .min(1, { message: "Password is required." })
      .max(100, { message: "Password cannot exceed 100 characters." }),
  })
  .strict();

export const createAdminSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: "Name must be at least 2 characters." })
      .max(100, { message: "Name cannot exceed 100 characters." }),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email({ message: "Please provide a valid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .max(100, { message: "Password cannot exceed 100 characters." }),
    status: z.enum(["active", "inactive"]).default("active"),
  })
  .strict();

export const updateAdminSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: "Name must be at least 2 characters." })
      .max(100, { message: "Name cannot exceed 100 characters." })
      .optional(),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email({ message: "Please provide a valid email address." })
      .optional(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .max(100, { message: "Password cannot exceed 100 characters." })
      .optional(),
    status: z.enum(["active", "inactive"]).optional(),
  })
  .strict()
  .refine(
    (data) => {
      return Object.values(data).some((val) => val !== undefined);
    },
    { message: "At least one permitted field must be provided for update." }
  );

export const adminQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().int().min(1, { message: "Page must be greater than or equal to 1." })),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .pipe(
      z
        .number()
        .int()
        .min(1, { message: "Limit must be at least 1." })
        .max(100, { message: "Limit cannot exceed 100 items per page." })
    ),
  search: z.string().trim().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});
