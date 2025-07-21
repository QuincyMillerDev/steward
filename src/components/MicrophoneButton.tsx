// Microphone button component with recording state indicators
import { Button } from '@headlessui/react';
import { HiMicrophone, HiStop } from 'react-icons/hi2';

interface MicrophoneButtonProps {
  isRecording: boolean;
  onClick?: () => void;
}

export default function MicrophoneButton({ isRecording, onClick }: MicrophoneButtonProps) {
  if (isRecording) {
    return (
      <Button 
        className="flex items-center justify-center w-8 h-8 rounded transition-all duration-150"
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
        <HiStop className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Button 
      className="flex items-center justify-center w-8 h-8 rounded transition-all duration-150"
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
      <HiMicrophone className="w-4 h-4" />
    </Button>
  );
}