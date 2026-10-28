import { PaginationMeta } from "./general.types";

/**
 * Standard FAQ Categories as requested:
 * - general
 * - booking
 * - payment and pricing
 * - safety
 * - living in aurus
 * - move-in and move-out
 */
export const FAQ_CATEGORIES = [
  "general",
  "booking",
  "payment and pricing",
  "safety",
  "living in aurus",
  "move-in and move-out",
] as const;

export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

export const FAQ_CATEGORY_LABELS: Record<FaqCategory, string> = {
  general: "General",
  booking: "Booking",
  "payment and pricing": "Payment & Pricing",
  safety: "Safety",
  "living in aurus": "Living in Aurus",
  "move-in and move-out": "Move-In & Move-Out",
};

/**
 * Normalizes user-provided category input, handling common aliases and variations.
 */
export function normalizeFaqCategory(raw: string): FaqCategory | null {
  if (!raw || typeof raw !== "string") return null;
  const clean = raw.trim().toLowerCase();

  // Direct canonical match
  if ((FAQ_CATEGORIES as readonly string[]).includes(clean)) {
    return clean as FaqCategory;
  }

  // Alias mappings
  switch (clean) {
    case "safty":
      return "safety";
    case "lining in aurus":
    case "living in aurus":
    case "living-in-aurus":
    case "living-at-aurus":
    case "living at aurus":
      return "living in aurus";
    case "payment-and-pricing":
    case "pricing and payments":
    case "pricing-payments":
    case "pricing & payments":
    case "pricing":
    case "payment":
    case "payments":
      return "payment and pricing";
    case "move-in-and-move-out":
    case "move in and move out":
    case "move-in-out":
    case "move in out":
      return "move-in and move-out";
    case "general":
    case "general query":
      return "general";
    case "booking":
    case "bookings":
      return "booking";
    default:
      return null;
  }
}

export interface SafeFaq {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Single FAQ creation input
 */
export interface CreateFaqInput {
  question: string;
  answer: string;
  category: FaqCategory | string;
  sortOrder?: number;
  isActive?: boolean;
}

/**
 * Sub-item for creating multiple FAQs under the same category
 */
export interface FaqItemInput {
  question: string;
  answer: string;
  sortOrder?: number;
  isActive?: boolean;
}

/**
 * Input for creating multiple FAQs for the same category at the same time
 */
export interface CreateMultipleFaqsForCategoryInput {
  category: FaqCategory | string;
  faqs: FaqItemInput[];
}

/**
 * Unified bulk / single create payload
 */
export type CreateFaqPayload =
  | CreateFaqInput
  | CreateMultipleFaqsForCategoryInput
  | CreateFaqInput[];

/**
 * Single FAQ update input
 */
export interface UpdateFaqInput {
  question?: string;
  answer?: string;
  category?: FaqCategory | string;
  sortOrder?: number;
  isActive?: boolean;
}

/**
 * Item in a multiple/bulk FAQ update request
 */
export interface BulkUpdateFaqItem {
  id: string;
  question?: string;
  answer?: string;
  category?: FaqCategory | string;
  sortOrder?: number;
  isActive?: boolean;
}

/**
 * Payload for multiple/bulk update
 */
export interface BulkUpdateFaqsInput {
  faqs: BulkUpdateFaqItem[];
}

export interface BulkDeleteFaqsInput {
  ids: string[];
}

export interface FaqQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isActive?: boolean;
  sortBy?: "sortOrder" | "createdAt" | "question" | "category";
  sortOrderDir?: "asc" | "desc";
}

export interface PaginatedFaqsResult {
  items: SafeFaq[];
  pagination: PaginationMeta;
}

export interface GroupedFaqCategory {
  category: FaqCategory;
  categoryLabel: string;
  items: SafeFaq[];
}

