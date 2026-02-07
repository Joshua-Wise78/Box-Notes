"use client";
import React from 'react';
import { Note } from '@/app/page';

interface FileTreeProps {
  notes: Note[];
  onSelect: (id: string) => void;
  activeId?: string;
}

export default function FileTree({ notes, onSelect, activeId }: FileTreeProps) {
  // Grouping notes by vault
  const vaults = notes.reduce((acc, note) => {
    const vName = note.vault_name || "Default";
    if (!acc[vName]) acc[vName] = [];
    acc[vName].push(note);
    return acc;
  }, {} as Record<string, Note[]>);

  return (
    <div className="w-64 bg-[#181818] border-r border-zinc-800 p-4 overflow-y-auto shrink-0">
      <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6">Vaults</h2>
      {Object.entries(vaults).map(([vault, vaultNotes]) => (
        <details key={vault} open className="mb-4 group">
          <summary className="cursor-pointer text-xs font-bold text-zinc-300 hover:text-white select-none list-none flex items-center gap-2">
            <span className="group-open:rotate-90 transition-transform text-[8px]">▶</span>
            {vault}
          </summary>
          <ul className="mt-2 ml-3 space-y-1 border-l border-zinc-800">
            {vaultNotes.map((note) => (
              <li
                key={note.id}
                onClick={() => onSelect(note.id)}
                className={`text-xs py-2 px-3 rounded-r-md cursor-pointer truncate transition-all ${activeId === note.id
                    ? 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-500'
                    : 'text-zinc-400 hover:bg-zinc-800'
                  }`}
              >
                {note.title}
              </li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}
