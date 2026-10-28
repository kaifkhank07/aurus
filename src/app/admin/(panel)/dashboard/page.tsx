"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";
import DashboardWelcomeBand from "@/components/admin/dashboard/DashboardWelcomeBand";
import DashboardKpiGrid from "@/components/admin/dashboard/DashboardKpiGrid";
import DashboardCharts from "@/components/admin/dashboard/DashboardCharts";
import RecentAdminsList from "@/components/admin/dashboard/RecentAdminsList";
import { getAdminMe, getAdminList } from "@/lib/admin-api";
import { useAuthStore } from "@/store/useAuthStore";
import { SafeAdmin } from "@/types/admin.types";

export default function AdminDashboardPage() {
  const { admin: currentAdmin, setAdmin } = useAuthStore();
  const [admins, setAdmins] = useState<SafeAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let isMounted = true;

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
      .catch(() => {})
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [setAdmin]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const [meRes, listRes] = await Promise.all([
        getAdminMe(),
        getAdminList({ limit: 10 }),
      ]);
      if (meRes.success && meRes.data?.admin) {
        setAdmin(meRes.data.admin);
      }
      if (listRes.success && listRes.data?.items) {
        setAdmins(listRes.data.items);
      }
    } catch {
      // Ignore
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
        refreshing={refreshing}
      />

      <DashboardWelcomeBand
        adminName={currentAdmin?.name || "Administrator"}
        totalAdmins={totalAdminsCount}
        activeAdmins={activeAdminsCount > 0 ? activeAdminsCount : 1}
        totalResidences={18}
        totalInquiries={42}
      />

      <DashboardKpiGrid
        totalAdmins={totalAdminsCount}
        activeAdmins={activeAdminsCount > 0 ? activeAdminsCount : 1}
        totalResidences={18}
        activeInquiries={42}
      />

      <DashboardCharts />

      <RecentAdminsList admins={admins} loading={loading} />
    </div>
  );
}
