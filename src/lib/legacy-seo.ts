import rawPages from "@/data/city/legacySeoPages.json";
import type { FooterLinkColumn, FooterLinkItem } from "@/data/city/cityFooterLinks";

/**
 * SEO listing pages carried over from the previous auruslife.com website.
 *
 * The old site ranked on these URLs with hand-written titles, descriptions,
 * H1s, intro copy, bottom copy and FAQs. `legacySeoPages.json` is an export of
 * that data (old tables aurus_seo_meta + aurus_seo_faq), keyed by the old URL.
 *
 * URL shapes kept exactly as they were:
 *   city      /{prefix}-listing/{city}
 *   locality  /{prefix}-listings/{locality}/{city}
 *   college   /{prefix}_listings/{college}/{city}      (pg and hostel only)
 */

export const SITE_URL = "https://www.auruslife.com";
export const LEGACY_OG_IMAGE = `${SITE_URL}/front/assets/img/oglogo.jpg`;

export type ListingPrefix =
  | "pg"
  | "girls-pg"
  | "boys-pg"
  | "hostel"
  | "girls-hostel"
  | "boys-hostel";

export type ListingKind = "city" | "locality" | "institute";

export interface LegacyFaq {
  question: string;
  answer: string;
}

export interface LegacySeoPage {
  /** Old URL path with its original letter case, e.g. /pg-listings/Vile-parle/mumbai */
  path: string;
  kind: ListingKind;
  prefix: ListingPrefix;
  gender: "" | "girls" | "boys";
  category: "PG" | "Hostel";
  citySlug: string;
  cityName: string;
  /** Locality / college slug used in the old URL */
  oldSlug: string | null;
  /** Matching locality / institute slug in the current database, if there is one */
  newSlug: string | null;
  name: string;
  title?: string;
  description?: string;
  keywords?: string;
  h1?: string;
  intro?: string;
  bottomTitle?: string;
  bottomDesc?: string[];
  faqs: LegacyFaq[];
}

const pages = rawPages as LegacySeoPage[];

const byPath = new Map<string, LegacySeoPage>();
for (const page of pages) {
  byPath.set(page.path.toLowerCase(), page);
}

const norm = (value?: string | null) => (value || "").toLowerCase().trim();

export const LISTING_PREFIXES: ListingPrefix[] = [
  "pg",
  "girls-pg",
  "boys-pg",
  "hostel",
  "girls-hostel",
  "boys-hostel",
];

export function prefixGender(prefix: ListingPrefix): "girls" | "boys" | undefined {
  if (prefix.startsWith("girls")) return "girls";
  if (prefix.startsWith("boys")) return "boys";
  return undefined;
}

export function prefixLabel(prefix: ListingPrefix): string {
  switch (prefix) {
    case "pg":
      return "PG";
    case "girls-pg":
      return "Girls PG";
    case "boys-pg":
      return "Boys PG";
    case "hostel":
      return "Hostel";
    case "girls-hostel":
      return "Girls Hostel";
    case "boys-hostel":
      return "Boys Hostel";
  }
}

/** Plain URL shape for a listing page when the old site had no record of it. */
export function buildListingPath(
  prefix: ListingPrefix,
  kind: ListingKind,
  citySlug: string,
  slug?: string | null
): string {
  if (kind === "city" || !slug) return `/${prefix}-listing/${citySlug}`;
  if (kind === "institute") return `/${prefix}_listings/${slug}/${citySlug}`;
  return `/${prefix}-listings/${slug}/${citySlug}`;
}

/** Looks a page up by the URL it had on the old site (case-insensitive, as the old site was). */
export function findLegacyByPath(path: string): LegacySeoPage | undefined {
  return byPath.get(norm(path).replace(/\/+$/, ""));
}

export function findLegacyCityPage(
  prefix: ListingPrefix,
  citySlug: string
): LegacySeoPage | undefined {
  return findLegacyByPath(buildListingPath(prefix, "city", norm(citySlug)));
}

