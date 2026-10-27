import { IFileOption, ISeoMetadata, PaginationMeta } from "./general.types";


export interface SafeBlog {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  image: IFileOption;
  tags: string[];
  description: string;
  metadata?: ISeoMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogInput {
  title: string;
  subtitle?: string;
  image: IFileOption;
  tags?: string[];
  description: string;
  metadata?: ISeoMetadata;
}

export interface UpdateBlogInput {
  title?: string;
  subtitle?: string;
  image?: IFileOption;
  tags?: string[];
  description?: string;
  metadata?: ISeoMetadata;
}

export interface BlogQueryParams {
  page: number;
  limit: number;
  search?: string;
  tag?: string;
  sortBy?: "createdAt" | "updatedAt" | "title";
  sortOrderDir?: "asc" | "desc";
}

export interface PaginatedBlogsResult {
  items: SafeBlog[];
  pagination: PaginationMeta;
}
