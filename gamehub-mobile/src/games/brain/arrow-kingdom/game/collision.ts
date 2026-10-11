// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Collision Detection
// ============================================================

import type { ArrowPieceData, Cell, Direction } from './types';

export const vectors: Record<Direction, Cell> = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
};

/**
 * Returns a Set of occupied coordinate keys "row:col" for all active pieces,
 * excluding the optional excludeId.
 */
export function getOccupiedCells(
  pieces: ArrowPieceData[],
  excludeId?: string
): Set<string> {
  const occupied = new Set<string>();

  pieces.forEach((piece) => {
    if (piece.removed || piece.id === excludeId) {
      return;
    }

    piece.cells.forEach((cell) => {
      occupied.add(`${cell.row}:${cell.col}`);
    });
  });

  return occupied;
}

/**
 * Returns true if the coordinate is within grid bounds.
 */
export function isCellInside(row: number, col: number, rows: number, cols: number): boolean {
  return row >= 0 && row < rows && col >= 0 && col < cols;
}

/**
 * Returns the arrowhead cell (typically the last cell in the array).
 */
export function getArrowHead(piece: ArrowPieceData): Cell {
  return piece.cells[piece.cells.length - 1];
}
