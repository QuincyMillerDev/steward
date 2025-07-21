// Settings window component for Steward AI assistant
import { useState } from 'react';

export default function SettingsWindow() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Steward Settings</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'general', label: 'General' },
                { id: 'voice', label: 'Voice' },
                { id: 'automation', label: 'Automation' },
                { id: 'privacy', label: 'Privacy' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'general' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">General Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">App Theme</label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
                      <option>System</option>
                      <option>Light</option>
                      <option>Dark</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Language</label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
                      <option>English</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'voice' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Voice Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Microphone Source</label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
                      <option>Default Microphone</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Voice Recognition Sensitivity</label>
                    <input type="range" min="0" max="100" defaultValue="75" className="w-full" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'automation' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Automation Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input type="checkbox" id="confirm-actions" className="mr-2" defaultChecked />
                    <label htmlFor="confirm-actions" className="text-sm font-medium">Require confirmation for automated actions</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="auto-save" className="mr-2" defaultChecked />
                    <label htmlFor="auto-save" className="text-sm font-medium">Auto-save screenshots</label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input type="checkbox" id="local-only" className="mr-2" defaultChecked />
                    <label htmlFor="local-only" className="text-sm font-medium">Keep all data local (no cloud sync)</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Data Retention Period</label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
                      <option>7 days</option>
                      <option>30 days</option>
                      <option>90 days</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}