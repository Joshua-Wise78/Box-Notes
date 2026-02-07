"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import EditorPane from "@/components/EditorPane";
import { Note } from "@/app/page";

export default function NotePage() {
  const { id } = useParams();
  const [note, setNote] = useState<Note | null>(null);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/notes/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Note not found");
          return res.json();
        })
        .then((data) => setNote(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));

      fetch(`/api/notes/`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setAllNotes(data);
        });
    }
  }, [id]);

  return (
    <div className="flex h-screen bg-[#121212] text-white">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center h-full text-zinc-500">Loading...</div>
        ) : note ? (
          <EditorPane
            note={note}
            allNotes={allNotes}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-500">Note not found</div>
        )}
      </main>
    </div>
  );
}
