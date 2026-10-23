export interface PillarItem {
  number: string;
  title: string;
  description: string;
}

export interface AmenityItem {
  number: string;
  title: string;
}

export interface CommunitySpaceItem {
  image: string;
  alt: string;
}

export interface ExperienceFeature {
  number: string;
  title: string;
  detail: string;
}

export interface AboutData {
  hero: {
    titleTop: string;
    titleAccent: string;
    body: string;
    cta: {
      label: string;
      href: string;
    };
  };
  story: {
    titleTop: string;
    titleAccent: string;
    paragraphs: string[];
    image: string;
    alt: string;
  };
  values: {
    eyebrow: string;
    titleTop: string;
    titleAccent: string;
    items: PillarItem[];
  };
  amenities: {
    eyebrow: string;
    titleTop: string;
    titleAccent: string;
    body: string;
    image: string;
    alt: string;
    items: AmenityItem[];
  };
  communitySpaces: {
    eyebrow: string;
    titleTop: string;
    titleAccent: string;
    body: string;
    cta: {
      label: string;
      href: string;
    };
    items: CommunitySpaceItem[];
  };
  cherishExperience: {
    titleTop: string;
    titleAccent: string;
    body: string;
    features: ExperienceFeature[];
    actions: {
      label: string;
      href: string;
      variant?: "outline" | "solid";
    }[];
    photos: {
      topRight: { src: string; alt: string };
      middle: { src: string; alt: string };
      bottomLeft: { src: string; alt: string };
      bottomRight: { src: string; alt: string };
    };
  };
}

export const aboutData: AboutData = {
  hero: {
    titleTop: "REDEFINING STUDENT RESIDENCES ACROSS",
    titleAccent: "India.",
    body: "Founded with a clear mission: to replace antiquated hostels with lifestyle-driven, hospitality-led sanctuaries for scholars.",
    cta: {
      label: "ENQUIRE",
      href: "/contact",
    },
  },
  story: {
    titleTop: "THE AURUS",
    titleAccent: "Story.",
    paragraphs: [
      "Built by alumni who remembered the struggle of finding safe, clean, and nutritious student housing in India.",
      "When we moved to metro cities for college, we experienced the grim reality of standard PGs — uninspiring meals, dark rooms, lack of security, and indifferent management.",
      "Aurus was launched to build what we wished we had: beautiful architecture, 5-star hospitality, high-speed fibre internet, chef-cooked meals, and a vibrant community of fellow dreamers.",
    ],
    image: "/images/lounge.jpg",
    alt: "The Aurus Story lounge - Luxury student residences with warm timber and designer lighting",
  },
  values: {
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
  },
  amenities: {
    eyebrow: "EXCLUSIVE AMENITIES",
    titleTop: "EVERY DETAIL,",
    titleAccent: "Considered.",
    body: "At Aurus, experience a lifestyle crafted with luxury and convenience in mind – state-of-the-art fitness centres, elegantly designed common areas, high-speed Wi-Fi and 24/7 security. Relax in the lounges, unwind on the rooftop, and let the concierge take care of the rest.",
    image: "/images/life-enjoy.jpg",
    alt: "Aurus recreation and games lounge with pool table and foosball",
    items: [
      { number: "01", title: "INFINITY POOL" },
      { number: "02", title: "WORLD-CLASS GYM" },
      { number: "03", title: "RFID IN ALL ROOMS" },
      { number: "04", title: "5-STAR DINING EXPERIENCE" },
      { number: "05", title: "CONCIERGE" },
      { number: "06", title: "PERSONAL BUTLER" },
      { number: "07", title: "AIRPORT PICK-UP & DROP" },
      { number: "08", title: "STEAM ROOM" },
      { number: "09", title: "SALON EXPERIENCE" },
      { number: "10", title: "DEDICATED MANAGER" },
      { number: "11", title: "PREMIUM CONFERENCE ROOM" },
      { number: "12", title: "YOGA ROOM" },
    ],
  },
  communitySpaces: {
    eyebrow: "COMMUNITY SPACES",
    titleTop: "THE HEART OF THE",
    titleAccent: "Residence.",
    body: "Vibrant communal spaces that foster connection, collaboration and the memories you keep. From quiet library corners to dining halls and rooftop decks – this is where neighbours become friends.",
    cta: {
      label: "LIFE @ AURUS",
      href: "/life-at-aurus",
    },
    items: [
      {
        image: "/images/lounge.jpg",
        alt: "Double-height residence lounge with architectural mezzanine and custom pendant lighting",
      },
      {
        image: "/images/image01.jpg",
        alt: "Quiet reading and conversation lounge with rich timber accents and bespoke seating",
      },
      {
        image: "/images/image02.jpg",
        alt: "Contemporary media lounge with fluted wall paneling and natural illumination",
      },
      {
        image: "/images/life-connect.jpg",
        alt: "Collaborative study hall with expansive library shelves and shared workstations",
      },
    ],
  },
  cherishExperience: {
    titleTop: "NOT JUST A PLACE TO STAY",
    titleAccent: "— an experience to cherish.",
    body: "We know studying and living away from home can be challenging. So we prioritise your safety, simplify the daily tasks, serve home-cooked meals, and offer academic support – in spaces where worry-free living meets exceptional hospitality.",
    features: [
      {
        number: "01",
        title: "Safety first",
        detail: "Biometric entry, warden 24/7",
      },
      {
        number: "02",
        title: "Daily tasks handled",
        detail: "Housekeeping & laundry",
      },
      {
        number: "03",
        title: "Home-style meals",
        detail: "nutritious menu",
      },
      {
        number: "04",
        title: "Academic support",
        detail: "& study-friendly spots",
      },
    ],
    actions: [
      {
        label: "EXPLORE LIFE @ AURUS",
        href: "/life-at-aurus",
        variant: "outline",
      },
      {
        label: "COME OVER & FEEL THE DIFFERENCE",
        href: "/contact",
        variant: "solid",
      },
    ],
    photos: {
      topRight: {
        src: "/images/image14.png",
        alt: "Aurus residents smiling outdoors by the rooftop pool",
      },
      middle: {
        src: "/images/image15.png",
        alt: "Resident DJ performing at an evening social celebration",
      },
      bottomLeft: {
        src: "/images/image18.jpg",
        alt: "Open-air movie screening under evening ambient lighting",
      },
      bottomRight: {
        src: "/images/image16.jpg",
        alt: "Community friends bonding and enjoying a weekend social",
      },
    },
  },
};
