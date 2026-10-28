"use client";

import React from "react";
import Link from "next/link";
import { SafeAdmin } from "@/types/admin.types";
import { Card, CardHead, Chip, Avatar, Btn } from "../ui/AdminUI";

export interface RecentAdminsListProps {
  admins: SafeAdmin[];
  loading?: boolean;
}

export default function RecentAdminsList({
  admins = [],
  loading = false,
}: RecentAdminsListProps) {
  return (
    <Card>
      <CardHead
        title="Recent Administrator Accounts"
        sub="Authorized staff accounts and access status"
        right={
          <Link href="/admin/admins">
            <Btn variant="ghost" size="sm">
              View All Staff
            </Btn>
          </Link>
        }
      />

      <div className="divide-y divide-slate-100">
        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Loading administrator list…
          </div>
        ) : admins.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
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
                  <Chip
                    tone={admin.status === "active" ? "mint" : "rose"}
                    dot
                  >
                    {admin.status === "active" ? "Active" : "Inactive"}
                  </Chip>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
