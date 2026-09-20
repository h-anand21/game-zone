// ============================================================
// GameHub — Score Repository
// ============================================================

import type { SQLiteDatabase } from 'expo-sqlite';
import { Tables, type GameScoreRow } from '../schema';

export class ScoreRepository {
  constructor(private db: SQLiteDatabase) {}

  /** Insert a new score record. */
  async insert(score: {
    id: string;
    eventId: string;
    gameId: string;
    gameVersion: string;
    scoreVersion: string;
    score: number;
    duration: number;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    await this.db.runAsync(
      `INSERT INTO ${Tables.GAME_SCORES} (id, event_id, game_id, game_version, score_version, score, duration, metadata) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        score.id,
        score.eventId,
        score.gameId,
        score.gameVersion,
        score.scoreVersion,
        score.score,
        score.duration,
        score.metadata ? JSON.stringify(score.metadata) : null,
      ]
    );
  }

  /** Get scores for a specific game, ordered by most recent. */
  async getByGameId(gameId: string, limit: number = 20): Promise<GameScoreRow[]> {
    return this.db.getAllAsync<GameScoreRow>(
      `SELECT * FROM ${Tables.GAME_SCORES} WHERE game_id = ? ORDER BY created_at DESC LIMIT ?`,
      [gameId, limit]
    );
  }

  /** Get all scores, ordered by most recent. */
  async getRecent(limit: number = 50): Promise<GameScoreRow[]> {
    return this.db.getAllAsync<GameScoreRow>(
      `SELECT * FROM ${Tables.GAME_SCORES} ORDER BY created_at DESC LIMIT ?`,
      [limit]
    );
  }

  /** Get best score for a game. */
  async getBestScore(gameId: string): Promise<number> {
    const result = await this.db.getFirstAsync<{ best: number }>(
      `SELECT MAX(score) as best FROM ${Tables.GAME_SCORES} WHERE game_id = ?`,
      [gameId]
    );
    return result?.best ?? 0;
  }

  /** Get total games played across all games. */
  async getTotalGamesPlayed(): Promise<number> {
    const result = await this.db.getFirstAsync<{ total: number }>(
      `SELECT COUNT(*) as total FROM ${Tables.GAME_SCORES}`
    );
    return result?.total ?? 0;
  }

  /** Check if an event_id already exists (idempotency). */
  async existsByEventId(eventId: string): Promise<boolean> {
    const result = await this.db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM ${Tables.GAME_SCORES} WHERE event_id = ?`,
      [eventId]
    );
    return (result?.count ?? 0) > 0;
  }
}
