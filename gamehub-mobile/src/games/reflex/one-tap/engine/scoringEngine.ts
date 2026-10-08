// ============================================================
// ONE TAP: PRECISION GAME — Scoring Engine
// Hit evaluation, combo multipliers, Fever calculations and ranks
// ============================================================

import { HitEvaluation, HitTier, TargetZoneData } from '../types';
import { ONE_TAP_CONFIG } from '../config';

export const ScoringEngine = {
  evaluateHit(
    needlePos: number,
    target: TargetZoneData,
    currentCombo: number,
    isFeverActive: boolean,
    reactionTimeMs: number
  ): HitEvaluation {
    const distanceFromCenter = Math.abs(needlePos - target.center);
    let tier: HitTier = 'miss';
    let basePoints = 0;

    if (distanceFromCenter <= ONE_TAP_CONFIG.perfectTolerance) {
      tier = 'perfect';
      basePoints = ONE_TAP_CONFIG.perfectScore;
    } else if (distanceFromCenter <= ONE_TAP_CONFIG.greatTolerance) {
      tier = 'great';
      basePoints = ONE_TAP_CONFIG.greatScore;
    } else if (distanceFromCenter <= target.width / 2) {
      tier = 'good';
      basePoints = ONE_TAP_CONFIG.goodScore;
    } else {
      tier = 'miss';
      basePoints = ONE_TAP_CONFIG.missScore;
    }

    // Determine Combo Multiplier
    let comboMultiplier = 1.0;
    for (const rule of ONE_TAP_CONFIG.comboMultipliers) {
      if (currentCombo >= rule.minCombo) {
        comboMultiplier = rule.multiplier;
      }
    }

    // Determine Fever Multiplier
    const feverMultiplier = isFeverActive ? ONE_TAP_CONFIG.feverScoreMultiplier : 1.0;

    // Total Score Awarded
    const totalPointsAwarded = Math.round(basePoints * comboMultiplier * feverMultiplier);

    return {
      tier,
      distanceFromCenter,
      scorePoints: basePoints,
      comboMultiplier,
      feverMultiplier,
      totalPointsAwarded,
      timestamp: Date.now(),
      reactionTimeMs,
    };
  },

  calculateRank(accuracyPercentage: number): 'S' | 'A' | 'B' | 'C' | 'D' {
    if (accuracyPercentage >= ONE_TAP_CONFIG.ranks.S) return 'S';
    if (accuracyPercentage >= ONE_TAP_CONFIG.ranks.A) return 'A';
    if (accuracyPercentage >= ONE_TAP_CONFIG.ranks.B) return 'B';
    if (accuracyPercentage >= ONE_TAP_CONFIG.ranks.C) return 'C';
    return 'D';
  },

  calculateRewards(finalScore: number, accuracy: number, maxCombo: number) {
    const earnedCoins = Math.max(10, Math.floor(finalScore / 10) + Math.floor(maxCombo * 2));
    const earnedXp = Math.max(20, Math.floor(finalScore / 8) + (accuracy >= 80 ? 30 : 10));
    const earnedStars = accuracy >= 90 ? 3 : accuracy >= 75 ? 2 : 1;

    return { earnedCoins, earnedXp, earnedStars };
  },
};
