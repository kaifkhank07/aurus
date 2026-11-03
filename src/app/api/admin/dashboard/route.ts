import { NextRequest } from "next/server";
import { getDashboardStats } from "@/controllers/dashboard.controller";

export async function GET(request: NextRequest) {
  return getDashboardStats(request);
}