/** Looks a locality / college page up by the slug used in the current database. */
export function findLegacyByNewSlug(
  prefix: ListingPrefix,
  kind: "locality" | "institute",
  citySlug: string,
  newSlug: string
): LegacySeoPage | undefined {
  const city = norm(citySlug);
  const slug = norm(newSlug);
  return pages.find(
    (p) =>
      p.prefix === prefix &&
      p.kind === kind &&
      p.citySlug === city &&
      norm(p.newSlug) === slug
  );
}

/**
 * The public URL of a listing page: the old URL when the old site had the page,
 * otherwise the same URL shape built from the current slugs.
 */
export function listingPath(
  prefix: ListingPrefix,
  kind: ListingKind,
  citySlug: string,
  newSlug?: string | null
): string {
  const city = norm(citySlug);
  if (kind === "city" || !newSlug) {
    return findLegacyCityPage(prefix, city)?.path || buildListingPath(prefix, "city", city);
  }
  const legacy = findLegacyByNewSlug(prefix, kind, city, newSlug);
  return legacy?.path || buildListingPath(prefix, kind, city, norm(newSlug));
}

export function legacyPagesForCity(citySlug: string): LegacySeoPage[] {
  const city = norm(citySlug);
  return pages.filter((p) => p.citySlug === city);
}

/* ------------------------------------------------------------------ */
/* Default copy the old listing template showed when a page had none   */
/* ------------------------------------------------------------------ */

export function defaultBottomContent(cityName: string): { title: string; paragraphs: string[] } {
  const city = cityName || "Mumbai";
  return {
    title: `Aurus – Safe, Stylish, and Comfortable PG in ${city}`,
    paragraphs: [
      `Finding the perfect PG in ${city} shouldn’t feel like a compromise. It should feel like an upgrade! At Aurus, we bring you a premium co-living experience designed for comfort, security, and convenience.`,
      "Imagine waking up in a fully furnished, air-conditioned room, starting your day with a nutritious meal, and unwinding in a vibrant community after college. With 24/7 security, housekeeping, high-speed WiFi, and dedicated study spaces, we ensure a stress-free stay.",
      "Step into a lifestyle where you can study, socialize, and sleep peacefully. Ready to make the move?",
    ],
  };
}

export function defaultListingFaqs(cityName: string): LegacyFaq[] {
  const city = cityName || "Mumbai";
  return [
    {
      question: `What makes Aurus the best PG in ${city}?`,
      answer:
        "Aurus offers a safe, modern, and fully furnished PG with top-tier amenities, including gym access, study zones, housekeeping, and security.",
    },
    {
      question: "Is the Aurus PG safe and secure?",
      answer:
        "Yes! We provide 24/7 security, CCTV surveillance, biometric access, and on-site staff for complete peace of mind.",
    },
    {
      question: "What facilities are included at Aurus PG?",
      answer:
        "Enjoy high-speed WiFi, laundry services, housekeeping, fitness centers, common lounges, and chef-prepared meals, all designed for an effortless stay.",
    },
    {
      question: "Do you offer single and shared accommodation?",
      answer:
        "Yes! Choose between private rooms for privacy or shared rooms for affordability, all with premium furnishings.",
    },
    {
      question: "Is the PG near major colleges and offices?",
      answer:
        "Definitely! Aurus is strategically located near top universities, business hubs, and transport links, making daily commutes easy.",
    },
    {
      question: "What is included in the monthly rent?",
      answer:
        "Your rent covers furnished rooms, all utilities, meals, housekeeping, WiFi, and access to premium facilities with no hidden costs!",
    },
    {
      question: "How can I book my stay at Aurus?",
      answer: `Booking is simple! Visit our website, explore available PG in ${city}, and schedule a tour or apply online for a hassle-free move-in.`,
    },
  ];
}

export interface ListingSeoContent {
  h1?: string;
  intro?: string;
  bottomTitle: string;
  bottomParagraphs: string[];
  faqs: LegacyFaq[];
}

