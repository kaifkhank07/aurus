import { NextRequest } from "next/server";
import { getHostelsForCity } from "@/controllers/city-seo.controller";

export const dynamic = "force-dynamic";

/**
 * GET /api/city-seo/cities/[citySlug]/hostels
 * Returns paginated active hostels for a specific city with query filters (tenantType, occupancy, locality, institute, rent, search).
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ citySlug: string }> }
) {
  return getHostelsForCity(request, context);
}

