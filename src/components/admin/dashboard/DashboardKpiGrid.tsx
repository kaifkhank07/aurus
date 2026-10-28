"use client";

import React from "react";
import { Card, Chip, Sparkline } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";

export interface DashboardKpiGridProps {
  totalAdmins: number;
  activeAdmins: number;
  totalResidences?: number;
  activeInquiries?: number;
}

export default function DashboardKpiGrid({
  totalAdmins,
  activeAdmins,
  totalResidences = 18,
  activeInquiries = 42,
}: DashboardKpiGridProps) {
  const kpis = [
    {
      label: "Admin Staff",
      value: String(totalAdmins),
      chip: "Staff",
      chipTone: "amber" as const,
      iconName: "head",
      iconBg: "bg-orange-50 text-orange-600",
      spark: "M0 30 L15 25 L30 28 L45 18 L60 21 L75 12 L90 15 L105 7 L120 10",
      stroke: "#f97316",
    },
    {
      label: "Active Accounts",
      value: String(activeAdmins),
      chip: "Active",
      chipTone: "mint" as const,
      iconName: "users",
      iconBg: "bg-emerald-50 text-emerald-600",
      spark: "M0 32 L15 29 L30 30 L45 22 L60 25 L75 17 L90 20 L105 12 L120 14",
      stroke: "#10b981",
    },
    {
      label: "Portfolio Residences",
      value: String(totalResidences),
      chip: "Live",
      chipTone: "sea" as const,
      iconName: "home",
      iconBg: "bg-sky-50 text-sky-600",
      spark: "M0 28 L15 22 L30 24 L45 16 L60 19 L75 11 L90 13 L105 8 L120 6",
      stroke: "#0284c7",
    },
    {
      label: "Resident Inquiries",
      value: String(activeInquiries),
      chip: "Pending",
      chipTone: "amber" as const,
      iconName: "mail",
      iconBg: "bg-amber-50 text-amber-600",
      spark: "M0 12 L15 16 L30 14 L45 22 L60 17 L75 23 L90 20 L105 27 L120 25",
      stroke: "#f59e0b",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi) => (
        <Card
          key={kpi.label}
          hoverable
          className="flex flex-col justify-between overflow-hidden"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${kpi.iconBg}`}
              >
                <Icon name={kpi.iconName} size={16} />
              </div>
              <Chip tone={kpi.chipTone}>{kpi.chip}</Chip>
            </div>

            <div className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              {kpi.value}
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-1">
              {kpi.label}
            </div>
          </div>

          <div className="mt-4 -mb-2">
            <Sparkline d={kpi.spark} stroke={kpi.stroke} />
          </div>
        </Card>
      ))}
    </div>
  );
}
