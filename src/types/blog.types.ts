import { IFileOption, ISeoMetadata, PaginationMeta } from "./general.types";

/**
 * Standard Blog Categories:
 * - "city guides"
 * - "student life"
 * - "essential tips"
 * - "hostel guides"
 * - "lifestyle"
 * - "community"
 */
export const BLOG_CATEGORIES = [
  "city guides",
  "student life",
  "essential tips",
  "hostel guides",
  "lifestyle",
  "community",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const BLOG_CATEGORY_LABELS: Record<BlogCategory, string> = {
  "city guides": "City Guides",
  "student life": "Student Life",
  "essential tips": "Essential Tips",
  "hostel guides": "Hostel Guides",
  lifestyle: "Lifestyle",
  community: "Community",
};

/**
 * Normalizes user-provided category input, handling casing, hyphens, and whitespace.
 */
export function normalizeBlogCategory(raw: unknown): BlogCategory | null {
  if (!raw || typeof raw !== "string") return null;
  const clean = raw.trim().toLowerCase().replace(/[-_]+/g, " ");

  if ((BLOG_CATEGORIES as readonly string[]).includes(clean)) {
    return clean as BlogCategory;
  }
  return null;
}

export interface SafeBlog {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  image: IFileOption;
  category: BlogCategory;
  readDuration: number;
  isActive: boolean;
  description: string;
  metadata?: ISeoMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogInput {
  title: string;
  subtitle?: string;
  image: IFileOption;
  category: BlogCategory | string;
  readDuration?: number;
  isActive?: boolean;
  description: string;
  metadata?: ISeoMetadata;
}

export interface UpdateBlogInput {
  title?: string;
  subtitle?: string;
  image?: IFileOption;
  category?: BlogCategory | string;
  readDuration?: number;
  isActive?: boolean;
  description?: string;
  metadata?: ISeoMetadata;
}

export interface BlogQueryParams {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  isActive?: boolean;
  sortBy?: "createdAt" | "updatedAt" | "title" | "readDuration" | "category";
  sortOrderDir?: "asc" | "desc";
}

export interface PaginatedBlogsResult {
  items: SafeBlog[];
  pagination: PaginationMeta;
}

export interface PublicBlogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  slug?: string;
}

export interface PublicBlogsResult {
  items: SafeBlog[];
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  pagination?: PaginationMeta;
}
