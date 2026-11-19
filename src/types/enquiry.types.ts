import { PaginationMeta } from "./general.types";

export const ENQUIRY_STATUSES = ["new", "read", "complete"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const ENQUIRY_STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: "New",
  read: "Read",
  complete: "Complete",
};

export const ENQUIRY_GENDERS = ["boys", "girls"] as const;
export type EnquiryGender = (typeof ENQUIRY_GENDERS)[number];

export const ENQUIRY_GENDER_LABELS: Record<EnquiryGender, string> = {
  boys: "Boys",
  girls: "Girls",
};

export interface SafeEnquiry {
  id: string;
  name: string;
  number: string;
  email?: string | null;
  hostelCity: string;
  gender: EnquiryGender;
  message?: string | null;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEnquiryInput {
  name: string;
  number: string;
  email?: string | null;
  hostelCity: string;
  gender: EnquiryGender;
  message?: string | null;
  status?: EnquiryStatus;
}

export interface UpdateEnquiryInput {
  name?: string;
  number?: string;
  email?: string | null;
  hostelCity?: string;
  gender?: EnquiryGender;
  message?: string | null;
  status?: EnquiryStatus;
}

export interface EnquiryQueryParams {
  page: number;
  limit: number;
  search?: string;
  hostelCity?: string;
  gender?: EnquiryGender | "all" | string;
  status?: EnquiryStatus | "all" | string;
  sortBy?: "createdAt" | "name" | "status" | "hostelCity";
  sortOrderDir?: "asc" | "desc";
}

export interface PaginatedEnquiriesResult {
  items: SafeEnquiry[];
  pagination: PaginationMeta;
}
