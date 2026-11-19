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
  email?: string | null;
  hostelCity: string;
  collegeName: string;
  wantToVisit: string;
  status: BookedVisitStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookedVisitInput {
  name: string;
  number: string;
  email?: string | null;
  hostelCity: string;
  collegeName: string;
  wantToVisit: string;
  status?: BookedVisitStatus;
}

export interface UpdateBookedVisitInput {
  name?: string;
  number?: string;
  email?: string | null;
  hostelCity?: string;
  collegeName?: string;
  wantToVisit?: string;
  status?: BookedVisitStatus;
}

export interface BookedVisitQueryParams {
  page: number;
  limit: number;
  search?: string;
  hostelCity?: string;
  status?: BookedVisitStatus | "all" | string;
  wantToVisit?: string;
  sortBy?: "createdAt" | "wantToVisit" | "name" | "status" | "hostelCity";
  sortOrderDir?: "asc" | "desc";
}

export interface PaginatedBookedVisitsResult {
  items: SafeBookedVisit[];
  pagination: PaginationMeta;
}
