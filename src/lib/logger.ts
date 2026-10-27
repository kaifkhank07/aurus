/**
 * Aurus Backend Logging Utility
 *
 * Lightweight, structured, secure, and production-ready logger for Next.js 16 App Router.
 * Supports configurable log levels, development human-readable output, production JSON formatting,
 * automatic redaction of sensitive credentials, and safe error serialization.
 */

export type LogLevel = "debug" | "info" | "warn" | "error" | "silent";

const LOG_LEVEL_SEVERITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
};

// Sensitive property names to redact in logs
const SENSITIVE_KEY_REGEX = /^(password|passwd|pass|token|secret|jwt|cookie|authorization|auth|admin_access_token|hash|creditcard|apikey|privatekey)$/i;

function getActiveLogLevel(): LogLevel {
  const envLevel = (
    process.env.LOG_LEVEL ||
    process.env.AURUS_LOG_LEVEL ||
    ""
  ).toLowerCase() as LogLevel;

  if (envLevel in LOG_LEVEL_SEVERITY) {
    return envLevel;
  }

  return process.env.NODE_ENV === "production" ? "info" : "debug";
}

function sanitizeValue(value: unknown, seen = new WeakSet()): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === "string") {
    // Sanitize newlines to prevent log injection in single-line logs
    return value.replace(/[\r\n]+/g, " ");
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "object") {
    if (seen.has(value as object)) {
      return "[Circular]";
    }
    seen.add(value as object);

    if (Array.isArray(value)) {
      return value.map((item) => sanitizeValue(item, seen));
    }

    const sanitizedObj: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (SENSITIVE_KEY_REGEX.test(k)) {
        sanitizedObj[k] = "[REDACTED]";
      } else {
        sanitizedObj[k] = sanitizeValue(v, seen);
      }
    }
    return sanitizedObj;
  }

  return String(value);
}

function serializeError(err: unknown): Record<string, unknown> | undefined {
  if (!err) return undefined;

  if (err instanceof Error) {
    const errorObj: Record<string, unknown> = {
      name: err.name,
      message: err.message.replace(/[\r\n]+/g, " "),
    };

    if (err.stack) {
      errorObj.stack = err.stack;
    }

    if ("statusCode" in err) {
      errorObj.statusCode = (err as { statusCode: unknown }).statusCode;
    }

    if ("errors" in err && (err as { errors: unknown }).errors) {
      errorObj.errors = sanitizeValue((err as { errors: unknown }).errors);
    }

    if ("code" in err) {
      errorObj.code = (err as { code: unknown }).code;
    }

    return errorObj;
  }

  if (typeof err === "object") {
    return sanitizeValue(err) as Record<string, unknown>;
  }

  return { message: String(err) };
}

export interface LogContext {
  operation?: string;
  [key: string]: unknown;
}

export interface Logger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, errorOrContext?: unknown, context?: LogContext): void;
}

export function createLogger(moduleName: string): Logger {
  function log(
    level: LogLevel,
    message: string,
    errorData?: unknown,
    context?: LogContext
  ): void {
    try {
      const activeLevel = getActiveLogLevel();
      if (LOG_LEVEL_SEVERITY[level] < LOG_LEVEL_SEVERITY[activeLevel]) {
        return;
      }

      const timestamp = new Date().toISOString();
      const operation = context?.operation || "general";
      const sanitizedMessage = message.replace(/[\r\n]+/g, " ");

      // Extract metadata excluding operation to keep it clean
      const meta = context ? { ...context } : undefined;
      if (meta && "operation" in meta) {
        delete meta.operation;
      }

      const hasMeta = meta && Object.keys(meta).length > 0;
      const sanitizedMeta = hasMeta ? sanitizeValue(meta) : undefined;
      const serializedErr = serializeError(errorData);

      const isProduction = process.env.NODE_ENV === "production";

      if (isProduction) {
        // Structured JSON for production
        const jsonPayload = {
          timestamp,
          level: level.toUpperCase(),
          module: moduleName,
          operation,
          message: sanitizedMessage,
          ...(sanitizedMeta !== undefined && { data: sanitizedMeta }),
          ...(serializedErr !== undefined && { error: serializedErr }),
        };

        const serialized = JSON.stringify(jsonPayload);
        if (level === "error") {
          console.error(serialized);
        } else if (level === "warn") {
          console.warn(serialized);
        } else {
          console.log(serialized);
        }
      } else {
        // Human-readable format for development
        const levelTag = level.toUpperCase().padEnd(5, " ");
        let line = `[${timestamp}] ${levelTag} [${moduleName}:${operation}] ${sanitizedMessage}`;

        if (sanitizedMeta) {
          line += ` ${JSON.stringify(sanitizedMeta)}`;
        }

        if (level === "error") {
          console.error(line);
          if (serializedErr?.stack) {
            console.error(serializedErr.stack);
          } else if (serializedErr) {
            console.error(JSON.stringify(serializedErr, null, 2));
          }
        } else if (level === "warn") {
          console.warn(line);
          if (serializedErr) {
            console.warn(JSON.stringify(serializedErr, null, 2));
          }
        } else if (level === "debug") {
          console.debug(line);
        } else {
          console.log(line);
        }
      }
    } catch {
      // Fail-safe: Logging must never crash the application
    }
  }

  return {
    debug(message: string, context?: LogContext): void {
      log("debug", message, undefined, context);
    },
    info(message: string, context?: LogContext): void {
      log("info", message, undefined, context);
    },
    warn(message: string, context?: LogContext): void {
      log("warn", message, undefined, context);
    },
    error(message: string, errorOrContext?: unknown, context?: LogContext): void {
      if (errorOrContext instanceof Error) {
        log("error", message, errorOrContext, context);
      } else if (
        errorOrContext &&
        typeof errorOrContext === "object" &&
        ("message" in errorOrContext || "stack" in errorOrContext || "name" in errorOrContext)
      ) {
        log("error", message, errorOrContext, context);
      } else if (errorOrContext && !context && typeof errorOrContext === "object") {
        // Called as error(message, { operation: "..." })
        log("error", message, undefined, errorOrContext as LogContext);
      } else {
        log("error", message, errorOrContext, context);
      }
    },
  };
}

export default createLogger;
