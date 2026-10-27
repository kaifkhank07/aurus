import { NextRequest } from "next/server";
import { getMe } from "@/controllers/admin.controller";


export async function GET(request: NextRequest) {
  return getMe(request);
}
