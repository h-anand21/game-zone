// ============================================================
// AIM RUSH — Pure Geometric Collision & Sweet-Spot Detector
// Evaluates finger touch coordinates against active target hitboxes
// ============================================================

import { TargetItem, TouchResult } from '../types';
import { AIM_RUSH_BALANCE } from '../config';

export function testTouchCollision(
  touchX: number,
  touchY: number,
  targets: TargetItem[]
): TouchResult {
  // Check targets in reverse (topmost first)
  for (let i = targets.length - 1; i >= 0; i--) {
    const t = targets[i];
    const dx = touchX - t.x;
    const dy = touchY - t.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= t.radius) {
      // Valid hit on target!
      const distanceRatio = distance / t.radius; // 0.0 = center, 1.0 = edge
      const accuracyPercent = Math.max(10, Math.round((1 - distanceRatio) * 100));

      if (t.type === 'danger') {
        return {
          hit: true,
          target: t,
          tier: 'miss',
          distanceFromCenter: distance,
          accuracyPercent: 0,
          pointsAwarded: AIM_RUSH_BALANCE.basePoints.dangerPenalty,
          touchX,
          touchY,
        };
      }

      // Determine concentric zone tier
      let tier: 'perfect' | 'great' | 'good' = 'good';
      let basePoints = AIM_RUSH_BALANCE.basePoints.good;

      if (distanceRatio <= AIM_RUSH_BALANCE.sweetSpotPercent) {
        tier = 'perfect';
        basePoints = AIM_RUSH_BALANCE.basePoints.perfect;
      } else if (distanceRatio <= AIM_RUSH_BALANCE.greatSpotPercent) {
        tier = 'great';
        basePoints = AIM_RUSH_BALANCE.basePoints.great;
      }

      return {
        hit: true,
        target: t,
        tier,
        distanceFromCenter: distance,
        accuracyPercent,
        pointsAwarded: basePoints,
        touchX,
        touchY,
      };
    }
  }

  // Touched outside any target = Miss
  return {
    hit: false,
    tier: 'miss',
    touchX,
    touchY,
  };
}
