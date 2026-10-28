"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { adminNav } from "@/lib/admin-nav";
import { useThemeStore } from "@/store/useThemeStore";
import Icon from "../ui/AdminIcons";

export interface AdminCommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

interface PaletteItem {
  label: string;
  icon: string;
  href: string;
  run: () => void;
}

export default function AdminCommandPalette({
  open,
  onClose,
}: AdminCommandPaletteProps) {
  const router = useRouter();
  const { palette } = useThemeStore();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  const items: PaletteItem[] = useMemo(
    () =>
      adminNav.map((n) => ({
        label: n.label,
        icon: n.icon,
        href: n.href,
        run: () => router.push(n.href),
      })),
    [router]
  );

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.href.toLowerCase().includes(q)
    );
  }, [items, query]);

  const handleClose = React.useCallback(() => {
    setQuery("");
    setCursor(0);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((c) => Math.min(c + 1, filteredItems.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((c) => Math.max(c - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[cursor]) {
          filteredItems[cursor].run();
          handleClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, filteredItems, cursor, handleClose]);

  if (!open) return null;

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-150"
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search input bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
          <Icon name="search" size={17} className="text-slate-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            placeholder="Search navigation…"
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
          />
          <kbd className="text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 no-scrollbar">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === cursor;
              return (
                <div
                  key={item.href}
                  onMouseEnter={() => setCursor(idx)}
                  onClick={() => {
                    item.run();
                    handleClose();
                  }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${isSelected
                      ? `${palette.bgLightClass} ${palette.textClass} font-semibold`
                      : "text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isSelected
                          ? "text-white"
                          : "bg-slate-100 text-slate-500"
                        }`}
                      style={isSelected ? { backgroundColor: palette.primaryHex } : undefined}
                    >
                      <Icon name={item.icon} size={14} />
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  <span
                    className={`text-[11px] font-mono transition-opacity ${isSelected ? "opacity-100 text-slate-400" : "opacity-0"
                      }`}
                  >
                    ↵
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
