// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Game Engine & Rules Logic
// ============================================================

import type { ArrowPieceData, Cell, Direction, GameLevel } from './types';
import { vectors, getOccupiedCells, isCellInside, getArrowHead } from './collision';

export interface MoveResult {
  type: 'escaped' | 'blocked';
  blockedCell?: Cell;
  distanceToExit?: number;
}

/**
 * Checks if an arrow can escape the board in its arrowhead direction.
 * The arrow moves strictly along its direction vector until completely outside the grid.
 * If any cell along its forward path hits another active piece, the move is blocked.
 */
export function attemptMove(
  selected: ArrowPieceData,
  pieces: ArrowPieceData[],
  rows: number,
  cols: number
): MoveResult {
  if (selected.removed) {
    return { type: 'blocked' };
  }

  const vector = vectors[selected.direction];
  const occupied = getOccupiedCells(pieces, selected.id);
  const head = getArrowHead(selected);

  // Cast ray forward from arrowhead until outside the grid
  let currRow = head.row + vector.row;
  let currCol = head.col + vector.col;
  let steps = 0;

  while (isCellInside(currRow, currCol, rows, cols)) {
    steps++;
    const key = `${currRow}:${currCol}`;
    if (occupied.has(key)) {
      return {
        type: 'blocked',
        blockedCell: { row: currRow, col: currCol },
      };
    }
    currRow += vector.row;
    currCol += vector.col;
  }

  // Also check if any other body cell moving forward encounters a blocker
  // (e.g. for wide or L-shaped arrows with trailing segments)
  const maxDimension = Math.max(rows, cols) + 2;
  for (let step = 1; step <= maxDimension; step++) {
    for (const cell of selected.cells) {
      const nextR = cell.row + vector.row * step;
      const nextC = cell.col + vector.col * step;

      // Only check cells that are still inside the grid
      if (isCellInside(nextR, nextC, rows, cols)) {
        if (occupied.has(`${nextR}:${nextC}`)) {
          return {
            type: 'blocked',
            blockedCell: { row: nextR, col: nextC },
          };
        }
      }
    }
  }

  return {
    type: 'escaped',
    distanceToExit: steps + 1,
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
