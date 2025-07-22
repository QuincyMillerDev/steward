// Centralized ThemeRegistry for DRY theme management across Steward application
import type {
  ThemeRegistry,
  ThemeVariant,
  SystemThemeInfo,
  ThemeChangeEvent,
  TauriThemePlugin,
} from './types';
import { themeVariants, allThemes, registryConfig, cssVariableNames } from './constants';
import { 
  calculateContrastRatio, 
  applyThemeToElement,
  getSystemThemeInfo,
  debounce 
} from './utils';

class ThemeRegistryImpl implements ThemeRegistry {
  private currentTheme: string = registryConfig.defaultTheme;
  private effectiveTheme: string = registryConfig.defaultTheme;
  private isAuto: boolean = registryConfig.defaultTheme === 'auto';
  private systemTheme: SystemThemeInfo = getSystemThemeInfo();
  private listeners: Set<(event: ThemeChangeEvent) => void> = new Set();
  private tauriPlugin: TauriThemePlugin | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize Tauri plugin if available
      if (typeof window !== 'undefined' && (window as any).__TAURI__) {
        await this.initializeTauriPlugin();
      }

      // Load persisted theme preference
      const persistedTheme = await this.loadPersistedTheme();
      if (persistedTheme) {
        this.currentTheme = persistedTheme;
        this.isAuto = persistedTheme === 'auto';
      }

      // Initialize system theme detection
      this.initializeSystemThemeDetection();

      // Calculate effective theme
      this.effectiveTheme = this.calculateEffectiveTheme();

