"use client";

import React from "react";
import { PageHead, Btn } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";

export interface BlogHeaderProps {
  title?: string;
  sub?: string;
  totalCount?: number;
  onRefresh?: () => void;
  refreshing?: boolean;
  onCreateOpen: () => void;
}

export default function BlogHeader({
  title = "Blog Posts & Articles",
  sub = "Create, publish, and manage Aurus journal blogs, lifestyle tips, and student guides.",
  totalCount,
  onRefresh,
  refreshing = false,
  onCreateOpen,
}: BlogHeaderProps) {
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const eyebrowText =
    typeof totalCount === "number"
      ? `Content Management · ${totalCount} ${totalCount === 1 ? "Article" : "Articles"}`
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
              title="Refresh articles list"
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
            title="Write and publish a new blog post"
          >
            <Icon name="plus" size={13} />
            <span>Write New Post</span>
          </Btn>
        </div>
      }
    />
  );
}

