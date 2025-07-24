// TypeScript interfaces for the Steward state management system

export type ThemeMode = 'system' | 'light' | 'dark';

export type AgentStatus = 'idle' | 'running' | 'stopped';

export type AgentMode = 'voice' | 'text' | 'confirmation';

export interface AppPreferences {
  fontSize: number;
  language: string;
  notifications: boolean;
  autoSave: boolean;
  confirmRiskyActions: boolean;
}

export interface AppSettings {
  theme: ThemeMode;
  preferences: AppPreferences;
  keybinds: Record<string, string>;
}

export interface AppUIState {
  pendingChanges: boolean;
  isLoading: boolean;
  errors: string[];
  lastSaved?: Date;
}

export interface AppAgentState {
  status: AgentStatus;
  mode: AgentMode;
  isListening: boolean;
  currentTask?: string;
}

// Main application state interface
export interface AppState extends AppSettings, AppUIState, AppAgentState {
  // Settings actions
  setTheme: (theme: ThemeMode) => void;
  updatePreference: <K extends keyof AppPreferences>(key: K, value: AppPreferences[K]) => void;
  setKeybind: (combination: string, command: string) => void;
  removeKeybind: (combination: string) => void;
  
  // UI state actions
  setPendingChanges: (pending: boolean) => void;
  setLoading: (loading: boolean) => void;
  addError: (error: string) => void;
  clearErrors: () => void;
  
  // Agent actions
  setAgentStatus: (status: AgentStatus) => void;
  setAgentMode: (mode: AgentMode) => void;
  setListening: (listening: boolean) => void;
  setCurrentTask: (task?: string) => void;
  
  // Persistence actions
  saveSettings: () => Promise<void>;
  loadSettings: () => Promise<void>;
  resetSettings: () => void;
  resetChanges: () => void;
}

// Event payloads for cross-window communication
export interface StateUpdateEvent {
  type: 'theme_change' | 'settings_change' | 'agent_status_change' | 'full_state_sync';
  payload: Partial<AppState>;
  timestamp: number;
  windowId?: string;
}

// Database entities
export interface SettingsEntity {
  key: string;
  value: string;
  updated_at: string;
}

export interface KeybindEntity {
  key_combination: string;
  command: string;
  created_at: string;
}

// Default values
export const DEFAULT_PREFERENCES: AppPreferences = {
  fontSize: 14,
  language: 'en',
  notifications: true,
  autoSave: false,
  confirmRiskyActions: true,
};

export const DEFAULT_STATE: Omit<AppState, 'setTheme' | 'updatePreference' | 'setKeybind' | 'removeKeybind' | 'setPendingChanges' | 'setLoading' | 'addError' | 'clearErrors' | 'setAgentStatus' | 'setAgentMode' | 'setListening' | 'setCurrentTask' | 'saveSettings' | 'loadSettings' | 'resetSettings' | 'resetChanges'> = {
  theme: 'system',
  preferences: DEFAULT_PREFERENCES,
  keybinds: {},
  pendingChanges: false,
  isLoading: false,
  errors: [],
  status: 'idle',
  mode: 'voice',
  isListening: false,
};