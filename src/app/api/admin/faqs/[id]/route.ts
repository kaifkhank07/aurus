import { NextRequest } from "next/server";
import { getById, update, deleteFaq } from "@/controllers/faq.controller";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return getById(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return update(request, context);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return update(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return deleteFaq(request, context);
}

