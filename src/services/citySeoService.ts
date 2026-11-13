import { publicApiClient } from "@/lib/public-api";
import { ApiResponse } from "@/types/general.types";
import { PublicCity } from "@/types/city.types";
import {
  CitySeoLocalityItem,
  CitySeoInstituteItem,
  CitySeoCityDetails,
  CitySeoPaginatedHostels,
  CitySeoHostelQueryParams,
  CitySeoCityListQueryParams,
} from "@/types/city-seo.types";

/**
 * Public City SEO API Service
 */
export const citySeoService = {
  /**
   * Get all public cities with optional search and hostel counts.
   */
  async getCities(params?: CitySeoCityListQueryParams): Promise<PublicCity[]> {
    const res = await publicApiClient.get<
      ApiResponse<{ items: PublicCity[]; total: number }>
    >("/api/city-seo/cities", { params });
    return res.data.data?.items || [];
  },

  /**
   * Get city details with all active hostels (matching [citySlug]/page.tsx).
   */
  async getCityWithHostels(citySlug: string): Promise<CitySeoCityDetails | null> {
    const res = await publicApiClient.get<ApiResponse<CitySeoCityDetails>>(
      `/api/city-seo/cities/${encodeURIComponent(citySlug)}`
    );
    return res.data.data || null;
  },

  /**
   * Get filtered, paginated active hostels for a specific city.
   */
  async getHostelsForCity(
    citySlug: string,
    params?: CitySeoHostelQueryParams
  ): Promise<CitySeoPaginatedHostels | null> {
    const res = await publicApiClient.get<ApiResponse<CitySeoPaginatedHostels>>(
      `/api/city-seo/cities/${encodeURIComponent(citySlug)}/hostels`,
      { params }
    );
    return res.data.data || null;
  },

  /**
   * Get localities for a specific city with active hostel counts.
   */
  async getLocalitiesForCity(citySlug: string): Promise<CitySeoLocalityItem[]> {
    const res = await publicApiClient.get<
      ApiResponse<{ city: PublicCity; localities: CitySeoLocalityItem[]; total: number }>
    >(`/api/city-seo/cities/${encodeURIComponent(citySlug)}/localities`);
    return res.data.data?.localities || [];
  },

  /**
   * Get institutes / colleges for a specific city with active hostel counts.
   */
  async getInstitutesForCity(citySlug: string): Promise<CitySeoInstituteItem[]> {
    const res = await publicApiClient.get<
      ApiResponse<{ city: PublicCity; institutes: CitySeoInstituteItem[]; total: number }>
    >(`/api/city-seo/cities/${encodeURIComponent(citySlug)}/institutes`);
    return res.data.data?.institutes || [];
  },
};

export default citySeoService;

