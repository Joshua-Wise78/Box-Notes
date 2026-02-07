"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Settings,
  Plus,
  Database,
  FolderPlus
} from 'lucide-react';
import Modal from './Modal';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // State for Modals
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);

  // Form Data
  const [noteTitle, setNoteTitle] = useState("");
  const [selectedVault, setSelectedVault] = useState("");
  const [newVaultName, setNewVaultName] = useState("");

  // Data Lists
  const [vaults, setVaults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchVaults();
  }, []);

  const fetchVaults = async () => {
    try {
      const res = await fetch('/api/vaults');
      const data = await res.json();
      if (data.vaults) {
        setVaults(data.vaults);
        if (data.vaults.length > 0) setSelectedVault(data.vaults[0]);
      }
    } catch (err) {
      console.error("Failed to load vaults", err);
    }
  };

  const handleCreateVault = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/vaults/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newVaultName })
      });

      if (!res.ok) throw new Error('Failed to create vault');

      await fetchVaults();
      setNewVaultName("");
      setIsVaultModalOpen(false);
    } catch (err) {
      alert("Error creating vault");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/notes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: noteTitle,
          content: "# " + noteTitle,
          vault_name: selectedVault,
          file_path: `/${selectedVault}/${noteTitle.replace(/\s+/g, '-')}.md`
        })
      });

      if (!res.ok) throw new Error('Failed to create note');

      const newNote = await res.json();

      setNoteTitle("");
      setIsNoteModalOpen(false);

      window.location.href = `/notes/${newNote.id}`;

    } catch (err) {
      console.error(err);
      alert("Error creating note");
    } finally {
      setIsLoading(false);
    }
  };

  const navItems = [
    { name: 'All Notes', href: '/', icon: Home },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      <aside className="w-64 h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0">
        <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Database size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Box Notes</span>
        </div>

        <div className="p-4 space-y-2">
          <button
            onClick={() => setIsNoteModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-md font-medium transition-all shadow-sm active:scale-95"
          >
            <Plus size={18} />
            <span>New Note</span>
          </button>

          <button
            onClick={() => setIsVaultModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white py-2 px-4 rounded-md font-medium transition-all text-sm"
          >
            <FolderPlus size={16} />
            <span>New Vault</span>
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title="Create New Note"
      >
        <form onSubmit={handleCreateNote} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Title</label>
            <input
              autoFocus
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="e.g. Project Idea"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Vault</label>
            <select
              value={selectedVault}
              onChange={(e) => setSelectedVault(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
            >
              {vaults.length === 0 && <option value="">No vaults found</option>}
              {vaults.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading || !selectedVault}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-md font-medium mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create Note'}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isVaultModalOpen}
        onClose={() => setIsVaultModalOpen(false)}
        title="Create New Vault"
      >
        <form onSubmit={handleCreateVault} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Vault Name</label>
            <input
              autoFocus
              type="text"
              value={newVaultName}
              onChange={(e) => setNewVaultName(e.target.value)}
              placeholder="e.g. Personal, Work"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-md font-medium mt-2 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Vault'}
          </button>
        </form>
      </Modal>
    </>
  );
}
