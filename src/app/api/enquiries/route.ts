import { NextRequest } from "next/server";
import { createPublic } from "@/controllers/enquiry.controller";

export async function POST(request: NextRequest) {
  return createPublic(request);
}
