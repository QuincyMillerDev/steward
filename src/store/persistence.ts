// Persistence service for SQLite database operations with batching support
import Database from '@tauri-apps/plugin-sql';
import { AppSettings, AgentStatus, DEFAULT_STATE, DEFAULT_PREFERENCES } from './types';

class PersistenceService {
  private db: Database | null = null;
  private pendingWrites: Map<string, any> = new Map();
  private writeTimeout: number | null = null;
  private readonly BATCH_DELAY = 500; // 500ms debounce for batched writes

  async initialize(): Promise<void> {
    try {
      console.log('Attempting to load database with path: sqlite:steward.db');
      this.db = await Database.load('sqlite:steward.db');
      console.log('Database connected successfully');
      
      // Test the connection with a simple query
      if (this.db) {
        try {
          await this.db.execute('SELECT 1');
          console.log('Database connection test successful');
        } catch (testError) {
          console.error('Database connection test failed:', testError);
        }
      }
    } catch (error) {
      console.error('Failed to connect to database:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      }
      throw new Error(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async ensureConnection(): Promise<Database> {
    if (!this.db) {
      await this.initialize();
    }
    if (!this.db) {
      throw new Error('Database connection not available');
    }
    return this.db;
  }

  private scheduleBatchWrite(): void {
    if (this.writeTimeout) {
      clearTimeout(this.writeTimeout);
    }

    this.writeTimeout = setTimeout(async () => {
      await this.flushPendingWrites();
    }, this.BATCH_DELAY);
  }

  private async flushPendingWrites(): Promise<void> {
    if (this.pendingWrites.size === 0) return;

    const db = await this.ensureConnection();
    const writes = Array.from(this.pendingWrites.entries());
    this.pendingWrites.clear();

    try {
      // Use a transaction for batch operations
      await db.execute('BEGIN TRANSACTION');

      for (const [key, value] of writes) {
        await db.execute(
          'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
          [key, JSON.stringify(value)]
        );
      }

      await db.execute('COMMIT');
      console.log(`Batch saved ${writes.length} settings to database`);
    } catch (error) {
      await db.execute('ROLLBACK');
      console.error('Batch write failed:', error);
      throw error;
    }
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      // Add to pending writes for batching
      this.pendingWrites.set('theme', settings.theme);
      this.pendingWrites.set('preferences', settings.preferences);
      this.pendingWrites.set('keybinds', settings.keybinds);

      // Schedule batch write
      this.scheduleBatchWrite();
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  }

  async loadSettings(): Promise<AppSettings> {
    try {
      const db = await this.ensureConnection();
      
      // Load all settings in one query
      const rows = await db.select<{ key: string; value: string }[]>(
        'SELECT key, value FROM settings WHERE key IN (?, ?, ?)',
        ['theme', 'preferences', 'keybinds']
      );

      const settingsMap = new Map(rows.map(row => [row.key, JSON.parse(row.value)]));

      return {
        theme: settingsMap.get('theme') || DEFAULT_STATE.theme,
        preferences: settingsMap.get('preferences') || DEFAULT_PREFERENCES,
        keybinds: settingsMap.get('keybinds') || {},
      };
    } catch (error) {
      console.error('Failed to load settings:', error);
      // Return defaults on error
      return {
        theme: DEFAULT_STATE.theme,
        preferences: DEFAULT_PREFERENCES,
        keybinds: {},
      };
    }
  }

  async saveAgentStatus(status: AgentStatus): Promise<void> {
    try {
      // Agent status is saved immediately (not batched) for session recovery
      const db = await this.ensureConnection();
      await db.execute(
        'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
        ['agentStatus', JSON.stringify(status)]
      );
    } catch (error) {
      console.error('Failed to save agent status:', error);
      // Don't throw for agent status saves to avoid blocking UI
    }
  }

  async loadAgentStatus(): Promise<AgentStatus> {
    try {
      const db = await this.ensureConnection();
      const rows = await db.select<{ value: string }[]>(
        'SELECT value FROM settings WHERE key = ?',
        ['agentStatus']
      );

      if (rows.length > 0) {
        return JSON.parse(rows[0].value) as AgentStatus;
      }
      return DEFAULT_STATE.status;
    } catch (error) {
      console.error('Failed to load agent status:', error);
      return DEFAULT_STATE.status;
    }
  }

  async saveKeybind(combination: string, command: string): Promise<void> {
    try {
      const db = await this.ensureConnection();
      await db.execute(
        'INSERT OR REPLACE INTO keybinds (key_combination, command, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
        [combination, command]
      );
    } catch (error) {
      console.error('Failed to save keybind:', error);
      throw error;
    }
  }

  async removeKeybind(combination: string): Promise<void> {
    try {
      const db = await this.ensureConnection();
      await db.execute(
        'DELETE FROM keybinds WHERE key_combination = ?',
        [combination]
      );
    } catch (error) {
      console.error('Failed to remove keybind:', error);
      throw error;
    }
  }

  async loadKeybinds(): Promise<Record<string, string>> {
    try {
      const db = await this.ensureConnection();
      const rows = await db.select<{ key_combination: string; command: string }[]>(
        'SELECT key_combination, command FROM keybinds ORDER BY created_at DESC'
      );

      return rows.reduce((acc, row) => {
        acc[row.key_combination] = row.command;
        return acc;
      }, {} as Record<string, string>);
    } catch (error) {
      console.error('Failed to load keybinds:', error);
      return {};
    }
  }

  async exportSettings(): Promise<string> {
    try {
      const settings = await this.loadSettings();
      const keybinds = await this.loadKeybinds();
      const agentStatus = await this.loadAgentStatus();

      const exportData = {
        settings,
        keybinds,
        agentStatus,
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Failed to export settings:', error);
      throw error;
    }
  }

  async importSettings(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.settings) {
        await this.saveSettings(data.settings);
      }

      if (data.keybinds) {
        const db = await this.ensureConnection();
        // Clear existing keybinds first
        await db.execute('DELETE FROM keybinds');
        
        // Import new keybinds
        for (const [combination, command] of Object.entries(data.keybinds)) {
          await this.saveKeybind(combination, command as string);
        }
      }

      if (data.agentStatus) {
        await this.saveAgentStatus(data.agentStatus);
      }
    } catch (error) {
      console.error('Failed to import settings:', error);
      throw error;
    }
  }

  async clearAllData(): Promise<void> {
    try {
      const db = await this.ensureConnection();
      await db.execute('BEGIN TRANSACTION');
      await db.execute('DELETE FROM settings');
      await db.execute('DELETE FROM keybinds');
      await db.execute('COMMIT');
      console.log('All data cleared from database');
    } catch (error) {
      const db = await this.ensureConnection();
      await db.execute('ROLLBACK');
      console.error('Failed to clear data:', error);
      throw error;
    }
  }

  // Force flush any pending writes (useful for app shutdown)
  async flush(): Promise<void> {
    if (this.writeTimeout) {
      clearTimeout(this.writeTimeout);
      this.writeTimeout = null;
    }
    await this.flushPendingWrites();
  }

  async close(): Promise<void> {
    await this.flush();
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}

// Export singleton instance
export const persistenceService = new PersistenceService();