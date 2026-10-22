"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import SmoothScroll from "./SmoothScroll";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

function LayoutNav() {
  const pathname = usePathname();
  const isNotHomepage =
    pathname !== "/" &&
    pathname !== "/student-residences" &&
    pathname !== "/managed-residences";

  if (!isNotHomepage) return null;
  return <Navbar />;
}

function LayoutFooter() {
  const pathname = usePathname();
  const isNotOnlyHomepage = pathname !== "/";

  if (!isNotOnlyHomepage) return null;
  return <Footer />;
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
        <SmoothScroll />
      </Suspense>
      {children}
      <Suspense fallback={null}>
        <LayoutFooter />
      </Suspense>
    </>
  );
}
