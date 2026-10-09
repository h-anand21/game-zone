// ============================================================
// REACTION FIRE — Daily Challenge Engine
// Deterministic daily missions with attempt quotas and local validation
// ============================================================

import type { DailyChallengeState } from '../types';

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export const DEFAULT_DAILY_CHALLENGE = {
  title: 'SPEED TEST',
  objective: 'Get at least one valid reaction under 300 ms within five attempts.',
  targetMs: 300,
  maxAttempts: 5,
  rewardXp: 250,
};

export function createInitialDailyState(dateStr?: string): DailyChallengeState {
  return {
    date: dateStr || getTodayDateString(),
    attemptsLeft: DEFAULT_DAILY_CHALLENGE.maxAttempts,
    completed: false,
    bestTimeMs: null,
    rewardClaimed: false,
  };
}
