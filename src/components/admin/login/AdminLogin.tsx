"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/store/useThemeStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function AdminLogin() {
  const router = useRouter();
  const { palette } = useThemeStore();

  // Zustand Auth Store
  const { login, error, isLoading, isAuthenticated, clearError } = useAuthStore();

  // Preloader counter state
  const [preloader, setPreloader] = useState(true);
  const [progress, setProgress] = useState(0);

  // Form credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // If already authenticated in store or localStorage, redirect to dashboard
    if (isAuthenticated) {
      router.replace("/admin/dashboard");
      return;
    }

    // Smooth counter animation
    const startTime = Date.now();
    const duration = 900;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(timer);
        setTimeout(() => setPreloader(false), 200);
      }
    }, 25);

    return () => clearInterval(timer);
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const res = await login(email, password);
    if (res.success) {
      router.push("/admin/dashboard");
    }
  };

  return (
    <>
      {/* Intro Preloader Screen */}
      {preloader && (
        <div className="fixed inset-0 z-50 bg-[#071827] flex flex-col justify-end p-8 sm:p-12 text-white select-none transition-all duration-500">
          <div className="flex items-baseline justify-between border-b border-white/10 pb-6">
            <span className="text-6xl sm:text-8xl lg:text-9xl font-bold tracking-tight text-white tabular-nums">
              {String(progress).padStart(2, "0")}
            </span>
            <div className="flex flex-col items-end">
              <span
                className="text-xs sm:text-sm font-bold tracking-widest uppercase"
                style={{ color: palette.secondaryHex }}
              >
                AURUS ADMIN
              </span>
              <span className="text-[10px] tracking-wider text-slate-400 uppercase mt-1">
                Loading Workspace…
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Login Screen */}
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#f6f5f2] selection:bg-orange-100 selection:text-orange-900 font-sans">
        {/* Left Column: Login Form */}
        <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 lg:py-8 max-w-lg w-full mx-auto relative">
          {/* Brand Mark */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${palette.gradientClass} flex items-center justify-center text-white font-extrabold text-lg shadow-md`}
              style={{ boxShadow: `0 4px 14px ${palette.glowHex}` }}
            >
              A
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 leading-tight">
                AURUS
              </span>
              <span
                className="text-[10px] font-bold tracking-widest uppercase"
                style={{ color: palette.primaryHex }}
              >
                Executive Portal
              </span>
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Aurus Residences
              <br />
              <em
                className="font-normal italic"
                style={{ color: palette.primaryHex }}
              >
                Admin Control
              </em>
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-2.5 leading-relaxed">
              Manage residences, staff roles, inquiries, and platform operations.
            </p>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold flex items-start gap-2.5 shadow-2xs">
              <span className="text-rose-500 shrink-0 mt-0.5 font-bold">!</span>
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    if (error) clearError();
                    setEmail(e.target.value);
                  }}
                  placeholder="admin@example.com"
                  required
                  className={`w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 ${palette.ringClass} focus:border-slate-400 transition-all shadow-2xs`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    if (error) clearError();
                    setPassword(e.target.value);
                  }}
                  placeholder="••••••••••••"
                  required
                  className={`w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 ${palette.ringClass} focus:border-slate-400 transition-all shadow-2xs`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full mt-2 py-3.5 px-6 rounded-full bg-gradient-to-r ${palette.gradientClass} ${palette.hoverGradientClass} active:translate-y-0 text-white font-bold text-sm shadow-md transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              style={{ boxShadow: `0 4px 14px ${palette.glowHex}` }}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating…</span>
                </>
              ) : (
                <span>Sign in to Dashboard</span>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="mt-8 text-center text-xs text-slate-400 font-medium select-none">
            Protected Admin Portal · Aurus Residences
          </p>
        </div>

        {/* Right Column: Hero Visual Showcase (Hidden on Mobile) */}
        <div className="hidden lg:flex m-3.5 rounded-3xl bg-gradient-to-br from-[#123456] via-[#0b2340] to-[#071827] text-white p-12 relative overflow-hidden flex-col justify-between shadow-2xl border border-white/5">
          {/* Ambient Glowing Blobs */}
          <div
            className="absolute w-[440px] h-[440px] rounded-full opacity-25 blur-3xl -top-32 -right-24 pointer-events-none transition-colors duration-500"
            style={{ backgroundColor: palette.primaryHex }}
          />
          <div className="absolute w-80 h-80 rounded-full bg-blue-500/20 blur-3xl -bottom-24 -left-20 pointer-events-none" />

          {/* Concentric Decorative Orbits */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-white/10 pointer-events-none flex items-center justify-center">
            <div className="w-64 h-64 rounded-full border border-white/10 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border border-white/10" />
            </div>
          </div>

          {/* Satellite Orbit Dot */}
          <div
            className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full animate-ping shadow-lg"
            style={{ backgroundColor: palette.secondaryHex }}
          />

          {/* Top Statistics Section */}
          <div className="relative z-10 flex items-center gap-8 border-b border-white/10 pb-8">
            <div>
              <div className="text-3xl font-extrabold tracking-tight text-white tabular-nums">
                100%
              </div>
              <div className="text-[11px] font-bold text-slate-300 tracking-wider uppercase mt-1">
                Secure Auth
              </div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <div className="text-3xl font-extrabold tracking-tight text-white tabular-nums">
                24/7
              </div>
              <div className="text-[11px] font-bold text-slate-300 tracking-wider uppercase mt-1">
                Live Monitoring
              </div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <div className="text-3xl font-extrabold tracking-tight text-white tabular-nums">
                V1.0
              </div>
              <div className="text-[11px] font-bold text-slate-300 tracking-wider uppercase mt-1">
                API Backend
              </div>
            </div>
          </div>

          {/* Bottom Headline & Description */}
          <div className="relative z-10 max-w-md">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight mb-3">
              Complete Control Over{" "}
              <em
                className="font-normal italic"
                style={{ color: palette.secondaryHex }}
              >
                Residence Operations.
              </em>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Executive portal for luxury residence administration, inquiry processing,
              staff accounts, verification, and real-time operational analytics.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
