"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import SmoothScroll from "./SmoothScroll";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

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
  // const isNotOnlyHomepage = pathname !== "/";

  // if (!isNotOnlyHomepage) return null;
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
