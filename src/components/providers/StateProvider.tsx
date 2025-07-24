// State provider component to initialize the Zustand store and manage global state
import React, { useEffect, useState } from 'react';
import { initializeStore, useTheme } from '../../store';
import { persistenceService } from '../../store/persistence';
import { applyTheme } from '../../lib/themes';

interface StateProviderProps {
  children: React.ReactNode;
}

// Theme Effect Component - handles theme application
const ThemeEffect: React.FC = () => {
  const theme = useTheme();

  useEffect(() => {
    // Apply theme to document
    applyTheme(theme);
  }, [theme]);

  return null;
};

// Main State Provider
export const StateProvider: React.FC<StateProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('Initializing Steward state management...');
        
        // Initialize database connection
        await persistenceService.initialize();
        console.log('Database connection established');
        
        // Initialize the Zustand store
        await initializeStore();
        console.log('Store initialized successfully');
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize state management:', error);
        setInitError(error instanceof Error ? error.message : 'Unknown initialization error');
      }
    };

    initialize();

    // Cleanup on unmount
    return () => {
      persistenceService.close().catch(console.error);
    };
  }, []);

  // During initialization, render nothing to avoid affecting window dimensions
  if (!isInitialized && !initError) {
    return null;
  }

  // Show error state if initialization failed - minimal version
  if (initError) {
    return (
      <div className="flex items-center justify-center" style={{ width: '240px', height: '48px' }}>
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-1">
          <svg className="h-3 w-3 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <>
      <ThemeEffect />
      {children}
    </>
  );
};

export default StateProvider;