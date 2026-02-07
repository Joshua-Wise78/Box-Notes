export default function GraphView() {
  return (
    <div className="relative h-64 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 flex items-center justify-center">
      <div className="text-zinc-500 text-sm">
        Graph Engine Ready: Waiting for Note Link Data...
      </div>
      {/* Later: <ForceGraph2D graphData={data} /> */}
    </div>
  );
}
