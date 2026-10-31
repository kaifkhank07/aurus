import { NextRequest } from "next/server";
import { listPublic } from "@/controllers/city.controller";

/**
 * GET /api/cities
 * Public API to retrieve active cities with active hostel counts.
 */
export async function GET(request: NextRequest) {
  return listPublic(request);
}

