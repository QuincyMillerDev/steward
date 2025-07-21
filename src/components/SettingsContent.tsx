import { IconVolume2, IconPalette, IconShield, IconKeyboard } from "@tabler/icons-react"

export function SettingsContent() {
  return (
    <div className="space-y-8">
      {/* Audio Settings */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <IconVolume2 className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl font-semibold text-gray-100">Audio Settings</h3>
        </div>
        <div className="space-y-4 pl-8">
          <div>
            <label className="block text-base font-medium text-gray-100 mb-2">
              Microphone Sensitivity
            </label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="50"
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="push-to-talk"
              className="w-5 h-5 text-blue-500 bg-gray-900 border border-gray-700 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="push-to-talk" className="text-base text-gray-100 ml-2">
              Enable push-to-talk mode
            </label>
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <IconPalette className="w-6 h-6 text-green-500" />
          <h3 className="text-xl font-semibold text-gray-100">Appearance</h3>
        </div>
        <div className="space-y-4 pl-8">
          <div>
            <label className="block text-base font-medium text-gray-100 mb-2">Theme</label>
            <select className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>System</option>
              <option>Light</option>
              <option>Dark</option>
            </select>
          </div>
          <div>
            <label className="block text-base font-medium text-gray-100 mb-2">Text Size</label>
            <select className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
          <IconShield className="w-6 h-6 text-green-500" />
          <h3 className="text-xl font-semibold text-gray-100">Privacy & Security</h3>
        </div>
        <div className="space-y-4 pl-8">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="save-conversations"
              defaultChecked
              className="w-5 h-5 text-blue-500 bg-gray-900 border border-gray-700 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="save-conversations" className="text-base text-gray-100 ml-2">
              Save conversation history
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="require-confirmation"
              defaultChecked
              className="w-5 h-5 text-blue-500 bg-gray-900 border border-gray-700 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="require-confirmation" className="text-base text-gray-100 ml-2">
              Always ask before performing actions
            </label>
          </div>
        </div>
      </section>

      {/* Keyboard Shortcuts */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <IconKeyboard className="w-6 h-6 text-amber-500" />
          <h3 className="text-xl font-semibold text-gray-100">Keyboard Shortcuts</h3>
        </div>
        <div className="space-y-3 pl-10">
          <div className="flex justify-between items-center">
            <span className="text-base text-gray-100 leading-relaxed">Start/Stop Listening</span>
            <kbd className="px-3 py-1.5 text-sm font-semibold text-gray-100 bg-gray-800 border border-gray-700 rounded-lg">
              Ctrl + Space
            </kbd>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-base text-gray-100 leading-relaxed">Open Settings</span>
            <kbd className="px-3 py-1.5 text-sm font-semibold text-gray-100 bg-gray-800 border border-gray-700 rounded-lg">
              Ctrl + ,
            </kbd>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-base text-gray-100 leading-relaxed">Stop Agent</span>
            <kbd className="px-3 py-1.5 text-sm font-semibold text-gray-100 bg-gray-800 border border-gray-700 rounded-lg">
              Escape
            </kbd>
          </div>
        </div>
      </section>
    </div>
  )
}