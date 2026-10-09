// ============================================================
// REACTION FIRE — Core Reaction Engine & Scoring
// Exact classifications, mean/median statistics, and telemetry
// ============================================================

import type {
  PerformanceClassification,
  GameModeId,
  RunResult,
} from '../types';
import { RfColors } from '../theme';
import { RF_MODES } from '../config';

/**
 * Performance classification table strictly according to specification:
 * Below 250 ms: Lightning Fast
 * 250–349 ms: Fast / Great
 * 350–499 ms: Good
 * 500–699 ms: Normal
 * 700 ms and above: Keep Training
 */
export function getClassification(reactionTimeMs: number | null): PerformanceClassification {
  if (reactionTimeMs === null || reactionTimeMs < 0) return 'Keep Training';
  if (reactionTimeMs < 250) return 'Lightning Fast';
  if (reactionTimeMs < 350) return 'Fast / Great';
  if (reactionTimeMs < 500) return 'Good';
  if (reactionTimeMs < 700) return 'Normal';
  return 'Keep Training';
}

/**
 * Color associated with classification
 */
export function getClassificationColor(classification: PerformanceClassification): string {
  switch (classification) {
    case 'Lightning Fast':
      return RfColors.goLime;
    case 'Fast / Great':
      return RfColors.secondaryCyan;
    case 'Good':
      return RfColors.primaryBlue;
    case 'Normal':
      return RfColors.rewardGold;
    case 'Keep Training':
    default:
      return RfColors.signalRed;
  }
}

/**
 * Computes arithmetic mean of reaction times
 */
export function getMean(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, curr) => acc + curr, 0);
  return Math.round(sum / values.length);
}

/**
 * Computes statistical median of reaction times
 */
export function getMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) {
    return sorted[mid];
  }
  return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

/**
 * Converts reaction time in ms to an arcade score (0 to 1000)
 */
export function calculateReactionScore(reactionTimeMs: number): number {
  if (reactionTimeMs <= 0) return 0;
  if (reactionTimeMs < 150) return 1000;
  if (reactionTimeMs < 250) {
    return Math.round(1000 - ((reactionTimeMs - 150) / 100) * 150);
  }
  if (reactionTimeMs < 350) {
    return Math.round(850 - ((reactionTimeMs - 250) / 100) * 200);
  }
  if (reactionTimeMs < 500) {
    return Math.round(650 - ((reactionTimeMs - 350) / 150) * 250);
  }
  if (reactionTimeMs < 700) {
    return Math.round(400 - ((reactionTimeMs - 500) / 200) * 200);
  }
  return Math.max(50, Math.round(200 - ((reactionTimeMs - 700) / 300) * 150));
}

/**
 * Evaluates a complete RunResult across different modes
 */
export function evaluateRunResult({
  mode,
  roundTimes,
  falseStartsCount,
  previousBestMs,
  totalValidHits = 0,
  timeSurvivedSeconds = 0,
}: {
  mode: GameModeId;
  roundTimes: number[];
  falseStartsCount: number;
  previousBestMs: number | null;
  totalValidHits?: number;
  timeSurvivedSeconds?: number;
}): RunResult {
  const modeConfig = RF_MODES[mode];
  const validTimes = roundTimes.filter((t) => t > 0);

  let primaryTimeMs: number | null = null;
  let meanTimeMs: number | undefined;
  let medianTimeMs: number | undefined;

  if (validTimes.length > 0) {
    if (mode === 'five-round') {
      meanTimeMs = getMean(validTimes);
      medianTimeMs = getMedian(validTimes);
      primaryTimeMs = meanTimeMs;
    } else {
      primaryTimeMs = Math.min(...validTimes);
    }
  }

  const classification = getClassification(primaryTimeMs);

  // Victory Target: below 350 ms for Classic, below targetMs for others
  const targetReached =
    primaryTimeMs !== null && primaryTimeMs <= modeConfig.targetMs && falseStartsCount === 0;

  // New Personal Best Check
  let isNewBest = false;
  if (primaryTimeMs !== null && mode !== 'practice') {
    if (previousBestMs === null || primaryTimeMs < previousBestMs) {
      isNewBest = true;
    }
  }

  const score =
    mode === 'endurance'
      ? totalValidHits * 100
      : primaryTimeMs !== null
      ? calculateReactionScore(primaryTimeMs)
      : 0;

  return {
    mode,
    reactionTimeMs: primaryTimeMs,
    classification,
    isNewBest,
    targetReached,
    score,
    roundTimes,
    meanTimeMs,
    medianTimeMs,
    falseStartsCount,
    totalRoundsCompleted: validTimes.length,
    totalValidHits,
    timeSurvivedSeconds,
  };
}
