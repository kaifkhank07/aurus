export interface FaqPageHero {
  titleTop: string;
  titleAccent: string;
  body: string;
}

export interface FaqPageCta {
  title: string;
  subtitle: string;
  buttonLabel: string;
  whatsappUrl: string;
}

export const faqHero: FaqPageHero = {
  titleTop: "QUESTIONS,",
  titleAccent: "Answered.",
  body: "Everything students and parents usually ask before moving in. Can't find yours? Our team replies on WhatsApp within minutes.",
};

export const faqCta: FaqPageCta = {
  title: "Still have a question?",
  subtitle: "Our team is on chat 10am-7pm every day.",
  buttonLabel: "ASK ON WHATSAPP",
  whatsappUrl: "https://wa.me/917208950935?text=Hi%20Aurus%20team,%20I%20have%20a%20question%20about%20residences.",
};

export const faqData = {
  hero: faqHero,
  cta: faqCta,
};
