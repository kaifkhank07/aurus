export interface DeveloperHeroData {
  titleTop: string;
  titleAccent: string;
  body: string;
  actions: {
    label: string;
    href: string;
    variant: "solid" | "outline";
  }[];
  image: {
    src: string;
    alt: string;
  };
}

export interface StrategicPartnerStat {
  number: string;
  label: string;
  description: string;
}

export interface StrategicPartnerData {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  body: string;
  stats: StrategicPartnerStat[];
}

export interface AssetClassItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface AssetClassData {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  items: AssetClassItem[];
}

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

export interface IdealAssetCriterion {
  icon: string;
  text: string;
}

export interface IdealAssetsData {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  body: string;
  image: {
    src: string;
    alt: string;
  };
  criteria: IdealAssetCriterion[];
}

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

export interface SubmitProjectData {
  eyebrow: string;
  title: string;
  body: string;
  email: string;
  propertyTypes: string[];
}

export interface DevelopersPageData {
  hero: DeveloperHeroData;
  strategicPartner: StrategicPartnerData;
  assetClass: AssetClassData;
  partnershipModels: PartnershipModelsData;
  idealAssets: IdealAssetsData;
  executionProcess: ExecutionProcessData;
  submitProject: SubmitProjectData;
}

export const developersData: DevelopersPageData = {
  hero: {
    titleTop: "BUILD PRE-LEASED STUDENT HOUSING WITH",
    titleAccent: "Aurus.",
    body: "We partner with developers, landowners and institutional investors to turn residential and mixed-use real estate into premium, high-occupancy student housing — from concept to operations.",
    actions: [
      {
        label: "FOR DEVELOPERS",
        href: "#submit-property",
        variant: "solid",
      },
      {
        label: "FINANCIAL MODEL",
        href: "#partnership-models",
        variant: "outline",
      },
      {
        label: "PROTOTYPE",
        href: "#what-we-look-for",
        variant: "outline",
      },
    ],
    image: {
      src: "/images/lounge.jpg",
      alt: "Aurus luxury student residence lounge interior with designer seating and architectural mezzanine",
    },
  },

  strategicPartner: {
    eyebrow: "01 // A STRATEGIC OPERATING PARTNER",
    titleTop: "NOT JUST A",
    titleAccent: "Tenant.",
    body: "Founded in 2019 by student housing specialists, Aurus designs and operates premium residences near India's top education hubs. We work closely with developers to transform conventional buildings into purpose-built, institutionally scalable student accommodation.",
    stats: [
      {
        number: "2019",
        label: "SINCE",
        description: "Pioneer of student housing in India",
      },
      {
        number: "9",
        label: "CHAPTERS",
        description: "Across 5 Indian education hubs",
      },
      {
        number: "5+",
        label: "CITIES",
        description: "With pipeline expansion",
      },
      {
        number: "END-TO-END",
        label: "SCOPE",
        description: "Design, build, launch, operations",
      },
    ],
  },

  assetClass: {
    eyebrow: "02 // WHY PURPOSE-BUILT STUDENT HOUSING",
    titleTop: "THE NEXT INSTITUTIONAL",
    titleAccent: "Asset Class.",
    items: [
      {
        id: "demand",
        icon: "trend",
        title: "Demand far beyond supply",
        description:
          "India faces a structural student housing deficit in every major education cluster, creating predictable multi-decade demand for institutional-grade student housing.",
      },
      {
        id: "yield",
        icon: "yield",
        title: "Higher yield per square foot",
        description:
          "Purpose-built student residences deliver higher revenue per square foot than conventional residential or commercial leases, driven by density, amenities, and sticky annual tenancies.",
      },
      {
        id: "occupancy",
        icon: "occupancy",
        title: "Predictable occupancy",
        description:
          "Academic-year lease cycles and long-term university tie-ups create dependable, high-occupancy cash flows insulated from broader economic and corporate downturns.",
      },
      {
        id: "managed",
        icon: "managed",
        title: "A shift to managed living",
        description:
          "Today's students and parents demand hospitality-grade amenities, verified security, chef-prepared dining, and active communities over unorganised PGs and shared flats.",
      },
    ],
  },

  partnershipModels: {
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
  },

  idealAssets: {
    eyebrow: "04 // IDEAL ASSETS",
    titleTop: "WHAT WE LOOK",
    titleAccent: "For.",
    body: "Delightful spaces in our in-house cafes — specialty coffee, fresh bakes and late-night study fuel, ordered by QR right from your table.",
    image: {
      src: "/images/life-eat.jpg",
      alt: "Aurus in-house artisanal cafe and reception counter with warm timber aesthetics and modern lighting",
    },
    criteria: [
      {
        icon: "location",
        text: "Turnkey PGs and off-plan plots (close to top tertiary spots)",
      },
      {
        icon: "building",
        text: "Bare shell residential buildings (min 50-bed, plotted and-in-line)",
      },
      {
        icon: "security",
        text: "Clear titles, commercial/mixed-use or residential zoning permissions",
      },
      {
        icon: "food",
        text: "Convenient access to campuses, transit nodes and student activity corridors",
      },
      {
        icon: "community",
        text: "Developers and landowners seeking reliable, institutional long-term operating partners",
      },
    ],
  },

  executionProcess: {
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
  },

  submitProject: {
    eyebrow: "PARTNER WITH US",
    title: "SUBMIT YOUR PROPERTY OR PROJECT",
    body: "Developers, landowners and investors with land, under-construction projects or ready assets near education hubs — our partnerships team will evaluate the opportunity and get back to you.",
    email: "dev@auruslife.com",
    propertyTypes: [
      "Bare Shell Residential Building",
      "Under Construction Project",
      "Existing Hostel / PG Conversion",
      "Land / Greenfield Plot",
      "Commercial / Hotel Conversion",
    ],
  },
};
