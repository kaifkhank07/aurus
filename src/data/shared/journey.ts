export interface journeyData {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  body: string;
  watermark: string;
  actions: { label: string; href: string; solid: boolean }[];
}

export const journey: journeyData = {
  eyebrow: "09 // Your Next Chapter",
  titleTop: "Start your",
  titleAccent: "Journey.",
  body: "Explore Aurus residences across India and discover a space designed around your life.",
  watermark: "AURUS",
  actions: [
    { label: "Explore Residences", href: "/residences", solid: false },
    { label: "Book a Visit", href: "#", solid: true },
  ],
};
