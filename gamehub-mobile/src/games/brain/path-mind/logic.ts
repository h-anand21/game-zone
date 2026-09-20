// ============================================================
// GameHub — Path Mind Pure Logic
// ============================================================

import type { GridPos } from './types';

export function generatePath(gridSize: number, pathLength: number): GridPos[] {
  const path: GridPos[] = [];
  let curr: GridPos = {
    row: Math.floor(Math.random() * gridSize),
    col: Math.floor(Math.random() * gridSize),
  };
  path.push(curr);

  while (path.length < pathLength) {
    const neighbors: GridPos[] = [
      { row: curr.row - 1, col: curr.col },
      { row: curr.row + 1, col: curr.col },
      { row: curr.row, col: curr.col - 1 },
      { row: curr.row, col: curr.col + 1 },
    ].filter(
      (pos) =>
        pos.row >= 0 &&
        pos.row < gridSize &&
        pos.col >= 0 &&
        pos.col < gridSize &&
        !path.some((p) => p.row === pos.row && p.col === pos.col)
    );

    if (neighbors.length === 0) break; // Dead end — restart path

    curr = neighbors[Math.floor(Math.random() * neighbors.length)];
    path.push(curr);
  }

  return path;
}
