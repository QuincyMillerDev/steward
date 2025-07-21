// Floating toolbar component with voice control and settings buttons
import { Button } from '@headlessui/react';
import { HiCog6Tooth } from 'react-icons/hi2';
import { MdOutlineDragIndicator } from "react-icons/md";
import MicrophoneButton from './MicrophoneButton';

interface ToolbarProps {
  status?: string;
  subtitle?: string;
  isRecording?: boolean;
  onRecordClick?: () => void;
  onSettingsClick?: () => void;
}

export default function Toolbar({ 
  isRecording = false,
  onRecordClick,
  onSettingsClick
}: ToolbarProps) {
  return (
    <div 
      className="relative flex items-center transition-colors select-none"
      style={{
        width: "240px",
        height: "48px",
        borderRadius: "8px",
        backgroundColor: 'var(--color-secondary)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div 
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
        onClick={onSettingsClick}
      >
        <HiCog6Tooth className="w-4 h-4" />
      </Button>
    </div>
  );
}