// Centralized theme definitions with accessibility compliance and elderly-focused design
import type { ThemeVariant, AccessibilityConfig, ThemeColors } from './types';

// Accessibility configurations
const accessibilityConfigs = {
  standard: {
    wcagCompliance: 'AA' as const,
    minimumFontSize: 16,
    highContrast: false,
    reducedMotion: false,
  },
  highContrast: {
    wcagCompliance: 'AAA' as const,
    minimumFontSize: 18,
    highContrast: true,
    reducedMotion: false,
  },
  elderly: {
    wcagCompliance: 'AAA' as const,
    minimumFontSize: 20,
    highContrast: true,
    reducedMotion: true,
  },
};

// Base color palettes optimized for accessibility
const baseColors: Record<string, ThemeColors> = {
  darkGrayscale: {
    primary: '#171717',
    secondary: '#262626',
    accent: '#525252',
    text: '#f5f5f5',
    textSecondary: '#a3a3a3',
    border: '#404040',
    red: '#ef4444',
    redHover: '#dc2626',
  },
  warmCharcoal: {
    primary: '#1c1917',
    secondary: '#292524',
    accent: '#d97706',
    text: '#fafaf9',
    textSecondary: '#a8a29e',
    border: '#44403c',
    red: '#ef4444',
    redHover: '#dc2626',
  },
  deepBlue: {
    primary: '#0f172a',
    secondary: '#1e293b',
    accent: '#3b82f6',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#334155',
    red: '#ef4444',
    redHover: '#dc2626',
  },
  forestGreen: {
    primary: '#064e3b',
    secondary: '#065f46',
    accent: '#10b981',
    text: '#ecfdf5',
    textSecondary: '#6ee7b7',
    border: '#047857',
    red: '#ef4444',
    redHover: '#dc2626',
  },
  midnightPurple: {
    primary: '#581c87',
    secondary: '#6b21a8',
    accent: '#a855f7',
    text: '#faf5ff',
    textSecondary: '#c4b5fd',
    border: '#7c3aed',
    red: '#ef4444',
    redHover: '#dc2626',
  },
  coffeeBrown: {
    primary: '#451a03',
    secondary: '#78350f',
    accent: '#f97316',
    text: '#fffbeb',
    textSecondary: '#fcd34d',
    border: '#92400e',
    red: '#ef4444',
    redHover: '#dc2626',
  },
  oceanTeal: {
    primary: '#042f2e',
    secondary: '#134e4a',
    accent: '#2dd4bf',
    text: '#f0fdfa',
    textSecondary: '#5eead4',
    border: '#115e59',
    red: '#ef4444',
    redHover: '#dc2626',
  },
  lightMode: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    accent: '#2563eb',
    text: '#111827',
    textSecondary: '#4b5563',
    border: '#e5e7eb',
    red: '#ef4444',
    redHover: '#dc2626',
  },
};

// High contrast variants for accessibility
const highContrastColors: Record<string, ThemeColors> = {
  darkGrayscale: {
    primary: '#000000',
    secondary: '#1a1a1a',
    accent: '#ffffff',
    text: '#ffffff',
    textSecondary: '#cccccc',
    border: '#666666',
    red: '#ff0000',
    redHover: '#cc0000',
  },
  lightMode: {
    primary: '#ffffff',
    secondary: '#f5f5f5',
    accent: '#000000',
    text: '#000000',
    textSecondary: '#333333',
    border: '#666666',
    red: '#cc0000',
    redHover: '#990000',
  },
};

// Theme variants with accessibility configurations
export const themeVariants: ThemeVariant[] = [
  {
    name: 'dark-grayscale',
    label: 'Dark Grayscale',
    colors: baseColors.darkGrayscale,
    accessibility: accessibilityConfigs.standard,
    cssClass: 'theme-dark-grayscale',
  },
  {
    name: 'warm-charcoal',
    label: 'Warm Charcoal',
    colors: baseColors.warmCharcoal,
    accessibility: accessibilityConfigs.standard,
    cssClass: 'theme-warm-charcoal',
  },
  {
    name: 'deep-blue',
    label: 'Deep Blue',
    colors: baseColors.deepBlue,
    accessibility: accessibilityConfigs.standard,
    cssClass: 'theme-deep-blue',
  },
  {
    name: 'forest-green',
    label: 'Forest Green',
    colors: baseColors.forestGreen,
    accessibility: accessibilityConfigs.standard,
    cssClass: 'theme-forest-green',
  },
  {
    name: 'midnight-purple',
    label: 'Midnight Purple',
    colors: baseColors.midnightPurple,
    accessibility: accessibilityConfigs.standard,
    cssClass: 'theme-midnight-purple',
  },
  {
    name: 'coffee-brown',
    label: 'Coffee Brown',
    colors: baseColors.coffeeBrown,
    accessibility: accessibilityConfigs.standard,
    cssClass: 'theme-coffee-brown',
  },
  {
    name: 'ocean-teal',
    label: 'Ocean Teal',
    colors: baseColors.oceanTeal,
    accessibility: accessibilityConfigs.standard,
    cssClass: 'theme-ocean-teal',
  },
  {
    name: 'light-mode',
    label: 'Light Mode',
    colors: baseColors.lightMode,
    accessibility: accessibilityConfigs.standard,
    cssClass: 'theme-light-mode',
  },
  {
    name: 'dark-grayscale-hc',
    label: 'Dark Grayscale (High Contrast)',
    colors: highContrastColors.darkGrayscale,
    accessibility: accessibilityConfigs.highContrast,
    cssClass: 'theme-dark-grayscale-hc',
  },
  {
    name: 'light-mode-hc',
    label: 'Light Mode (High Contrast)',
    colors: highContrastColors.lightMode,
    accessibility: accessibilityConfigs.highContrast,
    cssClass: 'theme-light-mode-hc',
  },
  {
    name: 'elderly-friendly',
    label: 'Elderly Friendly',
    colors: highContrastColors.lightMode,
    accessibility: accessibilityConfigs.elderly,
    cssClass: 'theme-elderly-friendly',
  },
];

// Auto theme configuration
export const autoTheme = {
  name: 'auto',
  label: 'Auto (System)',
  cssClass: 'theme-auto',
};

// All available themes including auto
export const allThemes = [...themeVariants, autoTheme];

// Theme registry configuration
export const registryConfig = {
  defaultTheme: 'auto',
  autoDetectSystem: true,
  persistTheme: true,
  tauriIntegration: {
    syncWithSystem: true,
    useNativeWindowTheme: true,
    themeStoreKey: 'steward-theme-preference',
  },
  accessibility: {
    enforceCompliance: true,
    validateContrast: true,
  },
};

// CSS variable names for theme application
export const cssVariableNames = {
  primary: '--color-primary',
  secondary: '--color-secondary',
  accent: '--color-accent',
  text: '--color-text',
  textSecondary: '--color-text-secondary',
  border: '--color-border',
  red: '--color-red',
  redHover: '--color-red-hover',
  fontSizeBase: '--font-size-base',
  contrastRatio: '--contrast-ratio',
  motionDuration: '--motion-duration',
} as const;