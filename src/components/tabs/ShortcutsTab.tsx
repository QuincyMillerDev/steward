import { useState } from "react"
import { FiPlus, FiTrash2 } from "react-icons/fi"
import SettingsSection from "../settings/SettingsSection"
import Switch from "../ui/Switch"
import Button from "../ui/Button"

export default function ShortcutsTab() {
  const [shortcuts, setShortcuts] = useState([
    { action: "Activate voice", key: "Ctrl+Shift+V", enabled: true, editable: false },
    { action: "Quick screenshot", key: "Ctrl+Shift+S", enabled: true, editable: false },
    { action: "Toggle overlay", key: "Ctrl+Shift+O", enabled: false, editable: true },
    { action: "Settings", key: "Ctrl+Shift+,", enabled: true, editable: true },
    { action: "Open file manager", key: "Ctrl+Shift+F", enabled: true, editable: true },
    { action: "Switch workspace", key: "Ctrl+Shift+W", enabled: false, editable: true },
    { action: "Search files", key: "Ctrl+Shift+P", enabled: true, editable: true },
    { action: "Terminal", key: "Ctrl+Shift+T", enabled: true, editable: true },
    { action: "Quick notes", key: "Ctrl+Shift+N", enabled: false, editable: true },
    { action: "Calculator", key: "Ctrl+Shift+C", enabled: true, editable: true },
    { action: "Calendar", key: "Ctrl+Shift+L", enabled: false, editable: true },
    { action: "Task manager", key: "Ctrl+Shift+M", enabled: true, editable: true },
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
    <SettingsSection title="Keyboard Shortcuts" description="Customize keyboard shortcuts for quick access">
      {/* Shortcuts List */}
      <div className="space-y-2">
        {shortcuts.map((shortcut, index) => (
          <div key={index} className="bg-secondary rounded-lg p-3 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={shortcut.enabled}
                    onChange={() => toggleShortcut(index)}
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-text-primary">{shortcut.action}</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <kbd className="px-2 py-1 bg-border rounded text-xs font-mono text-text-primary">
                        {shortcut.key}
                      </kbd>
                      {shortcut.editable && (
                        <Button
                          onClick={() => startRecording(index)}
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                        >
                          {editingKey === index ? "Recording..." : "Change"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {shortcut.editable && (
                <Button
                  onClick={() => deleteShortcut(index)}
                  variant="ghost"
                  size="sm"
                  className="p-1.5 text-text-secondary hover:text-red-500 hover:bg-red-500/10"
                  title="Delete shortcut"
                >
                  <FiTrash2 className="h-4 w-4" />
                </Button>
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
        <Button
          variant="primary"
          size="sm"
          className="bg-accent/10 text-accent hover:bg-accent/20"
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
          <FiPlus className="h-4 w-4 mr-2" />
          <span>Add</span>
        </Button>
      </div>

      {/* Reset to Defaults */}
      <div className="pt-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="text-sm text-text-secondary hover:text-text-primary"
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
        </Button>
      </div>
    </SettingsSection>
  )
}
