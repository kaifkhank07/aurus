import { NextRequest } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import { Hostel } from "@/models/hostel.model";
import { City } from "@/models/city.model";
import "@/models/locality.model";
import "@/models/amenity.model";
import { apiSuccess, apiError, isNextBailoutError } from "@/lib/api-response";

/**
 * GET /api/residences
 * Retrieves public active residences with optional filtering by citySlug, cityId, tenantType, and search.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const citySlug = searchParams.get("citySlug")?.trim().toLowerCase();
    const cityId = searchParams.get("cityId")?.trim();
    const search = searchParams.get("search")?.trim();
    const tenantType = searchParams.get("tenantType")?.trim();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10) || 20));

    await connectToDatabase();

    // Base filter: only active/published residences
    const filter: Record<string, unknown> = { isActive: true };

    // City filtering
    if (citySlug) {
      const cityDoc = await City.findOne({ slug: citySlug, isActive: true }).select("_id").lean();
      if (!cityDoc) {
        return apiSuccess({ items: [], total: 0, page, limit, totalPages: 0 }, "No residences found");
      }
      filter["location.city"] = cityDoc._id;
    } else if (cityId && mongoose.Types.ObjectId.isValid(cityId)) {
      filter["location.city"] = new mongoose.Types.ObjectId(cityId);
    }

    // Tenant type filtering
    if (tenantType) {
      filter.tenantType = tenantType;
    }

    // Text search filtering
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { title: { $regex: escaped, $options: "i" } },
        { subtitle: { $regex: escaped, $options: "i" } },
        { "location.address": { $regex: escaped, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Hostel.find(filter)
        .populate("location.city", "city state country slug")
        .populate("location.locality", "name slug")
        .populate("amenities", "name image")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Hostel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return apiSuccess(
      {
        items,
        total,
        page,
        limit,
        totalPages,
      },
      "Residences retrieved successfully"
    );
  } catch (error) {
    if (isNextBailoutError(error)) {
      throw error;
    }
    console.error("[GET /api/residences] Error:", error);
    return apiError("Failed to retrieve residences", 500);
  }
}
