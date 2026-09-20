// ============================================================
// GameHub — Settings Repository
// ============================================================

import type { SQLiteDatabase } from 'expo-sqlite';
import { Tables } from '../schema';

export class SettingsRepository {
  constructor(private db: SQLiteDatabase) {}

  /** Get a setting value by key. */
  async get(key: string): Promise<string | null> {
    const result = await this.db.getFirstAsync<{ value: string }>(
      `SELECT value FROM ${Tables.SETTINGS} WHERE key = ?`,
      [key]
    );
    return result?.value ?? null;
  }

  /** Get a setting with a default fallback. */
  async getOrDefault(key: string, defaultValue: string): Promise<string> {
    return (await this.get(key)) ?? defaultValue;
  }

  /** Get a boolean setting. */
  async getBool(key: string, defaultValue: boolean = false): Promise<boolean> {
    const value = await this.get(key);
    if (value === null) return defaultValue;
    return value === 'true' || value === '1';
  }

  /** Set a setting value (upsert). */
  async set(key: string, value: string): Promise<void> {
    await this.db.runAsync(
      `INSERT INTO ${Tables.SETTINGS} (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      [key, value]
    );
  }

  /** Set a boolean setting. */
  async setBool(key: string, value: boolean): Promise<void> {
    await this.set(key, value ? 'true' : 'false');
  }

  /** Delete a setting. */
  async remove(key: string): Promise<void> {
    await this.db.runAsync(
      `DELETE FROM ${Tables.SETTINGS} WHERE key = ?`,
      [key]
    );
  }

  /** Get all settings as a key-value map. */
  async getAll(): Promise<Record<string, string>> {
    const rows = await this.db.getAllAsync<{ key: string; value: string }>(
      `SELECT * FROM ${Tables.SETTINGS}`
    );
    const map: Record<string, string> = {};
    for (const row of rows) {
      map[row.key] = row.value;
    }
    return map;
  }
}
