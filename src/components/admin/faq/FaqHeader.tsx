"use client";

import React from "react";
import { PageHead, Btn } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";

export interface FaqHeaderProps {
  title?: string;
  sub?: string;
  totalCount?: number;
  onRefresh?: () => void;
  refreshing?: boolean;
  onCreateOpen: () => void;
  selectedCount?: number;
  onBulkEditOpen?: () => void;
  onBulkDeleteOpen?: () => void;
}

export default function FaqHeader({
  title = "Frequently Asked Questions",
  sub = "Manage inquiries, resident guides, and categorized Q&A content across Aurus.",
  totalCount,
  onRefresh,
  refreshing = false,
  onCreateOpen,
  selectedCount = 0,
  onBulkEditOpen,
  onBulkDeleteOpen,
}: FaqHeaderProps) {
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const eyebrowText =
    typeof totalCount === "number"
      ? `Content Data · ${totalCount} ${totalCount === 1 ? "FAQ" : "FAQs"}`
      : todayFormatted;

  return (
    <PageHead
      eyebrow={eyebrowText}
      title={title}
      sub={sub}
      actions={
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Bulk Selection Actions */}
          {selectedCount > 0 && (
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200/80 px-3 py-1.5 rounded-xl animate-in fade-in duration-200">
              <span className="text-xs font-bold text-orange-900">
                {selectedCount} selected
              </span>
              {onBulkEditOpen && (
                <Btn
                  variant="ghost"
                  size="sm"
                  onClick={onBulkEditOpen}
                  className="text-orange-800 hover:bg-orange-100/80 text-xs py-1 px-2.5 h-auto"
                >
                  <Icon name="pen" size={12} />
                  <span>Bulk Edit</span>
                </Btn>
              )}
              {onBulkDeleteOpen && (
                <Btn
                  variant="ghost"
                  size="sm"
                  onClick={onBulkDeleteOpen}
                  className="text-rose-700 hover:bg-rose-100/80 text-xs py-1 px-2.5 h-auto"
                >
                  <Icon name="trash" size={12} />
                  <span>Delete Selected</span>
                </Btn>
              )}
            </div>
          )}

          {onRefresh && (
            <Btn
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={refreshing}
              title="Refresh FAQs list"
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

          <Btn variant="brand" size="sm" onClick={onCreateOpen}>
            <Icon name="plus" size={14} />
            <span>Add FAQs</span>
          </Btn>
        </div>
      }
    />
  );
}
