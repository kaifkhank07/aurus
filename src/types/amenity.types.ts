import { IFileOption, PaginationMeta } from "./general.types";


export interface SafeAmenity {
  id: string;
  name: string;
  image?: IFileOption;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAmenityInput {
  name: string;
  image?: IFileOption;
  isActive?: boolean;
}

export interface UpdateAmenityInput {
  name?: string;
  image?: IFileOption | null;
  isActive?: boolean;
}

export interface AmenityQueryParams {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
  sortBy?: "name" | "createdAt";
  sortOrderDir?: "asc" | "desc";
}

export interface PaginatedAmenitiesResult {
  items: SafeAmenity[];
  pagination: PaginationMeta;
}
