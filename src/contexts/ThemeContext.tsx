// Theme context provider for 3-option system (System, Light, Dark)
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { allThemes, type ThemeName, applyThemeVariables } from '../lib/themeConfig';

interface ThemeContextType {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  availableThemes: { name: ThemeName; label: string }[];
  isSystem: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeName;
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
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
      applyThemeVariables(document.documentElement, currentTheme);
      document.documentElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem('steward-theme', currentTheme);
    };

    applyTheme();

    // Listen for system theme changes when in system mode
    if (currentTheme === 'system') {
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
      isSystem: currentTheme === 'system',
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