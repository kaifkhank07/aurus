import { PublicCity } from "./city.types";
import { SafeHostel } from "./hostel.types";
import { PaginationMeta } from "./general.types";

/**
 * Represents a locality under a specific city with active hostel counts.
 */
export interface CitySeoLocalityItem {
  id: string;
  _id: string;
  name: string;
  slug: string;
  city: string; // City ObjectId string
  cityName?: string;
  citySlug?: string;
  hostelCount: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Represents an institute / college under a specific city with active hostel counts.
 */
export interface CitySeoInstituteItem {
  id: string;
  _id: string;
  name: string;
  slug: string;
  city: string; // City ObjectId string
  cityName?: string;
  citySlug?: string;
  hostelCount: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Query parameters for filtering hostels in a specific city.
 */
export interface CitySeoHostelQueryParams {
  tenantType?: "girls" | "boys" | "co-ed" | string;
  occupancy?: string;
  occupancyId?: string;
  localitySlug?: string;
  localityId?: string;
  instituteSlug?: string;
  instituteId?: string;
  search?: string;
  minRent?: number | string;
  maxRent?: number | string;
  page?: number | string;
  limit?: number | string;
  sortBy?: "rent" | "createdAt" | "title" | "rating" | string;
  sortOrder?: "asc" | "desc" | string;
}

/**
 * City details with its active public hostels (matches [citySlug]/page.tsx).
 */
export interface CitySeoCityDetails {
  city: PublicCity;
  hostels: SafeHostel[];
  totalHostels: number;
}

/**
 * Paginated hostels result for a specific city.
 */
export interface CitySeoPaginatedHostels {
  city: PublicCity;
  items: SafeHostel[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  pagination: PaginationMeta;
}

/**
 * Query parameters for public cities list.
 */
export interface CitySeoCityListQueryParams {
  search?: string;
  hasHostels?: boolean | string;
  includeHostels?: boolean | string;
}

