import { PaginationMeta } from "./general.types";

export interface SafeRentFrequency {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRentFrequencyInput {
  name: string;
  isActive?: boolean;
}

export interface UpdateRentFrequencyInput {
  name?: string;
  isActive?: boolean;
}

export interface RentFrequencyQueryParams {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
  sortBy?: "name" | "createdAt";
  sortOrderDir?: "asc" | "desc";
}

export interface PaginatedRentFrequenciesResult {
  items: SafeRentFrequency[];
  pagination: PaginationMeta;
}

