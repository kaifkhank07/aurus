import { NextRequest } from "next/server";
import { listPublic } from "@/controllers/story.controller";

/**
 * GET /api/stories
 * Public endpoint to list stories
 */
export async function GET(request: NextRequest) {
  return listPublic(request);
}

