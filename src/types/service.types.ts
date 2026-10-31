import { IFileOption, PaginationMeta } from "./general.types";

export interface SafeService {
  id: string;
  name: string;
  image?: IFileOption;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceInput {
  name: string;
  image?: IFileOption;
  isActive?: boolean;
}

export interface UpdateServiceInput {
  name?: string;
  image?: IFileOption | null;
  isActive?: boolean;
}

export interface ServiceQueryParams {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
  sortBy?: "name" | "createdAt";
  sortOrderDir?: "asc" | "desc";
}

export interface PaginatedServicesResult {
  items: SafeService[];
  pagination: PaginationMeta;
}
