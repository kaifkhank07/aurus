import { NextRequest } from "next/server";
import { getCityWithHostels } from "@/controllers/city-seo.controller";

export const dynamic = "force-dynamic";

/**
 * GET /api/city-seo/cities/[citySlug]
 * Returns city details with all active hostels (matching [citySlug]/page.tsx).
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ citySlug: string }> }
) {
  return getCityWithHostels(request, context);
}

