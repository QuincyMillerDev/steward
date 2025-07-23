import { useState } from "react"
import { FaCheck, FaChevronDown } from "react-icons/fa"
import { useTheme } from "../../contexts/ThemeContext"

export default function GeneralSettings() {
  const { currentTheme, setTheme, availableThemes } = useTheme()
  const [fontSize, setFontSize] = useState("large")
  const [isThemeOpen, setIsThemeOpen] = useState(false)

  // Privacy settings
  const [dataStorage, setDataStorage] = useState(true)
  const [confirmations, setConfirmations] = useState(true)
  const [screenshotRetention, setScreenshotRetention] = useState(7)
  const [highContrast, setHighContrast] = useState(false)

  const fontSizes = [
    { value: "normal", label: "Normal (14px)" },
    { value: "large", label: "Large (16px)" },
    { value: "xlarge", label: "Extra Large (18px)" },
  ]

  return (
    <div className="space-y-8">
      {/* Appearance Section */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Appearance</h2>
        <div className="space-y-4">
          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Theme</label>
            <div className="relative">
              <button
                type="button"
                className="relative w-full cursor-pointer rounded-md bg-secondary py-2 pl-3 pr-10 text-left text-sm text-text-primary border border-border hover:border-accent/50 focus:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 transition-colors"
                onClick={() => setIsThemeOpen(!isThemeOpen)}
              >
                <span className="block truncate">
                  {availableThemes.find((t) => t.name === currentTheme)?.label || "Select theme"}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <FaChevronDown className="h-3 w-3 text-text-secondary" aria-hidden="true" />
                </span>
              </button>

              {isThemeOpen && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-secondary py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none border border-border">
                  {availableThemes.map((theme) => (
                    <button
                      key={theme.name}
                      className={`relative cursor-pointer select-none py-2 pl-8 pr-4 w-full text-left transition-colors ${
                        currentTheme === theme.name ? "bg-accent/10 text-accent" : "text-text-primary hover:bg-accent/5"
                      }`}
                      onClick={() => {
                        setTheme(theme.name)
                        setIsThemeOpen(false)
                      }}
                    >
                      <span className={`block truncate ${currentTheme === theme.name ? "font-medium" : "font-normal"}`}>
                        {theme.label}
                      </span>
                      {currentTheme === theme.name && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-accent">
                          <FaCheck className="h-3 w-3" aria-hidden="true" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-text-secondary">Choose a theme that suits your preference</p>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Font Size</label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="w-full rounded-md bg-secondary border border-border text-text-primary px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {fontSizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-text-secondary">Adjust text size for better readability</p>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-text-primary">High contrast mode</label>
              <p className="text-xs text-text-secondary">Increase contrast for better visibility</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-9 h-5 bg-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Privacy & Security Section */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Privacy & Security</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-text-primary">Local data storage</label>
              <p className="text-xs text-text-secondary">Store conversations locally only</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={dataStorage}
                onChange={(e) => setDataStorage(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-9 h-5 bg-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-text-primary">Require confirmations</label>
              <p className="text-xs text-text-secondary">Ask before executing sensitive commands</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={confirmations}
                onChange={(e) => setConfirmations(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-9 h-5 bg-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Screenshot retention</label>
            <select
              value={screenshotRetention}
              onChange={(e) => setScreenshotRetention(Number(e.target.value))}
              className="w-full rounded-md bg-secondary border border-border text-text-primary px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value={1}>1 day</option>
              <option value={3}>3 days</option>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
            </select>
            <p className="mt-1 text-xs text-text-secondary">How long to keep screenshots before cleanup</p>
          </div>
        </div>
      </div>
    </div>
  )
}
