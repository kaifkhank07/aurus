"use client";

import React, { type ReactNode, type InputHTMLAttributes } from "react";
import Icon from "./AdminIcons";
import { useThemeStore } from "@/store/useThemeStore";

export type Tone = "mint" | "rose" | "amber" | "sea" | "slate" | "ember";

/* ── Card Container ──────────────────────────────────────────────────────── */
export function Card({
  children,
  className = "",
  hoverable = false,
}: {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 transition-all duration-300 ${hoverable ? "hover:-translate-y-1 hover:shadow-md hover:border-slate-300" : ""
        } ${className}`}
    >
      {children}
    </div>
  );
}

/* ── Card Header ─────────────────────────────────────────────────────────── */
export function CardHead({
  title,
  sub,
  right,
  className = "",
}: {
  title: string;
  sub?: string;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between mb-4 gap-3 flex-wrap ${className}`}>
      <div>
        <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">{title}</h3>
        {sub && <p className="text-xs text-slate-500 mt-0.5 font-medium">{sub}</p>}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}

/* ── Status Chip / Badge ─────────────────────────────────────────────────── */
export function Chip({
  tone = "slate",
  children,
  dot = false,
  pulse = false,
  className = "",
}: {
  tone?: Tone;
  children: ReactNode;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}) {
  const toneClasses: Record<Tone, string> = {
    mint: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
    rose: "bg-rose-50 text-rose-700 border-rose-200/70",
    amber: "bg-amber-50 text-amber-700 border-amber-200/70",
    sea: "bg-sky-50 text-sky-700 border-sky-200/70",
    slate: "bg-slate-100 text-slate-700 border-slate-200/70",
    ember: "bg-orange-50 text-orange-700 border-orange-200/70",
  };

  const dotClasses: Record<Tone, string> = {
    mint: "bg-emerald-500",
    rose: "bg-rose-500",
    amber: "bg-amber-500",
    sea: "bg-sky-500",
    slate: "bg-slate-500",
    ember: "bg-orange-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${toneClasses[tone]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotClasses[tone]} ${pulse ? "animate-pulse" : ""
            }`}
        />
      )}
      {children}
    </span>
  );
}

/* ── Standard Button (Paletted) ─────────────────────────────────────────── */
export function Btn({
  variant = "ghost",
  size = "md",
  children,
  className = "",
  onClick,
  disabled = false,
  type = "button",
  title,
}: {
  variant?: "brand" | "ghost" | "dark" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  title?: string;
}) {
  const { palette } = useThemeStore();

  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-4 py-2 text-xs",
    lg: "px-6 py-2.5 text-sm",
  };

  const variantClasses = {
    brand: `bg-gradient-to-r ${palette.gradientClass} ${palette.hoverGradientClass} text-white shadow-sm hover:-translate-y-0.5 active:translate-y-0`,
    ghost:
      "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900",
    dark: "bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-0.5 shadow-sm active:translate-y-0",
    danger:
      "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 hover:text-rose-700",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      title={title}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      style={variant === "brand" ? { boxShadow: `0 4px 14px ${palette.glowHex}` } : undefined}
    >
      {children}
    </button>
  );
}

/* ── Icon Button ─────────────────────────────────────────────────────────── */
export function IconBtn({
  name,
  onClick,
  size = "md",
  label,
  className = "",
}: {
  name: string;
  onClick?: () => void;
  size?: "sm" | "md";
  label?: string;
  className?: string;
}) {
  const sizeClass = size === "sm" ? "w-7 h-7" : "w-9 h-9";
  const iconSize = size === "sm" ? 13 : 15;

  return (
    <button
      onClick={onClick}
      aria-label={label ?? name}
      className={`${sizeClass} rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-400 hover:-translate-y-0.5 transition-all shadow-xs shrink-0 cursor-pointer ${className}`}
    >
      <Icon name={name} size={iconSize} />
    </button>
  );
}

/* ── Avatar Circle ───────────────────────────────────────────────────────── */
export function Avatar({
  name,
  size = 36,
  ring = false,
  className = "",
}: {
  name?: string;
  size?: number;
  ring?: boolean;
  className?: string;
}) {
  const initial = (name || "A").trim().charAt(0).toUpperCase() || "A";

  return (
    <div
      className={`rounded-full bg-gradient-to-br from-slate-800 to-slate-950 text-white flex items-center justify-center font-bold select-none shrink-0 ${ring ? "ring-2 ring-white shadow-xs" : ""
        } ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(11, Math.floor(size * 0.38)),
      }}
    >
      {initial}
    </div>
  );
}

/* ── Page Header (Paletted) ─────────────────────────────────────────────── */
export function PageHead({
  eyebrow,
  title,
  sub,
  actions,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  actions?: ReactNode;
}) {
  const { palette } = useThemeStore();

  return (
    <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
      <div>
        {eyebrow && (
          <div
            className="text-[11px] font-bold tracking-wider uppercase flex items-center gap-2 mb-2"
            style={{ color: palette.primaryHex }}
          >
            <span
              className="w-4 h-0.5 rounded-full"
              style={{ backgroundColor: palette.primaryHex }}
            />
            {eyebrow}
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h1>
        {sub && <p className="text-slate-500 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">{sub}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}

/* ── SVG Sparkline ───────────────────────────────────────────────────────── */
export function Sparkline({
  d,
  stroke = "#f97316",
  className = "",
}: {
  d: string;
  stroke?: string;
  className?: string;
}) {
  return (
    <svg className={`w-full h-9 overflow-visible ${className}`} viewBox="0 0 120 40" preserveAspectRatio="none">
      <path d={d} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/* ── Form Field Wrapper ──────────────────────────────────────────────────── */
export function FormField({
  label,
  hint,
  error,
  children,
  className = "",
}: {
  label?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">{label}</label>}
      {children}
      {error ? (
        <span className="text-xs text-rose-600 font-medium">{error}</span>
      ) : hint ? (
        <span className="text-xs text-slate-500">{hint}</span>
      ) : null}
    </div>
  );
}

/* ── Standard Input ──────────────────────────────────────────────────────── */
export function TextInput({
  className = "",
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      className={`w-full px-3.5 py-2.5 bg-white border ${error
        ? "border-rose-400 focus:ring-rose-500/20 focus:border-rose-500"
        : "border-slate-200 focus:ring-slate-400/20 focus:border-slate-400"
        } rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 transition-all ${className}`}
      {...props}
    />
  );
}
