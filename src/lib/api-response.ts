import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiResponse } from "@/types/general.types";

export function apiSuccess<T>(
  data?: T,
  message = "Success",
  status = 200,
  headers?: HeadersInit
): NextResponse<ApiResponse<T>> {
  const body: ApiResponse<T> = {
    success: true,
    message,
    ...(data !== undefined && { data }),
  };
  return NextResponse.json(body, { status, headers });
}

export function apiError(
  message = "An error occurred",
  status = 400,
  errors?: unknown,
  headers?: HeadersInit
): NextResponse<ApiResponse> {
  const body: ApiResponse = {
    success: false,
    message,
    ...(errors !== undefined && { errors }),
  };
  return NextResponse.json(body, { status, headers });
}

export function formatZodErrors(error: ZodError): Record<string, string> {
  const formatted: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".") || "root";
    if (!formatted[path]) {
      formatted[path] = issue.message;
    }
  }
  return formatted;
}

export class AppError extends Error {
  public statusCode: number;
  public errors?: unknown;

  constructor(message: string, statusCode = 400, errors?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Checks if an error is a Next.js internal control-flow/prerender bailout exception.
 * These errors must be rethrown so Next.js can handle dynamic routing and static bailout properly.
 */
export function isNextBailoutError(error: unknown): boolean {
  if (typeof error === "object" && error !== null) {
    if ("$$typeof" in error && typeof (error as { $$typeof: symbol }).$$typeof === "symbol") {
      return true;
    }
    if ("digest" in error && typeof (error as { digest: unknown }).digest === "string") {
      const digest = (error as { digest: string }).digest;
      if (
        digest.startsWith("DYNAMIC_SERVER_USAGE") ||
        digest.includes("BAILOUT") ||
        digest.includes("NEXT_REDIRECT")
      ) {
        return true;
      }
    }
  }
  if (error instanceof Error) {
    if (
      error.message.includes("bail out of prerendering") ||
      error.message.includes("Dynamic server usage") ||
      error.message.includes("NEXT_PRERENDER_BAILOUT")
    ) {
      return true;
    }
  }
  return false;
}
