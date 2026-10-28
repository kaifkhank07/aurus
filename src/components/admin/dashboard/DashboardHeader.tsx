"use client";

import React from "react";
import Link from "next/link";
import { PageHead, Btn } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";

export interface DashboardHeaderProps {
  title?: string;
  sub?: string;
  onRefresh: () => void;
  refreshing?: boolean;
  manageLink?: {
    href: string;
    label: string;
  };
}

export default function DashboardHeader({
  title = "Admin Staff Dashboard",
  sub = "Aurus Residences operational overview, inquiry workload, and administrator controls.",
  onRefresh,
  refreshing = false,
  manageLink = { href: "/admin/admins", label: "Manage Staff" },
}: DashboardHeaderProps) {
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <PageHead
      eyebrow={todayFormatted}
      title={title}
      sub={sub}
      actions={
        <div className="flex items-center gap-2.5">
          <Btn
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={refreshing}
            title="Refresh dashboard metrics"
          >
            <span
              className={`inline-block transition-transform duration-500 ${refreshing ? "rotate-180" : ""
                }`}
            >
              <Icon name="refresh" size={13} />
            </span>
            <span>{refreshing ? "Refreshing…" : "Refresh"}</span>
          </Btn>

          <Link href={manageLink.href}>
            <Btn variant="brand" size="sm">
              <Icon name="plus" size={13} />
              <span>{manageLink.label}</span>
            </Btn>
          </Link>
        </div>
      }
    />
  );
}
