import { Suspense } from "react";
import { blogsData, singleBlogData } from "@/data/blog";
import BlogDetail from "@/components/blog/BlogDetail";
import RelatedBlogs from "@/components/blog/RelatedBlogs";

export function generateStaticParams() {
  const slugs = Array.from(
    new Set(
      blogsData.journalSection.articles.map((article) =>
        article.href.replace("/blog/", "")
      )
    )
  );
  return slugs.map((slug) => ({ slug }));
}

export default async function BlogSlugPage() {
  return (
    <main>
      <Suspense fallback={null}>
        <BlogDetail post={singleBlogData} />
        <RelatedBlogs />
      </Suspense>
    </main>
  );
}
