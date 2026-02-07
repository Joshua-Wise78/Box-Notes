"use client";
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import FileTree from '@/components/FileTree';
import EditorPane from '@/components/EditorPane';

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  // Fetch note list on load
  useEffect(() => {
    fetch('/api/notes/')
      .then(res => res.json())
      .then(data => setNotes(data));
  }, []);

  const handleSelectNote = async (id) => {
    const res = await fetch(`/api/notes/${id}`);
    const data = await res.json();
    setSelectedNote(data);
  };

  return (
    <div className="flex h-screen bg-[#121212] text-white">
      <Sidebar />
      <FileTree notes={notes} onSelect={handleSelectNote} activeId={selectedNote?.id} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {selectedNote ? (
          <EditorPane note={selectedNote} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a note to start editing
          </div>
        )}
      </main>
    </div>
  );
}
