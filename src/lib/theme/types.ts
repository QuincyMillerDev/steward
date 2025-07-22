// TypeScript interfaces for theme system - comprehensive type definitions for DRY architecture

// Base theme color definitions
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textSecondary: string;
  border: string;
  red: string;
  redHover: string;
}

// Accessibility-focused theme configuration
export interface AccessibilityConfig {
  wcagCompliance: 'AA' | 'AAA';
  minimumFontSize: number;
  highContrast: boolean;
  reducedMotion: boolean;
}

// Theme variant configuration
export interface ThemeVariant {
  name: string;
  label: string;
  colors: ThemeColors;
  accessibility: AccessibilityConfig;
  cssClass: string;
}

// System theme detection
export interface SystemThemeInfo {
  prefersDark: boolean;
  prefersHighContrast: boolean;
  prefersReducedMotion: boolean;
  fontScale: number;
}

// Tauri theme integration
export interface TauriThemeConfig {
  syncWithSystem: boolean;
  useNativeWindowTheme: boolean;
  themeStoreKey: string;
}

// Theme registry configuration
export interface ThemeRegistryConfig {
  defaultTheme: string;
  autoDetectSystem: boolean;
  persistTheme: boolean;
  tauriIntegration: TauriThemeConfig;
  accessibility: {
    enforceCompliance: boolean;
    validateContrast: boolean;
  };
}

// Theme state for context
export interface ThemeState {
  currentTheme: string;
  effectiveTheme: string;
  systemTheme: SystemThemeInfo;
  isAuto: boolean;
  isLoading: boolean;
  accessibility: AccessibilityConfig;
}

// Theme context value
export interface ThemeContextValue extends ThemeState {
  setTheme: (theme: string) => Promise<void>;
  setAuto: (enabled: boolean) => Promise<void>;
  updateAccessibility: (config: Partial<AccessibilityConfig>) => Promise<void>;
  availableThemes: ThemeVariant[];
  getThemeConfig: (name: string) => ThemeVariant | null;
}

// Theme registry methods
export interface ThemeRegistry {
  initialize: () => Promise<void>;
  setTheme: (theme: string, persist?: boolean) => Promise<void>;
  getCurrentTheme: () => string;
  getEffectiveTheme: () => string;
  getSystemTheme: () => SystemThemeInfo;
  listThemes: () => ThemeVariant[];
  validateTheme: (theme: ThemeVariant) => boolean;
  applyThemeToDOM: (theme: ThemeVariant) => void;
  syncWithSystem: (enabled: boolean) => Promise<void>;
  loadPersistedTheme: () => Promise<string | null>;
  saveThemePreference: (theme: string) => Promise<void>;
}

// Event types for theme system
export interface ThemeChangeEvent {
  previousTheme: string;
  newTheme: string;
  isSystemChange: boolean;
  timestamp: number;
}

// Theme validation result
export interface ThemeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  contrastRatio?: number;
}

// Tauri theme plugin types (for future integration)
export interface TauriThemePlugin {
  getTheme: () => Promise<string>;
  setTheme: (theme: string) => Promise<void>;
  onThemeChanged: (callback: (theme: string) => void) => void;
}