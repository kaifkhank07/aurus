import { Suspense } from "react";
import { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import { Blog } from "@/models/blog.model";
import { stripHtml } from "@/lib/html-utils";
import BlogDetail from "@/components/blog/BlogDetail";
import RelatedBlogs from "@/components/blog/RelatedBlogs";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    await connectToDatabase();
    const blogs = await Blog.find({ isActive: true }).select("slug").lean();
    return (blogs as Array<{ slug?: string }>)
      .filter((b): b is { slug: string } => typeof b.slug === "string" && Boolean(b.slug.trim()))
      .map((b) => ({ slug: b.slug.toLowerCase().trim() }));
  } catch (error) {
    console.warn("[generateStaticParams] Could not pre-generate blog slugs:", error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = (slug || "").toLowerCase().trim();

  try {
    await connectToDatabase();
    const blog = await Blog.findOne({
      slug: normalizedSlug,
      isActive: true,
    }).lean();

    if (!blog) {
      return {
        title: "Blog Not Found | Aurus",
      };
    }

    const title =
      blog.metadata?.title ||
      `${blog.title}${blog.subtitle ? ` - ${blog.subtitle}` : ""} | Aurus Journal`;

    const description =
      blog.metadata?.description ||
      blog.subtitle ||
      (blog.description
        ? stripHtml(blog.description).slice(0, 160)
        : "Read our latest article on Aurus Journal.");

    const keywords =
      Array.isArray(blog.metadata?.keywords) && blog.metadata.keywords.length > 0
        ? blog.metadata.keywords
        : [blog.title, blog.category, "Aurus Journal", "Student Living"];

    const imageUrl = blog.image?.url || "/images/blog01.png";

    return {
      title,
      description,
      keywords,
      alternates: {
        canonical: `/blog-details/${blog.slug || normalizedSlug}`,
      },
      openGraph: {
        title,
        description,
        url: `/blog-details/${blog.slug || normalizedSlug}`,
        type: "article",
        images: imageUrl ? [{ url: imageUrl }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: imageUrl ? [imageUrl] : undefined,
      },
    };
  } catch (error) {
    console.error("[generateMetadata] Error fetching blog metadata:", error);
    return {
      title: "The Aurus Journal",
    };
  }
}

export default async function BlogDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const normalizedSlug = (slug || "").toLowerCase().trim();

  return (
    <main>
      <Suspense fallback={null}>
        <BlogDetail slug={normalizedSlug} />
        <RelatedBlogs currentSlug={normalizedSlug} />
      </Suspense>
    </main>
  );
}

