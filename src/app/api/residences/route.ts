import { NextRequest } from "next/server";
import { listPublic } from "@/controllers/hostel.controller";

/**
 * GET /api/residences
 * Public API to retrieve active residences with optional filtering by citySlug, cityId, tenantType, occupancy, and search.
 */
export async function GET(request: NextRequest) {
  return listPublic(request);
}
