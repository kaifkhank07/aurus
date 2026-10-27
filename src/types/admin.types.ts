import { PaginationMeta } from "./general.types";


export type AdminStatus = "active" | "inactive";

export interface IAdmin {
  _id: string;
  name: string;
  email: string;
  password?: string;
  status: AdminStatus;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SafeAdmin {
  id: string;
  name: string;
  email: string;
  status: AdminStatus;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JwtAdminPayload {
  id: string;
  email: string;
  type: "access";
  iat?: number;
  exp?: number;
}

export interface CreateAdminInput {
  name: string;
  email: string;
  password: string;
  status?: AdminStatus;
}

export interface UpdateAdminInput {
  name?: string;
  email?: string;
  password?: string;
  status?: AdminStatus;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AdminQueryParams {
  page: number;
  limit: number;
  search?: string;
  status?: AdminStatus;
}



export interface PaginatedAdminsResult {
  items: SafeAdmin[];
  pagination: PaginationMeta;
}
