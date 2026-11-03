import { create } from "zustand";
import { DashboardData } from "@/types/dashboard.types";
import { getDashboardStats } from "@/lib/admin-api";

interface DashboardState {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
  fetchDashboardData: (force?: boolean) => Promise<void>;
  reset: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  data: null,
  isLoading: false,
  error: null,
  lastFetchedAt: null,

  fetchDashboardData: async (force = false) => {
    const { data, isLoading } = get();
    if (isLoading) return;
    if (data && !force) return;

    set({ isLoading: true, error: null });
    try {
      const response = await getDashboardStats();
      if (response.success && response.data) {
        set({
          data: response.data,
          isLoading: false,
          error: null,
          lastFetchedAt: Date.now(),
        });
      } else {
        set({
          isLoading: false,
          error: response.message || "Failed to load dashboard statistics.",
        });
      }
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "An unexpected error occurred while fetching dashboard statistics.",
      });
    }
  },

  reset: () => set({ data: null, isLoading: false, error: null, lastFetchedAt: null }),
}));

