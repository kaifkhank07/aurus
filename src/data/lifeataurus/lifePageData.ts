import { Coffee, Leaf, LucideIcon, MessageSquare, ShieldCheck, Smartphone, UsersRound } from "lucide-react";

export interface LivingFeature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface TimelineSlot {
  time: string;
  activity: string;
}

export interface FacilityData {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  body: string;
  image: { src: string; alt: string };
  amenities: string[];
}

export interface MomentItem {
  image: string;
  label: string;
  alt: string;
}

export interface MomentsGalleryData {
  eyebrow: string;
  items: MomentItem[];
}

export interface CafeAndAppData {
  cafe: {
    eyebrow: string;
    titleTop: string;
    titleAccent: string;
    body: string;
    image: { src: string; alt: string };
  };
  app: {
    eyebrow: string;
    titleTop: string;
    titleAccent: string;
    body: string;
    bullets: string[];
    image: { src: string; alt: string };
  };
}

export interface LifePageData {
  hero: {
    titleTop: string;
    titleAccent: string;
    body: string;
    images: {
      main: { src: string; alt: string };
      topRight: { src: string; alt: string };
      bottomRight: { src: string; alt: string };
    };
  };
  livingMeans: {
    eyebrow: string;
    items: LivingFeature[];
  };
  dailyRhythm: {
    eyebrow: string;
    titleTop: string;
    titleAccent: string;
    body: string;
    image: { src: string; alt: string };
    timeline: TimelineSlot[];
  };
  facilities: FacilityData;
  momentsGallery: MomentsGalleryData;
  cafeAndApp: CafeAndAppData;
}

