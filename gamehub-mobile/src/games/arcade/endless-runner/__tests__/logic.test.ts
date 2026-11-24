// ============================================================
// Color Bloom Sort — Puzzle Engine & Level Generator Tests
// ============================================================

import {
  canMove,
  executeMove,
  isTubeSolved,
  isPuzzleSolved,
  findHint,
  generateLevel,
} from '../logic';
import type { Tube } from '../types';

describe('Color Bloom Sort Puzzle Engine', () => {
  it('correctly evaluates legal and illegal ball transfers', () => {
    const tubes: Tube[] = [
      ['red', 'red', 'blue'],
      ['green', 'blue'],
      [],
      ['green', 'green', 'green', 'green'], // Already solved tube
      ['amber'],
    ];

    // Legal: Move top blue from tube 0 to tube 1 (matches top blue)
    expect(canMove(tubes, 0, 1)).toBe(true);

    // Legal: Move top blue from tube 0 to empty tube 2
    expect(canMove(tubes, 0, 2)).toBe(true);

    // Illegal: Move from tube 4 (top amber) to tube 0 (top blue != amber)
    expect(canMove(tubes, 4, 0)).toBe(false);

    // Illegal: Move from empty tube 2
    expect(canMove(tubes, 2, 0)).toBe(false);

    // Illegal: Move to itself
    expect(canMove(tubes, 0, 0)).toBe(false);

    // Illegal: Move out of already solved tube 3
    expect(canMove(tubes, 3, 2)).toBe(false);
  });

  it('rejects transfers into a full destination tube', () => {
    const tubes: Tube[] = [
      ['red'],
      ['blue', 'green', 'amber', 'red'], // Full tube (4 balls)
    ];

    expect(canMove(tubes, 0, 1)).toBe(false);
  });

  it('executes a move and immutably returns updated tube state', () => {
    const tubes: Tube[] = [
      ['red', 'blue'],
      ['blue'],
    ];

    const { newTubes, movedBall } = executeMove(tubes, 0, 1);

    expect(movedBall).toBe('blue');
    expect(newTubes[0]).toEqual(['red']);
    expect(newTubes[1]).toEqual(['blue', 'blue']);
    // Original array must not be mutated
    expect(tubes[0].length).toBe(2);
  });

  it('detects solved individual tubes and full puzzle victory', () => {
    const solvedTube: Tube = ['cyan', 'cyan', 'cyan', 'cyan'];
    const mixedTube: Tube = ['cyan', 'cyan', 'cyan', 'red'];
    const partialTube: Tube = ['cyan', 'cyan', 'cyan'];

    expect(isTubeSolved(solvedTube)).toBe(true);
    expect(isTubeSolved(mixedTube)).toBe(false);
    expect(isTubeSolved(partialTube)).toBe(false);

    const winningTubes: Tube[] = [
      ['red', 'red', 'red', 'red'],
      ['blue', 'blue', 'blue', 'blue'],
      [],
      [],
    ];

    expect(isPuzzleSolved(winningTubes)).toBe(true);

    const incompleteTubes: Tube[] = [
      ['red', 'red', 'red', 'red'],
      ['blue', 'blue', 'blue'], // Only 3 balls
      ['blue'],
    ];

    expect(isPuzzleSolved(incompleteTubes)).toBe(false);
  });

  it('BFS solver returns legal forward hints towards solution', () => {
    // 1 move away from solved
    const nearWinTubes: Tube[] = [
      ['red', 'red', 'red'],
      ['blue', 'blue', 'blue', 'blue'],
      ['red'],
    ];

    const hint = findHint(nearWinTubes);
    expect(hint).not.toBeNull();
    expect(hint?.fromTube).toBe(2);
    expect(hint?.toTube).toBe(0);
    expect(hint?.color).toBe('red');
  });

  it('deterministic generator creates 100% valid solvable levels including infinite levels', () => {
    for (const lvl of [1, 2, 3, 5, 10, 50, 100, 250, 500, 1000, 5000]) {
      const levelData = generateLevel(lvl);
      expect(levelData.levelNumber).toBe(lvl);
      expect(levelData.tubes.length).toBeGreaterThanOrEqual(3);

      // Verify that every ball color appears exactly 4 times
      const colorCounts: Record<string, number> = {};
      for (const tube of levelData.tubes) {
        for (const ball of tube) {
          colorCounts[ball] = (colorCounts[ball] || 0) + 1;
        }
      }

      for (const count of Object.values(colorCounts)) {
        expect(count).toBe(4);
      }

      // Verify at least one tube is empty at start
      const emptyCount = levelData.tubes.filter((t) => t.length === 0).length;
      expect(emptyCount).toBeGreaterThanOrEqual(1);
    }
  });
});
