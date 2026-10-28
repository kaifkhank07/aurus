"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminNav } from "@/lib/admin-nav";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store/useThemeStore";
import Icon from "../ui/AdminIcons";

export interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
  mini: boolean;
  onToggleMini: () => void;
}

export default function AdminSidebar({
  open,
  onClose,
  mini,
  onToggleMini,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { palette } = useThemeStore();
  const { admin, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-gradient-to-b from-[#0a1e38] via-[#07172b] to-[#040d18] text-slate-300 transition-all duration-300 ease-in-out border-r border-white/5 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${mini ? "lg:w-[76px]" : "lg:w-[250px]"} w-[260px]`}
      >
        {/* Decorative Top Ambient Glow */}
        <div
          className="absolute top-0 left-0 right-0 h-40 opacity-20 pointer-events-none blur-3xl"
          style={{ backgroundColor: palette.primaryHex }}
        />

        {/* Sidebar Header & Brand */}
        <div className="relative flex items-center justify-between px-5 py-5 border-b border-white/5 shrink-0">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 overflow-hidden group select-none"
            title="Aurus Admin Portal"
          >
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${palette.gradientClass} flex items-center justify-center text-white font-extrabold shadow-md shrink-0`}
              style={{ boxShadow: `0 4px 14px ${palette.glowHex}` }}
            >
              A
            </div>
            {!mini && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-base tracking-tight text-white leading-tight">
                  AURUS
                </span>
                <span
                  className="text-[10px] font-semibold tracking-wider uppercase"
                  style={{ color: palette.secondaryHex }}
                >
                  Management
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Mini Toggle Button */}
          <button
            onClick={onToggleMini}
            className="hidden lg:flex w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
            title={mini ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={mini ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className={`transition-transform duration-300 ${mini ? "rotate-180" : ""}`}>
              <Icon name="chevLeft" size={12} />
            </span>
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden flex w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 items-center justify-center text-white"
            aria-label="Close sidebar"
          >
            <Icon name="x" size={15} />
          </button>
        </div>

        {/* Navigation Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 no-scrollbar">
          {adminNav.map((item) => {
            const isActive = pathname === item.href;
            const showSection = item.section && !mini;

            return (
              <div key={item.href}>
                {showSection && (
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 pt-4 pb-1 select-none">
                    {item.section}
                  </div>
                )}
                <Link
                  href={item.href}
                  onClick={onClose}
                  title={item.label}
                  className={`relative flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 group ${
                    isActive
                      ? "bg-white/10 text-white font-semibold shadow-xs"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  } ${mini ? "justify-center px-0" : ""}`}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full shadow-sm"
                      style={{
                        backgroundColor: palette.primaryHex,
                        boxShadow: `0 0 10px ${palette.glowHex}`,
                      }}
                    />
                  )}

                  <span
                    className="shrink-0 transition-colors"
                    style={isActive ? { color: palette.primaryHex } : undefined}
                  >
                    <Icon name={item.icon} size={17} />
                  </span>

                  {!mini && (
                    <span className="truncate flex-1 tracking-normal">{item.label}</span>
                  )}

                  {!mini && item.badge && (
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs"
                      style={{ backgroundColor: palette.primaryHex }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Footer Admin User & Logout */}
        <div className="p-3 border-t border-white/5 shrink-0 bg-black/20">
          <div
            className={`flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all ${
              mini ? "justify-center p-2" : "justify-between"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 text-white"
                style={{ backgroundColor: palette.primaryHex }}
              >
                {admin?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              {!mini && (
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-white truncate">
                    {admin?.name || "Administrator"}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">
                    {admin?.email || "admin@aurus.com"}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <Icon name="logout" size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
