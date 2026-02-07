"use client";
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Note } from '@/app/page';

interface EditorPaneProps {
  note: Note;
}

export default function EditorPane({ note }: EditorPaneProps) {
  const [content, setContent] = useState(note.content || "");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setContent(note.content || "");
  }, [note.id, note.content]);

  const handleSave = async () => {
    try {
      await fetch(`/api/notes/${note.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">

    </div>
  );
}
