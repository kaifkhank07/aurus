export interface CoreOperationItem {
  number: string;
  title: string;
  description: string;
}

export interface CoreOperationsData {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  items: CoreOperationItem[];
}

export const coreOperationsData: CoreOperationsData = {
  eyebrow: "02 // TECHNOLOGY",
  titleTop: "CORE TO HOW WE",
  titleAccent: "Operate.",
  items: [
    {
      number: "01",
      title: "For residents",
      description:
        "Smooth automated payments, quick issue resolution, easy navigation of daily operations, and direct communication with our operations team.",
    },
    {
      number: "02",
      title: "For owners",
      description:
        "A single platform with real-time portfolio data, regular occupancy, performance and cost tracking, transparent reporting and long-term asset performance visibility.",
    },
  ],
};
