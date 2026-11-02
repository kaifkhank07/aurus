import axios, { AxiosInstance } from "axios";
import { ApiResponse } from "@/types/general.types";
import { PublicCity, PublicCityQueryParams } from "@/types/city.types";
import { PublicHostelQueryParams, PublicHostelsResult } from "@/types/hostel.types";
import { SafeOccupancy, PublicOccupancyQueryParams } from "@/types/occupancy.types";
import { PublicFaqQueryParams, PublicFaqsResult } from "@/types/faq.types";
import { PublicStoryQueryParams, PublicStoriesResult } from "@/types/story.types";
import { PublicBlogQueryParams, PublicBlogsResult } from "@/types/blog.types";

/**
 * Pre-configured Axios client instance for public Aurus APIs.
 */
export const publicApiClient: AxiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

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

/**
 * Fetches public FAQs with optional category or grouped filtering.
 */
export async function getPublicFaqs(
  params?: PublicFaqQueryParams
): Promise<ApiResponse<PublicFaqsResult>> {
  const res = await publicApiClient.get<ApiResponse<PublicFaqsResult>>("/api/faqs", {
    params,
  });
  return res.data;
}

/**
 * Fetches public stories with optional search, featured flag, and pagination.
 */
export async function getPublicStories(
  params?: PublicStoryQueryParams
): Promise<ApiResponse<PublicStoriesResult>> {
  const res = await publicApiClient.get<ApiResponse<PublicStoriesResult>>("/api/stories", {
    params,
  });
  return res.data;
}

/**
 * Fetches public blog posts with optional search, tag, slug, and pagination.
 */
export async function getPublicBlogs(
  params?: PublicBlogQueryParams
): Promise<ApiResponse<PublicBlogsResult>> {
  const res = await publicApiClient.get<ApiResponse<PublicBlogsResult>>("/api/blogs", {
    params,
  });
  return res.data;
}
