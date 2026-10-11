// ============================================================
// STACK MASTER — Physics & Scoring Engine Tests
// ============================================================

import {
  calculatePlacement,
  getBlockSpeed,
  createBaseBlock,
} from '../engine/stackPhysics';
import { computeScore, calculateAccuracy } from '../engine/scoring';

describe('Stack Master — Engine & Physics Tests', () => {
  const baseBlock = createBaseBlock(); // x: 22.5, width: 55

  test('calculatePlacement: detects perfect placement within tolerance', () => {
    // Exactly aligned with baseBlock
    const res = calculatePlacement(baseBlock.x, baseBlock.width, baseBlock);
    expect(res.type).toBe('perfect');
    expect(res.survivingX).toBe(baseBlock.x);
    expect(res.survivingWidth).toBe(baseBlock.width);
    expect(res.bonusPoints).toBe(3);
  });

  test('calculatePlacement: slices left overhang when block is shifted left', () => {
    // Shifted 10% left of previous
    const shiftedX = baseBlock.x - 10;
    const res = calculatePlacement(shiftedX, baseBlock.width, baseBlock);

    expect(res.type).toBe('good');
    expect(res.survivingX).toBe(baseBlock.x);
    expect(res.survivingWidth).toBeCloseTo(baseBlock.width - 10, 1);
    expect(res.cutX).toBeCloseTo(shiftedX, 1);
    expect(res.cutWidth).toBeCloseTo(10, 1);
    expect(res.cutDirection).toBe('left');
  });

  test('calculatePlacement: slices right overhang when block is shifted right', () => {
    // Shifted 10% right of previous
    const shiftedX = baseBlock.x + 10;
    const res = calculatePlacement(shiftedX, baseBlock.width, baseBlock);

    expect(res.type).toBe('good');
    expect(res.survivingX).toBe(shiftedX);
    expect(res.survivingWidth).toBeCloseTo(baseBlock.width - 10, 1);
    expect(res.cutWidth).toBeCloseTo(10, 1);
    expect(res.cutDirection).toBe('right');
  });

  test('calculatePlacement: triggers miss when block is completely outside', () => {
    // Dropped completely to the right of baseBlock
    const outsideX = baseBlock.x + baseBlock.width + 10;
    const res = calculatePlacement(outsideX, baseBlock.width, baseBlock);

    expect(res.type).toBe('miss');
    expect(res.survivingWidth).toBe(0);
  });

  test('computeScore: awards streak bonus on consecutive perfect drops', () => {
    const score1 = computeScore(0, 0, true, 0, 'classic');
    expect(score1.newScore).toBe(3);
    expect(score1.newCombo).toBe(1);

    const score2 = computeScore(score1.newScore, score1.newCombo, true, 1, 'classic');
    expect(score2.newCombo).toBe(2);
    expect(score2.pointsEarned).toBeGreaterThan(score1.pointsEarned);
  });

  test('computeScore: resets combo streak on partial placement', () => {
    const score = computeScore(50, 4, false, 5, 'classic');
    expect(score.newCombo).toBe(0);
    expect(score.pointsEarned).toBe(1);
  });

  test('getBlockSpeed: adapts to mode and height', () => {
    const speedClassic0 = getBlockSpeed(0, 'classic');
    const speedClassic20 = getBlockSpeed(20, 'classic');
    const speedZen = getBlockSpeed(20, 'zen');
    const speedRush = getBlockSpeed(0, 'rush');

    expect(speedClassic20).toBeGreaterThan(speedClassic0);
    expect(speedZen).toBeLessThan(speedClassic20);
    expect(speedRush).toBeGreaterThan(speedClassic0);
  });

  test('calculateAccuracy: calculates weighted accuracy correctly', () => {
    const acc100 = calculateAccuracy(10, 0, 10);
    expect(acc100).toBe(100);

    const accMixed = calculateAccuracy(5, 5, 10);
    expect(accMixed).toBe(80); // (5*100 + 5*60) / 10 = 80
  });
});
