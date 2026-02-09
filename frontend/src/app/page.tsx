"use client";
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import FileTree from '@/components/FileTree';
import EditorPane from '@/components/EditorPane';

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
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/notes/')
      .then((res) => {
        if (!res.ok) console.warn("List fetch status:", res.status);
        return res.json();
      })
      .then((data: Note[]) => {
        if (Array.isArray(data)) {
          setNotes(data);
          setError(null);
        }
      })
      .catch((err) => {
        console.error("API Connection Error:", err);
        setError("Could not connect to backend.");
      });
  }, []);

  const handleSelectNote = async (id: string) => {
    const existing = notes.find(n => n.id === id);

    if (existing) {
      setSelectedNote(existing);
    }

    try {
      const res = await fetch(`/api/notes/${id}`);

      if (res.ok) {
        const data: Note = await res.json();
        setSelectedNote(data);
      } else {
        console.warn(`Background fetch failed for ${id}: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      console.error("Silently failed to load note details:", err);
    }
  };

  return (
    <div className="flex h-screen bg-[#121212] text-white overflow-hidden font-sans">
      <Sidebar />
      <FileTree notes={notes} onSelect={handleSelectNote} activeId={selectedNote?.id} />

      <main className="flex-1 flex flex-col overflow-hidden bg-[#1e1e1e]">
        {error ? (
          <div className="flex-1 flex flex-col items-center justify-center text-red-400 gap-2">
            <span className="font-bold">Connection Error</span>
            <span className="text-sm text-zinc-500">Ensure the backend container is running.</span>
          </div>
        ) : selectedNote ? (
          <EditorPane
            note={selectedNote}
            allNotes={notes}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 gap-4">
            <div className="w-16 h-16 rounded-xl bg-zinc-800 flex items-center justify-center">
              <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-sm font-medium">Select a note from the sidebar to edit</p>
          </div>
        )}
      </main>
    </div>
  );
}
