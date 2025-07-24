"use client"

import { useState } from "react"
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react"
import { FiVolume2, FiCommand, FiSettings, FiInfo } from "react-icons/fi"
import AudioTab from "../tabs/AudioTab"
import GeneralTab from "../tabs/GeneralTab"
import ShortcutsTab from "../tabs/ShortcutsTab"
import AboutTab from "../tabs/AboutTab"
import { useTheme } from "../store"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export default function SettingsWindow() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const tabs = [
    {
      name: "General",
      icon: FiSettings,
      component: GeneralTab,
    },
    {
      name: "Audio",
      icon: FiVolume2,
      component: AudioTab,
    },
    {
      name: "Shortcuts",
      icon: FiCommand,
      component: ShortcutsTab,
    },
    {
      name: "About",
      icon: FiInfo,
      component: AboutTab,
    },
  ]

  const currentTheme = useTheme()

  return (
    <div className="w-screen h-screen bg-primary text-text-primary transition-colors duration-300" data-theme={currentTheme}>
      <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex} className="h-full flex flex-col">
        {/* Tab Navigation - Fixed Header */}
        <TabList className="flex-shrink-0 flex border-b border-border bg-primary shadow-sm">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  "flex items-center justify-center px-6 py-3 text-sm font-medium min-w-0 flex-1",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset",
                  "transition-colors duration-200",
                  selected
                    ? "text-accent border-b-2 border-accent bg-secondary/30"
                    : "text-text-secondary hover:text-text-primary hover:bg-secondary/20",
                )
              }
            >
              <tab.icon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{tab.name}</span>
            </Tab>
          ))}
        </TabList>

        {/* Content Area - Scrollable with proper constraints */}
        <TabPanels className="flex-1 overflow-hidden">
          {tabs.map((tab, index) => (
            <TabPanel
              key={tab.name}
              className={classNames(
                "h-full w-full focus:outline-none",
                index === selectedIndex ? "flex" : "hidden"
              )}
            >
              <div className="flex-1 overflow-y-auto overflow-x-hidden w-full h-full">
                <div className="max-w-4xl mx-auto p-6">
                  <tab.component />
                </div>
              </div>
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  )
}
