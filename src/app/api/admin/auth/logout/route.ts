import { logout } from "@/controllers/admin.controller";

export async function POST() {
  return logout();
}
