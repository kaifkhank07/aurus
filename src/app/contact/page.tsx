import type { Metadata } from "next";
import TalkToUs from "@/components/contact/TalkToUs";
import CallYouBack from "@/components/contact/CallYouBack";

export const metadata: Metadata = {
  title: "Contact Us | AURUS Luxury Managed Residences",
  description:
    "Questions about rooms, tours, or pricing? Talk to our team 10am–7pm daily, request a quick callback, or visit our student chapters across India.",
  keywords: [
    "contact Aurus",
    "Aurus phone number",
    "book residence tour",
    "student housing enquiry",
    "schedule hostel visit",
    "Aurus support",
    "student accommodation helpline",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | AURUS Luxury Managed Residences",
    description:
      "Questions about rooms, tours, or pricing? Connect with our residence team daily or request a quick callback.",
    url: "/contact",
    siteName: "AURUS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | AURUS Luxury Managed Residences",
    description:
      "Get in touch with the Aurus team for room bookings, visits, and student residence support.",
  },
};

export default function ContactPage() {
  return (
    <main>
      <TalkToUs />
      <CallYouBack />
    </main>
  );
}
