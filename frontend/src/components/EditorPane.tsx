import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function EditorPane({ note }) {
  const [content, setContent] = useState(note.content || "");

  // Update local content when a new note is selected
  useEffect(() => {
    setContent(note.content || "");
  }, [note.id]);

  const handleSave = async () => {
    await fetch(`/api/notes/${note.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
  };

  return (
    <div className="flex flex-col h-full">
      <header className="h-12 border-b border-gray-800 flex items-center justify-between px-4 bg-[#121212]">
        <span className="text-sm font-medium text-gray-400">{note.file_path}</span>
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition"
        >
          Save
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Editor */}
        <textarea
          className="flex-1 bg-transparent p-6 outline-none resize-none font-mono text-sm leading-relaxed border-r border-gray-800"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          spellCheck={false}
        />

        {/* Right: Render */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#141414]">
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
