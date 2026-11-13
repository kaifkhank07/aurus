import { componyInfoData } from "../compony/infro";

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
  phoneUrl: string;
  phoneNumber: string;
  emailUrl: string;
  email: string;
}

const formattedMobile = `+91 ${String(componyInfoData.mobile).replace(/(\d{5})(\d{5})/, "$1 $2")}`;

export const faqHero: FaqPageHero = {
  titleTop: "QUESTIONS,",
  titleAccent: "Answered.",
  body: "Everything students and parents usually ask before moving in. Can't find yours? Our team replies on WhatsApp within minutes.",
};

export const faqCta: FaqPageCta = {
  title: "Still have a question?",
  subtitle: "Our team is here 10am-7pm every day.",
  buttonLabel: "ASK ON WHATSAPP",
  whatsappUrl: `https://wa.me/91${componyInfoData.whatsapp}?text=${encodeURIComponent(
    componyInfoData.defaultWhatsAppMessage || "Hi Aurus team, I have a question about residences."
  )}`,
  phoneUrl: `tel:${componyInfoData.mobile}`,
  phoneNumber: formattedMobile,
  emailUrl: `mailto:${componyInfoData.email}`,
  email: componyInfoData.email,
};

export const faqData = {
  hero: faqHero,
  cta: faqCta,
};
