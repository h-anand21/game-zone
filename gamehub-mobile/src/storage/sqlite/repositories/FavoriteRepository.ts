// ============================================================
// GameHub — Favorite Games Repository
// ============================================================

import type { SQLiteDatabase } from 'expo-sqlite';
import { Tables, type FavoriteGameRow } from '../schema';

export class FavoriteRepository {
  constructor(private db: SQLiteDatabase) {}

  /** Get all favorite game IDs. */
  async getAll(): Promise<FavoriteGameRow[]> {
    return this.db.getAllAsync<FavoriteGameRow>(
      `SELECT * FROM ${Tables.FAVORITE_GAMES} ORDER BY added_at DESC`
    );
  }

  /** Get just the game IDs as an array. */
  async getGameIds(): Promise<string[]> {
    const rows = await this.getAll();
    return rows.map((r) => r.game_id);
  }

  /** Check if a game is favorited. */
  async isFavorite(gameId: string): Promise<boolean> {
    const result = await this.db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM ${Tables.FAVORITE_GAMES} WHERE game_id = ?`,
      [gameId]
    );
    return (result?.count ?? 0) > 0;
  }

  /** Add a game to favorites. */
  async add(gameId: string): Promise<void> {
    await this.db.runAsync(
      `INSERT OR IGNORE INTO ${Tables.FAVORITE_GAMES} (game_id) VALUES (?)`,
      [gameId]
    );
  }

  /** Remove a game from favorites. */
  async remove(gameId: string): Promise<void> {
    await this.db.runAsync(
      `DELETE FROM ${Tables.FAVORITE_GAMES} WHERE game_id = ?`,
      [gameId]
    );
  }

  /** Toggle a game's favorite status. Returns new state. */
  async toggle(gameId: string): Promise<boolean> {
    const isFav = await this.isFavorite(gameId);
    if (isFav) {
      await this.remove(gameId);
      return false;
    } else {
      await this.add(gameId);
      return true;
    }
  }
}
