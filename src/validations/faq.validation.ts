import { z } from "zod";
import { objectIdSchema } from "./admin.validation";
import { FAQ_CATEGORIES, FaqCategory, normalizeFaqCategory } from "@/types/faq.types";

export { objectIdSchema };

/**
 * Category validator that normalizes variations and aliases to the standard canonical enum.
 */
export const faqCategorySchema = z
  .string()
  .trim()
  .min(1, { message: "Category is required." })
  .superRefine((val, ctx) => {
    const normalized = normalizeFaqCategory(val);
    if (!normalized) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid category: "${val}". Allowed categories are: ${FAQ_CATEGORIES.join(", ")}.`,
      });
    }
  })
  .transform((val) => normalizeFaqCategory(val) as FaqCategory);

/**
 * Sub-schema for an individual FAQ item when creating multiple items under one category.
 */
export const faqItemSchema = z
  .object({
    question: z
      .string()
      .trim()
      .min(3, { message: "Question must be at least 3 characters." })
      .max(500, { message: "Question cannot exceed 500 characters." }),
    answer: z
      .string()
      .trim()
      .min(3, { message: "Answer must be at least 3 characters." })
      .max(5000, { message: "Answer cannot exceed 5000 characters." }),
    sortOrder: z.number().int({ message: "Sort order must be an integer." }).optional().default(0),
    isActive: z.boolean().optional().default(true),
  })
  .strict();

/**
 * Schema for creating a single FAQ.
 */
export const createFaqSchema = z
  .object({
    question: z
      .string()
      .trim()
      .min(3, { message: "Question must be at least 3 characters." })
      .max(500, { message: "Question cannot exceed 500 characters." }),
    answer: z
      .string()
      .trim()
      .min(3, { message: "Answer must be at least 3 characters." })
      .max(5000, { message: "Answer cannot exceed 5000 characters." }),
    category: faqCategorySchema,
    sortOrder: z.number().int({ message: "Sort order must be an integer." }).optional().default(0),
    isActive: z.boolean().optional().default(true),
  })
  .strict();

/**
 * Schema for creating multiple FAQs for the same category at the same time:
 * {
 *   category: "booking",
 *   faqs: [
 *     { question: "Q1", answer: "A1" },
 *     { question: "Q2", answer: "A2" }
 *   ]
 * }
 */
export const createCategoryFaqsSchema = z
  .object({
    category: faqCategorySchema,
    faqs: z
      .array(faqItemSchema)
      .min(1, { message: "At least one FAQ item is required in the 'faqs' array." }),
  })
  .strict();

/**
 * Single item in a multiple/bulk update request.
 */
export const bulkUpdateFaqItemSchema = z
  .object({
    id: objectIdSchema,
    question: z
      .string()
      .trim()
      .min(3, { message: "Question must be at least 3 characters." })
      .max(500, { message: "Question cannot exceed 500 characters." })
      .optional(),
    answer: z
      .string()
      .trim()
      .min(3, { message: "Answer must be at least 3 characters." })
      .max(5000, { message: "Answer cannot exceed 5000 characters." })
      .optional(),
    category: faqCategorySchema.optional(),
    sortOrder: z.number().int({ message: "Sort order must be an integer." }).optional(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine(
    (data) =>
      data.question !== undefined ||
      data.answer !== undefined ||
      data.category !== undefined ||
      data.sortOrder !== undefined ||
      data.isActive !== undefined,
    { message: "At least one field to update must be provided alongside 'id'." }
  );

/**
 * Bulk update schema accepting either { faqs: [...] } or direct array [...]
 */
export const bulkUpdateFaqsSchema = z.union([
  z
    .object({
      faqs: z
        .array(bulkUpdateFaqItemSchema)
        .min(1, { message: "At least one FAQ update item is required." }),
    })
    .strict()
    .transform((val) => val.faqs),
  z
    .array(bulkUpdateFaqItemSchema)
    .min(1, { message: "At least one FAQ update item is required." }),
]);

/**
 * Bulk delete schema accepting { ids: [...] } or direct array of IDs
 */
export const bulkDeleteFaqsSchema = z.union([
  z
    .object({
      ids: z
        .array(objectIdSchema)
        .min(1, { message: "At least one FAQ ID is required." }),
    })
    .strict()
    .transform((val) => val.ids),
  z.array(objectIdSchema).min(1, { message: "At least one FAQ ID is required." }),
]);

/**
 * Schema for updating a single FAQ by ID.
 */
export const updateFaqSchema = z
  .object({
    question: z
      .string()
      .trim()
      .min(3, { message: "Question must be at least 3 characters." })
      .max(500, { message: "Question cannot exceed 500 characters." })
      .optional(),
    answer: z
      .string()
      .trim()
      .min(3, { message: "Answer must be at least 3 characters." })
      .max(5000, { message: "Answer cannot exceed 5000 characters." })
      .optional(),
    category: faqCategorySchema.optional(),
    sortOrder: z.number().int({ message: "Sort order must be an integer." }).optional(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine(
    (data) => Object.values(data).some((val) => val !== undefined),
    { message: "At least one field must be provided for update." }
  );

/**
 * Query schema for filtering, pagination, and sorting FAQs.
 */
export const faqQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().int().min(1, "Page must be greater than or equal to 1.")),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .pipe(
      z
        .number()
        .int()
        .min(1, "Limit must be at least 1.")
        .max(200, "Limit cannot exceed 200 items per page.")
    ),
  search: z.string().trim().optional(),
  category: z
    .string()
    .trim()
    .optional()
    .transform((val) => (val ? normalizeFaqCategory(val) || val : undefined)),
  isActive: z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined || val === "") return undefined;
      if (val === "true") return true;
      if (val === "false") return false;
      return undefined;
    }),
  sortBy: z.enum(["sortOrder", "createdAt", "question", "category"]).optional(),
  sortOrderDir: z.enum(["asc", "desc"]).optional(),
});

