"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Icon from "../ui/AdminIcons";
import AdminPaletteSelector from "./AdminPaletteSelector";

export interface AdminTopbarProps {
  onSearch: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  category: "inquiry" | "system" | "residence";
}

export default function AdminTopbar({ onSearch }: AdminTopbarProps) {
  const router = useRouter();
  const { admin, logout } = useAuthStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      title: "New Residence Inquiry",
      message: "Lead submitted for Sky Villa Penthouse, Mumbai.",
      time: "5m ago",
      isRead: false,
      category: "inquiry",
    },
    {
      id: "2",
      title: "System Update Complete",
      message: "API backend security patch applied successfully.",
      time: "1h ago",
      isRead: false,
      category: "system",
    },
    {
      id: "3",
      title: "Residence Status Updated",
      message: "Bengaluru Highline suites set to Live status.",
      time: "3h ago",
      isRead: true,
      category: "residence",
    },
  ]);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
      {/* Searchbar Trigger */}
      <div
        onClick={onSearch}
        className="flex-1 max-w-md flex items-center gap-3 px-4 py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer transition-all shadow-2xs group"
      >
        <span className="text-slate-400 group-hover:text-orange-500 transition-colors">
          <Icon name="search" size={15} />
        </span>
        <span className="text-xs text-slate-500 font-medium select-none truncate">
          Search residences, inquiries, admins…
        </span>
        <span className="ml-auto text-[10px] font-bold text-slate-400 bg-white border border-slate-200/80 rounded px-1.5 py-0.5 shadow-2xs">
          ⌘K
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Color Palette Selector */}
        <AdminPaletteSelector />

        {/* Notifications Popover */}
        {/* <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            aria-label="Notifications"
            className="relative w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-orange-500 transition-all cursor-pointer"
          >
            <Icon name="bell" size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[9px] font-bold text-white bg-orange-500 rounded-full border-2 border-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-600 border border-orange-200/60">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-medium text-orange-600 hover:text-orange-700"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-1.5 max-h-72 overflow-y-auto no-scrollbar">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                      item.isRead ? "bg-white hover:bg-slate-50" : "bg-slate-50/80 hover:bg-slate-100/80 border-l-3 border-orange-500"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2.5 mt-2 border-t border-slate-100 text-center">
                <span className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 cursor-pointer">
                  View all system logs →
                </span>
              </div>
            </div>
          )}
        </div> */}

        {/* User Profile Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 cursor-pointer transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-800 to-slate-950 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              {admin?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-slate-800 max-w-[110px] truncate">
              {admin?.name || "Admin"}
            </span>
            <Icon name="chev" size={10} className="text-slate-400" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {admin?.name || "Administrator"}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {admin?.email || "admin@aurus.com"}
                </div>
              </div>

              <div className="space-y-0.5">
                {/* <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    router.push("/admin/settings");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all text-left"
                >
                  <Icon name="cog" size={14} />
                  <span>Account Settings</span>
                </button> */}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-all text-left"
                >
                  <Icon name="logout" size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
