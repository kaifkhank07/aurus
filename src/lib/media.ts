/**
 * Aurus Shared Media Utility
 *
 * Centralized, isomorphic helper to resolve, build, and format stable media URLs
 * for AWS S3 and CloudFront.
 */

/**
 * Resolves a complete, stable media URL from an S3 object key or an existing URL.
 *
 * Rules:
 * - Returns null for null, undefined, or empty string.
 * - Preserves existing valid absolute URLs (http:// or https://).
 * - Strips leading slashes from object keys and encodes path segments properly.
 * - Prioritizes CloudFront domain if configured (via AWS_CLOUDFRONT_DOMAIN or NEXT_PUBLIC_AWS_CLOUDFRONT_DOMAIN).
 * - Constructs standard regional S3 URL (https://<bucket>.s3.<region>.amazonaws.com/<key>).
 */
export function getMediaUrl(keyOrUrl?: string | null): string | null {
  if (!keyOrUrl || typeof keyOrUrl !== "string") {
    return null;
  }

  const trimmed = keyOrUrl.trim();
  if (trimmed === "") {
    return null;
  }

  // 1. If it's already an absolute URL, check if it points to the old legacy fallback "aurus.s3.amazonaws.com"
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    // If it was mistakenly saved with the old "aurus.s3.amazonaws.com" fallback, extract the key and reconstruct
    if (trimmed.includes("aurus.s3.amazonaws.com/")) {
      const parts = trimmed.split("aurus.s3.amazonaws.com/");
      if (parts[1]) {
        return buildS3Url(parts[1]);
      }
    }
    return trimmed;
  }

  return buildS3Url(trimmed);
}

/**
 * Internal helper to construct S3 or CloudFront URL from a relative key
 */
function buildS3Url(key: string): string {
  const cleanKey = key.replace(/^\/+/, "");

  // Safely encode individual path segments without encoding the '/' delimiters
  const encodedKey = cleanKey
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  // 1. Check for CloudFront CDN domain
  const cloudFrontDomain =
    process.env.AWS_CLOUDFRONT_DOMAIN ||
    process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_DOMAIN;

  if (cloudFrontDomain && cloudFrontDomain.trim().length > 0) {
    const domain = cloudFrontDomain
      .replace(/^https?:\/\//, "")
      .replace(/\/+$/, "");
    return `https://${domain}/${encodedKey}`;
  }

  // 2. Standard regional S3 bucket URL
  const bucket =
    process.env.AWS_S3_BUCKET_NAME ||
    process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME ||
    "apnapackertestingbucket";

  const region =
    process.env.AWS_REGION ||
    process.env.NEXT_PUBLIC_AWS_REGION ||
    "ap-south-1";

  return `https://${bucket}.s3.${region}.amazonaws.com/${encodedKey}`;
}

