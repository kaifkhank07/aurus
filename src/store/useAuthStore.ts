import { create } from "zustand";
import { SafeAdmin } from "@/types/admin.types";
import {
  adminLogin,
  adminLogout,
  getAdminMe,
  getStoredAdmin,
  setStoredAdmin,
  clearStoredAdmin,
} from "@/lib/admin-api";

export interface AuthState {
  admin: SafeAdmin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  setAdmin: (admin: SafeAdmin | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  admin: typeof window !== "undefined" ? getStoredAdmin() : null,
  isAuthenticated: typeof window !== "undefined" ? Boolean(getStoredAdmin()) : false,
  isLoading: false,
  isInitialized: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await adminLogin(email, password);
      if (res.success && res.data?.admin) {
        setStoredAdmin(res.data.admin);
        set({
          admin: res.data.admin,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
          error: null,
        });
        return { success: true };
      }

      const msg = res.message || "Invalid administrator credentials.";
      set({
        isLoading: false,
        error: msg,
        isAuthenticated: false,
      });
      return { success: false, message: msg };
    } catch {
      const msg = "Unable to connect to the authentication service.";
      set({
        isLoading: false,
        error: msg,
        isAuthenticated: false,
      });
      return { success: false, message: msg };
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await adminLogout();
    } catch {
      // Continue client cleanup even if network call fails
    } finally {
      clearStoredAdmin();
      set({
        admin: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  checkAuth: async () => {
    // If not yet initialized, read cached stored admin as fast fallback
    if (!get().isInitialized) {
      const cached = getStoredAdmin();
      if (cached) {
        set({ admin: cached, isAuthenticated: true });
      }
    }

    set({ isLoading: true });
    try {
      const res = await getAdminMe();
      if (res.success && res.data?.admin) {
        setStoredAdmin(res.data.admin);
        set({
          admin: res.data.admin,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
          error: null,
        });
        return true;
      }

      clearStoredAdmin();
      set({
        admin: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
      return false;
    } catch {
      clearStoredAdmin();
      set({
        admin: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
      return false;
    }
  },

  setAdmin: (admin: SafeAdmin | null) => {
    if (admin) {
      setStoredAdmin(admin);
    } else {
      clearStoredAdmin();
    }
    set({
      admin,
      isAuthenticated: Boolean(admin),
    });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
