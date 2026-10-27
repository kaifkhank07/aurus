import jwt, { SignOptions } from "jsonwebtoken";
import { JwtAdminPayload } from "@/types/admin.types";
import { AppError } from "./api-response";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET must be set in production environment.");
    }
    console.warn(
      "[JWT] Warning: JWT_SECRET is not defined. Using development fallback. Do not use in production!"
    );
    return "dev_fallback_jwt_secret_key_32_characters_minimum_length";
  }
  return secret;
}

function getJwtExpiresIn(): string {
  return process.env.JWT_EXPIRES_IN || "15m";
}

export function signAdminToken(admin: { id: string; email: string }): string {
  const secret = getJwtSecret();
  const expiresIn = getJwtExpiresIn();

  const payload: Omit<JwtAdminPayload, "iat" | "exp"> = {
    id: admin.id,
    email: admin.email,
    type: "access",
  };

  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
}

export function verifyAdminToken(token: string): JwtAdminPayload {
  const secret = getJwtSecret();

  try {
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

    if (
      !decoded ||
      typeof decoded !== "object" ||
      !decoded.id ||
      decoded.type !== "access"
    ) {
      throw new AppError("Invalid authentication token format or type.", 401);
    }

    return {
      id: decoded.id as string,
      email: decoded.email as string,
      type: "access",
      iat: decoded.iat,
      exp: decoded.exp,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError("Authentication token has expired. Please log in again.", 401);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError("Invalid or corrupted authentication token.", 401);
    }
    throw new AppError("Authentication failed.", 401);
  }
}
