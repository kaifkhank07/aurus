export interface PricingColumn {
  tag: string;
  title: string;
  subtitle: string;
  items: string[];
}

export interface PricingData {
  eyebrowLeft: string;
  eyebrowRight: string;
  titleTop: string;
  titleAccent: string;
  columns: PricingColumn[];
}

export const managedPricing: PricingData = {
  eyebrowLeft: "04 // PLANS",
  eyebrowRight: "ONE CLEAR INVOICE",
  titleTop: "STAY. ADD WHAT YOU",
  titleAccent: "Need.",
  columns: [
    {
      tag: "STAY",
      title: "Included",
      subtitle: "Everything a managed home needs",
      items: [
        "Furnished home & workstation",
        "Housekeeping & linen",
        "High-speed fibre, power backup",
        "Gym & secure access",
      ],
    },
    {
      tag: "STAY + DINE",
      title: "Add-on",
      subtitle: "Meals from the Aurus kitchen",
      items: [
        "Breakfast, dinner or full board",
        "Pause any week you travel",
        "Pure-veg & regional options",
      ],
    },
    {
      tag: "STAY + WORK",
      title: "Add-on",
      subtitle: "A reserved desk downstairs",
      items: [
        "Your own desk in the business lounge",
        "Meeting space when you need it",
        "Guest passes for colleagues",
      ],
    },
  ],
};
