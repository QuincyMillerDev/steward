// Enhanced ThemeContext using ThemeRegistry for centralized theme management
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { themeRegistry } from '../lib/theme/registry';
import type { ThemeState, ThemeContextValue } from '../lib/theme/types';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeState, setThemeState] = useState<ThemeState>({
    currentTheme: 'auto',
    effectiveTheme: 'dark-grayscale',
    systemTheme: themeRegistry.getSystemTheme(),
    isAuto: true,
    isLoading: true,
    accessibility: {
      wcagCompliance: 'AA',
      minimumFontSize: 16,
      highContrast: false,
      reducedMotion: false,
    },
  });

  // Initialize theme registry on mount
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        await themeRegistry.initialize();
        
        const currentTheme = themeRegistry.getCurrentTheme();
        const effectiveTheme = themeRegistry.getEffectiveTheme();
        const systemTheme = themeRegistry.getSystemTheme();
        const themeConfig = themeRegistry.getThemeConfig(effectiveTheme);
        
        setThemeState({
          currentTheme,
          effectiveTheme,
          systemTheme,
          isAuto: currentTheme === 'auto',
          isLoading: false,
          accessibility: themeConfig?.accessibility || {
            wcagCompliance: 'AA',
            minimumFontSize: 16,
            highContrast: false,
            reducedMotion: false,
          },
        });
      } catch (error) {
        console.error('Failed to initialize theme:', error);
        setThemeState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeTheme();
  }, []);

  // Listen for theme changes
  useEffect(() => {
    const unsubscribe = themeRegistry.addThemeChangeListener((event) => {
      const currentTheme = themeRegistry.getCurrentTheme();
      const effectiveTheme = themeRegistry.getEffectiveTheme();
      const systemTheme = themeRegistry.getSystemTheme();
      const themeConfig = themeRegistry.getThemeConfig(effectiveTheme);

      setThemeState(prev => ({
        ...prev,
        currentTheme,
        effectiveTheme,
        systemTheme,
        isAuto: currentTheme === 'auto',
        accessibility: themeConfig?.accessibility || prev.accessibility,
      }));
    });

    return unsubscribe;
  }, []);

  const setTheme = useCallback(async (theme: string) => {
    try {
      await themeRegistry.setTheme(theme);
    } catch (error) {
      console.error('Failed to set theme:', error);
    }
  }, []);

  const setAuto = useCallback(async (enabled: boolean) => {
    try {
      await themeRegistry.setAuto(enabled);
    } catch (error) {
      console.error('Failed to set auto theme:', error);
    }
  }, []);

  const updateAccessibility = useCallback(async (config: Partial<ThemeState['accessibility']>) => {
    // This would need to be implemented based on the specific accessibility features
    console.warn('updateAccessibility not yet implemented');
  }, []);

  const value: ThemeContextValue = {
    ...themeState,
    setTheme,
    setAuto,
    updateAccessibility,
    availableThemes: themeRegistry.listThemes(),
    getThemeConfig: themeRegistry.getThemeConfig,
  };

  return (
    <ThemeContext.Provider value={value}>
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