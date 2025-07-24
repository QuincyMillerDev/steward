// Main Zustand store for Steward application state management
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { AppState, DEFAULT_STATE } from './types';
import { persistenceService } from './persistence';
import { windowSync } from './windowSync';

// Create the main Zustand store with middleware
export const useAppStore = create<AppState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    ...DEFAULT_STATE,

    // Settings actions
    setTheme: (theme) => {
      set({ theme, pendingChanges: true });
      // Emit event for cross-window sync
      windowSync.emitStateUpdate({
        type: 'theme_change',
        payload: { theme },
        timestamp: Date.now(),
      });
    },

    updatePreference: (key, value) => {
      const currentPreferences = get().preferences;
      const newPreferences = { ...currentPreferences, [key]: value };
      set({ 
        preferences: newPreferences, 
        pendingChanges: true 
      });
    },

    setKeybind: (combination, command) => {
      const currentKeybinds = get().keybinds;
      const newKeybinds = { ...currentKeybinds, [combination]: command };
      set({ 
        keybinds: newKeybinds, 
        pendingChanges: true 
      });
    },

    removeKeybind: (combination) => {
      const currentKeybinds = get().keybinds;
      const newKeybinds = { ...currentKeybinds };
      delete newKeybinds[combination];
      set({ 
        keybinds: newKeybinds, 
        pendingChanges: true 
      });
    },

    // UI state actions
    setPendingChanges: (pending) => set({ pendingChanges: pending }),

    setLoading: (loading) => set({ isLoading: loading }),

    addError: (error) => {
      const currentErrors = get().errors;
      set({ errors: [...currentErrors, error] });
      // Auto-clear error after 5 seconds
      setTimeout(() => {
        const errors = get().errors;
        const index = errors.indexOf(error);
        if (index > -1) {
          set({ errors: errors.filter((_, i) => i !== index) });
        }
      }, 5000);
    },

    clearErrors: () => set({ errors: [] }),

    // Agent actions
    setAgentStatus: (status) => {
      set({ status });
      // Emit event for cross-window sync
      windowSync.emitStateUpdate({
        type: 'agent_status_change',
        payload: { status },
        timestamp: Date.now(),
      });
      // Persist agent status immediately for session recovery
      persistenceService.saveAgentStatus(status);
    },

    setAgentMode: (mode) => set({ mode }),

    setListening: (listening) => set({ isListening: listening }),

    setCurrentTask: (task) => set({ currentTask: task }),

    // Persistence actions
    saveSettings: async () => {
      const state = get();
      try {
        set({ isLoading: true });
        
        await persistenceService.saveSettings({
          theme: state.theme,
          preferences: state.preferences,
          keybinds: state.keybinds,
        });

        set({ 
          pendingChanges: false, 
          isLoading: false,
          lastSaved: new Date()
        });

        // Emit full state sync after successful save
        windowSync.emitStateUpdate({
          type: 'settings_change',
          payload: {
            theme: state.theme,
            preferences: state.preferences,
            keybinds: state.keybinds,
            pendingChanges: false,
            lastSaved: new Date()
          },
          timestamp: Date.now(),
        });

      } catch (error) {
        set({ isLoading: false });
        get().addError(`Failed to save settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error('Save settings error:', error);
      }
    },

    loadSettings: async () => {
      try {
        set({ isLoading: true });
        
        const settings = await persistenceService.loadSettings();
        const agentStatus = await persistenceService.loadAgentStatus();
        
        set({
          ...settings,
          status: agentStatus,
          isLoading: false,
          pendingChanges: false,
        });

      } catch (error) {
        set({ isLoading: false });
        get().addError(`Failed to load settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error('Load settings error:', error);
      }
    },

    resetSettings: () => {
      set({
        theme: DEFAULT_STATE.theme,
        preferences: DEFAULT_STATE.preferences,
        keybinds: DEFAULT_STATE.keybinds,
        pendingChanges: true,
      });
    },

    resetChanges: async () => {
      try {
        set({ isLoading: true });
        await get().loadSettings();
      } catch (error) {
        get().addError(`Failed to reset changes: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
  }))
);

// Initialize the store
let isInitialized = false;

export const initializeStore = async () => {
  if (isInitialized) return;
  
  try {
    // Load initial settings
    await useAppStore.getState().loadSettings();
    
    // Setup cross-window communication
    windowSync.initialize(useAppStore);
    
    isInitialized = true;
    console.log('Store initialized successfully');
  } catch (error) {
    console.error('Failed to initialize store:', error);
    useAppStore.getState().addError('Failed to initialize application state');
  }
};

// Selector hooks for common state access patterns
export const useTheme = () => useAppStore((state) => state.theme);
export const usePreferences = () => useAppStore((state) => state.preferences);
export const useKeybinds = () => useAppStore((state) => state.keybinds);
export const useAgentStatus = () => useAppStore((state) => state.status);
export const useAgentMode = () => useAppStore((state) => state.mode);
export const useIsListening = () => useAppStore((state) => state.isListening);
export const usePendingChanges = () => useAppStore((state) => state.pendingChanges);
export const useIsLoading = () => useAppStore((state) => state.isLoading);
export const useErrors = () => useAppStore((state) => state.errors);

// Action hooks for better organization
export const useSettingsActions = () => useAppStore((state) => ({
  setTheme: state.setTheme,
  updatePreference: state.updatePreference,
  setKeybind: state.setKeybind,
  removeKeybind: state.removeKeybind,
  saveSettings: state.saveSettings,
  resetSettings: state.resetSettings,
  resetChanges: state.resetChanges,
}));

export const useAgentActions = () => useAppStore((state) => ({
  setAgentStatus: state.setAgentStatus,
  setAgentMode: state.setAgentMode,
  setListening: state.setListening,
  setCurrentTask: state.setCurrentTask,
}));

export const useUIActions = () => useAppStore((state) => ({
  setPendingChanges: state.setPendingChanges,
  setLoading: state.setLoading,
  addError: state.addError,
  clearErrors: state.clearErrors,
}));

export default useAppStore;