/**
 * Imports content carried over from the previous website (scripts/legacy-content.json):
 *  - switches the Jalandhar city on
 *  - adds the Ambawadi (Ahmedabad) locality
 *  - adds Chapters VII, VIII and IX
 *  - adds the old blog posts on their old slugs
 *
 * Safe to run more than once: records are matched on slug and updated in place.
 * The database is picked from NODE_ENV like the app itself:
 *   NODE_ENV=development npx tsx scripts/import-legacy-content.ts
 *   NODE_ENV=production  npx tsx scripts/import-legacy-content.ts
 */
import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import connectToDatabase from "../src/lib/mongodb";
import { City } from "../src/models/city.model";
import { Locality } from "../src/models/locality.model";
import { Institute } from "../src/models/institute.model";
import { Amenity } from "../src/models/amenity.model";
import { Service } from "../src/models/service.model";
import { RentFrequency } from "../src/models/rent-frequency.model";
import { Hostel } from "../src/models/hostel.model";
import { Blog } from "../src/models/blog.model";
import type { BlogCategory } from "../src/types/blog.types";

interface FileRef {
  url: string;
  publickey: string;
}

interface LegacyHostel {
  slug: string;
  title: string;
  subtitle: string;
  tenantType: "girls" | "boys" | "co-ed";
  citySlug: string;
  localitySlug: string;
  instituteSlug: string | null;
  frontImage: FileRef;
  galleryImages: FileRef[];
  brochure: FileRef | null;
  rentAmount: number;
  rentFrequency: string;
  amenities: string[];
  description: string;
  address: string;
  mapUrl: string;
  latitude: number;
  longitude: number;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
}

interface LegacyBlog {
  title: string;
  slug: string;
  image: FileRef;
  category: BlogCategory;
  readDuration: number;
  subtitle: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  createdAt: string;
}

const NEW_LOCALITIES = [{ citySlug: "ahmedabad", name: "Ambawadi", slug: "ambawadi" }];
const CITIES_TO_ACTIVATE = ["jalandhar"];

async function run() {
  const file = path.join(__dirname, "legacy-content.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8")) as {
    hostels: LegacyHostel[];
    blogs: LegacyBlog[];
  };

  await connectToDatabase();
  console.log(`Database: ${mongoose.connection.name}`);

  // 1. Cities
  for (const slug of CITIES_TO_ACTIVATE) {
    const res = await City.updateOne({ slug }, { $set: { isActive: true } });
    console.log(`city ${slug}: matched ${res.matchedCount}, switched on ${res.modifiedCount}`);
  }

  // 2. Localities
  for (const loc of NEW_LOCALITIES) {
    const city = await City.findOne({ slug: loc.citySlug });
    if (!city) throw new Error(`City not found: ${loc.citySlug}`);
    const existing = await Locality.findOne({ slug: loc.slug });
    if (existing) {
      console.log(`locality ${loc.slug}: already there`);
    } else {
      await Locality.create({ name: loc.name, slug: loc.slug, city: city._id, isActive: true });
      console.log(`locality ${loc.slug}: created`);
    }
  }

  // 3. Hostels
  const services = await Service.find({ isActive: true }).select("_id").lean();
  for (const h of data.hostels) {
    const city = await City.findOne({ slug: h.citySlug });
    if (!city) throw new Error(`City not found: ${h.citySlug}`);
    const locality = await Locality.findOne({ slug: h.localitySlug, city: city._id });
    if (!locality) throw new Error(`Locality not found: ${h.localitySlug}`);
    const frequency = await RentFrequency.findOne({ name: h.rentFrequency });
    if (!frequency) throw new Error(`Rent frequency not found: ${h.rentFrequency}`);

    const amenityIds = [];
    for (const name of h.amenities) {
      const amenity = await Amenity.findOne({ name }).collation({ locale: "en", strength: 2 });
      if (!amenity) throw new Error(`Amenity not found: ${name}`);
      amenityIds.push(amenity._id);
    }

    const instituteIds = [];
    if (h.instituteSlug) {
      const institute = await Institute.findOne({ slug: h.instituteSlug, city: city._id });
      if (!institute) throw new Error(`Institute not found: ${h.instituteSlug}`);
      instituteIds.push(institute._id);
    }

    const doc = {
      title: h.title,
      slug: h.slug,
      subtitle: h.subtitle,
      tenantType: h.tenantType,
      isActive: true,
      frontImage: h.frontImage,
      galleryImages: h.galleryImages,
      rent: { amount: h.rentAmount, frequency: frequency._id },
      amenities: amenityIds,
      services: services.map((s) => s._id),
      institute: instituteIds,
      description: h.description,
      location: {
        city: city._id,
        locality: [locality._id],
        address: h.address,
        mapUrl: h.mapUrl,
        latitude: h.latitude,
        longitude: h.longitude,
      },
      ...(h.brochure ? { brochure: h.brochure } : {}),
      metadata: {
        title: h.metaTitle,
        description: h.metaDescription,
        keywords: h.metaKeywords,
      },
    };

    const existing = await Hostel.findOne({ slug: h.slug });
    if (existing) {
      existing.set(doc);
      await existing.save();
      console.log(`hostel ${h.slug}: updated`);
    } else {
      await Hostel.create(doc);
      console.log(`hostel ${h.slug}: created`);
    }
  }

  // 4. Blogs
  for (const b of data.blogs) {
    const doc = {
      title: b.title,
      slug: b.slug,
      subtitle: b.subtitle,
      image: b.image,
      category: b.category,
      readDuration: b.readDuration,
      isActive: true,
      description: b.description,
      metadata: {
        title: b.metaTitle,
        description: b.metaDescription,
        keywords: b.metaKeywords,
      },
    };

    const existing = await Blog.findOne({ slug: b.slug });
    if (existing) {
      existing.set(doc);
      await existing.save();
    } else {
      await Blog.create(doc);
    }
    // Keep the original publish date so the posts stay in their old order
    await Blog.collection.updateOne(
      { slug: b.slug },
      { $set: { createdAt: new Date(b.createdAt) } }
    );
    console.log(`blog ${b.slug}: ${existing ? "updated" : "created"}`);
  }

  console.log("Done.");
}

run()
  .catch((error) => {
    console.error("Import failed:", error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
