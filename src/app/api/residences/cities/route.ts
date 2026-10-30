import { NextResponse } from "next/server";
import { getCitiesWithResidences } from "@/lib/residences/city";
import { apiSuccess, apiError, isNextBailoutError } from "@/lib/api-response";

/**
 * GET /api/residences/cities
 * Retrieves all cities from City Master that have at least one eligible published residence.
 */
export async function GET() {
  try {
    const cities = await getCitiesWithResidences();
    return apiSuccess(cities, "Available cities retrieved successfully");
  } catch (error) {
    if (isNextBailoutError(error)) {
      throw error;
    }
    console.error("[GET /api/residences/cities] Error:", error);
    return apiError("Failed to retrieve available cities", 500);
  }
}
