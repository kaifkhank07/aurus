"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import SmoothScroll from "./SmoothScroll";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

/**
 * Universal scroll-to-top handler for all page navigations (public & admin).
 * Ensures every navigation cleanly starts at the top (0, 0) without inertia carry-over,
 * while respecting anchor links (hashes like #culture, #faq).
 */
function ScrollResetOnNavigate() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Prevent the browser from automatically restoring previous scroll positions
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // If an anchor hash is targeted, allow scrolling to that element instead of top
    if (window.location.hash) {
      try {
        const hashEl = document.querySelector(window.location.hash);
        if (hashEl) {
          hashEl.scrollIntoView({ behavior: "instant" });
          return;
        }
      } catch {
        // Invalid selector, fall through to scroll to top
      }
    }

    const resetToTop = () => {
      // 1. If Lenis is active on public pages, stop momentum and snap to 0
      const win = window as any;
      if (win.lenis) {
        try {
          win.lenis.stop();
          win.lenis.scrollTo(0, { immediate: true, force: true });
          win.lenis.start();
        } catch {
          // Lenis might be re-initializing
        }
      }

      // 2. Snap native window and root document elements instantly
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    };

    // Immediate synchronous reset
    resetToTop();

    // Re-verify after React commits the new page layout to the DOM
    const rafId = requestAnimationFrame(resetToTop);

    // Final safety check after async components and images settle
    const timer = setTimeout(resetToTop, 50);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [pathname, searchParams]);

  return null;
}

function LayoutNav() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  const isNotHomepage =
    pathname !== "/" &&
    pathname !== "/student-residences" &&
    pathname !== "/managed-residences";

  if (!isNotHomepage) return null;
  return <Navbar />;
}

function LayoutFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <Footer />;
}

function LayoutScroll() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <SmoothScroll />;
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
    </>
  );
}
