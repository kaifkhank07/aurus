import { IFileOption, PaginationMeta } from "./general.types";


export interface SafeOccupancy {
  id: string;
  name: string;
  image?: IFileOption;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOccupancyInput {
  name: string;
  image?: IFileOption;
  isActive?: boolean;
}

export interface UpdateOccupancyInput {
  name?: string;
  image?: IFileOption;
  isActive?: boolean;
}

export interface OccupancyQueryParams {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
  sortBy?: "name" | "createdAt";
  sortOrderDir?: "asc" | "desc";
}

export interface PaginatedOccupanciesResult {
  items: SafeOccupancy[];
  pagination: PaginationMeta;
}
