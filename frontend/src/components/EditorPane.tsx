"use client";
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Save, FileText, Eye } from 'lucide-react';
import { Note } from '@/app/page';

interface EditorPaneProps {
  note: Note;
}

export default function EditorPane({ note }: EditorPaneProps) {
  const [content, setContent] = useState(note.content || "");
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when the selected note changes
  useEffect(() => {
    setContent(note.content || "");
    setMode('edit');
  }, [note.id, note.content]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch(`/api/notes/${note.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...note, content })
      });
      // Optional: Add toast notification here
      setTimeout(() => setIsSaving(false), 500);
    } catch (err) {
      console.error("Save failed:", err);
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* Toolbar */}
      <div className="h-12 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900">
        <div className="flex items-center gap-4">
          <h2 className="font-semibold text-zinc-200 truncate max-w-md">
            {note.title}
          </h2>
          <span className="text-xs text-zinc-500 px-2 py-1 bg-zinc-800 rounded">
            {note.vault_name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}
            className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
            title={mode === 'edit' ? "Switch to Preview" : "Switch to Edit"}
          >
            {mode === 'edit' ? <Eye size={18} /> : <FileText size={18} />}
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${isSaving
                ? 'bg-green-900/30 text-green-400'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Editor / Preview Area */}
      <div className="flex-1 overflow-hidden relative">
        {mode === 'edit' ? (
          <textarea
            className="w-full h-full bg-[#1e1e1e] text-zinc-300 p-8 resize-none focus:outline-none font-mono text-sm leading-relaxed"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="# Start typing your note here..."
            spellCheck={false}
          />
        ) : (
          <div className="w-full h-full overflow-y-auto p-8 prose prose-invert prose-zinc max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* Footer Status */}
      <div className="h-6 bg-zinc-900 border-t border-zinc-800 flex items-center px-4 text-[10px] text-zinc-500 justify-end">
        <span>{content.length} characters</span>
      </div>
    </div>
  );
}
