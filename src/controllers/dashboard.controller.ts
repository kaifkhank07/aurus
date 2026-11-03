import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Hostel } from "@/models/hostel.model";
import { BookedVisit } from "@/models/booked-visit.model";
import { Enquiry } from "@/models/enquiry.model";
import { City } from "@/models/city.model";
import { Admin } from "@/models/admin.model";
import { authenticateAdmin } from "@/middleware/admin-auth";
import { apiSuccess, apiError, isNextBailoutError } from "@/lib/api-response";
import { createLogger } from "@/lib/logger";
import {
  DashboardData,
  MonthlyTrendItem,
  TenantTypeDistributionItem,
  RecentCustomerActivityItem,
} from "@/types/dashboard.types";

const logger = createLogger("DashboardController");

/**
 * Generate metadata for the trailing 6 calendar months in chronological order.
 */
function getLast6Months(): { key: string; label: string; start: Date; end: Date }[] {
  const months = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const start = new Date(year, month, 1, 0, 0, 0, 0);
    const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
    const key = `${year}-${String(month + 1).padStart(2, "0")}`;
    const monthName = d.toLocaleDateString("en-US", { month: "short" });
    const yearShort = String(year).slice(-2);
    const label = `${monthName} '${yearShort}`;

    months.push({ key, label, start, end });
  }

  return months;
}

/**
 * Dynamically computes an SVG path string for a sparkline inside a viewBox of (width x height).
 */
function buildSparkline(values: number[], width = 120, height = 36): string {
  if (!values || values.length === 0) {
    return `M0 ${height / 2} L${width} ${height / 2}`;
  }

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const padding = 6;
  const availableHeight = height - padding * 2;
  const step = values.length > 1 ? width / (values.length - 1) : width;

  const points = values.map((val, idx) => {
    const x = Math.round(idx * step);
    const y = Math.round(height - padding - ((val - min) / range) * availableHeight);
    return `${idx === 0 ? "M" : "L"}${x} ${y}`;
  });

  return points.join(" ");
}

/**
 * GET /api/admin/dashboard
 * Aggregates real operational metrics across Hostels, Booked Visits, Enquiries, Cities, and Admins.
 */
