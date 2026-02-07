"use client";
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import wikiLinkPlugin from 'remark-wiki-link';
import { Save, FileText, Eye } from 'lucide-react';
import { Note } from '@/app/page';
import { useRouter } from 'next/navigation';

interface EditorPaneProps {
  note: Note;
  allNotes?: Note[];
}

export default function EditorPane({ note, allNotes = [] }: EditorPaneProps) {
  const router = useRouter();
  const [content, setContent] = useState(note.content || "");
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    console.log(`Editor loaded. Available notes for linking: ${allNotes.length}`);
    if (allNotes.length === 0) {
      console.warn("Warning: allNotes is empty. Wiki links will not find destinations.");
    }
  }, [allNotes]);

  useEffect(() => {
    setContent(note.content || "");
    setMode('edit');
  }, [note.id, note.content]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...note, content })
      });
      if (!response.ok) throw new Error(`Error saving: ${response.statusText}`);
      setTimeout(() => setIsSaving(false), 500);
    } catch (err) {
      console.error("Save failed:", err);
      setIsSaving(false);
      alert("Failed to save note.");
    }
  };

  const handleWikiClick = (title: string) => {
    // Clean the title
    const cleanTitle = decodeURIComponent(title.replace('wiki:', '')).replace(/-/g, ' ').toLowerCase().trim();

    console.log(`Clicking Link: "${title}" -> Searching for: "${cleanTitle}"`);

    const targetNote = allNotes.find(n =>
      n.title.toLowerCase().trim() === cleanTitle
    );

    if (targetNote) {
      console.log("Found match:", targetNote.title);
      router.push(`/notes/${targetNote.id}`);
    } else {
      console.warn("Available Titles:", allNotes.map(n => n.title));
      alert(`Note "${cleanTitle}" not found in your ${allNotes.length} notes.`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* Toolbar */}
      <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/50">
        <div className="flex items-center gap-4 overflow-hidden">
          <h2 className="font-semibold text-zinc-100 truncate text-lg">{note.title}</h2>
          {note.vault_name && (
            <span className="text-xs text-zinc-400 px-2 py-0.5 bg-zinc-800 rounded-full border border-zinc-700 whitespace-nowrap">
              {note.vault_name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all text-sm font-medium"
          >
            {mode === 'edit' ? <Eye size={16} /> : <FileText size={16} />}
            <span>{mode === 'edit' ? 'Preview' : 'Edit'}</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-all shadow-sm ${isSaving ? 'bg-green-600/20 text-green-400' : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
          >
            <Save size={16} />
            {isSaving ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative group">
        {mode === 'edit' ? (
          <textarea
            className="w-full h-full bg-[#1e1e1e] text-zinc-300 p-8 resize-none focus:outline-none font-mono text-sm leading-relaxed"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="# Start typing..."
            spellCheck={false}
          />
        ) : (
          <div className="w-full h-full overflow-y-auto p-8 bg-[#1e1e1e]">
            <article className="prose prose-invert prose-zinc max-w-3xl mx-auto">
              <ReactMarkdown
                remarkPlugins={[
                  remarkGfm,
                  [wikiLinkPlugin, { hrefTemplate: (permalink: string) => `wiki:${permalink}` }]
                ]}
                components={{
                  a: ({ node, href, children, ...props }) => {
                    if (href?.startsWith('wiki:') || (href && !href.startsWith('http'))) {
                      return (
                        <span
                          onClick={() => handleWikiClick(href as string)}
                          className="text-blue-400 cursor-pointer hover:underline font-semibold"
                          title={`Go to: ${children}`}
                        >
                          {children}
                        </span>
                      );
                    }
                    return <a href={href} {...props} target="_blank" rel="noopener noreferrer">{children}</a>;
                  }
                }}
              >
                {content}
              </ReactMarkdown>
            </article>
          </div>
        )}
      </div>
    </div>
  );
}
