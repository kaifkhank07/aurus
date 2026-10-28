import { IFileOption, ISeoMetadata, PaginationMeta } from "./general.types";
import { SafeCity } from "./city.types";
import { SafeLocality } from "./locality.types";
import { SafeAmenity } from "./amenity.types";


export const TENANT_TYPES = ["girls", "boys", "co-ed"] as const;
export type TenantType = (typeof TENANT_TYPES)[number];

export const RENT_FREQUENCIES = ["monthly", "yearly"] as const;
export type RentFrequency = (typeof RENT_FREQUENCIES)[number];

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
  title: string;
  slug: string;
  subtitle?: string;
  tenantType: TenantType[];
  isActive: boolean;
  frontImage: IFileOption;
  galleryImages: IFileOption[];
  firstImage?: IFileOption;
  secondImage?: IFileOption;
  rent: number;
  rentFrequency: RentFrequency;
  amenities: (string | SafeAmenity)[];
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
  tenantType: TenantType[];
  isActive?: boolean;
  frontImage: IFileOption;
  galleryImages?: IFileOption[];
  firstImage?: IFileOption;
  secondImage?: IFileOption;
  rent: number;
  rentFrequency: RentFrequency;
  amenities: string[];
  description: string;
  location: IHostelLocation;
  brochure?: IFileOption;
  metadata?: ISeoMetadata;
}

export interface UpdateHostelInput {
  title?: string;
  subtitle?: string;
  tenantType?: TenantType[];
  isActive?: boolean;
  frontImage?: IFileOption;
  galleryImages?: IFileOption[];
  firstImage?: IFileOption | null;
  secondImage?: IFileOption | null;
  rent?: number;
  rentFrequency?: RentFrequency;
  amenities?: string[];
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
  rentFrequency?: RentFrequency;
  minRent?: number;
  maxRent?: number;
  sortBy?: "rent" | "title" | "createdAt";
  sortOrderDir?: "asc" | "desc";
}

export interface PaginatedHostelsResult {
  items: SafeHostel[];
  pagination: PaginationMeta;
}
