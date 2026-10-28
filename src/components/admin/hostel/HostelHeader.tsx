"use client";

import React from "react";
import { PageHead, Btn } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";

export interface HostelHeaderProps {
  title?: string;
  sub?: string;
  totalCount?: number;
  onRefresh?: () => void;
  refreshing?: boolean;
  onCreateOpen: () => void;
}

export default function HostelHeader({
  title = "Hostel Residences",
  sub = "Manage student and working professional hostel properties, locations, amenities, and room pricing.",
  totalCount,
  onRefresh,
  refreshing = false,
  onCreateOpen,
}: HostelHeaderProps) {
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const eyebrowText =
    typeof totalCount === "number"
      ? `Residence Management · ${totalCount} ${totalCount === 1 ? "Property" : "Properties"}`
      : todayFormatted;

  return (
    <PageHead
      eyebrow={eyebrowText}
      title={title}
      sub={sub}
      actions={
        <div className="flex items-center gap-2.5 flex-wrap">
          {onRefresh && (
            <Btn
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={refreshing}
              title="Refresh hostel list"
            >
              <span
                className={`inline-block transition-transform duration-500 ${
                  refreshing ? "rotate-180" : ""
                }`}
              >
                <Icon name="refresh" size={13} />
              </span>
              <span>{refreshing ? "Refreshing…" : "Refresh"}</span>
            </Btn>
          )}

          <Btn
            variant="brand"
            size="sm"
            onClick={onCreateOpen}
            title="Add a new hostel residence"
          >
            <Icon name="plus" size={13} />
            <span>Add Hostel</span>
          </Btn>
        </div>
      }
    />
  );
}

