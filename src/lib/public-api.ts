import axios, { AxiosInstance } from "axios";
import { ApiResponse } from "@/types/general.types";
import { PublicResidenceCity } from "@/types/city.types";

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

