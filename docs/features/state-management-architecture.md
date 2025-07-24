# State Management Architecture

---

## Overview

This document outlines the state management architecture for the Steward AI Desktop Assistant, designed to handle multi-window state synchronization, persistent user settings, and real-time UI updates.

## Architecture Stack

- **Frontend State**: Zustand (React state management)
- **Persistence**: SQLite via `tauri-plugin-sql`
- **Cross-Window Communication**: Tauri Event System
- **Pattern**: In-memory operation with batched persistence (Gemini CLI approach)

## Design Principles

1. **In-Memory First**: All state operations happen in-memory for instant UI response
2. **Batched Persistence**: Database writes are batched and debounced to avoid blocking UI
3. **Real-Time Sync**: Changes propagate instantly between windows via Tauri events
4. **Error Resilience**: Critical errors are surfaced to users via alert system
5. **Form-Based Settings**: Settings use save button pattern, not auto-save

## Database Schema

### Settings Table
```sql
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Keybinds Table  
```sql
CREATE TABLE keybinds (
  key_combination TEXT PRIMARY KEY,
  command TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Zustand Store Structure

```typescript
interface AppState {
  // Theme and UI preferences
  theme: 'light' | 'dark' | 'system';
  preferences: {
    fontSize: number;
    language: string;
    // ... other UI preferences
  };
  
  // Keybind management
  keybinds: Record<string, string>;
  
  // AI Agent state
  agentStatus: 'idle' | 'running' | 'stopped';
  agentMode: 'voice' | 'text' | 'confirmation';
  
  // UI state
  pendingChanges: boolean;
  isLoading: boolean;
  errors: string[];
  
  // Actions
  setTheme: (theme: string) => void;
  updatePreference: (key: string, value: any) => void;
  setKeybind: (combination: string, command: string) => void;
  setAgentStatus: (status: AgentStatus) => void;
  saveSettings: () => Promise<void>;
  resetChanges: () => void;
}
```

## Component Architecture

### Core Components

1. **StateProvider** (`src/store/index.ts`)
   - Root Zustand store with TypeScript interfaces
   - Handles state hydration from SQLite on startup
   - Manages batched persistence operations

2. **PersistenceService** (`src/store/persistence.ts`)
   - SQLite database operations
   - Batched write operations with debouncing
   - Error handling and retry logic

3. **WindowSync** (`src/store/windowSync.ts`)
   - Cross-window event handling
   - Real-time state synchronization
   - Window lifecycle management

4. **SettingsForm** (`src/components/forms/SettingsForm.tsx`)
   - Form wrapper with save/cancel pattern
   - Tracks pending changes
   - Validation and error display

5. **AlertSystem** (`src/components/alerts/AlertSystem.tsx`)
   - Global error notifications
   - Success confirmations
   - Critical system alerts

## State Flow

### Setting Updates
1. User modifies setting in UI
2. Zustand store updates in-memory state
3. `pendingChanges` flag set to true
4. User clicks "Save" button
5. Batch write to SQLite database
6. Emit Tauri event to sync other windows
7. `pendingChanges` flag reset to false

### Cross-Window Synchronization
1. Window A updates state and saves
2. Persistence service writes to SQLite
3. Tauri event emitted with updated state
4. Window B receives event and updates Zustand store
5. UI re-renders with new state

### Agent Status Updates
1. AI agent status changes (idle → running)
2. Zustand store updates `agentStatus`
3. Conditional UI components re-render
4. State persisted to SQLite for session recovery
5. Other windows notified via events

## Error Handling

### Database Errors
- Connection failures: Retry with exponential backoff
- Write failures: Queue operations and retry
- Schema errors: Alert user and fall back to defaults

### Cross-Window Sync Errors
- Failed events: Log and continue (non-critical)
- Window not found: Clean up stale references
- Event payload errors: Validate and reject malformed data

### UI State Errors
- Invalid settings: Show validation errors
- Save failures: Alert user and maintain pending state
- Load failures: Use defaults and notify user

## Performance Considerations

### Debouncing
- Settings persistence: 500ms debounce
- Cross-window events: 100ms debounce for rapid changes
- Agent status updates: Immediate (critical for UX)

### Memory Management
- Store only essential state in Zustand
- Clear old error messages after display
- Limit event history to prevent memory leaks

### Database Optimization
- Use transactions for batch operations
- Index frequently queried columns
- Periodic cleanup of old data

## Migration Strategy

### From Current Theme Context
1. Keep existing theme context during implementation
2. Add new Zustand store alongside
3. Migrate components one by one
4. Remove old context after full migration
5. No localStorage preservation needed (prototyping app)

## Testing Strategy

### Unit Tests
- Zustand store actions and selectors
- Persistence service operations
- Event handling logic

### Integration Tests
- Multi-window state synchronization
- Database persistence and recovery
- Error handling scenarios

### Manual Testing Scenarios
1. Theme change propagation between windows
2. Settings persistence across app restarts
3. Agent status updates during operations
4. Error recovery from database failures

## File Structure

```
src/
├── store/
│   ├── index.ts           # Main Zustand store
│   ├── persistence.ts     # SQLite operations
│   ├── windowSync.ts      # Cross-window events
│   └── types.ts           # TypeScript interfaces
├── components/
│   ├── forms/
│   │   └── SettingsForm.tsx
│   └── alerts/
│       └── AlertSystem.tsx
├── services/
│   └── database.ts        # SQLite setup and migrations
└── hooks/
    └── useSettings.ts     # Custom hooks for settings
```

## Implementation Phases

### Phase 1: Core Infrastructure (Week 1)
- [ ] SQLite setup with tauri-plugin-sql
- [ ] Basic Zustand store with TypeScript
- [ ] Database schema and migrations
- [ ] Persistence service with batching

### Phase 2: Settings Management (Week 2)  
- [ ] Form wrapper components
- [ ] Settings validation and errors
- [ ] Alert notification system
- [ ] Save button pattern implementation

### Phase 3: Cross-Window Integration (Week 3)
- [ ] Real-time theme synchronization
- [ ] State hydration on window creation
- [ ] Event listeners for all windows
- [ ] Multi-window consistency testing

### Phase 4: AI Agent State (Week 4)
- [ ] Agent status management
- [ ] Conditional UI rendering
- [ ] Confirmation dialog system
- [ ] Keybind management integration

## Success Metrics

- ✅ Theme changes sync instantly between all windows
- ✅ Settings persist across app restarts
- ✅ No UI blocking on database operations (< 16ms)
- ✅ Error alerts for critical failures
- ✅ Form-based settings with save button pattern
- ✅ Real-time agent status updates
- ✅ Zero data loss during normal operations
- ✅ Graceful degradation during database failures

## Future Enhancements

- Settings export/import functionality
- Settings versioning and rollback
- Advanced keybind management with modifiers
- Settings profiles for different use cases
- Cloud synchronization support