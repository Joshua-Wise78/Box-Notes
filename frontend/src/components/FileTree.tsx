"use client";
import { useState } from 'react';
import { Folder, FileText, ChevronRight, ChevronDown } from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

export default function FileTree({ node }: { node: FileNode }) {
  const [isOpen, setIsOpen] = useState(false);

  if (node.type === 'file') {
    return (
      <div className="flex items-center gap-2 px-4 py-1.5 hover:bg-zinc-800/50 cursor-pointer text-zinc-400 group transition-colors">
        <FileText size={14} className="group-hover:text-zinc-300" />
        <span className="text-sm truncate">{node.name}</span>
      </div>
    );
  }

  return (
    <div className="select-none">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 hover:bg-zinc-800/50 cursor-pointer text-zinc-300 transition-colors"
      >
        <span className="text-zinc-500">
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
        <Folder size={14} className={isOpen ? 'text-blue-400' : 'text-zinc-500'} />
        <span className="text-sm font-medium truncate">{node.name}</span>
      </div>
      {isOpen && node.children && (
        <div className="ml-4 border-l border-zinc-800/60 pl-1">
          {node.children.map((child) => (
            <FileTree key={child.name} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}
