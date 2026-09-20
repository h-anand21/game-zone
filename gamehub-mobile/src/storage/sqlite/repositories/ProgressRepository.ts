// ============================================================
// GameHub — Progress Repository (Save/Resume)
// ============================================================

import type { SQLiteDatabase } from 'expo-sqlite';
import { Tables, type GameProgressRow } from '../schema';

export class ProgressRepository {
  constructor(private db: SQLiteDatabase) {}

  /** Save or update game progress (upsert by game_id). */
  async save(progress: {
    id: string;
    gameId: string;
    gameVersion: string;
    stateJson: string;
  }): Promise<void> {
    await this.db.runAsync(
      `INSERT INTO ${Tables.GAME_PROGRESS} (id, game_id, game_version, state_json, updated_at)
       VALUES (?, ?, ?, ?, datetime('now'))
       ON CONFLICT(game_id) DO UPDATE SET
         state_json = excluded.state_json,
         game_version = excluded.game_version,
         updated_at = datetime('now')`,
      [progress.id, progress.gameId, progress.gameVersion, progress.stateJson]
    );
  }

  /** Load saved game progress. */
  async load(gameId: string): Promise<GameProgressRow | null> {
    return this.db.getFirstAsync<GameProgressRow>(
      `SELECT * FROM ${Tables.GAME_PROGRESS} WHERE game_id = ?`,
      [gameId]
    );
  }

  /** Delete saved progress (after game completion or explicit discard). */
  async delete(gameId: string): Promise<void> {
    await this.db.runAsync(
      `DELETE FROM ${Tables.GAME_PROGRESS} WHERE game_id = ?`,
      [gameId]
    );
  }

  /** Get all games with saved progress. */
  async getAllSaved(): Promise<GameProgressRow[]> {
    return this.db.getAllAsync<GameProgressRow>(
      `SELECT * FROM ${Tables.GAME_PROGRESS} ORDER BY updated_at DESC`
    );
  }

  /** Check if a game has saved progress. */
  async hasSavedProgress(gameId: string): Promise<boolean> {
    const result = await this.db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM ${Tables.GAME_PROGRESS} WHERE game_id = ?`,
      [gameId]
    );
    return (result?.count ?? 0) > 0;
  }
}
