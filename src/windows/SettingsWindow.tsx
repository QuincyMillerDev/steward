"use client"

import { useState } from "react"
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react"
import { FiVolume2, FiCommand, FiSettings, FiInfo } from "react-icons/fi"
import AudioSettings from "../components/settings/AudioSettings"
import GeneralSettings from "../components/settings/GeneralSettings"
import ShortcutsSettings from "../components/settings/ShortcutsSettings"
import AboutSettings from "../components/settings/AboutSettings"
import { useTheme } from "../contexts/ThemeContext"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export default function SettingsWindow() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const tabs = [
    {
      name: "General",
      icon: FiSettings,
      component: GeneralSettings,
    },
    {
      name: "Audio",
      icon: FiVolume2,
      component: AudioSettings,
    },
    {
      name: "Shortcuts",
      icon: FiCommand,
      component: ShortcutsSettings,
    },
    {
      name: "About",
      icon: FiInfo,
      component: AboutSettings,
    },
  ]

  const { currentTheme } = useTheme()

  return (
    <div className="h-screen bg-primary text-text-primary transition-colors duration-300" data-theme={currentTheme}>
      <div className="h-full flex flex-col">
        {/* Tab Navigation */}
        <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <TabList className="flex border-b border-border bg-primary">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  classNames(
                    "flex items-center justify-center px-4 py-3 text-sm font-medium",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset",
                    "transition-colors duration-200",
                    selected
                      ? "text-accent border-b-2 border-accent bg-secondary/30"
                      : "text-text-secondary hover:text-text-primary hover:bg-secondary/20",
                  )
                }
              >
                <tab.icon className="h-4 w-4 mr-2" />
                <span>{tab.name}</span>
              </Tab>
            ))}
          </TabList>

          <TabPanels className="flex-1">
            {tabs.map((tab, index) => (
              <TabPanel
                key={tab.name}
                className={classNames("h-full overflow-y-auto", index === selectedIndex ? "block" : "hidden")}
              >
                <div className="max-w-2xl mx-auto p-6">
                  <tab.component />
                </div>
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  )
}
