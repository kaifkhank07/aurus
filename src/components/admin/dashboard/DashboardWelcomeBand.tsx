"use client";

import React from "react";
import { useThemeStore } from "@/store/useThemeStore";
import { DashboardWelcomeStats } from "@/types/dashboard.types";

export interface DashboardWelcomeBandProps {
  adminName: string;
  stats?: DashboardWelcomeStats;
  totalAdmins?: number;
  activeAdmins?: number;
  totalResidences?: number;
  totalInquiries?: number;
}

export default function DashboardWelcomeBand({
  adminName,
  stats,
  totalAdmins,
  activeAdmins,
  totalResidences = 0,
  totalInquiries = 0,
}: DashboardWelcomeBandProps) {
  const { palette } = useThemeStore();

  const activeResidences = stats?.activeResidences ?? totalResidences;
  const newLeads = stats?.newLeads ?? totalInquiries;
  const operationalCities = stats?.operationalCities ?? 0;
  // const activeTeam = stats?.activeTeam ?? (activeAdmins || totalAdmins || 1);

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#123456] via-[#0b2340] to-[#071827] text-white shadow-xl border border-white/5 mb-6">
      {/* Blurred Aurora Atmospheric Lights */}
      <div
        className="absolute w-[420px] h-[420px] rounded-full opacity-25 blur-3xl -top-40 -right-20 pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: palette.primaryHex }}
      />
      <div className="absolute w-72 h-72 rounded-full bg-blue-500/25 blur-3xl -bottom-36 left-1/4 pointer-events-none" />

      {/* Decorative Parallax Rings */}
      <div className="absolute -right-16 -top-20 w-96 h-96 pointer-events-none opacity-40">
        <div className="absolute inset-0 m-auto w-48 h-48 rounded-full border border-white/10" />
        <div className="absolute inset-0 m-auto w-72 h-72 rounded-full border border-white/10" />
        <div className="absolute inset-0 m-auto w-96 h-96 rounded-full border border-white/10" />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Welcome Greeting & Metrics */}
        <div className="lg:col-span-8">
          <div
            className="text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 mb-3"
            style={{ color: palette.secondaryHex }}
          >
            <span
              className="w-4 h-0.5 rounded-full"
              style={{ backgroundColor: palette.primaryHex }}
            />
            Admin Panel · Operational Overview
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Welcome back,{" "}
            <em
              className="font-normal italic"
              style={{ color: palette.secondaryHex }}
            >
              {adminName || "Administrator"}
            </em>
            .
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
            Monitor luxury residence inquiries, manage administrative access, and review
            real-time operations across the Aurus portfolio.
          </p>

          {/* Quick Metrics Row */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-10 mt-6 pt-6 border-t border-white/10">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Active Residences
              </span>
              <span className="text-2xl font-extrabold text-white tracking-tight tabular-nums block mt-1">
                {activeResidences}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                New Leads
              </span>
              <span className="text-2xl font-extrabold text-white tracking-tight tabular-nums block mt-1">
                {newLeads}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Operational Cities
              </span>
              <span className="text-2xl font-extrabold text-white tracking-tight tabular-nums block mt-1">
                {operationalCities}
              </span>
            </div>

            {/* <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Active Team
              </span>
              <span className="text-2xl font-extrabold text-white tracking-tight tabular-nums block mt-1">
                {activeTeam}
              </span>
            </div> */}
          </div>
        </div>

        {/* Right Side: Frosted Glass Cards */}
        <div className="lg:col-span-4 flex flex-col mb-auto gap-3">
          {/* <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between gap-4 hover:bg-white/15 transition-all">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${palette.gradientClass} text-white flex items-center justify-center font-bold text-base shadow-sm`}>
                ★
              </div>
              <div>
                <span className="text-lg font-bold text-white tabular-nums block leading-tight">
                  {activeTeam}
                </span>
                <span className="text-[11px] text-slate-300 font-medium block">
                  Active Team Members
                </span>
              </div>
            </div>
            <svg width="60" height="25" viewBox="0 0 60 25" className="shrink-0">
              <path
                d="M0 20 L12 16 L24 18 L36 9 L48 12 L60 4"
                fill="none"
                stroke={palette.primaryHex}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div> */}

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between gap-4 hover:bg-white/15 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold text-base shadow-sm">
                ✓
              </div>
              <div>
                <span className="text-lg font-bold text-white tabular-nums block leading-tight">
                  {operationalCities} Cities
                </span>
                <span className="text-[11px] text-slate-300 font-medium block">
                  Live Market Coverage
                </span>
              </div>
            </div>
            <svg width="60" height="25" viewBox="0 0 60 25" className="shrink-0">
              <path
                d="M0 22 L15 17 L30 19 L45 8 L60 6"
                fill="none"
                stroke="#34d399"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
