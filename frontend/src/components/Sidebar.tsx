"use client";
import React from 'react';
import { HardDrive, Search, Settings, Plus } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-16 flex flex-col items-center py-4 bg-zinc-950 border-r border-zinc-800 h-full shrink-0 z-10">
      <div className="mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
          B
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-1 w-full items-center">
        <button className="p-3 rounded-xl bg-zinc-800 text-white shadow-sm transition-all hover:bg-zinc-700" title="Vaults">
          <HardDrive size={20} />
        </button>
        <button className="p-3 rounded-xl text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition-all" title="Search">
          <Search size={20} />
        </button>
        <button className="p-3 rounded-xl text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition-all" title="Settings">
          <Settings size={20} />
        </button>
      </div>

      <button
        className="mt-auto p-3 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-xl transition-all border border-zinc-800"
        title="Add New Note"
      >
        <Plus size={20} />
      </button>
    </aside>
  );
};

export default Sidebar;
