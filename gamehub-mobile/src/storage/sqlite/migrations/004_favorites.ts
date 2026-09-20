// ============================================================
// GameHub — Migration 004: Favorite Games
// ============================================================

import type { SQLiteDatabase } from 'expo-sqlite';

export const VERSION = 4;
export const NAME = '004_favorites';

export async function up(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS favorite_games (
      game_id TEXT PRIMARY KEY,
      added_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}
