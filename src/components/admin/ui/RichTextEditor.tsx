"use client";

import React, { useMemo, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import "./RichTextEditor.css";

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  minHeight?: string;
}

import { isQuillEmpty, stripHtml } from "@/lib/html-utils";
export { isQuillEmpty, stripHtml };

// Dynamically import react-quill-new with SSR disabled to prevent `document is not defined`
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full flex flex-col justify-center items-center p-6 text-slate-400 bg-slate-50/40 rounded-xl"
      style={{ minHeight: "200px" }}
    >
      <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-2" />
      <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Loading editor…</span>
    </div>
  ),
});

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content here…",
  disabled = false,
  error = false,
  className = "",
  minHeight = "200px",
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["blockquote"],
        ["link"],
        ["clean"],
      ],
    }),
    []
  );

  const formats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "color",
      "background",
      "list",
      "align",
      "blockquote",
      "link",
    ],
    []
  );

  const handleChange = (content: string) => {
    if (isQuillEmpty(content)) {
      onChange("");
    } else {
      onChange(content);
    }
  };

  return (
    <div
      className={`quill-editor-wrapper relative rounded-xl border transition-all ${
        error
          ? "border-rose-400 ring-2 ring-rose-500/20"
          : "border-slate-200 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-400/20"
      } bg-white ${disabled ? "opacity-60 pointer-events-none" : ""} ${className}`}
      style={minHeight ? ({ "--editor-min-height": minHeight } as React.CSSProperties) : undefined}
    >
      {mounted ? (
        <ReactQuill
          theme="snow"
          value={value || ""}
          onChange={handleChange}
          placeholder={placeholder}
          readOnly={disabled}
          modules={modules}
          formats={formats}
        />
      ) : (
        <div
          className="w-full flex flex-col justify-center items-center p-6 text-slate-400 bg-slate-50/40 rounded-xl"
          style={{ minHeight }}
        >
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-2" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Loading editor…</span>
        </div>
      )}
    </div>
  );
}
