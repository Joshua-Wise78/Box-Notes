"use client";

import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useMemo } from 'react';

export default function MarkdownView({ content }: { content: string }) {
  const html = useMemo(() => {
    const rawHtml = marked.parse(content, { gfm: true, breaks: true });
    return DOMPurify.sanitize(rawHtml as string);
  }, [content]);

  return (
    <div
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
