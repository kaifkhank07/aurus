import { IFileOption, ISeoMetadata, PaginationMeta } from "./general.types";


export interface SafeCity {
  id: string;
  country: string;
  state: string;
  city: string;
  slug: string;
  image?: IFileOption;
  sortOrder: number;
  isActive: boolean;
  metadata?: ISeoMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCityInput {
  country: string;
  state: string;
  city: string;
  image?: IFileOption;
  sortOrder?: number;
  isActive?: boolean;
  metadata?: ISeoMetadata;
}

export interface UpdateCityInput {
  country?: string;
  state?: string;
  city?: string;
  image?: IFileOption | null;
  sortOrder?: number;
  isActive?: boolean;
  metadata?: ISeoMetadata;
}

export interface CityQueryParams {
  page: number;
  limit: number;
  search?: string;
  country?: string;
  state?: string;
  isActive?: boolean;
  sortBy?: "sortOrder" | "city" | "createdAt";
  sortOrderDir?: "asc" | "desc";
}

export interface PaginatedCitiesResult {
  items: SafeCity[];
  pagination: PaginationMeta;
}

export interface PublicResidenceCity {
  _id: string;
  name: string;
  slug: string;
  state?: string;
  country?: string;
  count?: number;
}

export interface PublicCity extends SafeCity {
  _id?: string;
  name?: string;
  activeHostelsCount: number;
  count: number;
}

export interface PublicCityQueryParams {
  search?: string;
  hasHostels?: boolean;
  onlyWithHostels?: boolean;
}


