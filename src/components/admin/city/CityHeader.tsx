"use client";

import React from "react";
import { PageHead, Btn } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";

export interface CityHeaderProps {
  title?: string;
  sub?: string;
  totalCount?: number;
  onRefresh?: () => void;
  refreshing?: boolean;
  onCreateOpen: () => void;
}

export default function CityHeader({
  title = "City Directory",
  sub = "Manage marketplace cities, locations, sort order, and SEO metadata.",
  totalCount,
  onRefresh,
  refreshing = false,
  onCreateOpen,
}: CityHeaderProps) {
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const eyebrowText =
    typeof totalCount === "number"
      ? `Master Data · ${totalCount} ${totalCount === 1 ? "City" : "Cities"}`
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
              title="Refresh city list"
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

          <Btn variant="brand" size="sm" onClick={onCreateOpen} title="Add a new city">
            <Icon name="plus" size={13} />
            <span>Add City</span>
          </Btn>
        </div>
      }
    />
  );
}
