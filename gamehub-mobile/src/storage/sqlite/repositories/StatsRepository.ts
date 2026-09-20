// ============================================================
// GameHub — Stats Repository
// ============================================================

import type { SQLiteDatabase } from 'expo-sqlite';
import { Tables, type GameStatsRow } from '../schema';

export class StatsRepository {
  constructor(private db: SQLiteDatabase) {}

  /** Get stats for a specific game. */
  async getByGameId(gameId: string): Promise<GameStatsRow | null> {
    return this.db.getFirstAsync<GameStatsRow>(
      `SELECT * FROM ${Tables.GAME_STATS} WHERE game_id = ?`,
      [gameId]
    );
  }

  /** Get all game stats. */
  async getAll(): Promise<GameStatsRow[]> {
    return this.db.getAllAsync<GameStatsRow>(
      `SELECT * FROM ${Tables.GAME_STATS} ORDER BY games_played DESC`
    );
  }

  /** Update stats after a game completion — upsert pattern. */
  async recordGameResult(params: {
    gameId: string;
    score: number;
    result: 'win' | 'loss' | 'draw';
  }): Promise<void> {
    const existing = await this.getByGameId(params.gameId);

    if (!existing) {
      // Insert new stats row
      const id = crypto.randomUUID?.() ?? `stats-${params.gameId}-${Date.now()}`;
      await this.db.runAsync(
        `INSERT INTO ${Tables.GAME_STATS} (id, game_id, games_played, wins, losses, draws, best_score, total_score, updated_at)
         VALUES (?, ?, 1, ?, ?, ?, ?, ?, datetime('now'))`,
        [
          id,
          params.gameId,
          params.result === 'win' ? 1 : 0,
          params.result === 'loss' ? 1 : 0,
          params.result === 'draw' ? 1 : 0,
          params.score,
          params.score,
        ]
      );
    } else {
      // Update existing
      const newBestScore = Math.max(existing.best_score, params.score);
      await this.db.runAsync(
        `UPDATE ${Tables.GAME_STATS}
         SET games_played = games_played + 1,
             wins = wins + ?,
             losses = losses + ?,
             draws = draws + ?,
             best_score = ?,
             total_score = total_score + ?,
             updated_at = datetime('now')
         WHERE game_id = ?`,
        [
          params.result === 'win' ? 1 : 0,
          params.result === 'loss' ? 1 : 0,
          params.result === 'draw' ? 1 : 0,
          newBestScore,
          params.score,
          params.gameId,
        ]
      );
    }
  }

  /** Get aggregated totals across all games. */
  async getTotals(): Promise<{
    totalGamesPlayed: number;
    totalWins: number;
    totalBestScore: number;
  }> {
    const result = await this.db.getFirstAsync<{
      total_played: number;
      total_wins: number;
      max_best: number;
    }>(
      `SELECT
        COALESCE(SUM(games_played), 0) as total_played,
        COALESCE(SUM(wins), 0) as total_wins,
        COALESCE(MAX(best_score), 0) as max_best
       FROM ${Tables.GAME_STATS}`
    );
    return {
      totalGamesPlayed: result?.total_played ?? 0,
      totalWins: result?.total_wins ?? 0,
      totalBestScore: result?.max_best ?? 0,
    };
  }
}
