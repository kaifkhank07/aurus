import axios, { AxiosInstance } from "axios";
import { ApiResponse } from "@/types/general.types";
import { PublicResidenceCity, PublicCity, PublicCityQueryParams } from "@/types/city.types";
import { PublicHostelQueryParams, PublicHostelsResult } from "@/types/hostel.types";
import { SafeOccupancy, PublicOccupancyQueryParams } from "@/types/occupancy.types";

/**
 * Pre-configured Axios client instance for public Aurus APIs.
 */
export const publicApiClient: AxiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Fetches available residence cities that have at least one active published residence.
 */
export async function getPublicResidenceCities(): Promise<ApiResponse<PublicResidenceCity[]>> {
  const res = await publicApiClient.get<ApiResponse<PublicResidenceCity[]>>("/api/residences/cities");
  return res.data;
}

/**
 * Fetches public active cities with their active hostel counts.
 */
export async function getPublicCities(
  params?: PublicCityQueryParams
): Promise<ApiResponse<PublicCity[]>> {
  const res = await publicApiClient.get<ApiResponse<PublicCity[]>>("/api/cities", {
    params,
  });
  return res.data;
}

/**
 * Fetches public active residences with optional filtering by citySlug, cityId, tenantType, and search.
 */
export async function getPublicResidences(
  params?: PublicHostelQueryParams
): Promise<ApiResponse<PublicHostelsResult>> {
  const res = await publicApiClient.get<ApiResponse<PublicHostelsResult>>("/api/residences", {
    params,
  });
  return res.data;
}

/**
 * Fetches public active occupancies.
 */
export async function getPublicOccupancies(
  params?: PublicOccupancyQueryParams
): Promise<ApiResponse<SafeOccupancy[]>> {
  const res = await publicApiClient.get<ApiResponse<SafeOccupancy[]>>("/api/occupancies", {
    params,
  });
  return res.data;
}



