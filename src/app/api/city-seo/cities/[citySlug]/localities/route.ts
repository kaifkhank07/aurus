import { NextRequest } from "next/server";
import { getLocalitiesForCity } from "@/controllers/city-seo.controller";

export const dynamic = "force-dynamic";

/**
 * GET /api/city-seo/cities/[citySlug]/localities
 * Returns active localities belonging to the city with their active hostel counts.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ citySlug: string }> }
) {
  return getLocalitiesForCity(request, context);
}

