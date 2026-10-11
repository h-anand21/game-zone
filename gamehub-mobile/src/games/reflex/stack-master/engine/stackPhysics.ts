// ============================================================
// STACK MASTER — Core Physics Engine
// Pure mathematical collision, overlap, slicing & speed curves
// ============================================================

import type { PlacementResult, TowerBlock, GameMode } from '../types';

export const BASE_BLOCK_WIDTH = 55; // 55% of arena width initially
export const MIN_BLOCK_WIDTH = 6; // Minimum block width before impossible
export const PERFECT_TOLERANCE_PERCENT = 3.0; // 3% tolerance for a perfect snap

/**
 * Calculates overlap and slice between active moving block and previous top block.
 */
export function calculatePlacement(
  currentX: number,
  currentWidth: number,
  previousBlock: TowerBlock,
  assistMode = false
): PlacementResult {
  const prevX = previousBlock.x;
  const prevWidth = previousBlock.width;

  const currentRight = currentX + currentWidth;
  const previousRight = prevX + prevWidth;

  const tolerance = assistMode
    ? Math.max(PERFECT_TOLERANCE_PERCENT * 1.6, 4.0)
    : Math.max(PERFECT_TOLERANCE_PERCENT, 2.2);

  // Check for perfect placement
  const diff = Math.abs(currentX - prevX);
  if (diff <= tolerance) {
    return {
      type: 'perfect',
      survivingX: prevX,
      survivingWidth: prevWidth,
      bonusPoints: 3,
    };
  }

  // Calculate standard overlap
  const overlapLeft = Math.max(currentX, prevX);
  const overlapRight = Math.min(currentRight, previousRight);
  const overlapWidth = overlapRight - overlapLeft;

  if (overlapWidth <= 0.8) {
    // Complete miss!
    return {
      type: 'miss',
      survivingX: 0,
      survivingWidth: 0,
      bonusPoints: 0,
    };
  }

  // Partial overlap: slice offcut
  let cutX = 0;
  let cutWidth = 0;
  let cutDirection: 'left' | 'right' = 'right';

  if (currentX < prevX) {
    // Overhang on left
    cutX = currentX;
    cutWidth = prevX - currentX;
    cutDirection = 'left';
  } else {
    // Overhang on right
    cutX = overlapRight;
    cutWidth = currentRight - overlapRight;
    cutDirection = 'right';
  }

  return {
    type: 'good',
    survivingX: overlapLeft,
    survivingWidth: Math.max(overlapWidth, MIN_BLOCK_WIDTH),
    cutX,
    cutWidth,
    cutDirection,
    bonusPoints: 1,
  };
}

/**
 * Calculates horizontal speed for moving block according to tower height and mode.
 * Returns movement delta per tick (percentage / tick).
 */
export function getBlockSpeed(height: number, mode: GameMode = 'classic'): number {
  switch (mode) {
    case 'zen':
      return 1.2; // Relaxed, constant soothing speed
    case 'rush': {
      const base = 2.4;
      const extra = Math.min(height * 0.12, 3.2);
      return base + extra; // High-intensity speed
    }
    case 'precision':
      return 1.6; // Consistent test of accuracy
    case 'daily':
    case 'classic':
    default: {
      const base = 1.4;
      const extra = Math.min(height * 0.08, 2.8);
      return base + extra;
    }
  }
}

/**
 * Generates initial tower base block
 */
export function createBaseBlock(): TowerBlock {
  return {
    id: 1,
    x: (100 - BASE_BLOCK_WIDTH) / 2, // Centered (22.5%)
    width: BASE_BLOCK_WIDTH,
    y: 0,
    color: '#20D9FF',
    isPerfect: true,
  };
}
