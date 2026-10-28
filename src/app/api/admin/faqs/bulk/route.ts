import { NextRequest } from "next/server";
import { bulkUpdate, bulkDelete } from "@/controllers/faq.controller";

export async function PATCH(request: NextRequest) {
  return bulkUpdate(request);
}

export async function PUT(request: NextRequest) {
  return bulkUpdate(request);
}

export async function DELETE(request: NextRequest) {
  return bulkDelete(request);
}

