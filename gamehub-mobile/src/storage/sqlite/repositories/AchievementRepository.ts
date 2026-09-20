// ============================================================
// GameHub — Achievement Repository
// ============================================================

import type { SQLiteDatabase } from 'expo-sqlite';
import { Tables, type AchievementRow, type UserAchievementRow } from '../schema';

export class AchievementRepository {
  constructor(private db: SQLiteDatabase) {}

  /** Seed achievement definitions (called on first launch). */
  async seedAchievements(achievements: AchievementRow[]): Promise<void> {
    for (const a of achievements) {
      await this.db.runAsync(
        `INSERT OR IGNORE INTO ${Tables.ACHIEVEMENTS} (id, code, name, description, icon, xp_reward) VALUES (?, ?, ?, ?, ?, ?)`,
        [a.id, a.code, a.name, a.description, a.icon, a.xp_reward]
      );
    }
  }

  /** Get all achievement definitions. */
  async getAll(): Promise<AchievementRow[]> {
    return this.db.getAllAsync<AchievementRow>(
      `SELECT * FROM ${Tables.ACHIEVEMENTS} ORDER BY name`
    );
  }

  /** Get unlocked achievements for a user. */
  async getUnlocked(userId: string): Promise<(AchievementRow & { unlocked_at: string })[]> {
    return this.db.getAllAsync<AchievementRow & { unlocked_at: string }>(
      `SELECT a.*, ua.unlocked_at
       FROM ${Tables.USER_ACHIEVEMENTS} ua
       JOIN ${Tables.ACHIEVEMENTS} a ON a.id = ua.achievement_id
       WHERE ua.user_id = ?
       ORDER BY ua.unlocked_at DESC`,
      [userId]
    );
  }

  /** Unlock an achievement for a user. Returns true if newly unlocked. */
  async unlock(userId: string, achievementId: string): Promise<boolean> {
    const existing = await this.db.getFirstAsync<UserAchievementRow>(
      `SELECT * FROM ${Tables.USER_ACHIEVEMENTS} WHERE user_id = ? AND achievement_id = ?`,
      [userId, achievementId]
    );

    if (existing) return false; // Already unlocked

    await this.db.runAsync(
      `INSERT INTO ${Tables.USER_ACHIEVEMENTS} (user_id, achievement_id) VALUES (?, ?)`,
      [userId, achievementId]
    );
    return true;
  }

  /** Get count of unlocked achievements. */
  async getUnlockedCount(userId: string): Promise<number> {
    const result = await this.db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM ${Tables.USER_ACHIEVEMENTS} WHERE user_id = ?`,
      [userId]
    );
    return result?.count ?? 0;
  }
}
