import { create } from "zustand";
import axios from "axios";
import { publicApiClient } from "@/lib/public-api";
import { ApiResponse, PaginationMeta } from "@/types/general.types";
import { PublicCity } from "@/types/city.types";
import { SafeHostel } from "@/types/hostel.types";
import {
  CitySeoLocalityItem,
  CitySeoInstituteItem,
  CitySeoCityDetails,
  CitySeoPaginatedHostels,
  CitySeoHostelQueryParams,
  CitySeoCityListQueryParams,
} from "@/types/city-seo.types";

/**
 * Standardized error extractor across all City SEO operations.
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

/**
 * In-flight promise map for request deduplication.
 */
const inFlightRequests = new Map<string, Promise<unknown>>();

function getInFlight<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = inFlightRequests.get(key) as Promise<T> | undefined;
  if (existing) return existing;

  const promise = fn().finally(() => {
    inFlightRequests.delete(key);
  });

  inFlightRequests.set(key, promise);
  return promise;
}

export interface CitySeoState {
  // ── Public Cities List ──
  cities: PublicCity[];
  isLoadingCities: boolean;
  citiesError: string | null;

  // ── Active City Details (with active hostels matching [citySlug]/page.tsx) ──
  currentCity: PublicCity | null;
  cityDetailsHostels: SafeHostel[];
  isLoadingCityDetails: boolean;
  cityDetailsError: string | null;
  loadedDetailsCitySlug: string | null;

  // ── Filtered City Hostels ──
  cityHostels: SafeHostel[];
  cityHostelsPagination: PaginationMeta | null;
  isLoadingCityHostels: boolean;
  cityHostelsError: string | null;
  loadedHostelsCitySlug: string | null;

  // ── City Localities ──
  localities: CitySeoLocalityItem[];
  isLoadingLocalities: boolean;
  localitiesError: string | null;
  loadedLocalitiesCitySlug: string | null;

  // ── City Colleges / Institutes ──
  institutes: CitySeoInstituteItem[];
  isLoadingInstitutes: boolean;
  institutesError: string | null;
  loadedInstitutesCitySlug: string | null;

  // ── Actions ──
  clearErrors: () => void;
  resetCityData: () => void;

  /**
   * Fetch list of public cities.
   */
  fetchCities: (
    params?: CitySeoCityListQueryParams,
    force?: boolean
  ) => Promise<{ success: boolean; data?: PublicCity[]; message?: string }>;

  /**
   * Fetch city details along with all its active hostels (matching [citySlug]/page.tsx).
   */
  fetchCityDetails: (
    citySlug: string,
    force?: boolean
  ) => Promise<{ success: boolean; data?: CitySeoCityDetails; message?: string }>;

  /**
   * Fetch filtered hostels for a specific city.
   */
  fetchCityHostels: (
    citySlug: string,
    params?: CitySeoHostelQueryParams,
    force?: boolean
  ) => Promise<{ success: boolean; data?: CitySeoPaginatedHostels; message?: string }>;

  /**
   * Fetch localities for a specific city with active hostel counts.
   */
  fetchCityLocalities: (
    citySlug: string,
    force?: boolean
  ) => Promise<{ success: boolean; data?: CitySeoLocalityItem[]; message?: string }>;

  /**
   * Fetch colleges / institutes for a specific city with active hostel counts.
   */
  fetchCityInstitutes: (
    citySlug: string,
    force?: boolean
  ) => Promise<{ success: boolean; data?: CitySeoInstituteItem[]; message?: string }>;
}

