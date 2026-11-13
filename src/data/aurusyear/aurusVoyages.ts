export interface IAurusVoyageItem {
  romanNumeral: string;
  title: string;
  description: string;
  image: string;
}

export interface AurusVoyagesData {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  items: IAurusVoyageItem[];
}

export const aurusVoyagesData: AurusVoyagesData = {
  eyebrow: "THE REWARDS",
  titleTop: "TWO VOYAGES,",
  titleAccent: "Earned.",
  items: [
    {
      romanNumeral: "I",
      title: "THE GOA VOYAGE",
      description:
        "A 3-4 day domestic trip, fully hosted. Earned by the winning team of the Aurus Cricket League, the winning team of the Aurus Padel Cup, and 20 random residents drawn live online from across all nine properties.",
      image: "/images/aurusyear/goa-voyage.jpg",
    },
    {
      romanNumeral: "II",
      title: "THE INTERNATIONAL VOYAGE",
      description:
        "A May trip to Bali or Bangkok. Earned by the 10 strongest pitches at the Founders Club Final, the top 5 creators of the year-long Resident Creators programme, and 20 random residents drawn live online from across all properties. The draw is public, in front of every resident.",
      image: "/images/aurusyear/international-voyage.jpg",
    },
  ],
};

