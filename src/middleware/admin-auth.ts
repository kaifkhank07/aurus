import { NextRequest } from "next/server";
import { getAdminTokenFromRequest } from "@/lib/cookies";
import { verifyAdminToken } from "@/lib/jwt";
import connectToDatabase from "@/lib/mongodb";
import { Admin, IAdminDocument } from "@/models/admin.model";
import { SafeAdmin, JwtAdminPayload } from "@/types/admin.types";
import { AppError } from "@/lib/api-response";

export interface AuthenticatedAdminContext {
  admin: SafeAdmin;
  token: JwtAdminPayload;
}

export function formatSafeAdmin(doc: IAdminDocument): SafeAdmin {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    status: doc.status,
    lastLoginAt: doc.lastLoginAt ? doc.lastLoginAt.toISOString() : null,
    createdAt: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : new Date().toISOString(),
  };
}

export async function authenticateAdmin(
  request: NextRequest
): Promise<AuthenticatedAdminContext> {
  const token = getAdminTokenFromRequest(request);

  if (!token) {
    throw new AppError("Authentication required. No session cookie found.", 401);
  }

  const decoded = verifyAdminToken(token);

  await connectToDatabase();

  const adminDoc = await Admin.findById(decoded.id);

  if (!adminDoc) {
    throw new AppError("Admin account no longer exists.", 401);
  }

  if (adminDoc.status !== "active") {
    throw new AppError("Admin account is inactive. Please contact your system administrator.", 401);
  }

  return {
    admin: formatSafeAdmin(adminDoc),
    token: decoded,
  };
}
