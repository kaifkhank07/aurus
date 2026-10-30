import { create } from "zustand";
import axios from "axios";
import { ApiResponse } from "@/types/general.types";
import { PublicResidenceCity } from "@/types/city.types";
import { publicApiClient } from "@/lib/public-api";

export type { PublicResidenceCity };

/**
 * Standardized error extractor across public store operations.
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

export interface PublicOptionsState {
  residenceCities: PublicResidenceCity[];
  isLoading: boolean;
  isFetched: boolean;
  error: string | null;

  fetchResidenceCities: (force?: boolean) => Promise<void>;
  clearError: () => void;
}

// In-flight request caching to prevent duplicate simultaneous API calls
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

export const usePublicOptions = create<PublicOptionsState>((set, get) => ({
  residenceCities: [],
  isLoading: false,
  isFetched: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchResidenceCities: async (force = false) => {
    // If already fetched and not forced, reuse existing state
    if (!force && get().isFetched) {
      return;
    }

    const key = "public_residence_cities";
    if (!force && inFlightRequests.has(key)) {
      await inFlightRequests.get(key);
      return;
    }

    set({ isLoading: true, error: null });

    await getInFlight(key, async () => {
      try {
        const res = await publicApiClient.get<ApiResponse<PublicResidenceCity[]>>("/api/residences/cities");

        if (res.data.success && Array.isArray(res.data.data)) {
          set({
            residenceCities: res.data.data,
            isLoading: false,
            isFetched: true,
            error: null,
          });
        } else {
          const msg = res.data.message || "Failed to load residence cities.";
          set({
            isLoading: false,
            isFetched: true,
            error: msg,
          });
        }
      } catch (err) {
        const msg = extractErrorMessage(err, "Failed to retrieve available residence cities.");
        set({
          isLoading: false,
          isFetched: true,
          error: msg,
        });
      }
    });
  },
}));

export default usePublicOptions;

