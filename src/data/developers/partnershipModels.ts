export interface PartnershipModel {
  tag: string;
  title: string;
  description: string;
  isCta?: boolean;
  ctaText?: string;
  ctaHref?: string;
}

export interface PartnershipModelsData {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  models: PartnershipModel[];
}

export const partnershipModelsData: PartnershipModelsData = {
  eyebrow: "03 // PARTNERSHIP STRUCTURES",
  titleTop: "ALIGNED WITH YOUR",
  titleAccent: "Goals.",
  models: [
    {
      tag: "MODEL 01",
      title: "Long-term lease",
      description:
        "Zero operational involvement for you. We lease the entire asset on a 9-15 year term with institutional corporate guarantees, structured escalations, and regular property upkeep.",
    },
    {
      tag: "MODEL 02",
      title: "Revenue share",
      description:
        "Align upside with Aurus. Earn a baseline minimum guarantee plus an agreed percentage of gross operating revenues, capturing upside from market demand and occupancy peaks.",
    },
    {
      tag: "MODEL 03",
      title: "Management contract",
      description:
        "You retain ownership and cash flow. Aurus operates the property under an asset-light management agreement, charging an incentive-aligned management fee.",
    },
    {
      tag: "MODEL 04",
      title: "Joint development",
      description:
        "Co-create a purpose-built student community from site planning and architecture to fitout and launch. Aurus advises on design and guarantees operational takeover on handover.",
    },
    {
      tag: "MODEL 05",
      title: "Brand + conversion",
      description:
        "Transform existing residential assets, boutique hotels, or under-performing hostels into premium Aurus-branded chapters with minimal downtime and swift pre-leasing.",
    },
    {
      tag: "NOT SURE WHICH FITS?",
      title: "Let's look at your asset",
      description:
        "Our partnerships team will run a quick structural & financial feasibility on your property.",
      isCta: true,
      ctaText: "SUBMIT YOUR PROPERTY",
      ctaHref: "#submit-property",
    },
  ],
};
