"use client";

import React, { useState, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import { AdminMobileBar } from "./AdminMobileNav";
import AdminCommandPalette from "./AdminCommandPalette";
import { adminNav } from "@/lib/admin-nav";

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [mini, setMini] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("aurus_sidebar_mini") === "1";
      } catch {
        return false;
      }
    }
    return false;
  });
  const [cmdOpen, setCmdOpen] = useState(false);

  // Close mobile nav when navigating to a new route
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setNavOpen(false);
  }

  // Global ⌘K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToggleMini = () => {
    const next = !mini;
    setMini(next);
    try {
      localStorage.setItem("aurus_sidebar_mini", next ? "1" : "0");
    } catch {
      // Ignore
    }
  };

  const currentTitle =
    adminNav.find((item) => item.href === pathname)?.label || "Aurus Admin";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-orange-100 selection:text-orange-900 font-sans">
      {/* Sidebar */}
      <AdminSidebar
        open={navOpen}
        onClose={() => setNavOpen(false)}
        mini={mini}
        onToggleMini={handleToggleMini}
      />

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ease-in-out flex flex-col min-h-screen ${mini ? "lg:ml-[76px]" : "lg:ml-[250px]"
          }`}
      >
        {/* Mobile Header */}
        <AdminMobileBar
          title={currentTitle}
          onMenu={() => setNavOpen(!navOpen)}
          onSearch={() => setCmdOpen(true)}
        />

        {/* Desktop Topbar */}
        <div className="hidden lg:block">
          <AdminTopbar onSearch={() => setCmdOpen(true)} />
        </div>

        {/* Content Container */}
        <main className="flex-1 py-6 sm:pb-8 px-4 sm:px-6 lg:px-8 min-w-0 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Command Palette */}
      <AdminCommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}
