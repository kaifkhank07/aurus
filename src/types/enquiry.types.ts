import { PaginationMeta } from "./general.types";


export type EnquiryType = "query" | "request";

export interface SafeEnquiry {
  id: string;
  type: EnquiryType;
  name: string;
  number: string;
  location?: string | null;
  iam?: string | null;
  message?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEnquiryInput {
  type: EnquiryType;
  name: string;
  number: string;
  location?: string;
  iam?: string;
  message?: string;
}

export interface UpdateEnquiryInput {
  type?: EnquiryType;
  name?: string;
  number?: string;
  location?: string | null;
  iam?: string | null;
  message?: string | null;
}

export interface EnquiryQueryParams {
  page: number;
  limit: number;
  type?: EnquiryType;
  search?: string;
  sortBy?: "createdAt";
  sortOrderDir?: "asc" | "desc";
}

export interface PaginatedEnquiriesResult {
  items: SafeEnquiry[];
  pagination: PaginationMeta;
}
