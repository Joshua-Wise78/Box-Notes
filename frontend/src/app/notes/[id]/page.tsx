import Sidebar from "@/components/Sidebar";
import MarkdownView from "@/components/MarkdownView";

export default function NotePage() {
  const sampleMarkdown = "# Welcome to Box-Notes\n- [x] GFM Support\n- [ ] Persistence";

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <MarkdownView content={sampleMarkdown} />
      </main>
    </div>
  );
}
