"use client";

import React from "react";
import { PageHead, Btn } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";

export interface EnquiryHeaderProps {
  title?: string;
  sub?: string;
  totalCount?: number;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export default function EnquiryHeader({
  title = "Enquiries",
  sub = "View questions, callback requests, and prospective tenant messages submitted through the website.",
  totalCount,
  onRefresh,
  refreshing = false,
}: EnquiryHeaderProps) {
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const eyebrowText =
    typeof totalCount === "number"
      ? `Leads & Inquiries · ${totalCount} ${totalCount === 1 ? "Enquiry" : "Enquiries"}`
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
              title="Refresh enquiries list"
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
        </div>
      }
    />
  );
}

