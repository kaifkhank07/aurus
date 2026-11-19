export interface ResidenceSpec {
  label: string;
  value: string;
}

export interface ManagedResidenceType {
  tag: string;
  title: string;
  subtitle: string;
  specs: ResidenceSpec[];
  ctaLabel: string;
}

export interface ManagedResidencesData {
  eyebrowLeft: string;
  eyebrowRight: string;
  types: ManagedResidenceType[];
}


export const managedResidences: ManagedResidencesData = {
  eyebrowLeft: "02 // HOMES",
  eyebrowRight: "PRICING ON REQUEST",
  types: [
    {
      tag: "STUDIO",
      title: "THE STUDIO",
      subtitle:
        "A smart, self-contained home for one — sleep, work and unwind in a single well-planned space.",
      specs: [
        { label: "SLEEPS", value: "One" },
        {
          label: "INSIDE",
          value:
            "Bed, workstation, wardrobe, kitchenette, private bathroom",
        },
        {
          label: "IDEAL FOR",
          value: "Solo professionals and short postings",
        },
      ],
      ctaLabel: "ASK FOR AVAILABILITY",
    },
    {
      tag: "1 BHK",
      title: "THE ONE-BEDROOM",
      subtitle:
        "A separate bedroom and living space, for longer stays or anyone who likes a door between work and rest.",
      specs: [
        { label: "SLEEPS", value: "One or two" },
        {
          label: "INSIDE",
          value:
            "Bedroom, living area with workstation, kitchenette, private bathroom",
        },
        {
          label: "IDEAL FOR",
          value: "Longer stays and couples",
        },
      ],
      ctaLabel: "ASK FOR AVAILABILITY",
    },
  ],
};

