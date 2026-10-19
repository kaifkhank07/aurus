"use client";

import { usePathname } from "next/navigation";
import SmoothScroll from "./SmoothScroll";
import { Footer } from "./Footer";


export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomeRoute = pathname === "/";

  if (isHomeRoute) {
    return <>{children}</>;
  }

  return (
    <>
      {/* <Navbar /> */}
      <SmoothScroll />
      {children}
      {!isHomeRoute && <Footer />}
    </>
  );
}