/** On-page copy for a listing page: the old page's own copy, falling back to the old template defaults. */
export function listingSeoContent(
  legacy: LegacySeoPage | undefined,
  cityName: string
): ListingSeoContent {
  const fallback = defaultBottomContent(cityName);
  const hasOwnBottom = Boolean(legacy?.bottomTitle || legacy?.bottomDesc?.length);
  return {
    h1: legacy?.h1 || undefined,
    intro: legacy?.intro || undefined,
    bottomTitle: legacy?.bottomTitle || fallback.title,
    bottomParagraphs:
      hasOwnBottom && legacy?.bottomDesc?.length ? legacy.bottomDesc : fallback.paragraphs,
    faqs: legacy?.faqs?.length ? legacy.faqs : defaultListingFaqs(cityName),
  };
}

/* ------------------------------------------------------------------ */
/* Footer "popular searches" links                                     */
/* ------------------------------------------------------------------ */

interface PlaceInput {
  name: string;
  slug: string;
}

/**
 * Builds the SEO footer link columns for a city using the old URLs.
 * Every locality / institute in the database is listed, plus any old page
 * that had its own SEO copy but has no matching database record yet.
 */
export function buildCityFooterColumns(
  cityName: string,
  citySlug: string,
  localities: PlaceInput[] = [],
  institutes: PlaceInput[] = []
): FooterLinkColumn[] {
  const city = norm(citySlug);
  const legacy = legacyPagesForCity(city);

  const cityLinks = (prefixes: ListingPrefix[], labels: string[]): FooterLinkItem[] =>
    prefixes.map((prefix, i) => ({
      label: labels[i],
      href: listingPath(prefix, "city", city),
    }));

  const columns: FooterLinkColumn[] = [
    {
      title: `PG in ${cityName}`,
      links: cityLinks(
        ["pg", "girls-pg", "boys-pg"],
        [`PG in ${cityName}`, `Girls PG in ${cityName}`, `Boys PG in ${cityName}`]
      ),
    },
    {
      title: `Hostels in ${cityName}`,
      links: cityLinks(
        ["hostel", "girls-hostel", "boys-hostel"],
        [`Hostels in ${cityName}`, `Girls Hostels in ${cityName}`, `Boys Hostels in ${cityName}`]
      ),
    },
  ];

  const placeLinks = (
    kind: "locality" | "institute",
    prefixes: ListingPrefix[],
    places: PlaceInput[]
  ): FooterLinkItem[] => {
    const links: FooterLinkItem[] = [];
    const seen = new Set<string>();
    const push = (prefix: ListingPrefix, name: string, href: string) => {
      const key = href.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      links.push({ label: `${prefixLabel(prefix)} near ${name}`, href });
    };

    // 1. Places that exist in the database
    for (const place of places) {
      for (const prefix of prefixes) {
        push(prefix, place.name, listingPath(prefix, kind, city, place.slug));
      }
    }

    // 2. Old pages with no database record (kept so their URLs stay linked)
    const knownSlugs = new Set(places.map((p) => norm(p.slug)));
    for (const page of legacy) {
      if (page.kind !== kind || !prefixes.includes(page.prefix)) continue;
      if (page.newSlug && knownSlugs.has(norm(page.newSlug))) continue;
      push(page.prefix, page.name, page.path);
    }
    return links;
  };

  const localityPg = placeLinks("locality", ["pg", "girls-pg", "boys-pg"], localities);
  if (localityPg.length) columns.push({ title: "PG Near You", links: localityPg });

  const localityHostel = placeLinks(
    "locality",
    ["hostel", "girls-hostel", "boys-hostel"],
    localities
  );
  if (localityHostel.length) columns.push({ title: "Hostels Near You", links: localityHostel });

  const college = placeLinks("institute", ["pg", "hostel"], institutes);
  if (college.length) columns.push({ title: "Hostels near your college", links: college });

  return columns;
}
