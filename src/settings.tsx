// Settings window entry point for Steward AI assistant
import React from 'react';
import ReactDOM from 'react-dom/client';
import SettingsWindow from './windows/SettingsWindow';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <SettingsWindow />
    </ThemeProvider>
  </React.StrictMode>
);