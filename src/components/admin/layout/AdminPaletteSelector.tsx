"use client";

import React, { useState, useRef, useEffect } from "react";
import { useThemeStore, PaletteId } from "@/store/useThemeStore";

export default function AdminPaletteSelector() {
  const { palette, paletteId, setPaletteId, palettes } = useThemeStore();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all text-slate-700 cursor-pointer shadow-2xs group"
        title="Change Admin Color Palette"
        aria-label="Change Admin Color Palette"
      >
        {/* Dual color dot preview */}
        <span className="relative flex h-3.5 w-3.5 rounded-full overflow-hidden shadow-xs ring-1 ring-black/10 shrink-0">
          <span
            className="w-1/2 h-full"
            style={{ backgroundColor: palette.primaryHex }}
          />
          <span
            className="w-1/2 h-full"
            style={{ backgroundColor: palette.secondaryHex }}
          />
        </span>

        <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
          {palette.name}
        </span>

        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={`text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Palette Selection Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2 pb-2.5 mb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 tracking-tight">
              Color Palette
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Customize the administrative interface theme
            </p>
          </div>

          <div className="space-y-1">
            {palettes.map((p) => {
              const isSelected = p.id === paletteId;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setPaletteId(p.id as PaletteId);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-100/90 shadow-2xs font-semibold"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="relative flex h-5 w-5 rounded-full overflow-hidden shadow-xs ring-1 ring-black/10 shrink-0">
                      <span
                        className="w-1/2 h-full"
                        style={{ backgroundColor: p.primaryHex }}
                      />
                      <span
                        className="w-1/2 h-full"
                        style={{ backgroundColor: p.secondaryHex }}
                      />
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {p.description}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
                      style={{ backgroundColor: p.primaryHex }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
