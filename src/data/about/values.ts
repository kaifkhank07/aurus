export interface PillarItem {
  number: string;
  title: string;
  description: string;
}

export interface AboutValuesData {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  items: PillarItem[];
}

export const aboutValuesData: AboutValuesData = {
  eyebrow: "VALUES",
  titleTop: "OUR NON - NEGOTIABLE",
  titleAccent: "Pillars.",
  items: [
    {
      number: "01",
      title: "HOSPITALITY-FIRST ETHOS",
      description:
        "We treat student housing as fine hospitality. Daily room cleaning, concierge support, and prompt resolution.",
    },
    {
      number: "02",
      title: "UNCOMPROMISED SAFETY",
      description:
        "3-tier biometric gates, female security guards, and 24/7 CCTV surveillance ensure complete peace of mind.",
    },
    {
      number: "03",
      title: "NUTRITIONAL EXCELLENCE",
      description:
        "Chef-prepared meals using organic, fresh ingredients tailored to student health and regional preferences.",
    },
    {
      number: "04",
      title: "TRANSPARENT PRICING",
      description:
        "One monthly number covers meals, WiFi, housekeeping, laundry and security. No add-ons at move-in.",
    },
  ],
};
