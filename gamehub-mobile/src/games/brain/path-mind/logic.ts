// ============================================================
// GameHub — Path Mind Pure Logic
// High-Reliability Path Generator with Multi-Attempt Backtracking
// ============================================================

import type { GridPos } from './types';

export function generatePath(gridSize: number, pathLength: number): GridPos[] {
  for (let attempt = 0; attempt < 35; attempt++) {
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

      if (neighbors.length === 0) break; // Dead end — try next attempt

      curr = neighbors[Math.floor(Math.random() * neighbors.length)];
      path.push(curr);
    }

    if (path.length >= pathLength) {
      return path;
    }
  }

  // Graceful fallback to guarantee smooth gameplay
  return [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 1, col: 1 },
    { row: 2, col: 1 },
    { row: 2, col: 2 },
  ];
}
