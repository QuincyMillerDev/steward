import { IconVolume2, IconPalette, IconShield, IconKeyboard } from "@tabler/icons-react"

export function SettingsContent() {
  return (
    <div className="space-y-8 bg-white/95 dark:bg-[hsl(var(--card))] backdrop-blur-md rounded-2xl p-6 shadow-lg">
      {/* Audio Settings */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <IconVolume2 className="w-6 h-6 text-[hsl(var(--primary))]" />
          <h3 className="text-xl font-semibold text-[hsl(var(--foreground))]">Audio Settings</h3>
        </div>
        <div className="space-y-4 pl-8">
          <div>
            <label className="block text-base font-medium text-[hsl(var(--foreground))] mb-2">
              Microphone Sensitivity
            </label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="50"
              className="w-full h-2 bg-[hsl(var(--muted))] rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="push-to-talk"
              className="w-5 h-5 text-[hsl(var(--primary))] bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded focus:ring-2 focus:ring-[hsl(var(--primary))]"
            />
            <label htmlFor="push-to-talk" className="text-base text-[hsl(var(--foreground))] ml-2">
              Enable push-to-talk mode
            </label>
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <IconPalette className="w-6 h-6 text-[hsl(var(--secondary))]" />
          <h3 className="text-xl font-semibold text-[hsl(var(--foreground))]">Appearance</h3>
        </div>
        <div className="space-y-4 pl-8">
          <div>
            <label className="block text-base font-medium text-[hsl(var(--foreground))] mb-2">Theme</label>
            <select className="w-full p-3 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent">
              <option>System</option>
              <option>Light</option>
              <option>Dark</option>
            </select>
          </div>
          <div>
            <label className="block text-base font-medium text-[hsl(var(--foreground))] mb-2">Text Size</label>
            <select className="w-full p-3 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent">
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
              <option>Extra Large</option>
            </select>
          </div>
        </div>
      </section>

      {/* Privacy & Security */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <IconShield className="w-6 h-6 text-[hsl(var(--success))]" />
          <h3 className="text-xl font-semibold text-[hsl(var(--foreground))]">Privacy & Security</h3>
        </div>
        <div className="space-y-4 pl-8">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="save-conversations"
              defaultChecked
              className="w-5 h-5 text-[hsl(var(--primary))] bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded focus:ring-2 focus:ring-[hsl(var(--primary))]"
            />
            <label htmlFor="save-conversations" className="text-base text-[hsl(var(--foreground))] ml-2">
              Save conversation history
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="require-confirmation"
              defaultChecked
              className="w-5 h-5 text-[hsl(var(--primary))] bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded focus:ring-2 focus:ring-[hsl(var(--primary))]"
            />
            <label htmlFor="require-confirmation" className="text-base text-[hsl(var(--foreground))] ml-2">
              Always ask before performing actions
            </label>
          </div>
        </div>
      </section>

      {/* Keyboard Shortcuts */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <IconKeyboard className="w-6 h-6 text-[hsl(var(--warning))]" />
          <h3 className="text-xl font-semibold text-[hsl(var(--foreground))]">Keyboard Shortcuts</h3>
        </div>
        <div className="space-y-3 pl-10">
          <div className="flex justify-between items-center">
            <span className="text-base text-[hsl(var(--foreground))] leading-relaxed">Start/Stop Listening</span>
            <kbd className="px-3 py-1.5 text-sm font-semibold text-[hsl(var(--foreground))] bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg">
              Ctrl + Space
            </kbd>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-base text-[hsl(var(--foreground))] leading-relaxed">Open Settings</span>
            <kbd className="px-3 py-1.5 text-sm font-semibold text-[hsl(var(--foreground))] bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg">
              Ctrl + ,
            </kbd>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-base text-[hsl(var(--foreground))] leading-relaxed">Stop Agent</span>
            <kbd className="px-3 py-1.5 text-sm font-semibold text-[hsl(var(--foreground))] bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg">
              Escape
            </kbd>
          </div>
        </div>
      </section>
    </div>
  )
}