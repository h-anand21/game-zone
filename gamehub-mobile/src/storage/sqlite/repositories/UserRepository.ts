// ============================================================
// GameHub — User Repository
// ============================================================

import type { SQLiteDatabase } from 'expo-sqlite';
import { Tables, type UserRow } from '../schema';

export class UserRepository {
  constructor(private db: SQLiteDatabase) {}

  /** Get the current local user (there's only one). */
  async getUser(): Promise<UserRow | null> {
    return this.db.getFirstAsync<UserRow>(
      `SELECT * FROM ${Tables.USERS} LIMIT 1`
    );
  }

  /** Create the initial guest user. */
  async createGuestUser(user: {
    id: string;
    guestId: string;
    deviceId: string;
    username: string;
    displayName: string;
  }): Promise<void> {
    await this.db.runAsync(
      `INSERT INTO ${Tables.USERS} (id, guest_id, device_id, username, display_name) VALUES (?, ?, ?, ?, ?)`,
      [user.id, user.guestId, user.deviceId, user.username, user.displayName]
    );
  }

  /** Update profile fields. */
  async updateProfile(updates: {
    displayName?: string;
    avatarUrl?: string;
    username?: string;
  }): Promise<void> {
    const sets: string[] = [];
    const values: unknown[] = [];

    if (updates.displayName !== undefined) {
      sets.push('display_name = ?');
      values.push(updates.displayName);
    }
    if (updates.avatarUrl !== undefined) {
      sets.push('avatar_url = ?');
      values.push(updates.avatarUrl);
    }
    if (updates.username !== undefined) {
      sets.push('username = ?');
      values.push(updates.username);
    }

    if (sets.length === 0) return;

    await this.db.runAsync(
      `UPDATE ${Tables.USERS} SET ${sets.join(', ')}`,
      values
    );
  }

  /** Add XP and recalculate level. */
  async addXp(amount: number): Promise<{ newXp: number; newLevel: number }> {
    const user = await this.getUser();
    if (!user) throw new Error('No user found');

    const newXp = user.xp + amount;
    const newLevel = calculateLevel(newXp);

    await this.db.runAsync(
      `UPDATE ${Tables.USERS} SET xp = ?, level = ?`,
      [newXp, newLevel]
    );

    return { newXp, newLevel };
  }

  /** Add coins. */
  async addCoins(amount: number): Promise<number> {
    const user = await this.getUser();
    if (!user) throw new Error('No user found');

    const newCoins = user.coins + amount;
    await this.db.runAsync(
      `UPDATE ${Tables.USERS} SET coins = ?`,
      [newCoins]
    );

    return newCoins;
  }

  /** Link guest account to cloud user. */
  async linkToCloud(cloudUserId: string): Promise<void> {
    await this.db.runAsync(
      `UPDATE ${Tables.USERS} SET cloud_user_id = ?, linked_at = datetime('now')`,
      [cloudUserId]
    );
  }
}

/**
 * XP → Level calculation.
 * Exponential curve: Level N requires N * 100 XP.
 * Level 1 = 0 XP, Level 2 = 100 XP, Level 3 = 300 XP, etc.
 */
function calculateLevel(xp: number): number {
  let level = 1;
  let threshold = 0;
  while (true) {
    threshold += level * 100;
    if (xp < threshold) return level;
    level++;
    if (level > 999) return 999; // Safety cap
  }
}
