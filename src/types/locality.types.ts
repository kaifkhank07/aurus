import { PaginationMeta } from "./general.types";
import { SafeCity } from "./city.types";


export interface SafeLocality {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  city: string | SafeCity;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLocalityInput {
  name: string;
  city: string;
  isActive?: boolean;
}

export interface UpdateLocalityInput {
  name?: string;
  city?: string;
  isActive?: boolean;
}

export interface LocalityQueryParams {
  page: number;
  limit: number;
  search?: string;
  city?: string;
  isActive?: boolean;
  sortBy?: "name" | "createdAt";
  sortOrderDir?: "asc" | "desc";
}

export interface PaginatedLocalitiesResult {
  items: SafeLocality[];
  pagination: PaginationMeta;
}
