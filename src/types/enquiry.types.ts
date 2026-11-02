import { PaginationMeta } from "./general.types";

export const ENQUIRY_STATUSES = ["new", "read", "complete"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const ENQUIRY_STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: "New",
  read: "Read",
  complete: "Complete",
};

export interface SafeEnquiry {
  id: string;
  name: string;
  number: string;
  location?: string | null;
  iam?: string | null;
  message?: string | null;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEnquiryInput {
  name: string;
  number: string;
  location: string;
  iam: string;
  message: string;
  status?: EnquiryStatus;
}

export interface UpdateEnquiryInput {
  name?: string;
  number?: string;
  location?: string;
  iam?: string;
  message?: string;
  status?: EnquiryStatus;
}

export interface EnquiryQueryParams {
  page: number;
  limit: number;
  search?: string;
  location?: string;
  status?: EnquiryStatus | "all" | string;
  sortBy?: "createdAt" | "name" | "status";
  sortOrderDir?: "asc" | "desc";
}

export interface PaginatedEnquiriesResult {
  items: SafeEnquiry[];
  pagination: PaginationMeta;
}
