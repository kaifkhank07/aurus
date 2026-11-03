"use client";

import React from "react";
import { Card, Chip, Sparkline } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import { DashboardKpis } from "@/types/dashboard.types";

export interface DashboardKpiGridProps {
  kpis?: DashboardKpis;
  totalAdmins?: number;
  activeAdmins?: number;
  totalResidences?: number;
  activeInquiries?: number;
}

export default function DashboardKpiGrid({
  kpis,
  totalAdmins = 1,
  activeAdmins = 1,
  totalResidences = 0,
  activeInquiries = 0,
}: DashboardKpiGridProps) {
  const cards = [
    {
      label: "Active Residences",
      value: kpis ? String(kpis.activeResidences.active) : String(totalResidences),
      subtext: kpis
        ? `${kpis.activeResidences.active} of ${kpis.activeResidences.total} Live Properties`
        : "Operational residences",
      chip: "Live",
      chipTone: "sea" as const,
      iconName: "bed",
      iconBg: "bg-sky-50 text-sky-600",
      spark:
        kpis?.activeResidences.sparkline ||
        "M0 28 L15 22 L30 24 L45 16 L60 19 L75 11 L90 13 L105 8 L120 6",
      stroke: "#0284c7",
    },
    {
      label: "New Leads",
      value: kpis ? String(kpis.newLeads.count) : String(activeInquiries),
      subtext: kpis
        ? `of ${kpis.newLeads.totalLeads} Total Leads`
        : "Pending inquiries & visits",
      chip: "New Leads",
      chipTone: "amber" as const,
      iconName: "mail",
      iconBg: "bg-amber-50 text-amber-600",
      spark:
        kpis?.newLeads.sparkline ||
        "M0 12 L15 16 L30 14 L45 22 L60 17 L75 23 L90 20 L105 27 L120 25",
      stroke: "#f59e0b",
    },
    {
      label: "Upcoming Visits",
      value: kpis ? String(kpis.upcomingVisits.upcoming) : "0",
      subtext: kpis
        ? `of ${kpis.upcomingVisits.total} Booked Visits`
        : "Scheduled residence tours",
      chip: "Upcoming",
      chipTone: "mint" as const,
      iconName: "cal",
      iconBg: "bg-emerald-50 text-emerald-600",
      spark:
        kpis?.upcomingVisits.sparkline ||
        "M0 32 L15 29 L30 30 L45 22 L60 25 L75 17 L90 20 L105 12 L120 14",
      stroke: "#10b981",
    },
    {
      label: "Lead Resolution Rate",
      value: kpis ? `${kpis.resolutionRate.rate}%` : "100%",
      subtext: kpis
        ? `${kpis.resolutionRate.resolved} of ${kpis.resolutionRate.total} Resolved`
        : `${activeAdmins} active staff online`,
      chip: "Efficiency",
      chipTone: "ember" as const,
      iconName: "chart",
      iconBg: "bg-orange-50 text-orange-600",
      spark:
        kpis?.resolutionRate.sparkline ||
        "M0 30 L15 25 L30 28 L45 18 L60 21 L75 12 L90 15 L105 7 L120 10",
      stroke: "#f97316",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <Card
          key={card.label}
          hoverable
          className="flex flex-col justify-between overflow-hidden"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${card.iconBg}`}
              >
                <Icon name={card.iconName} size={16} />
              </div>
              <Chip tone={card.chipTone}>{card.chip}</Chip>
            </div>

            <div className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              {card.value}
            </div>
            <div className="text-xs font-semibold text-slate-700 mt-1">
              {card.label}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 font-medium truncate">
              {card.subtext}
            </div>
          </div>

          <div className="mt-4 -mb-2">
            <Sparkline d={card.spark} stroke={card.stroke} />
          </div>
        </Card>
      ))}
    </div>
  );
}
