import { create } from "zustand";
import axios from "axios";
import { adminApiClient } from "@/lib/admin-api";
import { publicApiClient } from "@/lib/public-api";
import { ApiResponse, PaginationMeta } from "@/types/general.types";
import {
  SafeHostel,
  CreateHostelInput,
  UpdateHostelInput,
  HostelQueryParams,
  PaginatedHostelsResult,
  PublicHostelQueryParams,
  PublicHostelsResult,
} from "@/types/hostel.types";
import {
  SafeBookedVisit,
  CreateBookedVisitInput,
  UpdateBookedVisitInput,
  BookedVisitQueryParams,
  PaginatedBookedVisitsResult,
} from "@/types/booked-visit.types";
import {
  SafeEnquiry,
  CreateEnquiryInput,
  UpdateEnquiryInput,
  EnquiryQueryParams,
  PaginatedEnquiriesResult,
} from "@/types/enquiry.types";

/**
 * Standardized error extractor across all hostel and enquiry operations.
 */
function extractErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error) && error.response?.data) {
    const data = error.response.data as { message?: string; errors?: unknown };
    if (data.message) {
      if (data.errors && typeof data.errors === "object") {
        if (Array.isArray(data.errors)) {
          const list = data.errors
            .map((e) => (typeof e === "string" ? e : e?.message || JSON.stringify(e)))
            .filter(Boolean);
          if (list.length > 0) return `${data.message} (${list.join(", ")})`;
        } else {
          const entries = Object.entries(data.errors as Record<string, string>);
          if (entries.length > 0) {
            const list = entries.map(([field, msg]) => `${field}: ${msg}`);
            return `${data.message} (${list.join("; ")})`;
          }
        }
      }
      return data.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

export interface HostelAndEnquiryState {
  // ── Hostel Module State ──
  hostels: SafeHostel[];
  hostelsPagination: PaginationMeta | null;
  isLoadingHostels: boolean;
  hostelsError: string | null;

  // ── Public Hostel / Residence Module State ──
  publicHostels: SafeHostel[];
  publicHostelsPagination: PaginationMeta | null;
  isLoadingPublicHostels: boolean;
  publicHostelsError: string | null;

  // ── Booked Visit Module State ──
  bookedVisits: SafeBookedVisit[];
  bookedVisitsPagination: PaginationMeta | null;
  isLoadingBookedVisits: boolean;
  bookedVisitsError: string | null;

  // ── Enquiry Module State ──
  enquiries: SafeEnquiry[];
  enquiriesPagination: PaginationMeta | null;
  isLoadingEnquiries: boolean;
  enquiriesError: string | null;

  // ── Global Mutation State ──
  isMutating: boolean;
  error: string | null;

  // ── General Actions ──
  clearErrors: () => void;

  // ── Hostel Actions ──
  fetchHostels: (
    params?: Partial<HostelQueryParams>,
    force?: boolean
  ) => Promise<{ success: boolean; data?: PaginatedHostelsResult; message?: string }>;
  getHostelById: (
    id: string
  ) => Promise<{ success: boolean; data?: SafeHostel; message?: string }>;
  createHostel: (
    input: CreateHostelInput | FormData
  ) => Promise<{ success: boolean; data?: SafeHostel; message?: string }>;
  updateHostel: (
    id: string,
    input: UpdateHostelInput | FormData
  ) => Promise<{ success: boolean; data?: SafeHostel; message?: string }>;
  deleteHostel: (
    id: string
  ) => Promise<{ success: boolean; message?: string }>;

  // ── Public Hostel Actions ──
  fetchPublicHostels: (
    params?: Partial<PublicHostelQueryParams>,
    force?: boolean
  ) => Promise<{ success: boolean; data?: PublicHostelsResult; message?: string }>;

  // ── Booked Visit Actions ──
  fetchBookedVisits: (
    params?: Partial<BookedVisitQueryParams>,
    force?: boolean
  ) => Promise<{ success: boolean; data?: PaginatedBookedVisitsResult; message?: string }>;
  getBookedVisitById: (
    id: string
  ) => Promise<{ success: boolean; data?: SafeBookedVisit; message?: string }>;
  createBookedVisit: (
    input: CreateBookedVisitInput | FormData
  ) => Promise<{ success: boolean; data?: SafeBookedVisit; message?: string }>;
  updateBookedVisit: (
    id: string,
    input: UpdateBookedVisitInput | FormData
  ) => Promise<{ success: boolean; data?: SafeBookedVisit; message?: string }>;
  deleteBookedVisit: (
    id: string
  ) => Promise<{ success: boolean; message?: string }>;

  // ── Enquiry Actions ──
  fetchEnquiries: (
    params?: Partial<EnquiryQueryParams>,
    force?: boolean
  ) => Promise<{ success: boolean; data?: PaginatedEnquiriesResult; message?: string }>;
  getEnquiryById: (
    id: string
  ) => Promise<{ success: boolean; data?: SafeEnquiry; message?: string }>;
  createEnquiry: (
    input: CreateEnquiryInput | FormData
  ) => Promise<{ success: boolean; data?: SafeEnquiry; message?: string }>;
  updateEnquiry: (
    id: string,
    input: UpdateEnquiryInput | FormData
  ) => Promise<{ success: boolean; data?: SafeEnquiry; message?: string }>;
  deleteEnquiry: (
    id: string
  ) => Promise<{ success: boolean; message?: string }>;
}

// In-flight request caching to prevent duplicate API calls
const inFlightRequests = new Map<string, Promise<unknown>>();

function getInFlight<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = inFlightRequests.get(key);
  if (existing) {
    return existing as Promise<T>;
  }
  const promise = fn().finally(() => {
    inFlightRequests.delete(key);
  });
  inFlightRequests.set(key, promise);
  return promise;
}

export const useHostelAndEnquiryStore = create<HostelAndEnquiryState>((set, get) => ({
  // Initial States
  hostels: [],
  hostelsPagination: null,
  isLoadingHostels: false,
  hostelsError: null,

  publicHostels: [],
  publicHostelsPagination: null,
  isLoadingPublicHostels: false,
  publicHostelsError: null,

  bookedVisits: [],
  bookedVisitsPagination: null,
  isLoadingBookedVisits: false,
  bookedVisitsError: null,

  enquiries: [],
  enquiriesPagination: null,
  isLoadingEnquiries: false,
  enquiriesError: null,

  isMutating: false,
  error: null,

  clearErrors: () =>
    set({
      error: null,
      hostelsError: null,
      publicHostelsError: null,
      bookedVisitsError: null,
      enquiriesError: null,
    }),

  // =========================================================================
  // 1. Hostel Module
  // =========================================================================
  fetchHostels: async (params = {}, force = false) => {
    const key = `hostels_${JSON.stringify(params)}`;
    if (!force && inFlightRequests.has(key)) {
      return inFlightRequests.get(key) as Promise<{
        success: boolean;
        data?: PaginatedHostelsResult;
        message?: string;
      }>;
    }

    set({ isLoadingHostels: true, hostelsError: null });

    return getInFlight(key, async () => {
      try {
        const res = await adminApiClient.get<ApiResponse<PaginatedHostelsResult>>("/hostels", {
          params,
        });

        if (res.data.success && res.data.data) {
          set({
            hostels: res.data.data.items || [],
            hostelsPagination: res.data.data.pagination || null,
            isLoadingHostels: false,
            hostelsError: null,
          });
          return { success: true, data: res.data.data, message: res.data.message };
        }

        const msg = res.data.message || "Failed to load hostels.";
        set({ isLoadingHostels: false, hostelsError: msg });
        return { success: false, message: msg };
      } catch (err) {
        const msg = extractErrorMessage(err, "Failed to load hostels from server.");
        set({ isLoadingHostels: false, hostelsError: msg });
        return { success: false, message: msg };
      }
    });
  },

  fetchPublicHostels: async (params = {}, force = false) => {
    const key = `public_hostels_${JSON.stringify(params)}`;
    if (!force && inFlightRequests.has(key)) {
      return inFlightRequests.get(key) as Promise<{
        success: boolean;
        data?: PublicHostelsResult;
        message?: string;
      }>;
    }

    set({ isLoadingPublicHostels: true, publicHostelsError: null });

    return getInFlight(key, async () => {
      try {
        const res = await publicApiClient.get<
          ApiResponse<{
            items: SafeHostel[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
          }>
        >("/api/residences", { params });

        if (res.data.success && res.data.data) {
          const rawData = res.data.data;
          // Normalize items so both id and _id are available
          const items = (rawData.items || []).map((item: any) => ({
            ...item,
            id: item.id || (item._id ? String(item._id) : ""),
            _id: item._id ? String(item._id) : item.id,
          }));

          const pagination: PaginationMeta = {
            total: rawData.total ?? items.length,
            page: rawData.page ?? 1,
            limit: rawData.limit ?? (items.length || 20),
            totalPages: rawData.totalPages ?? 1,
            hasNextPage: (rawData.page ?? 1) < (rawData.totalPages ?? 1),
            hasPrevPage: (rawData.page ?? 1) > 1,
          };

          set({
            publicHostels: items,
            publicHostelsPagination: pagination,
            isLoadingPublicHostels: false,
            publicHostelsError: null,
          });

          return {
            success: true,
            data: {
              ...rawData,
              items,
              pagination,
            },
            message: res.data.message,
          };
        }

        const msg = res.data.message || "Failed to load public residences.";
        set({ isLoadingPublicHostels: false, publicHostelsError: msg });
        return { success: false, message: msg };
      } catch (err) {
        const msg = extractErrorMessage(err, "Failed to load public residences from server.");
        set({ isLoadingPublicHostels: false, publicHostelsError: msg });
        return { success: false, message: msg };
      }
    });
  },

  getHostelById: async (id: string) => {
    try {
      const res = await adminApiClient.get<ApiResponse<{ hostel: SafeHostel }>>(`/hostels/${id}`);
      if (res.data.success && res.data.data?.hostel) {
        return { success: true, data: res.data.data.hostel, message: res.data.message };
      }
      return { success: false, message: res.data.message || "Hostel not found." };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to fetch hostel details.");
      return { success: false, message: msg };
    }
  },

  createHostel: async (input) => {
    set({ isMutating: true, error: null, hostelsError: null });
    try {
      const res = await adminApiClient.post<ApiResponse<{ hostel: SafeHostel }>>(
        "/hostels",
        input
      );

      if (res.data.success && res.data.data?.hostel) {
        const created = res.data.data.hostel;
        set((state) => ({
          hostels: [created, ...state.hostels],
          hostelsPagination: state.hostelsPagination
            ? {
              ...state.hostelsPagination,
              total: state.hostelsPagination.total + 1,
            }
            : null,
          isMutating: false,
          error: null,
        }));
        return { success: true, data: created, message: res.data.message };
      }

      const msg = res.data.message || "Failed to create hostel.";
      set({ isMutating: false, error: msg, hostelsError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to create hostel record.");
      set({ isMutating: false, error: msg, hostelsError: msg });
      return { success: false, message: msg };
    }
  },

  updateHostel: async (id, input) => {
    set({ isMutating: true, error: null, hostelsError: null });
    try {
      const res = await adminApiClient.patch<ApiResponse<{ hostel: SafeHostel }>>(
        `/hostels/${id}`,
        input
      );

      if (res.data.success && res.data.data?.hostel) {
        const updated = res.data.data.hostel;
        set((state) => ({
          hostels: state.hostels.map((h) => (h.id === id ? updated : h)),
          isMutating: false,
          error: null,
        }));
        return { success: true, data: updated, message: res.data.message };
      }

      const msg = res.data.message || "Failed to update hostel.";
      set({ isMutating: false, error: msg, hostelsError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to update hostel record.");
      set({ isMutating: false, error: msg, hostelsError: msg });
      return { success: false, message: msg };
    }
  },

  deleteHostel: async (id: string) => {
    set({ isMutating: true, error: null, hostelsError: null });
    try {
      const res = await adminApiClient.delete<ApiResponse<{ message: string; id: string }>>(
        `/hostels/${id}`
      );

      if (res.data.success) {
        set((state) => ({
          hostels: state.hostels.filter((h) => h.id !== id),
          hostelsPagination: state.hostelsPagination
            ? {
              ...state.hostelsPagination,
              total: Math.max(0, state.hostelsPagination.total - 1),
            }
            : null,
          isMutating: false,
          error: null,
        }));
        return { success: true, message: res.data.message || "Hostel deleted successfully." };
      }

      const msg = res.data.message || "Failed to delete hostel.";
      set({ isMutating: false, error: msg, hostelsError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to delete hostel record.");
      set({ isMutating: false, error: msg, hostelsError: msg });
      return { success: false, message: msg };
    }
  },

  // =========================================================================
  // 2. Booked Visit Module
  // =========================================================================
  fetchBookedVisits: async (params = {}, force = false) => {
    const key = `booked_visits_${JSON.stringify(params)}`;
    if (!force && inFlightRequests.has(key)) {
      return inFlightRequests.get(key) as Promise<{
        success: boolean;
        data?: PaginatedBookedVisitsResult;
        message?: string;
      }>;
    }

    set({ isLoadingBookedVisits: true, bookedVisitsError: null });

    return getInFlight(key, async () => {
      try {
        const res = await adminApiClient.get<ApiResponse<PaginatedBookedVisitsResult>>(
          "/booked-visits",
          { params }
        );

        if (res.data.success && res.data.data) {
          set({
            bookedVisits: res.data.data.items || [],
            bookedVisitsPagination: res.data.data.pagination || null,
            isLoadingBookedVisits: false,
            bookedVisitsError: null,
          });
          return { success: true, data: res.data.data, message: res.data.message };
        }

        const msg = res.data.message || "Failed to load booked visits.";
        set({ isLoadingBookedVisits: false, bookedVisitsError: msg });
        return { success: false, message: msg };
      } catch (err) {
        const msg = extractErrorMessage(err, "Failed to load booked visits from server.");
        set({ isLoadingBookedVisits: false, bookedVisitsError: msg });
        return { success: false, message: msg };
      }
    });
  },

  getBookedVisitById: async (id: string) => {
    try {
      const res = await adminApiClient.get<ApiResponse<{ bookedVisit: SafeBookedVisit }>>(
        `/booked-visits/${id}`
      );
      if (res.data.success && res.data.data?.bookedVisit) {
        return { success: true, data: res.data.data.bookedVisit, message: res.data.message };
      }
      return { success: false, message: res.data.message || "Booked visit not found." };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to fetch booked visit details.");
      return { success: false, message: msg };
    }
  },

  createBookedVisit: async (input) => {
    set({ isMutating: true, error: null, bookedVisitsError: null });
    try {
      const res = await adminApiClient.post<ApiResponse<{ bookedVisit: SafeBookedVisit }>>(
        "/booked-visits",
        input
      );

      if (res.data.success && res.data.data?.bookedVisit) {
        const created = res.data.data.bookedVisit;
        set((state) => ({
          bookedVisits: [created, ...state.bookedVisits],
          bookedVisitsPagination: state.bookedVisitsPagination
            ? {
              ...state.bookedVisitsPagination,
              total: state.bookedVisitsPagination.total + 1,
            }
            : null,
          isMutating: false,
          error: null,
        }));
        return { success: true, data: created, message: res.data.message };
      }

      const msg = res.data.message || "Failed to create booked visit.";
      set({ isMutating: false, error: msg, bookedVisitsError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to create booked visit record.");
      set({ isMutating: false, error: msg, bookedVisitsError: msg });
      return { success: false, message: msg };
    }
  },

  updateBookedVisit: async (id, input) => {
    set({ isMutating: true, error: null, bookedVisitsError: null });
    try {
      const res = await adminApiClient.patch<ApiResponse<{ bookedVisit: SafeBookedVisit }>>(
        `/booked-visits/${id}`,
        input
      );

      if (res.data.success && res.data.data?.bookedVisit) {
        const updated = res.data.data.bookedVisit;
        set((state) => ({
          bookedVisits: state.bookedVisits.map((v) => (v.id === id ? updated : v)),
          isMutating: false,
          error: null,
        }));
        return { success: true, data: updated, message: res.data.message };
      }

      const msg = res.data.message || "Failed to update booked visit.";
      set({ isMutating: false, error: msg, bookedVisitsError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to update booked visit record.");
      set({ isMutating: false, error: msg, bookedVisitsError: msg });
      return { success: false, message: msg };
    }
  },

  deleteBookedVisit: async (id: string) => {
    set({ isMutating: true, error: null, bookedVisitsError: null });
    try {
      const res = await adminApiClient.delete<ApiResponse<{ message: string; id: string }>>(
        `/booked-visits/${id}`
      );

      if (res.data.success) {
        set((state) => ({
          bookedVisits: state.bookedVisits.filter((v) => v.id !== id),
          bookedVisitsPagination: state.bookedVisitsPagination
            ? {
              ...state.bookedVisitsPagination,
              total: Math.max(0, state.bookedVisitsPagination.total - 1),
            }
            : null,
          isMutating: false,
          error: null,
        }));
        return { success: true, message: res.data.message || "Booked visit deleted successfully." };
      }

      const msg = res.data.message || "Failed to delete booked visit.";
      set({ isMutating: false, error: msg, bookedVisitsError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to delete booked visit record.");
      set({ isMutating: false, error: msg, bookedVisitsError: msg });
      return { success: false, message: msg };
    }
  },

  // =========================================================================
  // 3. Enquiry Module
  // =========================================================================
  fetchEnquiries: async (params = {}, force = false) => {
    const key = `enquiries_${JSON.stringify(params)}`;
    if (!force && inFlightRequests.has(key)) {
      return inFlightRequests.get(key) as Promise<{
        success: boolean;
        data?: PaginatedEnquiriesResult;
        message?: string;
      }>;
    }

    set({ isLoadingEnquiries: true, enquiriesError: null });

    return getInFlight(key, async () => {
      try {
        const res = await adminApiClient.get<ApiResponse<PaginatedEnquiriesResult>>(
          "/enquiries",
          { params }
        );

        if (res.data.success && res.data.data) {
          set({
            enquiries: res.data.data.items || [],
            enquiriesPagination: res.data.data.pagination || null,
            isLoadingEnquiries: false,
            enquiriesError: null,
          });
          return { success: true, data: res.data.data, message: res.data.message };
        }

        const msg = res.data.message || "Failed to load enquiries.";
        set({ isLoadingEnquiries: false, enquiriesError: msg });
        return { success: false, message: msg };
      } catch (err) {
        const msg = extractErrorMessage(err, "Failed to load enquiries from server.");
        set({ isLoadingEnquiries: false, enquiriesError: msg });
        return { success: false, message: msg };
      }
    });
  },

  getEnquiryById: async (id: string) => {
    try {
      const res = await adminApiClient.get<ApiResponse<{ enquiry: SafeEnquiry }>>(
        `/enquiries/${id}`
      );
      if (res.data.success && res.data.data?.enquiry) {
        return { success: true, data: res.data.data.enquiry, message: res.data.message };
      }
      return { success: false, message: res.data.message || "Enquiry not found." };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to fetch enquiry details.");
      return { success: false, message: msg };
    }
  },

  createEnquiry: async (input) => {
    set({ isMutating: true, error: null, enquiriesError: null });
    try {
      const res = await adminApiClient.post<ApiResponse<{ enquiry: SafeEnquiry }>>(
        "/enquiries",
        input
      );

      if (res.data.success && res.data.data?.enquiry) {
        const created = res.data.data.enquiry;
        set((state) => ({
          enquiries: [created, ...state.enquiries],
          enquiriesPagination: state.enquiriesPagination
            ? {
              ...state.enquiriesPagination,
              total: state.enquiriesPagination.total + 1,
            }
            : null,
          isMutating: false,
          error: null,
        }));
        return { success: true, data: created, message: res.data.message };
      }

      const msg = res.data.message || "Failed to create enquiry.";
      set({ isMutating: false, error: msg, enquiriesError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to create enquiry record.");
      set({ isMutating: false, error: msg, enquiriesError: msg });
      return { success: false, message: msg };
    }
  },

  updateEnquiry: async (id, input) => {
    set({ isMutating: true, error: null, enquiriesError: null });
    try {
      const res = await adminApiClient.patch<ApiResponse<{ enquiry: SafeEnquiry }>>(
        `/enquiries/${id}`,
        input
      );

      if (res.data.success && res.data.data?.enquiry) {
        const updated = res.data.data.enquiry;
        set((state) => ({
          enquiries: state.enquiries.map((e) => (e.id === id ? updated : e)),
          isMutating: false,
          error: null,
        }));
        return { success: true, data: updated, message: res.data.message };
      }

      const msg = res.data.message || "Failed to update enquiry.";
      set({ isMutating: false, error: msg, enquiriesError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to update enquiry record.");
      set({ isMutating: false, error: msg, enquiriesError: msg });
      return { success: false, message: msg };
    }
  },

  deleteEnquiry: async (id: string) => {
    set({ isMutating: true, error: null, enquiriesError: null });
    try {
      const res = await adminApiClient.delete<ApiResponse<{ message: string; id: string }>>(
        `/enquiries/${id}`
      );

      if (res.data.success) {
        set((state) => ({
          enquiries: state.enquiries.filter((e) => e.id !== id),
          enquiriesPagination: state.enquiriesPagination
            ? {
              ...state.enquiriesPagination,
              total: Math.max(0, state.enquiriesPagination.total - 1),
            }
            : null,
          isMutating: false,
          error: null,
        }));
        return { success: true, message: res.data.message || "Enquiry deleted successfully." };
      }

      const msg = res.data.message || "Failed to delete enquiry.";
      set({ isMutating: false, error: msg, enquiriesError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to delete enquiry record.");
      set({ isMutating: false, error: msg, enquiriesError: msg });
      return { success: false, message: msg };
    }
  },
}));

// Export alias for convenient imports
export const useHostelEnquiryStore = useHostelAndEnquiryStore;
export default useHostelAndEnquiryStore;

