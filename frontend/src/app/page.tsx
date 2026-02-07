"use client";
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import FileTree from '@/components/FileTree';
import EditorPane from '@/components/EditorPane';

// Define the Note interface to match your FastAPI schemas.py
export interface Note {
  id: string;
  title: string;
  vault_name: string;
  file_path: string;
  content?: string;
  mime_type?: string;
  created_at?: string;
  updated_at?: string;
}

export default function Home() {
  // Use the Note interface to avoid the 'any[]' mismatch error
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    // Using the /api proxy defined in your next.config.mjs
    fetch('/api/notes/')
      .then(res => res.json())
      .then((data: Note[]) => {
        if (Array.isArray(data)) {
          setNotes(data);
        }
      })
      .catch(err => console.error("Failed to fetch notes:", err));
  }, []);

  const handleSelectNote = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`);
      const data: Note = await res.json();
      setSelectedNote(data);
    } catch (err) {
      console.error("Error fetching note details:", err);
    }
  };

  return (
    <div className="flex h-screen bg-[#121212] text-white overflow-hidden">
      <Sidebar />
      {/* Passing the typed notes array to FileTree */}
      <FileTree notes={notes} onSelect={handleSelectNote} activeId={selectedNote?.id} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {selectedNote ? (
          <EditorPane note={selectedNote} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-500 italic">
            Select a note from your vault to start editing
          </div>
        )}
      </main>
    </div>
  );
}
