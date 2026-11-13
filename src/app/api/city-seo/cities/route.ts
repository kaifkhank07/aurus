import { NextRequest } from "next/server";
import { listCitiesWithHostels } from "@/controllers/city-seo.controller";

export const dynamic = "force-dynamic";

/**
 * GET /api/city-seo/cities
 * Returns active public cities with active hostel counts and optional hostel listings.
 */
export async function GET(request: NextRequest) {
  return listCitiesWithHostels(request);
}

