export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ManagedFaqData {
  eyebrowLeft: string;
  eyebrowRight: string;
  faqs: FaqItem[];
}

export const managedFaq: ManagedFaqData = {
  eyebrowLeft: "07 // QUESTIONS",
  eyebrowRight: "ALL FAQS",
  faqs: [
    {
      id: "gift-who",
      question: "Who is the GIFT City residence for?",
      answer:
        "Designed specifically for working professionals, banking executives, tech consultants, and corporate teams based in or frequently visiting GIFT City and Gandhinagar.",
    },
    {
      id: "gift-min-stay",
      question: "Is there a minimum stay?",
      answer:
        "We offer flexible residential terms starting from 1 month up to 11-month or multi-year corporate leases with seamless extensions.",
    },
    {
      id: "gift-furnished",
      question: "Are the homes furnished?",
      answer:
        "Yes, all residences are completely turnkey and fully furnished with plush bedding, ergonomic workstations, smart storage, air conditioning, and high-speed fibre Wi-Fi.",
    },
    {
      id: "gift-corporate",
      question: "Can my company book for a team?",
      answer:
        "Absolutely. We provide tailored corporate accounts, GST invoicing, customized billing cycles, and cluster room allocations for company teams.",
    },
  ],
};
