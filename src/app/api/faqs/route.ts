import { NextRequest } from "next/server";
import { listPublic } from "@/controllers/faq.controller";

export async function GET(request: NextRequest) {
  return listPublic(request);
}

