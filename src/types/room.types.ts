import { IFileOption, PaginationMeta } from "./general.types";

export interface SafeRoom {
  id: string;
  name: string;
  image?: IFileOption;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomInput {
  name: string;
  image?: IFileOption;
  isActive?: boolean;
}

export interface UpdateRoomInput {
  name?: string;
  image?: IFileOption | null;
  isActive?: boolean;
}

export interface RoomQueryParams {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
  sortBy?: "name" | "createdAt";
  sortOrderDir?: "asc" | "desc";
}

export interface PaginatedRoomsResult {
  items: SafeRoom[];
  pagination: PaginationMeta;
}
