"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";
import DashboardWelcomeBand from "@/components/admin/dashboard/DashboardWelcomeBand";
import DashboardKpiGrid from "@/components/admin/dashboard/DashboardKpiGrid";
import DashboardCharts from "@/components/admin/dashboard/DashboardCharts";
import RecentActivitySection from "@/components/admin/dashboard/RecentActivitySection";
import { getAdminMe, getAdminList } from "@/lib/admin-api";
import { useAuthStore } from "@/store/useAuthStore";
import { useDashboardStore } from "@/store/useDashboardStore";
import { SafeAdmin } from "@/types/admin.types";

export default function AdminDashboardPage() {
  const { admin: currentAdmin, setAdmin } = useAuthStore();
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    error: dashboardError,
    fetchDashboardData,
  } = useDashboardStore();

  const [admins, setAdmins] = useState<SafeAdmin[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Fetch dashboard stats from real MongoDB collections
    fetchDashboardData();

    // Fetch current admin profile & active admin list
    Promise.all([getAdminMe(), getAdminList({ limit: 10 })])
      .then(([meRes, listRes]) => {
        if (!isMounted) return;
        if (meRes.success && meRes.data?.admin) {
          setAdmin(meRes.data.admin);
        }
        if (listRes.success && listRes.data?.items) {
          setAdmins(listRes.data.items);
        }
      })
      .catch(() => { })
      .finally(() => {
        if (isMounted) {
          setLoadingAdmins(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [setAdmin, fetchDashboardData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchDashboardData(true),
        getAdminMe().then((meRes) => {
          if (meRes.success && meRes.data?.admin) {
            setAdmin(meRes.data.admin);
          }
        }),
        getAdminList({ limit: 10 }).then((listRes) => {
          if (listRes.success && listRes.data?.items) {
            setAdmins(listRes.data.items);
          }
        }),
      ]);
    } catch {
      // Handled in individual store/calls
    } finally {
      setRefreshing(false);
    }
  };

  const activeAdminsCount = admins.filter((a) => a.status === "active").length;
  const totalAdminsCount = admins.length > 0 ? admins.length : 1;

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Admin Staff Dashboard"
        sub="Aurus Residences operational overview, inquiry workload, and administrator controls."
        onRefresh={handleRefresh}
        refreshing={refreshing || isDashboardLoading}
      />

      {dashboardError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between">
          <span>Failed to load live metrics: {dashboardError}</span>
          <button
            type="button"
            onClick={() => fetchDashboardData(true)}
            className="underline hover:text-rose-900"
          >
            Retry
          </button>
        </div>
      )}

      <DashboardWelcomeBand
        adminName={currentAdmin?.name || "Administrator"}
        stats={dashboardData?.welcome}
      // totalAdmins={totalAdminsCount}
      // activeAdmins={activeAdminsCount > 0 ? activeAdminsCount : 1}
      />

      <DashboardKpiGrid
        kpis={dashboardData?.kpis}
        totalAdmins={totalAdminsCount}
        activeAdmins={activeAdminsCount > 0 ? activeAdminsCount : 1}
      />

      <DashboardCharts
        monthlyTrend={dashboardData?.monthlyTrend}
        tenantDistribution={dashboardData?.tenantDistribution}
        loading={isDashboardLoading && !dashboardData}
      />

      <RecentActivitySection
        customerActivity={dashboardData?.recentActivity}
        admins={admins}
        loading={loadingAdmins || (isDashboardLoading && !dashboardData)}
      />
    </div>
  );
}
