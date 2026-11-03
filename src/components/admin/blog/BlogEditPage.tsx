"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useContentStore } from "@/store/useContentStore";
import { SafeBlog } from "@/types/blog.types";
import EditBlog from "./EditBlog";
import { Btn, Card } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";

export interface BlogEditPageProps {
  id: string;
}

export default function BlogEditPage({ id }: BlogEditPageProps) {
  const router = useRouter();
  const { getBlogById } = useContentStore();

  const [blog, setBlog] = useState<SafeBlog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBlog = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getBlogById(id);
      if (res.success && res.data) {
        setBlog(res.data);
      } else {
        setError(res.message || "Article not found.");
      }
    } catch {
      setError("An unexpected error occurred while loading article details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadBlog();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
        <span className="inline-block animate-spin text-orange-500">
          <Icon name="refresh" size={24} />
        </span>
        <span className="text-xs font-semibold">Loading article details…</span>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <Card className="text-center p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Icon name="x" size={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Article Not Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {error || "The article you are trying to edit could not be found or may have been deleted."}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href="/admin/blog">
              <Btn variant="ghost" size="sm">
                Back to Articles
              </Btn>
            </Link>
            <Btn variant="brand" size="sm" onClick={loadBlog}>
              Retry
            </Btn>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-2">
      <EditBlog
        key={blog.id}
        open={true}
        blog={blog}
        mode="page"
        onClose={() => router.push("/admin/blog")}
        onSuccess={() => router.push(`/admin/blog/${id}`)}
      />
    </div>
  );
}

