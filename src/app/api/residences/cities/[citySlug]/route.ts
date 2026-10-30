import { NextRequest } from "next/server";
import { getCityBySlug } from "@/lib/residences/city";
import { apiSuccess, apiError, isNextBailoutError } from "@/lib/api-response";

interface RouteContext {
  params: Promise<{
    citySlug: string;
  }>;
}

/**
 * GET /api/residences/cities/[citySlug]
 * Retrieves city details and verifies that the city has eligible residences.
 * Returns 404 if the city does not exist or has 0 eligible residences.
 */
export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { citySlug } = await context.params;

    if (!citySlug || typeof citySlug !== "string") {
      return apiError("City slug is required", 400);
    }

    const city = await getCityBySlug(citySlug);

    if (!city) {
      return apiError("City not found or has no eligible residences", 404);
    }

    return apiSuccess(city, "City retrieved successfully");
  } catch (error) {
    if (isNextBailoutError(error)) {
      throw error;
    }
    console.error("[GET /api/residences/cities/[citySlug]] Error:", error);
    return apiError("Failed to retrieve city details", 500);
  }
}
