export interface AboutHeroData {
  titleTop: string;
  titleAccent: string;
  body: string;
  cta: {
    label: string;
    href: string;
  };
}

export const aboutHeroData: AboutHeroData = {
  titleTop: "REDEFINING STUDENT RESIDENCES ACROSS",
  titleAccent: "India.",
  body: "Founded with a clear mission: to replace antiquated hostels with lifestyle-driven, hospitality-led sanctuaries for scholars.",
  cta: {
    label: "ENQUIRE",
    href: "/contact",
  },
};
