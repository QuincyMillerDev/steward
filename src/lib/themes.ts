// System-based theme configuration for Steward AI assistant
// Provides 3 options: System default, Light, Dark

export interface ThemeConfig {
  name: string;
  label: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
    border: string;
    red: string;
    redHover: string;
  };
  cssClass: string;
}

export const themeConfigs: ThemeConfig[] = [
  {
    name: 'dark',
    label: 'Dark',
    colors: {
      primary: '#171717',
      secondary: '#262626',
      accent: '#525252',
      text: '#f5f5f5',
      textSecondary: '#a3a3a3',
      border: '#404040',
      red: '#ef4444',
      redHover: '#dc2626',
    },
    cssClass: 'theme-dark',
  },
  {
    name: 'light',
    label: 'Light',
    colors: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      accent: '#2563eb',
      text: '#111827',
      textSecondary: '#4b5563',
      border: '#e5e7eb',
      red: '#ef4444',
      redHover: '#dc2626',
    },
    cssClass: 'theme-light',
  },
];

export const systemTheme = {
  name: 'system',
  label: 'System default',
  cssClass: 'theme-system',
};

export const allThemes = [...themeConfigs, systemTheme];

export type ThemeName = typeof allThemes[number]['name'];

// Utility to get theme config by name
export const getThemeConfig = (name: ThemeName): ThemeConfig | null => {
  return themeConfigs.find(theme => theme.name === name) || null;
};

// Utility to get current system theme
export const getSystemTheme = (): 'dark' | 'light' => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Utility to get effective theme based on selection
export const getEffectiveTheme = (selectedTheme: ThemeName): 'dark' | 'light' => {
  if (selectedTheme === 'system') {
    return getSystemTheme();
  }
  return selectedTheme as 'dark' | 'light';
};

// Utility to apply theme CSS variables based on selection
export const applyThemeVariables = (element: HTMLElement, themeName: ThemeName): void => {
  const effectiveTheme = getEffectiveTheme(themeName);
  const themeConfig = themeConfigs.find(theme => theme.name === effectiveTheme);
  
  if (themeConfig) {
    const colors = themeConfig.colors;
    element.style.setProperty('--color-primary', colors.primary);
    element.style.setProperty('--color-secondary', colors.secondary);
    element.style.setProperty('--color-accent', colors.accent);
    element.style.setProperty('--color-text', colors.text);
    element.style.setProperty('--color-text-secondary', colors.textSecondary);
    element.style.setProperty('--color-border', colors.border);
    element.style.setProperty('--color-red', colors.red);
    element.style.setProperty('--color-red-hover', colors.redHover);
  }
};

// Apply theme to document element
export const applyTheme = (themeName: ThemeName): void => {
  applyThemeVariables(document.documentElement, themeName);
  document.documentElement.setAttribute('data-theme', themeName);
};