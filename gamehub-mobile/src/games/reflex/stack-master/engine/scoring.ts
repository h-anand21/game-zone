// ============================================================
// STACK MASTER — Scoring & Milestone Engine
// Deterministic score, combo multiplier, and accuracy metrics
// ============================================================

import type { GameMode } from '../types';

export interface ScoreUpdate {
  pointsEarned: number;
  newScore: number;
  newCombo: number;
  milestoneReached?: number;
}

export function computeScore(
  currentScore: number,
  currentCombo: number,
  isPerfect: boolean,
  currentHeight: number,
  mode: GameMode
): ScoreUpdate {
  let pointsEarned = 1;
  let newCombo = currentCombo;

  if (isPerfect) {
    newCombo += 1;
    // Perfect gives base 3 + (combo * 2) bonus
    const comboBonus = Math.min((newCombo - 1) * 2, 20);
    pointsEarned = 3 + comboBonus;
  } else {
    // Reset combo on partial placement
    newCombo = 0;
    pointsEarned = 1;
  }

  // Mode multipliers
  if (mode === 'rush') {
    pointsEarned = Math.round(pointsEarned * 1.5);
  } else if (mode === 'precision') {
    pointsEarned = isPerfect ? 5 : 1;
  }

  const nextHeight = currentHeight + 1;
  let milestoneReached: number | undefined;

  // Check milestone thresholds
  if ([10, 25, 50, 75, 100, 150].includes(nextHeight)) {
    milestoneReached = nextHeight;
    pointsEarned += nextHeight * 2; // Extra milestone reward
  }

  return {
    pointsEarned,
    newScore: currentScore + pointsEarned,
    newCombo,
    milestoneReached,
  };
}

export function calculateAccuracy(
  perfects: number,
  partials: number,
  total: number
): number {
  if (total <= 0) return 100;
  // Perfect is 100%, Partial is 60%
  const score = (perfects * 100 + partials * 60) / total;
  return Math.min(Math.round(score), 100);
}
