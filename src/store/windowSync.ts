// Cross-window state synchronization using Tauri events
import { listen, emit } from '@tauri-apps/api/event';
import type { UnlistenFn } from '@tauri-apps/api/event';
import { StateUpdateEvent, AppState, ThemeMode, AgentStatus } from './types';

class WindowSyncService {
  private unlisten: UnlistenFn | null = null;
  private store: any = null; // Will be set during initialization
  private windowId: string;
  private eventQueue: StateUpdateEvent[] = [];
  private isProcessing = false;
  private readonly DEBOUNCE_TIME = 100; // 100ms debounce for rapid events

  constructor() {
    // Generate unique window ID
    this.windowId = `window_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  async initialize(storeInstance: any): Promise<void> {
    this.store = storeInstance;
    
    try {
      // Listen for state update events from other windows
      this.unlisten = await listen<StateUpdateEvent>('state_update', (event) => {
        this.handleStateUpdate(event.payload);
      });

      // Listen for window focus events to sync state
      this.unlisten = await listen('tauri://focus', () => {
        this.requestFullStateSync();
      });

      console.log(`Window sync initialized for window: ${this.windowId}`);
    } catch (error) {
      console.error('Failed to initialize window sync:', error);
      throw error;
    }
  }

  private handleStateUpdate(eventData: StateUpdateEvent): void {
    // Ignore events from this window to prevent loops
    if (eventData.windowId === this.windowId) {
      return;
    }

    // Add to queue for debounced processing
    this.eventQueue.push(eventData);
    this.processEventQueue();
  }

  private processEventQueue = (() => {
    let timeout: number | null = null;
    
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        if (this.isProcessing || this.eventQueue.length === 0) {
          return;
        }

        this.isProcessing = true;
        
        try {
          // Process events in chronological order
          const events = [...this.eventQueue].sort((a, b) => a.timestamp - b.timestamp);
          this.eventQueue = [];

          // Apply the latest state for each type
          const latestEvents = new Map<string, StateUpdateEvent>();
          events.forEach(event => {
            latestEvents.set(event.type, event);
          });

          // Apply updates
          latestEvents.forEach(event => {
            this.applyStateUpdate(event);
          });

        } finally {
          this.isProcessing = false;
        }
      }, this.DEBOUNCE_TIME);
    };
  })();

  private applyStateUpdate(event: StateUpdateEvent): void {
    if (!this.store) return;

    const state = this.store.getState();

    try {
      switch (event.type) {
        case 'theme_change':
          if (event.payload.theme && event.payload.theme !== state.theme) {
            const themeValue = event.payload.theme as ThemeMode;
            // Apply theme without triggering persistence or events
            this.store.setState({ theme: themeValue }, false, 'sync_theme');
            console.log(`Theme synced to: ${themeValue}`);
          }
          break;

        case 'settings_change':
          // Update settings without triggering save
          const settingsUpdate: Partial<AppState> = {};
          if (event.payload.theme !== undefined) settingsUpdate.theme = event.payload.theme;
          if (event.payload.preferences !== undefined) settingsUpdate.preferences = event.payload.preferences;
          if (event.payload.keybinds !== undefined) settingsUpdate.keybinds = event.payload.keybinds;
          if (event.payload.pendingChanges !== undefined) settingsUpdate.pendingChanges = event.payload.pendingChanges;
          if (event.payload.lastSaved !== undefined) settingsUpdate.lastSaved = event.payload.lastSaved;
          
          if (Object.keys(settingsUpdate).length > 0) {
            this.store.setState(settingsUpdate, false, 'sync_settings');
            console.log('Settings synced from another window');
          }
          break;

        case 'agent_status_change':
          if (event.payload.status && event.payload.status !== state.status) {
            const statusValue = event.payload.status as AgentStatus;
            this.store.setState({ status: statusValue }, false, 'sync_agent_status');
            console.log(`Agent status synced to: ${statusValue}`);
          }
          break;

        case 'full_state_sync':
          // Apply full state update (used for major sync operations)
          const filteredPayload = { ...event.payload };
          // Remove functions from payload to avoid issues
          Object.keys(filteredPayload).forEach(key => {
            if (typeof filteredPayload[key as keyof typeof filteredPayload] === 'function') {
              delete filteredPayload[key as keyof typeof filteredPayload];
            }
          });
          
          this.store.setState(filteredPayload, false, 'sync_full_state');
          console.log('Full state synced from another window');
          break;

        default:
          console.warn(`Unknown event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Failed to apply state update:', error);
    }
  }

  async emitStateUpdate(event: Omit<StateUpdateEvent, 'windowId'>): Promise<void> {
    try {
      const eventData: StateUpdateEvent = {
        ...event,
        windowId: this.windowId,
      };

      await emit('state_update', eventData);
    } catch (error) {
      console.error('Failed to emit state update:', error);
      // Don't throw here to avoid blocking the UI
    }
  }

  private async requestFullStateSync(): Promise<void> {
    try {
      await emit('request_state_sync', { 
        requesterId: this.windowId,
        timestamp: Date.now() 
      });
    } catch (error) {
      console.error('Failed to request state sync:', error);
    }
  }

  // Method to respond to state sync requests from other windows
  async respondToSyncRequest(): Promise<void> {
    if (!this.store) return;

    try {
      const currentState = this.store.getState();
      
      // Send current state to requesting window
      await this.emitStateUpdate({
        type: 'full_state_sync',
        payload: {
          theme: currentState.theme,
          preferences: currentState.preferences,
          keybinds: currentState.keybinds,
          status: currentState.status,
          pendingChanges: currentState.pendingChanges,
          lastSaved: currentState.lastSaved,
        },
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Failed to respond to sync request:', error);
    }
  }

  // Sync theme changes specifically (most common operation)
  async syncTheme(theme: ThemeMode): Promise<void> {
    await this.emitStateUpdate({
      type: 'theme_change',
      payload: { theme },
      timestamp: Date.now(),
    });
  }

  // Sync agent status changes
  async syncAgentStatus(status: AgentStatus): Promise<void> {
    await this.emitStateUpdate({
      type: 'agent_status_change',
      payload: { status },
      timestamp: Date.now(),
    });
  }

  // Method to manually trigger a full state broadcast
  async broadcastCurrentState(): Promise<void> {
    if (!this.store) return;

    const state = this.store.getState();
    await this.emitStateUpdate({
      type: 'full_state_sync',
      payload: {
        theme: state.theme,
        preferences: state.preferences,
        keybinds: state.keybinds,
        status: state.status,
        mode: state.mode,
        pendingChanges: state.pendingChanges,
        lastSaved: state.lastSaved,
      },
      timestamp: Date.now(),
    });
  }

  async destroy(): Promise<void> {
    if (this.unlisten) {
      this.unlisten();
      this.unlisten = null;
    }
    this.store = null;
    this.eventQueue = [];
    console.log(`Window sync destroyed for window: ${this.windowId}`);
  }

  // Get current window ID for debugging
  getWindowId(): string {
    return this.windowId;
  }

  // Check if sync is active
  isActive(): boolean {
    return this.unlisten !== null && this.store !== null;
  }
}

// Export singleton instance
export const windowSync = new WindowSyncService();