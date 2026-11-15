// ============================================================
// GameHub — Block Blast Pure Logic Engine
// ============================================================

import type { BlockGrid, ShapePiece, ClearResult } from './types';
import { SHAPE_DEFINITIONS, createShapePiece, RawShapeDef } from './shapes';

export const GRID_DIM = 8;

/**
 * Creates an empty 8x8 BlockGrid.
 */
export function createEmptyGrid(dim = GRID_DIM): BlockGrid {
  return Array.from({ length: dim }, () =>
    Array.from({ length: dim }, () => ({
      filled: false,
    }))
  );
}

/**
 * Calculates current grid occupancy ratio (0.0 to 1.0).
 */
export function calculateBoardOccupancy(grid: BlockGrid): number {
  let filledCount = 0;
  const total = GRID_DIM * GRID_DIM;
  for (let r = 0; r < GRID_DIM; r++) {
    for (let c = 0; c < GRID_DIM; c++) {
      if (grid[r]?.[c]?.filled) filledCount++;
    }
  }
  return filledCount / total;
}

/**
 * Validates if a piece matrix can be placed at (startRow, startCol).
 */
export function canPlacePiece(
  grid: BlockGrid,
  shapeMatrix: boolean[][],
  startRow: number,
  startCol: number
): boolean {
  if (startRow < 0 || startCol < 0) return false;

  for (let r = 0; r < shapeMatrix.length; r++) {
    for (let c = 0; c < shapeMatrix[r].length; c++) {
      if (shapeMatrix[r][c]) {
        const gridR = startRow + r;
        const gridC = startCol + c;

        if (gridR >= GRID_DIM || gridC >= GRID_DIM) return false;
        if (grid[gridR]?.[gridC]?.filled) return false;
      }
    }
  }
  return true;
}

/**
 * Checks whether a given shape matrix can fit anywhere on the current 8x8 grid.
 */
