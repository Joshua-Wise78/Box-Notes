import { Folder, HardDrive } from "lucide-react";

export default function VaultCard({ title, path }: { title: string, path: string }) {
  return (
    <button className="flex items-center gap-4 p-4 w-full text-left rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:border-zinc-700 transition-all group">
      <div className="p-3 bg-zinc-800 rounded-md group-hover:bg-blue-600/20 transition-colors">
        <Folder className="w-6 h-6 text-zinc-400 group-hover:text-blue-500" />
      </div>
      <div>
        <h3 className="font-medium text-zinc-100">{title}</h3>
        <p className="text-xs text-zinc-500 font-mono">{path}</p>
      </div>
      <HardDrive className="ml-auto w-4 h-4 text-zinc-600" />
    </button>
  );
}
