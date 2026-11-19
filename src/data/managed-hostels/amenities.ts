export interface ManagedAmenityItem {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface ManagedAmenitiesData {
  eyebrowLeft: string;
  eyebrowRight: string;
  items: ManagedAmenityItem[];
}


export const managedAmenities: ManagedAmenitiesData = {
  eyebrowLeft: "03 // WHAT'S INCLUDED",
  eyebrowRight: "EVERYDAY LUXURY",
  items: [
    {
      id: "furnished",
      number: "01",
      title: "Fully furnished",
      description:
        "Bedroom, living space and kitchenette furnished to the Aurus standard, with linen and maintenance.",
    },
    {
      id: "housekeeping",
      number: "02",
      title: "Housekeeping",
      description:
        "Regular cleaning, fresh linen and laundry, so the chores leave your week.",
    },
    {
      id: "wifi",
      number: "03",
      title: "High-speed fibre",
      description:
        "Dedicated fibre internet with power backup — calls and late deadlines never drop.",
    },
    {
      id: "coworking",
      number: "04",
      title: "Space to work",
      description:
        "A workstation in every home, plus a shared business lounge and meeting space.",
    },
    {
      id: "dining",
      number: "05",
      title: "Dining, your way",
      description:
        "Optional meal plans from the Aurus kitchen; pause them when you travel.",
    },
    {
      id: "fitness",
      number: "06",
      title: "Fitness",
      description:
        "An equipped gym for early starts and long weeks.",
    },
    {
      id: "security",
      number: "07",
      title: "Secure access",
      description:
        "Controlled entry and on-site staff around the clock.",
    },
    {
      id: "app",
      number: "08",
      title: "The resident app",
      description:
        "Payments, service requests and the residence team, all in one place.",
    },
  ],
};
