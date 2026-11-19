export interface ManagedIntroStat {
  value: string;
  label: string;
}

export interface ManagedIntroData {
  statement: string;
  stats: ManagedIntroStat[];
}

export const managedIntro: ManagedIntroData = {
  statement:
    "Built for the people building India’s international finance hub. One address in GIFT City where the home is ready, the chores are handled and the office is minutes away - so the only thing you need to bring is a suitcase.",
  stats: [
    { value: "01", label: "Residence, in GIFT City" },
    { value: "30", label: "Day minimum stay" },
    { value: "24/7", label: "On-site Aurus team" },
    { value: "01", label: "Monthly invoice" },
  ],
};
