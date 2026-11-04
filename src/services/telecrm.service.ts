import { createLogger } from "@/lib/logger";

const logger = createLogger("TeleCRMService");

export interface TeleCrmLeadData {
  name: string;
  number: string;
  location?: string | null;
  iam?: string | null;
  message?: string | null;
  status?: string;
  source?: string;
}

export interface TeleCrmBookedVisitData {
  name: string;
  number: string;
  email: string;
  college: string;
  location: string;
  preferredDate: string;
  status?: string;
  source?: string;
}

export interface TeleCrmResponse {
  success: boolean;
  skipped?: boolean;
  data?: unknown;
  error?: string;
}

interface TeleCrmApiPayload {
  fields: Record<string, unknown>;
  actions?: Array<{
    type: string;
    text?: string;
    fields?: Record<string, unknown>;
  }>;
}

/**
 * Normalizes phone numbers for TeleCRM.
 * TeleCRM requires the country code followed by the mobile digits without
 * spaces, dashes, parentheses, or a leading plus sign (e.g. 919876543210 for India).
 */
export function formatPhoneForTeleCRM(raw: string): string {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");

  // 10-digit standard Indian mobile number without country code
  if (digits.length === 10) {
    return `91${digits}`;
  }

  // 11-digit number starting with leading 0 (e.g. 09876543210)
  if (digits.length === 11 && digits.startsWith("0")) {
    return `91${digits.slice(1)}`;
  }

  // Already prefixed with country code (e.g. 919876543210) or international number
  return digits;
}

/**
 * Core dispatch function to send lead payload to TeleCRM.
 * Handles authentication, timeout, status codes, logging, and 1-attempt retry.
 */
