import { IFileOption, PaginationMeta } from "./general.types";


export interface SafeStory {
  id: string;
  name: string;
  profession: string;
  rating: number;
  location: string;
  description: string;
  isActive: boolean;
  isFeatured: boolean;
  image?: IFileOption | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStoryInput {
  name: string;
  profession: string;
  rating: number;
  location: string;
  description: string;
  isActive?: boolean;
  isFeatured?: boolean;
  image?: IFileOption;
}

export interface UpdateStoryInput {
  name?: string;
  profession?: string;
  rating?: number;
  location?: string;
  description?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  image?: IFileOption | null;
}

export interface StoryQueryParams {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  sortBy?: "createdAt" | "updatedAt" | "rating" | "name";
  sortOrderDir?: "asc" | "desc";
}

export interface PaginatedStoriesResult {
  items: SafeStory[];
  pagination: PaginationMeta;
}
