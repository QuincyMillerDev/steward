// General settings component combining appearance, privacy, and font size settings
import { useState } from 'react';
import { FaCheck, FaChevronDown } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

export default function GeneralSettings() {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [fontSize, setFontSize] = useState('large');
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  
  // Privacy settings
  const [dataStorage, setDataStorage] = useState(true);
  const [confirmations, setConfirmations] = useState(true);
  const [screenshotRetention, setScreenshotRetention] = useState(7);
  const [highContrast, setHighContrast] = useState(false);

  const fontSizes = [
    { value: 'normal', label: 'Normal (16px)' },
    { value: 'large', label: 'Large (18px)' },
    { value: 'xlarge', label: 'Extra Large (20px)' },
  ];

  return (
    <div className="space-y-8">
      {/* Appearance Section */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-4">Appearance</h2>
        
        <div className="space-y-6">
          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Theme
            </label>
            <div className="relative">
              <button
                type="button"
                className="relative w-full cursor-pointer rounded-lg bg-primary/50 py-3 pl-4 pr-12 text-left text-text-primary border border-border hover:border-accent/50 focus:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 transition-colors"
                onClick={() => setIsThemeOpen(!isThemeOpen)}
              >
                <span className="block truncate">
                  {availableThemes.find(t => t.name === currentTheme)?.label || 'Select theme'}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <FaChevronDown
                    className="h-4 w-4 text-text-secondary"
                    aria-hidden="true"
                  />
                </span>
              </button>
              
              {isThemeOpen && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-secondary py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                  {availableThemes.map((theme) => (
                    <button
                      key={theme.name}
                      className={`relative cursor-pointer select-none py-3 pl-12 pr-4 w-full text-left transition-colors ${
                        currentTheme === theme.name
                          ? 'bg-accent/10 text-accent'
                          : 'text-text-primary hover:bg-accent/10'
                      }`}
                      onClick={() => {
                        setTheme(theme.name);
                        setIsThemeOpen(false);
                      }}
                    >
                      <span
                        className={`block truncate ${
                          currentTheme === theme.name ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {theme.label}
                      </span>
                      {currentTheme === theme.name && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-accent">
                          <FaCheck className="h-4 w-4" aria-hidden="true" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="mt-2 text-xs text-text-secondary">
              Choose a theme that suits your preference or let the system decide
            </p>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Font Size
            </label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="w-full rounded-lg bg-primary/50 border border-border text-text-primary px-4 py-3 focus:border-accent focus:outline-none"
            >
              {fontSizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-text-secondary">
              Adjust text size for better readability
            </p>
          </div>

          {/* High Contrast */}
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="rounded border-border text-accent focus:ring-accent"
              />
              <span className="text-sm text-text-primary">Enable high contrast mode</span>
            </label>
            <p className="mt-2 text-xs text-text-secondary">
              Increase contrast for better visibility
            </p>
          </div>
        </div>
      </div>

      {/* Privacy & Security Section */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-4">Privacy & Security</h2>
        
        <div className="space-y-6">
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={dataStorage}
                onChange={(e) => setDataStorage(e.target.checked)}
                className="rounded border-border text-accent focus:ring-accent"
              />
              <span className="text-sm text-text-primary">Enable local data storage</span>
            </label>
            <p className="mt-2 text-xs text-text-secondary">
              Store conversations and screenshots locally only. No data is sent to external servers.
            </p>
          </div>

          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={confirmations}
                onChange={(e) => setConfirmations(e.target.checked)}
                className="rounded border-border text-accent focus:ring-accent"
              />
              <span className="text-sm text-text-primary">Require confirmations for actions</span>
            </label>
            <p className="mt-2 text-xs text-text-secondary">
              Always ask before executing sensitive commands or system changes
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Screenshot retention (days)
            </label>
            <select
              value={screenshotRetention}
              onChange={(e) => setScreenshotRetention(Number(e.target.value))}
              className="w-full rounded-lg bg-primary/50 border border-border text-text-primary px-4 py-3 focus:border-accent focus:outline-none"
            >
              <option value={1}>1 day</option>
              <option value={3}>3 days</option>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
            </select>
            <p className="mt-2 text-xs text-text-secondary">
              How long to keep screenshots before automatic cleanup
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}