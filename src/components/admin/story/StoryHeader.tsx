"use client";

import React from "react";
import { PageHead, Btn } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";

export interface StoryHeaderProps {
  title?: string;
  sub?: string;
  totalCount?: number;
  onRefresh?: () => void;
  refreshing?: boolean;
  onCreateOpen: () => void;
}

export default function StoryHeader({
  title = "Student & Resident Stories",
  sub = "Manage resident reviews, star ratings, featured community stories, and testimonials.",
  totalCount,
  onRefresh,
  refreshing = false,
  onCreateOpen,
}: StoryHeaderProps) {
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const eyebrowText =
    typeof totalCount === "number"
      ? `Community & Testimonials · ${totalCount} ${totalCount === 1 ? "Story" : "Stories"}`
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
              title="Refresh stories list"
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
            title="Add a new resident story"
          >
            <Icon name="plus" size={13} />
            <span>Add Story</span>
          </Btn>
        </div>
      }
    />
  );
}

