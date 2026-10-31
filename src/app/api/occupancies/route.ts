import { NextRequest } from "next/server";
import { listPublic } from "@/controllers/occupancy.controller";

/**
 * GET /api/occupancies
 * Public API to retrieve active occupancies.
 */
export async function GET(request: NextRequest) {
  return listPublic(request);
}

