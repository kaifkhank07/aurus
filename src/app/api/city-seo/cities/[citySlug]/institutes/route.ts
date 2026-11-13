import { NextRequest } from "next/server";
import { getInstitutesForCity } from "@/controllers/city-seo.controller";

export const dynamic = "force-dynamic";

/**
 * GET /api/city-seo/cities/[citySlug]/institutes
 * Returns active colleges / institutes belonging to the city with their active hostel counts.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ citySlug: string }> }
) {
  return getInstitutesForCity(request, context);
}

