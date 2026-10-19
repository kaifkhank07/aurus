import type { Metadata } from "next";
import { Manrope, Instrument_Serif, Space_Mono } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
});

// Figma: accent words are Instrument Serif Italic 400.
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400"],
});

// Figma: every eyebrow, label and button is Space Mono 400 / 14px / +2px.
const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "AURUS | Luxury Managed Residences",
  description:
    "Thoughtfully designed residences for independent living, meaningful connections, and everything your next chapter deserves.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${instrument.variable} ${spaceMono.variable}`}
    >
      <body className="font-sans antialiased">
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
