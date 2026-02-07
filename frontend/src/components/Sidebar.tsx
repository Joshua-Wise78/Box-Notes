"use client";
import React from 'react';
import { HardDrive, Search, Settings, Plus } from 'lucide-react';

const Sidebar = () => {
  // Cleaned up navigation list - removed duplicate 'Brain' and extra tools
  const navItems = [
    { icon: <HardDrive size={20} />, label: 'Vaults', active: true },
    { icon: <Search size={20} />, label: 'Search' },
    { icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <aside className="w-16 flex flex-col items-center py-4 bg-zinc-900 border-r border-zinc-800 h-full">
      <div className="flex flex-col gap-4 flex-1">
        {navItems.map((item, index) => (
          <button
            key={index}
            className={`p-2 rounded-lg transition-colors ${item.active
              ? 'bg-blue-600 text-white'
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
              }`}
            title={item.label}
          >
            {item.icon}
          </button>
        ))}
      </div>

      {/* Action button at the bottom */}
      <button
        className="p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 rounded-lg"
        title="Add New"
      >
        <Plus size={20} />
      </button>
    </aside>
  );
};

export default Sidebar;
