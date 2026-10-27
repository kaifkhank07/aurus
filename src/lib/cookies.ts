import { NextRequest, NextResponse } from "next/server";

export function getAdminCookieName(): string {
  return process.env.ADMIN_COOKIE_NAME || "admin_access_token";
}

export function getAdminCookieMaxAge(): number {
  const envMaxAge = process.env.ADMIN_COOKIE_MAX_AGE;
  if (envMaxAge) {
    const parsed = parseInt(envMaxAge, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return 900; // 15 minutes in seconds
}

export interface CookieOptions {
  name: string;
  value: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  path: string;
  maxAge: number;
}

export function getAdminCookieOptions(): Omit<CookieOptions, "value"> {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    name: getAdminCookieName(),
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: getAdminCookieMaxAge(),
  };
}

export function setAdminAuthCookie(response: NextResponse, token: string): void {
  const options = getAdminCookieOptions();
  response.cookies.set({
    name: options.name,
    value: token,
    httpOnly: options.httpOnly,
    secure: options.secure,
    sameSite: options.sameSite,
    path: options.path,
    maxAge: options.maxAge,
  });
}

export function clearAdminAuthCookie(response: NextResponse): void {
  const options = getAdminCookieOptions();
  response.cookies.set({
    name: options.name,
    value: "",
    httpOnly: options.httpOnly,
    secure: options.secure,
    sameSite: options.sameSite,
    path: options.path,
    maxAge: 0,
    expires: new Date(0),
  });
}

export function getAdminTokenFromRequest(request: NextRequest): string | null {
  const cookieName = getAdminCookieName();
  const cookie = request.cookies.get(cookieName);
  return cookie?.value || null;
}
