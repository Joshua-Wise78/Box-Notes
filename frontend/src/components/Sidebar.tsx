import { FileText, FolderOpen, Search, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 h-full bg-zinc-950 border-r border-zinc-800 flex flex-col">
      <div className="p-4 border-bottom border-zinc-800 flex items-center justify-between">
        <h2 className="font-bold text-sm tracking-widest text-zinc-500 uppercase">Personal Brain</h2>
        <Search className="w-4 h-4 text-zinc-500 cursor-pointer hover:text-white" />
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="flex items-center gap-2 p-2 text-zinc-300 hover:bg-zinc-900 rounded-md cursor-pointer group">
          <FolderOpen className="w-4 h-4 text-blue-500" />
          <span className="text-sm">Projects</span>
        </div>
        <div className="ml-4 space-y-1 border-l border-zinc-800 pl-2">
          <div className="flex items-center gap-2 p-2 text-zinc-400 hover:bg-zinc-900 rounded-md cursor-pointer">
            <FileText className="w-4 h-4" />
            <span className="text-sm italic">Box-Notes.md</span>
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <button className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
          <Settings className="w-4 h-4" />
          <span className="text-xs font-medium">Vault Settings</span>
        </button>
      </div>
    </aside>
  );
}
