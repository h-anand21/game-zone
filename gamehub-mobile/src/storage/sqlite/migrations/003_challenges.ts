// ============================================================
// GameHub — Migration 003: Daily Challenges & Streaks
// ============================================================

import type { SQLiteDatabase } from 'expo-sqlite';

export const VERSION = 3;
export const NAME = '003_challenges';

export async function up(db: SQLiteDatabase): Promise<void> {
  // Daily challenges
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS daily_challenges (
      id TEXT PRIMARY KEY,
      game_id TEXT NOT NULL,
      type TEXT NOT NULL,
      target INTEGER NOT NULL,
      progress INTEGER NOT NULL DEFAULT 0,
      completed INTEGER NOT NULL DEFAULT 0,
      date TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_daily_challenges_date ON daily_challenges(date);
  `);

  // Daily streaks — singleton row
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS daily_streaks (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      current_streak INTEGER NOT NULL DEFAULT 0,
      longest_streak INTEGER NOT NULL DEFAULT 0,
      last_played_date TEXT NOT NULL DEFAULT ''
    );
    INSERT OR IGNORE INTO daily_streaks (id, current_streak, longest_streak, last_played_date)
    VALUES (1, 0, 0, '');
  `);
}
