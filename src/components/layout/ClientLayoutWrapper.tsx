"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import SmoothScroll from "./SmoothScroll";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import FloatingActions from "./FloatingActions";

/**
 * Resets scroll position on navigation while preserving anchor navigation.
 */
function ScrollResetOnNavigate() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Prevent browser scroll restoration.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Preserve anchor navigation.
    if (window.location.hash) {
      try {
        const hashEl = document.querySelector(window.location.hash);

        if (hashEl) {
          hashEl.scrollIntoView({ behavior: "instant" });
          return;
        }
      } catch {
        // Fall back to scrolling to the top.
      }
    }

    const resetToTop = () => {
      const win = window as typeof window & {
        lenis?: {
          stop: () => void;
          start: () => void;
          scrollTo: (
            target: number,
            options: { immediate: boolean; force: boolean }
          ) => void;
        };
      };

      // Stop Lenis momentum and reset public-page scrolling.
      if (win.lenis) {
        try {
          win.lenis.stop();
          win.lenis.scrollTo(0, {
            immediate: true,
            force: true,
          });
          win.lenis.start();
        } catch {
          // Lenis may be initializing or reinitializing.
        }
      }

      // Reset native document scrolling.
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });

      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetToTop();

    const rafId = requestAnimationFrame(resetToTop);
    const timerId = window.setTimeout(resetToTop, 50);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
    };
  }, [pathname, searchParams]);

  return null;
}

/**
 * Shared admin route check.
 */
function useIsAdminRoute() {
  const pathname = usePathname();
  return pathname?.startsWith("/admin") ?? false;
}

function LayoutNav() {
  const pathname = usePathname();
  const isAdmin = useIsAdminRoute();

  if (isAdmin) return null;

  const isNotHomepage =
    pathname !== "/" &&
    pathname !== "/student-hostels" &&
    pathname !== "/managed-hostels" &&
    pathname !== "/student-residences" &&
    pathname !== "/managed-residences";

  return isNotHomepage ? <Navbar /> : null;
}

function LayoutFooter() {
  const isAdmin = useIsAdminRoute();

  if (isAdmin) return null;

  return <Footer />;
}

function LayoutScroll() {
  const isAdmin = useIsAdminRoute();

  if (isAdmin) return null;

  return <SmoothScroll />;
}

function LayoutFloatingActions() {
  const isAdmin = useIsAdminRoute();

  if (isAdmin) return null;

  return <FloatingActions />;
}

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <ScrollResetOnNavigate />
      </Suspense>

      <Suspense fallback={null}>
        <LayoutNav />
      </Suspense>

      <Suspense fallback={null}>
        <LayoutScroll />
      </Suspense>

      {children}

      <Suspense fallback={null}>
        <LayoutFooter />
      </Suspense>

      <Suspense fallback={null}>
        <LayoutFloatingActions />
      </Suspense>
    </>
  );
}