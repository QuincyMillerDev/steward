// Essential theme utilities for Steward application
import type { ThemeVariant, SystemThemeInfo } from './types';

// System theme detection
export function getSystemThemeInfo(): SystemThemeInfo {
  if (typeof window === 'undefined') {
    return {
      prefersDark: false,
      prefersHighContrast: false,
      prefersReducedMotion: false,
      fontScale: 1,
    };
  }

  return {
    prefersDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
    prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    fontScale: 1,
  };
}

// Contrast ratio calculation for WCAG compliance
export function calculateContrastRatio(color1: string, color2: string): number {
  // Convert hex colors to RGB
  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0];
  };

  // Calculate relative luminance
  const getLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const lum1 = getLuminance(...rgb1);
  const lum2 = getLuminance(...rgb2);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

// DOM manipulation utilities
export function applyThemeToElement(element: HTMLElement, theme: ThemeVariant): void {
  const colors = theme.colors;
  
  element.style.setProperty('--color-primary', colors.primary);
  element.style.setProperty('--color-secondary', colors.secondary);
  element.style.setProperty('--color-accent', colors.accent);
  element.style.setProperty('--color-text', colors.text);
  element.style.setProperty('--color-text-secondary', colors.textSecondary);
  element.style.setProperty('--color-border', colors.border);
  element.style.setProperty('--color-red', colors.red);
  element.style.setProperty('--color-red-hover', colors.redHover);
  
  // Apply accessibility variables
  element.style.setProperty('--font-size-base', `${theme.accessibility.minimumFontSize}px`);
  element.style.setProperty('--motion-duration', theme.accessibility.reducedMotion ? '0ms' : '200ms');
  
  element.setAttribute('data-theme', theme.name);
}

// Performance utilities
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}