// Theme context provider for managing UI themes and color schemes
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeName = 
  | 'dark-grayscale'
  | 'warm-charcoal'
  | 'deep-blue'
  | 'forest-green'
  | 'midnight-purple'
  | 'coffee-brown'
  | 'ocean-teal'
  | 'light-mode'
  | 'auto';

interface ThemeContextType {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  availableThemes: { name: ThemeName; label: string }[];
  isAuto: boolean;
}

const themes = [
  { name: 'dark-grayscale', label: 'Dark Grayscale' },
  { name: 'warm-charcoal', label: 'Warm Charcoal' },
  { name: 'deep-blue', label: 'Deep Blue' },
  { name: 'forest-green', label: 'Forest Green' },
  { name: 'midnight-purple', label: 'Midnight Purple' },
  { name: 'coffee-brown', label: 'Coffee Brown' },
  { name: 'ocean-teal', label: 'Ocean Teal' },
  { name: 'light-mode', label: 'Light Mode' },
  { name: 'auto', label: 'Auto (System)' },
] as const;


const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeName;
}

export function ThemeProvider({ children, defaultTheme = 'dark-grayscale' }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(defaultTheme);

  useEffect(() => {
    const savedTheme = localStorage.getItem('steward-theme') as ThemeName;
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (currentTheme === 'auto') {
      // For now, use system preference detection when implemented
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-grayscale' : 'light-mode';
      document.documentElement.setAttribute('data-theme', systemTheme);
    } else {
      document.documentElement.setAttribute('data-theme', currentTheme);
    }
    
    localStorage.setItem('steward-theme', currentTheme);
  }, [currentTheme]);

  const setTheme = (theme: ThemeName) => {
    setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      setTheme,
      availableThemes: themes as unknown as { name: ThemeName; label: string }[],
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