export function canPieceFitAnywhere(grid: BlockGrid, shapeMatrix: boolean[][]): boolean {
  const shapeRows = shapeMatrix.length;
  const shapeCols = Math.max(...shapeMatrix.map((row) => row.length));

  for (let r = 0; r <= GRID_DIM - shapeRows; r++) {
    for (let c = 0; c <= GRID_DIM - shapeCols; c++) {
      if (canPlacePiece(grid, shapeMatrix, r, c)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Checks if ANY of the player's available pieces in the tray can fit on the board.
 * If false, it's Game Over!
 */
export function canAnyPieceFitOnGrid(grid: BlockGrid, availablePieces: ShapePiece[]): boolean {
  if (availablePieces.length === 0) return true;
  for (const piece of availablePieces) {
    if (canPieceFitAnywhere(grid, piece.matrix)) {
      return true;
    }
  }
  return false;
}

/**
 * Places a piece onto the grid and returns a new grid clone.
 */
export function placePieceOnGrid(
  grid: BlockGrid,
  piece: ShapePiece,
  startRow: number,
  startCol: number
): BlockGrid {
  const newGrid: BlockGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

  for (let r = 0; r < piece.matrix.length; r++) {
    for (let c = 0; c < piece.matrix[r].length; c++) {
      if (piece.matrix[r][c]) {
        const gridR = startRow + r;
        const gridC = startCol + c;
        if (gridR < GRID_DIM && gridC < GRID_DIM) {
          newGrid[gridR][gridC] = {
            filled: true,
            colorKey: piece.colorKey,
          };
        }
      }
    }
  }

  return newGrid;
}

/**
 * Detects full rows & columns, marks them for clearing, and returns the updated grid.
 * Handles dual-axis clears (crossing row + col).
 */
export function detectAndClearLines(grid: BlockGrid): ClearResult {
  const newGrid: BlockGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

  const clearedRows: number[] = [];
  const clearedCols: number[] = [];

  // Check horizontal rows
  for (let r = 0; r < GRID_DIM; r++) {
    if (newGrid[r].every((cell) => cell.filled)) {
      clearedRows.push(r);
    }
  }

  // Check vertical columns
  for (let c = 0; c < GRID_DIM; c++) {
    let colFull = true;
    for (let r = 0; r < GRID_DIM; r++) {
      if (!newGrid[r][c].filled) {
        colFull = false;
        break;
      }
    }
    if (colFull) {
      clearedCols.push(c);
    }
  }

  // Collect unique cleared cells for particle bursts & clearing animation
  const clearedCoordsMap = new Map<string, { row: number; col: number; colorKey?: any }>();

  for (const r of clearedRows) {
    for (let c = 0; c < GRID_DIM; c++) {
      clearedCoordsMap.set(`${r},${c}`, {
        row: r,
        col: c,
        colorKey: newGrid[r][c].colorKey,
      });
      newGrid[r][c] = { filled: false };
    }
  }

  for (const c of clearedCols) {
    for (let r = 0; r < GRID_DIM; r++) {
      clearedCoordsMap.set(`${r},${c}`, {
        row: r,
        col: c,
        colorKey: newGrid[r][c].colorKey,
      });
      newGrid[r][c] = { filled: false };
    }
  }

  const linesCleared = clearedRows.length + clearedCols.length;

  return {
    newGrid,
    linesCleared,
    clearedRows,
    clearedCols,
    clearedCellCoordinates: Array.from(clearedCoordsMap.values()),
  };
}

/**
 * Computes the score and title for a move including consecutive combo streaks.
 */
export function calculateMoveScore(
  cellCount: number,
  linesCleared: number,
  comboStreak: number
): { pointsEarned: number; bonusPoints: number; comboTitle?: string } {
  const basePlacementPoints = cellCount;

  if (linesCleared === 0) {
    return {
      pointsEarned: basePlacementPoints,
      bonusPoints: 0,
    };
  }

  // Multi-line scaling: 1 line = 100, 2 lines = 300, 3 lines = 600, 4 lines = 1000
  const lineBase = linesCleared * 100 + (linesCleared > 1 ? (linesCleared - 1) * 100 : 0);

  // Consecutive streak multiplier: (streak - 1) * 50%
  const streakBonus = Math.round(lineBase * Math.max(0, comboStreak - 1) * 0.5);
  const totalPoints = basePlacementPoints + lineBase + streakBonus;

  // Title generation
  let comboTitle = 'LINE CLEAR!';
  if (comboStreak > 1) {
    if (comboStreak === 2) comboTitle = 'COMBO x2! GREAT!';
    else if (comboStreak === 3) comboTitle = 'COMBO x3! AWESOME!';
    else if (comboStreak === 4) comboTitle = 'COMBO x4! SUPER!';
    else if (comboStreak === 5) comboTitle = 'COMBO x5! UNBELIEVABLE!';
    else comboTitle = `COMBO x${comboStreak}! GODLIKE!`;
  } else if (linesCleared === 2) {
    comboTitle = 'DOUBLE BLAST!';
  } else if (linesCleared >= 3) {
    comboTitle = 'MEGA BLAST!';
  }

  return {
    pointsEarned: totalPoints,
    bonusPoints: lineBase + streakBonus,
    comboTitle,
  };
}

/**
 * Smart weighted piece generator for Block Blast.
 * Adjusts shape pool dynamically according to board density and guarantees playability.
 */
export function generateSmartPieceBatch(grid: BlockGrid): ShapePiece[] {
  const occupancy = calculateBoardOccupancy(grid);

  // Filter shapes based on occupancy
  let pool = SHAPE_DEFINITIONS;

  if (occupancy > 0.6) {
    // When board is crowded (>60% full), prioritize easy/small rescue shapes
    pool = SHAPE_DEFINITIONS.filter((s) => s.difficulty !== 'hard');
  }

  // Weighted random pick helper
  const pickRandom = (defs: RawShapeDef[]): RawShapeDef => {
    const totalWeight = defs.reduce((sum, item) => sum + item.weight, 0);
    let rand = Math.random() * totalWeight;
    for (const item of defs) {
      if (rand < item.weight) return item;
      rand -= item.weight;
    }
    return defs[0];
  };

  const selectedDefs: RawShapeDef[] = [
    pickRandom(pool),
    pickRandom(pool),
    pickRandom(pool),
  ];

  // Guarantee playability: At least ONE piece must fit on the board
  const pieces: ShapePiece[] = selectedDefs.map((d, idx) =>
    createShapePiece(d, `piece-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`)
  );

  const hasPlayable = pieces.some((p) => canPieceFitAnywhere(grid, p.matrix));

  if (!hasPlayable) {
    // Find all shape definitions that can fit on this board
    const fittingDefs = SHAPE_DEFINITIONS.filter((d) => canPieceFitAnywhere(grid, d.matrix));
    if (fittingDefs.length > 0) {
      const rescueDef = pickRandom(fittingDefs);
      pieces[2] = createShapePiece(
        rescueDef,
        `piece-rescue-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
      );
    } else {
      // Extremely packed board fallback: Single dot piece
      const singleDot = SHAPE_DEFINITIONS.find((d) => d.shapeId === 'dot-1') || SHAPE_DEFINITIONS[0];
      pieces[2] = createShapePiece(
        singleDot,
        `piece-dot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
      );
    }
  }

  return pieces;
}

/**
 * Calculates snapped grid coordinate from screen touch point.
 */
export function calculateGridSnap(
  touchX: number,
  touchY: number,
  boardLayout: { x: number; y: number; width: number; height: number },
  cellSize: number,
  shapeMatrix: boolean[][]
): { row: number; col: number } | null {
  const relX = touchX - boardLayout.x;
  const relY = touchY - boardLayout.y;

  // Calculate top-left cell coordinate
  const col = Math.round(relX / cellSize);
  const row = Math.round(relY / cellSize);

  // Check bounds
  const shapeRows = shapeMatrix.length;
  const shapeCols = Math.max(...shapeMatrix.map((r) => r.length));

  if (row < 0 || col < 0 || row + shapeRows > GRID_DIM || col + shapeCols > GRID_DIM) {
    return null;
  }

  return { row, col };
}
