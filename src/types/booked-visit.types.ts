import { PaginationMeta } from "./general.types";


export interface SafeBookedVisit {
  id: string;
  name: string;
  number: string;
  location: string;
  iam: string;
  preferredDate: string;
  preferredTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookedVisitInput {
  name: string;
  number: string;
  location: string;
  iam: string;
  preferredDate: string;
  preferredTime: string;
}

export interface UpdateBookedVisitInput {
  name?: string;
  number?: string;
  location?: string;
  iam?: string;
  preferredDate?: string;
  preferredTime?: string;
}

export interface BookedVisitQueryParams {
  page: number;
  limit: number;
  search?: string;
  location?: string;
  preferredDate?: string;
  sortBy?: "createdAt" | "preferredDate";
  sortOrderDir?: "asc" | "desc";
}

export interface PaginatedBookedVisitsResult {
  items: SafeBookedVisit[];
  pagination: PaginationMeta;
}
