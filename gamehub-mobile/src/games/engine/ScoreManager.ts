// ============================================================
// GameHub — Score Manager
// ============================================================
// Handles score calculation, local validation, and submission.

import type { GameConfig, GameScore } from '@/constants/types';

/**
 * Validates a score against the game's rules.
 * Returns null if valid, or an error message if invalid.
 */
export function validateScore(
  config: GameConfig,
  score: number,
  duration: number
): string | null {
  const { validation } = config;

  if (score < 0) return 'Score cannot be negative';
  if (score > validation.maxScore) return `Score exceeds maximum (${validation.maxScore})`;
  if (duration < validation.minDuration) return `Duration too short (min ${validation.minDuration}s)`;
  if (duration > validation.maxDuration) return `Duration too long (max ${validation.maxDuration}s)`;

  return null;
}

/**
 * Generates a UUID v4 for event_id / idempotency.
 */
export function generateEventId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Creates a GameScore record ready for local storage.
 */
export function createScoreRecord(
  config: GameConfig,
  score: number,
  duration: number,
  metadata?: Record<string, unknown>
): GameScore {
  return {
    id: generateEventId(),
    eventId: generateEventId(),
    gameId: config.id,
    gameVersion: config.gameVersion,
    scoreVersion: config.scoreVersion,
    score,
    duration,
    metadata,
    createdAt: new Date().toISOString(),
  };
}
