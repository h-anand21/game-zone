// ============================================================
// GameHub — Game Storage (Save / Resume System)
// Save and load game state for resume support
// ============================================================

import { getDatabase } from '@/storage/sqlite/database';

export interface SavedGameState {
  gameId: string;
  gameVersion: string;
  stateJson: string;
  savedAt: string;
}

export class GameStorage {
  /**
   * Save current game state to SQLite for resume
   */
  static async saveGameState(gameId: string, gameVersion: string, state: any): Promise<void> {
    try {
      const db = await getDatabase();
      const stateJson = JSON.stringify(state);
      const now = new Date().toISOString();

      await db.runAsync(
        `INSERT OR REPLACE INTO game_progress (id, game_id, game_version, state_json, updated_at) 
         VALUES (?, ?, ?, ?, ?)`,
        [gameId, gameId, gameVersion, stateJson, now]
      );
    } catch (error) {
      console.error('[GameStorage] Save failed:', error);
    }
  }

  /**
   * Load saved game state from SQLite
   * @returns The parsed state object, or null if no save exists
   */
  static async loadGameState<T = any>(gameId: string): Promise<T | null> {
    try {
      const db = await getDatabase();
      const result = await db.getFirstAsync<{ state_json: string }>(
        'SELECT state_json FROM game_progress WHERE game_id = ? ORDER BY updated_at DESC LIMIT 1',
        [gameId]
      );

      if (result?.state_json) {
        return JSON.parse(result.state_json) as T;
      }
      return null;
    } catch (error) {
      console.error('[GameStorage] Load failed:', error);
      return null;
    }
  }

  /**
   * Check if a saved game exists
   */
  static async hasSavedGame(gameId: string): Promise<boolean> {
    try {
      const db = await getDatabase();
      const result = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM game_progress WHERE game_id = ?',
        [gameId]
      );
      return (result?.count ?? 0) > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Delete saved game state (after completing or abandoning)
   */
  static async deleteSavedGame(gameId: string): Promise<void> {
    try {
      const db = await getDatabase();
      await db.runAsync('DELETE FROM game_progress WHERE game_id = ?', [gameId]);
    } catch (error) {
      console.error('[GameStorage] Delete failed:', error);
    }
  }

  /**
   * Get all saved games for "Continue Playing" section
   */
  static async getAllSavedGames(): Promise<Array<{ gameId: string; savedAt: string }>> {
    try {
      const db = await getDatabase();
      const results = await db.getAllAsync<{ game_id: string; updated_at: string }>(
        'SELECT game_id, updated_at FROM game_progress ORDER BY updated_at DESC'
      );
      return results.map((r) => ({ gameId: r.game_id, savedAt: r.updated_at }));
    } catch (error) {
      console.error('[GameStorage] Get all saved failed:', error);
      return [];
    }
  }
}
