// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Game Engine & Rules Logic
// ============================================================

import type { ArrowPieceData, Cell, Direction, GameLevel } from './types';
import { vectors, getOccupiedCells, isOutside } from './collision';

export interface CanExitResult {
  canExit: boolean;
  distance: number;
  blockedCell?: Cell;
}

export interface MoveResult {
  type: 'escaped' | 'blocked';
  blockedCell?: Cell;
  distanceToExit?: number;
}

/**
 * Checks if the entire winding arrow object can travel in its arrowhead direction
 * and completely exit the board without colliding with any other active pieces.
 * At each simulation step, the whole arrow is translated by its direction vector.
 * If any cell of the translated arrow intersects with an occupied cell, the move is blocked.
 */
export function canExitBoard(
  piece: ArrowPieceData,
  pieces: ArrowPieceData[],
  rows: number,
  cols: number
): CanExitResult {
  if (piece.removed) {
    return { canExit: false, distance: 0 };
  }

  const vector = vectors[piece.direction];
  const occupied = getOccupiedCells(pieces, piece.id);

  let translated = piece.cells.map((cell) => ({ ...cell }));
  let distance = 0;
  const maxIterations = Math.max(rows, cols) + 6;

  while (!translated.every((cell) => isOutside(cell, rows, cols)) && distance < maxIterations) {
    distance++;
    translated = translated.map((cell) => ({
      row: cell.row + vector.row,
      col: cell.col + vector.col,
    }));

    for (const cell of translated) {
      if (isOutside(cell, rows, cols)) {
        continue;
      }
      if (occupied.has(`${cell.row}:${cell.col}`)) {
        return {
          canExit: false,
          distance: 0,
          blockedCell: { row: cell.row, col: cell.col },
        };
      }
    }
  }

  return {
    canExit: true,
    distance,
  };
}

/**
 * Performs attemptMove using whole-arrow exit simulation.
 */
export function attemptMove(
  selected: ArrowPieceData,
  pieces: ArrowPieceData[],
  rows: number,
  cols: number
): MoveResult {
  const result = canExitBoard(selected, pieces, rows, cols);
  if (!result.canExit) {
    return {
      type: 'blocked',
      blockedCell: result.blockedCell,
    };
  }
  return {
    type: 'escaped',
    distanceToExit: result.distance,
  };
}

/**
 * Returns true if all arrow pieces have escaped.
 */
export function isLevelComplete(pieces: ArrowPieceData[]): boolean {
  return pieces.length > 0 && pieces.every((p) => p.removed);
}

/**
 * Computes 1 to 3 stars based on move count and level thresholds.
 */
export function calculateStars(moves: number, level: GameLevel): number {
  if (moves <= level.threeStarMoves) {
    return 3;
  }
  if (moves <= level.twoStarMoves) {
    return 2;
  }
  return 1;
}

/**
 * Finds an arrow piece that is currently free to slide out of the board.
 * Used for the in-game Hint button.
 */
export function getHint(
  pieces: ArrowPieceData[],
  rows: number,
  cols: number
): ArrowPieceData | null {
  for (const piece of pieces) {
    if (!piece.removed) {
      const result = attemptMove(piece, pieces, rows, cols);
      if (result.type === 'escaped') {
        return piece;
      }
    }
  }
  return null;
}

/**
 * Returns the count of remaining active arrows on the board.
 */
export function getRemainingCount(pieces: ArrowPieceData[]): number {
  return pieces.filter((p) => !p.removed).length;
}