export const lifePageData: LifePageData = {
  hero: {
    titleTop: "LIFE @",
    titleAccent: "Aurus",
    body: "Not just a place to sleep - a hospitality-led home designed for safety, focus and the friendships that make college what it is.",
    images: {
      main: {
        src: "/images/image16.jpg",
        alt: "Aurus community celebrating and connecting at house party",
      },
      topRight: {
        src: "/images/image15.png",
        alt: "Resident DJ performing at evening music session",
      },
      bottomRight: {
        src: "/images/image23.jpg",
        alt: "Students bonding together outdoors on the terrace",
      },
    },
  },
  livingMeans: {
    eyebrow: "01 // WHAT LIVING HERE MEANS",
    items: [
      {
        title: "Safety, three layers deep",
        description:
          "Biometric entry, female security guards round the clock, broken-down digital logs for visitors, and CCTV cover so complete peace comes standard. SOS callout in the app.",
        icon: ShieldCheck,
      },
      {
        title: "Food worth coming home to",
        description:
          "In-house chefs cook four meals a day from fresh ingredients, with regional days, vegetarian and jain options and monthly menus you can feed feedback on.",
        icon: Coffee,
      },
      {
        title: "A community, not a corridor",
        description:
          "Foosball tables, networking evenings, festive dos, acoustic nights and sports leagues – planned by a team that loves a good party.",
        icon: UsersRound,
      },
      {
        title: "Mind and body",
        description:
          "Quiet yoga zone, space-saving fitness gym and open terrace for quick workouts between lectures.",
        icon: Leaf,
      },
      {
        title: "Built for focus",
        description:
          "Acoustic study pods, print kiosk, push-pin pinboards with ergonomic seating and cheering study energy for late-night exams.",
        icon: MessageSquare,
      },
      {
        title: "Everything in the app",
        description:
          "Pay rent, book services, raise maintenance requests, sign up for events and read today's menu and manager – all from your phone.",
        icon: Smartphone,
      },
    ],
  },
  dailyRhythm: {
    eyebrow: "02 // DAILY RHYTHM",
    titleTop: "A DAY AT",
    titleAccent: "Aurus.",
    body: "Designed around student timetables — with room for focus, food, movement and doing nothing at all.",
    image: {
      src: "/images/life-eat.png",
      alt: "Residents sharing freshly prepared dinner in dining hall",
    },
    timeline: [
      {
        time: "07 : 00",
        activity: "Terrace yoga and a fresh juice before the day starts",
      },
      {
        time: "08 : 30",
        activity: "Breakfast in the dining hall — hot, plated and on time",
      },
      {
        time: "10 : 00",
        activity: "Classes: your room is cleaned while you're out",
      },
      {
        time: "13 : 30",
        activity: "Lunch, or a packed tiffin if your timetable runs long",
      },
      {
        time: "18 : 00",
        activity: "Evening snacks and the study pods fill up",
      },
      {
        time: "19 : 30",
        activity: "Gym, foosball, or the games lounge",
      },
      {
        time: "20 : 30",
        activity: "Dinner with whoever's around — usually everyone",
      },
      {
        time: "22 : 00",
        activity: "Movies on the terrace, or quiet hours on the study floor",
      },
    ],
  },
  facilities: {
    eyebrow: "03 // FACILITIES",
    titleTop: "THE DETAILS, ",
    titleAccent: "Handled.",
    body: "Available across chapters, with signature amenities at our flagship residences.",
    image: {
      src: "/images/new01.png",
      alt: "Resident working out in modern Aurus gym with Hustle wall artwork",
    },
    amenities: [
      "INFINITY POOL",
      "GYM",
      "24/7 BIOMETRIC ACCESS",
      "DAILY MEAL SERVICE",
      "CONCIERGE",
      "PERSONAL BUTLER SERVICE",
      "AIRPORT PICK-UP & DROP",
      "STEAM ROOM",
      "SALON EXPERIENCE",
      "VR ENTERTAINMENT LOUNGE",
      "CONFERENCE ROOM",
      "YOGA ROOM",
    ],
  },
  momentsGallery: {
    eyebrow: "04 // MOMENTS",
    items: [
      {
        image: "/images/new02.png",
        label: "LOUNGE & CONVERSATIONS",
        alt: "Residents relaxing and conversing in lounge",
      },
      {
        image: "/images/new03.png",
        label: "GAME NIGHTS",
        alt: "Students enjoying football game on screen in entertainment lounge",
      },
      {
        image: "/images/new04.png",
        label: "FOOSBALL SHOWDOWN",
        alt: "Residents playing foosball together",
      },
      {
        image: "/images/new05.png",
        label: "QUIET EVENINGS",
        alt: "Student reading a book peacefully in bedroom",
      },
      {
        image: "/images/new06.png",
        label: "GRAB & GO CAFÉ",
        alt: "Resident getting quick drink at grab and go counter",
      },
      {
        image: "/images/new07.jpg",
        label: "CELEBRATE TOGETHER",
        alt: "Aurus residents celebrating festival together",
      },
      {
        image: "/images/new08.png",
        label: "STUDY & CHILLING",
        alt: "Students sharing notes and study session on tablet",
      },
      {
        image: "/images/new09.jpg",
        label: "HUSTLING TOGETHER",
        alt: "Group of friends collaborating in common lounge space",
      },
    ],
  },
  cafeAndApp: {
    cafe: {
      eyebrow: "05 // IN-HOUSE CAFÉ",
      titleTop: "A CAFÉ ",
      titleAccent: "Downstairs.",
      body: "Only at Aurus: a full in-house cafe — open daily until late. Hot espresso, small bites, late-night study fuel, and smooth Wi-Fi right from your table.",
      image: {
        src: "/images/new10.png",
        alt: "Aurus in-house cafe counter and coffee bar",
      },
    },
    app: {
      eyebrow: "06 // RESIDENT APP",
      titleTop: "AURUS AT YOUR ",
      titleAccent: "Fingertips.",
      body: "Need help, have feedback, or want to suggest an event? The resident app is your direct support. Real people who are listening — and acting.",
      bullets: [
        "Pay rent and room expenses seamlessly",
        "Book laundry, housekeeping, and repairs",
        "See menus, events, and announcements",
        "Message your community team",
      ],
      image: {
        src: "/images/new11.png",
        alt: "Residents using Aurus app on laptop in lounge",
      },
    },
  },
};