export const useCitySeoStore = create<CitySeoState>((set, get) => ({
  // Initial state
  cities: [],
  isLoadingCities: false,
  citiesError: null,

  currentCity: null,
  cityDetailsHostels: [],
  isLoadingCityDetails: false,
  cityDetailsError: null,
  loadedDetailsCitySlug: null,

  cityHostels: [],
  cityHostelsPagination: null,
  isLoadingCityHostels: false,
  cityHostelsError: null,
  loadedHostelsCitySlug: null,

  localities: [],
  isLoadingLocalities: false,
  localitiesError: null,
  loadedLocalitiesCitySlug: null,

  institutes: [],
  isLoadingInstitutes: false,
  institutesError: null,
  loadedInstitutesCitySlug: null,

  clearErrors: () => {
    set({
      citiesError: null,
      cityDetailsError: null,
      cityHostelsError: null,
      localitiesError: null,
      institutesError: null,
    });
  },

  resetCityData: () => {
    set({
      currentCity: null,
      cityDetailsHostels: [],
      cityDetailsError: null,
      loadedDetailsCitySlug: null,
      cityHostels: [],
      cityHostelsPagination: null,
      cityHostelsError: null,
      loadedHostelsCitySlug: null,
      localities: [],
      localitiesError: null,
      loadedLocalitiesCitySlug: null,
      institutes: [],
      institutesError: null,
      loadedInstitutesCitySlug: null,
    });
  },

  fetchCities: async (params = {}, force = false) => {
    const key = `city-seo-cities-${JSON.stringify(params)}`;
    if (!force && inFlightRequests.has(key)) {
      return inFlightRequests.get(key) as Promise<{
        success: boolean;
        data?: PublicCity[];
        message?: string;
      }>;
    }

    set({ isLoadingCities: true, citiesError: null });

    return getInFlight(key, async () => {
      try {
        const res = await publicApiClient.get<
          ApiResponse<{ items: PublicCity[]; total: number }>
        >("/api/city-seo/cities", { params });

        if (res.data.success && res.data.data) {
          const items = res.data.data.items || [];
          set({
            cities: items,
            isLoadingCities: false,
            citiesError: null,
          });
          return { success: true, data: items, message: res.data.message };
        }

        const msg = res.data.message || "Failed to load public cities.";
        set({ isLoadingCities: false, citiesError: msg });
        return { success: false, message: msg };
      } catch (err) {
        const msg = extractErrorMessage(err, "Failed to load public cities from server.");
        set({ isLoadingCities: false, citiesError: msg });
        return { success: false, message: msg };
      }
    });
  },

  fetchCityDetails: async (citySlug: string, force = false) => {
    const normalizedSlug = (citySlug || "").toLowerCase().trim();
    if (!normalizedSlug) {
      return { success: false, message: "City slug is required." };
    }

    // Cache hit: already fetched for this city
    if (!force && get().loadedDetailsCitySlug === normalizedSlug && get().currentCity) {
      return {
        success: true,
        data: {
          city: get().currentCity!,
          hostels: get().cityDetailsHostels,
          totalHostels: get().cityDetailsHostels.length,
        },
      };
    }

    const key = `city-seo-details-${normalizedSlug}`;
    if (!force && inFlightRequests.has(key)) {
      return inFlightRequests.get(key) as Promise<{
        success: boolean;
        data?: CitySeoCityDetails;
        message?: string;
      }>;
    }

    set({ isLoadingCityDetails: true, cityDetailsError: null });

    return getInFlight(key, async () => {
      try {
        const res = await publicApiClient.get<ApiResponse<CitySeoCityDetails>>(
          `/api/city-seo/cities/${encodeURIComponent(normalizedSlug)}`
        );

        if (res.data.success && res.data.data) {
          const { city, hostels } = res.data.data;
          set({
            currentCity: city,
            cityDetailsHostels: hostels || [],
            isLoadingCityDetails: false,
            cityDetailsError: null,
            loadedDetailsCitySlug: normalizedSlug,
          });
          return { success: true, data: res.data.data, message: res.data.message };
        }

        const msg = res.data.message || "Failed to load city details.";
        set({ isLoadingCityDetails: false, cityDetailsError: msg });
        return { success: false, message: msg };
      } catch (err) {
        const msg = extractErrorMessage(err, "Failed to load city details from server.");
        set({ isLoadingCityDetails: false, cityDetailsError: msg });
        return { success: false, message: msg };
      }
    });
  },

  fetchCityHostels: async (citySlug: string, params = {}, force = false) => {
    const normalizedSlug = (citySlug || "").toLowerCase().trim();
    if (!normalizedSlug) {
      return { success: false, message: "City slug is required." };
    }

    const hasFilters = Object.keys(params).length > 0;
    // Cache hit: already fetched for this city with no filters (even if 0 hostels exist)
    if (
      !force &&
      !hasFilters &&
      get().loadedHostelsCitySlug === normalizedSlug
    ) {
      return {
        success: true,
        data: {
          city: get().currentCity!,
          items: get().cityHostels,
          total: get().cityHostelsPagination?.total ?? get().cityHostels.length,
          page: get().cityHostelsPagination?.page ?? 1,
          limit: get().cityHostelsPagination?.limit ?? 20,
          totalPages: get().cityHostelsPagination?.totalPages ?? 1,
          pagination: get().cityHostelsPagination!,
        },
      };
    }

    const key = `city-seo-hostels-${normalizedSlug}-${JSON.stringify(params)}`;
    if (!force && inFlightRequests.has(key)) {
      return inFlightRequests.get(key) as Promise<{
        success: boolean;
        data?: CitySeoPaginatedHostels;
        message?: string;
      }>;
    }

    const isSameCity = get().loadedHostelsCitySlug === normalizedSlug;
    set({
      isLoadingCityHostels: true,
      cityHostelsError: null,
      cityHostels: isSameCity ? get().cityHostels : [],
    });

    return getInFlight(key, async () => {
      try {
        const res = await publicApiClient.get<ApiResponse<CitySeoPaginatedHostels>>(
          `/api/city-seo/cities/${encodeURIComponent(normalizedSlug)}/hostels`,
          { params }
        );

        if (res.data.success && res.data.data) {
          const rawData = res.data.data;
          const items = (rawData.items || []).map((item: any) => ({
            ...item,
            id: item.id || (item._id ? String(item._id) : ""),
            _id: item._id ? String(item._id) : item.id,
          }));

          const pagination: PaginationMeta = rawData.pagination || {
            total: rawData.total ?? items.length,
            page: rawData.page ?? 1,
            limit: rawData.limit ?? 20,
            totalPages: rawData.totalPages ?? 1,
            hasNextPage: (rawData.page ?? 1) < (rawData.totalPages ?? 1),
            hasPrevPage: (rawData.page ?? 1) > 1,
          };

          set({
            currentCity: rawData.city || get().currentCity,
            cityHostels: items,
            cityHostelsPagination: pagination,
            isLoadingCityHostels: false,
            cityHostelsError: null,
            loadedHostelsCitySlug: !hasFilters ? normalizedSlug : get().loadedHostelsCitySlug,
          });

          return {
            success: true,
            data: { ...rawData, items, pagination },
            message: res.data.message,
          };
        }

        const msg = res.data.message || "Failed to load city hostels.";
        set({
          isLoadingCityHostels: false,
          cityHostelsError: msg,
          loadedHostelsCitySlug: !hasFilters ? normalizedSlug : get().loadedHostelsCitySlug,
        });
        return { success: false, message: msg };
      } catch (err) {
        const msg = extractErrorMessage(err, "Failed to load city hostels from server.");
        set({
          isLoadingCityHostels: false,
          cityHostelsError: msg,
          loadedHostelsCitySlug: !hasFilters ? normalizedSlug : get().loadedHostelsCitySlug,
        });
        return { success: false, message: msg };
      }
    });
  },

  fetchCityLocalities: async (citySlug: string, force = false) => {
    const normalizedSlug = (citySlug || "").toLowerCase().trim();
    if (!normalizedSlug) {
      return { success: false, message: "City slug is required." };
    }

    // Cache hit: already fetched for this city (even if 0 localities exist)
    if (!force && get().loadedLocalitiesCitySlug === normalizedSlug) {
      return {
        success: true,
        data: get().localities,
      };
    }

    const key = `city-seo-localities-${normalizedSlug}`;
    if (!force && inFlightRequests.has(key)) {
      return inFlightRequests.get(key) as Promise<{
        success: boolean;
        data?: CitySeoLocalityItem[];
        message?: string;
      }>;
    }

    const isSameCityLocalities = get().loadedLocalitiesCitySlug === normalizedSlug;
    set({
      isLoadingLocalities: true,
      localitiesError: null,
      localities: isSameCityLocalities ? get().localities : [],
    });

    return getInFlight(key, async () => {
      try {
        const res = await publicApiClient.get<
          ApiResponse<{ city: PublicCity; localities: CitySeoLocalityItem[]; total: number }>
        >(`/api/city-seo/cities/${encodeURIComponent(normalizedSlug)}/localities`);

        if (res.data.success && res.data.data) {
          const items = res.data.data.localities || [];
          set({
            currentCity: res.data.data.city || get().currentCity,
            localities: items,
            isLoadingLocalities: false,
            localitiesError: null,
            loadedLocalitiesCitySlug: normalizedSlug,
          });
          return { success: true, data: items, message: res.data.message };
        }

        const msg = res.data.message || "Failed to load city localities.";
        set({
          isLoadingLocalities: false,
          localitiesError: msg,
          loadedLocalitiesCitySlug: normalizedSlug,
        });
        return { success: false, message: msg };
      } catch (err) {
        const msg = extractErrorMessage(err, "Failed to load city localities from server.");
        set({
          isLoadingLocalities: false,
          localitiesError: msg,
          loadedLocalitiesCitySlug: normalizedSlug,
        });
        return { success: false, message: msg };
      }
    });
  },

  fetchCityInstitutes: async (citySlug: string, force = false) => {
    const normalizedSlug = (citySlug || "").toLowerCase().trim();
    if (!normalizedSlug) {
      return { success: false, message: "City slug is required." };
    }

    // Cache hit: already fetched for this city (even if 0 institutes exist)
    if (!force && get().loadedInstitutesCitySlug === normalizedSlug) {
      return {
        success: true,
        data: get().institutes,
      };
    }

    const key = `city-seo-institutes-${normalizedSlug}`;
    if (!force && inFlightRequests.has(key)) {
      return inFlightRequests.get(key) as Promise<{
        success: boolean;
        data?: CitySeoInstituteItem[];
        message?: string;
      }>;
    }

    const isSameCityInstitutes = get().loadedInstitutesCitySlug === normalizedSlug;
    set({
      isLoadingInstitutes: true,
      institutesError: null,
      institutes: isSameCityInstitutes ? get().institutes : [],
    });

    return getInFlight(key, async () => {
      try {
        const res = await publicApiClient.get<
          ApiResponse<{ city: PublicCity; institutes: CitySeoInstituteItem[]; total: number }>
        >(`/api/city-seo/cities/${encodeURIComponent(normalizedSlug)}/institutes`);

        if (res.data.success && res.data.data) {
          const items = res.data.data.institutes || [];
          set({
            currentCity: res.data.data.city || get().currentCity,
            institutes: items,
            isLoadingInstitutes: false,
            institutesError: null,
            loadedInstitutesCitySlug: normalizedSlug,
          });
          return { success: true, data: items, message: res.data.message };
        }

        const msg = res.data.message || "Failed to load city institutes.";
        set({
          isLoadingInstitutes: false,
          institutesError: msg,
          loadedInstitutesCitySlug: normalizedSlug,
        });
        return { success: false, message: msg };
      } catch (err) {
        const msg = extractErrorMessage(err, "Failed to load city institutes from server.");
        set({
          isLoadingInstitutes: false,
          institutesError: msg,
          loadedInstitutesCitySlug: normalizedSlug,
        });
        return { success: false, message: msg };
      }
    });
  },
}));
