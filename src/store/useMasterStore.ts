import { create } from "zustand";
import axios from "axios";
import { adminApiClient } from "@/lib/admin-api";
import { ApiResponse, PaginationMeta } from "@/types/general.types";
import {
  SafeCity,
  CreateCityInput,
  UpdateCityInput,
  CityQueryParams,
  PaginatedCitiesResult,
} from "@/types/city.types";
import {
  SafeLocality,
  CreateLocalityInput,
  UpdateLocalityInput,
  LocalityQueryParams,
  PaginatedLocalitiesResult,
} from "@/types/locality.types";
import {
  SafeInstitute,
  CreateInstituteInput,
  UpdateInstituteInput,
  InstituteQueryParams,
  PaginatedInstitutesResult,
} from "@/types/institute.types";
import {
  SafeOccupancy,
  CreateOccupancyInput,
  UpdateOccupancyInput,
  OccupancyQueryParams,
  PaginatedOccupanciesResult,
} from "@/types/occupancy.types";
import {
  SafeAmenity,
  CreateAmenityInput,
  UpdateAmenityInput,
  AmenityQueryParams,
  PaginatedAmenitiesResult,
} from "@/types/amenity.types";

/**
 * Standardized error extractor across all master operations.
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

export interface MasterState {
  // ── City Module State ──
  cities: SafeCity[];
  citiesPagination: PaginationMeta | null;
  isLoadingCities: boolean;
  citiesError: string | null;

  // ── Locality Module State ──
  localities: SafeLocality[];
  localitiesPagination: PaginationMeta | null;
  isLoadingLocalities: boolean;
  localitiesError: string | null;

  // ── Institute Module State ──
  institutes: SafeInstitute[];
  institutesPagination: PaginationMeta | null;
  isLoadingInstitutes: boolean;
  institutesError: string | null;

  // ── Occupancy Module State ──
  occupancies: SafeOccupancy[];
  occupanciesPagination: PaginationMeta | null;
  isLoadingOccupancies: boolean;
  occupanciesError: string | null;

  // ── Amenity Module State ──
  amenities: SafeAmenity[];
  amenitiesPagination: PaginationMeta | null;
  isLoadingAmenities: boolean;
  amenitiesError: string | null;

  // ── Global Mutation State ──
  isMutating: boolean;
  error: string | null;

  // ── General Actions ──
  clearErrors: () => void;

  // ── City Actions ──
  fetchCities: (
    params?: Partial<CityQueryParams>,
    force?: boolean
  ) => Promise<{ success: boolean; data?: PaginatedCitiesResult; message?: string }>;
  getCityById: (
    id: string
  ) => Promise<{ success: boolean; data?: SafeCity; message?: string }>;
  createCity: (
    input: CreateCityInput | FormData
  ) => Promise<{ success: boolean; data?: SafeCity; message?: string }>;
  updateCity: (
    id: string,
    input: UpdateCityInput | FormData
  ) => Promise<{ success: boolean; data?: SafeCity; message?: string }>;
  deleteCity: (
    id: string
  ) => Promise<{ success: boolean; message?: string }>;

  // ── Locality Actions ──
  fetchLocalities: (
    params?: Partial<LocalityQueryParams>,
    force?: boolean
  ) => Promise<{ success: boolean; data?: PaginatedLocalitiesResult; message?: string }>;
  getLocalityById: (
    id: string
  ) => Promise<{ success: boolean; data?: SafeLocality; message?: string }>;
  createLocality: (
    input: CreateLocalityInput
  ) => Promise<{ success: boolean; data?: SafeLocality; message?: string }>;
  updateLocality: (
    id: string,
    input: UpdateLocalityInput
  ) => Promise<{ success: boolean; data?: SafeLocality; message?: string }>;
  deleteLocality: (
    id: string
  ) => Promise<{ success: boolean; message?: string }>;

  // ── Institute Actions ──
  fetchInstitutes: (
    params?: Partial<InstituteQueryParams>,
    force?: boolean
  ) => Promise<{ success: boolean; data?: PaginatedInstitutesResult; message?: string }>;
  getInstituteById: (
    id: string
  ) => Promise<{ success: boolean; data?: SafeInstitute; message?: string }>;
  createInstitute: (
    input: CreateInstituteInput
  ) => Promise<{ success: boolean; data?: SafeInstitute; message?: string }>;
  updateInstitute: (
    id: string,
    input: UpdateInstituteInput
  ) => Promise<{ success: boolean; data?: SafeInstitute; message?: string }>;
  deleteInstitute: (
    id: string
  ) => Promise<{ success: boolean; message?: string }>;

  // ── Occupancy Actions ──
  fetchOccupancies: (
    params?: Partial<OccupancyQueryParams>,
    force?: boolean
  ) => Promise<{ success: boolean; data?: PaginatedOccupanciesResult; message?: string }>;
  getOccupancyById: (
    id: string
  ) => Promise<{ success: boolean; data?: SafeOccupancy; message?: string }>;
  createOccupancy: (
    input: CreateOccupancyInput | FormData
  ) => Promise<{ success: boolean; data?: SafeOccupancy; message?: string }>;
  updateOccupancy: (
    id: string,
    input: UpdateOccupancyInput | FormData
  ) => Promise<{ success: boolean; data?: SafeOccupancy; message?: string }>;
  deleteOccupancy: (
    id: string
  ) => Promise<{ success: boolean; message?: string }>;

  // ── Amenity Actions ──
  fetchAmenities: (
    params?: Partial<AmenityQueryParams>,
    force?: boolean
  ) => Promise<{ success: boolean; data?: PaginatedAmenitiesResult; message?: string }>;
  getAmenityById: (
    id: string
  ) => Promise<{ success: boolean; data?: SafeAmenity; message?: string }>;
  createAmenity: (
    input: CreateAmenityInput | FormData
  ) => Promise<{ success: boolean; data?: SafeAmenity; message?: string }>;
  updateAmenity: (
    id: string,
    input: UpdateAmenityInput | FormData
  ) => Promise<{ success: boolean; data?: SafeAmenity; message?: string }>;
  deleteAmenity: (
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

export const useMasterStore = create<MasterState>((set) => ({
  // Initial states
  cities: [],
  citiesPagination: null,
  isLoadingCities: false,
  citiesError: null,

  localities: [],
  localitiesPagination: null,
  isLoadingLocalities: false,
  localitiesError: null,

  institutes: [],
  institutesPagination: null,
  isLoadingInstitutes: false,
  institutesError: null,

  occupancies: [],
  occupanciesPagination: null,
  isLoadingOccupancies: false,
  occupanciesError: null,

  amenities: [],
  amenitiesPagination: null,
  isLoadingAmenities: false,
  amenitiesError: null,

  isMutating: false,
  error: null,

  clearErrors: () =>
    set({
      error: null,
      citiesError: null,
      localitiesError: null,
      institutesError: null,
      occupanciesError: null,
      amenitiesError: null,
    }),

  // =========================================================================
  // 1. City Module
  // =========================================================================
  fetchCities: async (params = {}, force = false) => {
    const key = `cities_${JSON.stringify(params)}`;
    if (!force && inFlightRequests.has(key)) {
      return inFlightRequests.get(key) as Promise<{
        success: boolean;
        data?: PaginatedCitiesResult;
        message?: string;
      }>;
    }

    set({ isLoadingCities: true, citiesError: null });

    return getInFlight(key, async () => {
      try {
        const res = await adminApiClient.get<ApiResponse<PaginatedCitiesResult>>("/cities", {
          params,
        });

        if (res.data.success && res.data.data) {
          set({
            cities: res.data.data.items || [],
            citiesPagination: res.data.data.pagination || null,
            isLoadingCities: false,
            citiesError: null,
          });
          return { success: true, data: res.data.data, message: res.data.message };
        }

        const msg = res.data.message || "Failed to load cities.";
        set({ isLoadingCities: false, citiesError: msg });
        return { success: false, message: msg };
      } catch (err) {
        const msg = extractErrorMessage(err, "Failed to load cities from server.");
        set({ isLoadingCities: false, citiesError: msg });
        return { success: false, message: msg };
      }
    });
  },

  getCityById: async (id: string) => {
    try {
      const res = await adminApiClient.get<ApiResponse<{ city: SafeCity }>>(`/cities/${id}`);
      if (res.data.success && res.data.data?.city) {
        return { success: true, data: res.data.data.city, message: res.data.message };
      }
      return { success: false, message: res.data.message || "City not found." };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to fetch city details.");
      return { success: false, message: msg };
    }
  },

  createCity: async (input) => {
    set({ isMutating: true, error: null, citiesError: null });
    try {
      const res = await adminApiClient.post<ApiResponse<{ city: SafeCity }>>(
        "/cities",
        input
      );

      if (res.data.success && res.data.data?.city) {
        const created = res.data.data.city;
        set((state) => ({
          cities: [created, ...state.cities],
          citiesPagination: state.citiesPagination
            ? {
                ...state.citiesPagination,
                total: state.citiesPagination.total + 1,
              }
            : null,
          isMutating: false,
          error: null,
        }));
        return { success: true, data: created, message: res.data.message };
      }

      const msg = res.data.message || "Failed to create city.";
      set({ isMutating: false, error: msg, citiesError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to create city record.");
      set({ isMutating: false, error: msg, citiesError: msg });
      return { success: false, message: msg };
    }
  },

  updateCity: async (id, input) => {
    set({ isMutating: true, error: null, citiesError: null });
    try {
      const res = await adminApiClient.patch<ApiResponse<{ city: SafeCity }>>(
        `/cities/${id}`,
        input
      );

      if (res.data.success && res.data.data?.city) {
        const updated = res.data.data.city;
        set((state) => ({
          cities: state.cities.map((c) => (c.id === id ? updated : c)),
          isMutating: false,
          error: null,
        }));
        return { success: true, data: updated, message: res.data.message };
      }

      const msg = res.data.message || "Failed to update city.";
      set({ isMutating: false, error: msg, citiesError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to update city record.");
      set({ isMutating: false, error: msg, citiesError: msg });
      return { success: false, message: msg };
    }
  },

  deleteCity: async (id: string) => {
    set({ isMutating: true, error: null, citiesError: null });
    try {
      const res = await adminApiClient.delete<ApiResponse<{ message: string; id: string }>>(
        `/cities/${id}`
      );

      if (res.data.success) {
        set((state) => ({
          cities: state.cities.filter((c) => c.id !== id),
          citiesPagination: state.citiesPagination
            ? {
                ...state.citiesPagination,
                total: Math.max(0, state.citiesPagination.total - 1),
              }
            : null,
          isMutating: false,
          error: null,
        }));
        return { success: true, message: res.data.message || "City deleted successfully." };
      }

      const msg = res.data.message || "Failed to delete city.";
      set({ isMutating: false, error: msg, citiesError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to delete city record.");
      set({ isMutating: false, error: msg, citiesError: msg });
      return { success: false, message: msg };
    }
  },

  // =========================================================================
  // 2. Locality Module
  // =========================================================================
  fetchLocalities: async (params = {}, force = false) => {
    const key = `localities_${JSON.stringify(params)}`;
    if (!force && inFlightRequests.has(key)) {
      return inFlightRequests.get(key) as Promise<{
        success: boolean;
        data?: PaginatedLocalitiesResult;
        message?: string;
      }>;
    }

    set({ isLoadingLocalities: true, localitiesError: null });

    return getInFlight(key, async () => {
      try {
        const res = await adminApiClient.get<ApiResponse<PaginatedLocalitiesResult>>("/localities", {
          params,
        });

        if (res.data.success && res.data.data) {
          set({
            localities: res.data.data.items || [],
            localitiesPagination: res.data.data.pagination || null,
            isLoadingLocalities: false,
            localitiesError: null,
          });
          return { success: true, data: res.data.data, message: res.data.message };
        }

        const msg = res.data.message || "Failed to load localities.";
        set({ isLoadingLocalities: false, localitiesError: msg });
        return { success: false, message: msg };
      } catch (err) {
        const msg = extractErrorMessage(err, "Failed to load localities from server.");
        set({ isLoadingLocalities: false, localitiesError: msg });
        return { success: false, message: msg };
      }
    });
  },

  getLocalityById: async (id: string) => {
    try {
      const res = await adminApiClient.get<ApiResponse<{ locality: SafeLocality }>>(
        `/localities/${id}`
      );
      if (res.data.success && res.data.data?.locality) {
        return { success: true, data: res.data.data.locality, message: res.data.message };
      }
      return { success: false, message: res.data.message || "Locality not found." };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to fetch locality details.");
      return { success: false, message: msg };
    }
  },

  createLocality: async (input) => {
    set({ isMutating: true, error: null, localitiesError: null });
    try {
      const res = await adminApiClient.post<ApiResponse<{ locality: SafeLocality }>>(
        "/localities",
        input
      );

      if (res.data.success && res.data.data?.locality) {
        const created = res.data.data.locality;
        set((state) => ({
          localities: [created, ...state.localities],
          localitiesPagination: state.localitiesPagination
            ? {
                ...state.localitiesPagination,
                total: state.localitiesPagination.total + 1,
              }
            : null,
          isMutating: false,
          error: null,
        }));
        return { success: true, data: created, message: res.data.message };
      }

      const msg = res.data.message || "Failed to create locality.";
      set({ isMutating: false, error: msg, localitiesError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to create locality record.");
      set({ isMutating: false, error: msg, localitiesError: msg });
      return { success: false, message: msg };
    }
  },

  updateLocality: async (id, input) => {
    set({ isMutating: true, error: null, localitiesError: null });
    try {
      const res = await adminApiClient.patch<ApiResponse<{ locality: SafeLocality }>>(
        `/localities/${id}`,
        input
      );

      if (res.data.success && res.data.data?.locality) {
        const updated = res.data.data.locality;
        set((state) => ({
          localities: state.localities.map((loc) => (loc.id === id ? updated : loc)),
          isMutating: false,
          error: null,
        }));
        return { success: true, data: updated, message: res.data.message };
      }

      const msg = res.data.message || "Failed to update locality.";
      set({ isMutating: false, error: msg, localitiesError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to update locality record.");
      set({ isMutating: false, error: msg, localitiesError: msg });
      return { success: false, message: msg };
    }
  },

  deleteLocality: async (id: string) => {
    set({ isMutating: true, error: null, localitiesError: null });
    try {
      const res = await adminApiClient.delete<ApiResponse<{ message: string; id: string }>>(
        `/localities/${id}`
      );

      if (res.data.success) {
        set((state) => ({
          localities: state.localities.filter((loc) => loc.id !== id),
          localitiesPagination: state.localitiesPagination
            ? {
                ...state.localitiesPagination,
                total: Math.max(0, state.localitiesPagination.total - 1),
              }
            : null,
          isMutating: false,
          error: null,
        }));
        return { success: true, message: res.data.message || "Locality deleted successfully." };
      }

      const msg = res.data.message || "Failed to delete locality.";
      set({ isMutating: false, error: msg, localitiesError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to delete locality record.");
      set({ isMutating: false, error: msg, localitiesError: msg });
      return { success: false, message: msg };
    }
  },

  // =========================================================================
  // 3. Institute Module
  // =========================================================================
  fetchInstitutes: async (params = {}, force = false) => {
    const key = `institutes_${JSON.stringify(params)}`;
    if (!force && inFlightRequests.has(key)) {
      return inFlightRequests.get(key) as Promise<{
        success: boolean;
        data?: PaginatedInstitutesResult;
        message?: string;
      }>;
    }

    set({ isLoadingInstitutes: true, institutesError: null });

    return getInFlight(key, async () => {
      try {
        const res = await adminApiClient.get<ApiResponse<PaginatedInstitutesResult>>("/institutes", {
          params,
        });

        if (res.data.success && res.data.data) {
          set({
            institutes: res.data.data.items || [],
            institutesPagination: res.data.data.pagination || null,
            isLoadingInstitutes: false,
            institutesError: null,
          });
          return { success: true, data: res.data.data, message: res.data.message };
        }

        const msg = res.data.message || "Failed to load institutes.";
        set({ isLoadingInstitutes: false, institutesError: msg });
        return { success: false, message: msg };
      } catch (err) {
        const msg = extractErrorMessage(err, "Failed to load institutes from server.");
        set({ isLoadingInstitutes: false, institutesError: msg });
        return { success: false, message: msg };
      }
    });
  },

  getInstituteById: async (id: string) => {
    try {
      const res = await adminApiClient.get<ApiResponse<{ institute: SafeInstitute }>>(
        `/institutes/${id}`
      );
      if (res.data.success && res.data.data?.institute) {
        return { success: true, data: res.data.data.institute, message: res.data.message };
      }
      return { success: false, message: res.data.message || "Institute not found." };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to fetch institute details.");
      return { success: false, message: msg };
    }
  },

  createInstitute: async (input) => {
    set({ isMutating: true, error: null, institutesError: null });
    try {
      const res = await adminApiClient.post<ApiResponse<{ institute: SafeInstitute }>>(
        "/institutes",
        input
      );

      if (res.data.success && res.data.data?.institute) {
        const created = res.data.data.institute;
        set((state) => ({
          institutes: [created, ...state.institutes],
          institutesPagination: state.institutesPagination
            ? {
                ...state.institutesPagination,
                total: state.institutesPagination.total + 1,
              }
            : null,
          isMutating: false,
          error: null,
        }));
        return { success: true, data: created, message: res.data.message };
      }

      const msg = res.data.message || "Failed to create institute.";
      set({ isMutating: false, error: msg, institutesError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to create institute record.");
      set({ isMutating: false, error: msg, institutesError: msg });
      return { success: false, message: msg };
    }
  },

  updateInstitute: async (id, input) => {
    set({ isMutating: true, error: null, institutesError: null });
    try {
      const res = await adminApiClient.patch<ApiResponse<{ institute: SafeInstitute }>>(
        `/institutes/${id}`,
        input
      );

      if (res.data.success && res.data.data?.institute) {
        const updated = res.data.data.institute;
        set((state) => ({
          institutes: state.institutes.map((inst) => (inst.id === id ? updated : inst)),
          isMutating: false,
          error: null,
        }));
        return { success: true, data: updated, message: res.data.message };
      }

      const msg = res.data.message || "Failed to update institute.";
      set({ isMutating: false, error: msg, institutesError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to update institute record.");
      set({ isMutating: false, error: msg, institutesError: msg });
      return { success: false, message: msg };
    }
  },

  deleteInstitute: async (id: string) => {
    set({ isMutating: true, error: null, institutesError: null });
    try {
      const res = await adminApiClient.delete<ApiResponse<{ message: string; id: string }>>(
        `/institutes/${id}`
      );

      if (res.data.success) {
        set((state) => ({
          institutes: state.institutes.filter((inst) => inst.id !== id),
          institutesPagination: state.institutesPagination
            ? {
                ...state.institutesPagination,
                total: Math.max(0, state.institutesPagination.total - 1),
              }
            : null,
          isMutating: false,
          error: null,
        }));
        return { success: true, message: res.data.message || "Institute deleted successfully." };
      }

      const msg = res.data.message || "Failed to delete institute.";
      set({ isMutating: false, error: msg, institutesError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to delete institute record.");
      set({ isMutating: false, error: msg, institutesError: msg });
      return { success: false, message: msg };
    }
  },

  // =========================================================================
  // 4. Occupancy Module
  // =========================================================================
  fetchOccupancies: async (params = {}, force = false) => {
    const key = `occupancies_${JSON.stringify(params)}`;
    if (!force && inFlightRequests.has(key)) {
      return inFlightRequests.get(key) as Promise<{
        success: boolean;
        data?: PaginatedOccupanciesResult;
        message?: string;
      }>;
    }

    set({ isLoadingOccupancies: true, occupanciesError: null });

    return getInFlight(key, async () => {
      try {
        const res = await adminApiClient.get<ApiResponse<PaginatedOccupanciesResult>>("/occupancies", {
          params,
        });

        if (res.data.success && res.data.data) {
          set({
            occupancies: res.data.data.items || [],
            occupanciesPagination: res.data.data.pagination || null,
            isLoadingOccupancies: false,
            occupanciesError: null,
          });
          return { success: true, data: res.data.data, message: res.data.message };
        }

        const msg = res.data.message || "Failed to load occupancies.";
        set({ isLoadingOccupancies: false, occupanciesError: msg });
        return { success: false, message: msg };
      } catch (err) {
        const msg = extractErrorMessage(err, "Failed to load occupancies from server.");
        set({ isLoadingOccupancies: false, occupanciesError: msg });
        return { success: false, message: msg };
      }
    });
  },

  getOccupancyById: async (id: string) => {
    try {
      const res = await adminApiClient.get<ApiResponse<{ occupancy: SafeOccupancy }>>(
        `/occupancies/${id}`
      );
      if (res.data.success && res.data.data?.occupancy) {
        return { success: true, data: res.data.data.occupancy, message: res.data.message };
      }
      return { success: false, message: res.data.message || "Occupancy not found." };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to fetch occupancy details.");
      return { success: false, message: msg };
    }
  },

  createOccupancy: async (input) => {
    set({ isMutating: true, error: null, occupanciesError: null });
    try {
      const res = await adminApiClient.post<ApiResponse<{ occupancy: SafeOccupancy }>>(
        "/occupancies",
        input
      );

      if (res.data.success && res.data.data?.occupancy) {
        const created = res.data.data.occupancy;
        set((state) => ({
          occupancies: [created, ...state.occupancies],
          occupanciesPagination: state.occupanciesPagination
            ? {
                ...state.occupanciesPagination,
                total: state.occupanciesPagination.total + 1,
              }
            : null,
          isMutating: false,
          error: null,
        }));
        return { success: true, data: created, message: res.data.message };
      }

      const msg = res.data.message || "Failed to create occupancy.";
      set({ isMutating: false, error: msg, occupanciesError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to create occupancy record.");
      set({ isMutating: false, error: msg, occupanciesError: msg });
      return { success: false, message: msg };
    }
  },

  updateOccupancy: async (id, input) => {
    set({ isMutating: true, error: null, occupanciesError: null });
    try {
      const res = await adminApiClient.patch<ApiResponse<{ occupancy: SafeOccupancy }>>(
        `/occupancies/${id}`,
        input
      );

      if (res.data.success && res.data.data?.occupancy) {
        const updated = res.data.data.occupancy;
        set((state) => ({
          occupancies: state.occupancies.map((occ) => (occ.id === id ? updated : occ)),
          isMutating: false,
          error: null,
        }));
        return { success: true, data: updated, message: res.data.message };
      }

      const msg = res.data.message || "Failed to update occupancy.";
      set({ isMutating: false, error: msg, occupanciesError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to update occupancy record.");
      set({ isMutating: false, error: msg, occupanciesError: msg });
      return { success: false, message: msg };
    }
  },

  deleteOccupancy: async (id: string) => {
    set({ isMutating: true, error: null, occupanciesError: null });
    try {
      const res = await adminApiClient.delete<ApiResponse<{ message: string; id: string }>>(
        `/occupancies/${id}`
      );

      if (res.data.success) {
        set((state) => ({
          occupancies: state.occupancies.filter((occ) => occ.id !== id),
          occupanciesPagination: state.occupanciesPagination
            ? {
                ...state.occupanciesPagination,
                total: Math.max(0, state.occupanciesPagination.total - 1),
              }
            : null,
          isMutating: false,
          error: null,
        }));
        return { success: true, message: res.data.message || "Occupancy deleted successfully." };
      }

      const msg = res.data.message || "Failed to delete occupancy.";
      set({ isMutating: false, error: msg, occupanciesError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to delete occupancy record.");
      set({ isMutating: false, error: msg, occupanciesError: msg });
      return { success: false, message: msg };
    }
  },

  // =========================================================================
  // 5. Amenity Module
  // =========================================================================
  fetchAmenities: async (params = {}, force = false) => {
    const key = `amenities_${JSON.stringify(params)}`;
    if (!force && inFlightRequests.has(key)) {
      return inFlightRequests.get(key) as Promise<{
        success: boolean;
        data?: PaginatedAmenitiesResult;
        message?: string;
      }>;
    }

    set({ isLoadingAmenities: true, amenitiesError: null });

    return getInFlight(key, async () => {
      try {
        const res = await adminApiClient.get<ApiResponse<PaginatedAmenitiesResult>>("/amenities", {
          params,
        });

        if (res.data.success && res.data.data) {
          set({
            amenities: res.data.data.items || [],
            amenitiesPagination: res.data.data.pagination || null,
            isLoadingAmenities: false,
            amenitiesError: null,
          });
          return { success: true, data: res.data.data, message: res.data.message };
        }

        const msg = res.data.message || "Failed to load amenities.";
        set({ isLoadingAmenities: false, amenitiesError: msg });
        return { success: false, message: msg };
      } catch (err) {
        const msg = extractErrorMessage(err, "Failed to load amenities from server.");
        set({ isLoadingAmenities: false, amenitiesError: msg });
        return { success: false, message: msg };
      }
    });
  },

  getAmenityById: async (id: string) => {
    try {
      const res = await adminApiClient.get<ApiResponse<{ amenity: SafeAmenity }>>(
        `/amenities/${id}`
      );
      if (res.data.success && res.data.data?.amenity) {
        return { success: true, data: res.data.data.amenity, message: res.data.message };
      }
      return { success: false, message: res.data.message || "Amenity not found." };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to fetch amenity details.");
      return { success: false, message: msg };
    }
  },

  createAmenity: async (input) => {
    set({ isMutating: true, error: null, amenitiesError: null });
    try {
      const res = await adminApiClient.post<ApiResponse<{ amenity: SafeAmenity }>>(
        "/amenities",
        input
      );

      if (res.data.success && res.data.data?.amenity) {
        const created = res.data.data.amenity;
        set((state) => ({
          amenities: [created, ...state.amenities],
          amenitiesPagination: state.amenitiesPagination
            ? {
                ...state.amenitiesPagination,
                total: state.amenitiesPagination.total + 1,
              }
            : null,
          isMutating: false,
          error: null,
        }));
        return { success: true, data: created, message: res.data.message };
      }

      const msg = res.data.message || "Failed to create amenity.";
      set({ isMutating: false, error: msg, amenitiesError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to create amenity record.");
      set({ isMutating: false, error: msg, amenitiesError: msg });
      return { success: false, message: msg };
    }
  },

  updateAmenity: async (id, input) => {
    set({ isMutating: true, error: null, amenitiesError: null });
    try {
      const res = await adminApiClient.patch<ApiResponse<{ amenity: SafeAmenity }>>(
        `/amenities/${id}`,
        input
      );

      if (res.data.success && res.data.data?.amenity) {
        const updated = res.data.data.amenity;
        set((state) => ({
          amenities: state.amenities.map((am) => (am.id === id ? updated : am)),
          isMutating: false,
          error: null,
        }));
        return { success: true, data: updated, message: res.data.message };
      }

      const msg = res.data.message || "Failed to update amenity.";
      set({ isMutating: false, error: msg, amenitiesError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to update amenity record.");
      set({ isMutating: false, error: msg, amenitiesError: msg });
      return { success: false, message: msg };
    }
  },

  deleteAmenity: async (id: string) => {
    set({ isMutating: true, error: null, amenitiesError: null });
    try {
      const res = await adminApiClient.delete<ApiResponse<{ message: string; id: string }>>(
        `/amenities/${id}`
      );

      if (res.data.success) {
        set((state) => ({
          amenities: state.amenities.filter((am) => am.id !== id),
          amenitiesPagination: state.amenitiesPagination
            ? {
                ...state.amenitiesPagination,
                total: Math.max(0, state.amenitiesPagination.total - 1),
              }
            : null,
          isMutating: false,
          error: null,
        }));
        return { success: true, message: res.data.message || "Amenity deleted successfully." };
      }

      const msg = res.data.message || "Failed to delete amenity.";
      set({ isMutating: false, error: msg, amenitiesError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to delete amenity record.");
      set({ isMutating: false, error: msg, amenitiesError: msg });
      return { success: false, message: msg };
    }
  },
}));

export default useMasterStore;
