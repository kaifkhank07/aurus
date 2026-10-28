import axios, { AxiosInstance } from "axios";
import { SafeAdmin, PaginatedAdminsResult, AdminQueryParams } from "@/types/admin.types";
import { ApiResponse } from "@/types/general.types";

const ADMIN_STORAGE_KEY = "aurus_admin_user";

/**
 * Pre-configured Axios client instance for Aurus Admin APIs.
 * Automatically handles baseURL (/api/admin), credentials (HTTP-only cookies),
 * and standard JSON payload headers.
 */
export const adminApiClient: AxiosInstance = axios.create({
  baseURL: "/api/admin",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/**
 * Request interceptor to automatically remove Content-Type header when sending FormData.
 * This allows Axios and the browser to set multipart/form-data with the correct boundary delimiter.
 */
adminApiClient.interceptors.request.use((config) => {
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    }
  }
  return config;
});

/**
 * Helper to safely extract ApiResponse payload from Axios response or AxiosError.
 */
function extractResponse<T>(error: unknown): ApiResponse<T> {
  if (axios.isAxiosError(error) && error.response?.data) {
    return error.response.data as ApiResponse<T>;
  }
  const message = error instanceof Error ? error.message : "An unexpected network error occurred.";
  return {
    success: false,
    message,
  };
}

export function getStoredAdmin(): SafeAdmin | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredAdmin(admin: SafeAdmin): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admin));
  } catch {
    // Ignore storage errors
  }
}

export function clearStoredAdmin(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Authenticate with email & password via Axios
 */
export async function adminLogin(
  email: string,
  password: string
): Promise<ApiResponse<{ admin: SafeAdmin }>> {
  try {
    const res = await adminApiClient.post<ApiResponse<{ admin: SafeAdmin }>>("/auth/login", {
      email,
      password,
    });
    if (res.data.success && res.data.data?.admin) {
      setStoredAdmin(res.data.data.admin);
    }
    return res.data;
  } catch (error) {
    return extractResponse<{ admin: SafeAdmin }>(error);
  }
}

/**
 * End admin session via Axios
 */
export async function adminLogout(): Promise<ApiResponse<null>> {
  try {
    const res = await adminApiClient.post<ApiResponse<null>>("/auth/logout");
    clearStoredAdmin();
    return res.data;
  } catch {
    clearStoredAdmin();
    return { success: true, message: "Logged out." };
  }
}

/**
 * Get currently authenticated admin details via Axios
 */
export async function getAdminMe(): Promise<ApiResponse<{ admin: SafeAdmin }>> {
  try {
    const res = await adminApiClient.get<ApiResponse<{ admin: SafeAdmin }>>("/auth/me");
    if (res.data.success && res.data.data?.admin) {
      setStoredAdmin(res.data.data.admin);
    }
    return res.data;
  } catch (error) {
    return extractResponse<{ admin: SafeAdmin }>(error);
  }
}

/**
 * Fetch paginated administrator accounts via Axios
 */
export async function getAdminList(
  params?: Partial<AdminQueryParams>
): Promise<ApiResponse<PaginatedAdminsResult>> {
  try {
    const res = await adminApiClient.get<ApiResponse<PaginatedAdminsResult>>("", {
      params,
    });
    return res.data;
  } catch (error) {
    return extractResponse<PaginatedAdminsResult>(error);
  }
}