async function dispatchToTeleCRM(
  payload: TeleCrmApiPayload,
  leadName: string,
  formattedPhone: string,
  operation: string
): Promise<TeleCrmResponse> {
  const apiUrl = process.env.TELECRM_API_URL;
  const apiKey = process.env.TELECRM_API_KEY;

  if (!apiUrl || !apiKey) {
    logger.warn(
      "TeleCRM integration skipped: TELECRM_API_URL or TELECRM_API_KEY is not configured.",
      {
        operation,
        hasUrl: Boolean(apiUrl),
        hasKey: Boolean(apiKey),
      }
    );
    return {
      success: false,
      skipped: true,
      error: "TeleCRM credentials not configured in environment.",
    };
  }

  const maxAttempts = 2; // 1 initial attempt + 1 retry
  let lastError: Error | null = null;
  let responseData: unknown = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000), // 8-second timeout per attempt
      });

      const responseText = await response.text();
      try {
        responseData = responseText ? JSON.parse(responseText) : null;
      } catch {
        responseData = responseText;
      }

      if (response.ok) {
        logger.info("Successfully synced lead to TeleCRM", {
          operation,
          attempt,
          name: leadName,
          phoneMasked: formattedPhone.replace(/.(?=.{4})/g, "*"),
        });
        return { success: true, data: responseData };
      }

      // 4xx client errors (e.g. 401 Unauthorized, 400 Bad Request) shouldn't be retried
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        logger.error(
          `TeleCRM rejected lead with HTTP ${response.status}`,
          new Error(
            `HTTP ${response.status}: ${
              typeof responseData === "string"
                ? responseData
                : JSON.stringify(responseData)
            }`
          ),
          { operation, attempt, status: response.status }
        );
        return {
          success: false,
          error: `HTTP ${response.status}`,
          data: responseData,
        };
      }

      // 5xx server error or 429 rate limit
      throw new Error(
        `HTTP ${response.status}: ${
          typeof responseData === "string"
            ? responseData
            : JSON.stringify(responseData)
        }`
      );
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < maxAttempts) {
        logger.warn(
          `TeleCRM push attempt ${attempt} failed, retrying in 1 second...`,
          {
            operation,
            error: lastError.message,
          }
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  logger.error(
    "Failed to sync lead to TeleCRM after retry attempts",
    lastError,
    {
      operation,
      name: leadName,
      phoneMasked: formattedPhone.replace(/.(?=.{4})/g, "*"),
    }
  );

  return {
    success: false,
    error: lastError?.message || "Failed to push lead to TeleCRM",
    data: responseData,
  };
}

/**
 * Sends enquiry lead data to TeleCRM via its Async autoupdatelead endpoint.
 */
export async function sendEnquiryToTeleCRM(
  enquiry: TeleCrmLeadData
): Promise<TeleCrmResponse> {
  const operation = "sendEnquiryToTeleCRM";
  const formattedPhone = formatPhoneForTeleCRM(enquiry.number);
  if (!formattedPhone) {
    logger.warn("TeleCRM integration skipped: Invalid or empty phone number.", {
      operation,
      name: enquiry.name,
    });
    return {
      success: false,
      skipped: true,
      error: "Invalid phone number after normalization.",
    };
  }

  const leadSource = enquiry.source || "Website Enquiry";

  // Build TeleCRM Async autoupdatelead payload
  const payload: TeleCrmApiPayload = {
    fields: {
      name: enquiry.name.trim(),
      phone: formattedPhone,
      city: enquiry.location?.trim() || undefined,
      location: enquiry.location?.trim() || undefined,
      iam: enquiry.iam?.trim() || undefined,
      role: enquiry.iam?.trim() || undefined,
      message: enquiry.message?.trim() || undefined,
      status: enquiry.status || "new",
      source: leadSource,
      lead_source: leadSource,
    },
    actions: [
      {
        type: "SYSTEM_NOTE",
        text: [
          `Lead Source: ${leadSource}`,
          enquiry.location ? `City / Location: ${enquiry.location.trim()}` : null,
          enquiry.iam ? `Category / Role: ${enquiry.iam.trim()}` : null,
          enquiry.message ? `Message: ${enquiry.message.trim()}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
      },
    ],
  };

  return dispatchToTeleCRM(payload, enquiry.name, formattedPhone, operation);
}

/**
 * Sends booked visit lead data to TeleCRM via its Async autoupdatelead endpoint.
 */
export async function sendBookedVisitToTeleCRM(
  visit: TeleCrmBookedVisitData
): Promise<TeleCrmResponse> {
  const operation = "sendBookedVisitToTeleCRM";
  const formattedPhone = formatPhoneForTeleCRM(visit.number);
  if (!formattedPhone) {
    logger.warn("TeleCRM integration skipped: Invalid or empty phone number.", {
      operation,
      name: visit.name,
    });
    return {
      success: false,
      skipped: true,
      error: "Invalid phone number after normalization.",
    };
  }

  const leadSource = visit.source || "Website Booked Visit";

  const formattedDate = (() => {
    try {
      const d = new Date(visit.preferredDate);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-IN", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
    } catch {
      // ignore
    }
    return visit.preferredDate;
  })();

  // Build TeleCRM Async autoupdatelead payload for Booked Visit
  const payload: TeleCrmApiPayload = {
    fields: {
      name: visit.name.trim(),
      phone: formattedPhone,
      email: visit.email.trim().toLowerCase(),
      college: visit.college.trim(),
      location: visit.location.trim(),
      city: visit.location.trim(),
      residence: visit.location.trim(),
      preferred_date: formattedDate,
      status: visit.status || "new",
      source: leadSource,
      lead_source: leadSource,
    },
    actions: [
      {
        type: "SYSTEM_NOTE",
        text: [
          `Lead Type: Booked Visit (${leadSource})`,
          visit.location ? `Residence / Location: ${visit.location.trim()}` : null,
          formattedDate ? `Preferred Visit Date: ${formattedDate}` : null,
          visit.college ? `College: ${visit.college.trim()}` : null,
          visit.email ? `Email: ${visit.email.trim().toLowerCase()}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
      },
    ],
  };

  return dispatchToTeleCRM(payload, visit.name, formattedPhone, operation);
}
