// ============================================================
// GameHub — Block Puzzle Pure Logic
// ============================================================

import type { BlockGrid, ShapePiece } from './types';

export const GRID_DIM = 8;

export function createEmptyGrid(dim = GRID_DIM): BlockGrid {
  return Array.from({ length: dim }, () => Array(dim).fill(false));
}

export function generateRandomPiece(id: number): ShapePiece {
  const shapes: boolean[][][] = [
    [[true, true]], // 1x2 bar
    [[true], [true]], // 2x1 bar
    [[true, true], [true, true]], // 2x2 square
    [[true, true, true]], // 1x3 bar
    [[true, false], [true, true]], // L shape
  ];

  const colors = ['#6C5CE7', '#FF6B6B', '#00D2A0', '#FDCB6E', '#3B82F6'];

  const idx = Math.floor(Math.random() * shapes.length);
  return {
    id,
    matrix: shapes[idx],
    color: colors[idx % colors.length],
  };
}

export function canPlacePiece(grid: BlockGrid, shape: boolean[][], startRow: number, startCol: number): boolean {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const gridR = startRow + r;
        const gridC = startCol + c;

        if (gridR >= GRID_DIM || gridC >= GRID_DIM) return false;
        if (grid[gridR][gridC]) return false; // Cell already occupied
      }
    }
  }
  return true;
}

export function placePieceAndClearLines(grid: BlockGrid, shape: boolean[][], startRow: number, startCol: number): {
  newGrid: BlockGrid;
  linesCleared: number;
} {
  const newGrid = grid.map((row) => [...row]);

  // Place piece
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        newGrid[startRow + r][startCol + c] = true;
      }
    }
  }

  // Find full rows and columns
  const fullRows: number[] = [];
  const fullCols: number[] = [];

  for (let r = 0; r < GRID_DIM; r++) {
    if (newGrid[r].every((cell) => cell)) fullRows.push(r);
  }

  for (let c = 0; c < GRID_DIM; c++) {
    if (newGrid.every((row) => row[c])) fullCols.push(c);
  }

  // Clear full rows
  for (const r of fullRows) {
    for (let c = 0; c < GRID_DIM; c++) newGrid[r][c] = false;
  }

  // Clear full cols
  for (const c of fullCols) {
    for (let r = 0; r < GRID_DIM; r++) newGrid[r][c] = false;
  }

  const linesCleared = fullRows.length + fullCols.length;
  return { newGrid, linesCleared };
}
