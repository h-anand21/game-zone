// ============================================================
// ONE TAP: PRECISION GAME — Timing Engine
// Oscillating needle clock & target zone generation
// ============================================================

import { TargetZoneData, GameModeId } from '../types';
import { ONE_TAP_CONFIG, GAME_MODES } from '../config';

export const TimingEngine = {
  /**
   * Generates a randomized target zone within safe bounds of the track
   * Safely clamped between 8% and 92% to avoid edge clips
   */
  generateTargetZone(roundIndex: number, modeId: GameModeId): TargetZoneData {
    const modeConfig = GAME_MODES[modeId] || GAME_MODES.classic;

    // Progressively shrink target width as rounds progress
    const roundProgress = Math.min(1.0, roundIndex / 10);
    const baseWidth =
      ONE_TAP_CONFIG.maxTargetWidth -
      roundProgress * (ONE_TAP_CONFIG.maxTargetWidth - ONE_TAP_CONFIG.minTargetWidth);

    const width = Math.max(
      ONE_TAP_CONFIG.minTargetWidth,
      baseWidth * modeConfig.targetWidthMultiplier
    );

    const minCenter = ONE_TAP_CONFIG.trackSafeMargin + width / 2;
    const maxCenter = 1.0 - ONE_TAP_CONFIG.trackSafeMargin - width / 2;

    // Pick random center between safe bounds
    const center = minCenter + Math.random() * (maxCenter - minCenter);
    const start = center - width / 2;

    return {
      start,
      width,
      center,
      perfectWidth: ONE_TAP_CONFIG.perfectTolerance * 2,
      greatWidth: ONE_TAP_CONFIG.greatTolerance * 2,
      goodWidth: width,
    };
  },

  /**
   * Computes normalized position (0.0 to 1.0) of needle along track
   * using an oscillating triangle wave
   */
  calculateNeedlePosition(
    elapsedMs: number,
    travelDurationMs: number
  ): { position: number; direction: 1 | -1 } {
    const cycleDuration = travelDurationMs * 2;
    const progressInCycle = (elapsedMs % cycleDuration) / cycleDuration; // 0 to 1

    if (progressInCycle <= 0.5) {
      // Moving left to right (0 -> 1)
      const pos = progressInCycle * 2;
      return { position: pos, direction: 1 };
    } else {
      // Moving right to left (1 -> 0)
      const pos = 1.0 - (progressInCycle - 0.5) * 2;
      return { position: pos, direction: -1 };
    }
  },
};
