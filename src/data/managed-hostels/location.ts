export interface LocationItem {
  destination: string;
  time: string;
}

export interface LocationData {
  eyebrowLeft: string;
  eyebrowRight: string;
  titleTop: string;
  titleAccent: string;
  description: string;
  mapUrl: string;
  destinations: LocationItem[];
}

export const managedLocation: LocationData = {
  eyebrowLeft: "05 // LOCATION",
  eyebrowRight: "OPEN IN MAPS",
  titleTop: "IN THE MIDDLE OF",
  titleAccent: "GIFT City.",
  description:
    "Gujarat International Finance Tec-City is India’s international financial services centre, home to banks, exchanges, fintechs and global capability centres. Living here means your commute is measured in minutes, not traffic.",
  mapUrl: "https://maps.google.com/?q=GIFT+City+Gandhinagar",
  destinations: [
    {
      destination: "GIFT City business district",
      time: "MINUTES AWAY",
    },
    {
      destination: "Gandhinagar",
      time: "A SHORT DRIVE",
    },
    {
      destination: "Ahmedabad International Airport",
      time: "AROUND 30 MINUTES",
    },
    {
      destination: "Ahmedabad city",
      time: "AROUND 30–40 MINUTES",
    },
  ],
};
