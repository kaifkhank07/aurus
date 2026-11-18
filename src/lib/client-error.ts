import axios from "axios";

export const MAX_IMAGE_SIZE_MB = 10;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
export const MAX_PDF_SIZE_MB = 25;
export const MAX_PDF_SIZE_BYTES = MAX_PDF_SIZE_MB * 1024 * 1024;

export const FILE_SIZE_ERROR_MESSAGE = `File size limit exceeded: The uploaded file is too large (maximum allowed size is ${MAX_IMAGE_SIZE_MB}MB for images, ${MAX_PDF_SIZE_MB}MB for PDFs). Please choose a smaller file.`;

/**
 * Validates an image file before upload.
 * Returns an error string if invalid, or null if valid.
 */
export function validateImageFile(file: File, maxMb = MAX_IMAGE_SIZE_MB): string | null {
  if (!file.type.startsWith("image/")) {
    return "Only image files (JPEG, PNG, WebP, SVG, GIF) are allowed.";
  }
  if (file.size > maxMb * 1024 * 1024) {
    return `File "${file.name}" (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the ${maxMb}MB limit. Please upload a smaller image.`;
  }
  return null;
}

/**
 * Validates a PDF file before upload.
 * Returns an error string if invalid, or null if valid.
 */
export function validatePdfFile(file: File, maxMb = MAX_PDF_SIZE_MB): string | null {
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    return "Only PDF documents are allowed.";
  }
  if (file.size > maxMb * 1024 * 1024) {
    return `File "${file.name}" (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the ${maxMb}MB limit. Please upload a smaller PDF.`;
  }
  return null;
}

/**
 * Standardized error extractor across all client requests and Zustand stores.
 * Intercepts HTTP 413 (Payload Too Large) and size-limit errors to display exact messages
 * instead of raw "Request failed with status code 413".
 */
export function extractErrorMessage(
  error: unknown,
  fallback = "An unexpected error occurred."
): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    // 1. Intercept HTTP 413 Payload Too Large explicitly
    if (status === 413) {
      if (
        data &&
        typeof data === "object" &&
        "message" in data &&
        typeof (data as { message: unknown }).message === "string" &&
        (data as { message: string }).message.trim()
      ) {
        return (data as { message: string }).message.trim();
      }
      if (typeof data === "string" && data.trim() && !data.trim().startsWith("<")) {
        return data.trim();
      }
      return FILE_SIZE_ERROR_MESSAGE;
    }

    // 2. Parse standard structured API response payload
    if (data) {
      if (typeof data === "string" && data.trim() && !data.trim().startsWith("<")) {
        return data.trim();
      }
      if (typeof data === "object" && data !== null) {
        const payload = data as { message?: string; errors?: unknown };
        if (payload.message) {
          if (payload.errors && typeof payload.errors === "object") {
            if (Array.isArray(payload.errors)) {
              const list = payload.errors
                .map((e) => (typeof e === "string" ? e : e?.message || JSON.stringify(e)))
                .filter(Boolean);
              if (list.length > 0) return `${payload.message} (${list.join(", ")})`;
            } else {
              const entries = Object.entries(payload.errors as Record<string, string>);
              if (entries.length > 0) {
                const list = entries.map(([field, msg]) => `${field}: ${msg}`);
                return `${payload.message} (${list.join("; ")})`;
              }
            }
          }
          return payload.message;
        }
      }
    }
  }

  // 3. Check for raw error messages mentioning 413, Payload Too Large, or Entity Too Large
  if (error instanceof Error) {
    const msg = error.message;
    if (
      msg.includes("413") ||
      msg.toLowerCase().includes("payload too large") ||
      msg.toLowerCase().includes("entity too large")
    ) {
      return FILE_SIZE_ERROR_MESSAGE;
    }
    return msg;
  }

  return fallback;
}
