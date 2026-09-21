// ============================================================
// GameHub FPS Server — Leaderboard Service
// In-memory FPS leaderboard with backend sync
// ============================================================

import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export interface LeaderboardEntry {
  userId: string;
  username: string;
  kills: number;
  deaths: number;
  wins: number;
  gamesPlayed: number;
  score: number;
  kdRatio: number;
  lastUpdated: number;
}

/** In-memory leaderboard (per-mode) */
const leaderboards = new Map<string, Map<string, LeaderboardEntry>>();

/**
 * Update a player's leaderboard stats after a match
 */
export function updateLeaderboard(
  mode: string,
  userId: string,
  username: string,
  kills: number,
  deaths: number,
  score: number,
  won: boolean,
): void {
  if (!leaderboards.has(mode)) {
    leaderboards.set(mode, new Map());
  }

  const modeBoard = leaderboards.get(mode)!;
  const existing = modeBoard.get(userId);

  if (existing) {
    existing.kills += kills;
    existing.deaths += deaths;
    existing.score += score;
    existing.gamesPlayed += 1;
    if (won) existing.wins += 1;
    existing.kdRatio = existing.deaths > 0 ? +(existing.kills / existing.deaths).toFixed(2) : existing.kills;
    existing.lastUpdated = Date.now();
  } else {
    modeBoard.set(userId, {
      userId,
      username,
      kills,
      deaths,
      wins: won ? 1 : 0,
      gamesPlayed: 1,
      score,
      kdRatio: deaths > 0 ? +(kills / deaths).toFixed(2) : kills,
      lastUpdated: Date.now(),
    });
  }

  logger.info(`[Leaderboard] Updated ${username} in ${mode}: K=${kills} D=${deaths} S=${score} W=${won}`);
}

/**
 * Get top N players for a mode
 */
export function getTopPlayers(mode: string, limit: number = 10): LeaderboardEntry[] {
  const modeBoard = leaderboards.get(mode);
  if (!modeBoard) return [];

  return Array.from(modeBoard.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Get a specific player's rank in a mode
 */
export function getPlayerRank(mode: string, userId: string): { rank: number; entry: LeaderboardEntry | null } {
  const sorted = getTopPlayers(mode, 999);
  const index = sorted.findIndex((e) => e.userId === userId);
  if (index === -1) return { rank: -1, entry: null };
  return { rank: index + 1, entry: sorted[index] };
}

/**
 * Get all available mode leaderboards
 */
export function getAvailableModes(): string[] {
  return Array.from(leaderboards.keys());
}

/**
 * Sync leaderboard to backend (called periodically)
 */
export async function syncLeaderboardToBackend(mode: string): Promise<boolean> {
  try {
    const entries = getTopPlayers(mode, 50);
    if (entries.length === 0) return true;

    const url = `${env.EXPRESS_BACKEND_URL}/api/v1/battle/leaderboard`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, entries }),
    });

    if (response.ok) {
      logger.info(`[Leaderboard] Synced ${entries.length} entries for ${mode} to backend`);
      return true;
    }
    logger.error(`[Leaderboard] Sync failed for ${mode}: HTTP ${response.status}`);
    return false;
  } catch (err: any) {
    logger.error(err, `[Leaderboard] Sync error for ${mode}:`);
    return false;
  }
}

/**
 * Clear leaderboard (for season reset)
 */
export function clearLeaderboard(mode?: string): void {
  if (mode) {
    leaderboards.delete(mode);
  } else {
    leaderboards.clear();
  }
  logger.info(`[Leaderboard] Cleared ${mode || 'all'} leaderboards`);
}
