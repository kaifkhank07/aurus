import { Metadata } from "next";
import TalkToUs from "@/components/contact/TalkToUs";
import CallYouBack from "@/components/contact/CallYouBack";

export const metadata: Metadata = {
  title: "Contact Us | AURUS Luxury Managed Residences",
  description:
    "Questions about rooms, tours or pricing? Talk to our team 10am–7pm daily, request a quick callback, or visit our chapters across India.",
};

export default function ContactPage() {
  return (
    <main>
      <TalkToUs />
      <CallYouBack />
    </main>
  );
}
