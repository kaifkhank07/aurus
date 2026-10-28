"use client";

import React from "react";
import Icon from "../ui/AdminIcons";

export interface AdminMobileBarProps {
  title: string;
  onMenu: () => void;
  onSearch: () => void;
}

export function AdminMobileBar({
  title,
  onMenu,
  onSearch,
}: AdminMobileBarProps) {
  return (
    <div className="lg:hidden flex items-center justify-between gap-3 px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-30 mb-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenu}
          className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Icon name="menu" size={17} />
        </button>
        <span className="font-bold text-sm text-slate-900 truncate">{title}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onSearch}
          className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          aria-label="Search"
        >
          <Icon name="search" size={15} />
        </button>
      </div>
    </div>
  );
}
