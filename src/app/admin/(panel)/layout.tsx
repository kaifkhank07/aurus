"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/layout/AdminShell";
import { useAuthStore } from "@/store/useAuthStore";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isInitialized, checkAuth } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    async function verify() {
      const isLogged = await checkAuth();
      if (!isMounted) return;
      if (!isLogged) {
        router.replace("/admin/login");
      }
    }

    verify();

    return () => {
      isMounted = false;
    };
  }, [checkAuth, router]);

  // Loading state while verifying authentication
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center font-extrabold text-lg shadow-lg shadow-orange-500/30 animate-pulse">
          A
        </div>
        <p className="mt-4 text-xs font-semibold tracking-widest text-slate-400 uppercase">
          Verifying Admin Session…
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <AdminShell>{children}</AdminShell>;
}
