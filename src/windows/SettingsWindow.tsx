// Settings window component for Steward AI assistant - Raycast-style tabbed settings
import { useState } from 'react';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/react';
import { FiVolume2, FiCommand, FiSettings, FiInfo } from 'react-icons/fi';
import AudioSettings from '../components/settings/AudioSettings';
import GeneralSettings from '../components/settings/GeneralSettings';
import ShortcutsSettings from '../components/settings/ShortcutsSettings';
import AboutSettings from '../components/settings/AboutSettings';
import { useTheme } from '../contexts/ThemeContext';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function SettingsWindow() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const tabs = [
    {
      name: 'General',
      icon: FiSettings,
      component: GeneralSettings,
    },
    {
      name: 'Audio',
      icon: FiVolume2,
      component: AudioSettings,
    },
    {
      name: 'Shortcuts',
      icon: FiCommand,
      component: ShortcutsSettings,
    },
    {
      name: 'About',
      icon: FiInfo,
      component: AboutSettings,
    },
  ];

  const { currentTheme } = useTheme();

  return (
    <div 
      className="h-screen bg-primary text-text-primary transition-colors duration-300"
      data-theme={currentTheme}
    >
      <div className="h-full flex flex-col">

        {/* Tab Navigation */}
        <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <TabList className="flex space-x-1 p-2 bg-secondary/50">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  classNames(
                    'flex-1 flex flex-col items-center justify-center py-3 px-2 space-y-1',
                    'text-sm font-medium rounded-md',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
                    selected
                      ? 'bg-accent/10 text-accent shadow-sm'
                      : 'text-text-secondary hover:bg-primary/50 hover:text-text-primary'
                  )
                }
              >
                <tab.icon className="h-5 w-5 mb-1" />
                <span>{tab.name}</span>
              </Tab>
            ))}
          </TabList>
          
          <TabPanels className="flex-1 overflow-y-auto">
            {tabs.map((tab, index) => (
              <TabPanel
                key={tab.name}
                className={classNames(
                  'p-6',
                  index === selectedIndex ? 'block' : 'hidden'
                )}
              >
                <tab.component />
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}