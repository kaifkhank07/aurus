export interface Itestimonial {
  quote: string;
  attribution: string;
}

export interface testimonialData {
  eyebrow: string;
  items: Itestimonial[];
}

export const testimonial: testimonialData = {
  eyebrow: "Resident Voice",
  items: [
    {
      quote: "Living at Aurus feels less like staying somewhere and more like having a place of your own.",
      attribution: "— Aurus Resident · NMIMS Scholar",
    },
    {
      quote: "Chef-curated meals, ergonomic study hubs, and high-speed Wi-Fi made my academic routine seamless.",
      attribution: "— Aurus Resident · Mithibai College",
    },
    {
      quote: "The biometric security and female wardens give my parents total peace of mind every single day.",
      attribution: "— Aurus Resident · Bennett University",
    },
  ],
};
