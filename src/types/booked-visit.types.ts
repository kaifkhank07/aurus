import { PaginationMeta } from "./general.types";

export const BOOKED_VISIT_STATUSES = ["new", "read", "complete"] as const;
export type BookedVisitStatus = (typeof BOOKED_VISIT_STATUSES)[number];

export const BOOKED_VISIT_STATUS_LABELS: Record<BookedVisitStatus, string> = {
  new: "New",
  read: "Read",
  complete: "Complete",
};

export interface SafeBookedVisit {
  id: string;
  name: string;
  number: string;
  email: string;
  college: string;
  location: string;
  status: BookedVisitStatus;
  preferredDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookedVisitInput {
  name: string;
  number: string;
  email: string;
  college: string;
  location: string;
  preferredDate: string;
  status?: BookedVisitStatus;
}

export interface UpdateBookedVisitInput {
  name?: string;
  number?: string;
  email?: string;
  college?: string;
  location?: string;
  preferredDate?: string;
  status?: BookedVisitStatus;
}

export interface BookedVisitQueryParams {
  page: number;
  limit: number;
  search?: string;
  location?: string;
  status?: BookedVisitStatus | "all" | string;
  preferredDate?: string;
  sortBy?: "createdAt" | "preferredDate" | "name" | "status";
  sortOrderDir?: "asc" | "desc";
}

export interface PaginatedBookedVisitsResult {
  items: SafeBookedVisit[];
  pagination: PaginationMeta;
}
