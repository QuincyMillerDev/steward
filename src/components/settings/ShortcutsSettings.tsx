// Keyboard shortcuts settings component for managing hotkeys
import { useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

export default function ShortcutsSettings() {
  const [shortcuts, setShortcuts] = useState([
    { action: 'Activate voice', key: 'Ctrl+Shift+V', enabled: true, editable: false },
    { action: 'Quick screenshot', key: 'Ctrl+Shift+S', enabled: true, editable: false },
    { action: 'Toggle overlay', key: 'Ctrl+Shift+O', enabled: false, editable: true },
    { action: 'Settings', key: 'Ctrl+Shift+,', enabled: true, editable: true },
  ]);
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [recordingKey, setRecordingKey] = useState('');

  const toggleShortcut = (index: number) => {
    const newShortcuts = [...shortcuts];
    newShortcuts[index].enabled = !newShortcuts[index].enabled;
    setShortcuts(newShortcuts);
  };

  const startRecording = (index: number) => {
    setEditingKey(index);
    setRecordingKey('');
  };

  const deleteShortcut = (index: number) => {
    if (shortcuts[index].editable) {
      const newShortcuts = shortcuts.filter((_, i) => i !== index);
      setShortcuts(newShortcuts);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-4">Keyboard Shortcuts</h2>
        <p className="text-sm text-text-secondary">
          Customize keyboard shortcuts for quick access to Steward features
        </p>
      </div>

      <div className="space-y-6">
        {/* Shortcuts List */}
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="bg-primary/50 rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shortcut.enabled}
                      onChange={() => toggleShortcut(index)}
                      className="h-4 w-4 rounded border-border text-accent focus:ring-2 focus:ring-accent focus:ring-offset-0 bg-primary/50"
                    />
                    <div>
                      <span className="text-sm font-medium text-text-primary">{shortcut.action}</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <kbd className="px-2 py-1 bg-secondary rounded text-xs font-mono text-text-primary">
                          {shortcut.key}
                        </kbd>
                        {shortcut.editable && (
                          <button
                            onClick={() => startRecording(index)}
                            className="text-xs text-accent hover:text-accent/80"
                          >
                            {editingKey === index ? 'Recording...' : 'Change'}
                          </button>
                        )}
                      </div>
                    </div>
                  </label>
                </div>

                {shortcut.editable && (
                  <button
                    onClick={() => deleteShortcut(index)}
                    className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                    title="Delete shortcut"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Custom Shortcut */}
        <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-dashed border-border">
          <div>
            <p className="text-sm font-medium text-text-primary">Add custom shortcut</p>
            <p className="text-xs text-text-secondary">Create your own keyboard shortcuts</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors text-sm"
            onClick={() => {
              const newShortcut = {
                action: 'New Action',
                key: 'Ctrl+Shift+N',
                enabled: true,
                editable: true
              };
              setShortcuts([...shortcuts, newShortcut]);
            }}
          >
            <FiPlus className="h-4 w-4" />
            <span>Add Shortcut</span>
          </button>
        </div>

        {/* Reset to Defaults */}
        <div className="pt-4 border-t border-border">
          <button className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => {
              setShortcuts([
                { action: 'Activate voice', key: 'Ctrl+Shift+V', enabled: true, editable: false },
                { action: 'Quick screenshot', key: 'Ctrl+Shift+S', enabled: true, editable: false },
                { action: 'Toggle overlay', key: 'Ctrl+Shift+O', enabled: false, editable: true },
                { action: 'Settings', key: 'Ctrl+Shift+,', enabled: true, editable: true },
              ]);
            }}
          >
            Reset to defaults
          </button>
        </div>
      </div>
    </div>
  );
}