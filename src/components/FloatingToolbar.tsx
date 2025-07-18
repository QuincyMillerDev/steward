import React from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';

interface FloatingToolbarProps {
  onMicClick?: () => void;
  onSettingsClick?: () => void;
  isRecording?: boolean;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  onMicClick,
  onSettingsClick,
  isRecording = false,
}) => {
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent dragging on buttons
    if (e.target instanceof HTMLButtonElement) return;
    
    const startX = e.clientX;
    const startY = e.clientY;
    
    const handleMouseMove = async (moveEvent: MouseEvent) => {
      const window = getCurrentWindow();
      const position = await window.outerPosition();
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      await window.setPosition({ x: position.x + deltaX, y: position.y + deltaY });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="toolbar-container" onMouseDown={handleMouseDown}>
      <button
        className={`toolbar-button ${isRecording ? 'bg-green-500 animate-pulse' : 'mic-button'}`}
        onClick={onMicClick}
        aria-label="Start voice recording"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </button>

      <button
        className="toolbar-button settings-button"
        onClick={onSettingsClick}
        aria-label="Open settings"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
    </div>
  );
};