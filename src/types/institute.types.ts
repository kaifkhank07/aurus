import { PaginationMeta } from "./general.types";
import { SafeCity } from "./city.types";


export interface SafeInstitute {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  city: string | SafeCity;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInstituteInput {
  name: string;
  city: string;
  isActive?: boolean;
}

export interface UpdateInstituteInput {
  name?: string;
  city?: string;
  isActive?: boolean;
}

export interface InstituteQueryParams {
  page: number;
  limit: number;
  search?: string;
  city?: string;
  isActive?: boolean;
  sortBy?: "name" | "createdAt";
  sortOrderDir?: "asc" | "desc";
}

export interface PaginatedInstitutesResult {
  items: SafeInstitute[];
  pagination: PaginationMeta;
}
