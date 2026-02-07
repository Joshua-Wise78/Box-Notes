"use client";
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import FileTree from '@/components/FileTree';
import EditorPane from '@/components/EditorPane';

// Interface matching your backend schemas.py
export interface Note {
  id: string;
  title: string;
  vault_name: string;
  file_path: string;
  content?: string;
  mime_type?: string;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  // Fix: Explicitly type the state as Note[]
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    // Fetch using the /api rewrite
    fetch('/api/notes/')
      .then((res) => res.json())
      .then((data: Note[]) => {
        if (Array.isArray(data)) {
          setNotes(data);
        }
      })
      .catch((err) => console.error("API Connection Error:", err));
  }, []);

  const handleSelectNote = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`);
      const data: Note = await res.json();
      setSelectedNote(data);
    } catch (err) {
      console.error("Failed to load note:", err);
    }
  };

  return (
    <div className="flex h-screen bg-[#121212] text-white overflow-hidden">
      <Sidebar />
      <FileTree notes={notes} onSelect={handleSelectNote} activeId={selectedNote?.id} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {selectedNote ? (
          <EditorPane note={selectedNote} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-500 italic">
            Select a note to begin editing
          </div>
        )}
      </main>
    </div>
  );
}