export async function getDashboardStats(request: NextRequest): Promise<NextResponse> {
  const operation = "getDashboardStats";
  try {
    await authenticateAdmin(request);
    await connectToDatabase();

    const months = getLast6Months();
    const sixMonthsAgo = months[0].start;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Parallel fetch of all independent counts and aggregations
    const [
      // Residence portfolio counts
      activeHostelsCount,
      totalHostelsCount,
      boysHostelsCount,
      girlsHostelsCount,
      coedHostelsCount,
      inactiveHostelsCount,

      // Unique city IDs with live hostels
      liveCityIds,

      // Leads: Booked Visits
      newVisitsCount,
      totalVisitsCount,
      upcomingVisitsCount,
      completedVisitsCount,

      // Leads: Enquiries
      newEnquiriesCount,
      totalEnquiriesCount,
      completedEnquiriesCount,

      // Active Admins
      activeAdminsCount,

      // 6-Month Monthly Aggregations
      monthlyHostelsAgg,
      monthlyVisitsAgg,
      monthlyEnquiriesAgg,
      monthlyCompletedVisitsAgg,
      monthlyCompletedEnquiriesAgg,

      // Recent Customer Records
      recentEnquiriesDocs,
      recentVisitsDocs,
    ] = await Promise.all([
      // Hostels
      Hostel.countDocuments({ isActive: true }),
      Hostel.countDocuments(),
      Hostel.countDocuments({ tenantType: "boys", isActive: true }),
      Hostel.countDocuments({ tenantType: "girls", isActive: true }),
      Hostel.countDocuments({ tenantType: "co-ed", isActive: true }),
      Hostel.countDocuments({ isActive: false }),

      // Live Cities
      Hostel.distinct("location.city", { isActive: true }),

      // Booked Visits
      BookedVisit.countDocuments({ status: "new" }),
      BookedVisit.countDocuments(),
      BookedVisit.countDocuments({ preferredDate: { $gte: startOfToday } }),
      BookedVisit.countDocuments({ status: "complete" }),

      // Enquiries
      Enquiry.countDocuments({ status: "new" }),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: "complete" }),

      // Admins
      Admin.countDocuments({ status: "active" }),

      // Monthly Residence additions (for sparkline)
      Hostel.aggregate<{ _id: string; count: number }>([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
      ]),

      // Monthly Booked Visits
      BookedVisit.aggregate<{ _id: string; count: number }>([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
      ]),

      // Monthly Enquiries
      Enquiry.aggregate<{ _id: string; count: number }>([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
      ]),

      // Monthly Completed Visits (for resolution sparkline)
      BookedVisit.aggregate<{ _id: string; count: number }>([
        { $match: { status: "complete", updatedAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$updatedAt" } },
            count: { $sum: 1 },
          },
        },
      ]),

      // Monthly Completed Enquiries (for resolution sparkline)
      Enquiry.aggregate<{ _id: string; count: number }>([
        { $match: { status: "complete", updatedAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$updatedAt" } },
            count: { $sum: 1 },
          },
        },
      ]),

      // Recent 5 Enquiries
      Enquiry.find().sort({ createdAt: -1 }).limit(5).lean(),

      // Recent 5 Booked Visits
      BookedVisit.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    // Count operational cities that are active in City collection
    const operationalCitiesCount = liveCityIds.length > 0
      ? await City.countDocuments({ _id: { $in: liveCityIds }, isActive: true })
      : 0;

    // Monthly maps for O(1) lookup
    const hostelsMap = new Map(monthlyHostelsAgg.map((item) => [item._id, item.count]));
    const visitsMap = new Map(monthlyVisitsAgg.map((item) => [item._id, item.count]));
    const enquiriesMap = new Map(monthlyEnquiriesAgg.map((item) => [item._id, item.count]));
    const completedVisitsMap = new Map(monthlyCompletedVisitsAgg.map((item) => [item._id, item.count]));
    const completedEnquiriesMap = new Map(monthlyCompletedEnquiriesAgg.map((item) => [item._id, item.count]));

    // Build Monthly Trend Series for the main chart
    const monthlyTrend: MonthlyTrendItem[] = months.map((m) => {
      const eCount = enquiriesMap.get(m.key) || 0;
      const vCount = visitsMap.get(m.key) || 0;
      return {
        month: m.label,
        key: m.key,
        enquiries: eCount,
        bookedVisits: vCount,
        total: eCount + vCount,
      };
    });

    // Generate Sparkline data arrays for the 4 KPI cards
    const residencesMonthlyTrend = months.map((m) => hostelsMap.get(m.key) || 0);
    const leadsMonthlyTrend = monthlyTrend.map((m) => m.total);
    const visitsMonthlyTrend = monthlyTrend.map((m) => m.bookedVisits);
    const resolutionMonthlyTrend = months.map((m) => {
      const resolved = (completedVisitsMap.get(m.key) || 0) + (completedEnquiriesMap.get(m.key) || 0);
      const total = (visitsMap.get(m.key) || 0) + (enquiriesMap.get(m.key) || 0);
      return total > 0 ? Math.round((resolved / total) * 100) : 0;
    });

    // KPI 2: Combined new leads and total leads
    const combinedNewLeads = newVisitsCount + newEnquiriesCount;
    const combinedTotalLeads = totalVisitsCount + totalEnquiriesCount;

    // KPI 4: Overall resolution rate
    const combinedCompletedLeads = completedVisitsCount + completedEnquiriesCount;
    const resolutionRate = combinedTotalLeads > 0
      ? Math.round((combinedCompletedLeads / combinedTotalLeads) * 100)
      : 0;

    // Portfolio Distribution by Tenant Type
    const tenantDistribution: TenantTypeDistributionItem[] = [
      {
        label: "Boys Residences",
        tenantType: "boys",
        count: boysHostelsCount,
        total: totalHostelsCount,
        percentage: totalHostelsCount > 0 ? Math.round((boysHostelsCount / totalHostelsCount) * 100) : 0,
        tone: "bg-sky-500",
      },
      {
        label: "Girls Residences",
        tenantType: "girls",
        count: girlsHostelsCount,
        total: totalHostelsCount,
        percentage: totalHostelsCount > 0 ? Math.round((girlsHostelsCount / totalHostelsCount) * 100) : 0,
        tone: "bg-pink-500",
      },
      {
        label: "Co-living Residences",
        tenantType: "co-ed",
        count: coedHostelsCount,
        total: totalHostelsCount,
        percentage: totalHostelsCount > 0 ? Math.round((coedHostelsCount / totalHostelsCount) * 100) : 0,
        tone: "bg-emerald-500",
      },
      {
        label: "Inactive Residences",
        tenantType: "inactive",
        count: inactiveHostelsCount,
        total: totalHostelsCount,
        percentage: totalHostelsCount > 0 ? Math.round((inactiveHostelsCount / totalHostelsCount) * 100) : 0,
        tone: "bg-slate-400",
      },
    ];

    // Combine recent customer activity (Top 5 across BookedVisit & Enquiry)
    const recentActivity: RecentCustomerActivityItem[] = [
      ...recentEnquiriesDocs.map((e) => ({
        id: e._id.toString(),
        customerName: e.name,
        contactNumber: e.number,
        activityType: "Enquiry" as const,
        location: e.location || "General Inquiry",
        status: (e.status || "new") as "new" | "read" | "complete",
        createdAt: e.createdAt ? e.createdAt.toISOString() : new Date().toISOString(),
      })),
      ...recentVisitsDocs.map((v) => ({
        id: v._id.toString(),
        customerName: v.name,
        contactNumber: v.number,
        activityType: "Visit Request" as const,
        location: v.location || "Property Visit",
        status: (v.status || "new") as "new" | "read" | "complete",
        createdAt: v.createdAt ? v.createdAt.toISOString() : new Date().toISOString(),
      })),
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const payload: DashboardData = {
      welcome: {
        activeResidences: activeHostelsCount,
        newLeads: combinedNewLeads,
        operationalCities: operationalCitiesCount,
        activeTeam: activeAdminsCount,
      },
      kpis: {
        activeResidences: {
          active: activeHostelsCount,
          total: totalHostelsCount,
          sparkline: buildSparkline(residencesMonthlyTrend),
        },
        newLeads: {
          count: combinedNewLeads,
          totalLeads: combinedTotalLeads,
          sparkline: buildSparkline(leadsMonthlyTrend),
        },
        upcomingVisits: {
          upcoming: upcomingVisitsCount,
          total: totalVisitsCount,
          sparkline: buildSparkline(visitsMonthlyTrend),
        },
        resolutionRate: {
          rate: resolutionRate,
          resolved: combinedCompletedLeads,
          total: combinedTotalLeads,
          sparkline: buildSparkline(resolutionMonthlyTrend),
        },
      },
      monthlyTrend,
      tenantDistribution,
      recentActivity,
    };

    logger.info("Dashboard stats retrieved successfully", {
      operation,
      activeHostels: activeHostelsCount,
      totalHostels: totalHostelsCount,
      newLeads: combinedNewLeads,
      resolutionRate,
    });

    return apiSuccess(payload, "Dashboard metrics retrieved successfully.");
  } catch (error) {
    if (isNextBailoutError(error)) {
      throw error;
    }
    logger.error("Failed to retrieve dashboard metrics", error, { operation });
    return apiError(
      error instanceof Error ? error.message : "Failed to load dashboard metrics.",
      500
    );
  }
}

