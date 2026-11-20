export interface OperatorHeroAction {
  label: string;
  href: string;
  variant: "solid" | "outline";
}

export interface OperatorHeroData {
  titleTop: string;
  titleAccent: string;
  body: string;
  actions: OperatorHeroAction[];
}

export const operatorHeroData: OperatorHeroData = {
  titleTop: "OPERATED WITH",
  titleAccent: "Intention.",
  body: "Every Aurus property is run on three commitments — safety, community and elevated living — so it becomes a real home for residents and a reliable, high-performing asset for owners.",
  actions: [
    {
      label: "For Developers",
      href: "/developers",
      variant: "outline",
    },
    {
      label: "Request A Model",
      href: "#talk-to-ops",
      variant: "solid",
    },
  ],
};
