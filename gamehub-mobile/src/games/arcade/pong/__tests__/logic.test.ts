// ============================================================
// Woodland Bubble Shooter — Physics & Level Engine Unit Tests
// ============================================================

import {
  HEX_COLS_EVEN,
  HEX_COLS_ODD,
  getRowColCount,
  getHexNeighbors,
  getCellCenter,
  createGridFromLevel,
  computeAimTrajectory,
  resolveShotImpact,
  findFloatingCells,
  getGridStats,
  checkLevelVictory,
  computeInitialCameraTopRow,
  updateCameraTopRow,
  pickPlayableBubbleColor,
} from '../logic';
import { HANDCRAFTED_LEVELS, generateBubbleLevel } from '../levels';
import type { BubbleLevelConfig } from '../types';

function makeTestLevel(rows: string[], goalType: 'clear_all' | 'rescue_fireflies' = 'clear_all'): BubbleLevelConfig {
  return {
    levelNumber: 999,
    worldIndex: 1,
    worldName: 'Test Woods',
    name: 'Test Board',
    subtitle: 'Unit test grid',
    goalType,
    maxShots: 20,
    starThresholds: [500, 1000, 1500],
    rows,
  };
}

describe('Woodland Bubble Shooter Engine', () => {
  it('computes accurate staggered hex columns and 6-neighbor parity', () => {
    expect(getRowColCount(0)).toBe(HEX_COLS_EVEN);
    expect(getRowColCount(1)).toBe(HEX_COLS_ODD);

    const evenCenter = getHexNeighbors(2, 4, 6);
    expect(evenCenter).toEqual(
      expect.arrayContaining([
        { row: 2, col: 3 },
        { row: 2, col: 5 },
        { row: 1, col: 3 },
        { row: 1, col: 4 },
        { row: 3, col: 3 },
        { row: 3, col: 4 },
      ])
    );

    const oddCenter = getHexNeighbors(1, 4, 6);
    expect(oddCenter).toEqual(
      expect.arrayContaining([
        { row: 1, col: 3 },
        { row: 1, col: 5 },
        { row: 0, col: 4 },
        { row: 0, col: 5 },
        { row: 2, col: 4 },
        { row: 2, col: 5 },
      ])
    );
  });

  it('traces wall-bounce bank shot rays and locates valid hex snap slot', () => {
    const grid = createGridFromLevel(
      makeTestLevel(['RRGGBBYYRR', '.........'])
    );
    const boardWidth = 340;
    const bubbleDiameter = boardWidth / HEX_COLS_EVEN;
    const originX = boardWidth / 2;
    const originY = 440;

    // Angled sharply left so it bounces cleanly off the left wooden pillar
    const ray = computeAimTrajectory(
      grid,
      originX,
      originY,
      -Math.PI * 0.78,
      boardWidth,
      bubbleDiameter,
      0
    );

    expect(ray.points.length).toBeGreaterThanOrEqual(3);
    expect(ray.snapCoord).not.toBeNull();
    if (ray.snapCoord) {
      expect(grid[ray.snapCoord.row]?.[ray.snapCoord.col]).toBeNull();
    }
  });

  it('pops 3+ matching connected color cluster cleanly', () => {
    const grid = createGridFromLevel(
      makeTestLevel(['RR........', '.........'])
    );
    const res = resolveShotImpact(grid, { row: 1, col: 0 }, 'red', 'normal', 0);

    expect(res.poppedCells.length).toBe(3);
    expect(res.nextGrid[0][0]).toBeNull();
    expect(res.nextGrid[0][1]).toBeNull();
    expect(res.nextGrid[1][0]).toBeNull();
    expect(res.pointsEarned).toBeGreaterThanOrEqual(30);
  });

  it('triggers floating island avalanche drop including Iron Spiked Stones and rescued fireflies', () => {
    // Row 0 has two red anchors holding a green bubble, an Iron Stone (X), and a green firefly (g)
    const grid = createGridFromLevel(
      makeTestLevel(
        [
          'RR........',
          'G........',
          'Xg........',
        ],
        'rescue_fireflies'
      )
    );

    // Pop the row 0 red anchor -> everything beneath should lose ceiling support and drop!
    const res = resolveShotImpact(grid, { row: 1, col: 1 }, 'red', 'normal', 1);

    expect(res.poppedCells.length).toBe(3);
    expect(res.droppedCells.length).toBe(3);
    expect(res.stonesCleared).toBe(1);
    expect(res.rescuedCount).toBe(1);
    expect(getGridStats(res.nextGrid).totalOccupied).toBe(0);
    expect(checkLevelVictory(res.nextGrid, makeTestLevel([], 'rescue_fireflies'))).toBe(true);
  });

  it('detects anchored vs unanchored cells accurately with findFloatingCells', () => {
    const grid = createGridFromLevel(
      makeTestLevel([
        'B.........',
        '.........',
        '..GG......',
      ])
    );
    const floating = findFloatingCells(grid);
    expect(floating).toHaveLength(2);
    expect(floating).toEqual(
      expect.arrayContaining([
        { row: 2, col: 2 },
        { row: 2, col: 3 },
      ])
    );
  });

  it('resolves Fireball radius blast, Lightning horizontal row blast, and Rainbow prism blast', () => {
    // 1. Fireball destroys surrounding bubbles & Iron Stones
    const fireGrid = createGridFromLevel(
      makeTestLevel(['RRRBBB....', 'XXBB.....'])
    );
    const fireRes = resolveShotImpact(fireGrid, { row: 1, col: 2 }, 'gold', 'fireball', 0);
    expect(fireRes.poppedCells.length).toBeGreaterThanOrEqual(4);
    expect(fireRes.stonesCleared).toBeGreaterThanOrEqual(1);
    expect(fireRes.calloutText).toBe('FIREBALL!');

    // 2. Lightning zaps full horizontal row including Iron Stones
    const boltGrid = createGridFromLevel(
      makeTestLevel(['RRRRRRRRRR', 'RXBXYXTXO', '.........'])
    );
    const boltRes = resolveShotImpact(boltGrid, { row: 1, col: 4 }, 'blue', 'lightning', 0);
    expect(boltRes.poppedCells.length).toBeGreaterThanOrEqual(9);
    expect(boltRes.stonesCleared).toBe(4);
    expect(boltRes.calloutText).toBe('LIGHTNING!');

    // 3. Rainbow prism pops all touching color clusters at once
    const prismGrid = createGridFromLevel(
      makeTestLevel(['RRRBBB....', '.........'])
    );
    const prismRes = resolveShotImpact(prismGrid, { row: 1, col: 2 }, 'gold', 'rainbow', 0);
    expect(prismRes.poppedCells.length).toBe(7); // 3 red + 3 blue + rainbow orb
    expect(prismRes.calloutText).toBe('PRISM BLAST!');
  });

  it('handles tall grid camera auto-scroll and active playable color picking', () => {
    const level9 = HANDCRAFTED_LEVELS[8]; // 10 rows
    const grid = createGridFromLevel(level9);
    const camTop = computeInitialCameraTopRow(grid);
    expect(camTop).toBeGreaterThanOrEqual(1);

    const pCenter = getCellCenter(0, 0, 32, camTop);
    expect(pCenter.y).toBeLessThan(16);

    const scrolledBack = updateCameraTopRow(
      createGridFromLevel(makeTestLevel(['RRRR......'])),
      camTop
    );
    expect(scrolledBack).toBe(0);

    const chosenColor = pickPlayableBubbleColor(
      createGridFromLevel(makeTestLevel(['TTT.......']))
    );
    expect(chosenColor).toBe('teal');
  });

  it('validates all 20 handcrafted levels and unlimited procedural levels (21..500)', () => {
    expect(HANDCRAFTED_LEVELS.length).toBe(20);

    for (let lvl = 1; lvl <= 500; lvl += lvl < 25 ? 1 : 23) {
      const cfg = generateBubbleLevel(lvl);
      const grid = createGridFromLevel(cfg);
      const stats = getGridStats(grid);

      expect(cfg.levelNumber).toBe(lvl);
      expect(cfg.maxShots).toBeGreaterThanOrEqual(20);
      expect(stats.normalCount).toBeGreaterThan(0);

      // Row 0 must never place an unbreakable Stone blocker directly on ceiling
      expect(grid[0].every((cell) => cell?.kind !== 'stone')).toBe(true);

      // Rescue levels must contain at least 1 trapped firefly
      if (cfg.goalType === 'rescue_fireflies') {
        expect(stats.fireflyCount).toBeGreaterThan(0);
      }

      // Every initial puzzle island must be validly grounded from Row 0
      expect(findFloatingCells(grid).length).toBe(0);
    }
  });
});
