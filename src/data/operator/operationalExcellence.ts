export interface OperationalPillar {
  number: string;
  title: string;
  points: string[];
}

export interface OperationalExcellenceData {
  eyebrow: string;
  pillars: OperationalPillar[];
}

export const operationalExcellenceData: OperationalExcellenceData = {
  eyebrow: "01 // OPERATIONAL EXCELLENCE, END TO END",
  pillars: [
    {
      number: "01",
      title: "Planning & daily operations",
      points: [
        "Detailed operating plans and realistic annual budgets",
        "Aurus brand standards and resident-experience frameworks",
        "Hands-on support with consistent quality checks",
        "Continuous staff training for service excellence",
      ],
    },
    {
      number: "02",
      title: "Leasing, demand & marketing",
      points: [
        "Annual leasing strategy for each micro-market",
        "Digital and offline marketing in the Aurus brand",
        "Relationships with universities, coaching institutes and corporates",
        "Community initiatives that build word of mouth",
      ],
    },
    {
      number: "03",
      title: "Asset management & visibility",
      points: [
        "Real-time performance monitoring",
        "Transparent revenue dashboards",
        "Cost-optimisation insights",
        "Maintenance and facility audit reports",
        "Long-term asset value planning",
      ],
    },
  ],
};
