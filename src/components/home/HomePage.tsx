"use client";

import { useEffect, useState } from "react";
import { ChooseResidence } from "./ChooseResidence";
import StudentResidences from "../student-residences/StudentResidences";
import ManagedResidences from "../managed-residences/ManagedResidences";
import { useResidences } from "@/store/useResidences";

export default function HomePage() {
  const { selectedResidence } = useResidences();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    // <main>
    //   {selectedResidence === "student-residences" ? (
    //     <StudentResidences />
    //   ) : selectedResidence === "managed-residences" ? (
    //     <ManagedResidences />
    //   ) : (
    //     <ChooseResidence />
    //   )}
    // </main>
    <main>
      <StudentResidences />
    </main>
  );
}
