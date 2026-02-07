"use client";
import { useState } from "react";
import VaultCard from "@/components/VaultCard";
import MarkdownView from "@/components/MarkdownView";

export default function Home() {
  const [vaults] = useState<string[]>(["Personal Brain", "Work Notes"]);

  const [mockContent] = useState(`
# Welcome to Box-Notes
* [x] Dependency fix applied
* [ ] Backend connection pending
  `);

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 bg-black min-h-screen">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">Box-Notes</h1>
        </div>

        <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 shadow-xl w-full">
          <MarkdownView content={mockContent} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {vaults.map((vault) => (
            <VaultCard
              key={vault}
              title={vault}
              path={`/notes/${vault.toLowerCase().replace(/\s+/g, '-')}`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
