import { IFileOption, ISeoMetadata, PaginationMeta } from "./general.types";
import { SafeCity } from "./city.types";
import { SafeLocality } from "./locality.types";
import { SafeAmenity } from "./amenity.types";
import { SafeOccupancy } from "./occupancy.types";
import { SafeRoom } from "./room.types";
import { SafeService } from "./service.types";
import { SafeInstitute } from "./institute.types";
import { SafeRentFrequency } from "./rent-frequency.types";

export const TENANT_TYPES = ["girls", "boys", "co-ed"] as const;
export type TenantType = (typeof TENANT_TYPES)[number];

export interface IHostelRating {
  star: number;
  userCount: number;
}

export interface IHostelRentInput {
  amount: number;
  frequency: string;
}

export interface SafeHostelRent {
  amount: number;
  frequency: string | SafeRentFrequency;
}

export interface IHostelLocation {
  city: string;
  locality: string;
  address: string;
  mapUrl?: string;
  longitude?: number;
  latitude?: number;
}

export interface SafeHostelLocation {
  city: string | SafeCity;
  locality: string | SafeLocality;
  address: string;
  mapUrl?: string;
  longitude?: number;
  latitude?: number;
}

export interface SafeHostel {
  id: string;
  _id?: string;
  title: string;
  slug: string;
  subtitle?: string;
  tenantType: TenantType;
  isActive: boolean;
  frontImage: IFileOption;
  galleryImages: IFileOption[];
  rent: SafeHostelRent;
  amenities: (string | SafeAmenity)[];
  occupancy: (string | SafeOccupancy)[];
  room: (string | SafeRoom)[];
  services: (string | SafeService)[];
  institute: (string | SafeInstitute)[];
  rating: IHostelRating;
  description: string;
  location: SafeHostelLocation;
  brochure?: IFileOption;
  metadata?: ISeoMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHostelInput {
  title: string;
  subtitle?: string;
  tenantType: TenantType;
  isActive?: boolean;
  frontImage: IFileOption;
  galleryImages?: IFileOption[];
  rent: IHostelRentInput;
  amenities?: string[];
  occupancy?: string[];
  room?: string[];
  services?: string[];
  institute?: string[];
  rating?: IHostelRating;
  description: string;
  location: IHostelLocation;
  brochure?: IFileOption;
  metadata?: ISeoMetadata;
}

export interface UpdateHostelInput {
  title?: string;
  subtitle?: string;
  tenantType?: TenantType;
  isActive?: boolean;
  frontImage?: IFileOption;
  galleryImages?: IFileOption[];
  rent?: Partial<IHostelRentInput>;
  amenities?: string[];
  occupancy?: string[];
  room?: string[];
  services?: string[];
  institute?: string[];
  rating?: Partial<IHostelRating>;
  description?: string;
  location?: Partial<IHostelLocation>;
  brochure?: IFileOption | null;
  metadata?: ISeoMetadata;
}

export interface HostelQueryParams {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
  city?: string;
  locality?: string;
  tenantType?: TenantType;
  amenity?: string;
  occupancy?: string;
  room?: string;
  service?: string;
  institute?: string;
  rentFrequency?: string;
  minRent?: number;
  maxRent?: number;
  sortBy?: "rent" | "title" | "createdAt" | "star";
  sortOrderDir?: "asc" | "desc";
}

export interface PaginatedHostelsResult {
  items: SafeHostel[];
  pagination: PaginationMeta;
}

export interface PublicHostelQueryParams {
  citySlug?: string;
  cityId?: string;
  search?: string;
  tenantType?: string;
  occupancy?: string;
  page?: number;
  limit?: number;
}

export interface PublicHostelsResult {
  items: SafeHostel[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  pagination?: PaginationMeta;
}
