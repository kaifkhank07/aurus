import { NextRequest } from "next/server";
import { createPublic } from "@/controllers/booked-visit.controller";

export async function POST(request: NextRequest) {
  return createPublic(request);
}
