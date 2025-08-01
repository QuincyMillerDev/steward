// Microphone button component with recording state indicators
import { Button } from '@headlessui/react';
import { HiStop } from 'react-icons/hi2';
import { TbMicrophone } from "react-icons/tb";


interface MicrophoneButtonProps {
  isRecording: boolean;
  onClick?: () => void;
}

export default function MicrophoneButton({ isRecording, onClick }: MicrophoneButtonProps) {
  if (isRecording) {
    return (
      <Button 
        className="flex items-center justify-center w-10 h-10 rounded transition-all duration-150"
        style={{
          backgroundColor: 'var(--color-red)',
          color: 'var(--color-text)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-red-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-red)';
        }}
        aria-label="Stop recording"
        onClick={onClick}
      >
        <HiStop className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Button 
      className="flex items-center justify-center w-10 h-10 rounded transition-all duration-150"
      style={{
        backgroundColor: 'var(--color-accent)',
        color: 'var(--color-text)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-accent)';
        e.currentTarget.style.opacity = '0.9';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-accent)';
        e.currentTarget.style.opacity = '1';
      }}
      aria-label="Start recording"
      onClick={onClick}
    >
      <TbMicrophone className="w-6 h-6" />
    </Button>
  );
}