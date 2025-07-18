import React from 'react';
import { FloatingToolbar } from './components/FloatingToolbar';
import './styles/globals.css';

function App() {
  const handleMicClick = () => {
    console.log('Mic button clicked');
  };

  const handleSettingsClick = () => {
    console.log('Settings button clicked');
  };

  return (
    <div className="w-screen h-screen bg-transparent flex items-center justify-center">
      <FloatingToolbar 
        onMicClick={handleMicClick}
        onSettingsClick={handleSettingsClick}
      />
    </div>
  );
}

export default App;
