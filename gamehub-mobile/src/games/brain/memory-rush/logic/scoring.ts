// ============================================================
// MEMORY RUSH — Deterministic Engine Scoring & Metrics
// ============================================================

import type { GameDifficulty } from '../types';

export function calculateScore(
  isCorrect: boolean,
  combo: number,
  reactionTimeMs: number,
  timeRemainingMs: number,
  difficulty: GameDifficulty
): number {
  if (!isCorrect) return 0;

  const diffMultiplier = difficulty === 'hard' ? 2.5 : difficulty === 'medium' ? 1.5 : 1.0;
  const comboMultiplier = 1 + combo * 0.25;
  const speedBonus = Math.max(0, Math.floor((3000 - reactionTimeMs) / 10));
  const timeBonus = Math.floor(timeRemainingMs / 100);

  const basePoints = 250;
  const total = Math.round((basePoints + speedBonus + timeBonus) * comboMultiplier * diffMultiplier);
  return total;
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total <= 0) return 100;
  return Math.min(100, Math.max(0, Math.round((correct / total) * 100)));
}

export function getPerformanceTitle(accuracy: number, maxCombo: number, score: number): string {
  if (accuracy >= 95 && score > 3500) return 'RUSH MASTER';
  if (accuracy >= 88 && score > 2500) return 'MEMORY PRO';
  if (accuracy >= 80 && maxCombo >= 6) return 'QUICK THINKER';
  if (accuracy >= 65) return 'FOCUSED';
  return 'STARTER';
}
