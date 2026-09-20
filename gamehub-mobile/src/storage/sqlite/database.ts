// ============================================================
// GameHub — SQLite Database Manager
// ============================================================
// Handles database initialization, versioned migrations, and
// provides the singleton database instance.

import * as SQLite from 'expo-sqlite';
import { ALL_MIGRATIONS } from './migrations';
import { Tables } from './schema';

const DB_NAME = 'gamehub.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Get or create the singleton database instance.
 * Runs all pending migrations on first call.
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return dbInstance;

  const db = await SQLite.openDatabaseAsync(DB_NAME);

  // Enable WAL mode for better concurrent read/write performance
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync('PRAGMA foreign_keys = ON;');

  // Run migrations
  await runMigrations(db);

  dbInstance = db;
  return db;
}

/**
 * Versioned migration runner.
 * - Creates _migrations table if it doesn't exist.
 * - Runs each migration that hasn't been applied yet.
 * - Records applied migrations with timestamp.
 * - Never skips or reorders migrations.
 */
async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  // Create migrations tracking table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ${Tables.MIGRATIONS} (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Get already-applied versions
  const applied = await db.getAllAsync<{ version: number }>(
    `SELECT version FROM ${Tables.MIGRATIONS} ORDER BY version`
  );
  const appliedVersions = new Set(applied.map((r) => r.version));

  // Run pending migrations in order
  for (const migration of ALL_MIGRATIONS) {
    if (appliedVersions.has(migration.version)) {
      continue; // Already applied
    }

    console.log(`[DB] Running migration ${migration.version}: ${migration.name}`);

    try {
      await migration.up(db);

      // Record successful migration
      await db.runAsync(
        `INSERT INTO ${Tables.MIGRATIONS} (version, name) VALUES (?, ?)`,
        [migration.version, migration.name]
      );

      console.log(`[DB] Migration ${migration.version} applied successfully`);
    } catch (error) {
      console.error(`[DB] Migration ${migration.version} FAILED:`, error);
      throw new Error(
        `Migration ${migration.version} (${migration.name}) failed: ${error}`
      );
    }
  }
}

/**
 * Get the current database schema version.
 */
export async function getDatabaseVersion(): Promise<number> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ version: number }>(
    `SELECT MAX(version) as version FROM ${Tables.MIGRATIONS}`
  );
  return result?.version ?? 0;
}

/**
 * Close the database connection.
 * Call during app shutdown or testing.
 */
export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.closeAsync();
    dbInstance = null;
  }
}
