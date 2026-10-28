export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IFileOption {
  url: string;
  publickey: string;
}

export interface ISeoMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
}
