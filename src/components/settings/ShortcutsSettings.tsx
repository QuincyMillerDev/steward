import { useState } from "react"
import { FiPlus, FiTrash2 } from "react-icons/fi"

export default function ShortcutsSettings() {
  const [shortcuts, setShortcuts] = useState([
    { action: "Activate voice", key: "Ctrl+Shift+V", enabled: true, editable: false },
    { action: "Quick screenshot", key: "Ctrl+Shift+S", enabled: true, editable: false },
    { action: "Toggle overlay", key: "Ctrl+Shift+O", enabled: false, editable: true },
    { action: "Settings", key: "Ctrl+Shift+,", enabled: true, editable: true },
  ])

  const [editingKey, setEditingKey] = useState<number | null>(null)

  const toggleShortcut = (index: number) => {
    const newShortcuts = [...shortcuts]
    newShortcuts[index].enabled = !newShortcuts[index].enabled
    setShortcuts(newShortcuts)
  }

  const startRecording = (index: number) => {
    setEditingKey(index)
  }

  const deleteShortcut = (index: number) => {
    if (shortcuts[index].editable) {
      const newShortcuts = shortcuts.filter((_, i) => i !== index)
      setShortcuts(newShortcuts)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">Keyboard Shortcuts</h2>
        <p className="text-sm text-text-secondary">Customize keyboard shortcuts for quick access</p>
      </div>

      <div className="space-y-6">
        {/* Shortcuts List */}
        <div className="space-y-2">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="bg-secondary rounded-lg p-3 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shortcut.enabled}
                        onChange={() => toggleShortcut(index)}
                        className="sr-only peer"
                      />
                      <div className="relative w-9 h-5 bg-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                    </label>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-text-primary">{shortcut.action}</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <kbd className="px-2 py-1 bg-border rounded text-xs font-mono text-text-primary">
                          {shortcut.key}
                        </kbd>
                        {shortcut.editable && (
                          <button
                            onClick={() => startRecording(index)}
                            className="text-xs text-accent hover:text-accent/80 transition-colors"
                          >
                            {editingKey === index ? "Recording..." : "Change"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {shortcut.editable && (
                  <button
                    onClick={() => deleteShortcut(index)}
                    className="p-1.5 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
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
        <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-dashed border-border">
          <div>
            <p className="text-sm font-medium text-text-primary">Add custom shortcut</p>
            <p className="text-xs text-text-secondary">Create your own keyboard shortcuts</p>
          </div>
          <button
            className="flex items-center space-x-2 px-3 py-1.5 bg-accent/10 text-accent rounded-md hover:bg-accent/20 transition-colors text-sm"
            onClick={() => {
              const newShortcut = {
                action: "New Action",
                key: "Ctrl+Shift+N",
                enabled: true,
                editable: true,
              }
              setShortcuts([...shortcuts, newShortcut])
            }}
          >
            <FiPlus className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>

        {/* Reset to Defaults */}
        <div className="pt-4 border-t border-border">
          <button
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => {
              setShortcuts([
                { action: "Activate voice", key: "Ctrl+Shift+V", enabled: true, editable: false },
                { action: "Quick screenshot", key: "Ctrl+Shift+S", enabled: true, editable: false },
                { action: "Toggle overlay", key: "Ctrl+Shift+O", enabled: false, editable: true },
                { action: "Settings", key: "Ctrl+Shift+,", enabled: true, editable: true },
              ])
            }}
          >
            Reset to defaults
          </button>
        </div>
      </div>
    </div>
  )
}
