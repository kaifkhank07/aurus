import type { Metadata } from "next";
import { AurusJournalBlog } from "@/components/blog/AurusJournalBlog";

export const metadata: Metadata = {
  title: "Aurus Journal | Stories, Guides & Student Living Insights",
  description:
    "Explore the Aurus Journal for student lifestyle guides, city living insights, college preparation tips, wellness advice, and stories from our vibrant residence community.",
  keywords: [
    "Aurus Journal",
    "student life blog",
    "college guides India",
    "student accommodation tips",
    "city guide for students",
    "campus living blog",
    "hostel life articles",
  ],
  alternates: {
    canonical: "/blogs",
  },
  openGraph: {
    title: "Aurus Journal | Stories, Guides & Student Living Insights",
    description:
      "Explore student lifestyle guides, city living advice, and authentic stories from the Aurus community.",
    url: "/blogs",
    siteName: "AURUS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurus Journal | Stories, Guides & Student Living Insights",
    description:
      "Student lifestyle guides, city living insights, and inspiring stories from the Aurus community.",
  },
};

export default function BlogsPage() {
  return (
    <main>
      <AurusJournalBlog />
    </main>
  );
}

