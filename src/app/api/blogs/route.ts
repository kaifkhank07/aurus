import { NextRequest } from "next/server";
import { listPublic } from "@/controllers/blog.controller";

/**
 * GET /api/blogs
 * Public endpoint to list blogs
 */
export async function GET(request: NextRequest) {
  return listPublic(request);
}

