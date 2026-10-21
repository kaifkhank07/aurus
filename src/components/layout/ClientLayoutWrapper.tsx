"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SmoothScroll from "./SmoothScroll";
import { Footer } from "./Footer";
import { useResidences } from "@/store/useResidences";
import { Navbar } from "./Navbar";


export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { selectedResidence } = useResidences();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch: default to isHomeRoute until client hydrates
  const isHomeRoute = !mounted || selectedResidence === "choose-residence";
  // const isNotHomepage = pathname !== "/";
  const isNotHomepage = pathname !== "/" && pathname !== "/student-residences" && pathname !== "/managed-residences";
  const isNotOnlyHomepage = pathname !== "/";

  // if (isHomeRoute) {
  //   return <>{children}</>;
  // }

  return (
    <>
      {isNotHomepage && <Navbar />}
      <SmoothScroll />
      {children}
      {/* <Footer /> */}
      {isNotOnlyHomepage && <Footer />}
    </>
  );
}

