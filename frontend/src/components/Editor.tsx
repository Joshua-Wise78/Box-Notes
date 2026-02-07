"use client";
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface EditorProps {
  initialContent?: string;
}

export default function MarkdownEditor({ initialContent = "" }: EditorProps) {
  const [markdown, setMarkdown] = useState(initialContent);

  return (
    <div className="flex h-full w-full bg-zinc-950 overflow-hidden">
      {/* Editor Pane */}
      <div className="flex-1 flex flex-col border-r border-zinc-800">
        <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/50 text-[10px] font-mono text-zinc-500 uppercase">
          Markdown Editor
        </div>
        <textarea
          className="flex-1 bg-transparent p-6 text-zinc-300 font-mono text-sm resize-none focus:outline-none leading-relaxed"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
        />
      </div>

      {/* Preview Pane */}
      <div className="flex-1 flex flex-col bg-zinc-900/10">
        <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/50 text-[10px] font-mono text-zinc-500 uppercase">
          Live Preview
        </div>
        <div className="flex-1 overflow-auto p-8 prose prose-invert prose-sm max-w-none">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
