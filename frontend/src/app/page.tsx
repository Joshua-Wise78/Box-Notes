import VaultCard from "@/components/VaultCard";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">Box-Notes</h1>
          <p className="mt-2 text-zinc-400">Select a vault to begin your session.</p>
        </div>

        <div className="space-y-3">
          <VaultCard title="Personal Brain" path="/data/vaults/personal" />
          <VaultCard title="Work Notes" path="/data/vaults/work" />

          <button className="w-full py-3 border-2 border-dashed border-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-colors text-sm font-medium">
            + Create New Vault
          </button>
        </div>
      </div>
    </main>
  );
}
