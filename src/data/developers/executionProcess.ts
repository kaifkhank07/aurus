export interface ExecutionStep {
  step: string;
  title: string;
  description: string;
}

export interface ExecutionProcessData {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  steps: ExecutionStep[];
}

export const executionProcessData: ExecutionProcessData = {
  eyebrow: "05 // HOW WE WORK",
  titleTop: "STRUCTURED, DEVELOPER-FRIENDLY",
  titleAccent: "Execution.",
  steps: [
    {
      step: "01",
      title: "Asset evaluation & feasibility",
      description:
        "Locations, structural audit, municipality permissions, initial potential revenue model.",
    },
    {
      step: "02",
      title: "Concept, design & financial plan",
      description:
        "Space planning, amenity roadmap, brand integration & capex budget breakdown.",
    },
    {
      step: "03",
      title: "Pre-leasing & positioning",
      description:
        "Early marketing, university outreach and demand generation before launch.",
    },
    {
      step: "04",
      title: "Launch & operations",
      description:
        "Staffing, housekeeping, student engagement administration, and launch.",
    },
    {
      step: "05",
      title: "Revenue optimisation & scale",
      description:
        "Continuous yield oversight, property asset appreciation and brand retention value.",
    },
  ],
};
