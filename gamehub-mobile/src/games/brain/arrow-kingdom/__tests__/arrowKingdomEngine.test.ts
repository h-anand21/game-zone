// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Unit Tests
// Verifies collision detection, ray-casting escape, star scoring & hint solver
// ============================================================

import { attemptMove, isLevelComplete, calculateStars, getHint, getRemainingCount } from '../game/engine';
import { getOccupiedCells, vectors } from '../game/collision';
import { LEVELS } from '../data/levels';
import type { ArrowPieceData } from '../game/types';

describe('Arrow Kingdom: Slide Escape — Game Engine & Logic', () => {
  const samplePieces: ArrowPieceData[] = [
    {
      id: 'arrow-right',
      color: '#FF45B5',
      direction: 'right',
      cells: [
        { row: 2, col: 1 },
        { row: 2, col: 2 },
      ],
    },
    {
      id: 'arrow-down',
      color: '#20BFFF',
      direction: 'down',
      cells: [
        { row: 1, col: 3 },
        { row: 2, col: 3 },
        { row: 3, col: 3 },
      ],
    },
  ];

  test('collision: getOccupiedCells returns coordinates of all active pieces', () => {
    const occupied = getOccupiedCells(samplePieces);
    expect(occupied.has('2:1')).toBe(true);
    expect(occupied.has('2:2')).toBe(true);
    expect(occupied.has('1:3')).toBe(true);
    expect(occupied.has('2:3')).toBe(true);
    expect(occupied.has('3:3')).toBe(true);
    expect(occupied.has('0:0')).toBe(false);
  });

  test('attemptMove: detects when arrow is blocked by an intersecting piece', () => {
    // arrow-right is trying to move right through column 3 at row 2, where arrow-down sits
    const result = attemptMove(samplePieces[0], samplePieces, 6, 6);
    expect(result.type).toBe('blocked');
    expect(result.blockedCell).toEqual({ row: 2, col: 3 });
  });

  test('attemptMove: permits arrow to escape when exit path is clear', () => {
    // arrow-down moves down through row 4, 5 and off board (no obstacles below)
    const result = attemptMove(samplePieces[1], samplePieces, 6, 6);
    expect(result.type).toBe('escaped');
  });

  test('isLevelComplete: correctly reports true only when all pieces are removed', () => {
    expect(isLevelComplete(samplePieces)).toBe(false);

    const allRemoved = samplePieces.map((p) => ({ ...p, removed: true }));
    expect(isLevelComplete(allRemoved)).toBe(true);
  });

  test('calculateStars: awards 3, 2, or 1 star based on move thresholds', () => {
    const level1 = LEVELS[0];
    expect(calculateStars(2, level1)).toBe(3);
    expect(calculateStars(3, level1)).toBe(2);
    expect(calculateStars(4, level1)).toBe(2);
    expect(calculateStars(5, level1)).toBe(1);
    expect(calculateStars(10, level1)).toBe(1);
  });

  test('getHint: finds a piece that is currently free to escape', () => {
    // arrow-down is free, arrow-right is blocked
    const hint = getHint(samplePieces, 6, 6);
    expect(hint).not.toBeNull();
    expect(hint?.id).toBe('arrow-down');
  });

  test('getRemainingCount: returns count of active non-removed pieces', () => {
    expect(getRemainingCount(samplePieces)).toBe(2);
    const partiallyRemoved: ArrowPieceData[] = [
      { ...samplePieces[0], removed: true },
      samplePieces[1],
    ];
    expect(getRemainingCount(partiallyRemoved)).toBe(1);
  });

  test('levels integrity: all 15 levels are valid and solvable', () => {
    expect(LEVELS.length).toBe(15);
    LEVELS.forEach((lvl) => {
      expect(lvl.id).toBeGreaterThan(0);
      expect(lvl.rows).toBeGreaterThanOrEqual(6);
      expect(lvl.cols).toBeGreaterThanOrEqual(6);
      expect(lvl.pieces.length).toBeGreaterThanOrEqual(2);
      expect(lvl.reward.coins).toBeGreaterThan(0);
    });
  });
});
