// ============================================================
// DON'T TAP WRONG — Core Game Engine & Scoring
// ============================================================

import type {
  GameModeId,
  RunTelemetry,
  RunEndReason,
  GameModeConfig,
} from '../types';
import { DtwColors } from '../theme/colors';

/**
 * Calculates accuracy percentage:
 * Correct / (Correct + Danger) * 100
 */
export function calculateAccuracy(safeTaps: number, dangerTaps: number): number {
  const total = safeTaps + dangerTaps;
  if (total === 0) return 100;
  return Math.round((safeTaps / total) * 100);
}

/**
 * Returns streak milestone celebration message
 */
export function getStreakMilestone(streak: number): string | null {
  if (streak === 5) return '5 STREAK! 🔥';
  if (streak === 10) return '10 STREAK! ⚡';
  if (streak === 15) return 'UNSTOPPABLE! 💎';
  if (streak === 20) return 'GODLIKE SPEED! 👑';
  if (streak > 20 && streak % 5 === 0) return `${streak} ULTRA STREAK! 🚀`;
  return null;
}

/**
 * Performance grading based on score and mode
 */
export function getGradeForScore(
  score: number,
  modeId: GameModeId
): {
  grade: string;
  label: string;
  color: string;
} {
  if (modeId === 'classic') {
    if (score >= 25) return { grade: 'S+', label: 'CYBER LEGEND', color: DtwColors.streakGold };
    if (score >= 20) return { grade: 'S', label: 'REFLEX MASTER', color: DtwColors.safeGreen };
    if (score >= 15) return { grade: 'A', label: 'TARGET SECURED', color: DtwColors.cyanAccent };
    if (score >= 10) return { grade: 'B', label: 'SHARP REFLEX', color: DtwColors.safeGreenHighlight };
    return { grade: 'C', label: 'CADET', color: DtwColors.textSecondary };
  }

  if (modeId === 'rush') {
    if (score >= 30) return { grade: 'S+', label: 'SPEED DEMON', color: DtwColors.streakGold };
    if (score >= 20) return { grade: 'S', label: 'BLITZ MASTER', color: DtwColors.safeGreen };
    if (score >= 15) return { grade: 'A', label: 'FAST HANDS', color: DtwColors.cyanAccent };
    return { grade: 'B', label: 'REACTION SPEED', color: DtwColors.textSecondary };
  }

  if (modeId === 'survival') {
    if (score >= 35) return { grade: 'S+', label: 'IMMORTAL', color: DtwColors.streakGold };
    if (score >= 25) return { grade: 'S', label: 'SURVIVOR', color: DtwColors.safeGreen };
    if (score >= 15) return { grade: 'A', label: 'TENACIOUS', color: DtwColors.cyanAccent };
    return { grade: 'B', label: 'FALLEN', color: DtwColors.dangerRedHighlight };
  }

  // Daily
  if (score >= 25) return { grade: 'S+', label: 'DAILY CHAMPION', color: DtwColors.streakGold };
  if (score >= 18) return { grade: 'A', label: 'TARGET SECURED', color: DtwColors.safeGreen };
  return { grade: 'B', label: 'PARTICIPANT', color: DtwColors.cyanAccent };
}

/**
 * Builds the comprehensive RunTelemetry object at run completion
 */
export function evaluateRunTelemetry({
  mode,
  modeConfig,
  score,
  bestStreak,
  currentStreak,
  safeTaps,
  dangerTaps,
  durationElapsedSeconds,
  reason,
  previousHighScore,
}: {
  mode: GameModeId;
  modeConfig: GameModeConfig;
  score: number;
  bestStreak: number;
  currentStreak: number;
  safeTaps: number;
  dangerTaps: number;
  durationElapsedSeconds: number;
  reason: RunEndReason;
  previousHighScore: number;
}): RunTelemetry {
  const accuracy = calculateAccuracy(safeTaps, dangerTaps);
  const targetReached = score >= modeConfig.targetScore && dangerTaps === 0;
  const isNewBest = score > previousHighScore;

  return {
    mode,
    score,
    bestStreak,
    currentStreak,
    safeTaps,
    dangerTaps,
    totalTaps: safeTaps + dangerTaps,
    accuracy,
    durationElapsedSeconds,
    reason,
    targetReached,
    isNewBest,
    timestamp: Date.now(),
  };
}
