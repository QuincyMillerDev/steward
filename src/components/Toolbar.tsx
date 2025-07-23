// Floating toolbar component with voice control and settings buttons
import { Button } from '@headlessui/react';
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { MdOutlineDragIndicator } from "react-icons/md";
import { invoke } from '@tauri-apps/api/core';
import { useEffect, useRef } from 'react';
import MicrophoneButton from './MicrophoneButton';

interface ToolbarProps {
  status?: string;
  subtitle?: string;
  isRecording?: boolean;
  onRecordClick?: () => void;
}

export default function Toolbar({ 
  isRecording = false,
  onRecordClick
}: ToolbarProps) {
  const dragRef = useRef<HTMLDivElement>(null);
  const micRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLButtonElement>(null);

  const handleSettingsClick = async () => {
    try {
      await invoke('create_settings_window');
    } catch (error) {
      console.error('Failed to open settings window:', error);
    }
  };

  // Track interactive regions for click-through behavior
  const updateClickableRegions = () => {
    const regions: [number, number, number, number][] = [];

    // Add drag handle region
    if (dragRef.current) {
      const rect = dragRef.current.getBoundingClientRect();
      regions.push([rect.left, rect.top, rect.width, rect.height]);
    }

    // Add microphone button region
    if (micRef.current) {
      const rect = micRef.current.getBoundingClientRect();
      regions.push([rect.left, rect.top, rect.width, rect.height]);
    }

    // Add settings button region
    if (settingsRef.current) {
      const rect = settingsRef.current.getBoundingClientRect();
      regions.push([rect.left, rect.top, rect.width, rect.height]);
    }

    // Send regions to backend
    invoke('configure_toolbar_click_through', { regions })
      .catch(error => console.error('Failed to configure click-through:', error));
  };

  useEffect(() => {
    // Initial configuration
    updateClickableRegions();

    // Update on resize
    const resizeObserver = new ResizeObserver(updateClickableRegions);
    resizeObserver.observe(document.body);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div 
      className="relative flex items-center transition-colors select-none"
      style={{
        width: "240px",
        height: "48px",
        borderRadius: "8px",
        backgroundColor: 'var(--color-primary)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div 
        ref={dragRef}
        data-tauri-drag-region
        className="flex items-center justify-start h-full cursor-grab select-none"
        style={{
          width: '32px',
          color: 'var(--color-text-secondary)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--color-text)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--color-text-secondary)';
        }}
        aria-label="Drag toolbar"
      >
        <MdOutlineDragIndicator className="w-6 h-6 ml-1 pointer-events-none" />
      </div>
      
      <div className="absolute" style={{ left: '120px', transform: 'translateX(-50%)' }}>
        <MicrophoneButton 
          isRecording={isRecording}
          onClick={onRecordClick}
        />
      </div>
      <div className="flex-1"></div>
      
      <Button 
        className="flex items-center justify-center w-8 h-8 rounded transition-all duration-150 mr-3"
        style={{
          color: 'var(--color-text-secondary)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--color-text)';
          e.currentTarget.style.backgroundColor = 'var(--color-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--color-text-secondary)';
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        aria-label="Open settings"
        onClick={handleSettingsClick}
      >
        <HiOutlineCog6Tooth className="w-6 h-6" />
      </Button>
    </div>
  );
}