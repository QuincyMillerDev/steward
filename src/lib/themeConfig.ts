// Centralized theme configuration for Steward AI assistant
// Modular DRY approach with theme definitions and utilities

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
    name: 'dark-grayscale',
    label: 'Dark Grayscale',
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
    cssClass: 'theme-dark-grayscale',
  },
  {
    name: 'warm-charcoal',
    label: 'Warm Charcoal',
    colors: {
      primary: '#1c1917',
      secondary: '#292524',
      accent: '#d97706',
      text: '#fafaf9',
      textSecondary: '#a8a29e',
      border: '#44403c',
      red: '#ef4444',
      redHover: '#dc2626',
    },
    cssClass: 'theme-warm-charcoal',
  },
  {
    name: 'deep-blue',
    label: 'Deep Blue',
    colors: {
      primary: '#0f172a',
      secondary: '#1e293b',
      accent: '#3b82f6',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      red: '#ef4444',
      redHover: '#dc2626',
    },
    cssClass: 'theme-deep-blue',
  },
  {
    name: 'forest-green',
    label: 'Forest Green',
    colors: {
      primary: '#064e3b',
      secondary: '#065f46',
      accent: '#10b981',
      text: '#ecfdf5',
      textSecondary: '#6ee7b7',
      border: '#047857',
      red: '#ef4444',
      redHover: '#dc2626',
    },
    cssClass: 'theme-forest-green',
  },
  {
    name: 'midnight-purple',
    label: 'Midnight Purple',
    colors: {
      primary: '#581c87',
      secondary: '#6b21a8',
      accent: '#a855f7',
      text: '#faf5ff',
      textSecondary: '#c4b5fd',
      border: '#7c3aed',
      red: '#ef4444',
      redHover: '#dc2626',
    },
    cssClass: 'theme-midnight-purple',
  },
  {
    name: 'coffee-brown',
    label: 'Coffee Brown',
    colors: {
      primary: '#451a03',
      secondary: '#78350f',
      accent: '#f97316',
      text: '#fffbeb',
      textSecondary: '#fcd34d',
      border: '#92400e',
      red: '#ef4444',
      redHover: '#dc2626',
    },
    cssClass: 'theme-coffee-brown',
  },
  {
    name: 'ocean-teal',
    label: 'Ocean Teal',
    colors: {
      primary: '#042f2e',
      secondary: '#134e4a',
      accent: '#2dd4bf',
      text: '#f0fdfa',
      textSecondary: '#5eead4',
      border: '#115e59',
      red: '#ef4444',
      redHover: '#dc2626',
    },
    cssClass: 'theme-ocean-teal',
  },
  {
    name: 'light-mode',
    label: 'Light Mode',
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
    cssClass: 'theme-light-mode',
  },
];

export const autoTheme = {
  name: 'auto',
  label: 'Auto (System)',
  cssClass: 'theme-auto',
};

export const allThemes = [...themeConfigs, autoTheme];

export type ThemeName = typeof allThemes[number]['name'];

// Utility to get theme config by name
export const getThemeConfig = (name: ThemeName): ThemeConfig | null => {
  return themeConfigs.find(theme => theme.name === name) || null;
};

// Utility to apply theme CSS variables to element
export const applyThemeVariables = (element: HTMLElement, themeConfig: ThemeConfig): void => {
  const colors = themeConfig.colors;
  element.style.setProperty('--color-primary', colors.primary);
  element.style.setProperty('--color-secondary', colors.secondary);
  element.style.setProperty('--color-accent', colors.accent);
  element.style.setProperty('--color-text', colors.text);
  element.style.setProperty('--color-text-secondary', colors.textSecondary);
  element.style.setProperty('--color-border', colors.border);
  element.style.setProperty('--color-red', colors.red);
  element.style.setProperty('--color-red-hover', colors.redHover);
};

// Utility to get system theme
export const getSystemTheme = (): ThemeName => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-grayscale' : 'light-mode';
};