      // Apply initial theme
      await this.applyCurrentTheme();

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize ThemeRegistry:', error);
      throw error;
    }
  }

  private async initializeTauriPlugin(): Promise<void> {
    // Tauri integration disabled for now - using DOM-based theming
    // This can be enabled later when Tauri plugins are properly configured
    console.log('Using DOM-based theming (Tauri integration available but not active)');
  }

  private initializeSystemThemeDetection(): void {
    if (typeof window === 'undefined') return;

    const updateSystemTheme = () => {
      this.systemTheme = getSystemThemeInfo();
      if (this.isAuto) {
        this.effectiveTheme = this.calculateEffectiveTheme();
        this.applyThemeToDOM();
      }
    };

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', debounce(updateSystemTheme, 100));

    // Listen for high contrast preference changes
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    highContrastQuery.addEventListener('change', debounce(updateSystemTheme, 100));

    // Listen for reduced motion preference changes
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionQuery.addEventListener('change', debounce(updateSystemTheme, 100));
  }

  async setTheme(theme: string, persist: boolean = true): Promise<void> {
    if (!this.validateThemeByName(theme)) {
      throw new Error(`Invalid theme: ${theme}`);
    }

    const previousTheme = this.currentTheme;
    this.currentTheme = theme;
    this.isAuto = theme === 'auto';
    this.effectiveTheme = this.calculateEffectiveTheme();

    await this.applyCurrentTheme();

    if (persist) {
      await this.saveThemePreference(theme);
    }

    // Notify listeners
    this.notifyListeners({
      previousTheme,
      newTheme: this.effectiveTheme,
      isSystemChange: false,
      timestamp: Date.now(),
    });
  }

  async setAuto(enabled: boolean): Promise<void> {
    if (enabled !== this.isAuto) {
      if (enabled) {
        await this.setTheme('auto');
      } else {
        // Switch to system-detected theme when disabling auto
        const systemTheme = this.systemTheme.prefersDark ? 'dark-grayscale' : 'light-mode';
        await this.setTheme(systemTheme);
      }
    }
  }

  getCurrentTheme(): string {
    return this.currentTheme;
  }

  getEffectiveTheme(): string {
    return this.effectiveTheme;
  }

  getSystemTheme(): SystemThemeInfo {
    return this.systemTheme;
  }

  listThemes(): ThemeVariant[] {
    return themeVariants;
  }

  getThemeConfig(name: string): ThemeVariant | null {
    return themeVariants.find(theme => theme.name === name) || null;
  }

  validateTheme(theme: ThemeVariant): boolean {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate required properties
    if (!theme.name || !theme.label || !theme.colors) {
      errors.push('Theme missing required properties');
    }

    // Validate colors
    const requiredColors = Object.keys(cssVariableNames).filter(key => key !== 'fontSizeBase' && key !== 'contrastRatio' && key !== 'motionDuration');
    for (const colorKey of requiredColors) {
      if (!theme.colors[colorKey as keyof typeof theme.colors]) {
        errors.push(`Missing color: ${colorKey}`);
      }
    }

    // Validate contrast ratios
    const contrastRatio = calculateContrastRatio(theme.colors.text, theme.colors.primary);
    if (theme.accessibility.wcagCompliance === 'AA' && contrastRatio < 4.5) {
      warnings.push(`Contrast ratio ${contrastRatio.toFixed(2)} below AA standard (4.5:1)`);
    } else if (theme.accessibility.wcagCompliance === 'AAA' && contrastRatio < 7) {
      warnings.push(`Contrast ratio ${contrastRatio.toFixed(2)} below AAA standard (7:1)`);
    }

    return errors.length === 0;
  }

  validateThemeByName(name: string): boolean {
    return allThemes.some(theme => theme.name === name);
  }

  applyThemeToDOM(theme?: ThemeVariant): void {
    if (typeof document === 'undefined') return;

    const themeConfig = theme || this.getThemeConfig(this.effectiveTheme);
    if (!themeConfig) return;

    // Apply theme to document element
    applyThemeToElement(document.documentElement, themeConfig);

    // Update CSS custom properties for accessibility
    document.documentElement.style.setProperty(
      cssVariableNames.fontSizeBase,
      `${themeConfig.accessibility.minimumFontSize}px`
    );
    document.documentElement.style.setProperty(
      cssVariableNames.motionDuration,
      themeConfig.accessibility.reducedMotion ? '0ms' : '200ms'
    );

    // Apply Tauri theme if available
    if (this.tauriPlugin && registryConfig.tauriIntegration.syncWithSystem) {
      this.tauriPlugin.setTheme(this.effectiveTheme).catch(console.warn);
    }
  }

  async syncWithSystem(enabled: boolean): Promise<void> {
    registryConfig.tauriIntegration.syncWithSystem = enabled;
    registryConfig.autoDetectSystem = enabled;

    if (enabled) {
      // Update to current system theme
      this.systemTheme = getSystemThemeInfo();
      if (this.isAuto) {
        this.effectiveTheme = this.calculateEffectiveTheme();
        await this.applyCurrentTheme();
      }
    }
  }

  async loadPersistedTheme(): Promise<string | null> {
    if (typeof localStorage === 'undefined') return null;

    try {
      const persisted = localStorage.getItem(registryConfig.tauriIntegration.themeStoreKey);
      return persisted && this.validateThemeByName(persisted) ? persisted : null;
    } catch (error) {
      console.warn('Failed to load persisted theme:', error);
      return null;
    }
  }

  async saveThemePreference(theme: string): Promise<void> {
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.setItem(registryConfig.tauriIntegration.themeStoreKey, theme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }

  private calculateEffectiveTheme(): string {
    if (this.isAuto) {
      const systemThemeName = this.systemTheme.prefersHighContrast
        ? (this.systemTheme.prefersDark ? 'dark-grayscale-hc' : 'light-mode-hc')
        : (this.systemTheme.prefersDark ? 'dark-grayscale' : 'light-mode');
      return systemThemeName;
    }
    return this.currentTheme;
  }

  private async applyCurrentTheme(): Promise<void> {
    this.applyThemeToDOM();
  }

  private notifyListeners(event: ThemeChangeEvent): void {
    this.listeners.forEach(listener => listener(event));
  }

  addThemeChangeListener(callback: (event: ThemeChangeEvent) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  removeThemeChangeListener(callback: (event: ThemeChangeEvent) => void): void {
    this.listeners.delete(callback);
  }
}

// Singleton instance
export const themeRegistry = new ThemeRegistryImpl();

// Convenience exports
export const {
  initialize,
  setTheme,
  getCurrentTheme,
  getEffectiveTheme,
  getSystemTheme,
  listThemes,
  getThemeConfig,
  validateTheme,
  applyThemeToDOM,
  syncWithSystem,
  loadPersistedTheme,
  saveThemePreference,
  addThemeChangeListener,
  removeThemeChangeListener,
} = themeRegistry;