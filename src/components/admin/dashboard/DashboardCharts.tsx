"use client";

import React from "react";
import { Card, CardHead } from "../ui/AdminUI";
import { useThemeStore } from "@/store/useThemeStore";
import { MonthlyTrendItem, TenantTypeDistributionItem } from "@/types/dashboard.types";

export interface DashboardChartsProps {
  monthlyTrend?: MonthlyTrendItem[];
  tenantDistribution?: TenantTypeDistributionItem[];
  loading?: boolean;
}

export default function DashboardCharts({
  monthlyTrend = [],
  tenantDistribution = [],
  loading = false,
}: DashboardChartsProps) {
  const { palette } = useThemeStore();

  // Fallback 6 months if not loaded yet
  const fallbackMonths = ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6"];
  const displayMonths = monthlyTrend.length > 0
    ? monthlyTrend.map((m) => m.month)
    : fallbackMonths;

  // Extract series
  const enquiriesSeries = monthlyTrend.map((m) => m.enquiries);
  const visitsSeries = monthlyTrend.map((m) => m.bookedVisits);

  const maxVal = Math.max(
    ...enquiriesSeries,
    ...visitsSeries,
    5
  );

  const width = 600;
  const height = 240;
  const topPad = 25;
  const bottomPad = 35;
  const plotHeight = height - topPad - bottomPad;
  const n = displayMonths.length;

  const getPoints = (values: number[]) => {
    return values.map((val, i) => {
      const x = n > 1 ? Math.round((i / (n - 1)) * width) : width / 2;
      const y = Math.round(height - bottomPad - ((val || 0) / maxVal) * plotHeight);
      return { x, y, val };
    });
  };

  const enquiriesPoints = getPoints(enquiriesSeries.length ? enquiriesSeries : [0, 0, 0, 0, 0, 0]);
  const visitsPoints = getPoints(visitsSeries.length ? visitsSeries : [0, 0, 0, 0, 0, 0]);

  const enquiriesLine = enquiriesPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
  const enquiriesArea = `${enquiriesLine} L${width} ${height - bottomPad} L0 ${height - bottomPad} Z`;

  const visitsLine = visitsPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");

  // Default distribution fallback if empty
  const defaultDistributions: TenantTypeDistributionItem[] = [
    { label: "Boys Residences", tenantType: "boys", count: 0, total: 0, percentage: 0, tone: "bg-sky-500" },
    { label: "Girls Residences", tenantType: "girls", count: 0, total: 0, percentage: 0, tone: "bg-pink-500" },
    { label: "Co-living Residences", tenantType: "co-ed", count: 0, total: 0, percentage: 0, tone: "bg-emerald-500" },
    { label: "Inactive Residences", tenantType: "inactive", count: 0, total: 0, percentage: 0, tone: "bg-slate-400" },
  ];

  const distributionList = tenantDistribution.length > 0 ? tenantDistribution : defaultDistributions;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      {/* 6-Month Activity Area Chart (2 Cols) */}
      <Card className="lg:col-span-2">
        <CardHead
          title="Growth & Operational Analytics"
          sub="6-month trend in resident inquiries and scheduled booked visits"
          right={
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: palette.primaryHex }}
                />
                <span className="text-slate-600">Enquiries</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Booked Visits</span>
              </div>
            </div>
          }
        />

        <div className="pt-2 pb-1">
          {loading ? (
            <div className="h-56 flex items-center justify-center text-xs text-slate-400">
              Loading analytics data…
            </div>
          ) : (
            <>
              <div className="relative w-full h-56">
                <svg
                  className="w-full h-full"
                  viewBox={`0 0 ${width} ${height}`}
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="dashboardEnquiriesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={palette.primaryHex} stopOpacity="0.25" />
                      <stop offset="100%" stopColor={palette.primaryHex} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Guide Lines */}
                  <g stroke="#f1f5f9" strokeWidth="1">
                    <line x1="0" y1={topPad} x2={width} y2={topPad} />
                    <line x1="0" y1={topPad + plotHeight * 0.33} x2={width} y2={topPad + plotHeight * 0.33} />
                    <line x1="0" y1={topPad + plotHeight * 0.66} x2={width} y2={topPad + plotHeight * 0.66} />
                    <line x1="0" y1={height - bottomPad} x2={width} y2={height - bottomPad} />
                  </g>

                  {/* Enquiries Area Fill */}
                  <path d={enquiriesArea} fill="url(#dashboardEnquiriesGrad)" />

                  {/* Enquiries Line */}
                  <path
                    d={enquiriesLine}
                    fill="none"
                    stroke={palette.primaryHex}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Booked Visits Line */}
                  <path
                    d={visitsLine}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Enquiries Point Dots */}
                  {enquiriesPoints.map((p, idx) => (
                    <circle
                      key={`enq-point-${idx}`}
                      cx={p.x}
                      cy={p.y}
                      r={4}
                      fill={palette.primaryHex}
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ))}

                  {/* Visits Point Dots */}
                  {visitsPoints.map((p, idx) => (
                    <circle
                      key={`vis-point-${idx}`}
                      cx={p.x}
                      cy={p.y}
                      r={3.5}
                      fill="#10b981"
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ))}
                </svg>
              </div>

              {/* Dynamic Month Labels */}
              <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-2 px-1">
                {displayMonths.map((m, idx) => (
                  <span key={`${m}-${idx}`}>{m}</span>
                ))}
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Residence Breakdown (1 Col) */}
      <Card>
        <CardHead
          title="Portfolio Distribution"
          sub="Breakdown across tenant categories & occupancy status"
        />

        <div className="space-y-4 py-2">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Loading distribution…
            </div>
          ) : (
            distributionList.map((item) => (
              <div key={item.tenantType} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">{item.label}</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {item.count}{" "}
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({item.percentage}%)
                    </span>
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.tone} transition-all duration-700`}
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
