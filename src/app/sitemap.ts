import type { MetadataRoute } from "next";
import connectToDatabase from "@/lib/mongodb";
import { City } from "@/models/city.model";
import { Hostel } from "@/models/hostel.model";
import { Blog } from "@/models/blog.model";
import { getCityFooterColumns } from "@/lib/city-listing-helpers";
import { SITE_URL } from "@/lib/legacy-seo";

// Rebuilt at most once an hour so new hostels, blogs and cities appear on their own
export const revalidate = 3600;

const STATIC_PATHS = [
  "/life-at-aurus",
  "/about",
  "/hostels",
  "/contact",
  "/blogs",
  "/real-stories",
  "/faq",
  "/student-hostels",
  "/managed-hostels",
  "/developers",
  "/aurusyear",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, priority: 1 },
    ...STATIC_PATHS.map((path) => ({ url: `${SITE_URL}${path}`, priority: 0.8 })),
  ];

  try {
    await connectToDatabase();

    const cities = await City.find({ isActive: true }).select("slug updatedAt").lean();

    // City pages
    for (const city of cities) {
      if (!city.slug) continue;
      entries.push({
        url: `${SITE_URL}/hostels/${city.slug}`,
        lastModified: city.updatedAt,
        priority: 0.8,
      });
    }

    // SEO listing pages (PG / hostel by city, locality and college) — the same
    // links shown in each city's footer, on the URLs the previous website used
    const seen = new Set<string>();
    for (const city of cities) {
      if (!city.slug) continue;
      const footer = await getCityFooterColumns(city.slug);
      for (const column of footer?.columns || []) {
        for (const link of column.links) {
          const key = link.href.toLowerCase();
          if (seen.has(key)) continue;
          seen.add(key);
          entries.push({ url: `${SITE_URL}${encodeURI(link.href)}`, priority: 0.64 });
        }
      }
    }

    // Hostel detail pages
    const hostels = await Hostel.find({ isActive: true }).select("slug updatedAt").lean();
    for (const hostel of hostels) {
      if (!hostel.slug) continue;
      entries.push({
        url: `${SITE_URL}/hostel-details/${hostel.slug}`,
        lastModified: hostel.updatedAt,
        priority: 0.8,
      });
    }

    // Blog posts
    const blogs = await Blog.find({ isActive: true }).select("slug updatedAt").lean();
    for (const blog of blogs) {
      if (!blog.slug) continue;
      entries.push({
        url: `${SITE_URL}/blog-details/${blog.slug}`,
        lastModified: blog.updatedAt,
        priority: 0.64,
      });
    }
  } catch (error) {
    console.warn("[sitemap] Could not load dynamic URLs:", error);
  }

  return entries;
}
