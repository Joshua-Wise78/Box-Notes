import { Search } from 'lucide-react';

export default function SearchModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-lg bg-zinc-900 border border-zinc-800 shadow-2xl">
        <div className="flex items-center p-4 border-b border-zinc-800">
          <Search className="mr-3 text-zinc-500" size={20} />
          <input
            autoFocus
            placeholder="Search notes or content..."
            className="w-full bg-transparent text-zinc-100 outline-none"
          />
        </div>
        <div className="p-2 max-h-96 overflow-y-auto">
          <p className="p-4 text-center text-zinc-500 text-sm">No recent searches</p>
        </div>
      </div>
    </div>
  );
}
