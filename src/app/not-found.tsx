import { Metadata } from "next";
import NotFoundContent from "@/components/not-found/NotFoundContent";

export const metadata: Metadata = {
  title: "404 - Chapter Not Found | AURUS Luxury Managed Residences",
  description:
    "The page you're searching for might have been moved or doesn't exist. Discover our student residences and active chapters across India.",
};

export default function NotFound() {
  return (
    <main>
      <NotFoundContent />
    </main>
  );
}
