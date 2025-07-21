import type React from "react";
import { useState } from "react";
import { Settings, HelpCircle } from "lucide-react";
import type { AppAction } from "../types/app-types";
import { SettingsContent } from "./SettingsContent";
import { HelpContent } from "./HelpContent";

interface SettingsWindowProps {
  dispatch: React.Dispatch<AppAction>;
  defaultTab?: "settings" | "help";
}

export function SettingsWindow({ defaultTab = "settings" }: SettingsWindowProps) {
  // Check if this is a standalone window
  const urlParams = new URLSearchParams(window.location.search);
  const isStandalone = urlParams.get('page') === 'settings-help';
  
  // Check URL parameter for tab preference in standalone mode
  const tabParam = isStandalone ? urlParams.get('tab') : null;
  const [activeTab, setActiveTab] = useState<"settings" | "help">(
    tabParam === 'help' ? 'help' : defaultTab
  );

  const TabButton = ({ tab, label, icon: Icon }: {
    tab: "settings" | "help";
    label: string;
    icon: React.ElementType;
  }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
        activeTab === tab
          ? "bg-gray-800 text-gray-50 shadow-sm"
          : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  const content = (
    <>
      {/* Tab Navigation */}
      <div className="border-b border-gray-800">
        <div className="flex gap-1 p-4">
          <TabButton tab="settings" label="Settings" icon={Settings} />
          <TabButton tab="help" label="Help" icon={HelpCircle} />
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {activeTab === "settings" ? (
            <SettingsContent />
          ) : (
            <HelpContent />
          )}
        </div>
      </div>
    </>
  );

  if (isStandalone) {
    return (
      <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-gray-50">
            {activeTab === "settings" ? "Settings" : "Help"}
          </h2>
        </div>

        {content}
      </div>
    );
  }

  // Modal version for overlay
  return (
    <div className="fixed inset-0 z-50 bg-gray-950/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-gray-50">
            {activeTab === "settings" ? "Settings" : "Help"}
          </h2>
        </div>

        {content}
      </div>
    </div>
  );
}