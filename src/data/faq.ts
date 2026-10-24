export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqCategory {
  id: string;
  title: string;
  items: FaqItem[];
}

export interface FaqPageData {
  hero: {
    titleTop: string;
    titleAccent: string;
    body: string;
  };
  categories: FaqCategory[];
  cta: {
    title: string;
    subtitle: string;
    buttonLabel: string;
    whatsappUrl: string;
  };
}

export const faqData: FaqPageData = {
  hero: {
    titleTop: "QUESTIONS,",
    titleAccent: "Answered.",
    body: "Everything students and parents usually ask before moving in. Can't find yours? Our team replies on WhatsApp within minutes.",
  },
  categories: [
    {
      id: "booking",
      title: "BOOKING",
      items: [
        {
          id: "book-1",
          question: "How do I book a room at Aurus?",
          answer:
            "You can initiate your reservation directly via our website by selecting your desired residence and room category, or by connecting with our admissions concierge. We will guide you through digital KYC verification, room allocation, and a secure online token advance.",
        },
        {
          id: "book-2",
          question: "Can I see the residence before booking?",
          answer:
            "Yes, absolutely. We welcome both students and parents to schedule an in-person VIP walkthrough or a live virtual 360-degree tour hosted by the chapter residence manager.",
        },
        {
          id: "book-3",
          question: "When should I book for the new academic year?",
          answer:
            "Admissions typically open in January for the autumn academic cycle. Because chapters have strictly capped resident counts, we advise reserving your spot 2 to 3 months prior to college commencement.",
        },
        {
          id: "book-4",
          question: "Is there a minimum stay?",
          answer:
            "Our primary tenancy agreements run for an academic year (10 to 11 months). Short-term summer school or corporate internship tenancies are evaluated based on seasonal availability.",
        },
      ],
    },
    {
      id: "pricing-payments",
      title: "PRICING & PAYMENTS",
      items: [
        {
          id: "price-1",
          question: "What's included in the rent?",
          answer:
            "Your monthly license fee is 100% all-inclusive: four freshly prepared chef meals daily, unlimited high-speed fibre Wi-Fi, daily housekeeping, weekly laundry, electricity, power backup, air-conditioning, round-the-clock security, and complete lounge/gym amenities access.",
        },
        {
          id: "price-2",
          question: "Is there a security deposit?",
          answer:
            "Yes. A refundable security deposit equivalent to one or two months of rent is held during your stay. It is refunded directly to your registered bank account upon formal check-out clearance.",
        },
        {
          id: "price-3",
          question: "How do I pay rent?",
          answer:
            "Rent can be settled conveniently via the Aurus Resident Mobile App using UPI, debit/credit cards, net banking, or direct NEFT/RTGS wire transfers.",
        },
      ],
    },
    {
      id: "living-at-aurus",
      title: "LIVING AT AURUS",
      items: [
        {
          id: "living-1",
          question: "Are meals included? Do you cater to dietary needs?",
          answer:
            "Yes, four nutritious home-style meals are served daily. Our culinary team accommodates vegetarian, non-vegetarian, Jain, and special dietary guidelines upon advance notice.",
        },
        {
          id: "living-2",
          question: "What are the visitor rules?",
          answer:
            "Parents, family members, and friends are warmly welcomed in common lounges, dining halls, and visitor meeting zones during visiting hours (9:00 AM – 8:00 PM). Overnight family stays require prior warden confirmation.",
        },
        {
          id: "living-3",
          question: "Is there a curfew?",
          answer:
            "We prioritize independent student growth alongside safety. Standard entry hours are set at 10:30 PM. Late passes and overnight leaves are requested by students and approved digitally by parents through the Aurus app.",
        },
        {
          id: "living-4",
          question: "Can I choose my roommate?",
          answer:
            "Yes. If you are joining with batchmates or friends, you can request co-living during reservation. Solo scholars are matched using our lifestyle compatibility assessment.",
        },
      ],
    },
    {
      id: "safety",
      title: "SAFETY",
      items: [
        {
          id: "safety-1",
          question: "How do you keep residents safe?",
          answer:
            "Our residences employ multi-layer security: RFID and biometric access controls, trained round-the-clock security personnel including dedicated female guards for female wings, high-definition CCTV coverage in public areas, and full-time on-site resident wardens.",
        },
        {
          id: "safety-2",
          question: "Can parents get updates?",
          answer:
            "Yes. Parents receive access to their own app dashboard showing check-in notifications, leave approvals, monthly accounts, and emergency warden contact lines.",
        },
      ],
    },
    {
      id: "move-in-out",
      title: "MOVE-IN & MOVE-OUT",
      items: [
        {
          id: "move-1",
          question: "What should I bring?",
          answer:
            "Simply bring your apparel, study materials, and personal toiletries! Aurus supplies hotel-grade orthopaedic mattresses, bespoke linen, plush pillows, towels, study desks, ergonomic chairs, and spacious wardrobes.",
        },
        {
          id: "move-2",
          question: "How does check-out work?",
          answer:
            "Notify the concierge 15 days prior to your intended checkout date through the resident app. After a quick room inventory review, your deposit refund is initiated promptly.",
        },
      ],
    },
  ],
  cta: {
    title: "Still have a question?",
    subtitle: "Our team is on chat 10am-7pm every day.",
    buttonLabel: "ASK ON WHATSAPP",
    whatsappUrl: "https://wa.me/917208950935?text=Hi%20Aurus%20team,%20I%20have%20a%20question%20about%20residences.",
  },
};
