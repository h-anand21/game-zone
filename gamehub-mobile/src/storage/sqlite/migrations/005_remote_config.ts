// ============================================================
// GameHub — Migration 005: Remote Config Cache
// ============================================================

import type { SQLiteDatabase } from 'expo-sqlite';

export const VERSION = 5;
export const NAME = '005_remote_config';

export async function up(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS remote_config_cache (
      key TEXT PRIMARY KEY,
      value_json TEXT NOT NULL,
      fetched_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}
