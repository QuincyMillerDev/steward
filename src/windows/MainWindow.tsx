// Main application window container for Steward AI assistant
import React from 'react';
import Toolbar from '../components/Toolbar';

interface MainWindowProps {
  children?: React.ReactNode;
}

export default function MainWindow({ children }: MainWindowProps) {
  return (
    <div className="w-full h-full">
      <Toolbar />
      {children}
    </div>
  );
}