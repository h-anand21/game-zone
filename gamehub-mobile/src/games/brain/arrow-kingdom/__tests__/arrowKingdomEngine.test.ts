// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Unit Tests
// Verifies collision detection, ray-casting escape, star scoring & hint solver
// ============================================================

import { attemptMove, isLevelComplete, calculateStars, getHint, getRemainingCount, canExitBoard } from '../game/engine';
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
    expect(calculateStars(level1.threeStarMoves, level1)).toBe(3);
    expect(calculateStars(level1.twoStarMoves, level1)).toBe(2);
    expect(calculateStars(level1.twoStarMoves + 2, level1)).toBe(1);
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

  test('levels integrity: starter levels are valid and solvable', () => {
    expect(LEVELS.length).toBeGreaterThanOrEqual(10);
    LEVELS.forEach((lvl) => {
      expect(lvl.id).toBeGreaterThan(0);
      expect(lvl.rows).toBeGreaterThanOrEqual(6);
      expect(lvl.cols).toBeGreaterThanOrEqual(6);
      expect(lvl.pieces.length).toBeGreaterThanOrEqual(6);
      expect(lvl.reward.coins).toBeGreaterThan(0);
      expect(lvl.hiddenSymbol).toBeDefined();

      // Verify level is 100% solvable without deadlocks
      let pieces = lvl.pieces.map((p) => ({ ...p, removed: false }));
      while (pieces.some((p) => !p.removed)) {
        const free = pieces.find(
          (p) => !p.removed && canExitBoard(p, pieces, lvl.rows, lvl.cols).canExit
        );
        expect(free).toBeDefined();
        if (free) free.removed = true;
      }
      expect(isLevelComplete(pieces)).toBe(true);
    });
  });

  describe('Procedural Endless Generation & Worlds', () => {
    it('generates solvable levels beyond level 10 instantaneously', () => {
      const { getLevel, getAllAvailableLevels } = require('../data/levels');
      const testLevelIds = [11, 15, 20, 25, 30];

      testLevelIds.forEach((id) => {
        const start = Date.now();
        const lvl = getLevel(id);
        const elapsed = Date.now() - start;

        expect(elapsed).toBeLessThan(50); // Instant generation (<50ms)
        expect(lvl.id).toBe(id);
        expect(lvl.pieces.length).toBeGreaterThanOrEqual(6);

        // Verify full solvability
        let pieces = lvl.pieces.map((p: any) => ({ ...p, removed: false }));
        let iterations = 0;
        while (pieces.some((p: any) => !p.removed) && iterations < 50) {
          iterations++;
          const free = pieces.find(
            (p: any) => !p.removed && canExitBoard(p, pieces, lvl.rows, lvl.cols).canExit
          );
          expect(free).toBeDefined();
          if (free) free.removed = true;
        }
        expect(isLevelComplete(pieces)).toBe(true);
      });

      const list = getAllAvailableLevels(25);
      expect(list.length).toBe(25);
    });
  });
});

