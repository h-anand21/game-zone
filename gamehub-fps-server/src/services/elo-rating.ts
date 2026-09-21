// ============================================================
// GameHub FPS Server — ELO Rating System
// Skill-based matchmaking rating for FPS modes
// ============================================================

import { logger } from '../utils/logger.js';

const DEFAULT_ELO = 1000;
const K_FACTOR = 32;

/** In-memory ELO store (backed by backend DB in production) */
const eloRatings = new Map<string, number>();

/**
 * Get a player's ELO rating
 */
export function getElo(userId: string): number {
  return eloRatings.get(userId) ?? DEFAULT_ELO;
}

/**
 * Calculate expected win probability
 */
function expectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

/**
 * Update ELO after a 1v1 match
 */
export function updateElo1v1(winnerId: string, loserId: string): { winnerElo: number; loserElo: number } {
  const winnerRating = getElo(winnerId);
  const loserRating = getElo(loserId);

  const expectedWin = expectedScore(winnerRating, loserRating);
  const expectedLose = expectedScore(loserRating, winnerRating);

  const newWinnerElo = Math.round(winnerRating + K_FACTOR * (1 - expectedWin));
  const newLoserElo = Math.round(loserRating + K_FACTOR * (0 - expectedLose));

  eloRatings.set(winnerId, newWinnerElo);
  eloRatings.set(loserId, Math.max(100, newLoserElo));

  logger.info(`[ELO] ${winnerId}: ${winnerRating}→${newWinnerElo} | ${loserId}: ${loserRating}→${newLoserElo}`);

  return { winnerElo: newWinnerElo, loserElo: Math.max(100, newLoserElo) };
}

/**
 * Update ELO for FFA (Free-For-All) based on placement
 * Top 50% gains ELO, bottom 50% loses ELO
 */
export function updateEloFFA(
  players: Array<{ userId: string; rank: number }>,
): Map<string, number> {
  const total = players.length;
  const avgElo = players.reduce((sum, p) => sum + getElo(p.userId), 0) / total;
  const results = new Map<string, number>();

  players.forEach((p) => {
    const currentElo = getElo(p.userId);
    // Placement score: rank 1 = 1.0, last place = 0.0
    const placementScore = 1 - (p.rank - 1) / (total - 1);
    const expected = expectedScore(currentElo, avgElo);
    const newElo = Math.round(currentElo + K_FACTOR * (placementScore - expected));
    const clampedElo = Math.max(100, newElo);

    eloRatings.set(p.userId, clampedElo);
    results.set(p.userId, clampedElo);
  });

  return results;
}

/**
 * Get ELO tier name
 */
export function getEloTier(elo: number): string {
  if (elo >= 2000) return 'Legendary';
  if (elo >= 1700) return 'Diamond';
  if (elo >= 1400) return 'Platinum';
  if (elo >= 1200) return 'Gold';
  if (elo >= 1000) return 'Silver';
  if (elo >= 800) return 'Bronze';
  return 'Iron';
}

/**
 * Find matchmaking candidates within ELO range
 */
export function findEloMatch(userId: string, allWaiting: string[], range: number = 200): string[] {
  const myElo = getElo(userId);
  return allWaiting.filter((id) => {
    if (id === userId) return false;
    const theirElo = getElo(id);
    return Math.abs(myElo - theirElo) <= range;
  });
}

/**
 * Set ELO directly (for syncing from backend)
 */
export function setElo(userId: string, elo: number): void {
  eloRatings.set(userId, elo);
}
