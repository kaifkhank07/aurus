"use client";

import React from "react";
import { Card, CardHead } from "../ui/AdminUI";
import { useThemeStore } from "@/store/useThemeStore";

export default function DashboardCharts() {
  const { palette } = useThemeStore();
  const months = ["May '26", "Jun '26", "Jul '26", "Aug '26", "Sep '26", "Oct '26"];
  const linePath = "M0 160 L120 130 L240 145 L360 85 L480 100 L600 40";
  const fillPath = `${linePath} L600 240 L0 240 Z`;

  const distributions = [
    { label: "Active Residences", count: 14, total: 18, tone: "bg-emerald-500" },
    { label: "Pending Verification", count: 3, total: 18, tone: "bg-amber-500" },
    { label: "Under Maintenance", count: 1, total: 18, tone: "bg-slate-400" },
    { label: "Waitlisted Inquiries", count: 12, total: 42, tone: "bg-orange-500" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      {/* 6-Month Activity Area Chart (2 Cols) */}
      <Card className="lg:col-span-2">
        <CardHead
          title="Growth & Operational Analytics"
          sub="6-month trend in resident inquiries and platform activity"
        />

        <div className="pt-2 pb-1">
          <div className="relative w-full h-56">
            <svg
              className="w-full h-full"
              viewBox="0 0 600 240"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={palette.primaryHex} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={palette.primaryHex} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <g stroke="#f1f5f9" strokeWidth="1">
                <line x1="0" y1="48" x2="600" y2="48" />
                <line x1="0" y1="96" x2="600" y2="96" />
                <line x1="0" y1="144" x2="600" y2="144" />
                <line x1="0" y1="192" x2="600" y2="192" />
              </g>

              {/* Filled Area */}
              <path d={fillPath} fill="url(#chartGrad)" />

              {/* Stroke Line */}
              <path
                d={linePath}
                fill="none"
                stroke={palette.primaryHex}
                strokeWidth="3.2"
                strokeLinecap="round"
              />

              {/* Data Points */}
              <circle cx="600" cy="40" r="5" fill={palette.primaryHex} stroke="#ffffff" strokeWidth="2.5" />
            </svg>
          </div>

          {/* Month Labels */}
          <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-2 px-1">
            {months.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
      </Card>

      {/* Residence & Inquiry Distribution Breakdown (1 Col) */}
      <Card>
        <CardHead
          title="Portfolio Distribution"
          sub="Operational status breakdown across active assets"
        />

        <div className="space-y-4 py-2">
          {distributions.map((item) => {
            const pct = Math.round((item.count / item.total) * 100);
            return (
              <div key={item.label} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">{item.label}</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {item.count}{" "}
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({pct}%)
                    </span>
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.tone} transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
