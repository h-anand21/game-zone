// ============================================================
// GameHub — Migration 002: Progress & Achievements
// ============================================================

import type { SQLiteDatabase } from 'expo-sqlite';

export const VERSION = 2;
export const NAME = '002_progress';

export async function up(db: SQLiteDatabase): Promise<void> {
  // Game progress — save/resume for long games
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS game_progress (
      id TEXT PRIMARY KEY,
      game_id TEXT NOT NULL,
      game_version TEXT NOT NULL,
      state_json TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_game_progress_game_id ON game_progress(game_id);
  `);

  // Achievements — definitions
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      icon TEXT NOT NULL DEFAULT '🏆',
      xp_reward INTEGER NOT NULL DEFAULT 0
    );
  `);

  // User achievements — which achievements the user has unlocked
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS user_achievements (
      user_id TEXT NOT NULL,
      achievement_id TEXT NOT NULL,
      unlocked_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (user_id, achievement_id)
    );
  `);
}
