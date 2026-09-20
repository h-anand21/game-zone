// ============================================================
// GameHub — Migration 001: Initial Tables
// ============================================================

import type { SQLiteDatabase } from 'expo-sqlite';

export const VERSION = 1;
export const NAME = '001_initial';

export async function up(db: SQLiteDatabase): Promise<void> {
  // Users table — guest identity + profile
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      guest_id TEXT NOT NULL UNIQUE,
      device_id TEXT NOT NULL,
      cloud_user_id TEXT,
      username TEXT NOT NULL,
      display_name TEXT NOT NULL,
      avatar_url TEXT,
      xp INTEGER NOT NULL DEFAULT 0,
      level INTEGER NOT NULL DEFAULT 1,
      coins INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      linked_at TEXT
    );
  `);

  // Game scores — every completed game session
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS game_scores (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL UNIQUE,
      game_id TEXT NOT NULL,
      game_version TEXT NOT NULL,
      score_version TEXT NOT NULL,
      score INTEGER NOT NULL,
      duration INTEGER NOT NULL DEFAULT 0,
      metadata TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_game_scores_game_id ON game_scores(game_id);
    CREATE INDEX IF NOT EXISTS idx_game_scores_created_at ON game_scores(created_at);
  `);

  // Game stats — aggregated per game
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS game_stats (
      id TEXT PRIMARY KEY,
      game_id TEXT NOT NULL UNIQUE,
      games_played INTEGER NOT NULL DEFAULT 0,
      wins INTEGER NOT NULL DEFAULT 0,
      losses INTEGER NOT NULL DEFAULT 0,
      draws INTEGER NOT NULL DEFAULT 0,
      best_score INTEGER NOT NULL DEFAULT 0,
      total_score INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Settings — key/value store
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Sync queue — offline events waiting for upload
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sync_queue (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL,
      payload TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      retry_count INTEGER NOT NULL DEFAULT 0,
      max_retries INTEGER NOT NULL DEFAULT 5,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status);
  `);
}
