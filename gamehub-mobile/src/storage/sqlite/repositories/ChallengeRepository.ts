// ============================================================
// GameHub — Challenge Repository
// ============================================================

import type { SQLiteDatabase } from 'expo-sqlite';
import { Tables, type DailyChallengeRow, type DailyStreakRow } from '../schema';

export class ChallengeRepository {
  constructor(private db: SQLiteDatabase) {}

  /** Get today's challenges. */
  async getTodayChallenges(): Promise<DailyChallengeRow[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.db.getAllAsync<DailyChallengeRow>(
      `SELECT * FROM ${Tables.DAILY_CHALLENGES} WHERE date = ?`,
      [today]
    );
  }

  /** Create a daily challenge. */
  async createChallenge(challenge: {
    id: string;
    gameId: string;
    type: string;
    target: number;
    date: string;
  }): Promise<void> {
    await this.db.runAsync(
      `INSERT OR IGNORE INTO ${Tables.DAILY_CHALLENGES} (id, game_id, type, target, progress, completed, date)
       VALUES (?, ?, ?, ?, 0, 0, ?)`,
      [challenge.id, challenge.gameId, challenge.type, challenge.target, challenge.date]
    );
  }

  /** Update progress on a challenge. */
  async updateProgress(id: string, progress: number): Promise<void> {
    await this.db.runAsync(
      `UPDATE ${Tables.DAILY_CHALLENGES}
       SET progress = ?,
           completed = CASE WHEN ? >= target THEN 1 ELSE 0 END
       WHERE id = ?`,
      [progress, progress, id]
    );
  }

  /** Get the daily streak singleton. */
  async getStreak(): Promise<DailyStreakRow> {
    const result = await this.db.getFirstAsync<DailyStreakRow>(
      `SELECT * FROM ${Tables.DAILY_STREAKS} WHERE id = 1`
    );
    return result ?? { id: 1, current_streak: 0, longest_streak: 0, last_played_date: '' };
  }

  /** Record that the user played today. Updates streak logic. */
  async recordPlayedToday(): Promise<DailyStreakRow> {
    const today = new Date().toISOString().split('T')[0];
    const streak = await this.getStreak();

    if (streak.last_played_date === today) {
      return streak; // Already recorded today
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak: number;
    if (streak.last_played_date === yesterdayStr) {
      newStreak = streak.current_streak + 1;
    } else {
      newStreak = 1; // Streak broken
    }

    const newLongest = Math.max(streak.longest_streak, newStreak);

    await this.db.runAsync(
      `UPDATE ${Tables.DAILY_STREAKS}
       SET current_streak = ?, longest_streak = ?, last_played_date = ?
       WHERE id = 1`,
      [newStreak, newLongest, today]
    );

    return { id: 1, current_streak: newStreak, longest_streak: newLongest, last_played_date: today };
  }
}
