import { NextRequest } from "next/server";
import { list, create } from "@/controllers/enquiry.controller";

export async function GET(request: NextRequest) {
  return list(request);
}

export async function POST(request: NextRequest) {
  return create(request);
}
