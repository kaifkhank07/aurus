"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardHead, Chip, Avatar, Btn } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import { RecentCustomerActivityItem } from "@/types/dashboard.types";
import { SafeAdmin } from "@/types/admin.types";

export interface RecentActivitySectionProps {
  customerActivity?: RecentCustomerActivityItem[];
  admins?: SafeAdmin[];
  loading?: boolean;
}

export default function RecentActivitySection({
  customerActivity = [],
  admins = [],
  loading = false,
}: RecentActivitySectionProps) {
  const [activeTab, setActiveTab] = useState<"customers" | "admins">("customers");

  const getStatusTone = (status: "new" | "read" | "complete") => {
    switch (status) {
      case "new":
        return "amber" as const;
      case "read":
        return "sea" as const;
      case "complete":
        return "mint" as const;
      default:
        return "slate" as const;
    }
  };

  const formatActivityDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Recent";
    }
  };

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("customers")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "customers"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Recent Customer Activity ({customerActivity.length})
          </button>
          {/* <button
            type="button"
            onClick={() => setActiveTab("admins")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "admins"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Staff Accounts ({admins.length})
          </button> */}
        </div>

        <div>
          {activeTab === "customers" ? (
            <div className="flex items-center gap-2">
              <Link href="/admin/enquiry">
                <Btn variant="ghost" size="sm">
                  View Enquiries
                </Btn>
              </Link>
              <Link href="/admin/booked-visit">
                <Btn variant="ghost" size="sm">
                  View Visits
                </Btn>
              </Link>
            </div>
          ) : (
            <Link href="/admin/admins">
              <Btn variant="ghost" size="sm">
                View All Staff
              </Btn>
            </Link>
          )}
        </div>
      </div>

      {activeTab === "customers" ? (
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="py-10 text-center text-xs text-slate-400">
              Loading recent customer activity…
            </div>
          ) : customerActivity.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">
              No recent inquiries or scheduled visits found.
            </div>
          ) : (
            customerActivity.map((item) => {
              const isVisit = item.activityType === "Visit Request";
              const targetRoute = isVisit ? "/admin/booked-visits" : "/admin/enquiries";

              return (
                <div
                  key={`${item.activityType}-${item.id}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-3 first:pt-1 last:pb-1"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Avatar name={item.customerName} size={40} ring />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.customerName}
                        </h4>
                        <Chip
                          tone={isVisit ? "mint" : "sea"}
                          className="text-[10px] py-0 px-2 uppercase tracking-wider"
                        >
                          {item.activityType}
                        </Chip>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {item.contactNumber} · {item.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className="text-right">
                      <Chip tone={getStatusTone(item.status)} dot>
                        <span className="capitalize">{item.status}</span>
                      </Chip>
                      <span className="text-[10px] text-slate-400 block mt-1 font-medium">
                        {formatActivityDate(item.createdAt)}
                      </span>
                    </div>

                    {/* <Link href={targetRoute}>
                      <Btn variant="ghost" size="sm" className="text-xs">
                        Open
                      </Btn>
                    </Link> */}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="py-10 text-center text-xs text-slate-400">
              Loading administrator list…
            </div>
          ) : admins.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">
              No administrator accounts found.
            </div>
          ) : (
            admins.slice(0, 5).map((admin) => {
              const joinedDate = admin.createdAt
                ? new Date(admin.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Recently";

              return (
                <div
                  key={admin.id}
                  className="flex items-center justify-between py-3 gap-3 first:pt-1 last:pb-1"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={admin.name} size={36} ring />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {admin.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {admin.email} · Joined {joinedDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Chip tone={admin.status === "active" ? "mint" : "rose"} dot>
                      {admin.status === "active" ? "Active" : "Inactive"}
                    </Chip>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </Card>
  );
}

