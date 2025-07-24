// Settings window entry point for Steward AI assistant
import React from 'react';
import ReactDOM from 'react-dom/client';
import SettingsWindow from './windows/SettingsWindow';
import StateProvider from './components/providers/StateProvider';
import AlertSystem from './components/alerts/AlertSystem';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StateProvider>
      <div className="w-screen h-screen">
        <SettingsWindow />
      </div>
      <AlertSystem position="top-right" />
    </StateProvider>
  </React.StrictMode>
);