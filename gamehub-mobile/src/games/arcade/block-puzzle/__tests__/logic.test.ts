// ============================================================
// Block Blast — Engine Logic Unit Tests
// ============================================================

import {
  createEmptyGrid,
  canPlacePiece,
  canPieceFitAnywhere,
  canAnyPieceFitOnGrid,
  placePieceOnGrid,
  detectAndClearLines,
  calculateMoveScore,
  generateSmartPieceBatch,
  GRID_DIM,
} from '../logic';
import { createShapePiece, SHAPE_DEFINITIONS } from '../shapes';

describe('Block Blast Logic Engine', () => {
  it('creates an empty 8x8 grid', () => {
    const grid = createEmptyGrid();
    expect(grid.length).toBe(GRID_DIM);
    expect(grid[0].length).toBe(GRID_DIM);
    expect(grid.every((row) => row.every((cell) => !cell.filled))).toBe(true);
  });

  it('validates legal and illegal piece placements', () => {
    const grid = createEmptyGrid();
    const square2x2 = [
      [true, true],
      [true, true],
    ];

    // Legal placement at (0, 0)
    expect(canPlacePiece(grid, square2x2, 0, 0)).toBe(true);

    // Legal placement at (6, 6)
    expect(canPlacePiece(grid, square2x2, 6, 6)).toBe(true);

    // Illegal placement exceeding boundary at (7, 7)
    expect(canPlacePiece(grid, square2x2, 7, 7)).toBe(false);

    // Fill cell (0, 0) and check overlap collision
    grid[0][0].filled = true;
    expect(canPlacePiece(grid, square2x2, 0, 0)).toBe(false);
  });

  it('correctly clears a full horizontal row and vertical column simultaneously', () => {
    let grid = createEmptyGrid();

    // Fill entire row 3 except (3, 3)
    for (let c = 0; c < GRID_DIM; c++) {
      grid[3][c] = { filled: true, colorKey: 'amber' };
    }
    // Fill entire col 3 except (3, 3)
    for (let r = 0; r < GRID_DIM; r++) {
      grid[r][3] = { filled: true, colorKey: 'cyan' };
    }

    // Now both row 3 and col 3 are completely filled
    const clearResult = detectAndClearLines(grid);
    expect(clearResult.linesCleared).toBe(2);
    expect(clearResult.clearedRows).toContain(3);
    expect(clearResult.clearedCols).toContain(3);

    // Cleared cells in newGrid should now be empty
    expect(clearResult.newGrid[3][3].filled).toBe(false);
    expect(clearResult.newGrid[3][0].filled).toBe(false);
    expect(clearResult.newGrid[0][3].filled).toBe(false);
  });

  it('calculates combo score and streak titles properly', () => {
    // 0 lines cleared (just 4-cell tetromino placement)
    const move0 = calculateMoveScore(4, 0, 0);
    expect(move0.pointsEarned).toBe(4);
    expect(move0.bonusPoints).toBe(0);

    // 1 line clear, streak 1
    const move1 = calculateMoveScore(4, 1, 1);
    expect(move1.pointsEarned).toBe(104); // 4 + 100

    // 2 lines clear (double blast), streak 2
    const move2 = calculateMoveScore(4, 2, 2);
    // lineBase = 2 * 100 + 100 = 300; streakBonus = 300 * 1 * 0.5 = 150; total = 4 + 300 + 150 = 454
    expect(move2.pointsEarned).toBe(454);
    expect(move2.comboTitle).toContain('COMBO x2');
  });

  it('generates a batch of 3 pieces where at least one is placeable', () => {
    const grid = createEmptyGrid();
    const batch = generateSmartPieceBatch(grid);
    expect(batch.length).toBe(3);
    expect(canAnyPieceFitOnGrid(grid, batch)).toBe(true);
  });
});
