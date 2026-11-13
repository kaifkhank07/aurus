import { componyInfoData } from "../compony/infro";

export interface ContactChannel {
  label: string;
  value: string;
  subtext: string;
  href?: string;
}

export interface TalkToUsData {
  titleTop: string;
  titleAccent: string;
  body: string;
  channels: ContactChannel[];
}

// Format 10-digit mobile number for display as +91 XXXXX XXXXX
const formattedMobile = `+91 ${String(componyInfoData.mobile).replace(/(\d{5})(\d{5})/, "$1 $2")}`;
const formattedWhatsapp = `+91 ${String(componyInfoData.whatsapp).replace(/(\d{5})(\d{5})/, "$1 $2")}`;

export const talkToUsData: TalkToUsData = {
  titleTop: "TALK TO",
  titleAccent: "Us.",
  body: "Questions about rooms, tours or pricing? Our team is here 10am–7pm every day, and resident wardens are on site around the clock.",
  channels: [
    {
      label: "MOBILE CALL",
      value: formattedMobile,
      subtext: "10:00am - 7:00pm, Monday to Sunday",
      href: `tel:${componyInfoData.mobile}`,
    },
    {
      label: "WHATSAPP",
      value: formattedWhatsapp,
      subtext: "Usually replies within minutes.",
      href: `https://wa.me/91${componyInfoData.whatsapp}?text=${encodeURIComponent(
        componyInfoData.defaultWhatsAppMessage
      )}`,
    },
    {
      label: "EMAIL",
      value: componyInfoData.email,
      subtext: "For bookings, partnerships and press.",
      href: `mailto:${componyInfoData.email}`,
    },
  ],
};
