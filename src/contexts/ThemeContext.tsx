// Theme context provider for managing UI themes and color schemes - Modular DRY approach
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { allThemes, type ThemeName, getSystemTheme } from '../lib/themeConfig';

interface ThemeContextType {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  availableThemes: { name: ThemeName; label: string }[];
  isAuto: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeName;
}

export function ThemeProvider({ children, defaultTheme = 'dark-grayscale' }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(defaultTheme);

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('steward-theme') as ThemeName;
    if (savedTheme && allThemes.some(t => t.name === savedTheme)) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const applyTheme = () => {
      let effectiveTheme: ThemeName;
      
      if (currentTheme === 'auto') {
        effectiveTheme = getSystemTheme();
      } else {
        effectiveTheme = currentTheme;
      }
      
      // Set data-theme attribute for CSS selectors
      document.documentElement.setAttribute('data-theme', effectiveTheme);
      
      // Save preference
      localStorage.setItem('steward-theme', currentTheme);
    };

    applyTheme();

    // Listen for system theme changes when in auto mode
    if (currentTheme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [currentTheme]);

  const setTheme = (theme: ThemeName) => {
    setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      setTheme,
      availableThemes: allThemes,
      isAuto: currentTheme === 'auto',
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}