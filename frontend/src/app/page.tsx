"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import VaultCard from "@/components/VaultCard";

export default function Home() {
  // Static state for testing vaults without API calls
  const [vaults] = useState<string[]>(["Personal Brain", "Work Notes"]);

  // Static markdown for rendering test
  const [mockContent] = useState(`
# Welcome to Box-Notes
This is a **live preview** test of the markdown rendering engine.
* [x] Fix sidebar layout
* [ ] Connect FastAPI backend
  `);

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">Box-Notes</h1>
          <p className="mt-2 text-zinc-400">Select a vault to begin your session.</p>
        </div>

        {/* Markdown Preview Area */}
        <div className="prose prose-invert max-w-none bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 shadow-xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {mockContent}
          </ReactMarkdown>
        </div>

        {/* Vault Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {vaults.map((vault) => (
            <VaultCard
              key={vault}
              title={vault}
              path={`/data/vaults/${vault.toLowerCase().replace(/\s+/g, '-')}`}
            />
          ))}

          <button className="flex items-center justify-center py-6 border-2 border-dashed border-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-colors text-sm font-medium">
            + Create New Vault
          </button>
        </div>
      </div>
    </main>
  );
}
