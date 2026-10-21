import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ResidenceType =
  | "choose-residence"
  | "student-residences"
  | "managed-residences";

interface ResidencesState {
  selectedResidence: ResidenceType;
  setSelectedResidence: (residence: ResidenceType) => void;
}

export const useResidences = create<ResidencesState>()(
  persist(
    (set) => ({
      selectedResidence: "choose-residence",

      setSelectedResidence: (residence) =>
        set({ selectedResidence: residence }),
    }),
    {
      name: "selected-residence",
    }
  )
);