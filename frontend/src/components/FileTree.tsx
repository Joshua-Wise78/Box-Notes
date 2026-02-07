export default function FileTree({ notes, onSelect, activeId }) {
  // Group notes by vault
  const vaults = notes.reduce((acc, note) => {
    (acc[note.vault_name] = acc[note.vault_name] || []).push(note);
    return acc;
  }, {});

  return (
    <div className="w-64 bg-[#181818] border-r border-gray-800 p-4 overflow-y-auto">
      <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Vaults</h2>
      {Object.entries(vaults).map(([vault, vaultNotes]) => (
        <details key={vault} open className="mb-4">
          <summary className="cursor-pointer text-sm font-semibold text-gray-300 hover:text-white">
            {vault}
          </summary>
          <ul className="mt-2 space-y-1">
            {vaultNotes.map(note => (
              <li
                key={note.id}
                onClick={() => onSelect(note.id)}
                className={`text-sm py-1 px-2 rounded cursor-pointer truncate ${activeId === note.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'
                  }`}
              >
                {note.title}
              </li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}
